import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Clock3, Package, Truck } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

const statusOrder = ['payment_pending', 'processing', 'shipped', 'delivered'] as const

function stepIcon(status: string, current: string) {
  const currentIndex = statusOrder.indexOf(current as typeof statusOrder[number])
  const stepIndex = statusOrder.indexOf(status as typeof statusOrder[number])
  return stepIndex <= currentIndex ? <CheckCircle2 size={18} /> : <Clock3 size={18} />
}

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: order } = await supabase.from('customer_orders').select('id,status,payment_status,total,subtotal,shipping_address,created_at,paid_at,shipped_at,delivered_at,carrier,tracking_number,fulfillment_note').eq('id', id).eq('user_id', user.id).maybeSingle()
  if (!order) notFound()
  const { data: items } = await supabase.from('customer_order_items').select('product_name,variant_name,quantity,unit_price').eq('order_id', order.id)

  return <main className="container account-page">
    <Link className="back-link" href="/account/orders"><ArrowLeft size={16}/> Orders</Link>
    <section className="account-hero compact"><span className="kicker">Order {order.id.slice(0, 8).toUpperCase()}</span><h1>We’re taking care of it.</h1><p>{new Date(order.created_at).toLocaleString('en-IN')}</p></section>
    <section className="order-detail-grid">
      <article className="detail-card"><span className="kicker">Status</span><div className="order-status-line"><strong>{order.status.replace('_', ' ')}</strong><span className="status">Payment: {order.payment_status}</span></div><div className="order-timeline">{statusOrder.map((status) => <div className="timeline-step" key={status}>{stepIcon(status, order.status)}<div><strong>{status.replace('_', ' ')}</strong><small>{status === 'payment_pending' ? order.paid_at ? new Date(order.paid_at).toLocaleString('en-IN') : 'Awaiting UPI verification' : status === 'processing' ? 'Maria is preparing your fragrance' : status === 'shipped' ? order.shipped_at ? `Shipped ${new Date(order.shipped_at).toLocaleString('en-IN')}` : 'Shipment pending' : order.delivered_at ? `Delivered ${new Date(order.delivered_at).toLocaleString('en-IN')}` : 'Delivery pending'}</small></div></div>)}</div></article>
      <article className="detail-card"><span className="kicker">Items</span>{items?.map((item) => <div className="summary-item" key={`${item.product_name}-${item.variant_name}`}><span>{item.product_name} · {item.variant_name} × {item.quantity}</span><strong>₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}</strong></div>)}<div className="summary-total"><span>Total</span><strong>₹{Number(order.total).toLocaleString('en-IN')}</strong></div></article>
      <article className="detail-card"><span className="kicker">Delivery</span><p>{String(order.shipping_address?.recipient_name ?? '')}</p><p>{String(order.shipping_address?.line1 ?? '')}{order.shipping_address?.line2 ? `, ${String(order.shipping_address.line2)}` : ''}</p><p>{String(order.shipping_address?.city ?? '')}, {String(order.shipping_address?.state ?? '')} {String(order.shipping_address?.postal_code ?? '')}</p>{order.tracking_number && <div className="tracking-card"><Truck size={18}/><div><strong>{order.carrier ?? 'Carrier'}</strong><span>{order.tracking_number}</span></div></div>}</article>
    </section>
  </main>
}
