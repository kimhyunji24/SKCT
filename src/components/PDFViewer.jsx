import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { getPdfPageCount } from '../lib/pdfUtils'
import AuthModal from './AuthModal'
import PaymentModal from './PaymentModal'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

const FREE_PAGE_LIMIT = 100

function PDFViewer({ onHide, postPaymentData }) {
  const { user } = useAuth()

  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [isRendering, setIsRendering] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [renderedPagesCount, setRenderedPagesCount] = useState(0)
  const [scale, setScale] = useState(1.0)

  // 인증/결제 모달 상태
  const [showAuth, setShowAuth] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingFile, setPendingFile] = useState(null)
  const [pendingPageCount, setPendingPageCount] = useState(0)

  // 결제 완료 후 스토리지 URL로 PDF 로드
  useEffect(() => {
    if (postPaymentData?.storageUrl && postPaymentData?.fileName) {
      loadFromStorageUrl(postPaymentData.storageUrl, postPaymentData.fileName)
    }
  }, [postPaymentData])

  const loadFromStorageUrl = async (url, name) => {
    setIsRendering(true)
    setLoadProgress(0)
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const f = new File([blob], name, { type: 'application/pdf' })
      setFile(f)
      setNumPages(null)
      setScale(1.0)
      setRenderedPagesCount(0)
    } catch {
      alert('결제 후 파일을 불러오는데 실패했습니다.')
      setIsRendering(false)
    }
  }

  const onFileChange = async (event) => {
    const selectedFile = event.target.files[0]
    event.target.value = ''
    if (!selectedFile) return

    if (!user) {
      setPendingFile(selectedFile)
      setShowAuth(true)
      return
    }

    await processFile(selectedFile, user)
  }

  const handleAuthSuccess = async (loggedInUser) => {
    setShowAuth(false)
    if (pendingFile) {
      const fileToProcess = pendingFile
      setPendingFile(null)
      await processFile(fileToProcess, loggedInUser || user)
    }
  }

  const processFile = async (selectedFile, currentUser) => {
    setIsRendering(true)
    try {
      const pageCount = await getPdfPageCount(selectedFile)

      if (pageCount >= FREE_PAGE_LIMIT) {
        setPendingFile(selectedFile)
        setPendingPageCount(pageCount)
        setIsRendering(false)
        setShowPayment(true)
        return
      }

      // 무료 업로드: Supabase Storage에 저장 + DB 기록
      if (currentUser) {
        const path = `${currentUser.id}/${Date.now()}_${selectedFile.name}`
        const { error: uploadErr } = await supabase.storage
          .from('pdf-files')
          .upload(path, selectedFile)
        if (!uploadErr) {
          await supabase.from('pdf_uploads').insert({
            user_id: currentUser.id,
            file_name: selectedFile.name,
            storage_path: path,
            page_count: pageCount,
            file_size: selectedFile.size,
            is_paid: false,
          })
        }
      }

      setFile(selectedFile)
      setNumPages(null)
      setScale(1.0)
      setRenderedPagesCount(0)
      setLoadProgress(0)
    } catch {
      alert('PDF 처리 중 오류가 발생했습니다.')
      setIsRendering(false)
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    if (numPages === 0) setIsRendering(false)
  }

  const handlePageRenderSuccess = () => {
    setRenderedPagesCount(prev => prev + 1)
  }

  useEffect(() => {
    if (numPages && renderedPagesCount === numPages) {
      setIsRendering(false)
    }
  }, [renderedPagesCount, numPages])

  const onDocumentLoadProgress = ({ loaded, total }) => {
    setLoadProgress(Math.round((loaded / total) * 100))
  }

  const onDocumentLoadError = () => {
    alert('PDF 파일을 불러오는 데 실패했습니다.')
    setIsRendering(false)
  }

  const handleZoom = (newScale) => {
    if (!file) return
    setIsRendering(true)
    setRenderedPagesCount(0)
    setScale(newScale)
  }

  return (
    <div className="pdf-viewer">
      {showAuth && (
        <AuthModal
          onClose={() => { setShowAuth(false); setPendingFile(null) }}
          onSuccess={handleAuthSuccess}
        />
      )}
      {showPayment && pendingFile && (
        <PaymentModal
          file={pendingFile}
          pageCount={pendingPageCount}
          user={user}
          onClose={() => { setShowPayment(false); setPendingFile(null) }}
        />
      )}

      <div className="pdf-header">
        <h2>문제</h2>
        <button className="pdf-hide-btn" onClick={onHide} title="PDF 패널 숨기기">
          ◀ 숨기기
        </button>
        {file && (
          <div className="pdf-controls">
            <div className="zoom-controls">
              <button className="zoom-btn" onClick={() => handleZoom(scale - 0.1)} disabled={scale <= 0.5}>-</button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button className="zoom-btn" onClick={() => handleZoom(scale + 0.1)} disabled={scale >= 2.0}>+</button>
              <button className="zoom-reset" onClick={() => handleZoom(1.0)}>초기화</button>
            </div>
          </div>
        )}
        <label htmlFor="pdf-upload" className="upload-btn">
          PDF 업로드
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          id="pdf-upload"
          style={{ display: 'none' }}
        />
      </div>

      <div className="pdf-content">
        {isRendering && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            {loadProgress < 100 ? (
              <p>PDF 파일을 불러오는 중입니다... {loadProgress}%</p>
            ) : (
              <p>페이지를 표시하는 중입니다... ({renderedPagesCount}/{numPages})</p>
            )}
          </div>
        )}

        {file && (
          <div className={`pdf-document-container ${isRendering ? 'loading' : 'loaded'}`}>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadProgress={onDocumentLoadProgress}
              onLoadError={onDocumentLoadError}
              className="pdf-document"
            >
              {Array.from(new Array(numPages), (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  scale={scale}
                  className="pdf-page"
                  onRenderSuccess={handlePageRenderSuccess}
                />
              ))}
            </Document>
          </div>
        )}

        {!file && !isRendering && (
          <div className="pdf-placeholder">
            <p>PDF 파일을 업로드해주세요</p>
            {!user && (
              <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
                로그인 후 업로드 기록이 저장됩니다
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer
