'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'
import type { CartItem, Product } from '@/lib/types'
import { primaryImage, cheapestActiveVariant } from '@/lib/product-helpers'
import { updateCartQuantity, removeFromCart, addToCart } from '@/lib/cart-actions'
import { toggleWishlist } from '@/app/account/wishlist/actions'

export function BagModal({ cart, wishlist }: { cart: CartItem[]; wishlist: Product[] }) {
  const { modal, close } = useUI()
  const isOpen = modal?.name === 'bag'
  const [pending, startTransition] = useTransition()

  const subtotal = cart.reduce((sum, i) => sum + Number(i.unit_price) * i.quantity, 0)

  const changeQty = (id: string, qty: number) => {
    startTransition(async () => {
      try {
        await updateCartQuantity(id, qty)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update bag')
      }
    })
  }

  const remove = (id: string) => {
    startTransition(async () => {
      try {
        await removeFromCart(id)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update bag')
      }
    })
  }

  const moveToBag = (product: Product) => {
    const variant = cheapestActiveVariant(product)
    if (!variant || variant.stock <= 0) return toast.error('This fragrance is currently unavailable')
    startTransition(async () => {
      try {
        await addToCart(product.id, variant.id, 1)
        await toggleWishlist({ productId: product.id })
        toast.success(`${product.name} moved to your bag`)
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not move to bag')
      }
    })
  }

  const removeWishlist = (product: Product) => {
    startTransition(async () => {
      try {
        await toggleWishlist({ productId: product.id })
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Could not update wishlist')
      }
    })
  }

  return (
    <Modal open={isOpen} onClose={close} size="lg">
      <div className="p-8">
        <h3 className="text-xl font-serif font-bold text-wine-950 border-b border-slate-100 pb-3 mb-5">
          Your Bag &amp; Wishlist
        </h3>

        <div className="space-y-3 text-xs">
          <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Bag ({cart.length})</h4>
          {cart.length === 0 ? (
            <p className="text-slate-400 py-4">Your bag is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center space-x-3 min-w-0">
                  {item.image_url ? (
                    <img className="w-10 h-10 rounded-full object-cover shrink-0" src={item.image_url} alt={item.product_name} />
                  ) : (
                    <div className="w-10 h-10 rounded-full wine-gradient shrink-0" />
                  )}
                  <div className="min-w-0">
                    <h5 className="font-semibold text-slate-900 truncate">{item.product_name}</h5>
                    <p className="text-[11px] text-slate-500">₹{Number(item.unit_price).toLocaleString('en-IN')} • {item.variant_label}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button disabled={pending} onClick={() => changeQty(item.id, item.quantity - 1)} className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="font-semibold w-4 text-center">{item.quantity}</span>
                  <button disabled={pending} onClick={() => changeQty(item.id, item.quantity + 1)} className="w-6 h-6 rounded-full border border-slate-300 flex items-center justify-center">
                    <Plus className="h-3 w-3" />
                  </button>
                  <button disabled={pending} onClick={() => remove(item.id)} className="text-rose-500 ml-1">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}

          {cart.length > 0 && (
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 font-semibold text-slate-900">
              <span>Subtotal</span>
              <span>₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
          )}

          <Link
            href="/checkout"
            onClick={close}
            className={`w-full mt-2 flex items-center justify-center gap-2 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition ${
              cart.length ? 'gold-button-gradient text-wine-950' : 'bg-slate-100 text-slate-400 pointer-events-none'
            }`}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Go to Checkout <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="space-y-3 text-xs mt-8">
          <h4 className="font-semibold text-slate-500 uppercase tracking-wider text-[10px]">Wishlist ({wishlist.length})</h4>
          {wishlist.length === 0 ? (
            <p className="text-slate-400 py-4">Nothing saved yet — tap the star on any fragrance.</p>
          ) : (
            wishlist.map((product) => {
              const image = primaryImage(product)
              const variant = cheapestActiveVariant(product)
              return (
                <div key={product.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center space-x-3 min-w-0">
                    {image ? (
                      <img className="w-10 h-10 rounded-full object-cover shrink-0" src={image} alt={product.name} />
                    ) : (
                      <div className="w-10 h-10 rounded-full wine-gradient shrink-0" />
                    )}
                    <div className="min-w-0">
                      <h5 className="font-semibold text-slate-900 truncate">{product.name}</h5>
                      <p className="text-[11px] text-slate-500">{variant ? `₹${Number(variant.price).toLocaleString('en-IN')}` : 'Price on request'}</p>
                    </div>
                  </div>
                  <div className="flex space-x-1.5 shrink-0">
                    <button disabled={pending} onClick={() => moveToBag(product)} className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-semibold">
                      Move to Bag
                    </button>
                    <button disabled={pending} onClick={() => removeWishlist(product)} className="border border-slate-300 px-3 py-1.5 rounded-xl text-slate-600">
                      Remove
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Modal>
  )
}
