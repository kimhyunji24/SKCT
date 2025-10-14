import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

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

  // 스크롤로 페이지 전환
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.deltaY > 0) {
        // 아래로 스크롤 - 다음 페이지
        goToNextPage()
      } else if (e.deltaY < 0) {
        // 위로 스크롤 - 이전 페이지
        goToPrevPage()
      }
    }

    const pdfContent = document.querySelector('.pdf-content')
    if (pdfContent && file) {
      pdfContent.addEventListener('wheel', handleWheel, { passive: false })
      return () => pdfContent.removeEventListener('wheel', handleWheel)
    }
  }, [file, numPages, pageNumber])

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

