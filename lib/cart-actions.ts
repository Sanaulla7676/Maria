import { z } from 'zod'

export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  productName: z.string().min(1),
  variantName: z.string().min(1),
  unitPrice: z.number().nonnegative(),
  quantity: z.number().int().positive().max(20),
})

export const cartMutationSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid(),
  quantity: z.number().int().positive().max(20),
})

export type CartItemInput = z.infer<typeof cartItemSchema>
export type CartMutationInput = z.infer<typeof cartMutationSchema>
