'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

export type CartLine = { id: string; productName: string; size: 30 | 50 | 100; price: number; quantity: number }

export default function CartClient({ initialItems }: { initialItems: CartLine[] }) {
  const [items, setItems] = useState(initialItems)
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items])
  const update = (id: string, delta: number) => setItems((rows) => rows.map((row) => row.id === id ? { ...row, quantity: Math.max(1, Math.min(20, row.quantity + delta)) } : row))
  return <>{items.length ? <div className="cart-layout"><section className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><div className="cart-media">MARIA</div><div className="cart-info"><span>40% PURE OIL</span><h2>{item.productName}</h2><p>{item.size}ml · ₹{item.price.toLocaleString('en-IN')}</p><div className="cart-controls"><div className="quantity-control"><button onClick={() => update(item.id, -1)}><Minus size={14}/></button><strong>{item.quantity}</strong><button onClick={() => update(item.id, 1)}><Plus size={14}/></button></div><button className="text-button" onClick={() => setItems((rows) => rows.filter((row) => row.id !== item.id))}><Trash2 size={14}/> Remove</button></div></div><strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong></article>)}</section><aside className="cart-summary"><span className="kicker">Summary</span><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><hr/><div><strong>Total</strong><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><Link href="/checkout" className="button primary">Checkout <ArrowRight size={16}/></Link></aside></div> : <div className="empty-state"><ShoppingBag size={40}/><h2>Your bag is empty</h2><Link className="button primary" href="/shop">Explore fragrances</Link></div>}</>
}
