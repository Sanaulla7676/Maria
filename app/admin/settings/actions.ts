'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'

const settingsSchema = z.object({
  primary_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accent_color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  button_radius: z.enum(['pill', 'rounded', 'soft', 'sharp']),
  heading_font: z.enum(['cormorant', 'playfair', 'marcellus', 'dmserif']),
  body_font: z.enum(['jakarta', 'inter', 'poppins', 'manrope']),
  site_name: z.string().trim().min(1).max(80),
  tagline: z.string().trim().max(120),
})

export async function updateSiteSettings(input: unknown) {
  const value = settingsSchema.parse(input)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) throw new Error('Owner access required')

  const { error } = await supabase
    .from('site_settings')
    .update({ ...value, updated_at: new Date().toISOString() })
    .eq('id', 1)
  if (error) throw new Error(error.message)

  revalidatePath('/', 'layout')
}
