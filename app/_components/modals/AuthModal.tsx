'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRound } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabase/browser'
import { useUI } from '@/app/_components/ui/UIProvider'
import { Modal } from '@/app/_components/ui/Modal'

export function AuthModal() {
  const { modal, close, open } = useUI()
  const isOpen = modal?.name === 'auth'
  const mode = modal?.name === 'auth' ? modal.mode : 'sign-in'
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)

  const reset = () => {
    setEmail('')
    setPassword('')
    setFullName('')
    setError(null)
    setConfirmSent(false)
    setLoading(false)
  }

  const handleClose = () => {
    reset()
    close()
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const supabase = supabaseBrowser()

    if (mode === 'sign-up') {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })
      setLoading(false)
      if (signUpError) return setError(signUpError.message)
      if (data.session) {
        handleClose()
        router.refresh()
      } else {
        setConfirmSent(true)
      }
      return
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (signInError) return setError(signInError.message)
    handleClose()
    router.refresh()
  }

  return (
    <Modal open={isOpen} onClose={handleClose} size="sm">
      <div className="p-8 text-center">
        <div className="w-12 h-12 gold-button-gradient text-wine-950 rounded-full flex items-center justify-center mx-auto text-xl mb-3 shadow-md">
          <UserRound className="h-5 w-5" />
        </div>
        <h3 className="text-2xl font-serif font-bold text-wine-950">
          {mode === 'sign-up' ? 'Create Your Account' : 'Welcome Back'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {mode === 'sign-up' ? 'Save your bag, wishlist & order history' : 'Sign in to Maria Perfumes'}
        </p>

        {confirmSent ? (
          <div className="mt-6 bg-champagne-100/60 border border-champagne-300 p-5 rounded-2xl text-left text-xs text-slate-700 space-y-2">
            <p className="font-semibold text-slate-900">Check your inbox</p>
            <p>We sent a confirmation link to <strong>{email}</strong>. Confirm your email, then sign in.</p>
            <button
              onClick={() => open({ name: 'auth', mode: 'sign-in' })}
              className="mt-2 text-wine-800 font-semibold hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-3 text-xs text-left">
            {mode === 'sign-up' && (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-wine-800"
                placeholder="••••••••"
              />
            </div>

            {error && <p className="text-rose-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full gold-button-gradient text-wine-950 font-bold py-3.5 rounded-xl shadow-md hover:opacity-95 transition uppercase tracking-wider disabled:opacity-60"
            >
              {loading ? 'Please wait…' : mode === 'sign-up' ? 'Create Account' : 'Sign In'}
            </button>

            <p className="text-center text-slate-500 pt-1">
              {mode === 'sign-up' ? (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => open({ name: 'auth', mode: 'sign-in' })} className="text-wine-800 font-semibold hover:underline">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to Maria Perfumes?{' '}
                  <button type="button" onClick={() => open({ name: 'auth', mode: 'sign-up' })} className="text-wine-800 font-semibold hover:underline">
                    Create an account
                  </button>
                </>
              )}
            </p>
          </form>
        )}
      </div>
    </Modal>
  )
}
