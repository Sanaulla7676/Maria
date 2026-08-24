import Link from 'next/link'
import { ArrowLeft, CalendarDays, Users, WalletCards } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminWorkshopsPage() {
  const supabase = await createClient()
  const { data: sessions } = await supabase.from('workshop_sessions').select('*').order('session_date', { ascending: true }).limit(20)
  const { data: bookings } = await supabase.from('workshop_bookings').select('id, session_id, customer_name, phone, participants, total_amount, payment_status, status, created_at').order('created_at', { ascending: false }).limit(100)
  const activeBookings = bookings ?? []
  const totalSeats = activeBookings.reduce((sum, booking) => sum + Number(booking.participants || 0), 0)
  const revenue = activeBookings.filter((b) => b.payment_status === 'verified').reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0)
  return <main className="container admin-page">
    <Link className="back-link" href="/admin"><ArrowLeft size={16}/> Operations</Link>
    <section className="admin-header"><div><span className="kicker">Workshop operations</span><h1>Sunday workshops</h1><p>Manage sessions, reservations and manual UPI verification.</p></div></section>
    <section className="payment-stats"><div><CalendarDays size={18}/><span>Upcoming sessions</span><strong>{sessions?.length ?? 0}</strong></div><div><Users size={18}/><span>Reserved seats</span><strong>{totalSeats}</strong></div><div><WalletCards size={18}/><span>Verified revenue</span><strong>₹{revenue.toLocaleString('en-IN')}</strong></div></section>
    <section className="order-table"><div className="order-row order-head"><span>Booking</span><span>Customer</span><span>Participants</span><span>Total</span><span>Payment</span><span>Status</span></div>
      {activeBookings.map((booking) => <article className="order-row" key={booking.id}><strong>{String(booking.id).slice(0, 8)}</strong><span>{booking.customer_name}<br/>{booking.phone}</span><span>{booking.participants}</span><span>₹{Number(booking.total_amount || 0).toLocaleString('en-IN')}</span><span className="status">{booking.payment_status}</span><span className="status">{booking.status}</span></article>)}
      {!activeBookings.length && <div className="empty-state"><Users size={38}/><h2>No workshop bookings yet</h2><p>Sunday seat reservations will appear here.</p></div>}
    </section>
  </main>
}
