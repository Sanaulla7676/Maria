'use client'

import { useState, useTransition } from 'react'
import { Check, Heart, Minus, Plus, ShoppingBag } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import { addToCart } from '@/lib/cart-actions'
import { toggleWishlist } from '@/app/account/wishlist/actions'

export default function ProductDetail({ product, image }: { product: Product; image: string | null }) {
  const variants = (product.product_variants ?? []).filter((v) => v.active).sort((a, b) => a.price - b.price)
  const [variantId, setVariantId] = useState(variants[0]?.id ?? '')
  const [quantity, setQuantity] = useState(1)
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  const variant = variants.find((v) => v.id === variantId) ?? variants[0]
  const inStock = !!variant && variant.stock > 0
  const total = (variant ? Number(variant.price) : 0) * quantity

  const handleAdd = () => {
    if (!variant) return
    startTransition(async () => {
      try {
        await addToCart(product.id, variant.id, quantity)
        toast.success(`${product.name} added to your bag`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Please sign in to add items to your bag')
      }
    })
  }

  const handleSave = () => {
    setSaved((v) => !v)
    startTransition(async () => {
      try {
        await toggleWishlist({ productId: product.id })
      } catch (e) {
        setSaved((v) => !v)
        toast.error(e instanceof Error ? e.message : 'Please sign in to save fragrances')
      }
    })
  }

  return (
    <section className="grid gap-12 md:grid-cols-2">
      <div className="relative">
        {product.badge && (
          <span className="absolute top-3 left-3 z-10 bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
            {product.badge}
          </span>
        )}
        {image ? (
          <img src={image} alt={product.name} className="w-full aspect-[4/5] object-cover rounded-3xl" />
        ) : (
          <div className="placeholder rounded-3xl">
            <span>{product.name.toUpperCase()}</span>
          </div>
        )}
      </div>

      <div>
        <p className="eyebrow">{product.family || 'Signature Perfume'}</p>
        <h1 className="font-display text-4xl mt-2">{product.name}</h1>
        <p className="mt-4 text-black/60 leading-relaxed">
          {product.description || 'A signature Maria Perfumes composition, crafted for lasting wear and expressive projection.'}
        </p>

        {product.notes?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 text-xs">
            {product.notes.map((n) => (
              <span key={n} className="px-3 py-1 rounded-full border border-[var(--line)] text-black/60">{n}</span>
            ))}
          </div>
        )}

        <div className="flex gap-4 mt-6 text-sm text-black/70">
          <span className="flex items-center gap-1.5"><Check size={15} /> Long lasting</span>
          <span className="flex items-center gap-1.5"><Check size={15} /> Good projection</span>
          <span className="flex items-center gap-1.5"><Check size={15} /> IFRA certified</span>
        </div>

        <div className="mt-6">
          <strong className="font-display text-3xl">₹{total.toLocaleString('en-IN')}</strong>
          {variant && !inStock && <span className="ml-3 text-sm text-rose-600 font-semibold">Out of Stock</span>}
        </div>

        {variants.length > 0 && (
          <fieldset className="mt-6">
            <legend className="eyebrow mb-2">Choose size</legend>
            <div className="flex gap-2 flex-wrap">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariantId(v.id)}
                  disabled={v.stock <= 0}
                  className={`px-4 py-2.5 rounded-xl border text-sm text-center disabled:opacity-40 ${
                    v.id === variantId ? 'border-[var(--wine)] bg-[color-mix(in_srgb,var(--wine)_8%,transparent)]' : 'border-[var(--line)]'
                  }`}
                >
                  <div className="font-semibold">{v.size_ml ? `${v.size_ml}ml` : v.label}</div>
                  <div className="text-xs text-black/50">₹{Number(v.price).toLocaleString('en-IN')}</div>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex items-center gap-4 mt-6">
          <span className="text-sm text-black/60">Quantity</span>
          <div className="flex items-center gap-3 rounded-full border border-[var(--line)] px-3 py-1.5">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}><Minus size={15} /></button>
            <strong className="w-4 text-center">{quantity}</strong>
            <button onClick={() => setQuantity((q) => Math.min(20, q + 1))}><Plus size={15} /></button>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-8">
          <button className="btn btn-primary" onClick={handleAdd} disabled={pending || !inStock}>
            <ShoppingBag size={17} /> {inStock ? `Add to bag · ₹${total.toLocaleString('en-IN')}` : 'Sold Out'}
          </button>
          <button
            aria-label="Save fragrance"
            onClick={handleSave}
            disabled={pending}
            className={`btn btn-ghost ${saved ? 'text-[var(--wine)] border-[var(--wine)]' : ''}`}
          >
            <Heart fill={saved ? 'currentColor' : 'none'} size={19} />
          </button>
        </div>
      </div>
    </section>
  )
}
