import React, { useState, useEffect, useRef } from 'react'
import './Timer.css'

function playAlarmSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext
  if (!AudioCtx) return
  const ctx = new AudioCtx()
  const beep = (startTime, freq, duration) => {
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.value = freq
    gain.gain.setValueAtTime(0.5, startTime)
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration)
    osc.start(startTime)
    osc.stop(startTime + duration)
  }
  const now = ctx.currentTime
  beep(now, 880, 0.3)
  beep(now + 0.4, 1100, 0.3)
  beep(now + 0.8, 880, 0.5)
}

function Timer() {
  const [totalMinutes, setTotalMinutes] = useState(100)
  const [customMinutes, setCustomMinutes] = useState(0)
  const [customSeconds, setCustomSeconds] = useState(0)
  const [isCustomMode, setIsCustomMode] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [alarmEnabled, setAlarmEnabled] = useState(true)
  const [alarmFired, setAlarmFired] = useState(false)
  const alarmFiredRef = useRef(false)

  useEffect(() => {
    let interval = null
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1
          // 알람: 목표 시간 도달 시
          if (alarmEnabled && !alarmFiredRef.current && next === totalMinutes * 60) {
            alarmFiredRef.current = true
            setAlarmFired(true)
            playAlarmSound()
            setTimeout(() => setAlarmFired(false), 3000)
          }
          return next
        })
      }, 1000)
    } else if (!isRunning && seconds !== 0) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [isRunning, seconds, alarmEnabled, totalMinutes])

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
    alarmFiredRef.current = false
    setAlarmFired(false)
  }

  const handleCustomTimeSet = () => {
    const totalCustomSeconds = customMinutes * 60 + customSeconds
    if (totalCustomSeconds > 0) {
      setTotalMinutes(Math.floor(totalCustomSeconds / 60))
      setSeconds(0)
      alarmFiredRef.current = false
      setAlarmFired(false)
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
    <div className="timer" onKeyDown={(e) => e.stopPropagation()}>
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
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                className="custom-input"
                placeholder="분"
              />
              <span className="input-label">분</span>
              <input
                type="number"
                min="0"
                max="59"
                value={customSeconds}
                onChange={(e) => setCustomSeconds(parseInt(e.target.value) || 0)}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
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
      <div className="timer-buttons">
        <button
          onClick={handleStartStop}
          className={`timer-btn ${isRunning ? 'stop-btn' : 'start-btn'}`}
        >
          {isRunning ? '정지' : '시작'}
        </button>
        <button
          onClick={handleReset}
          className="timer-btn reset-btn"
        >
          리셋
        </button>
      </div>
      <label className="alarm-toggle">
        <input
          type="checkbox"
          checked={alarmEnabled}
          onChange={(e) => setAlarmEnabled(e.target.checked)}
        />
        <span>소리 알람</span>
      </label>
      {alarmFired && (
        <div className="alarm-banner">
          시간 종료!
        </div>
      )}
    </div>
  )
}

export default Timer