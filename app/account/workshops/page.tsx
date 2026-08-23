import Link from 'next/link'
import { CalendarDays, Sparkles } from 'lucide-react'

export default function WorkshopBookingsPage() {
  return (
    <main className="container account-page">
      <Link className="back-link" href="/account">← My Maria</Link>
      <section className="account-hero compact"><span className="kicker">Workshop bookings</span><h1>Your perfume-making sessions.</h1><p>Confirmed Sunday workshop bookings and certificates will appear here.</p></section>
      <section className="empty-state"><CalendarDays size={40} strokeWidth={1.4}/><h2>No workshop bookings yet</h2><p>Join the next Sunday session and learn to blend your own personal fragrance.</p><Link className="button primary" href="/workshops"><Sparkles size={16}/> View workshops</Link></section>
    </main>
  )
}
