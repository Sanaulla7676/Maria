'use client'

import { useEffect, useState } from 'react'

type CartItem = { id: string; product_name: string; variant_name: string; unit_price: number; quantity: number }

export function CartSync() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let cancelled = false
    fetch('/api/cart', { cache: 'no-store' })
      .then((response) => response.ok ? response.json() : { items: [] })
      .then((data: { items?: CartItem[] }) => {
        if (!cancelled) setCount((data.items ?? []).reduce((sum, item) => sum + item.quantity, 0))
      })
      .catch(() => { if (!cancelled) setCount(0) })
    return () => { cancelled = true }
  }, [])
  return <span aria-live="polite" data-cart-count={count}>{count}</span>
}
