import type { Metadata } from 'next'
import {
  Plus_Jakarta_Sans,
  Cormorant_Garamond,
  Inter,
  Poppins,
  Manrope,
  Playfair_Display,
  Marcellus,
  DM_Serif_Display,
} from 'next/font/google'
import { Toaster } from 'sonner'
import { getSiteSettings, buildThemeCss } from '@/lib/theme'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', weight: ['300', '400', '500', '600', '700', '800'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], variable: '--font-cormorant', style: ['normal', 'italic'], weight: ['400', '500', '600', '700'] })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', weight: ['300', '400', '500', '600', '700', '800'] })
const poppins = Poppins({ subsets: ['latin'], variable: '--font-poppins', weight: ['300', '400', '500', '600', '700', '800'] })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', weight: ['300', '400', '500', '600', '700', '800'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', style: ['normal', 'italic'], weight: ['400', '500', '600', '700'] })
const marcellus = Marcellus({ subsets: ['latin'], variable: '--font-marcellus', weight: ['400'] })
const dmSerif = DM_Serif_Display({ subsets: ['latin'], variable: '--font-dmserif', style: ['normal', 'italic'], weight: ['400'] })

export const metadata: Metadata = {
  title: { default: 'Maria Perfumes | Luxury Fragrances & Live Event Fragrance Stalls in Bengaluru', template: '%s | Maria Perfumes' },
  description: 'Luxury fragrances, designer-inspired perfumes, and pure attars from Kammanahalli, Bengaluru. Book live event fragrance stalls and return gift bars for weddings, birthdays and celebrations.',
  metadataBase: new URL('https://maria-perfumes.vercel.app'),
}

const fontVariables = [jakarta, cormorant, inter, poppins, manrope, playfair, marcellus, dmSerif]
  .map((f) => f.variable)
  .join(' ')

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings()
  const themeCss = buildThemeCss(settings)

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <style dangerouslySetInnerHTML={{ __html: themeCss }} />
      </head>
      <body className={`${fontVariables} font-sans bg-[var(--paper)] text-slate-800 flex flex-col min-h-screen selection:bg-champagne-500 selection:text-wine-950`}>
        <Toaster position="top-right" richColors />
        {children}
      </body>
    </html>
  )
}
