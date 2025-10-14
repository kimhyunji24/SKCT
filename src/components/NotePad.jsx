import React, { useState, useRef, useEffect } from 'react'
import './NotePad.css'

function NotePad() {
  const [mode, setMode] = useState('notepad') // 'notepad' or 'drawing'
  const [text, setText] = useState('')
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000')
  const [lineWidth, setLineWidth] = useState(2)
  
  const canvasRef = useRef(null)
  const contextRef = useRef(null)

  useEffect(() => {
    if (mode === 'drawing' && canvasRef.current) {
      const canvas = canvasRef.current
      const container = canvas.parentElement
      
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight
      
      const context = canvas.getContext('2d')
      context.lineCap = 'round'
      context.strokeStyle = color
      context.lineWidth = lineWidth
      contextRef.current = context
    }
  }, [mode])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color
      contextRef.current.lineWidth = lineWidth
    }
  }, [color, lineWidth])

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.beginPath()
    contextRef.current.moveTo(offsetX, offsetY)
    setIsDrawing(true)
  }

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return
    const { offsetX, offsetY } = nativeEvent
    contextRef.current.lineTo(offsetX, offsetY)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    context.clearRect(0, 0, canvas.width, canvas.height)
  }

  const clearText = () => {
    setText('')
  }
  
  // 🟢 추가된 함수: 이벤트 전파를 막습니다.
  const handleKeyDown = (event) => {
    event.stopPropagation()
  }

  return (
    <div className="notepad">
      <div className="notepad-header">
        <div className="mode-toggle">
          <button
            className={mode === 'notepad' ? 'active' : ''}
            onClick={() => setMode('notepad')}
          >
            메모장
          </button>
          <button
            className={mode === 'drawing' ? 'active' : ''}
            onClick={() => setMode('drawing')}
          >
            그림판
          </button>
        </div>
      </div>

      {mode === 'notepad' ? (
        <div className="notepad-content">
          <div className="notepad-toolbar">
            <button onClick={clearText} className="clear-btn">전체 지우기</button>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="메모를 입력하세요..."
            className="notepad-textarea"
            // 🟢 onKeyDown 핸들러를 추가합니다.
            onKeyDown={handleKeyDown} 
          />
        </div>
      ) : (
        <div className="drawing-content">
          <div className="drawing-toolbar">
            <div className="tool-group">
              <label>색상:</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="color-picker"
              />
            </div>
            <div className="tool-group">
              <label>두께:</label>
              <input
                type="range"
                min="1"
                max="20"
                value={lineWidth}
                onChange={(e) => setLineWidth(e.target.value)}
                className="line-width-slider"
              />
              <span>{lineWidth}px</span>
            </div>
            <button onClick={clearCanvas} className="clear-btn">전체 지우기</button>
          </div>
          {/* 🟢 그림판 컨테이너에도 onKeyDown 핸들러를 추가합니다. */}
          <div 
            className="canvas-container" 
            onKeyDown={handleKeyDown} 
            tabIndex="0" /* 키보드 포커스를 받을 수 있도록 설정 */
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="drawing-canvas"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default NotePad