// 파일: src/components/PDFViewer.jsx

import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [isRendering, setIsRendering] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)
  const [renderedPagesCount, setRenderedPagesCount] = useState(0)

  // 🟢 줌 레벨(scale)을 관리하는 상태 추가
  const [scale, setScale] = useState(1.0)

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
      setNumPages(null)
      setScale(1.0) // 새 파일 로드 시 줌 레벨 초기화
      setIsRendering(true)
      setRenderedPagesCount(0)
      setLoadProgress(0)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    if (numPages === 0) setIsRendering(false)
  }
  
  const handlePageRenderSuccess = () => {
    setRenderedPagesCount(prevCount => prevCount + 1);
  }

  useEffect(() => {
    if (numPages && renderedPagesCount === numPages) {
      setIsRendering(false);
    }
  }, [renderedPagesCount, numPages]);

  const onDocumentLoadProgress = ({ loaded, total }) => {
    const progress = Math.round((loaded / total) * 100)
    setLoadProgress(progress)
  }
  
  const onDocumentLoadError = (error) => {
    alert('PDF 파일을 불러오는 데 실패했습니다.')
    console.error(error)
    setIsRendering(false)
  }
  
  // 🟢 줌 처리 함수들 추가
  const handleZoom = (newScale) => {
    if (!file) return;
    setIsRendering(true); // 렌더링 시작
    setRenderedPagesCount(0); // 렌더링 카운터 초기화
    setScale(newScale);
  }

  return (
    <div className="pdf-viewer">
      <div className="pdf-header">
        <h2>문제</h2>
        {/* 🟢 줌 컨트롤 UI 추가 */}
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
              {Array.from(new Array(numPages), (el, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  // 🟢 width 대신 scale prop 사용
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
           </div>
        )}
      </div>
    </div>
  )
}

export default PDFViewer