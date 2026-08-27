import Link from 'next/link'
import { ArrowLeft, CheckCircle2, FileText, Search, ShieldCheck } from 'lucide-react'
import '../admin.css'
import ProductManager from '../ProductManager'

// Only genuinely unbuilt sections stay here — payments, events, workshops, products,
// orders and customers all have real dedicated pages under app/admin/*/page.tsx now,
// which Next.js routes to in preference to this catch-all.
const sections: Record<string, { title: string; description: string; columns: string[]; rows: string[][] }> = {
  inventory: { title: 'Inventory', description: 'Keep variant-level stock visible across the Maria catalogue. Use Products for full stock editing.', columns: ['SKU', 'Product', 'Variant', 'Stock'], rows: [] },
  analytics: { title: 'Analytics', description: 'The next layer will connect these cards to live Supabase aggregates.', columns: ['Metric', 'Current', 'Target', 'Trend'], rows: [['Conversion', '—', '—', 'Connect data'], ['Average order value', '—', '—', 'Connect data']] },
}

export default async function AdminSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params
  if (section === 'products') {
    return <main className="admin-shell"><header className="admin-header compact"><div><Link className="back-link" href="/admin"><ArrowLeft size={16} /> Admin dashboard</Link><span className="kicker">Maria Operations</span><h1>Product control centre</h1><p>Upload media, manage merchandising, edit variants, pricing, inventory and storefront visibility.</p></div></header><ProductManager /></main>
  }
  const data = sections[section] ?? sections.inventory
  return (
    <main className="admin-shell">
      <header className="admin-header compact"><div><Link className="back-link" href="/admin"><ArrowLeft size={16} /> Admin dashboard</Link><span className="kicker">Maria Operations</span><h1>{data.title}</h1><p>{data.description}</p></div></header>
      <div className="admin-toolbar"><div className="search-box"><Search size={17} /><input placeholder={`Search ${data.title.toLowerCase()}...`} /></div><button className="button"><FileText size={16} /> Export</button></div>
      <section className="admin-card data-card"><div className="table-wrap"><table><thead><tr>{data.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{data.rows.map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{j === row.length - 1 ? <span className="status-pill"><CheckCircle2 size={14} />{cell}</span> : cell}</td>)}</tr>)}</tbody></table></div></section>
      <section className="admin-note"><ShieldCheck size={19} /><div><strong>Production-ready direction</strong><span>Connect this view to Supabase using the existing @supabase/ssr client and enforce role-based access with RLS. The UI deliberately stays independent of database queries so the backend can be wired without redesigning the operations surface.</span></div></section>
    </main>
  )
}
