import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import ShippingForm from './ShippingForm'
import '../../admin.css'

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) redirect('/')

  const { data: order } = await supabase
    .from('customer_orders')
    .select('*, profiles(full_name, phone), customer_order_items(*)')
    .eq('id', id)
    .maybeSingle()

  if (!order) notFound()

  const address = order.shipping_address as { city?: string; recipient_name?: string } | null

  return (
    <main className="container admin-page">
      <Link className="back-link" href="/admin/orders"><ArrowLeft size={16} /> Orders</Link>
      <section className="admin-header">
        <div>
          <span className="kicker">Order workspace</span>
          <h1>{order.id.slice(0, 8)}</h1>
          <p>Live order and fulfilment controls.</p>
        </div>
        <span className="status success"><CheckCircle2 size={15} /> {order.payment_status}</span>
      </section>

      <section className="detail-grid">
        <article className="detail-card">
          <span className="kicker">Customer</span>
          <h2>{order.profiles?.full_name || address?.recipient_name || '—'}</h2>
          <p>{order.profiles?.phone} · {address?.city ?? ''}</p>
        </article>
        <article className="detail-card">
          <span className="kicker">Order value</span>
          <h2>₹{Number(order.total).toLocaleString('en-IN')}</h2>
          <p>Status: {order.status}</p>
        </article>
        <article className="detail-card">
          <span className="kicker">Payment</span>
          <h2>{order.payment_status}</h2>
          <p>UTR: {order.payment_reference ?? '—'}</p>
        </article>
      </section>

      <section className="admin-card">
        <span className="kicker">Items</span>
        <div className="order-table" aria-label="Order items">
          {(order.customer_order_items ?? []).map((item: any) => (
            <div className="order-row" key={item.id}>
              <span>{item.product_name}</span>
              <span>{item.variant_label}</span>
              <span>× {item.quantity}</span>
              <span>₹{Number(item.unit_price * item.quantity).toLocaleString('en-IN')}</span>
            </div>
          ))}
        </div>
      </section>

      <ShippingForm
        orderId={order.id}
        initialCarrier={order.carrier ?? ''}
        initialTracking={order.tracking_number ?? ''}
        initialUrl={order.tracking_url ?? ''}
      />
    </main>
  )
}
