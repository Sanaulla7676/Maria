import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowUpRight, CalendarDays, ClipboardList, Package, Users, WalletCards } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import './admin.css'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) redirect('/')

  const [ordersRes, pendingRes, lowStockRes, enquiriesRes, customersRes] = await Promise.all([
    supabase.from('customer_orders').select('total', { count: 'exact' }),
    supabase.from('customer_orders').select('id', { count: 'exact', head: true }).eq('payment_status', 'submitted'),
    supabase.from('product_variants').select('id', { count: 'exact', head: true }).lte('stock', 5).eq('active', true),
    supabase.from('event_enquiries').select('id', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('customer_orders').select('user_id'),
  ])

  const grossSales = (ordersRes.data ?? []).reduce((sum, o) => sum + Number(o.total), 0)
  const orderCount = ordersRes.count ?? 0
  const pendingPayments = pendingRes.count ?? 0
  const lowStock = lowStockRes.count ?? 0
  const newEnquiries = enquiriesRes.count ?? 0
  const uniqueCustomers = new Set((customersRes.data ?? []).map((o) => o.user_id)).size

  const stats = [
    { label: 'Orders', value: String(orderCount), note: 'All time', icon: Package },
    { label: 'Gross Sales', value: `₹${grossSales.toLocaleString('en-IN')}`, note: 'UPI verified + pending', icon: WalletCards },
    { label: 'Customers', value: String(uniqueCustomers), note: 'Placed at least one order', icon: Users },
    { label: 'Event Enquiries', value: String(newEnquiries), note: 'Awaiting follow-up', icon: CalendarDays },
  ]

  const queue = [
    ['UPI verification', `${pendingPayments} payment${pendingPayments === 1 ? '' : 's'} waiting for review`, '/admin/orders'],
    ['Event enquiries', `${newEnquiries} new lead${newEnquiries === 1 ? '' : 's'}`, '/admin/events'],
    ['Low stock', `${lowStock} variant${lowStock === 1 ? '' : 's'} need attention`, '/admin/products'],
  ]

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><span className="kicker">Maria Operations</span><h1>Good to see you.</h1><p>One command centre for commerce, events and workshops.</p></div>
        <Link className="button" href="/">View storefront <ArrowUpRight size={16} /></Link>
      </header>
      <section className="admin-stats">
        {stats.map(({ label, value, note, icon: Icon }) => <article key={label} className="admin-stat"><Icon size={20} /><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
      </section>
      <section className="admin-grid">
        <div className="admin-card"><div className="admin-card-title"><div><span className="kicker">Needs attention</span><h2>Operations queue</h2></div><ClipboardList size={20} /></div><div className="queue-list">{queue.map(([title, note, href]) => <Link href={href} key={title} className="queue-row"><div><strong>{title}</strong><span>{note}</span></div><ArrowUpRight size={17} /></Link>)}</div></div>
        <div className="admin-card"><span className="kicker">Quick actions</span><h2>Run Maria from here.</h2><div className="quick-grid"><Link href="/admin/products">Manage products</Link><Link href="/admin/orders">Review orders</Link><Link href="/admin/events">Event enquiries</Link><Link href="/admin/workshops">Workshop bookings</Link><Link href="/admin/customers">Customers</Link><Link href="/admin/analytics">Analytics</Link><Link href="/admin/quotations">Quotations</Link><Link href="/admin/settings">Theme &amp; Branding</Link></div></div>
      </section>
    </main>
  )
}
