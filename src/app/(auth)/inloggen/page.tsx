'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function InloggenPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: fd.get('email') as string,
      password: fd.get('wachtwoord') as string,
    })

    if (signInError) {
      setError('Onjuist e-mailadres of wachtwoord.')
      setLoading(false)
      return
    }

    router.push('/profiel')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0E121A' }}>
      <div className="w-full max-w-md">
        <Link href="/" className="font-display text-xl tracking-widest text-fp-white">
          FEESTJE<span className="text-fp-red">PAKKEN</span>
        </Link>

        <h1 className="font-display text-4xl tracking-widest uppercase mt-8 mb-1">Inloggen</h1>
        <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted mb-8">
          Welkom terug
        </p>

        <form
          onSubmit={handleSubmit}
          className="p-7 border space-y-5"
          style={{ background: '#151C27', borderColor: 'rgba(238,240,244,0.13)' }}
        >
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-1.5">E-mailadres</label>
            <input
              type="email" name="email" required placeholder="naam@email.nl"
              className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-[#3E4A60]"
              style={{ background: '#1C2535', border: '1px solid rgba(238,240,244,0.13)', color: '#EEF0F4' }}
            />
          </div>
          <div>
            <label className="block font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-1.5">Wachtwoord</label>
            <input
              type="password" name="wachtwoord" required placeholder="••••••••"
              className="w-full px-3 py-2.5 text-sm outline-none placeholder:text-[#3E4A60]"
              style={{ background: '#1C2535', border: '1px solid rgba(238,240,244,0.13)', color: '#EEF0F4' }}
            />
          </div>

          {error && (
            <p className="font-mono text-[11px] text-fp-red tracking-wide">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 font-display text-lg tracking-widest uppercase text-white transition-colors disabled:opacity-50"
            style={{ background: '#E8352A' }}
          >
            {loading ? 'Even geduld…' : 'Inloggen'}
          </button>
        </form>

        <p className="mt-4 text-center font-mono text-[11px] text-fp-muted">
          Nog geen account?{' '}
          <Link href="/aanmelden" className="text-fp-red hover:underline">Aanmelden</Link>
        </p>
      </div>
    </main>
  )
}
