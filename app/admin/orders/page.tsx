import Link from 'next/link'
import { ArrowRight, PackageCheck, Search, Truck } from 'lucide-react'

const demoOrders = [
  { id: 'MAR-10021', customer: 'Customer', total: '₹1,800', status: 'Processing', payment: 'Verified', tracking: 'Not assigned' },
  { id: 'MAR-10020', customer: 'Customer', total: '₹1,000', status: 'Shipped', payment: 'Verified', tracking: 'Awaiting carrier' },
  { id: 'MAR-10019', customer: 'Customer', total: '₹600', status: 'Payment Pending', payment: 'Submitted', tracking: '—' },
]

export default function AdminOrdersPage() {
  return (
    <main className="container admin-page">
      <section className="admin-header">
        <div><span className="kicker">Maria Operations</span><h1>Orders</h1><p>Search, review and move customer orders through fulfilment.</p></div>
        <Link className="button" href="/admin">Admin dashboard</Link>
      </section>
      <section className="admin-toolbar">
        <label className="search-box"><Search size={17} /><input placeholder="Search order, customer or UTR" /></label>
        <select defaultValue="all"><option value="all">All statuses</option><option>Payment Pending</option><option>Processing</option><option>Shipped</option><option>Delivered</option><option>Cancelled</option></select>
      </section>
      <section className="order-table" aria-label="Orders">
        <div className="order-row order-head"><span>Order</span><span>Customer</span><span>Total</span><span>Payment</span><span>Fulfilment</span><span>Tracking</span><span /></div>
        {demoOrders.map((order) => (
          <article className="order-row" key={order.id}>
            <strong>{order.id}</strong><span>{order.customer}</span><span>{order.total}</span><span className="status success">{order.payment}</span><span className="status">{order.status}</span><span>{order.tracking}</span><Link href={`/admin/orders/${order.id}`} aria-label={`Open ${order.id}`}><ArrowRight size={17} /></Link>
          </article>
        ))}
      </section>
      <section className="ops-cards">
        <article><PackageCheck size={22} /><h2>Fulfilment queue</h2><p>Process verified orders, add packing notes and move orders to shipping.</p></article>
        <article><Truck size={22} /><h2>Shipping</h2><p>Add carrier and tracking details, then notify the customer.</p></article>
      </section>
    </main>
  )
}
