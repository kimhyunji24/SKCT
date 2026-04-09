import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

function PaymentSuccess() {
  const navigate = useNavigate()
  const [status, setStatus] = useState('confirming') // 'confirming' | 'done' | 'error'
  const [message, setMessage] = useState('결제를 확인하는 중입니다...')

  useEffect(() => {
    async function confirmAndProceed() {
      try {
        const params = new URLSearchParams(window.location.search)
        const paymentKey = params.get('paymentKey')
        const orderId = params.get('orderId')
        const amount = params.get('amount')

        if (!paymentKey || !orderId || !amount) {
          throw new Error('결제 정보가 올바르지 않습니다.')
        }

        // 1. 서버에서 결제 검증
        const res = await fetch('/api/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || '결제 검증 실패')
        }

        // 2. DB 업데이트: is_paid = true
        const { error: dbError } = await supabase
          .from('pdf_uploads')
          .update({ is_paid: true, payment_key: paymentKey })
          .eq('id', orderId)
        if (dbError) throw new Error('DB 업데이트 실패')

        // 3. sessionStorage에서 파일 정보 가져오기
        const pendingRaw = sessionStorage.getItem('pendingUpload')
        if (!pendingRaw) throw new Error('업로드 정보를 찾을 수 없습니다.')
        const { storagePath, fileName } = JSON.parse(pendingRaw)
        sessionStorage.removeItem('pendingUpload')

        // 4. Supabase Storage 서명 URL 생성 (1시간)
        const { data: urlData, error: urlError } = await supabase.storage
          .from('pdf-files')
          .createSignedUrl(storagePath, 3600)
        if (urlError) throw new Error('파일 URL 생성 실패')

        setStatus('done')
        setMessage('결제가 완료되었습니다! 잠시 후 이동합니다...')

        // 5. 메인 페이지로 이동하며 파일 정보 전달
        setTimeout(() => {
          navigate('/', {
            state: { postPayment: { storageUrl: urlData.signedUrl, fileName } },
            replace: true,
          })
        }, 1500)
      } catch (err) {
        setStatus('error')
        setMessage(err.message || '결제 확인 중 오류가 발생했습니다.')
      }
    }

    confirmAndProceed()
  }, [navigate])

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {status === 'confirming' && <div style={styles.spinner} />}
        {status === 'done' && <div style={styles.checkmark}>✓</div>}
        {status === 'error' && <div style={styles.errorIcon}>✕</div>}
        <p style={styles.message}>{message}</p>
        {status === 'error' && (
          <button style={styles.btn} onClick={() => navigate('/')}>
            메인으로 돌아가기
          </button>
        )}
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
  spinner: {
    width: 48,
    height: 48,
    border: '4px solid #e2e8f0',
    borderTopColor: '#2c3e50',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto 20px',
  },
  checkmark: {
    width: 56,
    height: 56,
    background: '#48bb78',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 28,
    fontWeight: 700,
    margin: '0 auto 20px',
  },
  errorIcon: {
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
  message: {
    fontSize: 16,
    color: '#2d3748',
    margin: '0 0 20px',
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

export default PaymentSuccess
