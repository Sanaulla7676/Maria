'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, Sparkles } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'

const HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/86b1bff2-0651-42df-98fc-51815d0a6f2a.mp4'

export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [ended, setEnded] = useState(false)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const imageScale = useTransform(scrollYProgress, [0, 0.55, 1], [1, 0.97, 0.92])
  const imageRadius = useTransform(scrollYProgress, [0, 0.7, 1], [28, 34, 42])
  const imageY = useTransform(scrollYProgress, [0, 1], [0, -26])
  const panelY = useTransform(scrollYProgress, [0, 0.45, 1], [40, 0, -22])
  const panelOpacity = useTransform(scrollYProgress, [0, 0.18, 0.45, 0.8], [0, 1, 1, 0.84])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.play().catch(() => {})
    }

    play()
    video.addEventListener('loadeddata', play)
    return () => video.removeEventListener('loadeddata', play)
  }, [])

  return (
    <section
      ref={sectionRef}
      id="video-hero"
      className="relative min-h-[154vh] overflow-clip bg-[radial-gradient(circle_at_52%_18%,rgba(68,145,224,.16),transparent_28rem),linear-gradient(180deg,#f7fbff_0%,#ffffff_46%,#eef6fd_100%)]"
      aria-label="Maria Perfumes story hero"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[4%] top-[11%] h-48 w-48 rounded-full border border-[#167bd1]/10" />
        <div className="absolute right-[6%] top-[16%] h-72 w-72 rounded-full bg-[#167bd1]/[0.035] blur-2xl" />
        <div className="absolute left-[-8%] top-[40%] text-[22vw] font-display font-extrabold uppercase leading-none tracking-[-0.08em] text-[#167bd1]/[0.035]">
          Maria
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1480px] px-4 pb-16 pt-7 sm:px-7 lg:px-10 lg:pb-24 lg:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.26fr)_minmax(300px,.74fr)] lg:items-center">
          <div className="lg:pt-2">
            <span className="editorial-kicker">MARIA PERFUMES · A STORY IN EVERY BOTTLE</span>

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="mt-5 max-w-4xl font-display text-5xl font-extrabold uppercase leading-[0.86] tracking-[-0.07em] text-[#10243a] sm:text-6xl md:text-7xl lg:text-[7.1rem]"
            >
              More than
              <span className="block text-[#167bd1]">fragrances.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.6 }}
              className="mt-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base"
            >
              Discover the scent, the story and the experience behind Maria Perfumes, from everyday signature bottles to live fragrance events and workshops.
            </motion.p>

            <div className="mt-7 flex items-center gap-3 text-[9px] font-extrabold uppercase tracking-[0.2em] text-wine-600">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#167bd1] text-white shadow-lg">
                <Sparkles className="h-4 w-4" />
              </span>
              Scroll to reveal the story
            </div>
          </div>

          <motion.div style={{ opacity: panelOpacity, y: panelY }} className="hidden justify-self-end lg:block">
            <div className="w-full max-w-[360px] rounded-[28px] border border-slate-200 bg-white/88 p-6 shadow-[0_24px_80px_rgba(16,36,58,.08)] backdrop-blur-xl">
              <div className="text-[9px] font-extrabold uppercase tracking-[0.24em] text-slate-400">01 / The first impression</div>
              <div className="mt-4 font-display text-3xl font-extrabold uppercase leading-[.92] tracking-[-0.05em] text-[#10243a]">
                A fragrance
                <span className="block text-[#167bd1]">you remember.</span>
              </div>
              <p className="mt-4 text-xs leading-6 text-slate-500">
                The hero film introduces the bottle, the confidence and the visual language that runs through the entire Maria experience.
              </p>
              <a
                href="#matches-section"
                className="mt-5 inline-flex items-center gap-2 text-[9px] font-extrabold uppercase tracking-[0.18em] text-[#167bd1]"
              >
                Explore the collection <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </motion.div>
        </div>

        <div className="relative mt-8 lg:mt-10">
          <div className="sticky top-[94px] z-20">
            <motion.div
              style={{ scale: imageScale, y: imageY, borderRadius: imageRadius }}
              className="relative mx-auto aspect-[16/8.1] w-full max-w-[1260px] overflow-hidden border border-[#d8e6f2] bg-[#dfeefa] shadow-[0_28px_110px_rgba(26,70,111,.18)]"
            >
              <video
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                autoPlay
                onEnded={() => setEnded(true)}
                className="absolute inset-0 h-full w-full object-cover"
              >
                <source src={HERO_VIDEO_URL} type="video/mp4" />
              </video>

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#081827]/20 to-transparent" />

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <div className="rounded-full border border-white/50 bg-[#10243a]/45 px-3 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                  Maria Perfumes · Original Film
                </div>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-5 sm:bottom-6 sm:left-6 sm:right-6">
                <div className="max-w-[430px]">
                  <div className="font-display text-2xl font-extrabold uppercase leading-none tracking-[-0.04em] text-white drop-shadow-lg sm:text-4xl">
                    Scents that stay with you.
                  </div>
                  <div className="mt-2 text-[9px] font-bold uppercase tracking-[0.2em] text-white/75">
                    Premium fragrances · events · workshops
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full border border-white/40 bg-white/12 px-3 py-2 text-[9px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-md sm:flex">
                  {ended ? 'Story continues below' : 'Watch the reveal'}
                  <ArrowDown className="h-3.5 w-3.5" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 -mt-3 flex justify-between px-2 pt-5 lg:-mt-10 lg:px-12">
            <div className="rounded-[24px] border border-[#d8e6f2] bg-white/94 p-5 shadow-[0_16px_50px_rgba(16,36,58,.08)] backdrop-blur-xl sm:max-w-[320px]">
              <div className="text-[8px] font-extrabold uppercase tracking-[0.22em] text-wine-600">02 / The experience</div>
              <div className="mt-2 font-display text-xl font-extrabold uppercase tracking-[-0.04em] text-[#10243a]">
                From bottle
                <span className="block text-[#167bd1]">to memory.</span>
              </div>
            </div>

            <div className="hidden rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-[9px] font-extrabold uppercase tracking-[0.2em] text-slate-500 shadow-sm lg:flex lg:items-center lg:gap-2">
              Keep scrolling <ArrowDown className="h-3.5 w-3.5 text-[#167bd1]" />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-4 sm:grid-cols-3">
          {[
            ['01', 'Discover', 'Premium fragrances designed around personality.'],
            ['02', 'Experience', 'Live fragrance stalls for celebrations and events.'],
            ['03', 'Create', 'Workshops where guests build their own signature scent.'],
          ].map(([number, title, copy], i) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.08, duration: 0.55 }}
              className="rounded-[26px] border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="font-display text-3xl font-extrabold tracking-[-0.06em] text-[#167bd1]">{number}</div>
              <div className="mt-4 font-display text-xl font-extrabold uppercase tracking-[-0.04em] text-[#10243a]">{title}</div>
              <div className="mt-2 text-xs leading-6 text-slate-500">{copy}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
