'use client'

import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

export default function ProductCartAction({ productId, variantId, quantity, price }: { productId: string; variantId: string; quantity: number; price: number }) {
  const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function addToCart() {
    setState('loading')
    try {
      const response = await fetch('/api/cart', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'add', productId, variantId, quantity }) })
      if (!response.ok) throw new Error('Unable to add item')
      setState('success')
    } catch {
      setState('error')
    }
  }

  return (
    <button className="button primary" onClick={addToCart} disabled={state === 'loading'}>
      <ShoppingBag size={17} />
      {state === 'loading' ? 'Adding…' : state === 'success' ? 'Added to cart' : state === 'error' ? 'Try again' : `Add to cart · ₹${price.toLocaleString('en-IN')}`}
    </button>
  )
}
