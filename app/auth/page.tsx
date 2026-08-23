'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Loader2, Mail, Lock, UserRound } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase-browser'

export default function AuthPage() {
  const supabase = createSupabaseBrowserClient()
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function submit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    const result = mode === 'signin'
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    setLoading(false)
    if (result.error) return setMessage(result.error.message)
    if (mode === 'signup' && !result.data.session) return setMessage('Check your email to confirm your Maria account.')
    router.push('/account')
    router.refresh()
  }

  return (
    <main className="container auth-page">
      <section className="auth-card">
        <span className="kicker">Maria Account</span>
        <h1>{mode === 'signin' ? 'Welcome back.' : 'Create your Maria account.'}</h1>
        <p>Keep your orders, wishlist, addresses and workshop bookings together.</p>
        <form onSubmit={submit}>
          {mode === 'signup' && <label><UserRound size={16} />Full name<input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" /></label>}
          <label><Mail size={16} />Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" /></label>
          <label><Lock size={16} />Password<div className="password-field"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} required autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {message && <p role="alert" className="form-message">{message}</p>}
          <button className="button primary auth-submit" disabled={loading}>{loading ? <Loader2 className="spin" size={17} /> : null}{mode === 'signin' ? 'Sign in' : 'Create account'}</button>
        </form>
        <button className="text-button" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
          {mode === 'signin' ? 'New to Maria? Create an account' : 'Already have an account? Sign in'}
        </button>
      </section>
    </main>
  )
}
