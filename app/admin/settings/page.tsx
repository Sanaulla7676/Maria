import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { getSiteSettings } from '@/lib/theme'
import '../admin.css'
import SettingsForm from './SettingsForm'

export default async function AdminSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')
  const { data: owner } = await supabase.rpc('is_owner')
  if (!owner) redirect('/')

  const settings = await getSiteSettings()

  return (
    <main className="admin-shell">
      <header className="admin-header compact">
        <div>
          <Link className="back-link" href="/admin"><ArrowLeft size={16} /> Admin dashboard</Link>
          <span className="kicker">Site design</span>
          <h1>Theme &amp; Branding</h1>
          <p>Colors, fonts, button shape and brand name — changes apply across the whole storefront immediately.</p>
        </div>
      </header>
      <SettingsForm initial={settings} />
    </main>
  )
}
