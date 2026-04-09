import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import './Tutorial.css'

const Tutorial = forwardRef((props, ref) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // localStorage에서 튜토리얼을 봤는지 확인
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial')
    if (!hasSeenTutorial) {
      setIsOpen(true)
    }
  }, [])

  // 부모 컴포넌트에서 호출할 수 있도록 메서드 노출
  useImperativeHandle(ref, () => ({
    open: () => setIsOpen(true)
  }))

  const handleClose = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setIsOpen(false)
  }

  const handleDontShowAgain = () => {
    localStorage.setItem('hasSeenTutorial', 'true')
    setIsOpen(false)
  }

  const handleShowLater = () => {
    setIsOpen(false)
  }

  if (!isOpen) return null

  return (
    <div className="tutorial-overlay">
      <div className="tutorial-modal">
        <div className="tutorial-header">
          <h2>📋 SKCT 실전 연습 사용법</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        
        <div className="tutorial-content">
          <section className="tutorial-section">
            <div className="section-icon">📄</div>
            <h3>1. PDF 문제 업로드</h3>
            <p>화면 중앙 상단의 <strong>"PDF 업로드"</strong> 버튼으로 시험 문제 파일을 불러오세요.</p>
            <p className="tip">💡 100페이지 이하 PDF를 지원합니다. 확대/축소 버튼으로 문제를 편하게 볼 수 있어요.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">✏️</div>
            <h3>2. OMR 답안 마킹</h3>
            <p>화면 오른쪽 OMR 답안지에 1~100번 문제의 답을 표시하세요.</p>
            <ul>
              <li>각 문제의 <strong>①②③④⑤</strong> 중 하나를 클릭해 마킹</li>
              <li>다시 클릭하면 답안 변경, 한 번 더 클릭하면 취소</li>
            </ul>
            <p className="tip">💡 OMR 패널은 숨기거나 다시 열 수 있어요.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">✅</div>
            <h3>3. 채점하기</h3>
            <p>OMR 답안지 하단의 <strong>"채점하기"</strong> 버튼을 눌러 결과를 확인하세요.</p>
            <ol>
              <li>정답을 쉼표 또는 공백으로 구분해 입력 <span className="tip-inline">(예: 1,2,3,4,5)</span></li>
              <li><strong>"채점하기"</strong> 클릭</li>
              <li>정답 수, 오답 수, 최종 점수 확인</li>
            </ol>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">⏱️</div>
            <h3>4. 타이머</h3>
            <p>화면 상단 타이머로 실전처럼 시간을 재며 풀어보세요.</p>
            <ul>
              <li><strong>시작 / 정지 / 초기화</strong> 버튼으로 간편하게 조작</li>
            </ul>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">🧮</div>
            <h3>5. 계산기</h3>
            <p>우측 패널의 계산기로 풀이 중 필요한 계산을 바로 처리하세요.</p>
            <p className="tip">💡 기본 사칙연산 및 퍼센트 계산을 지원합니다.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">📝</div>
            <h3>6. 메모장 / 그림판</h3>
            <p>우측 하단에서 텍스트 메모와 손글씨 그림판을 자유롭게 활용하세요.</p>
            <ul>
              <li><strong>메모장</strong>: 풀이 과정이나 키워드 기록</li>
              <li><strong>그림판</strong>: 마우스로 도식화·메모 — 색상·선 두께 조절 가능</li>
            </ul>
          </section>

          <div className="tutorial-footer-info">
            <p>🎯 <strong>실전 TIP</strong>: 타이머를 켜고 PDF 문제를 풀면서 OMR에 바로 마킹하면 실제 시험 환경과 동일하게 연습할 수 있어요!</p>
          </div>
        </div>

        <div className="tutorial-footer">
          <button className="btn-secondary" onClick={handleShowLater}>
            나중에 보기
          </button>
          <button className="btn-primary" onClick={handleDontShowAgain}>
            다시 보지 않기
          </button>
        </div>
      </div>
    </div>
  )
})

Tutorial.displayName = 'Tutorial'

export default Tutorial