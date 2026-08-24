import Link from 'next/link'

const sections = [
  ['Shipping', 'Orders are processed after payment verification. Delivery timelines depend on destination and courier availability. Tracking details are shared once the order is shipped.'],
  ['Returns & exchanges', 'Contact Maria promptly if an order arrives damaged or incorrect. Keep the original packaging and order reference available for verification.'],
  ['Payments', 'Maria currently supports UPI payment with manual transaction-reference verification. An order is confirmed only after payment is verified.'],
  ['Workshops & events', 'Workshop bookings and event enquiries are subject to availability. Event quotations are confirmed separately based on date, guest count, location and customization requirements.'],
  ['Privacy', 'Information submitted for orders, workshops and event enquiries is used to fulfil the requested service and communicate with the customer.'],
]

export default function PoliciesPage() {
  return <main className="container policy-page"><Link className="back-link" href="/">← Maria</Link><section className="policy-hero"><span className="kicker">Maria · Customer information</span><h1>Policies & customer care</h1><p>Clear expectations for orders, payments, delivery, workshops and events.</p></section><div className="policy-list">{sections.map(([title,body])=><article key={title}><span className="kicker">Maria policy</span><h2>{title}</h2><p>{body}</p></article>)}</div></main>
}
