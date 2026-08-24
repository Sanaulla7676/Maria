'use client'

import Link from 'next/link'
import { ArrowLeft, Minus, Plus, Save } from 'lucide-react'
import { useState } from 'react'

const initialRows = [
  { name: 'Fucking Fabulous', variant: '30ml', price: 600, stock: 12 },
  { name: 'Fucking Fabulous', variant: '50ml', price: 1000, stock: 8 },
  { name: 'Fucking Fabulous', variant: '100ml', price: 1800, stock: 4 },
  { name: 'Oud Wood', variant: '30ml', price: 600, stock: 15 },
  { name: 'Oud Wood', variant: '50ml', price: 1000, stock: 11 },
]

export default function BulkInventoryPage() {
  const [rows, setRows] = useState(initialRows)
  const updateStock = (index: number, delta: number) => setRows((current) => current.map((row, i) => i === index ? { ...row, stock: Math.max(0, row.stock + delta) } : row))
  return <main className="container admin-page">
    <Link className="back-link" href="/admin/products"><ArrowLeft size={16}/> Products</Link>
    <section className="admin-header"><div><span className="kicker">Inventory operations</span><h1>Bulk stock editor</h1><p>Adjust multiple product variants without opening every product one by one.</p></div><button className="button primary"><Save size={16}/> Save changes</button></section>
    <section className="order-table">
      <div className="order-row order-head"><span>Product</span><span>Variant</span><span>Price</span><span>Stock</span><span>Quick adjust</span></div>
      {rows.map((row, index) => <article className="order-row" key={`${row.name}-${row.variant}`}><strong>{row.name}</strong><span>{row.variant}</span><span>₹{row.price.toLocaleString('en-IN')}</span><span className={row.stock <= 5 ? 'status warning' : 'status'}>{row.stock}</span><div className="quantity-control"><button onClick={() => updateStock(index,-1)}><Minus size={14}/></button><strong>{row.stock}</strong><button onClick={() => updateStock(index,1)}><Plus size={14}/></button></div></article>)}
    </section>
  </main>
}
