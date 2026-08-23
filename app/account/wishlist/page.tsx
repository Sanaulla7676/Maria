'use client'

import Link from 'next/link'
import { Heart, ShoppingBag, X } from 'lucide-react'
import { useState } from 'react'

const initialSaved = ['Oud Wood','Ombré Leather','Lost Cherry','Neroli']

export default function WishlistPage() {
  const [items, setItems] = useState(initialSaved)
  return <main className="container account-page">
    <Link className="back-link" href="/account">← My Maria</Link>
    <section className="account-hero compact"><span className="kicker">Wishlist</span><h1>Saved for later.</h1><p>Your favourite fragrances, ready when you are.</p></section>
    {items.length > 0 ? <section className="wishlist-grid">{items.map((name) => <article className="product-card" key={name}><div className="product-media"><button aria-label={`Remove ${name}`} onClick={() => setItems((current) => current.filter((item) => item !== name))}><X size={18}/></button><div className="product-placeholder">MARIA</div></div><div className="product-copy"><span>40% PURE OIL</span><h2>{name}</h2><p>12h long lasting · Good projection</p><strong>From ₹600</strong><Link href={`/product/${encodeURIComponent(name)}`} className="button primary"><ShoppingBag size={15}/> View fragrance</Link></div></article>)}</section> : <div className="empty-state"><Heart size={40}/><h2>Your wishlist is empty</h2><Link className="button primary" href="/shop">Explore perfumes</Link></div>}
  </main>
}
