'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CreditCard, ShieldCheck } from 'lucide-react'
import { calculateCheckoutTotal, createUpiIntent } from '@/lib/checkout'

const demoItems = [
  { productId: 'oud-wood', productName: 'Oud Wood', variantName: '50ml', quantity: 1, unitPrice: 1000 },
]

export default function CheckoutPage() {
  const [reference, setReference] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const totals = useMemo(() => calculateCheckoutTotal(demoItems), [])
  const upiId = process.env.NEXT_PUBLIC_MARIA_UPI_ID || 'maria@upi'
  const upiLink = createUpiIntent({ upiId, payeeName: 'Maria Perfumes', amount: totals.total, orderId: 'MARIA-DEMO' })

  return (
    <main className="container checkout-page">
      <Link href="/shop" className="back-link"><ArrowLeft size={16} /> Continue shopping</Link>
      <section className="checkout-layout">
        <div>
          <span className="kicker">Secure checkout</span>
          <h1>Complete your Maria order.</h1>
          <div className="checkout-card">
            <h2>Delivery details</h2>
            <div className="form-grid">
              <input placeholder="Full name" />
              <input placeholder="WhatsApp / phone" />
              <input className="full" placeholder="Address" />
              <input placeholder="City" />
              <input placeholder="State" />
              <input placeholder="6-digit PIN code" inputMode="numeric" />
            </div>
          </div>
          <div className="checkout-card">
            <h2>UPI payment</h2>
            <p>Pay the exact amount using your UPI app. Maria will manually verify the transaction before the order is marked paid.</p>
            <a className="button primary" href={upiLink}><CreditCard size={17} /> Pay ₹{totals.total.toLocaleString('en-IN')} via UPI</a>
            <div className="payment-reference">
              <label htmlFor="utr">After payment, enter your UTR / transaction ID</label>
              <input id="utr" value={reference} onChange={(event) => setReference(event.target.value)} placeholder="e.g. 123456789012" />
              <button className="button" disabled={!reference.trim()} onClick={() => setSubmitted(true)}>Submit payment reference</button>
            </div>
            {submitted && <div className="success-note"><Check size={17} /> Payment reference submitted for manual verification.</div>}
          </div>
        </div>
        <aside className="order-summary">
          <span className="kicker">Order summary</span>
          {demoItems.map((item) => <div className="summary-item" key={item.productId}><span>{item.productName} · {item.variantName} × {item.quantity}</span><strong>₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</strong></div>)}
          <div className="summary-total"><span>Total</span><strong>₹{totals.total.toLocaleString('en-IN')}</strong></div>
          <div className="trust-note"><ShieldCheck size={18} /> UPI payment is handled by your banking app. Maria never sees your UPI PIN.</div>
        </aside>
      </section>
    </main>
  )
}
