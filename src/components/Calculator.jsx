import React, { useState } from 'react'
import './Calculator.css'

function Calculator() {
  const [display, setDisplay] = useState('0')
  const [prevValue, setPrevValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [newNumber, setNewNumber] = useState(true)

  const handleNumber = (num) => {
    if (newNumber) {
      setDisplay(String(num))
      setNewNumber(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleOperator = (op) => {
    const currentValue = parseFloat(display)
    
    if (prevValue === null) {
      setPrevValue(currentValue)
    } else if (operation) {
      const result = calculate(prevValue, currentValue, operation)
      setDisplay(String(result))
      setPrevValue(result)
    }
    
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = (a, b, op) => {
    switch (op) {
      case '+':
        return a + b
      case '-':
        return a - b
      case '×':
        return a * b
      case '÷':
        return b !== 0 ? a / b : 0
      default:
        return b
    }
  }

  const handleEquals = () => {
    if (operation && prevValue !== null) {
      const result = calculate(prevValue, parseFloat(display), operation)
      setDisplay(String(result))
      setPrevValue(null)
      setOperation(null)
      setNewNumber(true)
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPrevValue(null)
    setOperation(null)
    setNewNumber(true)
  }

  const handleDecimal = () => {
    if (newNumber) {
      setDisplay('0.')
      setNewNumber(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }

  const handlePercent = () => {
    setDisplay(String(parseFloat(display) / 100))
  }

  const handleSign = () => {
    setDisplay(String(parseFloat(display) * -1))
  }

  return (
    <div className="calculator">
      <div className="calc-header">계산기</div>
      <div className="calc-display">{display}</div>
      <div className="calc-buttons">
        <button className="btn-function" onClick={handleClear}>AC</button>
        <button className="btn-function" onClick={handleSign}>+/-</button>
        <button className="btn-function" onClick={handlePercent}>%</button>
        <button className="btn-operator" onClick={() => handleOperator('÷')}>÷</button>
        
        <button className="btn-number" onClick={() => handleNumber(7)}>7</button>
        <button className="btn-number" onClick={() => handleNumber(8)}>8</button>
        <button className="btn-number" onClick={() => handleNumber(9)}>9</button>
        <button className="btn-operator" onClick={() => handleOperator('×')}>×</button>
        
        <button className="btn-number" onClick={() => handleNumber(4)}>4</button>
        <button className="btn-number" onClick={() => handleNumber(5)}>5</button>
        <button className="btn-number" onClick={() => handleNumber(6)}>6</button>
        <button className="btn-operator" onClick={() => handleOperator('-')}>-</button>
        
        <button className="btn-number" onClick={() => handleNumber(1)}>1</button>
        <button className="btn-number" onClick={() => handleNumber(2)}>2</button>
        <button className="btn-number" onClick={() => handleNumber(3)}>3</button>
        <button className="btn-operator" onClick={() => handleOperator('+')}>+</button>
        
        <button className="btn-number btn-zero" onClick={() => handleNumber(0)}>0</button>
        <button className="btn-number" onClick={handleDecimal}>.</button>
        <button className="btn-operator" onClick={handleEquals}>=</button>
      </div>
    </div>
  )
}

export default Calculator

