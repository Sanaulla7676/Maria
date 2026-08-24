'use client'

import Link from 'next/link'
import { ArrowLeft, ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useState } from 'react'

const sizes = [30, 50, 100] as const

export default function NewProductPage() {
  const [variants, setVariants] = useState(sizes.map((size) => ({ size, price: size === 30 ? 600 : size === 50 ? 1000 : 1800, stock: 0, active: true })))
  return <main className="container admin-page">
    <Link className="back-link" href="/admin/products"><ArrowLeft size={16}/> Products</Link>
    <section className="admin-header"><div><span className="kicker">Catalog management</span><h1>Add fragrance</h1><p>Create a product and its sellable size variants.</p></div><button className="button primary"><Save size={16}/> Save product</button></section>
    <section className="detail-grid">
      <article className="detail-card"><span className="kicker">Product</span><div className="form-grid"><label>Product name<input placeholder="e.g. Oud Wood"/></label><label>Slug<input placeholder="oud-wood"/></label><label>Category<select defaultValue="Signature Perfumes"><option>Signature Perfumes</option><option>Customized Perfumes</option></select></label><label>Family<input placeholder="Woody / Amber"/></label><label className="wide">Description<textarea rows={5} placeholder="Fragrance description"/></label></div></article>
      <article className="detail-card"><span className="kicker">Media</span><div className="upload-drop"><ImagePlus size={28}/><strong>Product images</strong><span>Upload JPG, PNG or WebP</span><button className="button"><Plus size={15}/> Add image</button></div></article>
    </section>
    <section className="detail-card variants-editor"><div className="section-head"><div><span className="kicker">Variants</span><h2>Size, price & stock</h2></div><button className="button" onClick={() => setVariants((v) => [...v, { size: 0, price: 0, stock: 0, active: true }])}><Plus size={15}/> Add variant</button></div>
      {variants.map((variant, index) => <div className="variant-row" key={index}><select value={variant.size} onChange={(e) => setVariants((v) => v.map((x,i)=>i===index?{...x,size:Number(e.target.value)}:x))}>{sizes.map((size)=><option key={size} value={size}>{size}ml</option>)}</select><label>Price<input type="number" min="0" value={variant.price} onChange={(e)=>setVariants((v)=>v.map((x,i)=>i===index?{...x,price:Number(e.target.value)}:x))}/></label><label>Stock<input type="number" min="0" value={variant.stock} onChange={(e)=>setVariants((v)=>v.map((x,i)=>i===index?{...x,stock:Number(e.target.value)}:x))}/></label><label className="toggle"><input type="checkbox" checked={variant.active} onChange={(e)=>setVariants((v)=>v.map((x,i)=>i===index?{...x,active:e.target.checked}:x))}/> Active</label><button className="icon-button" title="Remove variant" onClick={()=>setVariants((v)=>v.filter((_,i)=>i!==index))}><Trash2 size={17}/></button></div>)}
    </section>
  </main>
}
