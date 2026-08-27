'use client'

import { useMemo, useState } from 'react'
import { Loader2, Palette, Save } from 'lucide-react'
import { toast } from 'sonner'
import {
  BODY_FONTS,
  BUTTON_RADIUS_OPTIONS,
  HEADING_FONTS,
  generateAccentScale,
  generatePrimaryScale,
  type SiteSettings,
} from '@/lib/theme-config'
import { updateSiteSettings } from './actions'

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial)
  const [saving, setSaving] = useState(false)

  const wine = useMemo(() => generatePrimaryScale(settings.primary_color), [settings.primary_color])
  const champagne = useMemo(() => generateAccentScale(settings.accent_color), [settings.accent_color])
  const radiusPx = BUTTON_RADIUS_OPTIONS.find((r) => r.value === settings.button_radius)?.px ?? '9999px'

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) => setSettings((s) => ({ ...s, [key]: value }))

  const save = async () => {
    setSaving(true)
    try {
      await updateSiteSettings(settings)
      toast.success('Theme updated — refresh the storefront to see it live')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save theme settings')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="detail-grid" style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <article className="detail-card">
          <span className="kicker">Brand identity</span>
          <div className="form-grid">
            <label>Site name<input value={settings.site_name} onChange={(e) => set('site_name', e.target.value)} /></label>
            <label>Tagline<input value={settings.tagline} onChange={(e) => set('tagline', e.target.value)} /></label>
          </div>
        </article>

        <article className="detail-card">
          <span className="kicker">Colors</span>
          <div className="form-grid">
            <label>
              Primary color (wine)
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={settings.primary_color} onChange={(e) => set('primary_color', e.target.value)} style={{ width: 44, height: 40, padding: 2, border: '1px solid #ded6cd', borderRadius: 10 }} />
                <input value={settings.primary_color} onChange={(e) => set('primary_color', e.target.value)} style={{ flex: 1 }} />
              </div>
            </label>
            <label>
              Accent color (gold)
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input type="color" value={settings.accent_color} onChange={(e) => set('accent_color', e.target.value)} style={{ width: 44, height: 40, padding: 2, border: '1px solid #ded6cd', borderRadius: 10 }} />
                <input value={settings.accent_color} onChange={(e) => set('accent_color', e.target.value)} style={{ flex: 1 }} />
              </div>
            </label>
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 14, borderRadius: 10, overflow: 'hidden' }}>
            {Object.values(wine).map((c) => <div key={c} style={{ height: 28, flex: 1, background: c }} />)}
          </div>
          <div style={{ display: 'flex', gap: 4, marginTop: 4, borderRadius: 10, overflow: 'hidden' }}>
            {Object.values(champagne).map((c) => <div key={c} style={{ height: 28, flex: 1, background: c }} />)}
          </div>
        </article>

        <article className="detail-card">
          <span className="kicker">Button shape</span>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {BUTTON_RADIUS_OPTIONS.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => set('button_radius', opt.value)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: opt.px,
                    border: settings.button_radius === opt.value ? `2px solid ${wine[800]}` : '1px solid #ded6cd',
                    background: settings.button_radius === opt.value ? '#faf5f5' : '#fff',
                    fontSize: 12,
                    cursor: 'pointer',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="detail-card">
          <span className="kicker">Fonts</span>
          <div className="form-grid">
            <label>Heading font
              <select value={settings.heading_font} onChange={(e) => set('heading_font', e.target.value as SiteSettings['heading_font'])}>
                {HEADING_FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </label>
            <label>Body font
              <select value={settings.body_font} onChange={(e) => set('body_font', e.target.value as SiteSettings['body_font'])}>
                {BODY_FONTS.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </label>
          </div>
        </article>

        <button className="button primary" onClick={save} disabled={saving} style={{ alignSelf: 'flex-start' }}>
          {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />} Save theme
        </button>
      </div>

      <article className="detail-card" style={{ position: 'sticky', top: 24 }}>
        <span className="kicker" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Palette size={13} /> Live Preview</span>
        <div style={{ marginTop: 14, borderRadius: 20, overflow: 'hidden', border: '1px solid #e3ddd5' }}>
          <div style={{ background: `linear-gradient(135deg, ${wine[800]} 0%, ${wine[950]} 100%)`, padding: 28, color: '#fff' }}>
            <div style={{ fontFamily: 'serif', fontSize: 13, letterSpacing: '.2em', textTransform: 'uppercase', color: champagne[400], marginBottom: 8 }}>
              {settings.tagline}
            </div>
            <h2 style={{ fontFamily: 'serif', fontSize: 32, margin: '0 0 14px', lineHeight: 1.1 }}>
              {settings.site_name}
            </h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: `linear-gradient(135deg, ${champagne[200]} 0%, ${champagne[500]} 50%, ${champagne[600]} 100%)`,
                  color: wine[950],
                  padding: '10px 20px',
                  borderRadius: radiusPx,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                Book Stall / Store
              </span>
              <span
                style={{
                  display: 'inline-block',
                  background: 'rgba(255,255,255,.1)',
                  border: `1px solid ${champagne[400]}80`,
                  color: '#fff',
                  padding: '10px 20px',
                  borderRadius: radiusPx,
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '.08em',
                }}
              >
                View Fragrances
              </span>
            </div>
          </div>
          <div style={{ padding: 20, background: '#fff' }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '.15em', color: champagne[600], fontWeight: 700 }}>
              Signature Perfume
            </div>
            <div style={{ fontFamily: 'serif', fontSize: 22, margin: '4px 0 10px', color: wine[900] }}>Oud Wood</div>
            <div style={{ fontSize: 18, fontFamily: 'serif', fontWeight: 700, color: wine[900] }}>₹1,200</div>
            <button
              type="button"
              style={{
                marginTop: 14,
                width: '100%',
                background: wine[900],
                color: '#fff',
                border: 'none',
                padding: '10px 0',
                borderRadius: radiusPx,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              Order
            </button>
          </div>
        </div>
        <p style={{ marginTop: 14, fontSize: 12, color: '#8a827a' }}>
          This preview updates as you edit. Click "Save theme" to publish it to the live storefront for every visitor.
        </p>
      </article>
    </div>
  )
}
