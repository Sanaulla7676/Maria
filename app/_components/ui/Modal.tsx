'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

export function Modal({
  open,
  onClose,
  size = 'md',
  children,
}: {
  open: boolean
  onClose: () => void
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  children: ReactNode
}) {
  const maxWidth = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-2xl',
    xl: 'max-w-3xl',
    '2xl': 'max-w-5xl',
  }[size]

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-lg data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 sm:p-6">
          <Dialog.Content
            className={`relative w-full ${maxWidth} my-4 sm:my-8 overflow-hidden rounded-[30px] border border-slate-100 bg-white shadow-[0_30px_100px_rgba(10,10,25,0.28)]`}
          >
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute top-5 right-5 sm:top-7 sm:right-7 z-30 w-10 h-10 rounded-full bg-white/90 backdrop-blur border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-white transition flex items-center justify-center shadow-sm"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
