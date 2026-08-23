import Link from 'next/link'
import { ArrowRight, PackageSearch } from 'lucide-react'

export default function OrdersPage() {
  return (
    <main className="container account-page">
      <Link className="back-link" href="/account">← My Maria</Link>
      <section className="account-hero compact">
        <span className="kicker">Orders</span>
        <h1>Your Maria orders.</h1>
        <p>Once you sign in, your orders and UPI verification status will appear here.</p>
      </section>
      <section className="empty-state">
        <PackageSearch size={40} strokeWidth={1.4} />
        <h2>No orders to show yet</h2>
        <p>Browse the signature collection and your first order will have a home here.</p>
        <Link className="button primary" href="/shop">Explore perfumes <ArrowRight size={16} /></Link>
      </section>
    </main>
  )
}
