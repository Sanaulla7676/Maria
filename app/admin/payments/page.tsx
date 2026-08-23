import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock3, ExternalLink, XCircle } from 'lucide-react'
import './payments.css'

const demoQueue = [
  { id: 'MAR-1048', customer: 'Ayesha Khan', amount: 1800, utr: '326781904512', submitted: '8 min ago', status: 'submitted' },
  { id: 'MAR-1047', customer: 'Rahul M', amount: 1000, utr: '326781903118', submitted: '22 min ago', status: 'submitted' },
  { id: 'MAR-1044', customer: 'Sana F', amount: 600, utr: '326781899021', submitted: '1 hr ago', status: 'submitted' },
]

export default function PaymentsAdminPage() {
  return (
    <main className="admin-shell payments-page">
      <Link className="back-link" href="/admin"><ArrowLeft size={16} /> Operations</Link>
      <header className="admin-header compact"><div><span className="kicker">Manual UPI verification</span><h1>Payment review.</h1><p>Verify UTRs before marking customer orders as paid.</p></div></header>
      <section className="payment-notice"><Clock3 size={18} /><span><strong>Never mark a payment paid from the customer screenshot alone.</strong> Match the UTR against the Maria UPI account/statement before verification.</span></section>
      <section className="payment-stats"><div><span>Pending review</span><strong>{demoQueue.length}</strong></div><div><span>Submitted today</span><strong>14</strong></div><div><span>Verified today</span><strong>11</strong></div></section>
      <section className="payment-table-wrap">
        <div className="payment-table-head"><h2>Verification queue</h2><span>Latest first</span></div>
        <div className="payment-table">
          {demoQueue.map((payment) => <article className="payment-row" key={payment.id}>
            <div><span className="payment-id">{payment.id}</span><strong>{payment.customer}</strong></div>
            <div><span>Amount</span><strong>₹{payment.amount.toLocaleString('en-IN')}</strong></div>
            <div><span>UTR</span><strong className="mono">{payment.utr}</strong></div>
            <div><span>Submitted</span><strong>{payment.submitted}</strong></div>
            <div className="payment-actions"><button title="Verify" aria-label={`Verify ${payment.id}`}><CheckCircle2 size={18} /></button><button title="Reject" aria-label={`Reject ${payment.id}`}><XCircle size={18} /></button><Link href={`/admin/orders/${payment.id}`} title="Open order" aria-label={`Open ${payment.id}`}><ExternalLink size={18} /></Link></div>
          </article>)}
        </div>
      </section>
    </main>
  )
}
