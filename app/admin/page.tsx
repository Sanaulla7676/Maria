import Link from 'next/link'
import { ArrowUpRight, CalendarDays, ClipboardList, Package, Users, WalletCards } from 'lucide-react'

const stats = [
  { label: 'Orders', value: '18', note: '+12% this week', icon: Package },
  { label: 'Revenue', value: '₹42,500', note: 'UPI + COD', icon: WalletCards },
  { label: 'Customers', value: '527', note: '+27 this month', icon: Users },
  { label: 'Workshop bookings', value: '18', note: 'Next Sunday', icon: CalendarDays },
]

const queue = [
  ['UPI verification', '6 payments waiting for review', '/admin/payments'],
  ['Event enquiries', '12 quotation requests', '/admin/events'],
  ['Low stock', '4 variants need attention', '/admin/inventory'],
  ['Workshop', '18 registrations for Sunday', '/admin/workshops'],
]

export default function AdminPage() {
  return (
    <main className="admin-shell">
      <header className="admin-header">
        <div><span className="kicker">Maria Operations</span><h1>Good evening.</h1><p>One command centre for commerce, events and workshops.</p></div>
        <Link className="button" href="/">View storefront <ArrowUpRight size={16} /></Link>
      </header>

      <section className="admin-stats">
        {stats.map(({ label, value, note, icon: Icon }) => <article key={label} className="admin-stat"><Icon size={20} /><span>{label}</span><strong>{value}</strong><small>{note}</small></article>)}
      </section>

      <section className="admin-grid">
        <div className="admin-card">
          <div className="admin-card-title"><div><span className="kicker">Needs attention</span><h2>Operations queue</h2></div><ClipboardList size={20} /></div>
          <div className="queue-list">{queue.map(([title, note, href]) => <Link href={href} key={title} className="queue-row"><div><strong>{title}</strong><span>{note}</span></div><ArrowUpRight size={17} /></Link>)}</div>
        </div>
        <div className="admin-card">
          <span className="kicker">Quick actions</span><h2>Run Maria from here.</h2>
          <div className="quick-grid">
            <Link href="/admin/products">Manage products</Link><Link href="/admin/orders">Review orders</Link>
            <Link href="/admin/events">Event enquiries</Link><Link href="/admin/workshops">Workshop bookings</Link>
            <Link href="/admin/customers">Customers</Link><Link href="/admin/analytics">Analytics</Link>
          </div>
        </div>
      </section>

      <section className="admin-card roadmap-card"><span className="kicker">Today</span><h2>Business pulse</h2><div className="pulse"><div><b>₹42,500</b><span>gross sales</span></div><div><b>6</b><span>payments pending</span></div><div><b>12</b><span>event leads</span></div><div><b>18</b><span>Sunday seats</span></div></div></section>
    </main>
  )
}
