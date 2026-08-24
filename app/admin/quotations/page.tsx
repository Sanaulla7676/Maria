import Link from 'next/link'
import { FileText, Plus, ArrowUpRight } from 'lucide-react'

const quotes = [
  { id: 'QT-0001', client: 'Example Event', type: 'Return Gifts', guests: 100, value: '₹0', status: 'New' },
  { id: 'QT-0002', client: 'Example Corporate', type: 'Workshop', guests: 25, value: '₹0', status: 'Quoted' },
]

export default function QuotationsPage() {
  return <main className="container admin-page">
    <Link className="back-link" href="/admin">← Admin dashboard</Link>
    <section className="admin-header"><div><span className="kicker">Event commerce</span><h1>Quotations.</h1><p>Turn event enquiries into structured quotes and follow-ups.</p></div><Link className="button primary" href="/admin/quotations/new"><Plus size={15}/> New quotation</Link></section>
    <section className="order-table"><div className="order-row order-head"><span>Quote</span><span>Client</span><span>Type</span><span>Guests</span><span>Value</span><span>Status</span><span /></div>{quotes.map((quote)=><article className="order-row" key={quote.id}><strong>{quote.id}</strong><span>{quote.client}</span><span>{quote.type}</span><span>{quote.guests}</span><span>{quote.value}</span><span className="status">{quote.status}</span><Link href={`/admin/quotations/${quote.id}`}><ArrowUpRight size={16}/></Link></article>)}</section>
    <div className="empty-state"><FileText size={34}/><h2>Quotation engine foundation ready</h2><p>Next persistence step will calculate line items, margins, taxes and final quote totals from Supabase.</p></div>
  </main>
}
