'use client'

import Link from 'next/link'
import { useMemo, useState, useTransition } from 'react'
import { CheckCircle2, Loader2, Search, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { verifyOrderPayment, rejectOrderPayment, updateOrderStatus } from './actions'
import type { AdminOrder } from './page'

const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function OrdersTable({ initialOrders }: { initialOrders: AdminOrder[] }) {
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const filtered = useMemo(
    () =>
      initialOrders.filter((o) =>
        `${o.id} ${o.profiles?.full_name ?? ''} ${o.payment_reference ?? ''}`.toLowerCase().includes(query.toLowerCase())
      ),
    [initialOrders, query]
  )

  const verify = (o: AdminOrder) => {
    if (!o.payment_reference?.trim()) return toast.error('No UTR/payment reference submitted for this order.')
    setBusyId(o.id)
    startTransition(async () => {
      try {
        await verifyOrderPayment(o.id)
        toast.success('Payment verified')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not verify payment')
      } finally {
        setBusyId(null)
      }
    })
  }

  const reject = (o: AdminOrder) => {
    const reason = window.prompt('Reason for rejecting this payment?')
    if (!reason) return
    setBusyId(o.id)
    startTransition(async () => {
      try {
        await rejectOrderPayment(o.id, reason)
        toast.success('Payment rejected')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not reject payment')
      } finally {
        setBusyId(null)
      }
    })
  }

  const setStatus = (o: AdminOrder, status: string) => {
    setBusyId(o.id)
    startTransition(async () => {
      try {
        await updateOrderStatus(o.id, status)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update status')
      } finally {
        setBusyId(null)
      }
    })
  }

  return (
    <>
      <section className="admin-toolbar">
        <label className="search-box">
          <Search size={17} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search order, customer or UTR" />
        </label>
      </section>

      <section className="order-table" aria-label="Orders">
        <div className="order-row order-head">
          <span>Order</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Payment</span>
          <span>Fulfilment</span>
          <span>UTR</span>
          <span>Actions</span>
        </div>
        {filtered.map((o) => (
          <article className="order-row" key={o.id}>
            <Link href={`/admin/orders/${o.id}`}><strong>{o.id.slice(0, 8)}</strong></Link>
            <span>{o.profiles?.full_name || o.profiles?.phone || '—'}</span>
            <span>₹{Number(o.total).toLocaleString('en-IN')}</span>
            <span className={`status ${o.payment_status}`}>{o.payment_status}</span>
            <select value={o.status} onChange={(e) => setStatus(o, e.target.value)} disabled={pending && busyId === o.id}>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <span>{o.payment_reference || '—'}</span>
            <div className="order-actions">
              {pending && busyId === o.id ? (
                <Loader2 className="spin" size={17} />
              ) : o.payment_status !== 'verified' ? (
                <>
                  <button className="button small" onClick={() => verify(o)}><CheckCircle2 size={15} /> Verify</button>
                  <button className="icon-button danger" onClick={() => reject(o)} aria-label="Reject payment"><XCircle size={17} /></button>
                </>
              ) : (
                <span className="verified"><CheckCircle2 size={15} /> Paid</span>
              )}
            </div>
          </article>
        ))}
      </section>
      {!filtered.length && <div className="empty-state"><h2>No orders found</h2></div>}
    </>
  )
}
