import React, { useState, useEffect, useRef } from 'react' // useEffect와 useRef를 import 합니다.
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)
  
  // 🟢 스크롤 이벤트 처리를 위한 ref 추가
  const pdfContentRef = useRef(null)
  const isScrolling = useRef(false) // 스크롤 중복 방지 플래그

  // --- 기존 함수들 ---
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setPageNumber(1)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages))
  }

  // 🟢 스크롤 이벤트 핸들러 useEffect 추가
  useEffect(() => {
    const handleWheel = (event) => {
      if (!file || isScrolling.current) return

      // 스크롤 중복 실행 방지
      isScrolling.current = true
      
      if (event.deltaY < 0) { // 위로 스크롤
        goToPrevPage()
      } else { // 아래로 스크롤
        goToNextPage()
      }

      // 0.5초 후에 다시 스크롤 가능하도록 설정
      setTimeout(() => {
        isScrolling.current = false
      }, 500)
    }

    const pdfElement = pdfContentRef.current
    if (pdfElement) {
      pdfElement.addEventListener('wheel', handleWheel)
    }

    return () => {
      if (pdfElement) {
        pdfElement.removeEventListener('wheel', handleWheel)
      }
    }
  }, [file, numPages, pageNumber]) // 의존성 배열에 상태 추가

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h2>문제</h2>
        <input
          type="file"
          accept="application/pdf"
          onChange={onFileChange}
          id="pdf-upload"
          style={{ display: 'none' }}
        />
        <label htmlFor="pdf-upload" className="upload-btn">
          PDF 업로드
        </label>
      </div>
      
      {/* 🟢 ref를 div에 연결합니다 */}
      <div className="pdf-content" ref={pdfContentRef}>
        {file ? (
          <>
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              className="pdf-document"
            >
              <Page
                pageNumber={pageNumber}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                width={Math.min(window.innerWidth * 0.7 - 60, 800)}
              />
            </Document>
            
            {numPages && (
              <div className="pdf-controls">
                <button onClick={goToPrevPage} disabled={pageNumber <= 1}>
                  이전
                </button>
                <span className="page-info">
                  {pageNumber} / {numPages}
                </span>
                <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
                  다음
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="pdf-placeholder">
            <p>PDF 파일을 업로드해주세요</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer