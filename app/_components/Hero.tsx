'use client'

import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/86b1bff2-0651-42df-98fc-51815d0a6f2a.mp4'

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const storyRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    const ctx = gsap.context(() => {
      const stage = stageRef.current
      const section = sectionRef.current
      const story = storyRef.current
      if (!stage || !section || !story) return

      const storyCards = gsap.utils.toArray<HTMLElement>('.hero-story-card', story)

      gsap.set(storyCards, { y: 90, opacity: 0 })
      gsap.set('.hero-story-label', { y: 22, opacity: 0 })
      gsap.set('.hero-story-title', { y: 34, opacity: 0 })

      ScrollTrigger.create({
        trigger: section,
        start: 'top top+=84',
        end: '+=1250',
        pin: stage,
        pinSpacing: false,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })

      gsap.fromTo(
        stage,
        {
          borderRadius: 28,
          scale: 1,
          boxShadow: '0 24px 80px rgba(26,70,111,.12)',
        },
        {
          borderRadius: 34,
          scale: 0.992,
          boxShadow: '0 34px 120px rgba(26,70,111,.20)',
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top top+=84',
            end: '+=1250',
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        },
      )

      gsap.to('.hero-glow', {
        scale: 1.18,
        opacity: 0.65,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=1250',
          scrub: 1.2,
        },
      })

      storyCards.forEach((card, index) => {
        gsap.to(card, {
          y: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.06,
        })
      })

      gsap.to('.hero-story-label', {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: story,
          start: 'top 92%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.to('.hero-story-title', {
        y: 0,
        opacity: 1,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: story,
          start: 'top 86%',
          toggleActions: 'play none none reverse',
        },
      })

      gsap.fromTo(
        '.hero-story-divider',
        { scaleX: 0, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: story,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      ScrollTrigger.refresh()
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => video.play().catch(() => {})
    play()
    video.addEventListener('loadeddata', play)

    return () => video.removeEventListener('loadeddata', play)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="video-hero"
      aria-label="Maria Perfumes hero story"
      className="relative min-h-[180vh] overflow-clip bg-[radial-gradient(circle_at_50%_6%,rgba(61,137,230,.14),transparent_32rem),linear-gradient(180deg,#f8fbff_0%,#ffffff_52%,#eef6fd_100%)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="hero-glow absolute left-[18%] top-[8rem] h-[34rem] w-[34rem] rounded-full bg-[#167bd1]/[0.055] blur-3xl" />
        <div className="absolute right-[-8rem] top-[28rem] h-[30rem] w-[30rem] rounded-full border border-[#167bd1]/[0.07]" />
        <div className="absolute bottom-[5rem] left-[-12rem] text-[19vw] font-display font-extrabold uppercase tracking-[-0.09em] text-[#167bd1]/[0.035]">
          Maria
        </div>
      </div>

      <div className="relative z-10 pt-3 sm:pt-4">
        <div
          ref={stageRef}
          className="hero-video-stage relative left-1/2 w-screen -translate-x-1/2 overflow-hidden rounded-[28px] border border-[#d7e5f1] bg-[#dbeaf8] shadow-[0_24px_85px_rgba(26,70,111,.14)]"
        >
          <div className="relative aspect-video w-full">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              autoPlay
              className="absolute inset-0 h-full w-full object-contain bg-white"
            >
              <source src={HERO_VIDEO_URL} type="video/mp4" />
            </video>

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#081827]/12 via-transparent to-white/4" />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/45" />

            <div className="pointer-events-none absolute bottom-[12%] left-6 right-6 sm:left-10 sm:right-10">
              <div className="h-px w-full bg-white/45" />
            </div>
          </div>
        </div>

        <div
          ref={storyRef}
          className="relative z-30 mx-auto -mt-[10vh] max-w-[1320px] px-4 pb-[20vh] sm:px-6 lg:-mt-[12vh] lg:px-8"
        >
          <div className="hero-story-label mb-4 flex items-center gap-3 pl-2 text-[9px] font-extrabold uppercase tracking-[0.28em] text-wine-600">
            <span className="h-2.5 w-2.5 rounded-full bg-[#167bd1]" />
            01 / The story begins
          </div>

          <div className="hero-story-title grid gap-8 rounded-[32px] border border-[#d9e6f0] bg-white p-6 shadow-[0_24px_85px_rgba(16,36,58,.13)] sm:p-8 lg:grid-cols-[1.18fr_.82fr] lg:p-10">
            <div>
              <div className="hero-story-divider mb-6 h-[3px] w-16 origin-left rounded-full bg-[#167bd1]" />
              <h1 className="max-w-4xl font-display text-5xl font-extrabold uppercase leading-[.85] tracking-[-0.065em] text-[#10243a] sm:text-6xl md:text-7xl lg:text-[6.4rem]">
                More than
                <span className="block text-[#167bd1]">fragrances.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                A signature scent. A live fragrance experience. A workshop that turns a moment into something people remember.
              </p>
            </div>

            <div className="self-end">
              <div className="border-l-2 border-[#167bd1]/20 pl-5">
                <div className="text-[8px] font-extrabold uppercase tracking-[0.24em] text-slate-400">
                  The Maria experience
                </div>
                <div className="mt-3 font-display text-2xl font-extrabold uppercase leading-[.95] tracking-[-0.05em] text-[#10243a] sm:text-3xl">
                  From first spray
                  <span className="block text-[#167bd1]">to lasting memory.</span>
                </div>
                <div className="mt-5 h-px w-16 bg-[#167bd1]" />
                <p className="mt-4 text-xs leading-6 text-slate-500">
                  Scroll through the story and let the next chapter rise over the film.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {[
              ['01', 'Discover', 'Explore signature fragrances crafted around mood, personality and occasion.'],
              ['02', 'Experience', 'Bring Maria to weddings, parties and corporate events with a live scent stall.'],
              ['03', 'Create', 'Blend your own signature fragrance inside an intimate hands-on workshop.'],
            ].map(([number, title, copy]) => (
              <article
                key={number}
                className="hero-story-card relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-6 shadow-[0_18px_55px_rgba(16,36,58,.08)]"
              >
                <span className="absolute right-5 top-4 font-display text-6xl font-extrabold leading-none tracking-[-0.08em] text-[#167bd1]/[0.07]">
                  {number}
                </span>
                <div className="relative">
                  <div className="font-display text-4xl font-extrabold tracking-[-0.07em] text-[#167bd1]">{number}</div>
                  <h2 className="mt-4 font-display text-2xl font-extrabold uppercase tracking-[-0.045em] text-[#10243a]">
                    {title}
                  </h2>
                  <p className="mt-3 text-xs leading-6 text-slate-500">{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
