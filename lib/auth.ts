import { createClient } from '@/lib/supabase/server'

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function isOwner(): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('is_owner')
  return data === true
}
