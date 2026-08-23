import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Package, Truck } from 'lucide-react'

const steps = ['Processing', 'Shipped', 'Delivered']

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <main className="container admin-page">
      <Link className="back-link" href="/admin/orders"><ArrowLeft size={16} /> Orders</Link>
      <section className="admin-header">
        <div><span className="kicker">Order workspace</span><h1>{id}</h1><p>Customer order operations and fulfilment controls.</p></div>
        <span className="status success"><CheckCircle2 size={15} /> Payment verified</span>
      </section>
      <section className="detail-grid">
        <article className="detail-card"><span className="kicker">Customer</span><h2>Customer</h2><p>Customer contact and shipping details will load from Supabase.</p></article>
        <article className="detail-card"><span className="kicker">Order value</span><h2>₹1,800</h2><p>3 variants / 1 item family</p></article>
        <article className="detail-card"><span className="kicker">Payment</span><h2>UPI verified</h2><p>UTR and verification audit data are stored securely.</p></article>
      </section>
      <section className="fulfilment-panel">
        <div><span className="kicker">Fulfilment</span><h2>Move this order forward</h2></div>
        <div className="timeline-admin">
          {steps.map((step, index) => <div className="timeline-step" key={step}><span>{index + 1}</span><strong>{step}</strong><small>{index === 0 ? 'Current stage' : 'Pending'}</small></div>)}
        </div>
        <div className="form-grid">
          <label>Carrier<input placeholder="e.g. Delhivery" /></label>
          <label>Tracking number<input placeholder="Tracking ID" /></label>
          <label className="wide">Fulfilment note<textarea rows={4} placeholder="Packing or delivery notes" /></label>
        </div>
        <div className="hero-actions"><button className="button primary"><Package size={16} /> Mark shipped</button><button className="button"><Truck size={16} /> Save tracking</button></div>
      </section>
    </main>
  )
}
