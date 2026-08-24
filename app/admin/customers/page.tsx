import Link from 'next/link'
import { ArrowLeft, Mail, MessageCircle, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function AdminCustomersPage() {
  const supabase = await createClient()
  const { data: customers } = await supabase.from('customers').select('id, full_name, phone, email, city, created_at').order('created_at', { ascending: false }).limit(100)
  const rows = customers ?? []
  return <main className="container admin-page">
    <Link className="back-link" href="/admin"><ArrowLeft size={16}/> Operations</Link>
    <section className="admin-header"><div><span className="kicker">Customer CRM</span><h1>Customers</h1><p>Customer records from the live Maria database.</p></div><div className="ops-card-stat"><Users size={18}/><strong>{rows.length}</strong><span>recent customers</span></div></section>
    <section className="order-table">
      <div className="order-row order-head"><span>Customer</span><span>Phone</span><span>Email</span><span>City</span><span>Joined</span></div>
      {rows.map((customer) => <article className="order-row" key={customer.id}><strong>{customer.full_name}</strong><span>{customer.phone}</span><span>{customer.email || '—'}</span><span>{customer.city || '—'}</span><span>{new Date(customer.created_at).toLocaleDateString('en-IN')}</span></article>)}
      {!rows.length && <div className="empty-state"><Users size={38}/><h2>No customers yet</h2><p>Customer accounts will appear here as orders and bookings arrive.</p></div>}
    </section>
    <div className="ops-cards"><article><Mail size={21}/><h2>Email-ready CRM</h2><p>Customer email is available for future transactional and marketing automation.</p></article><article><MessageCircle size={21}/><h2>WhatsApp-ready CRM</h2><p>Phone and WhatsApp data can drive future customer follow-ups.</p></article></div>
  </main>
}
