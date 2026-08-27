import Link from 'next/link'
import { FileText, Plus, ArrowUpRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import '../admin.css'

export default async function QuotationsPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('quotations')
    .select('id, quote_code, event_type, status, total, valid_until')
    .order('created_at', { ascending: false })
  const quotes = data ?? []

  return (
    <main className="container admin-page">
      <Link className="back-link" href="/admin">← Admin dashboard</Link>
      <section className="admin-header">
        <div><span className="kicker">Event commerce</span><h1>Quotations.</h1><p>Turn event enquiries into structured quotes and follow-ups.</p></div>
        <Link className="button primary" href="/admin/quotations/new"><Plus size={15} /> New quotation</Link>
      </section>
      {quotes.length > 0 ? (
        <section className="order-table">
          <div className="order-row order-head"><span>Quote</span><span>Event Type</span><span>Valid Until</span><span>Total</span><span>Status</span><span /></div>
          {quotes.map((quote) => (
            <article className="order-row" key={quote.id}>
              <strong>{quote.quote_code}</strong>
              <span>{quote.event_type}</span>
              <span>{quote.valid_until ? new Date(quote.valid_until).toLocaleDateString('en-IN') : '—'}</span>
              <span>₹{Number(quote.total).toLocaleString('en-IN')}</span>
              <span className={`status ${quote.status}`}>{quote.status}</span>
              <Link href={`/admin/quotations/${quote.id}`}><ArrowUpRight size={16} /></Link>
            </article>
          ))}
        </section>
      ) : (
        <div className="empty-state">
          <FileText size={34} />
          <h2>No quotations yet</h2>
          <p>Create a quotation for a customer following up on an event enquiry.</p>
        </div>
      )}
    </main>
  )
}
