import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { leeftijdNaarCategorie } from '@/types'
import NieuwUitjeFormulier from './NieuwUitjeFormulier'
import type { Geslacht, Gender } from '@/types'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const MUTED = '#8A7D72'

export default async function NieuwUitjePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/inloggen')

  const { data: profile } = await supabase
    .from('users')
    .select('leeftijd, geslacht, gender')
    .eq('id', user.id)
    .single()

  const leeftijd = profile?.leeftijd ?? 25
  const geslacht = (profile?.geslacht ?? 'anders') as Geslacht
  const gender = (profile?.gender ?? 'zeg_liever_niet') as Gender
  const leeftijdCategorie = leeftijdNaarCategorie(leeftijd)

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 4rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <Link href="/uitjes" style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-block', marginBottom: '2rem' }}>
          ← Terug naar uitjes
        </Link>

        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, marginBottom: '0.25rem' }}>
          Nieuw uitje aanmaken
        </h1>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>
          Maatje zoeken voor jouw avond
        </p>

        <NieuwUitjeFormulier
          userId={user.id}
          leeftijdCategorie={leeftijdCategorie}
          geslacht={geslacht}
          gender={gender}
        />
      </div>
    </main>
  )
}
