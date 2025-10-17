import React, { useState, useEffect } from 'react'
import './Calculator.css'

// 마지막 숫자를 찾는 정규식
const findLastNumberRegex = /(-?\d+\.?\d*)$/

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [isResultShown, setIsResultShown] = useState(false)

  // 키보드 입력 처리
  useEffect(() => {
    const handleKeyPress = (event) => {
      const { key } = event
      event.preventDefault()

      if (key >= '0' && key <= '9') handleNumber(key)
      else if (['+', '-', '*', '/'].includes(key)) handleOperator(key === '*' ? '×' : key === '/' ? '÷' : key)
      else if (key === '(' || key === ')') handleParentheses(key)
      else if (key === '.') handleDecimal()
      else if (key === '%') handlePercent()
      else if (key === 'Enter' || key === '=') handleEquals()
      else if (key === 'Backspace') handleBackspace()
      else if (key.toLowerCase() === 'c' || key === 'Escape') handleClear()
    }
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, isResultShown])

  // --- 핸들러 함수들 ---

  const handleNumber = (numStr) => {
    if (isResultShown || display === '0' || display === 'Error') {
      setDisplay(numStr)
    } else {
      setDisplay((prev) => prev + numStr)
    }
    setIsResultShown(false)
  }

  const handleOperator = (op) => {
    if (display === 'Error') return
    const lastChar = display.slice(-1)
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      setDisplay((prev) => prev.slice(0, -1) + op)
    } else {
      setDisplay((prev) => prev + op)
    }
    setIsResultShown(false)
  }

  const handleParentheses = (paren) => {
    if (isResultShown || display === '0' || display === 'Error') {
      setDisplay(paren)
    } else {
      setDisplay((prev) => prev + paren)
    }
    setIsResultShown(false)
  }

  const handleDecimal = () => {
    const parts = display.split(/[\+\-\×\÷\(\)]/)
    if (!parts[parts.length - 1].includes('.')) {
      setDisplay((prev) => prev + '.')
    }
    setIsResultShown(false)
  }

  const handleClear = () => {
    setDisplay('0')
    setIsResultShown(false)
  }

  const handleBackspace = () => {
    if (isResultShown || display === 'Error') {
      handleClear()
      return
    }
    const newDisplay = display.slice(0, -1)
    setDisplay(newDisplay === '' ? '0' : newDisplay)
  }

  // 🟢 부호 변경 (+/-) 로직
  const handleSign = () => {
    if (isResultShown || display === 'Error') return

    const match = display.match(findLastNumberRegex)
    if (match) {
      const lastNumStr = match[0]
      const index = match.index
      if (lastNumStr.startsWith('-')) {
        // 음수 -> 양수
        setDisplay(display.substring(0, index) + lastNumStr.substring(1))
      } else {
        // 양수 -> 음수
        setDisplay(display.substring(0, index) + `(-${lastNumStr})`)
      }
    }
  }

  // 🟢 퍼센트(%) 로직
  const handlePercent = () => {
    if (isResultShown || display === 'Error') return

    const match = display.match(findLastNumberRegex)
    if (match) {
      const lastNumStr = match[0]
      const lastNum = parseFloat(lastNumStr)
      const result = lastNum / 100
      setDisplay(display.substring(0, match.index) + String(result))
    }
  }

  const handleEquals = () => {
    if (display === 'Error' || isResultShown) return
    try {
      const evalExpression = display.replace(/×/g, '*').replace(/÷/g, '/')
      const result = eval(evalExpression)

      if (!isFinite(result)) {
        setDisplay('Error')
      } else {
        setDisplay(String(parseFloat(result.toPrecision(15))))
      }
    } catch (e) {
      setDisplay('Error')
    }
    setIsResultShown(true)
  }

  return (
    <div className="calculator">
      <div className="calc-header">계산기</div>
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        {/* 🟢 1번째 줄 (새로 추가된 기능) */}
        <button className="btn-function" onClick={() => handleParentheses('(')}>(</button>
        <button className="btn-function" onClick={() => handleParentheses(')')}>)</button>
        <button className="btn-function" onClick={handlePercent}>%</button>
        <button className="btn-function" onClick={handleBackspace}>C</button>
        
        {/* 🟢 2번째 줄 (기존 기능) */}
        <button className="btn-function" onClick={handleClear}>AC</button>
        <button className="btn-function" onClick={handleSign}>+/-</button>
        <button className="btn-operator" onClick={() => handleOperator('÷')}>÷</button>
        <button className="btn-operator" onClick={() => handleOperator('×')}>×</button>

        {/* --- 숫자 및 나머지 연산자 --- */}
        <button className="btn-number" onClick={() => handleNumber('7')}>7</button>
        <button className="btn-number" onClick={() => handleNumber('8')}>8</button>
        <button className="btn-number" onClick={() => handleNumber('9')}>9</button>
        <button className="btn-operator" onClick={() => handleOperator('-')}>-</button>
        
        <button className="btn-number" onClick={() => handleNumber('4')}>4</button>
        <button className="btn-number" onClick={() => handleNumber('5')}>5</button>
        <button className="btn-number" onClick={() => handleNumber('6')}>6</button>
        <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>
        
        <button className="btn-number" onClick={() => handleNumber('1')}>1</button>
        <button className="btn-number" onClick={() => handleNumber('2')}>2</button>
        <button className="btn-number" onClick={() => handleNumber('3')}>3</button>
        <button className="btn-operator" onClick={handleEquals}>=</button>
        
        <button className="btn-number btn-zero" onClick={() => handleNumber('0')}>0</button>
        <button className="btn-number" onClick={handleDecimal}>.</button>
      </div>
    </div>
  )
}

export default Calculator