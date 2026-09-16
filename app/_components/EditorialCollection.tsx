'use client'

import type { Product } from '@/lib/types'
import { primaryImage, cheapestActiveVariant } from '@/lib/product-helpers'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Reveal } from '@/app/_components/ui/Reveal'
import { TiltCard } from '@/app/_components/ui/TiltCard'

export function EditorialCollection({ products }: { products: Product[] }) {
  const { open } = useUI()
  const featured = (products.filter((p) => p.featured).length ? products.filter((p) => p.featured) : products).slice(0, 8)

  return (
    <section className="editorial py-24 px-[5vw]" style={{ background: 'var(--editorial-paper)' }}>
      <div className="grid grid-cols-1 lg:grid-cols-[270px_1fr] gap-9">
        <Reveal className="lg:sticky lg:top-[130px] h-max pt-2">
          <div className="text-[10px] uppercase tracking-[0.34em] mb-3.5" style={{ color: '#765020' }}>
            The collection
          </div>
          <div className="font-editorial-serif" style={{ fontWeight: 500, fontSize: 'clamp(40px,4vw,64px)', lineHeight: 0.88, letterSpacing: '-0.04em' }}>
            Signature
            <br />
            Fragrances
          </div>
          <p className="mt-5 text-sm leading-[1.7]" style={{ color: '#63594d' }}>
            A curated range of long-lasting, designer-inspired perfumes made for every mood and moment.
          </p>
          <a href="#matches-section" className="inline-flex gap-3 items-center mt-5 text-[11px] font-semibold uppercase tracking-[0.08em]">
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-white" style={{ background: '#bf9144' }}>→</span>
            View all fragrances
          </a>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {featured.map((product, i) => {
            const image = primaryImage(product)
            const variant = cheapestActiveVariant(product)
            return (
              <Reveal key={product.id} delay={i * 0.05}>
                <TiltCard
                  onClick={() => open({ name: 'product', product })}
                  className="editorial-sheen cursor-pointer rounded-[17px] overflow-hidden"
                >
                  <div
                    className="rounded-[17px] overflow-hidden"
                    style={{ border: '1px solid rgba(34,28,20,.1)', background: '#fbf8f1', boxShadow: '0 12px 40px rgba(34,23,9,.05)' }}
                  >
                    <div
                      className="aspect-[4/5] flex items-center justify-center"
                      style={{ background: 'linear-gradient(160deg,#ece4d4,#faf7f0)' }}
                    >
                      {image ? (
                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                      ) : (
                        <div
                          className="w-[56%] flex items-center justify-center text-center px-2 relative"
                          style={{
                            aspectRatio: '0.66',
                            borderRadius: '12px 12px 14px 14px',
                            boxShadow: '0 22px 35px rgba(0,0,0,.2), inset 0 0 0 1px rgba(255,255,255,.25)',
                            background: `linear-gradient(135deg, ${bottleGradient(i)})`,
                          }}
                        >
                          <span className="font-editorial-serif text-white text-xs leading-tight px-2 py-3 rounded" style={{ background: 'rgba(17,14,11,.9)', border: '1px solid rgba(210,170,98,.55)' }}>
                            MARIA
                            <br />
                            PERFUMES
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <div className="font-editorial-serif text-[22px] leading-none" style={{ fontWeight: 500 }}>{product.name}</div>
                      <div className="text-[9px] uppercase tracking-[0.12em] mt-1.5" style={{ color: '#7d7469' }}>{product.family || 'Signature Perfumes'}</div>
                      <div className="flex justify-between items-center mt-3.5">
                        <span className="text-sm font-semibold">{variant ? `₹${Number(variant.price).toLocaleString('en-IN')}` : 'On request'}</span>
                        <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm" style={{ background: '#997026' }}>+</span>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function bottleGradient(i: number) {
  const gradients = ['#f7db98,#bc7923', '#262626,#070707', '#804016,#d08331', '#9f2e31,#4a0d0f']
  return gradients[i % gradients.length]
}
