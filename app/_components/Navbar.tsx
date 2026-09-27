'use client'

import Link from 'next/link'
import { Search, ShoppingBag, UserRound, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useUI } from '@/app/_components/ui/UIProvider'

const navItems = [
  { label: 'Home', href: '/#video-hero' },
  { label: 'Our Store', href: '/#matches-section' },
  { label: 'Events', href: '/events' },
  { label: 'Workshop', href: '/workshops' },
  { label: 'Catalog', href: '/#matches-section' },
]

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
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const signOut = async () => {
    await supabaseBrowser().auth.signOut()
    setMenuOpen(false)
    router.refresh()
  }

  const isActive = (href: string) => {
    if (href === '/#video-hero') return pathname === '/'
    if (href === '/events') return pathname === '/events'
    if (href === '/workshops') return pathname === '/workshops'
    return href.includes('#matches-section') && pathname === '/'
  }

  return (
    <header className="maria-header sticky top-0 z-40">
      <div className="mx-auto max-w-[1600px] px-3 py-2 sm:px-6 lg:px-8">
        <div className="maria-nav-surface flex min-h-[58px] items-center justify-between gap-4 rounded-[20px] px-3 sm:min-h-[64px] sm:px-5 lg:px-6">
          <Link
            href="/"
            aria-label="Maria Perfumes home"
            className="maria-logo-shell group flex shrink-0 items-center gap-4 rounded-[17px] px-4 py-2 sm:px-5"
          >
            <div>
              <span className="block font-display text-[22px] font-extrabold uppercase leading-[.82] tracking-[0.11em] text-[#10243a] sm:text-[25px]">
                Maria
              </span>
              <span className="mt-1 block text-[6px] font-extrabold uppercase tracking-[0.48em] text-[#167bd1] sm:text-[7px]">
                Perfumes
              </span>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-7">
            {navItems.map((item) =>
              item.href.startsWith('/events') || item.href.startsWith('/workshops') ? (
                <Link
                  key={item.label}
                  href={item.href}
                  data-active={isActive(item.href)}
                  className="maria-nav-link whitespace-nowrap py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#10243a] transition hover:text-[#167bd1]"
                >
                  {item.label}
                </Link>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  data-active={isActive(item.href)}
                  className="maria-nav-link whitespace-nowrap py-3 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#10243a] transition hover:text-[#167bd1]"
                >
                  {item.label}
                </a>
              ),
            )}
          </nav>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <a
              href="/#matches-section"
              aria-label="Search fragrances"
              className="flex h-10 w-10 items-center justify-center rounded-full text-[#10243a] transition hover:bg-[#eef7ff] hover:text-[#167bd1]"
            >
              <Search className="h-[19px] w-[19px]" />
            </a>

            <div className="relative">
              <button
                onClick={() => setMenuOpen((value) => !value)}
                aria-label="Account"
                className="flex h-10 w-10 items-center justify-center rounded-full text-[#10243a] transition hover:bg-[#eef7ff] hover:text-[#167bd1]"
              >
                <UserRound className="h-[19px] w-[19px]" />
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-xs text-slate-700 shadow-[0_18px_50px_rgba(16,36,58,.16)]">
                  {userEmail ? (
                    <>
                      <p className="truncate px-3 py-2 text-slate-400">{userEmail}</p>
                      <Link
                        href="/account/orders"
                        onClick={() => setMenuOpen(false)}
                        className="block rounded-xl px-3 py-2.5 font-semibold hover:bg-[#eef7ff]"
                      >
                        My Orders
                      </Link>
                      {isOwnerUser && (
                        <Link
                          href="/admin"
                          onClick={() => setMenuOpen(false)}
                          className="block rounded-xl px-3 py-2.5 font-semibold text-wine-700 hover:bg-[#eef7ff]"
                        >
                          Owner Dashboard
                        </Link>
                      )}
                      <button
                        onClick={signOut}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left font-semibold text-rose-600 hover:bg-[#fff5f5]"
                      >
                        <LogOut className="h-3.5 w-3.5" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setMenuOpen(false)
                          open({ name: 'auth', mode: 'sign-in' })
                        }}
                        className="w-full rounded-xl px-3 py-2.5 text-left font-semibold hover:bg-[#eef7ff]"
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => {
                          setMenuOpen(false)
                          open({ name: 'auth', mode: 'sign-up' })
                        }}
                        className="w-full rounded-xl px-3 py-2.5 text-left font-semibold text-wine-700 hover:bg-[#eef7ff]"
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
              aria-label="Shopping bag"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#10243a] transition hover:bg-[#eef7ff] hover:text-[#167bd1]"
            >
              <ShoppingBag className="h-[19px] w-[19px]" />
              {bagCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#167bd1] px-1 text-[8px] font-extrabold text-white shadow-sm">
                  {bagCount}
                </span>
              )}
            </button>

            <button
              onClick={() => open({ name: 'booking' })}
              className="maria-cta hidden min-w-[210px] items-center justify-center rounded-full px-6 py-3.5 text-[9px] font-extrabold uppercase tracking-[0.18em] transition sm:flex"
            >
              Book Stall / Store <span className="ml-2.5 text-base leading-none">→</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
