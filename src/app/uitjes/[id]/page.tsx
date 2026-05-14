import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BeoordelingsWrapper from './BeoordelingsWrapper'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const INK2 = '#3A2E26'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

export default async function UitjeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: uitje }, { data: { user } }] = await Promise.all([
    supabase
      .from('uitjes')
      .select(`
        id, titel, beschrijving, type, datum, locatie, max_personen, actief, created_at,
        user_id,
        users!uitjes_user_id_fkey ( id, naam, leeftijd, woonplaats, social_score, aantal_beoordelingen )
      `)
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!uitje) notFound()

  // Controleer of het uitje voorbij is
  const datumVoorbij = uitje.datum ? new Date(uitje.datum) < new Date() : false

  // Controleer of de ingelogde user deelnemer was (geaccepteerde reactie)
  let isDeelnemer = false
  if (user && user.id !== uitje.user_id) {
    const { data: reactie } = await supabase
      .from('reacties')
      .select('id')
      .eq('uitje_id', id)
      .eq('van_user_id', user.id)
      .eq('status', 'geaccepteerd')
      .single()
    isDeelnemer = !!reactie
  }

  const organisator = Array.isArray(uitje.users) ? uitje.users[0] : uitje.users as { id: string; naam: string; leeftijd: number; woonplaats: string } | null

  const kanBeoordelen = datumVoorbij && isDeelnemer && !!user

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 5rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        <Link href="/" style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-block', marginBottom: '2rem' }}>
          ← Terug
        </Link>

        {/* Uitje header */}
        <div style={{ marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 600, color: AMBER, letterSpacing: '1px', textTransform: 'uppercase' }}>{uitje.type}</span>
        </div>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, marginBottom: '0.5rem' }}>
          {uitje.titel}
        </h1>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>
          {uitje.locatie}{uitje.datum ? ` · ${new Date(uitje.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
        </p>

        {/* Beschrijving */}
        <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Over dit uitje</p>
          <p style={{ fontSize: '0.9rem', color: INK2, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{uitje.beschrijving}</p>

          <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Locatie</p>
              <p style={{ fontSize: '0.88rem', color: INK, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{uitje.locatie}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Max. personen</p>
              <p style={{ fontSize: '0.88rem', color: INK, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{uitje.max_personen}</p>
            </div>
          </div>
        </div>

        {/* Organisator */}
        {organisator && (
          <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Georganiseerd door</p>
              <p style={{ fontSize: '0.9rem', color: INK, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
                {organisator.naam} · {organisator.leeftijd} jr · {organisator.woonplaats}
              </p>
            </div>
            <Link href={`/profiel/${organisator.id}`} style={{ fontSize: '0.78rem', fontWeight: 500, color: AMBER, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>
              Bekijk profiel →
            </Link>
          </div>
        )}

        {/* Beoordelingsformulier trigger */}
        {kanBeoordelen && organisator && (
          <BeoordelingsWrapper
            uitjeId={uitje.id}
            beoordeeldeUserId={organisator.id}
            beoordeeldeNaam={organisator.naam}
          />
        )}

        {/* Past datum melding zonder beoordeling */}
        {datumVoorbij && !kanBeoordelen && user && user.id !== uitje.user_id && (
          <div style={{ background: '#fff', border: `1.5px solid ${B1}`, borderRadius: '12px', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.84rem', color: MUTED, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
              Dit uitje is voorbij. Alleen deelnemers met een geaccepteerde reactie kunnen een beoordeling geven.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
