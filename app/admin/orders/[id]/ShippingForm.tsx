'use client'

import { useState } from 'react'
import { Truck, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { updateShipping } from '../actions'

export default function ShippingForm({
  orderId,
  initialCarrier,
  initialTracking,
  initialUrl,
}: {
  orderId: string
  initialCarrier: string
  initialTracking: string
  initialUrl: string
}) {
  const [carrier, setCarrier] = useState(initialCarrier)
  const [tracking, setTracking] = useState(initialTracking)
  const [url, setUrl] = useState(initialUrl)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')

  const save = async () => {
    setBusy(true)
    setMessage('')
    try {
      await updateShipping(orderId, carrier, tracking, url)
      setMessage('Tracking saved. Order marked as shipped.')
      toast.success('Tracking saved')
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not save tracking'
      setMessage(msg)
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="fulfilment-panel">
      <div>
        <span className="kicker">Fulfilment</span>
        <h2>Shipping &amp; tracking</h2>
      </div>
      <div className="form-grid">
        <label>Carrier<input value={carrier} onChange={(e) => setCarrier(e.target.value)} placeholder="e.g. Delhivery" /></label>
        <label>Tracking number<input value={tracking} onChange={(e) => setTracking(e.target.value)} placeholder="Tracking ID" /></label>
        <label className="wide">Tracking URL<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></label>
      </div>
      <div className="hero-actions">
        <button className="button primary" onClick={save} disabled={busy}>
          {busy ? <Loader2 className="spin" size={16} /> : <Truck size={16} />} {busy ? 'Saving...' : 'Save tracking & mark shipped'}
        </button>
        {message && <span>{message}</span>}
      </div>
    </section>
  )
}
