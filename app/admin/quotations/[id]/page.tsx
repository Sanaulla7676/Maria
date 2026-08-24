import Link from 'next/link'
import { ArrowLeft, FileDown, MessageCircle } from 'lucide-react'
import { createServerClient } from '@/lib/supabase/server'
import { buildWhatsAppShareUrl } from '@/lib/quotation'

export default async function QuotationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createServerClient()
  const { data: quote } = await supabase.from('quotations').select('*').eq('id', id).single()
  if (!quote) return <main className="container admin-page"><Link href="/admin/quotations">← Quotations</Link><h1>Quotation not found.</h1></main>
  const { data: items } = await supabase.from('quotation_items').select('*').eq('quotation_id', id).order('created_at')
  const whatsapp = buildWhatsAppShareUrl(quote.customer_phone || '', quote.quote_code || quote.id, Number(quote.total || 0))
  return <main className="container admin-page quote-print-page">
    <div className="no-print"><Link className="back-link" href="/admin/quotations"><ArrowLeft size={16}/> Quotations</Link></div>
    <section className="quote-paper">
      <header className="quote-brand"><div><span className="kicker">Maria Perfumes</span><h1>Quotation</h1></div><div><strong>{quote.quote_code || quote.id}</strong><p>Valid until {quote.valid_until}</p></div></header>
      <section className="quote-meta"><div><span>Prepared for</span><strong>{quote.customer_name}</strong><p>{quote.customer_phone}{quote.customer_email ? ` · ${quote.customer_email}` : ''}</p></div><div><span>Event</span><strong>{quote.event_type}</strong><p>Status: {quote.status}</p></div></section>
      <table><thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Total</th></tr></thead><tbody>{(items || []).map((item)=><tr key={item.id}><td>{item.description}</td><td>{item.quantity}</td><td>₹{Number(item.unit_price).toLocaleString('en-IN')}</td><td>₹{Number(item.line_total).toLocaleString('en-IN')}</td></tr>)}</tbody><tfoot><tr><td colSpan={3}>Total</td><td>₹{Number(quote.total || 0).toLocaleString('en-IN')}</td></tr></tfoot></table>
      {quote.notes && <section className="quote-notes"><span>Notes</span><p>{quote.notes}</p></section>}
      <footer>Thank you for choosing Maria Perfumes.</footer>
    </section>
    <div className="hero-actions no-print"><button className="button primary" onClick={() => {}}><FileDown size={16}/> Print / Save as PDF</button><a className="button" href={whatsapp} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Share on WhatsApp</a></div>
    <style>{`@media print{.no-print{display:none!important}.quote-paper{box-shadow:none!important;border:0!important}.quote-print-page{padding:0!important}.quote-paper table{break-inside:avoid}} .quote-paper{background:#fff;border:1px solid #e5ddd2;padding:48px;max-width:900px;margin:30px auto}.quote-brand,.quote-meta{display:flex;justify-content:space-between;gap:30px}.quote-brand{border-bottom:1px solid #e5ddd2;padding-bottom:25px}.quote-brand h1{font:400 44px var(--serif);margin:6px 0}.quote-meta{padding:28px 0}.quote-meta span,.quote-notes span{display:block;font-size:10px;letter-spacing:.12em;text-transform:uppercase;opacity:.6}.quote-meta strong{display:block;margin:7px 0}.quote-meta p{margin:0;color:#777}.quote-paper table{width:100%;border-collapse:collapse}.quote-paper th,.quote-paper td{text-align:left;padding:13px;border-bottom:1px solid #eee}.quote-paper th{font-size:11px;text-transform:uppercase;letter-spacing:.08em}.quote-paper tfoot td{font-weight:700;border-bottom:0;padding-top:20px}.quote-notes{border-top:1px solid #e5ddd2;margin-top:25px;padding-top:20px}.quote-paper footer{margin-top:45px;color:#777;font-size:12px}`}</style>
  </main>
}
