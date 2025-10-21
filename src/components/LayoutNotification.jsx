import React, { useState, useEffect } from 'react'
import './LayoutNotification.css'

function LayoutNotification() {
  const [showNotification, setShowNotification] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // localStorage에서 "앞으로 보지 않기" 설정 확인
    const dontShowAgain = localStorage.getItem('layout-notification-dismissed')
    
    if (!dontShowAgain) {
      // 1초 후에 알림 표시
      const timer = setTimeout(() => {
        setShowNotification(true)
        // 애니메이션을 위해 잠시 후에 visible 상태로 변경
        setTimeout(() => setIsVisible(true), 100)
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleDontShowAgain = () => {
    localStorage.setItem('layout-notification-dismissed', 'true')
    setIsVisible(false)
    setTimeout(() => setShowNotification(false), 300)
  }

  if (!showNotification) return null

  return (
    <div className={`layout-notification ${isVisible ? 'visible' : ''}`}>
      <div className="notification-content">
        <div className="notification-icon">🎉</div>
        <div className="notification-text">
          <h3>이렇게 바뀌었습니다!</h3>
          <p>실제 SKCT처럼 OMR 답안지가 PDF 뷰어 오른쪽으로 이동했습니다.</p>
          <p>채점 후 무슨 문제가 틀렸는지, 내가 적은 정답과 답을 확인할 수 있어요!</p>
        </div>
        <div className="notification-actions">
          <button 
            className="dont-show-btn"
            onClick={handleDontShowAgain}
            title="앞으로 이 알림을 보지 않기"
          >
            알림 그만 보기
          </button>
        </div>
      </div>
    </div>
  )
}

export default LayoutNotification
