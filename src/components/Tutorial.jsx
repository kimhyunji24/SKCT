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
          <h2>📚 SKCT 학습 시스템 사용 설명서</h2>
          <button className="close-btn" onClick={handleClose}>✕</button>
        </div>
        
        <div className="tutorial-content">
          <section className="tutorial-section">
            <div className="section-icon">📄</div>
            <h3>1. PDF 문제 업로드</h3>
            <p>가운데 화면 상단의 <strong>"PDF 업로드"</strong> 버튼을 클릭하여 시험 문제를 업로드하세요.</p>
            <p className="tip">💡 업로드 후 이전/다음 버튼으로 페이지를 넘길 수 있습니다.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">⏱️</div>
            <h3>2. 타이머 사용</h3>
            <p>오른쪽 상단의 타이머로 시험 시간을 측정하세요.</p>
            <ul>
              <li><strong>시작</strong>: 타이머 시작</li>
              <li><strong>정지</strong>: 타이머 일시정지</li>
              <li><strong>초기화</strong>: 시간을 0으로 리셋</li>
            </ul>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">✏️</div>
            <h3>3. OMR 답안 작성</h3>
            <p>왼쪽의 OMR 답안지에서 1~100번 문제의 답을 표시하세요.</p>
            <ul>
              <li>각 번호의 <strong>1, 2, 3, 4, 5</strong> 중 하나를 클릭</li>
              <li>선택한 답은 파란색으로 표시됩니다</li>
              <li>다시 클릭하면 답안 변경 가능</li>
            </ul>
            <p className="tip">💡 왼쪽의 세로 버튼으로 OMR을 숨기거나 보일 수 있습니다.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">✅</div>
            <h3>4. 채점하기</h3>
            <p>OMR 답안지의 <strong>"채점하기"</strong> 버튼을 클릭하세요.</p>
            <ol>
              <li>정답을 입력란에 입력 (예: 1,2,3,4,5 또는 1 2 3 4 5)</li>
              <li><strong>"채점하기"</strong> 버튼 클릭</li>
              <li>정답 개수, 오답 개수, 점수 확인</li>
            </ol>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">🧮</div>
            <h3>5. 계산기</h3>
            <p>오른쪽 중간의 계산기를 사용하여 필요한 계산을 하세요.</p>
            <p className="tip">💡 iOS 스타일 계산기로 기본 사칙연산이 가능합니다.</p>
          </section>

          <section className="tutorial-section">
            <div className="section-icon">📝</div>
            <h3>6. 메모장 / 그림판</h3>
            <p>오른쪽 하단에서 메모장과 그림판을 전환하며 사용하세요.</p>
            <ul>
              <li><strong>메모장</strong>: 텍스트로 메모 작성</li>
              <li><strong>그림판</strong>: 마우스로 그림 그리기
                <ul className="sub-list">
                  <li>색상과 선 두께 조절 가능</li>
                  <li>"전체 지우기"로 캔버스 초기화</li>
                </ul>
              </li>
            </ul>
          </section>

          <div className="tutorial-footer-info">
            <p>🎯 <strong>학습 팁</strong>: 실제 시험처럼 타이머를 켜고 PDF 문제를 풀면서 OMR에 답안을 표시해보세요!</p>
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

