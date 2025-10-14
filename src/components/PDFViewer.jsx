import React, { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import './PDFViewer.css'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

function PDFViewer() {
  const [file, setFile] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [scale, setScale] = useState(1.0) // PDF 크기 조정을 위한 스케일 상태
  
  // 🟢 키보드 단축키로 PDF 크기 조정
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + Plus/Minus 키 조합
      if ((event.ctrlKey || event.metaKey) && event.key === '=') {
        event.preventDefault()
        setScale(prev => Math.min(prev + 0.1, 3.0)) // 최대 3배까지
      } else if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault()
        setScale(prev => Math.max(prev - 0.1, 0.5)) // 최소 0.5배까지
      } else if ((event.ctrlKey || event.metaKey) && event.key === '0') {
        event.preventDefault()
        setScale(1.0) // 원본 크기로 리셋
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        <div className="pdf-controls">
          {file && (
            <div className="zoom-controls">
              <button onClick={() => setScale(prev => Math.max(prev - 0.1, 0.5))} className="zoom-btn">
                -
              </button>
              <span className="zoom-level">{Math.round(scale * 100)}%</span>
              <button onClick={() => setScale(prev => Math.min(prev + 0.1, 3.0))} className="zoom-btn">
                +
              </button>
              <button onClick={() => setScale(1.0)} className="zoom-reset">
                리셋
              </button>
            </div>
          )}
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
                 width={Math.min(window.innerWidth * 0.7 - 60, 800) * scale}
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