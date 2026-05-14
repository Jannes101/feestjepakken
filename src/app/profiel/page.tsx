import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'
import ProfielFotoUpload from '@/components/ProfielFotoUpload'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

export default async function ProfielPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/inloggen')

  const meta = user.user_metadata as {
    naam?: string
    leeftijd?: number
    woonplaats?: string
    situatie?: string
    reis_afstand?: string
    bio?: string
    uitje_types?: string[]
  }

  const { data: profile } = await supabase
    .from('users')
    .select('credits, foto_url')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits ?? 0

  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 4rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px', color: INK, textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
          FEESTJE<span style={{ color: AMBER }}>PAKKEN</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, margin: 0 }}>
            {meta.naam ?? 'Mijn profiel'}
          </h1>
          <LogoutButton />
        </div>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '2rem' }}>
          {user.email}
        </p>

        {/* Profielfoto */}
        <ProfielFotoUpload
          userId={user.id}
          huidigeFotoPath={profile?.foto_url ?? null}
          naam={meta.naam ?? ''}
        />

        {/* Credits */}
        <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.25rem 1.5rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Credits</p>
            <p style={{ fontSize: '0.84rem', color: '#3A2E26' }}>Gebruik credits om uitjes voor te stellen</p>
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', letterSpacing: '2px', color: credits > 0 ? AMBER : MUTED, lineHeight: 1 }}>
            {credits}
          </span>
        </div>

        {/* Profielgegevens */}
        <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Profielgegevens</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <ProfileField label="Naam" value={meta.naam ?? '—'} />
            <ProfileField label="Leeftijd" value={meta.leeftijd ? `${meta.leeftijd} jaar` : '—'} />
            <ProfileField label="Woonplaats" value={meta.woonplaats ?? '—'} />
            <ProfileField label="Situatie" value={situatieLabel(meta.situatie)} />
            <ProfileField label="Reisbereidheid" value={reisLabel(meta.reis_afstand)} />
          </div>

          {meta.bio && (
            <>
              <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Over mezelf</p>
              <p style={{ fontSize: '0.88rem', color: '#3A2E26', lineHeight: 1.7 }}>{meta.bio}</p>
            </>
          )}

          {meta.uitje_types && meta.uitje_types.length > 0 && (
            <>
              <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />
              <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Uitjes</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {meta.uitje_types.map(t => (
                  <span key={t} style={{ fontSize: '0.72rem', fontWeight: 500, padding: '0.3rem 0.75rem', borderRadius: '20px', border: '1.5px solid rgba(255,107,43,0.3)', color: AMBER, background: 'rgba(255,107,43,0.06)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '0.9rem', color: INK, fontWeight: 500 }}>{value}</p>
    </div>
  )
}

function situatieLabel(s?: string) {
  const map: Record<string, string> = {
    single: 'Single',
    relatie: 'In een relatie',
    getrouwd: 'Getrouwd / samenwonend',
    liever_niet_zeggen: 'Zeg ik liever niet',
  }
  return s ? (map[s] ?? s) : '—'
}

function reisLabel(r?: string) {
  const map: Record<string, string> = {
    eigen_stad: 'Alleen eigen stad',
    '25km': 'Binnen 25 km',
    '50km': 'Binnen 50 km',
    heel_nl: 'Heel Nederland',
  }
  return r ? (map[r] ?? r) : '—'
}
