'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

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
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#FAF7F4' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px', color: INK, textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          FEESTJE<span style={{ color: AMBER }}>PAKKEN</span>
        </Link>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.2rem', color: INK }}>Inloggen</h1>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>Welkom terug</p>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '14px', padding: '1.75rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: MUTED, marginBottom: '0.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>E-mailadres</label>
            <input type="email" name="email" required placeholder="naam@email.nl"
              style={{ width: '100%', background: '#FAF7F4', border: `1.5px solid ${B1}`, borderRadius: '8px', padding: '0.65rem 0.85rem', color: INK, fontSize: '0.88rem', outline: 'none' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: MUTED, marginBottom: '0.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>Wachtwoord</label>
            <input type="password" name="wachtwoord" required placeholder="••••••••"
              style={{ width: '100%', background: '#FAF7F4', border: `1.5px solid ${B1}`, borderRadius: '8px', padding: '0.65rem 0.85rem', color: INK, fontSize: '0.88rem', outline: 'none' }} />
          </div>

          {error && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.95rem', border: 'none', background: AMBER, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Even geduld…' : 'Inloggen'}
          </button>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: MUTED }}>
          Nog geen account?{' '}
          <Link href="/aanmelden" style={{ color: AMBER, textDecoration: 'none', fontWeight: 500 }}>Aanmelden</Link>
        </p>
      </div>
    </main>
  )
}
