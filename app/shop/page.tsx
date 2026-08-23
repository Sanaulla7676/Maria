'use client'

import Link from 'next/link'
import { Heart, Search, ShoppingBag, SlidersHorizontal } from 'lucide-react'
import { useMemo, useState } from 'react'

const products = [
  'Fucking Fabulous','Oud Wood','Ombré Leather','Tuscan Leather','Lost Cherry','Café Rose','Black Orchid','Noir Extreme','Bitter Peach','Tobacco Vanille','Pancholi Absolute','Grey Vetiver','Neroli',
].map((name, index) => ({ id: `maria-${index + 1}`, name, price: 600, category: 'Signature Perfumes', accord: ['Woody','Amber','Leather','Floral'][index % 4] }))

export default function ShopPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [accord, setAccord] = useState('All')
  const filtered = useMemo(() => products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) && (category === 'All' || p.category === category) && (accord === 'All' || p.accord === accord)), [query, category, accord])

  return <main className="container shop-page">
    <section className="shop-hero"><span className="kicker">Maria Signature</span><h1>Find your signature.</h1><p>40% concentration, pure oil perfumes crafted for lasting wear and expressive projection.</p></section>
    <section className="shop-toolbar">
      <label className="search-box"><Search size={17}/><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fragrances" /></label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}><option>All</option><option>Signature Perfumes</option><option>Customized Perfumes</option></select>
      <select value={accord} onChange={(e) => setAccord(e.target.value)}><option>All</option><option>Woody</option><option>Amber</option><option>Leather</option><option>Floral</option></select>
      <button className="button"><SlidersHorizontal size={16}/> Filters</button>
    </section>
    <div className="product-grid">
      {filtered.map((product) => <article className="product-card" key={product.id}>
        <div className="product-media"><span className="product-badge">40% PURE OIL</span><button aria-label={`Save ${product.name}`}><Heart size={18}/></button><div className="product-placeholder">MARIA</div></div>
        <div className="product-copy"><span>{product.accord}</span><h2>{product.name}</h2><p>12h long lasting · Good projection</p><strong>From ₹600</strong><Link href={`/product/${product.id}`} className="button primary"><ShoppingBag size={15}/> View fragrance</Link></div>
      </article>)}
    </div>
  </main>
}
