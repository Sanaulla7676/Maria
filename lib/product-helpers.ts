import type { Product, Variant } from '@/lib/types'

export const MARIA_BOTTLE_IMAGE =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/dd0086ce-5140-4414-9e2e-1b2067071f11.jpg'

export const MARIA_VARIANT_PRICES = [
  { sizeMl: 30, label: '30ml', price: 600 },
  { sizeMl: 50, label: '50ml', price: 1000 },
  { sizeMl: 100, label: '100ml', price: 1800 },
] as const

export function getVariantPrice(variant: Pick<Variant, 'size_ml' | 'label' | 'price'> | null | undefined): number {
  if (!variant) return 0
  const label = variant.label.toLowerCase()
  const labelSize = label.includes('100') ? 100 : label.includes('50') ? 50 : label.includes('30') ? 30 : null
  const sizeMl = variant.size_ml ?? labelSize
  const standardPrice = MARIA_VARIANT_PRICES.find((item) => item.sizeMl === sizeMl)
  return standardPrice?.price ?? Number(variant.price)
}

export function primaryImage(product: Product): string | null {
  const sorted = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return sorted[0]?.image_url ?? null
}

export function cheapestActiveVariant(product: Product) {
  const active = (product.product_variants ?? []).filter((v) => v.active && v.stock > 0)
  if (!active.length) return (product.product_variants ?? []).filter((v) => v.active)[0] ?? null
  return active.reduce((min, v) => (getVariantPrice(v) < getVariantPrice(min) ? v : min), active[0])
}
