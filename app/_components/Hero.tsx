'use client'

import { useEffect, useRef } from 'react'

const HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/0585a269-73ca-4bb1-a982-b6d99ab3c628.mp4'

export function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const START_AT = 6

    const playFromSixSeconds = () => {
      video.muted = true
      if (video.duration && video.currentTime < START_AT) {
        try { video.currentTime = START_AT } catch {}
      }
      video.play().catch(() => {})
    }

    const restartFromSixSeconds = () => {
      try { video.currentTime = START_AT } catch {}
      video.play().catch(() => {})
    }

    playFromSixSeconds()
    video.addEventListener('loadedmetadata', playFromSixSeconds)
    video.addEventListener('loadeddata', playFromSixSeconds)
    video.addEventListener('canplay', playFromSixSeconds)
    video.addEventListener('ended', restartFromSixSeconds)

    return () => {
      video.removeEventListener('loadedmetadata', playFromSixSeconds)
      video.removeEventListener('loadeddata', playFromSixSeconds)
      video.removeEventListener('canplay', playFromSixSeconds)
      video.removeEventListener('ended', restartFromSixSeconds)
    }
  }, [])

  return (
    <section
      id="video-hero"
      aria-label="Maria Perfumes hero video"
      className="relative h-[calc(100svh-88px)] min-h-[72svh] w-full overflow-hidden bg-[#edf5fc] lg:h-[calc(100svh-92px)]"
    >
      <div className="relative h-full w-full">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="auto"
          autoPlay
          loop={false}
          controls={false}
          className="absolute inset-x-0 top-0 h-full w-full object-cover object-center"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>
      </div>
    </section>
  )
}
