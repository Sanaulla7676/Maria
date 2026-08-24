import Link from 'next/link'
import { ArrowRight, PackageSearch } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return <main className="container account-page"><section className="empty-state"><PackageSearch size={40}/><h2>Sign in to view orders</h2><Link className="button primary" href="/auth">Sign in</Link></section></main>
  }

  const { data: orders } = await supabase.from('customer_orders').select('id,status,payment_status,total,created_at,tracking_number,carrier').eq('user_id', user.id).order('created_at', { ascending: false })

  return <main className="container account-page">
    <Link className="back-link" href="/account">← My Maria</Link>
    <section className="account-hero compact"><span className="kicker">Orders</span><h1>Your Maria orders.</h1><p>Payment, preparation, shipping and delivery, all in one place.</p></section>
    {orders?.length ? <section className="order-history-list">{orders.map((order) => <article className="order-history-card" key={order.id}><div><span className="kicker">Order</span><h2>{order.id.slice(0, 8).toUpperCase()}</h2><p>{new Date(order.created_at).toLocaleDateString('en-IN')} · ₹{Number(order.total).toLocaleString('en-IN')}</p></div><div><span className="status">{order.payment_status}</span><span className="status">{order.status}</span>{order.tracking_number && <p>{order.carrier ?? 'Carrier'} · {order.tracking_number}</p>}</div><Link href={`/account/orders/${order.id}`} aria-label={`View order ${order.id}`}><ArrowRight size={18}/></Link></article>)}</section> : <section className="empty-state"><PackageSearch size={40} strokeWidth={1.4}/><h2>No orders yet</h2><p>Browse the signature collection and your first order will appear here.</p><Link className="button primary" href="/shop">Explore perfumes <ArrowRight size={16}/></Link></section>}
  </main>
}
