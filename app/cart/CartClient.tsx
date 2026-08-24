'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'

type CartLine = { id: string; productName: string; variantName: string; unitPrice: number; quantity: number }

export default function CartClient({ initialItems = [] }: { initialItems?: CartLine[] }) {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  async function loadCart() {
    setLoading(true)
    const response = await fetch('/api/cart', { cache: 'no-store' })
    const data = await response.json().catch(() => ({ items: [] }))
    setItems(Array.isArray(data.items) ? data.items : [])
    setLoading(false)
  }

  useEffect(() => { void loadCart() }, [])

  async function mutate(action: 'update' | 'remove', item: CartLine, quantity: number) {
    setBusy(item.id)
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action, cartItemId: item.id, quantity, productName: item.productName, variantName: item.variantName, unitPrice: item.unitPrice }),
    })
    await loadCart()
    setBusy(null)
  }

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0), [items])
  if (loading) return <div className="empty-state"><ShoppingBag size={36}/><h2>Loading your bag…</h2></div>

  return <>{items.length ? <div className="cart-layout"><section className="cart-items">{items.map((item) => <article className="cart-item" key={item.id}><div className="cart-media">MARIA</div><div className="cart-info"><span>40% PURE OIL</span><h2>{item.productName}</h2><p>{item.variantName} · ₹{item.unitPrice.toLocaleString('en-IN')}</p><div className="cart-controls"><div className="quantity-control"><button disabled={busy===item.id} onClick={() => void mutate('update', item, Math.max(1,item.quantity-1))}><Minus size={14}/></button><strong>{item.quantity}</strong><button disabled={busy===item.id} onClick={() => void mutate('update', item, Math.min(20,item.quantity+1))}><Plus size={14}/></button></div><button className="text-button" disabled={busy===item.id} onClick={() => void mutate('remove', item, 0)}><Trash2 size={14}/> Remove</button></div></div><strong>₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}</strong></article>)}</section><aside className="cart-summary"><span className="kicker">Summary</span><div><span>Subtotal</span><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><div><span>Shipping</span><span>Calculated at checkout</span></div><hr/><div><strong>Total</strong><strong>₹{subtotal.toLocaleString('en-IN')}</strong></div><Link href="/checkout" className="button primary">Checkout <ArrowRight size={16}/></Link></aside></div> : <div className="empty-state"><ShoppingBag size={40}/><h2>Your bag is empty</h2><Link className="button primary" href="/shop">Explore fragrances</Link></div>}</>
}
