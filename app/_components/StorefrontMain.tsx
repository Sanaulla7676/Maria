'use client'

import { useMemo, useState } from 'react'
import { Flame, Wand2, ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { cheapestActiveVariant } from '@/lib/product-helpers'
import { FilterBar, type Filters } from '@/app/_components/FilterBar'
import { Sidebar } from '@/app/_components/Sidebar'
import { ProductCard } from '@/app/_components/ProductCard'
import { useUI } from '@/app/_components/ui/UIProvider'

export function StorefrontMain({
  products,
  isLoggedIn,
  wishlistIds,
}: {
  products: Product[]
  isLoggedIn: boolean
  wishlistIds: string[]
}) {
  const { open } = useUI()
  const families = useMemo(() => Array.from(new Set(products.map((p) => p.family).filter(Boolean))) as string[], [products])
  const genders = useMemo(() => Array.from(new Set(products.map((p) => p.gender).filter(Boolean))) as string[], [products])

  const [filters, setFilters] = useState<Filters>({ family: 'all', minPrice: 0, gender: 'all', query: '' })
  const [bestSellersOnly, setBestSellersOnly] = useState(false)

  const filtered = useMemo(() => {
    const q = filters.query.trim().toLowerCase()
    return products.filter((p) => {
      const variant = cheapestActiveVariant(p)
      const price = variant ? Number(variant.price) : 0
      const matchesFamily = filters.family === 'all' || p.family === filters.family
      const matchesPrice = price >= filters.minPrice
      const matchesGender = filters.gender === 'all' || p.gender === filters.gender
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.notes ?? []).some((n) => n.toLowerCase().includes(q)) ||
        (p.description ?? '').toLowerCase().includes(q)
      const matchesBestSeller = !bestSellersOnly || p.featured
      return matchesFamily && matchesPrice && matchesGender && matchesQuery && matchesBestSeller
    })
  }, [products, filters, bestSellersOnly])

  return (
    <>
      <FilterBar filters={filters} setFilters={setFilters} families={families} genders={genders} />

      <main id="matches-section" className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex-grow grid grid-cols-1 lg:grid-cols-4 gap-8">
        <Sidebar bestSellersOnly={bestSellersOnly} setBestSellersOnly={setBestSellersOnly} />

        <section className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-2 flex space-x-2 overflow-x-auto text-xs font-semibold shadow-sm">
            <button className="px-5 py-3 rounded-xl bg-wine-50 text-wine-900 border border-wine-100 flex items-center gap-2 whitespace-nowrap">
              <Flame className="h-3.5 w-3.5 text-champagne-600" /> Full Catalog ({filtered.length})
            </button>
            <button
              onClick={() => open({ name: 'scent-matcher' })}
              className="px-5 py-3 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition"
            >
              <Wand2 className="h-3.5 w-3.5 text-champagne-500" /> Note Recommendation
            </button>
            <button
              onClick={() => open({ name: 'bag' })}
              className="px-5 py-3 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center gap-2 whitespace-nowrap transition"
            >
              <ShoppingBag className="h-3.5 w-3.5 text-blue-500" /> Bag &amp; Wishlist
            </button>
          </div>

          {filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400">
              <p className="font-serif text-2xl text-slate-600">No fragrances match those filters.</p>
              <p className="text-xs mt-2">Try widening your search or clearing a filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-5">
              {filtered.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isLoggedIn={isLoggedIn}
                  isWishlisted={wishlistIds.includes(product.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  )
}
