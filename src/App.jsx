// 파일: src/App.jsx

import React, { useState, useRef } from 'react'
import Tutorial from './components/Tutorial'
import OMRSheet from './components/OMRSheet'
import PDFViewer from './components/PDFViewer'
import Timer from './components/Timer'
import Calculator from './components/Calculator'
import NotePad from './components/NotePad'
import LayoutNotification from './components/LayoutNotification'
import './App.css'

function App() {
  const [showOMR, setShowOMR] = useState(true)
  const tutorialRef = useRef()
  
  // 🟢 OMR 채점 모드 상태 추가
  const [isGrading, setIsGrading] = useState(false)

  const openTutorial = () => {
    if (tutorialRef.current) {
      tutorialRef.current.open()
    }
  }

  return (
    <>
      <Tutorial ref={tutorialRef} />
      <LayoutNotification />
      <div className="app">
        <button 
          className="help-btn"
          onClick={openTutorial}
          title="사용 설명서 보기"
        >
          ❓
        </button>
        <div className="middle-panel">
          <PDFViewer />
        </div>
        
        <div className="omr-container">
          {showOMR && (
            // 🟢 className을 isGrading 상태에 따라 동적으로 변경
            <div className={`omr-panel ${isGrading ? 'grading-mode' : ''}`}>
              {/* 🟢 OMRSheet에 상태 변경 함수를 prop으로 전달 */}
              <OMRSheet onGradingToggle={setIsGrading} />
            </div>
          )}
          
          <button 
            className="omr-toggle-btn"
            onClick={() => setShowOMR(!showOMR)}
            title={showOMR ? 'OMR 숨기기' : 'OMR 보이기'}
          >
            {showOMR ? '▼ OMR 숨기기' : 'OMR 보이기 ▲'}
          </button>
        </div>
        <div className="right-panel">
          <div className="timer-section">
            <Timer />
          </div>
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