import type { Product } from '@/lib/types'

export const MARIA_BOTTLE_IMAGE =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/68b3ce37-06f1-4cb2-8192-c830549bf3c4.jpg'

export function primaryImage(product: Product): string | null {
  const sorted = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return sorted[0]?.image_url ?? null
}

export function cheapestActiveVariant(product: Product) {
  const active = (product.product_variants ?? []).filter((v) => v.active && v.stock > 0)
  if (!active.length) return (product.product_variants ?? []).filter((v) => v.active)[0] ?? null
  return active.reduce((min, v) => (v.price < min.price ? v : min), active[0])
}
