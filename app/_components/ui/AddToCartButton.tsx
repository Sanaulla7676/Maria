'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Package, Truck, Check } from 'lucide-react'

type Stage = 'idle' | 'packing' | 'shipping' | 'done'

export function AddToCartButton({
  onAdd,
  disabled,
  idleLabel = 'Order Perfume',
  soldOut,
  className = '',
}: {
  onAdd: () => Promise<void>
  disabled?: boolean
  idleLabel?: string
  soldOut?: boolean
  className?: string
}) {
  const [stage, setStage] = useState<Stage>('idle')

  const handleClick = async () => {
    if (stage !== 'idle' || disabled || soldOut) return
    setStage('packing')
    const request = onAdd().catch(() => 'error' as const)

    await new Promise((r) => setTimeout(r, 280))
    setStage('shipping')

    const [result] = await Promise.all([request, new Promise((r) => setTimeout(r, 700))])

    if (result === 'error') {
      setStage('idle')
      return
    }
    setStage('done')
    setTimeout(() => setStage('idle'), 1600)
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled || soldOut || stage !== 'idle'}
      className={`relative overflow-hidden flex items-center justify-center gap-1.5 transition-colors disabled:cursor-not-allowed ${
        stage === 'done' ? 'bg-emerald-600' : soldOut ? 'bg-slate-300' : 'bg-wine-900 hover:bg-wine-950'
      } text-white ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {stage === 'idle' && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5"
          >
            <ShoppingBag className="h-3.5 w-3.5" /> {soldOut ? 'Sold Out' : idleLabel}
          </motion.span>
        )}

        {stage === 'packing' && (
          <motion.span
            key="packing"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: [0.7, 1.15, 1] }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.28 }}
            className="flex items-center gap-1.5"
          >
            <Package className="h-4 w-4" /> Packing…
          </motion.span>
        )}

        {stage === 'shipping' && (
          <motion.span key="shipping" className="relative flex items-center gap-1.5 w-full justify-center overflow-hidden">
            <motion.span
              initial={{ x: '120%', rotate: 0 }}
              animate={{ x: '-10%', rotate: [0, -6, 0] }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="flex items-center gap-1.5"
            >
              <Truck className="h-4 w-4" /> On the way…
            </motion.span>
          </motion.span>
        )}

        {stage === 'done' && (
          <motion.span
            key="done"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            className="flex items-center gap-1.5"
          >
            <Check className="h-4 w-4" /> Added to Bag
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
