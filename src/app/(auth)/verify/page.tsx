'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function VerifyContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type')
    const code = searchParams.get('code')
    const supabase = createClient()

    async function verify() {
      if (token_hash && type) {
        // Magic-link / OTP flow
        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type: type as Parameters<typeof supabase.auth.verifyOtp>[0]['type'],
        })
        if (!error) { router.replace('/profiel'); return }
      } else if (code) {
        // PKCE code-exchange flow
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) { router.replace('/profiel'); return }
      } else {
        // Already has a session (e.g. opened in same browser)
        const { data: { session } } = await supabase.auth.getSession()
        if (session) { router.replace('/profiel'); return }
      }
      setFailed(true)
    }

    verify()
  }, [router, searchParams])

  if (failed) {
    return (
      <main className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0E121A' }}>
        <div className="text-center max-w-md">
          <div className="font-display text-4xl tracking-widest text-fp-red mb-3">VERIFICATIE MISLUKT</div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted mb-8">
            De link is verlopen of al gebruikt.
          </p>
          <a
            href="/aanmelden"
            className="font-mono text-[11px] tracking-widest uppercase px-8 py-3 bg-fp-red text-white hover:bg-red-500 transition-colors"
          >
            Opnieuw aanmelden
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#0E121A' }}>
      <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted animate-pulse">
        E-mail verificeren…
      </p>
    </main>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" style={{ background: '#0E121A' }}>
          <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted">Laden…</p>
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
