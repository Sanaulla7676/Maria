'use client'

import { useRef, type CSSProperties, type ReactNode } from 'react'

export function TiltCard({
  children,
  max = 5,
  className,
  style,
  onClick,
}: {
  children: ReactNode
  max?: number
  className?: string
  style?: CSSProperties
  onClick?: () => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  const onPointerMove = (e: React.PointerEvent) => {
    if (!window.matchMedia('(pointer:fine)').matches || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateY(-4px)`
  }

  const onPointerLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      className={`editorial-tilt ${className ?? ''}`}
      style={style}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
