import React, { useState, useRef, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import Tutorial from './components/Tutorial'
import OMRSheet from './components/OMRSheet'
import PDFViewer from './components/PDFViewer'
import Timer from './components/Timer'
import Calculator from './components/Calculator'
import NotePad from './components/NotePad'
import LayoutNotification from './components/LayoutNotification'
import AuthModal from './components/AuthModal'
import PaymentSuccess from './components/PaymentSuccess'
import PaymentFail from './components/PaymentFail'
import { useAuth } from './contexts/AuthContext'
import './App.css'

function MainLayout() {
  const [showOMR, setShowOMR] = useState(true)
  const tutorialRef = useRef()
  const [isGrading, setIsGrading] = useState(false)
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)
  const [showPDF, setShowPDF] = useState(true)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, signOut, loading } = useAuth()
  const location = useLocation()

  const postPaymentData = location.state?.postPayment ?? null

  useEffect(() => {
    const checkScreenWidth = () => {
      const windowWidth = window.innerWidth
      const screenWidth = window.screen.width
      const widthPercentage = (windowWidth / screenWidth) * 100
      const shouldHideByPercentage = widthPercentage <= 45
      const shouldHideByPixels = windowWidth <= 700
      setIsNarrowScreen(shouldHideByPercentage || shouldHideByPixels)
    }
    checkScreenWidth()
    window.addEventListener('resize', checkScreenWidth)
    return () => window.removeEventListener('resize', checkScreenWidth)
  }, [])

  const openTutorial = () => {
    if (tutorialRef.current) tutorialRef.current.open()
  }

  return (
    <>
      <Tutorial ref={tutorialRef} />
      <LayoutNotification />

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={() => setShowAuthModal(false)}
        />
      )}

      {/* 상단 바: 타이머 + 인증 + 도움말 */}
      <div className="top-bar">
        <div className="top-bar-timer">
          <Timer />
        </div>
        <div className="top-bar-actions">
          {!loading && (
            user ? (
              <>
                <span className="auth-user-email">{user.email}</span>
                <button className="auth-action-btn" onClick={signOut}>로그아웃</button>
              </>
            ) : (
              <button className="auth-action-btn login-btn" onClick={() => setShowAuthModal(true)}>
                로그인
              </button>
            )
          )}
          <button className="help-btn" onClick={openTutorial} title="사용 설명서 보기">❓</button>
        </div>
      </div>

      <div className={`app ${isNarrowScreen ? 'narrow-screen' : ''}`}>
        {!isNarrowScreen && (
          <div className={`middle-panel ${showPDF ? '' : 'hidden'}`}>
            <PDFViewer
              onHide={() => setShowPDF(false)}
              postPaymentData={postPaymentData}
            />
          </div>
        )}

        {!isNarrowScreen && !showPDF && (
          <button
            className="pdf-show-btn"
            onClick={() => setShowPDF(true)}
            title="PDF 보이기"
          >
            PDF 보이기 ▶
          </button>
        )}

        {!isNarrowScreen && (
          <div className="omr-container">
            {showOMR && (
              <div className={`omr-panel ${isGrading ? 'grading-mode' : ''}`}>
                <OMRSheet onGradingToggle={setIsGrading} onHide={() => setShowOMR(false)} />
              </div>
            )}
            {!showOMR && (
              <button
                className="omr-toggle-btn"
                onClick={() => setShowOMR(true)}
                title="OMR 보이기"
              >
                ◀ OMR 보이기
              </button>
            )}
          </div>
        )}

        <div className={`right-panel ${isNarrowScreen || !showPDF ? 'expanded' : ''}`}>
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

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/fail" element={<PaymentFail />} />
      </Routes>
      <Analytics />
    </>
  )
}

export default App
