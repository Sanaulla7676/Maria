'use client'

import { useLayoutEffect, useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export function ParallaxHero({
  video,
  overlayClassName = 'from-wine-950 via-wine-950/85 to-wine-950/50',
  children,
}: {
  video: string
  overlayClassName?: string
  children: ReactNode
}) {
  const section = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const content = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    const ctx = gsap.context(() => {
      gsap.to(videoRef.current, {
        yPercent: 18,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to(content.current, {
        yPercent: -22,
        opacity: 0.2,
        ease: 'none',
        scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.from(content.current, { opacity: 0, y: 30, duration: 1, ease: 'power3.out', delay: 0.1 })
    }, section)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={section} className="relative w-full h-[80vh] min-h-[520px] flex items-center overflow-hidden bg-wine-950">
      <video ref={videoRef} autoPlay loop muted playsInline preload="auto" className="absolute inset-0 w-full h-full object-cover opacity-45 scale-110">
        <source src={video} type="video/mp4" />
      </video>
      <div className={`absolute inset-0 bg-gradient-to-r ${overlayClassName}`} />
      <div ref={content} className="relative z-10 w-full">
        {children}
      </div>
    </div>
  )
}
