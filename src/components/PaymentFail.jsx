import React from 'react'
import { useNavigate } from 'react-router-dom'

function PaymentFail() {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search)
  const message = params.get('message') || '결제가 취소되었거나 실패했습니다.'

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.icon}>✕</div>
        <h2 style={styles.title}>결제 실패</h2>
        <p style={styles.message}>{decodeURIComponent(message)}</p>
        <button style={styles.btn} onClick={() => navigate('/')}>
          메인으로 돌아가기
        </button>
      </div>
    </div>
  )
}

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #2c3e50, #34495e)',
  },
  card: {
    background: 'white',
    borderRadius: 16,
    padding: '48px 40px',
    textAlign: 'center',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    minWidth: 300,
  },
  icon: {
    width: 56,
    height: 56,
    background: '#f56565',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 700,
    margin: '0 auto 20px',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#1a202c',
    margin: '0 0 12px',
  },
  message: {
    fontSize: 14,
    color: '#718096',
    margin: '0 0 24px',
  },
  btn: {
    padding: '10px 24px',
    background: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    cursor: 'pointer',
  },
}

export default PaymentFail
