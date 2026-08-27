'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowLeft, Check, CreditCard, Loader2, ShieldCheck } from 'lucide-react'
import { buildUpiIntent } from '@/lib/real-checkout'
import type { CartItem } from '@/lib/types'

type Address = { recipient_name: string; phone: string; line1: string; line2: string; city: string; state: string; postal_code: string; country: string }
const emptyAddress: Address = { recipient_name: '', phone: '', line1: '', line2: '', city: '', state: '', postal_code: '', country: 'India' }

export default function CheckoutClient({ initialItems = [] }: { initialItems?: CartItem[] }) {
  const [items] = useState<CartItem[]>(initialItems)
  const [address, setAddress] = useState(emptyAddress)
  const [order, setOrder] = useState<{ id: string; total: number } | null>(null)
  const [utr, setUtr] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const total = useMemo(() => items.reduce((s, i) => s + Number(i.unit_price) * i.quantity, 0), [items])
  const required = ['recipient_name', 'phone', 'line1', 'city', 'state', 'postal_code'] as const

  async function createOrder() {
    setError('')
    if (required.some((k) => !address[k].trim())) return setError('Please complete your delivery details.')
    if (!/^\d{6}$/.test(address.postal_code.trim())) return setError('Enter a valid 6-digit PIN code.')
    if (!/^[6-9]\d{9}$/.test(address.phone.trim())) return setError('Enter a valid 10-digit Indian mobile number.')
    setBusy(true)
    try {
      const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ shippingAddress: address }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? 'Unable to create order.')
      setOrder({ id: d.order.id, total: Number(d.order.total) })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to create order.')
    } finally {
      setBusy(false)
    }
  }

  async function submitUtr() {
    if (!order || utr.trim().length < 6) return setError('Enter a valid UTR / transaction reference.')
    setBusy(true)
    setError('')
    try {
      const r = await fetch('/api/payments/reference', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ orderId: order.id, reference: utr.trim() }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error ?? 'Unable to submit payment reference.')
      setSubmitted(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unable to submit payment reference.')
    } finally {
      setBusy(false)
    }
  }

  const upiId = process.env.NEXT_PUBLIC_MARIA_UPI_ID || ''
  const upiLink = order && upiId ? buildUpiIntent({ upiId, payeeName: 'Maria Perfumes', amount: order.total, orderId: order.id }) : '#'

  if (!items.length && !order) {
    return (
      <main className="container py-24">
        <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-black/55 mb-8"><ArrowLeft size={16} /> Back to cart</Link>
        <div className="text-center py-16">
          <h2 className="font-display text-3xl">Your cart is empty</h2>
          <Link className="btn btn-primary mt-6 inline-flex" href="/shop">Explore fragrances</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container py-16">
      <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-black/55 mb-8"><ArrowLeft size={16} /> Back to cart</Link>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="font-display text-4xl mt-2 mb-6">Complete your Maria order.</h1>

          {!order ? (
            <div className="glass rounded-3xl p-6 space-y-4">
              <h2 className="font-display text-2xl">Delivery details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.keys(address) as (keyof Address)[]).filter((k) => k !== 'country').map((k) => (
                  <label key={k} className="text-sm space-y-1">
                    <span className="capitalize text-black/60">{k.replaceAll('_', ' ')}</span>
                    <input
                      className="input"
                      value={address[k]}
                      onChange={(e) => setAddress((c) => ({ ...c, [k]: e.target.value }))}
                      placeholder={k === 'postal_code' ? '6-digit PIN code' : k === 'phone' ? '10-digit mobile number' : k.replaceAll('_', ' ')}
                      inputMode={k === 'phone' || k === 'postal_code' ? 'numeric' : undefined}
                    />
                  </label>
                ))}
              </div>
              <button className="btn btn-primary" onClick={createOrder} disabled={busy}>
                {busy ? <Loader2 className="animate-spin" size={16} /> : <CreditCard size={16} />} Create order &amp; continue
              </button>
            </div>
          ) : (
            <div className="glass rounded-3xl p-6 space-y-4">
              <h2 className="font-display text-2xl">UPI payment</h2>
              <p className="text-sm text-black/60">Order <strong>{order.id}</strong> has been created. Inventory is reserved while payment is pending.</p>
              {upiId ? (
                <a className="btn btn-primary" href={upiLink}><CreditCard size={17} /> Pay ₹{order.total.toLocaleString('en-IN')} via UPI</a>
              ) : (
                <div className="text-sm text-rose-600">UPI payment is unavailable until NEXT_PUBLIC_MARIA_UPI_ID is configured.</div>
              )}
              <div className="space-y-2 pt-2 border-t border-[var(--line)]">
                <label htmlFor="utr" className="text-sm text-black/60 block">After payment, enter your UTR / transaction ID</label>
                <input id="utr" className="input" value={utr} onChange={(e) => setUtr(e.target.value)} placeholder="UTR / transaction ID" inputMode="numeric" />
                <button className="btn btn-ghost" onClick={submitUtr} disabled={utr.trim().length < 6 || busy || submitted}>
                  {busy ? 'Submitting…' : submitted ? 'Submitted' : 'Submit payment reference'}
                </button>
              </div>
              {submitted && <div className="text-sm text-emerald-700 flex items-center gap-1.5"><Check size={17} /> Payment reference submitted for manual verification.</div>}
            </div>
          )}
          {error && <div className="text-sm text-rose-600 mt-3">{error}</div>}
        </div>

        <aside className="glass rounded-3xl p-6 h-fit space-y-3">
          <p className="eyebrow">Order summary</p>
          {items.map((i) => (
            <div key={i.id} className="flex justify-between text-sm">
              <span>{i.product_name} · {i.variant_label} × {i.quantity}</span>
              <strong>₹{(Number(i.unit_price) * i.quantity).toLocaleString('en-IN')}</strong>
            </div>
          ))}
          <hr className="border-[var(--line)]" />
          <div className="flex justify-between">
            <span>Total</span>
            <strong>₹{(order?.total ?? total).toLocaleString('en-IN')}</strong>
          </div>
          <div className="text-xs text-black/50 flex items-center gap-2 pt-2">
            <ShieldCheck size={18} /> UPI opens your banking app. Maria never sees your UPI PIN.
          </div>
        </aside>
      </div>
    </main>
  )
}
