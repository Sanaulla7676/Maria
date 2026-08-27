'use client'

import { useEffect, useState } from 'react'
import { GlassWater } from 'lucide-react'
import { toast } from 'sonner'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'
import { serviceOptions } from '@/lib/event-options'
import { submitEventEnquiry } from '@/lib/event-actions'

export function BookingModal() {
  const { modal, close } = useUI()
  const isOpen = modal?.name === 'booking'
  const preset = modal?.name === 'booking' ? modal.preset : undefined

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [eventType, setEventType] = useState<string>(serviceOptions[0])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && preset && (serviceOptions as readonly string[]).includes(preset)) setEventType(preset)
  }, [isOpen, preset])

  const handleClose = () => {
    setName('')
    setPhone('')
    setLoading(false)
    close()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await submitEventEnquiry({ name, phone, eventType })
      toast.success('Booking request submitted! Maria Perfumes will call/text you on +91 99160 32291 shortly.')
      handleClose()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not submit your request')
      setLoading(false)
    }
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="sm">
      <div className="p-8 text-left">
        <div className="w-12 h-12 gold-button-gradient text-wine-950 rounded-full flex items-center justify-center text-xl mb-4 shadow-md">
          <GlassWater className="h-5 w-5" />
        </div>
        <h3 className="font-serif font-bold text-2xl text-wine-950">Book Event Stall / Store Visit</h3>
        <p className="text-xs text-slate-500 mt-1 mb-6 font-light">
          Reserve a Live Fragrance Stall for your event or schedule an in-store tasting.
        </p>

        <form onSubmit={submit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Phone / WhatsApp Number</label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 99160 32291"
              className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Service Requirement</label>
            <select
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none font-medium"
            >
              {serviceOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full gold-button-gradient text-wine-950 font-bold py-3.5 rounded-xl uppercase tracking-wider shadow-md hover:opacity-95 transition mt-2 disabled:opacity-60"
          >
            {loading ? 'Submitting…' : 'Confirm Event / Store Booking'}
          </button>
        </form>
      </div>
    </Modal>
  )
}
