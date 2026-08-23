import Link from 'next/link'
import { upcomingWorkshop, workshopCurriculum } from '@/lib/maria-business'

const formatDate = (value: string) => new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`))

export default function WorkshopsPage() {
  const session = upcomingWorkshop
  return (
    <main className="container workshop-page">
      <section className="workshop-hero">
        <div>
          <span className="kicker">Sunday Perfumery Workshop</span>
          <h1>Make your own signature fragrance.</h1>
          <p>A hands-on Maria experience covering perfume basics, fragrance notes, blending and personal scent creation. Take your finished perfume home.</p>
          <div className="hero-actions"><Link className="button primary" href="#book">Book Your Seat</Link><Link className="button" href="/events">Private & Group Workshops</Link></div>
        </div>
        <aside className="workshop-ticket">
          <span>UPCOMING SUNDAY</span>
          <strong>{formatDate(session.date)}</strong>
          <b>{session.time}</b>
          <small>₹1,200 per person · Bengaluru</small>
        </aside>
      </section>

      <section className="workshop-grid">
        <article className="workshop-card"><span className="kicker">What you'll learn</span><h2>From notes to your own scent.</h2><ol>{workshopCurriculum.map((item, i) => <li key={item}><b>0{i + 1}</b>{item}</li>)}</ol></article>
        <article className="workshop-card workshop-dark"><span className="kicker">The experience</span><h2>Learn, blend, create, take it home.</h2><p>The workshop is held every Sunday at Maria Perfumes in Bengaluru. After completing the experience, participants receive a certificate.</p><div className="workshop-facts"><div><strong>₹1,200</strong><span>per person</span></div><div><strong>Sunday</strong><span>weekly session</span></div><div><strong>Certificate</strong><span>included</span></div></div></article>
      </section>

      <section id="book" className="workshop-booking">
        <div><span className="kicker">Reserve your place</span><h2>Book a Sunday seat.</h2><p>Choose the number of participants. Payment uses UPI and the booking stays pending until Maria manually verifies the transaction.</p></div>
        <form action="/api/workshops/book" method="post" className="booking-form">
          <input type="hidden" name="sessionId" value={session.id} />
          <label>Full name<input name="name" required placeholder="Your name" /></label>
          <label>WhatsApp / Phone<input name="phone" required placeholder="+91" /></label>
          <label>Email<input name="email" type="email" placeholder="you@example.com" /></label>
          <label>Participants<input name="participants" type="number" min="1" defaultValue="1" required /></label>
          <button className="button primary" type="submit">Continue to UPI Booking</button>
        </form>
      </section>

      <section className="private-workshop"><span className="kicker">Private workshops</span><h2>Bring your own group.</h2><p>Birthday groups, corporate teams, college groups and private celebrations can request a dedicated Maria perfumery session.</p><Link href="/events#event-enquiry">Request a Private Workshop</Link></section>
    </main>
  )
}
