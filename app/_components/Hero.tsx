'use client'

const HERO_VIDEO_URL =
  'https://d2ol7oe51mr4n9.cloudfront.net/user_35mtirXTBJzeOp1GtU8b1ixSM0D/86b1bff2-0651-42df-98fc-51815d0a6f2a.mp4'

export function Hero() {
  return (
    <section
      id="video-hero"
      className="relative h-screen w-full overflow-hidden bg-black"
      aria-label="Maria Perfumes hero"
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>
    </section>
  )
}
