import React, { useState, useEffect } from 'react'
import './Timer.css'

function Timer() {
  const [totalMinutes, setTotalMinutes] = useState(100)
  const [customMinutes, setCustomMinutes] = useState(0)
  const [customSeconds, setCustomSeconds] = useState(0)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1)
      }, 1000)
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds])

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${String(mins).padStart(2, '0')}분 ${String(secs).padStart(2, '0')}초`
  }

  const handleStartStop = () => {
    setIsRunning(!isRunning)
  }

  const handleReset = () => {
    setIsRunning(false)
    setSeconds(0)
  }

  const handleCustomTimeSet = () => {
    const totalCustomSeconds = customMinutes * 60 + customSeconds
    if (totalCustomSeconds > 0) {
      setTotalMinutes(Math.floor(totalCustomSeconds / 60))
      setSeconds(0)
      setIsCustomMode(false)
    }
  }

  const getTotalTimeDisplay = () => {
    if (isCustomMode) {
      return `${customMinutes}분 ${customSeconds}초`
    }
    return `${totalMinutes}분`
  }

  const currentMinutes = Math.floor(seconds / 60)

  return (
    <div className="timer">
      <div className="timer-controls">
        {!isCustomMode ? (
          <>
            <select 
              value={totalMinutes} 
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomMode(true)
                } else {
                  setTotalMinutes(parseInt(e.target.value))
                }
              }}
              className="time-select"
            >
              <option value={5}>5분</option>
              <option value={15}>15분</option>
              <option value={100}>100분</option>
              <option value="custom">사용자 지정</option>
            </select>
          </>
        ) : (
          <div className="custom-time-inputs">
            <div className="custom-input-group">
              <input
                type="number"
                min="0"
                max="999"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 0)}
                className="custom-input"
                placeholder="분"
              />
              <span className="input-label">분</span>
            </div>
            <div className="custom-input-group">
              <input
                type="number"
                min="0"
                max="59"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(parseInt(e.target.value) || 0)}
                className="custom-input"
                placeholder="초"
              />
              <span className="input-label">초</span>
            </div>
            <div className="custom-buttons">
              <button onClick={handleCustomTimeSet} className="set-btn">설정</button>
              <button onClick={() => setIsCustomMode(false)} className="cancel-btn">취소</button>
            </div>
          </div>
        )}
      </div>
      <div className="timer-display">
        <span className="current-time">{formatTime(seconds)}</span>
        <span className="total-time">/ {getTotalTimeDisplay()}</span>
      </div>
    </div>
  )
}

export default Timer