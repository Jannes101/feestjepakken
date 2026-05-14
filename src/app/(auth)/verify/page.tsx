'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function VerifyContent() {
  const searchParams = useSearchParams()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const code = searchParams.get('code')
    const supabase = createClient()

    async function verify() {
      if (token_hash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as Parameters<typeof supabase.auth.verifyOtp>[0]['type'],
        })
        if (!error) { window.location.replace('/profiel'); return }
      } else if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) { window.location.replace('/profiel'); return }
      } else {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) { window.location.replace('/profiel'); return }
      }
      setFailed(true)
    }

    verify()
  }, [searchParams])

  if (failed) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#FAF7F4' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ width: '56px', height: '56px', background: 'rgba(220,38,38,0.08)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.5rem' }}>✕</div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '3px', color: '#1C1510', marginBottom: '0.5rem' }}>VERIFICATIE MISLUKT</h1>
          <p style={{ color: '#8A7D72', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '2rem' }}>De link is verlopen of al gebruikt. Probeer opnieuw aan te melden.</p>
          <a href="/aanmelden" style={{ display: 'inline-flex', padding: '0.85rem 2rem', background: '#FF6B2B', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>
            Opnieuw aanmelden
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F4' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,107,43,0.2)', borderTopColor: '#FF6B2B', borderRadius: '50%', margin: '0 auto 1rem', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#8A7D72', letterSpacing: '0.5px' }}>E-mail verificeren…</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FAF7F4' }}>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', color: '#8A7D72' }}>Laden…</p>
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
