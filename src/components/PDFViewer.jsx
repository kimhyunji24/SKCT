// 파일: src/components/PDFViewer.jsx

import React, { useState, useRef, useEffect } from 'react'
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
  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setNumPages(null)
      setIsRendering(true)
      renderedPagesCount.current = 0
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    if (numPages === 0) {
      setIsRendering(false);
    }
  }
  
  
  // 🟢 렌더링된 페이지 카운터만 증가시키는 역할
  const handlePageRenderSuccess = () => {
    setRenderedPagesCount(prevCount => prevCount + 1);
  }

  // 🟢 useEffect를 사용해 로딩 완료 시점 감지
  useEffect(() => {
    // numPages가 설정되었고, 모든 페이지가 렌더링되었는지 확인
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
      
      <div className="pdf-content">
        {isRendering && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            {/* 🟢 이 부분만 수정합니다 🟢 */}
            {loadProgress < 100 ? (
              <p>PDF 파일을 불러오는 중입니다... {loadProgress}%</p>
            ) : (
              <p>페이지를 표시하는 중입니다...</p>
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
                  width={Math.min(window.innerWidth * 0.7 - 60, 800)}
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