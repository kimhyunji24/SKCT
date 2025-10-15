// 파일: src/components/PDFViewer.jsx

import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [loadProgress, setLoadProgress] = useState(0)

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
      setNumPages(null)
      setIsLoading(true)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
    setIsLoading(false)
  }

  const onDocumentLoadProgress = ({ loaded, total }) => {
    const progress = (loaded / total) * 100
    setLoadProgress(Math.round(progress))
  }
  
  const onDocumentLoadError = (error) => {
    alert('PDF 파일을 불러오는 데 실패했습니다.')
    console.error(error)
    setIsLoading(false)
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
        {isLoading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>PDF 파일을 불러오는 중입니다... {loadProgress}%</p>
          </div>
        )}

        {file ? (
          // 🟢 className을 동적으로 부여하여 CSS로 가시성을 제어
          <div className={`pdf-document-container ${isLoading ? 'loading' : 'loaded'}`}>
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
                />
              ))}
            </Document>
          </div>
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