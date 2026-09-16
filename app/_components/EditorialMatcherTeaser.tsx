'use client'

import { Reveal } from '@/app/_components/ui/Reveal'
import { useUI } from '@/app/_components/ui/UIProvider'

export function EditorialMatcherTeaser() {
  const { open } = useUI()

  return (
    <section className="editorial grid grid-cols-1 lg:grid-cols-2 min-h-[420px]">
      <div
        className="editorial-sheen relative min-h-[280px]"
        style={{
          background:
            'radial-gradient(circle at 52% 45%, rgba(224,158,91,.65) 0 15%, transparent 16%), linear-gradient(160deg, #5f4026, #1b120d 72%)',
        }}
      >
        <div
          className="absolute right-[12%] top-[13%] bottom-[12%] w-[40%]"
          style={{
            borderRadius: '45% 45% 48% 48%',
            background: 'linear-gradient(180deg, #d89164 0 24%, #2f1a0f 25% 100%)',
            filter: 'blur(2px)',
            opacity: 0.88,
          }}
        />
      </div>

      <Reveal className="p-8 sm:p-16" style={{ background: '#f7f2e9' }}>
        <div className="text-[10px] uppercase tracking-[0.34em] mb-2" style={{ color: '#765020' }}>Find your</div>
        <h2 className="font-editorial-serif" style={{ fontWeight: 500, fontSize: 'clamp(38px,5vw,66px)', lineHeight: 0.87 }}>
          Signature
          <br />
          <em className="not-italic">Scent</em>
        </h2>
        <p className="max-w-[430px] mt-4 text-sm leading-[1.7]" style={{ color: '#5b5349' }}>
          Not sure which fragrance suits you? Try our Scent Matcher and find a signature made for your mood, personality and moment.
        </p>
        <button
          onClick={() => open({ name: 'scent-matcher' })}
          className="inline-flex items-center mt-5 px-5 py-3.5 rounded-full text-[10px] uppercase tracking-[0.1em]"
          style={{ border: '1px solid rgba(42,31,17,.25)' }}
        >
          Try Scent Matcher →
        </button>
      </Reveal>
    </section>
  )
}
