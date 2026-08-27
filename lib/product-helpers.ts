import type { Product } from '@/lib/types'

export function primaryImage(product: Product): string | null {
  const sorted = [...(product.product_images ?? [])].sort((a, b) => a.sort_order - b.sort_order)
  return sorted[0]?.image_url ?? null
}

export function cheapestActiveVariant(product: Product) {
  const active = (product.product_variants ?? []).filter((v) => v.active && v.stock > 0)
  if (!active.length) return (product.product_variants ?? []).filter((v) => v.active)[0] ?? null
  return active.reduce((min, v) => (v.price < min.price ? v : min), active[0])
}
