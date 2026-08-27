'use client'

import { useState, useTransition } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import type { Product } from '@/lib/types'
import { primaryImage, cheapestActiveVariant } from '@/lib/product-helpers'
import { useUI } from '@/app/_components/ui/UIProvider'
import { toggleWishlist } from '@/app/account/wishlist/actions'
import { addToCart } from '@/lib/cart-actions'
import { AddToCartButton } from '@/app/_components/ui/AddToCartButton'

export function ProductCard({
  product,
  isLoggedIn,
  isWishlisted,
}: {
  product: Product
  isLoggedIn: boolean
  isWishlisted: boolean
}) {
  const { open } = useUI()
  const [saved, setSaved] = useState(isWishlisted)
  const [pending, startTransition] = useTransition()

  const image = primaryImage(product)
  const variant = cheapestActiveVariant(product)
  const inStock = !!variant && variant.stock > 0
  const original = variant ? Number(variant.price) * 2 : null

  const handleBookmark = () => {
    if (!isLoggedIn) return open({ name: 'auth', mode: 'sign-in' })
    setSaved((v) => !v)
    startTransition(async () => {
      try {
        await toggleWishlist({ productId: product.id })
      } catch (e) {
        setSaved((v) => !v)
        toast.error(e instanceof Error ? e.message : 'Could not update wishlist')
      }
    })
  }

  const handleOrder = async () => {
    if (!isLoggedIn) return open({ name: 'auth', mode: 'sign-in' })
    if (!variant || !inStock) return
    try {
      await addToCart(product.id, variant.id, 1)
      toast.success(`${product.name} added to your bag`)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not add to bag')
      throw e
    }
  }

  return (
    <div className="profile-card bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
      <div className="relative w-full h-48 sm:h-56 bg-slate-100 overflow-hidden">
        {image ? (
          <img
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500"
            src={image}
            alt={product.name}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 wine-gradient text-champagne-200">
            <span className="font-serif text-lg tracking-wide px-4 text-center">{product.name}</span>
            <span className="text-[9px] uppercase tracking-widest text-champagne-400/80">Photo coming soon</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow">
            {product.badge}
          </span>
        )}
        <button
          onClick={handleBookmark}
          disabled={pending}
          className="absolute top-2 right-2 w-7 h-7 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 hover:text-champagne-600 transition shadow"
        >
          <Star className={`h-3.5 w-3.5 ${saved ? 'fill-champagne-500 text-champagne-500' : ''}`} />
        </button>
        {variant && (
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
            {variant.size_ml ? `${variant.size_ml}ml` : variant.label}
          </div>
        )}
      </div>

      <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[9px] uppercase font-extrabold text-champagne-600 tracking-wider block">
            {product.family || 'Signature Perfume'}
          </span>
          <h3 className="font-serif font-bold text-base text-slate-900 leading-snug line-clamp-1 mt-0.5">
            {product.name}
          </h3>
          {product.review_count > 0 && (
            <div className="flex items-center gap-1.5 mt-1 text-[11px]">
              <span className="bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5">
                {product.rating.toFixed(1)} <Star className="h-2 w-2 fill-current" />
              </span>
              <span className="text-slate-400 text-[10px]">({product.review_count} reviews)</span>
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-2 line-clamp-2 font-light leading-relaxed">
            {product.description || (product.notes?.length ? product.notes.join(', ') : 'A signature Maria Perfumes composition.')}
          </p>
        </div>
        <div>
          <div className="flex items-baseline gap-2 mt-2 pt-2 border-t border-slate-100">
            {variant ? (
              <>
                <span className="text-base font-serif font-bold text-wine-900">₹{Number(variant.price).toLocaleString('en-IN')}</span>
                {original && <span className="text-xs text-slate-400 line-through">₹{original.toLocaleString('en-IN')}</span>}
                {!inStock && <span className="text-[10px] font-bold text-rose-600">Out of Stock</span>}
              </>
            ) : (
              <span className="text-xs text-slate-400">Price on request</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1.5 mt-3">
            <button
              onClick={() => open({ name: 'product', product })}
              className="w-full border border-slate-200 hover:border-wine-800 text-slate-700 text-[11px] font-semibold py-2 rounded-xl text-center transition"
            >
              Details
            </button>
            <AddToCartButton
              onAdd={handleOrder}
              soldOut={!inStock}
              idleLabel="Order"
              className="w-full text-[11px] font-semibold py-2 rounded-xl shadow-sm disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
