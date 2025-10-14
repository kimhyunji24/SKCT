import React, { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  
  // 🟢 pageNumber와 페이지 이동 함수들 제거

  const onFileChange = (event) => {
    const selectedFile = event.target.files[0]
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile)
    } else {
      alert('PDF 파일만 업로드 가능합니다.')
    }
  }

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages)
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
        {file ? (
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className="pdf-document"
          >
            {/* 🟢 모든 페이지를 한 번에 렌더링하도록 수정 */}
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