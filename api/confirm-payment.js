// Vercel Serverless Function: 토스 결제 서버 검증
export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { paymentKey, orderId, amount } = req.body

  if (!paymentKey || !orderId || !amount) {
    return res.status(400).json({ error: '필수 파라미터 누락' })
  }

  const secretKey = process.env.TOSS_SECRET_KEY
  if (!secretKey) {
    return res.status(500).json({ error: '서버 설정 오류' })
  }

  const encoded = Buffer.from(secretKey + ':').toString('base64')

  const tossRes = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${encoded}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ paymentKey, orderId, amount }),
  })

  const data = await tossRes.json()

  if (!tossRes.ok) {
    return res.status(tossRes.status).json({ error: data.message || '결제 검증 실패' })
  }

  return res.status(200).json({ paymentKey: data.paymentKey, orderId: data.orderId })
}
