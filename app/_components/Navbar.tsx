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
    <header className="sticky top-0 z-40 border-b border-[#dbe6f0] bg-white/95 backdrop-blur-xl shadow-[0_8px_30px_rgba(16,36,58,.06)]">
      <div className="mx-auto flex min-h-[74px] max-w-[1500px] items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link href="/" className="shrink-0 border-r border-slate-200 pr-6">
          <span className="block font-display text-2xl font-extrabold uppercase leading-[.8] tracking-[0.08em] text-[#10243a] sm:text-3xl">Maria</span>
          <span className="mt-1 block text-[8px] font-bold uppercase tracking-[0.42em] text-[#167bd1]">Perfumes</span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 xl:flex">
          {[
            ['Home', '#video-hero'],
            ['Our Store', '#about-section'],
            ['Events', '/events'],
            ['Workshop', '/workshops'],
            ['Catalog', '#matches-section'],
            ['Reviews', '#success-stories'],
          ].map(([label, href]) =>
            href.startsWith('/') ? (
              <Link key={label} href={href} className="nav-link-glow py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#10243a] transition hover:text-[#167bd1]">
                {label}
              </Link>
            ) : (
              <a key={label} href={href} className="nav-link-glow py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#10243a] transition hover:text-[#167bd1]">
                {label}
              </a>
            ),
          )}
          <button onClick={() => open({ name: 'scent-matcher' })} className="nav-link-glow flex items-center gap-1.5 py-2 text-[10px] font-bold uppercase tracking-[0.13em] text-[#10243a] transition hover:text-[#167bd1]">
            <Wand2 className="h-3.5 w-3.5 text-[#167bd1]" /> Scent Matcher
          </button>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="relative">
            <button onClick={() => setMenuOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#10243a] transition hover:bg-[#eef7ff] hover:text-[#167bd1]" aria-label="Account">
              <UserRound className="h-4.5 w-4.5" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-2xl">
                {userEmail ? (
                  <>
                    <p className="truncate px-3 py-2 text-slate-400">{userEmail}</p>
                    <Link href="/account/orders" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 font-semibold hover:bg-slate-50">My Orders</Link>
                    {isOwnerUser && <Link href="/admin" onClick={() => setMenuOpen(false)} className="block rounded-xl px-3 py-2 font-semibold text-wine-700 hover:bg-slate-50">Owner Dashboard</Link>}
                    <button onClick={signOut} className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left font-semibold text-rose-600 hover:bg-slate-50">
                      <LogOut className="h-3.5 w-3.5" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => { setMenuOpen(false); open({ name: 'auth', mode: 'sign-in' }) }} className="w-full rounded-xl px-3 py-2 text-left font-semibold hover:bg-slate-50">Sign In</button>
                    <button onClick={() => { setMenuOpen(false); open({ name: 'auth', mode: 'sign-up' }) }} className="w-full rounded-xl px-3 py-2 text-left font-semibold text-wine-700 hover:bg-slate-50">Create Account</button>
                  </>
                )}
              </div>
            )}
          </div>

          <button onClick={() => open({ name: 'bag' })} className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#10243a] transition hover:bg-[#eef7ff] hover:text-[#167bd1]" aria-label="Bag">
            <ShoppingBag className="h-4.5 w-4.5" />
            {bagCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#167bd1] px-1 text-[8px] font-extrabold text-white">{bagCount}</span>}
          </button>

          <button onClick={() => open({ name: 'booking' })} className="gold-button-gradient hidden rounded-full px-5 py-3 text-[9px] font-extrabold uppercase tracking-[0.16em] shadow-lg transition hover:scale-[1.02] sm:block">
            Book Stall / Store <span className="ml-2">→</span>
          </button>
        </div>
      </div>
    </header>
  )
}
