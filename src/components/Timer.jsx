import React, { useState, useEffect } from 'react'
import './Timer.css'

function Timer() {
  const [totalMinutes, setTotalMinutes] = useState(24)
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

  const currentMinutes = Math.floor(seconds / 60)

  return (
    <div className="timer">
      <div className="timer-controls">
        <select 
          value={totalMinutes} 
          onChange={(e) => setTotalMinutes(parseInt(e.target.value))}
          className="time-select"
        >
          <option value={5}>5분</option>
          <option value={15}>15분</option>
          <option value={24}>24분</option>
          <option value={100}>100분</option>
        </select>
      </div>
      <div className="timer-display">
        <span className="current-time">{formatTime(seconds)}</span>
        <span className="total-time">/ {totalMinutes}분</span>
      </div>
    </div>
  )
}

export default Timer

