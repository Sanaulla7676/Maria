import Link from 'next/link'
import { ArrowLeft, CalendarDays, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminEventsPage() {
  const supabase = await createClient()
  const { data: enquiries } = await supabase.from('event_enquiries').select('*').order('created_at', { ascending: false }).limit(100)
  const rows = enquiries ?? []
  return <main className="container admin-page">
    <Link className="back-link" href="/admin"><ArrowLeft size={16}/> Operations</Link>
    <section className="admin-header"><div><span className="kicker">Events & gifting CRM</span><h1>Event enquiries</h1><p>Track return-gift, stall and private-event enquiries from one workspace.</p></div><div className="ops-card-stat"><CalendarDays size={18}/><strong>{rows.length}</strong><span>recent enquiries</span></div></section>
    <section className="order-table"><div className="order-row order-head"><span>Enquiry</span><span>Contact</span><span>Event</span><span>Guests</span><span>Date</span><span>Status</span></div>
      {rows.map((item) => <article className="order-row" key={item.id}><strong>{item.enquiry_code}</strong><span>{item.name}<br/>{item.phone}</span><span>{item.event_type || 'Private event'}</span><span>{item.guest_count ?? '—'}</span><span>{item.event_date ? new Date(item.event_date).toLocaleDateString('en-IN') : '—'}</span><span className="status">{item.status}</span></article>)}
      {!rows.length && <div className="empty-state"><FileText size={38}/><h2>No event enquiries yet</h2><p>New event requests will appear here for quotation and follow-up.</p></div>}
    </section>
  </main>
}
