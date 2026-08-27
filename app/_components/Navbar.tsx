'use client'

import Link from 'next/link'
import { ShoppingBag, Wand2, UserRound, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useUI } from '@/app/_components/ui/UIProvider'

export function Navbar({
  userEmail,
  isOwnerUser,
  bagCount,
}: {
  userEmail: string | null
  isOwnerUser: boolean
  bagCount: number
}) {
  const { open } = useUI()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  const signOut = async () => {
    await supabaseBrowser().auth.signOut()
    setMenuOpen(false)
    router.refresh()
  }

  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-champagne-500/20 shadow-2xl transition-all duration-300 h-16 sm:h-20 flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-3.5 cursor-pointer group">
          <div className="w-10 h-10 rounded-full wine-gradient flex items-center justify-center ring-1 ring-champagne-400/50 shadow-xl group-hover:scale-105 transition duration-300">
            <span className="font-serif text-champagne-300 font-bold text-lg tracking-tighter">MP</span>
          </div>
          <div className="flex flex-col">
            <span className="text-lg sm:text-xl font-serif font-semibold tracking-wider text-white leading-none group-hover:text-champagne-300 transition">
              Maria Perfumes
            </span>
            <span className="text-[9px] uppercase font-bold text-champagne-400 tracking-[0.35em] leading-none mt-1">
              Luxury Atelier &amp; Events
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[12px] font-medium uppercase tracking-[0.12em] text-slate-200 whitespace-nowrap">
          <a href="#video-hero" className="nav-link-glow hover:text-champagne-300 transition py-1">Home</a>
          <a href="#about-section" className="nav-link-glow hover:text-champagne-300 transition py-1">Our Store</a>
          <a href="#event-stalls-section" className="nav-link-glow hover:text-champagne-300 transition py-1 text-champagne-300 font-semibold flex items-center gap-1.5">
            Event Stalls
          </a>
          <a href="#matches-section" className="nav-link-glow active text-white font-bold py-1">Catalog</a>
          <button onClick={() => open({ name: 'scent-matcher' })} className="nav-link-glow hover:text-champagne-300 transition py-1 flex items-center gap-1.5">
            <Wand2 className="h-3 w-3 text-champagne-400" /> Scent Matcher
          </button>
          <a href="#success-stories" className="nav-link-glow hover:text-champagne-300 transition py-1">Reviews</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="text-slate-300 hover:text-champagne-300 transition p-2 flex items-center justify-center"
              aria-label="Account"
            >
              <UserRound className="h-5 w-5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white shadow-2xl text-xs text-slate-700 p-2 z-50">
                {userEmail ? (
                  <>
                    <p className="px-3 py-2 text-slate-400 truncate">{userEmail}</p>
                    <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold">
                      My Orders
                    </Link>
                    {isOwnerUser && (
                      <Link href="/admin" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold text-wine-800">
                        Owner Dashboard
                      </Link>
                    )}
                    <button onClick={signOut} className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold flex items-center gap-2 text-rose-600">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => { setMenuOpen(false); open({ name: 'auth', mode: 'sign-in' }) }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold"
                    >
                      Sign In
                    </button>
                    <button
                      onClick={() => { setMenuOpen(false); open({ name: 'auth', mode: 'sign-up' }) }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-50 font-semibold text-wine-800"
                    >
                      Create Account
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => open({ name: 'bag' })}
            className="relative text-slate-300 hover:text-champagne-300 transition p-2 flex items-center justify-center"
            aria-label="Bag"
          >
            <ShoppingBag className="h-5 w-5" />
            {bagCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-wine-800 border border-champagne-400 text-champagne-300 text-[9px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                {bagCount}
              </span>
            )}
          </button>

          <button
            onClick={() => open({ name: 'booking' })}
            className="gold-button-gradient text-wine-950 text-[10px] sm:text-[11px] uppercase tracking-wide sm:tracking-widest px-4 sm:px-5 py-2.5 rounded-full font-extrabold shadow-lg hover:shadow-champagne-500/40 hover:scale-105 transition duration-300 whitespace-nowrap"
          >
            Book Stall / Store
          </button>
        </div>
      </div>
    </header>
  )
}
