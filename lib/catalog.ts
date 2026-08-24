import { z } from 'zod'

export const fragranceVariantSchema = z.object({
  id: z.string().uuid(),
  product_id: z.string().uuid(),
  name: z.string().min(1),
  size_ml: z.union([z.literal(30), z.literal(50), z.literal(100)]),
  price: z.number().nonnegative(),
  sku: z.string().nullable().optional(),
  is_active: z.boolean(),
})

export const fragranceCatalog = [
  'Fucking Fabulous','Oud Wood','Ombré Leather','Tuscan Leather','Lost Cherry','Café Rose','Black Orchid','Noir Extreme','Bitter Peach','Tobacco Vanille','Pancholi Absolute','Grey Vetiver','Neroli',
] as const

export const fragrancePricing = { 30: 600, 50: 1000, 100: 1800 } as const

export function variantPrice(size: 30 | 50 | 100) { return fragrancePricing[size] }
