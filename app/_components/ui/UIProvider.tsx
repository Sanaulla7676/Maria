'use client'

import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import type { Product } from '@/lib/types'

type ModalKind =
  | { name: 'auth'; mode: 'sign-in' | 'sign-up' }
  | { name: 'product'; product: Product }
  | { name: 'scent-matcher' }
  | { name: 'bag' }
  | { name: 'packages' }
  | { name: 'booking'; preset?: string }
  | { name: 'guarantee' }
  | null

type UIContextValue = {
  modal: ModalKind
  open: (modal: NonNullable<ModalKind>) => void
  close: () => void
}

const UIContext = createContext<UIContextValue | null>(null)

export function UIProvider({ children }: { children: ReactNode }) {
  const [modal, setModal] = useState<ModalKind>(null)

  const open = useCallback((next: NonNullable<ModalKind>) => setModal(next), [])
  const close = useCallback(() => setModal(null), [])

  return <UIContext.Provider value={{ modal, open, close }}>{children}</UIContext.Provider>
}

export function useUI() {
  const ctx = useContext(UIContext)
  if (!ctx) throw new Error('useUI must be used within UIProvider')
  return ctx
}
