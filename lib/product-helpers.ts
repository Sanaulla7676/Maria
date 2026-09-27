import type { Product } from '@/lib/types'

export const MARIA_BOTTLE_IMAGE =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/dd0086ce-5140-4414-9e2e-1b2067071f11.jpg'

export function primaryImage(product: Product): string | null {
  const sorted = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return sorted[0]?.image_url ?? null
}

export function cheapestActiveVariant(product: Product) {
  const active = (product.product_variants ?? []).filter((v) => v.active && v.stock > 0)
  if (!active.length) return (product.product_variants ?? []).filter((v) => v.active)[0] ?? null
  return active.reduce((min, v) => (v.price < min.price ? v : min), active[0])
}
