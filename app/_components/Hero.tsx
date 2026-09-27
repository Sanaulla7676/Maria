'use client'

import { useEffect, useRef } from 'react'

const HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/ea3c6a2a-5a7a-4117-9736-8fe6b535ea00.mp4'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const play = () => {
      video.muted = true
      video.play().catch(() => {})
    }

    play()
    video.addEventListener('loadeddata', play)
    video.addEventListener('canplay', play)

    return () => {
      video.removeEventListener('loadeddata', play)
      video.removeEventListener('canplay', play)
    }
  }, [])

  return (
    <section
      id="video-hero"
      aria-label="Maria Perfumes hero video"
      className="relative h-[calc(100svh-88px)] min-h-[72svh] w-full overflow-hidden bg-[#0e4f4a] lg:h-[calc(100svh-92px)]"
    >
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          autoPlay
          loop
          controls={false}
          className="absolute inset-x-0 top-0 h-full w-full object-cover object-center"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
