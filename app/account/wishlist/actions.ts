'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const inputSchema = z.object({ productId: z.string().uuid() })

export async function toggleWishlist(input: unknown) {
  const parsed = inputSchema.parse(input)
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Authentication required')
  const { data: existing } = await supabase.from('wishlists').select('user_id').eq('user_id', user.id).eq('product_id', parsed.productId).maybeSingle()
  if (existing) await supabase.from('wishlists').delete().eq('user_id', user.id).eq('product_id', parsed.productId)
  else await supabase.from('wishlists').insert({ user_id: user.id, product_id: parsed.productId })
  return { saved: !existing }
}
