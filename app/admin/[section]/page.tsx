import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileText, Search, ShieldCheck } from 'lucide-react'
import '../admin.css'

const sections: Record<string, { title: string; description: string; columns: string[]; rows: string[][] }> = {
  payments: { title: 'UPI verification', description: 'Review customer-submitted UTRs before marking orders or bookings as paid.', columns: ['Reference', 'Customer', 'Amount', 'Status'], rows: [['MAR-1024', 'Customer #527', '₹1,800', 'Pending'], ['WS-204', 'Workshop booking', '₹2,400', 'Pending']] },
  events: { title: 'Event enquiries', description: 'Manage return-gift stalls, bulk orders, customizations and quotation requests.', columns: ['Lead', 'Event', 'Date', 'Status'], rows: [['Wedding enquiry', 'Wedding', '18 Sep', 'New'], ['Corporate gifting', 'Corporate', '04 Oct', 'Quote needed']] },
  inventory: { title: 'Inventory', description: 'Keep variant-level stock visible across the Maria catalogue.', columns: ['SKU', 'Product', 'Variant', 'Stock'], rows: [['MAR-FF-30', 'Fucking Fabulous', '30ml', '24'], ['MAR-OW-50', 'Oud Wood', '50ml', '8']] },
  workshops: { title: 'Workshop bookings', description: 'Track Sunday registrations, attendees, payment verification and certificates.', columns: ['Booking', 'People', 'Payment', 'Certificate'], rows: [['WS-204', '2', 'Pending', 'Not issued'], ['WS-205', '1', 'Paid', 'Not issued']] },
  products: { title: 'Products', description: 'Manage fragrance intelligence, variants, pricing and product media.', columns: ['Product', 'Collection', 'Variants', 'Status'], rows: [['Fucking Fabulous', 'Signature', '3', 'Published'], ['Oud Wood', 'Signature', '3', 'Published']] },
  orders: { title: 'Orders', description: 'Review purchases, payment status, fulfilment and customer details.', columns: ['Order', 'Customer', 'Total', 'Status'], rows: [['MAR-1024', 'Customer #527', '₹1,800', 'Processing'], ['MAR-1023', 'Customer #491', '₹1,000', 'Paid']] },
  customers: { title: 'Customers', description: 'Customer profiles, addresses, orders, event leads and workshop history.', columns: ['Customer', 'Orders', 'Events', 'Last active'], rows: [['Customer #527', '4', '1', 'Today'], ['Customer #491', '2', '0', 'Yesterday']] },
  analytics: { title: 'Analytics', description: 'The next layer will connect these cards to live Supabase aggregates.', columns: ['Metric', 'Current', 'Target', 'Trend'], rows: [['Conversion', '—', '—', 'Connect data'], ['Average order value', '—', '—', 'Connect data']] },
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  const data = sections[section] ?? sections.orders
  return (
    <main className="admin-shell">
      <header className="admin-header compact"><div><Link className="back-link" href="/admin"><ArrowLeft size={16} /> Admin dashboard</Link><span className="kicker">Maria Operations</span><h1>{data.title}</h1><p>{data.description}</p></div></header>
      <div className="admin-toolbar"><div className="search-box"><Search size={17} /><input placeholder={`Search ${data.title.toLowerCase()}...`} /></div><button className="button"><FileText size={16} /> Export</button></div>
      <section className="admin-card data-card"><div className="table-wrap"><table><thead><tr>{data.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{data.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{j === row.length - 1 ? <span className="status-pill"><CheckCircle2 size={14} />{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="admin-note"><ShieldCheck size={19} /><div><strong>Production-ready direction</strong><span>Connect this view to Supabase using the existing @supabase/ssr client and enforce role-based access with RLS. The UI deliberately stays independent of database queries so the backend can be wired without redesigning the operations surface.</span></div></section>
    </main>
  )
}
