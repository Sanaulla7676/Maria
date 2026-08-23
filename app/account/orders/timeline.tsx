'use client'

import { Check, Circle, Truck } from 'lucide-react'

const steps = [
  ['processing', 'Processing'],
  ['shipped', 'Shipped'],
  ['delivered', 'Delivered'],
] as const

export function OrderTimeline({ status, trackingNumber, carrier }: { status: string; trackingNumber?: string | null; carrier?: string | null }) {
  const active = Math.max(0, steps.findIndex(([key]) => key === status))
  return (
    <div className="order-timeline">
      {steps.map(([key, label], index) => (
        <div className={`timeline-step ${index <= active ? 'active' : ''}`} key={key}>
          {index <= active ? <Check size={16} /> : <Circle size={16} />}
          <span>{label}</span>
        </div>
      ))}
      {status === 'shipped' && trackingNumber && (
        <div className="tracking-card"><Truck size={18} /><span>{carrier ? `${carrier}: ` : ''}{trackingNumber}</span></div>
      )}
    </div>
  )
}
