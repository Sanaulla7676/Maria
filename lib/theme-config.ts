export type SiteSettings = {
  primary_color: string
  accent_color: string
  button_radius: 'pill' | 'rounded' | 'soft' | 'sharp'
  heading_font: 'cormorant' | 'playfair' | 'marcellus' | 'dmserif'
  body_font: 'jakarta' | 'inter' | 'poppins' | 'manrope'
  site_name: string
  tagline: string
}

export const DEFAULT_SETTINGS: SiteSettings = {
  primary_color: '#6b1d2f',
  accent_color: '#d4af37',
  button_radius: 'pill',
  heading_font: 'cormorant',
  body_font: 'jakarta',
  site_name: 'Maria Perfumes',
  tagline: 'Luxury Atelier & Events',
}

export const HEADING_FONTS: { value: SiteSettings['heading_font']; label: string; cssVar: string }[] = [
  { value: 'cormorant', label: 'Cormorant Garamond', cssVar: '--font-cormorant' },
  { value: 'playfair', label: 'Playfair Display', cssVar: '--font-playfair' },
  { value: 'marcellus', label: 'Marcellus', cssVar: '--font-marcellus' },
  { value: 'dmserif', label: 'DM Serif Display', cssVar: '--font-dmserif' },
]

export const BODY_FONTS: { value: SiteSettings['body_font']; label: string; cssVar: string }[] = [
  { value: 'jakarta', label: 'Plus Jakarta Sans', cssVar: '--font-jakarta' },
  { value: 'inter', label: 'Inter', cssVar: '--font-inter' },
  { value: 'poppins', label: 'Poppins', cssVar: '--font-poppins' },
  { value: 'manrope', label: 'Manrope', cssVar: '--font-manrope' },
]

export const BUTTON_RADIUS_OPTIONS: { value: SiteSettings['button_radius']; label: string; px: string }[] = [
  { value: 'pill', label: 'Pill (fully rounded)', px: '9999px' },
  { value: 'rounded', label: 'Rounded', px: '14px' },
  { value: 'soft', label: 'Soft corners', px: '8px' },
  { value: 'sharp', label: 'Sharp corners', px: '2px' },
]

// --- Color math: derive a full tonal scale from one brand hex value ---

function hexToHsl(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  if (d !== 0) {
    switch (max) {
      case r: h = ((g - b) / d) % 6; break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return [h, s * 100, l * 100]
}

function hslToHex(h: number, s: number, l: number): string {
  s /= 100
  l /= 100
  const c = (1 - Math.abs(2 * l - 1)) * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = l - c / 2
  let [r, g, b] = [0, 0, 0]
  if (h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]
  const toHex = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function atLightness(hex: string, lightness: number, saturationBoost = 0): string {
  const [h, s] = hexToHsl(hex)
  return hslToHex(h, Math.min(100, Math.max(0, s + saturationBoost)), lightness)
}

export function generatePrimaryScale(baseHex: string) {
  return {
    50: atLightness(baseHex, 97, -30),
    100: atLightness(baseHex, 93, -25),
    500: baseHex,
    800: atLightness(baseHex, 14),
    900: atLightness(baseHex, 9),
    950: atLightness(baseHex, 5),
  }
}

export function generateAccentScale(baseHex: string) {
  return {
    100: atLightness(baseHex, 99, -40),
    200: atLightness(baseHex, 93, -20),
    300: atLightness(baseHex, 83, -10),
    400: atLightness(baseHex, 73, -5),
    500: baseHex,
    600: atLightness(baseHex, 44),
    700: atLightness(baseHex, 33),
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '')
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function buildThemeCss(settings: SiteSettings): string {
  const wine = generatePrimaryScale(settings.primary_color)
  const champagne = generateAccentScale(settings.accent_color)
  const radius = BUTTON_RADIUS_OPTIONS.find((r) => r.value === settings.button_radius)?.px ?? '9999px'
  const heading = HEADING_FONTS.find((f) => f.value === settings.heading_font)?.cssVar ?? '--font-cormorant'
  const body = BODY_FONTS.find((f) => f.value === settings.body_font)?.cssVar ?? '--font-jakarta'

  return `:root{
    --color-wine-50:${wine[50]} !important;
    --color-wine-100:${wine[100]} !important;
    --color-wine-500:${wine[500]} !important;
    --color-wine-800:${wine[800]} !important;
    --color-wine-900:${wine[900]} !important;
    --color-wine-950:${wine[950]} !important;
    --color-champagne-100:${champagne[100]} !important;
    --color-champagne-200:${champagne[200]} !important;
    --color-champagne-300:${champagne[300]} !important;
    --color-champagne-400:${champagne[400]} !important;
    --color-champagne-500:${champagne[500]} !important;
    --color-champagne-600:${champagne[600]} !important;
    --color-champagne-700:${champagne[700]} !important;
    --wine:${wine[800]} !important;
    --gold:${champagne[600]} !important;
    --btn-radius:${radius} !important;
    --font-serif:var(${heading}) !important;
    --font-sans:var(${body}) !important;
  }
  .wine-gradient{background:linear-gradient(135deg, ${wine[800]} 0%, ${wine[950]} 100%) !important}
  .gold-button-gradient{background:linear-gradient(135deg, ${champagne[200]} 0%, ${champagne[500]} 50%, ${champagne[600]} 100%) !important}
  .gold-text-gradient{background:linear-gradient(135deg, #ffffff 0%, ${champagne[200]} 30%, ${champagne[500]} 70%, ${champagne[400]} 100%) !important;-webkit-background-clip:text !important;background-clip:text !important}
  .glass-nav{background:${hexToRgba(wine[950], 0.88)} !important}
  .glass-dark{background:${hexToRgba(wine[950], 0.78)} !important}`
}
