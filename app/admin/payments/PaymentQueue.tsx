'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { CheckCircle2, ExternalLink, XCircle } from 'lucide-react'
import { rejectPayment, verifyPayment } from './actions'

type Payment = { id: string; customer: string; amount: number; utr: string; submitted: string }

export default function PaymentQueue({ payments }: { payments: Payment[] }) {
  const [rows, setRows] = useState(payments)
  const [pending, startTransition] = useTransition()
  const [message, setMessage] = useState('')

  const handleVerify = (payment: Payment) => {
    startTransition(async () => {
      setMessage('Verifying payment…')
      const result = await verifyPayment({ orderId: payment.id, utr: payment.utr })
      if (!result.ok) return setMessage(result.error)
      setRows((current) => current.filter((row) => row.id !== payment.id))
      setMessage(`${payment.id} verified and moved to processing.`)
    })
  }

  const handleReject = (payment: Payment) => {
    const reason = window.prompt('Reason for rejecting this payment:')?.trim()
    if (!reason) return
    startTransition(async () => {
      setMessage('Rejecting payment…')
      const result = await rejectPayment({ orderId: payment.id, reason })
      if (!result.ok) return setMessage(result.error)
      setRows((current) => current.filter((row) => row.id !== payment.id))
      setMessage(`${payment.id} rejected. Customer can resubmit payment reference.`)
    })
  }

  return <>
    {message && <div className="payment-live-message" role="status">{message}</div>}
    <div className="payment-table">
      {rows.map((payment) => <article className="payment-row" key={payment.id}>
        <div><span className="payment-id">{payment.id}</span><strong>{payment.customer}</strong></div>
        <div><span>Amount</span><strong>₹{payment.amount.toLocaleString('en-IN')}</strong></div>
        <div><span>UTR</span><strong className="mono">{payment.utr}</strong></div>
        <div><span>Submitted</span><strong>{payment.submitted}</strong></div>
        <div className="payment-actions">
          <button disabled={pending} title="Verify" aria-label={`Verify ${payment.id}`} onClick={() => handleVerify(payment)}><CheckCircle2 size={18} /></button>
          <button disabled={pending} title="Reject" aria-label={`Reject ${payment.id}`} onClick={() => handleReject(payment)}><XCircle size={18} /></button>
          <Link href={`/admin/orders/${payment.id}`} title="Open order" aria-label={`Open ${payment.id}`}><ExternalLink size={18} /></Link>
        </div>
      </article>)}
      {!rows.length && <div className="payment-empty">No payments are waiting for review.</div>}
    </div>
  </>
}
