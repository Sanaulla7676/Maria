import Link from 'next/link'
import { Bell, CheckCircle2, PackageCheck } from 'lucide-react'

const demoEvents = [
  { title: 'Payment verified', message: 'Your Maria payment has been verified.', icon: CheckCircle2 },
  { title: 'Order processing', message: 'Your fragrance is being prepared.', icon: PackageCheck },
]

export default function NotificationsPage() {
  return (
    <main className="container account-page">
      <Link className="back-link" href="/account">← My Maria</Link>
      <section className="account-hero compact">
        <span className="kicker">Notifications</span>
        <h1>Stay close to your order.</h1>
        <p>Payment, fulfilment and delivery updates will appear here.</p>
      </section>
      <section className="notification-list">
        {demoEvents.map(({ title, message, icon: Icon }) => (
          <article className="notification-item" key={title}>
            <Icon size={22} strokeWidth={1.7} />
            <div><h2>{title}</h2><p>{message}</p></div>
            <Bell size={16} />
          </article>
        ))}
      </section>
    </main>
  )
}
