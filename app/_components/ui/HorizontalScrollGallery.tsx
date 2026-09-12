'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function HorizontalScrollGallery({ children }: { children: ReactNode[] }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      const el = track.current
      if (!el) return
      const distance = el.scrollWidth - el.parentElement!.offsetWidth
      if (distance <= 0) return

      gsap.to(el, {
        x: -distance,
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className="relative h-screen w-full overflow-hidden flex items-center">
      <div ref={track} className="flex gap-6 px-6 sm:px-[8vw] w-max">
        {children}
      </div>
    </div>
  )
}
