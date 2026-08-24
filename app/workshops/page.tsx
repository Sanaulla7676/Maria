import Link from 'next/link'
import { CalendarDays, Check, MapPin, Sparkles } from 'lucide-react'
import { workshopConfig, workshopCurriculum } from '@/lib/live-storefront'

export default function WorkshopsPage() {
  return <main className="container workshop-page">
    <section className="event-hero"><div><span className="kicker">Sunday Perfumery Workshop</span><h1>Create a fragrance that is yours.</h1><p>A hands-on perfume experience in Bengaluru, designed for beginners and fragrance lovers.</p><div className="hero-actions"><Link className="button primary" href="/workshops/book">Book your seat · ₹{workshopConfig.pricePerPerson.toLocaleString('en-IN')}</Link><Link className="button" href="/shop">Explore perfumes</Link></div></div><div className="event-panel"><CalendarDays size={24}/><strong>Every {workshopConfig.day}</strong><small><MapPin size={14}/> {workshopConfig.location}</small></div></section>
    <section className="service-grid">{workshopCurriculum.map((step, index) => <article key={step}><span>STEP {index + 1}</span><h2>{step}</h2><p>Learn, create and experience the fragrance from start to finish.</p></article>)}</section>
    <section className="enquiry"><div><span className="kicker">What's included</span><h2>Five steps. One personal fragrance.</h2><p>Your workshop includes guided blending and your finished perfume to take home.</p></div><div className="product-benefits"><span><Check size={15}/> Beginner friendly</span><span><Check size={15}/> Guided blending</span><span><Check size={15}/> Take perfume home</span><span><Sparkles size={15}/> ₹{workshopConfig.pricePerPerson.toLocaleString('en-IN')} per person</span></div></section>
  </main>
}
