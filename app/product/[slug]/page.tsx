'use client'

import Link from 'next/link'
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { useMemo, useState } from 'react'

const catalog = ['Fucking Fabulous','Oud Wood','Ombré Leather','Tuscan Leather','Lost Cherry','Café Rose','Black Orchid','Noir Extreme','Bitter Peach','Tobacco Vanille','Pancholi Absolute','Grey Vetiver','Neroli']
const pricing = { 30: 600, 50: 1000, 100: 1800 } as const

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const productName = catalog.find((name) => slug === `maria-${catalog.indexOf(name) + 1}`) ?? decodeURIComponent(slug)
  return <ProductDetail name={productName} />
}

function ProductDetail({ name }: { name: string }) {
  const [size, setSize] = useState<30 | 50 | 100>(30)
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState(false)
  const price = useMemo(() => pricing[size] * quantity, [size, quantity])

  return <main className="container product-detail-page">
    <div className="breadcrumbs"><Link href="/shop">Shop</Link><span>/</span><span>{name}</span></div>
    <section className="product-detail">
      <div className="product-detail-media"><span className="product-badge">40% PURE OIL</span><div className="product-placeholder">MARIA</div></div>
      <div className="product-detail-copy">
        <span className="kicker">Signature Perfume</span><h1>{name}</h1><p className="product-lede">Pure oil format with 40% concentration, designed for long-lasting wear and good projection.</p>
        <div className="product-benefits"><span><Check size={15}/>12 hours long lasting</span><span><Check size={15}/>Good projection</span><span><Check size={15}/>Pure oil format</span></div>
        <div className="price-block"><strong>₹{price.toLocaleString('en-IN')}</strong><span>{size}ml · ₹{pricing[size].toLocaleString('en-IN')}</span></div>
        <fieldset><legend>Choose size</legend><div className="size-options">{([30,50,100] as const).map((value) => <button key={value} className={size === value ? 'selected' : ''} onClick={() => setSize(value)}>{value}ml<span>₹{pricing[value].toLocaleString('en-IN')}</span></button>)}</div></fieldset>
        <div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={15}/></button><strong>{quantity}</strong><button onClick={() => setQuantity(quantity + 1)}><Plus size={15}/></button></div></div>
        <div className="product-actions"><button className="button primary" onClick={() => {}}><ShoppingBag size={17}/> Add to cart · ₹{price.toLocaleString('en-IN')}</button><button className={saved ? 'icon-button active' : 'icon-button'} aria-label="Save fragrance" onClick={() => setSaved(!saved)}><Heart fill={saved ? 'currentColor' : 'none'} size={19}/></button></div>
      </div>
    </section>
  </main>
}
