'use client'

import { useTransition } from 'react'
import { Minus, Plus } from 'lucide-react'
import { adjustStock } from './actions'

export function BulkStockControls({ variantId, stock }: { variantId: string; stock: number }) {
  const [pending, startTransition] = useTransition()
  const change = (delta: number) => startTransition(async () => { await adjustStock(variantId, delta) })
  return <div className="inline-flex items-center gap-2">
    <button disabled={pending} type="button" className="icon-button" onClick={() => change(-1)} aria-label="Decrease stock"><Minus size={14}/></button>
    <strong className={stock <= 5 ? 'stock-low' : ''}>{stock}</strong>
    <button disabled={pending} type="button" className="icon-button" onClick={() => change(1)} aria-label="Increase stock"><Plus size={14}/></button>
  </div>
}
