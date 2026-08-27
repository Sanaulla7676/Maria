import { createClient } from '@/lib/supabase/server'
import { DEFAULT_SETTINGS, type SiteSettings } from '@/lib/theme-config'

export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle()
    if (!data) return DEFAULT_SETTINGS
    return {
      primary_color: data.primary_color ?? DEFAULT_SETTINGS.primary_color,
      accent_color: data.accent_color ?? DEFAULT_SETTINGS.accent_color,
      button_radius: data.button_radius ?? DEFAULT_SETTINGS.button_radius,
      heading_font: data.heading_font ?? DEFAULT_SETTINGS.heading_font,
      body_font: data.body_font ?? DEFAULT_SETTINGS.body_font,
      site_name: data.site_name ?? DEFAULT_SETTINGS.site_name,
      tagline: data.tagline ?? DEFAULT_SETTINGS.tagline,
    }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export { buildThemeCss } from '@/lib/theme-config'
