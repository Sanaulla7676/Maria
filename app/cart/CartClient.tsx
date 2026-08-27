'use client'

import { useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import type { CartItem } from '@/lib/types'
import { updateCartQuantity, removeFromCart } from '@/lib/cart-actions'

export default function CartClient({ initialItems = [] }: { initialItems?: CartItem[] }) {
  const [items, setItems] = useState(initialItems)
  const [pending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState<string | null>(null)

  const changeQty = (item: CartItem, quantity: number) => {
    setBusyId(item.id)
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.id !== item.id))
    } else {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity } : i)))
    }
    startTransition(async () => {
      try {
        await updateCartQuantity(item.id, quantity)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update your bag')
      } finally {
        setBusyId(null)
      }
    })
  }

  const remove = (item: CartItem) => {
    setBusyId(item.id)
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    startTransition(async () => {
      try {
        await removeFromCart(item.id)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not remove item')
      } finally {
        setBusyId(null)
      }
    })
  }

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + Number(item.unit_price) * item.quantity, 0), [items])

  if (!items.length) {
    return (
      <main className="container py-24 text-center">
        <ShoppingBag className="mx-auto mb-4 text-[var(--wine)]" size={40} />
        <h2 className="font-display text-3xl">Your bag is empty</h2>
        <Link className="btn btn-primary mt-6 inline-flex" href="/shop">Explore fragrances</Link>
      </main>
    )
  }

  return (
    <main className="container py-16">
      <h1 className="font-display text-4xl mb-8">Your Bag</h1>
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <section className="space-y-4">
          {items.map((item) => (
            <article key={item.id} className="glass rounded-3xl p-5 flex items-center gap-4">
              {item.image_url ? (
                <img src={item.image_url} alt={item.product_name} className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-2xl bg-[color-mix(in_srgb,var(--wine)_12%,transparent)] flex items-center justify-center text-[10px] font-semibold text-[var(--wine)]">
                  MARIA
                </div>
              )}
              <div className="flex-1">
                <p className="eyebrow">{item.variant_label}</p>
                <h2 className="font-display text-xl">{item.product_name}</h2>
                <p className="text-sm text-black/55">₹{Number(item.unit_price).toLocaleString('en-IN')}</p>
                <div className="mt-3 flex items-center gap-4">
                  <div className="flex items-center gap-3 rounded-full border border-[var(--line)] px-3 py-1.5">
                    <button disabled={busyId === item.id} onClick={() => changeQty(item, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <strong className="w-4 text-center">{item.quantity}</strong>
                    <button disabled={busyId === item.id} onClick={() => changeQty(item, Math.min(20, item.quantity + 1))}>
                      <Plus size={14} />
                    </button>
                  </div>
                  <button disabled={busyId === item.id} onClick={() => remove(item)} className="text-sm text-black/50 flex items-center gap-1 hover:text-black/80">
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </div>
              <strong className="font-display text-xl shrink-0">₹{(Number(item.unit_price) * item.quantity).toLocaleString('en-IN')}</strong>
            </article>
          ))}
        </section>

        <aside className="glass rounded-3xl p-6 h-fit space-y-4">
          <p className="eyebrow">Summary</p>
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <div className="flex justify-between text-sm text-black/55">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <hr className="border-[var(--line)]" />
          <div className="flex justify-between">
            <strong>Total</strong>
            <strong>₹{subtotal.toLocaleString('en-IN')}</strong>
          </div>
          <Link href="/checkout" className="btn btn-primary w-full">
            Checkout <ArrowRight size={16} />
          </Link>
        </aside>
      </div>
    </main>
  )
}
