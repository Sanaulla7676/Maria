import { z } from 'zod'

export const profileSchema = z.object({
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(15),
})

export const addressSchema = z.object({
  label: z.string().trim().min(1).max(40),
  recipient_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(10).max(15),
  line1: z.string().trim().min(3).max(160),
  line2: z.string().trim().max(160).optional().or(z.literal('')),
  city: z.string().trim().min(2).max(80),
  state: z.string().trim().min(2).max(80),
  postal_code: z.string().trim().regex(/^\d{6}$/),
  country: z.string().trim().min(2).max(60).default('India'),
  is_default: z.boolean().default(false),
})

export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
