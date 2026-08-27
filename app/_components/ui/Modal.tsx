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
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: ReactNode
}) {
  const maxWidth = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl', xl: 'max-w-3xl' }[size]

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out" />
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <Dialog.Content
            className={`relative w-full ${maxWidth} my-8 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-2xl`}
          >
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute top-6 right-6 z-10 text-slate-400 hover:text-slate-600 text-2xl font-bold leading-none"
              >
                <X className="h-6 w-6" />
              </button>
            </Dialog.Close>
            {children}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
