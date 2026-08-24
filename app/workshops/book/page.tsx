import Link from 'next/link'
import { CalendarDays, MapPin, Users } from 'lucide-react'
import { workshopConfig, workshopCurriculum } from '@/lib/live-storefront'

export default function WorkshopBookPage() {
  return <main className="container workshop-book-page">
    <Link className="back-link" href="/workshops">← Workshop</Link>
    <section className="checkout-layout">
      <div>
        <span className="kicker">Reserve your place</span><h1>Book the Sunday workshop.</h1>
        <p>₹{workshopConfig.pricePerPerson.toLocaleString('en-IN')} per person · Every Sunday · Bengaluru</p>
        <div className="checkout-card"><h2>Booking details</h2><form action="/api/workshops/book" method="post" className="form-grid">
          <input name="name" required placeholder="Full name" /><input name="phone" required placeholder="WhatsApp / phone" />
          <input name="email" type="email" placeholder="Email" /><input name="participants" type="number" min="1" defaultValue="1" required />
          <textarea name="notes" className="full" rows={4} placeholder="Any preferences or notes?" />
          <button className="button primary full" type="submit">Continue to UPI</button>
        </form></div>
      </div>
      <aside className="order-summary"><span className="kicker">Workshop includes</span><div className="product-benefits">{workshopCurriculum.map((item) => <span key={item}>• {item}</span>)}</div><hr/><div className="trust-note"><CalendarDays size={18}/> Every Sunday</div><div className="trust-note"><MapPin size={18}/> {workshopConfig.location}</div><div className="trust-note"><Users size={18}/> {workshopConfig.pricePerPerson.toLocaleString('en-IN')} INR per participant</div></aside>
    </section>
  </main>
}
