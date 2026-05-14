'use client'

import Link from 'next/link'
import { useState } from 'react'
import { UITJE_TYPES } from '@/types'
import type { UitjeType } from '@/types'
import { createClient } from '@/lib/supabase/client'

export default function AanmeldenPage() {
  const [selectedTypes, setSelectedTypes] = useState<UitjeType[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  function toggleType(type: UitjeType) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const email = fd.get('email') as string
    const wachtwoord = fd.get('wachtwoord') as string
    const naam = fd.get('naam') as string
    const leeftijd = Number(fd.get('leeftijd'))
    const woonplaats = fd.get('woonplaats') as string
    const situatie = fd.get('situatie') as string
    const reis_afstand = fd.get('reis_afstand') as string
    const bio = fd.get('bio') as string

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password: wachtwoord,
      options: {
        data: { naam, leeftijd, woonplaats, situatie, reis_afstand, bio, uitje_types: selectedTypes },
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
      <main className="min-h-screen flex items-center justify-center px-8" style={{ background: '#0E121A' }}>
        <div className="text-center max-w-md">
          <div className="font-display text-5xl tracking-widest text-fp-red mb-3">JE STAAT OP DE LIJST</div>
          <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted mb-8">
            Check je e-mail om je account te bevestigen
          </p>
          <Link href="/" className="font-mono text-[11px] tracking-widest uppercase px-8 py-3 bg-fp-red text-white hover:bg-red-500 transition-colors">
            Terug naar home
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-8 py-16" style={{ background: '#0E121A' }}>
      <div className="max-w-lg mx-auto">
        <Link href="/" className="font-display text-xl tracking-widest text-fp-white">
          FEESTJE<span className="text-fp-red">PAKKEN</span>
        </Link>

        <h1 className="font-display text-4xl tracking-widest uppercase mt-8 mb-1">Aanmelden</h1>
        <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted mb-8">
          Gratis · Anoniem · 24 t/m 50 jaar
        </p>

        <form
          onSubmit={handleSubmit}
          className="p-7 border"
          style={{ background: '#151C27', borderColor: 'rgba(238,240,244,0.13)' }}
        >
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Voornaam"><input type="text" name="naam" required placeholder="Jouw naam" /></Field>
              <Field label="Leeftijd"><input type="number" name="leeftijd" required placeholder="28" min={24} max={50} /></Field>
            </div>

            <Field label="E-mailadres"><input type="email" name="email" required placeholder="naam@email.nl" /></Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Woonplaats"><input type="text" name="woonplaats" required placeholder="Amsterdam" /></Field>
              <Field label="Wachtwoord"><input type="password" name="wachtwoord" required placeholder="Min. 8 tekens" minLength={8} /></Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Situatie">
                <select name="situatie">
                  <option value="liever_niet_zeggen">Kies...</option>
                  <option value="single">Single</option>
                  <option value="relatie">In een relatie</option>
                  <option value="getrouwd">Getrouwd / samenwonend</option>
                </select>
              </Field>
              <Field label="Reisbereidheid">
                <select name="reis_afstand" defaultValue="50km">
                  <option value="eigen_stad">Alleen eigen stad</option>
                  <option value="25km">Binnen 25 km</option>
                  <option value="50km">Binnen 50 km</option>
                  <option value="heel_nl">Heel Nederland</option>
                </select>
              </Field>
            </div>

            <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />

            <div>
              <p className="font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-3">Welke uitjes zoek je?</p>
              <div className="grid grid-cols-2 gap-2">
                {UITJE_TYPES.map((t) => {
                  const on = selectedTypes.includes(t.value)
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => toggleType(t.value)}
                      className="flex items-center gap-2 px-3 py-2 text-left font-mono text-[11px] tracking-wide border transition-colors"
                      style={on
                        ? { borderColor: 'rgba(232,53,42,0.4)', color: 'rgba(232,53,42,0.9)', background: 'rgba(232,53,42,0.06)' }
                        : { borderColor: 'rgba(238,240,244,0.13)', color: '#6B7590', background: '#1C2535' }
                      }
                    >
                      <span className="w-3 h-3 flex-shrink-0 flex items-center justify-center text-[9px] border"
                        style={on ? { background: '#E8352A', borderColor: '#E8352A', color: '#fff' } : { borderColor: 'rgba(238,240,244,0.13)' }}
                      >{on ? '✓' : ''}</span>
                      {t.emoji} {t.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />

            <Field label="Over jezelf">
              <textarea name="bio" rows={3} placeholder="Wat voor type ben je? Waar ben je naar op zoek?" />
            </Field>

            {error && (
              <p className="font-mono text-[11px] text-fp-red tracking-wide">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 font-display text-lg tracking-widest uppercase text-white transition-colors disabled:opacity-50"
              style={{ background: '#E8352A' }}
            >
              {loading ? 'Even geduld…' : 'Profiel aanmaken'}
            </button>

            <p className="text-center font-mono text-[10px] tracking-wide text-fp-muted">
              Gegevens worden nooit gedeeld · Jij bepaalt wat anderen zien
            </p>
          </div>
        </form>

        <p className="mt-4 text-center font-mono text-[11px] text-fp-muted">
          Al een account?{' '}
          <Link href="/inloggen" className="text-fp-red hover:underline">Inloggen</Link>
        </p>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-1.5">{label}</label>
      <div className="
        [&_input]:w-full [&_input]:bg-[#1C2535] [&_input]:border [&_input]:border-[rgba(238,240,244,0.13)]
        [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-[#EEF0F4] [&_input]:text-sm [&_input]:outline-none
        [&_input:focus]:border-[rgba(232,53,42,0.45)] [&_input]:placeholder:text-[#3E4A60]
        [&_select]:w-full [&_select]:bg-[#1C2535] [&_select]:border [&_select]:border-[rgba(238,240,244,0.13)]
        [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-[#EEF0F4] [&_select]:text-sm [&_select]:outline-none
        [&_textarea]:w-full [&_textarea]:bg-[#1C2535] [&_textarea]:border [&_textarea]:border-[rgba(238,240,244,0.13)]
        [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-[#EEF0F4] [&_textarea]:text-sm [&_textarea]:outline-none [&_textarea]:resize-y
        [&_textarea:focus]:border-[rgba(232,53,42,0.45)] [&_textarea]:placeholder:text-[#3E4A60]
      ">
        {children}
      </div>
    </div>
  )
}
