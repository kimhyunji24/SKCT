import React, { useState, useEffect } from 'react'
import './Timer.css'

function Timer({ totalMinutes }) {
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
      <div className="timer-display">
        <span className="current-time">{formatTime(seconds)}</span>
        <span className="total-time">/ {totalMinutes}분</span>
      </div>
    </div>
  )
}

export default Timer

