import React, { useState, useRef } from 'react'
import Tutorial from './components/Tutorial'
import OMRSheet from './components/OMRSheet'
import PDFViewer from './components/PDFViewer'
import Timer from './components/Timer'
import Calculator from './components/Calculator'
import NotePad from './components/NotePad'
import './App.css'

function App() {
  const [showOMR, setShowOMR] = useState(true)
  const tutorialRef = useRef()

  const openTutorial = () => {
    if (tutorialRef.current) {
      tutorialRef.current.open()
    }
  }

  return (
    <>
      <Tutorial ref={tutorialRef} />
      <div className="app">
        <button 
          className="help-btn"
          onClick={openTutorial}
          title="사용 설명서 보기"
        >
          ❓
        </button>
        <button 
          className="omr-toggle-btn"
          onClick={() => setShowOMR(!showOMR)}
          title={showOMR ? 'OMR 숨기기' : 'OMR 보이기'}
        >
          {showOMR ? '▼ OMR 숨기기' : 'OMR 보이기 ▲'}
        </button>
        
        {showOMR && (
          <div className="omr-panel">
            <OMRSheet />
          </div>
        )}
        
        <div className="middle-panel">
          <PDFViewer />
        </div>
        <div className="right-panel">
          <div className="notepad-section">
            <NotePad />
          </div>
          <div className="calculator-section">
            <Calculator />
          </div>
        </div>
      </div>
    </>
  )
}

export default App

