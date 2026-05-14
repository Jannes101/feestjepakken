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

const AV = [
  { bg: '#FDEEE6', color: '#C04A1A' },
  { bg: '#E6F5EE', color: '#1A7A4A' },
  { bg: '#EEE6FD', color: '#5B1AC0' },
  { bg: '#E6EEFF', color: '#1A3AC0' },
  { bg: '#FDF5E6', color: '#C07A1A' },
]

export default async function PubliekProfielPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: profiel }, { data: { user } }] = await Promise.all([
    supabase
      .from('users')
      .select(`
        id, naam, leeftijd, woonplaats, bio,
        situatie, reis_afstand, uitje_types,
        social_score, aantal_beoordelingen, foto_url
      `)
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!profiel) notFound()

  // Controleer of kijker credits heeft (≥1 transactie)
  let viewerHeeftCredits = false
  let fotoSignedUrl: string | null = null

  if (user) {
    const { count } = await supabase
      .from('transacties')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
    viewerHeeftCredits = (count ?? 0) > 0
  }

  if (viewerHeeftCredits && profiel.foto_url) {
    const { data: urlData } = await supabase.storage
      .from('profielfoto')
      .createSignedUrl(profiel.foto_url as string, 3600)
    fotoSignedUrl = urlData?.signedUrl ?? null
  }

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 5rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '620px', margin: '0 auto' }}>

        {/* Terug */}
        <Link href="/" style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", display: 'inline-block', marginBottom: '2rem' }}>
          ← Terug
        </Link>

        {/* Header */}
        {(() => {
          const initials = profiel.naam.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
          const av = AV[profiel.naam.charCodeAt(0) % AV.length]
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {fotoSignedUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoSignedUrl} alt={profiel.naam} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover', border: `1.5px solid ${B1}`, flexShrink: 0 }} />
              ) : (
                <div style={{ width: '64px', height: '64px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '1px', background: av.bg, color: av.color, flexShrink: 0 }}>
                  {initials}
                </div>
              )}
              <div>
                <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.5rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, margin: 0, lineHeight: 1 }}>
                  {profiel.naam}
                </h1>
                <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, margin: '0.3rem 0 0' }}>
                  {profiel.leeftijd} jaar · {profiel.woonplaats}
                </p>
              </div>
            </div>
          )
        })()}

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
