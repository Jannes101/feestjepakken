'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UITJE_TYPES } from '@/types'
import type { UitjeType } from '@/types'
import { createClient } from '@/lib/supabase/client'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const INK2 = '#3A2E26'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

export default function AanmeldenPage() {
  const [selectedTypes, setSelectedTypes] = useState<UitjeType[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function toggleType(type: UitjeType) {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type])
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email: fd.get('email') as string,
      password: fd.get('wachtwoord') as string,
      options: {
        data: {
          naam: fd.get('naam') as string,
          leeftijd: Number(fd.get('leeftijd')),
          woonplaats: fd.get('woonplaats') as string,
          situatie: fd.get('situatie') as string,
          reis_afstand: fd.get('reis_afstand') as string,
          bio: fd.get('bio') as string,
          uitje_types: selectedTypes,
          geslacht: fd.get('geslacht') as string,
          gender: fd.get('gender') as string,
        },
        emailRedirectTo: `${window.location.origin}/verify`,
      },
    })

    if (signUpError) {
      setError(
        signUpError.message.includes('already registered')
          ? 'Dit e-mailadres is al in gebruik.'
          : signUpError.message
      )
      setLoading(false)
      return
    }

    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', background: '#FAF7F4' }}>
        <div style={{ textAlign: 'center', maxWidth: '420px' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(255,107,43,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.8rem' }}>🎉</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '3px', color: INK, marginBottom: '0.5rem' }}>JE STAAT OP DE LIJST</div>
          <p style={{ color: MUTED, fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '2rem' }}>Welkom bij feestjepakken. Check je e-mail om je account te bevestigen.</p>
          <Link href="/" style={{ display: 'inline-flex', padding: '0.85rem 2rem', background: AMBER, color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>Terug naar home</Link>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 4rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px', color: INK, textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          FEESTJE<span style={{ color: AMBER }}>PAKKEN</span>
        </Link>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '0.2rem', color: INK }}>Aanmelden</h1>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>Gratis · Anoniem · Vanaf 21 jaar</p>

        <form onSubmit={handleSubmit} style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '14px', padding: '1.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Field label="Voornaam"><input type="text" name="naam" required placeholder="Jouw naam" /></Field>
            <Field label="Leeftijd"><input type="number" name="leeftijd" required placeholder="28" min={21} max={99} /></Field>
          </div>
          <div style={{ marginBottom: '1rem' }}><Field label="E-mailadres"><input type="email" name="email" required placeholder="naam@email.nl" /></Field></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Field label="Woonplaats"><input type="text" name="woonplaats" required placeholder="Amsterdam" /></Field>
            <Field label="Wachtwoord"><input type="password" name="wachtwoord" required placeholder="Min. 8 tekens" minLength={8} /></Field>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Field label="Situatie">
              <select name="situatie">
                <option value="liever_niet_zeggen">Kies...</option>
                <option value="single">Single</option>
                <option value="relatie">In een relatie</option>
                <option value="getrouwd">Getrouwd</option>
              </select>
            </Field>
            <Field label="Reisbereidheid">
              <select name="reis_afstand" defaultValue="50km">
                <option value="eigen_stad">Eigen stad</option>
                <option value="25km">Binnen 25 km</option>
                <option value="50km">Binnen 50 km</option>
                <option value="heel_nl">Heel Nederland</option>
              </select>
            </Field>
          </div>

          <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <Field label="Geslacht" required>
              <select name="geslacht" required>
                <option value="">Kies...</option>
                <option value="man">Man</option>
                <option value="vrouw">Vrouw</option>
                <option value="anders">Anders</option>
              </select>
            </Field>
            <div>
              <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#8A7D72', marginBottom: '0.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Gender <span style={{ color: '#FF6B2B' }}>*</span>
              </label>
              <p style={{ fontSize: '0.68rem', color: '#8A7D72', lineHeight: 1.5, marginBottom: '0.5rem', fontWeight: 300 }}>
                Geslacht gaat over je biologische kenmerken. Gender gaat over hoe jij jezelf ervaart en presenteert — dat kan overeenkomen met je geslacht, maar hoeft niet.
              </p>
              <div className={`[&_select]:w-full [&_select]:bg-[#FAF7F4] [&_select]:border [&_select]:border-[rgba(28,21,16,0.1)] [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-[#1C1510] [&_select]:text-sm [&_select]:outline-none`}>
                <select name="gender" required>
                  <option value="">Kies...</option>
                  <option value="man">Man</option>
                  <option value="vrouw">Vrouw</option>
                  <option value="non_binair">Non-binair</option>
                  <option value="anders">Anders</option>
                  <option value="zeg_liever_niet">Zeg ik liever niet</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />

          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Welke uitjes zoek je?</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {UITJE_TYPES.map(t => {
                const on = selectedTypes.includes(t.value)
                return (
                  <button key={t.value} type="button" onClick={() => toggleType(t.value)}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.5rem 0.75rem', fontSize: '0.73rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', border: `1.5px solid ${on ? 'rgba(255,107,43,0.4)' : B1}`, color: on ? AMBER : MUTED, background: on ? 'rgba(255,107,43,0.08)' : '#FAF7F4', transition: 'all 0.2s' }}
                  >
                    <span style={{ width: '13px', height: '13px', border: `1.5px solid ${on ? AMBER : B2}`, borderRadius: '3px', background: on ? AMBER : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', flexShrink: 0 }}>{on ? '✓' : ''}</span>
                    {t.emoji} {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div style={{ height: '1px', background: B1, margin: '0 0 1.25rem' }} />
          <Field label="Over jezelf"><textarea name="bio" rows={3} placeholder="Wat voor type ben je? Waar ben je naar op zoek?" /></Field>

          <button type="submit" disabled={loading}
            style={{ width: '100%', padding: '0.95rem', border: 'none', background: AMBER, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '8px', marginTop: '1.5rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Even geduld…' : 'Profiel aanmaken'}
          </button>
          {error && (
            <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '1rem' }}>{error}</p>
          )}
          <p style={{ textAlign: 'center', fontSize: '0.68rem', color: 'rgba(28,21,16,0.3)', marginTop: '0.85rem' }}>Gegevens worden nooit gedeeld · Jij bepaalt wat anderen zien</p>
        </form>

        <p style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.78rem', color: MUTED }}>
          Al een account?{' '}
          <Link href="/inloggen" style={{ color: AMBER, textDecoration: 'none', fontWeight: 500 }}>Inloggen</Link>
        </p>
      </div>
    </main>
  )
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  const inputStyles = `
    [&_input]:w-full [&_input]:bg-[#FAF7F4] [&_input]:border [&_input]:border-[rgba(28,21,16,0.1)]
    [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-[#1C1510] [&_input]:text-sm [&_input]:outline-none
    [&_input:focus]:border-[rgba(255,107,43,0.45)] [&_input]:placeholder:text-[#BFB5AC]
    [&_select]:w-full [&_select]:bg-[#FAF7F4] [&_select]:border [&_select]:border-[rgba(28,21,16,0.1)]
    [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-[#1C1510] [&_select]:text-sm [&_select]:outline-none
    [&_textarea]:w-full [&_textarea]:bg-[#FAF7F4] [&_textarea]:border [&_textarea]:border-[rgba(28,21,16,0.1)]
    [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-[#1C1510] [&_textarea]:text-sm
    [&_textarea]:outline-none [&_textarea]:resize-y [&_textarea:focus]:border-[rgba(255,107,43,0.45)]
    [&_textarea]:placeholder:text-[#BFB5AC]
  `
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#8A7D72', marginBottom: '0.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
        {label}{required && <span style={{ color: '#FF6B2B' }}> *</span>}
      </label>
      <div className={inputStyles}>{children}</div>
    </div>
  )
}
