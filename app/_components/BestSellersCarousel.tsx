'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'
import type { Product } from '@/lib/types'
import { primaryImage, cheapestActiveVariant } from '@/lib/product-helpers'
import { useUI } from '@/app/_components/ui/UIProvider'

export function BestSellersCarousel({ products }: { products: Product[] }) {
  const { open } = useUI()
  const featured = (products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products).slice(0, 8)
  const [index, setIndex] = useState(0)
  const lastWheel = useRef(0)

  useEffect(() => {
    if (index > featured.length - 1) setIndex(0)
  }, [featured.length, index])

  if (!featured.length) return null

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + featured.length) % featured.length)

  const handleWheel = (e: React.WheelEvent) => {
    const now = Date.now()
    if (now - lastWheel.current < 400) return
    if (Math.abs(e.deltaY) < 15) return
    lastWheel.current = now
    go(e.deltaY > 0 ? 1 : -1)
  }

  return (
    <section className="bg-[#fbf8f3] py-20 border-b border-champagne-300/40 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center mb-12">
        <span className="text-champagne-600 font-semibold text-xs uppercase tracking-[0.3em]">
          Maria Perfumes · {featured.length} Trending
        </span>
        <h2 className="text-4xl sm:text-5xl font-serif font-bold text-wine-950 mt-3">Best Selling Fragrances</h2>
        <p className="text-slate-500 text-sm mt-2">The scents Bengaluru keeps coming back for.</p>
      </div>

      <div
        className="relative h-[420px] sm:h-[460px] select-none outline-none"
        style={{ perspective: 1400 }}
        tabIndex={0}
        onWheel={handleWheel}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(1)
          if (e.key === 'ArrowLeft') go(-1)
        }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.15}
          onDragEnd={(_e, info) => {
            if (info.offset.x < -60) go(1)
            else if (info.offset.x > 60) go(-1)
          }}
        >
          {featured.map((product, i) => {
            let offset = i - index
            if (offset > featured.length / 2) offset -= featured.length
            if (offset < -featured.length / 2) offset += featured.length
            const abs = Math.abs(offset)
            if (abs > 3) return null
            const image = primaryImage(product)
            const variant = cheapestActiveVariant(product)

            return (
              <motion.div
                key={product.id}
                className="absolute w-[220px] sm:w-[260px] h-[340px] sm:h-[400px] rounded-2xl overflow-hidden shadow-2xl bg-slate-800"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                  x: offset * 150,
                  scale: 1 - abs * 0.14,
                  rotateY: offset * -22,
                  zIndex: 10 - abs,
                  opacity: abs > 2.5 ? 0 : 1,
                  filter: abs === 0 ? 'grayscale(0)' : 'grayscale(0.85) brightness(0.75)',
                }}
                transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                onClick={() => (abs === 0 ? open({ name: 'product', product }) : setIndex(i))}
              >
                {image ? (
                  <img src={image} alt={product.name} className="h-full w-full object-cover pointer-events-none" draggable={false} />
                ) : (
                  <div className="h-full w-full wine-gradient flex items-center justify-center pointer-events-none">
                    <span className="font-serif text-champagne-200 text-lg text-center px-4">{product.name}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 pt-10">
                  {abs === 0 && product.badge && (
                    <span className="inline-flex items-center gap-1 gold-button-gradient text-wine-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1.5">
                      <Sparkles className="h-2.5 w-2.5" /> {product.badge}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-white text-base sm:text-lg leading-tight">{product.name}</h3>
                  <p className="text-champagne-300 text-[11px] mt-0.5">{product.family || 'Signature Perfume'}</p>
                  {abs === 0 && variant && (
                    <p className="text-white/90 text-xs font-semibold mt-1">₹{Number(variant.price).toLocaleString('en-IN')}</p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-8">
        <span className="text-wine-900 font-serif font-bold text-sm">
          {String(index + 1).padStart(2, '0')} / {String(featured.length).padStart(2, '0')}
        </span>
        <div className="flex items-center gap-4">
          <button
            onClick={() => go(-1)}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center text-slate-500 hover:border-wine-800 hover:text-wine-800 transition"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            {featured.map((_, i) => (
              <span
                key={i}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === index ? 'w-6 bg-champagne-500' : 'w-3 bg-slate-300'
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => go(1)}
            aria-label="Next"
            className="w-10 h-10 rounded-full bg-wine-900 flex items-center justify-center text-white hover:bg-wine-950 hover:scale-105 transition"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Drag · Scroll · Arrows</span>
      </div>
    </section>
  )
}
