// 파일: src/App.jsx

import React, { useState, useRef, useEffect } from 'react'
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
  
  // 🟢 창 폭이 30% 이하일 때 middle-panel 숨김 상태 추가
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)

  // 🟢 창 폭 감지 및 middle-panel 자동 숨김 기능
  useEffect(() => {
    const checkScreenWidth = () => {
      const windowWidth = window.innerWidth
      const screenWidth = window.screen.width
      const widthPercentage = (windowWidth / screenWidth) * 100
      
      // 디버깅을 위한 콘솔 로그
      // console.log(`창 폭: ${windowWidth}px, 화면 폭: ${screenWidth}px, 비율: ${widthPercentage.toFixed(1)}%`)
      
      // 방법 1: 화면 폭의 45% 기준
      const shouldHideByPercentage = widthPercentage <= 45
      
      // 방법 2: 절대 픽셀 값 기준 (예: 600px 이하)
      const shouldHideByPixels = windowWidth <= 700
      
      // 두 방법 중 하나라도 만족하면 숨김
      const shouldHide = shouldHideByPercentage || shouldHideByPixels
      
      // console.log(`비율 기준 숨김: ${shouldHideByPercentage}, 픽셀 기준 숨김: ${shouldHideByPixels}, 최종 숨김: ${shouldHide}`)
      setIsNarrowScreen(shouldHide)
    }

    // 초기 체크
    checkScreenWidth()

    // 창 크기 변경 이벤트 리스너 추가
    window.addEventListener('resize', checkScreenWidth)

    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      window.removeEventListener('resize', checkScreenWidth)
    }
  }, [])

  const openTutorial = () => {
    if (tutorialRef.current) {
      tutorialRef.current.open()
    }
  }

  return (
    <>
      <Tutorial ref={tutorialRef} />
      <LayoutNotification />
      <div className={`app ${isNarrowScreen ? 'narrow-screen' : ''}`}>
        <button 
          className="help-btn"
          onClick={openTutorial}
          title="사용 설명서 보기"
        >
          ❓
        </button>
        {!isNarrowScreen && (
          <div className="middle-panel">
            <PDFViewer />
          </div>
        )}
        
        {/* 🟢 창이 좁지 않을 때만 OMR 컨테이너 표시 */}
        {!isNarrowScreen && (
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
        )}
        {/* 🟢 middle-panel이 숨겨졌을 때 right-panel이 더 넓어지도록 클래스 추가 */}
        <div className={`right-panel ${isNarrowScreen ? 'expanded' : ''}`}>
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