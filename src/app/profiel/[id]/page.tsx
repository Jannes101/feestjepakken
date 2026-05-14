import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import SocialScoreProfiel from '@/components/SocialScoreProfiel'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const INK2 = '#3A2E26'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

const SITUATIE_LABELS: Record<string, string> = {
  single: 'Single',
  relatie: 'In een relatie',
  getrouwd: 'Getrouwd / samenwonend',
  liever_niet_zeggen: '—',
}
const REIS_LABELS: Record<string, string> = {
  eigen_stad: 'Alleen eigen stad',
  '25km': 'Binnen 25 km',
  '50km': 'Binnen 50 km',
  heel_nl: 'Heel Nederland',
}

export default async function PubliekProfielPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profiel } = await supabase
    .from('users')
    .select(`
      id, naam, leeftijd, woonplaats, bio,
      situatie, reis_afstand, uitje_types,
      social_score, aantal_beoordelingen
    `)
    .eq('id', id)
    .single()

  if (!profiel) notFound()

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 5rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        {/* Terug */}
        <Link href="/" style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-block', marginBottom: '2rem' }}>
          ← Terug
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, margin: 0 }}>
            {profiel.naam}
          </h1>
        </div>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>
          {profiel.leeftijd} jaar · {profiel.woonplaats}
        </p>

        {/* Profielgegevens card */}
        <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Over dit lid</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: profiel.bio ? '1.25rem' : 0 }}>
            <Field label="Situatie" value={SITUATIE_LABELS[profiel.situatie] ?? profiel.situatie} />
            <Field label="Reisbereidheid" value={REIS_LABELS[profiel.reis_afstand] ?? profiel.reis_afstand} />
          </div>

          {profiel.bio && (
            <>
              <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Over mezelf</p>
              <p style={{ fontSize: '0.9rem', color: INK2, lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>{profiel.bio}</p>
            </>
          )}

          {profiel.uitje_types && profiel.uitje_types.length > 0 && (
            <>
              <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Uitjes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {(profiel.uitje_types as string[]).map((t: string) => (
                  <span key={t} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1.5px solid rgba(255,107,43,0.3)', color: AMBER, background: 'rgba(255,107,43,0.06)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Social Score sectie */}
        <SocialScoreProfiel
          userId={profiel.id}
          score={profiel.social_score as number | null}
          aantalBeoordelingen={profiel.aantal_beoordelingen as number}
        />
      </div>
    </main>
  )
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '0.9rem', color: INK, fontWeight: 500, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{value}</p>
    </div>
  )
}
