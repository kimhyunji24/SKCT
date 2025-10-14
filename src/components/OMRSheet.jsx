import React, { useState } from 'react' // useEffect 추가
import './OMRSheet.css'

// 🟢 props로 onGradingToggle 함수를 받도록 수정
function OMRSheet({ onGradingToggle }) {
  const [answers, setAnswers] = useState({})
  const [correctAnswers, setCorrectAnswers] = useState('')
  const [score, setScore] = useState(null)
  const [showGrading, setShowGrading] = useState(false)

  // 🟢 showGrading 상태가 바뀔 때마다 부모에게 알리는 useEffect 추가
  useEffect(() => {
    if (onGradingToggle) {
      onGradingToggle(showGrading);
    }
  }, [showGrading, onGradingToggle]);

  const totalQuestions = 100
  const choices = [1, 2, 3, 4, 5]

  const handleSelect = (questionNum, choice) => {
    setAnswers(prev => {
      if (prev[questionNum] === choice) {
        const newAnswers = { ...prev }
        delete newAnswers[questionNum]
        return newAnswers
      }
      return { ...prev, [questionNum]: choice }
    })
    setScore(null)
  }

  const handleGrade = () => {
    if (!correctAnswers.trim()) {
      alert('정답을 입력해주세요!')
      return
    }
    const correctArray = correctAnswers
      .split(/[,\s]+/)
      .map(a => parseInt(a.trim()))
      .filter(a => !isNaN(a) && a >= 1 && a <= 5)
    if (correctArray.length === 0) {
      alert('올바른 정답 형식이 아닙니다. 예: 1,2,3,4,5 또는 1 2 3 4 5')
      return
    }
    let correct = 0
    correctArray.forEach((correctChoice, index) => {
      const questionNum = index + 1
      if (answers[questionNum] === correctChoice) {
        correct++
      }
    })
    setScore({
      correct,
      total: correctArray.length,
      percentage: ((correct / correctArray.length) * 100).toFixed(1)
    })
  }

  const handleClear = () => {
    if (window.confirm('모든 답안을 지우시겠습니까?')) {
      setAnswers({})
      setScore(null)
    }
  }

  const handleClearGrading = () => {
    setCorrectAnswers('')
    setScore(null)
  }

  // 🟢 추가된 함수: 이벤트 전파를 막습니다.
  const handleKeyDown = (event) => {
    // 허용할 키: 숫자, 쉼표, 스페이스바, 백스페이스, 화살표 키 등
    if (
      !/^[0-9]$/.test(event.key) &&
      event.key !== ',' &&
      event.key !== ' ' &&
      event.key !== 'Backspace' &&
      event.key !== 'ArrowLeft' &&
      event.key !== 'ArrowRight'
    ) {
      // 그 외의 키(예: 연산자)는 입력을 막습니다.
      event.preventDefault() 
    }
    // 계산기로 이벤트가 넘어가지 않도록 막습니다.
    event.stopPropagation()
  }

  return (
    <div className="omr-sheet">
      <div className="omr-header">
        <h2>OMR 답안지</h2>
        <div className="omr-actions">
          <button onClick={() => setShowGrading(!showGrading)} className="grade-btn">
            {showGrading ? '답안지 보기' : '채점하기'}
          </button>
          <button onClick={handleClear} className="clear-all-btn">
            답안 초기화
          </button>
        </div>
      </div>
      
      {showGrading ? (
        <div className="grading-section">
          <div className="grading-input">
            <h3>정답 입력</h3>
            <p className="help-text">
              정답을 숫자로 입력하세요 (쉼표 또는 공백으로 구분)
            </p>
            <p className="help-text-example">
              예: 1,2,3,4,5 또는 1 2 3 4 5
            </p>
            <textarea
              value={correctAnswers}
              onChange={(e) => setCorrectAnswers(e.target.value)}
              placeholder="1,2,3,4,5,1,2,3,4,5,..."
              className="answer-input"
              rows="6"
              // 🟢 onKeyDown 핸들러를 추가합니다.
              onKeyDown={handleKeyDown}
            />
            {/* ... 이하 코드는 동일 ... */}
            <div className="grading-buttons">
              <button onClick={handleGrade} className="submit-grade-btn">
                채점하기
              </button>
              <button onClick={handleClearGrading} className="clear-grade-btn">
                입력 지우기
              </button>
            </div>
          </div>

          {score !== null && (
            <div className="score-result">
              <h3>채점 결과</h3>
              <div className="score-display">
                <div className="score-item">
                  <span className="score-label">정답:</span>
                  <span className="score-value correct">{score.correct}개</span>
                </div>
                <div className="score-item">
                  <span className="score-label">오답:</span>
                  <span className="score-value incorrect">{score.total - score.correct}개</span>
                </div>
                <div className="score-item">
                  <span className="score-label">총 문항:</span>
                  <span className="score-value">{score.total}개</span>
                </div>
                <div className="score-item large">
                  <span className="score-label">점수:</span>
                  <span className="score-value percentage">{score.percentage}점</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        // ... 이하 OMR 답안지 부분은 동일 ...
        <div className="omr-content">
          <div className="omr-grid">
            {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(num => (
              <div key={num} className="omr-row">
                <div className="question-number">{num}</div>
                <div className="choices">
                  {choices.map(choice => (
                    <button
                      key={choice}
                      className={`choice-btn ${answers[num] === choice ? 'selected' : ''}`}
                      onClick={() => handleSelect(num, choice)}
                    >
                      {choice}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="omr-footer">
        <div className="answer-count">
          표시한 답안: {Object.keys(answers).length} / {totalQuestions}
        </div>
      </div>
    </div>
  )
}

export default OMRSheet