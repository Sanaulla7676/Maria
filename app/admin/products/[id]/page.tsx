'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ArrowLeft, Check, Save } from 'lucide-react'

export default function ProductManagePage({ params }: { params: { id: string } }) {
  const [saved, setSaved] = useState(false)
  const [active, setActive] = useState(true)
  const [featured, setFeatured] = useState(false)
  const [price, setPrice] = useState(600)
  const [stock, setStock] = useState(20)

  async function save() {
    setSaved(false)
    const response = await fetch('/api/admin/products', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: params.id, active, featured, price, stock, variantId: '00000000-0000-0000-0000-000000000000' }),
    })
    if (response.ok) setSaved(true)
  }

  return <main className="container admin-page">
    <Link className="back-link" href="/admin/products"><ArrowLeft size={16}/> Products</Link>
    <section className="admin-header"><div><span className="kicker">Product manager</span><h1>Manage fragrance</h1><p>Update storefront visibility, pricing and stock.</p></div></section>
    <section className="detail-grid">
      <article className="detail-card"><span className="kicker">Visibility</span><h2>Storefront</h2><label className="toggle-row"><span>Active</span><input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} /></label><label className="toggle-row"><span>Featured</span><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} /></label></article>
      <article className="detail-card"><span className="kicker">Variant</span><h2>30ml</h2><div className="form-grid"><label>Price<input type="number" min="0" value={price} onChange={(e) => setPrice(Number(e.target.value))}/></label><label>Stock<input type="number" min="0" value={stock} onChange={(e) => setStock(Number(e.target.value))}/></label></div></article>
    </section>
    <section className="fulfilment-panel"><span className="kicker">Save changes</span><h2>Publish inventory updates</h2><p>Updates are owner-protected and persisted through the server API.</p><button className="button primary" onClick={save}><Save size={16}/> Save product</button>{saved && <div className="success-note"><Check size={16}/> Saved.</div>}</section>
  </main>
}
