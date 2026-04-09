import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import './AuthModal.css'

function AuthModal({ onClose, onSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await signIn(email, password)
        if (error) throw error
        onSuccess?.(data.user)
        onClose()
      } else {
        const { data, error } = await signUp(email, password)
        if (error) throw error
        if (data.user && !data.session) {
          setError('이메일 인증 링크를 확인해주세요.')
        } else {
          onSuccess?.(data.user)
          onClose()
        }
      }
    } catch (err) {
      setError(err.message || '오류가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>✕</button>
        <h2>{mode === 'login' ? '로그인' : '회원가입'}</h2>

        <div className="auth-tabs">
          <button
            className={mode === 'login' ? 'active' : ''}
            onClick={() => { setMode('login'); setError('') }}
          >
            로그인
          </button>
          <button
            className={mode === 'signup' ? 'active' : ''}
            onClick={() => { setMode('signup'); setError('') }}
          >
            회원가입
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
              autoFocus
            />
          </div>
          <div className="auth-field">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
              minLength={6}
            />
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? '처리 중...' : mode === 'login' ? '로그인' : '회원가입'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthModal
