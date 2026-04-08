import React, { useEffect, useRef, useState } from 'react'
import { loadPaymentWidget } from '@tosspayments/payment-widget-sdk'
import { supabase } from '../lib/supabaseClient'
import './PaymentModal.css'

// 100페이지 이상 업로드 요금 (원)
const UPLOAD_PRICE = 1000

function PaymentModal({ file, pageCount, user, onClose }) {
  const paymentWidgetRef = useRef(null)
  const [isWidgetReady, setIsWidgetReady] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true

    async function initWidget() {
      try {
        const widget = await loadPaymentWidget(
          import.meta.env.VITE_TOSS_CLIENT_KEY,
          user.id
        )
        if (!mounted) return
        paymentWidgetRef.current = widget
        widget.renderPaymentMethods('#payment-method', { value: UPLOAD_PRICE })
        widget.renderAgreement('#payment-agreement')
        setIsWidgetReady(true)
      } catch (err) {
        if (mounted) setError('결제 위젯을 불러오는데 실패했습니다.')
      }
    }

    initWidget()
    return () => { mounted = false }
  }, [user.id])

  const handlePayment = async () => {
    if (!paymentWidgetRef.current || isProcessing) return
    setIsProcessing(true)
    setError('')

    try {
      // 1. 결제 전 파일을 Supabase Storage에 먼저 업로드
      const storagePath = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('pdf-files')
        .upload(storagePath, file)
      if (uploadError) throw new Error('파일 업로드 실패: ' + uploadError.message)

      // 2. DB에 미결제 상태로 기록 (orderId = DB row id 사용)
      const { data: record, error: dbError } = await supabase
        .from('pdf_uploads')
        .insert({
          user_id: user.id,
          file_name: file.name,
          storage_path: storagePath,
          page_count: pageCount,
          file_size: file.size,
          is_paid: false,
        })
        .select('id')
        .single()
      if (dbError) throw new Error('기록 실패: ' + dbError.message)

      // 3. 결제 후 복원에 필요한 정보를 sessionStorage에 저장
      sessionStorage.setItem('pendingUpload', JSON.stringify({
        uploadId: record.id,
        storagePath,
        fileName: file.name,
      }))

      // 4. 토스 결제 요청 (페이지 리다이렉트)
      await paymentWidgetRef.current.requestPayment({
        orderId: record.id,
        orderName: `SKCT PDF 업로드 (${pageCount}페이지)`,
        customerEmail: user.email,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      })
    } catch (err) {
      setError(err.message || '결제 처리 중 오류가 발생했습니다.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="payment-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <button className="payment-close-btn" onClick={onClose} disabled={isProcessing}>✕</button>

        <h2>유료 업로드</h2>
        <div className="payment-file-info">
          <span className="payment-file-name">{file.name}</span>
          <span className="payment-page-count">{pageCount}페이지</span>
          <p className="payment-notice">100페이지 이상 PDF는 업로드 시 결제가 필요합니다.</p>
          <div className="payment-price">
            결제 금액: <strong>{UPLOAD_PRICE.toLocaleString()}원</strong>
          </div>
        </div>

        {error && <p className="payment-error">{error}</p>}

        <div id="payment-method" />
        <div id="payment-agreement" />

        {!isWidgetReady && !error && (
          <p className="payment-loading">결제 수단을 불러오는 중...</p>
        )}

        <div className="payment-actions">
          <button
            className="payment-cancel-btn"
            onClick={onClose}
            disabled={isProcessing}
          >
            취소
          </button>
          <button
            className="payment-submit-btn"
            onClick={handlePayment}
            disabled={!isWidgetReady || isProcessing}
          >
            {isProcessing ? '처리 중...' : `${UPLOAD_PRICE.toLocaleString()}원 결제하기`}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentModal
