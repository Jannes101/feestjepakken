import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from '@/components/LogoutButton'

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
    .select('credits')
    .eq('id', user.id)
    .single()

  const credits = profile?.credits ?? 0

  return (
    <main className="min-h-screen px-8 py-16" style={{ background: '#0E121A' }}>
      <div className="max-w-lg mx-auto">
        <Link href="/" className="font-display text-xl tracking-widest text-fp-white">
          FEESTJE<span className="text-fp-red">PAKKEN</span>
        </Link>

        <h1 className="font-display text-4xl tracking-widest uppercase mt-8 mb-1">Mijn profiel</h1>
        <p className="font-mono text-[11px] tracking-widest uppercase text-fp-muted mb-8">
          {user.email}
        </p>

        <div
          className="p-7 border space-y-6"
          style={{ background: '#151C27', borderColor: 'rgba(238,240,244,0.13)' }}
        >
          {/* Credits badge */}
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-widest uppercase text-fp-muted">Credits</span>
            <span
              className="font-display text-2xl tracking-widest"
              style={{ color: credits > 0 ? '#E8352A' : '#6B7590' }}
            >
              {credits}
            </span>
          </div>

          <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-6">
            <ProfileField label="Naam" value={meta.naam ?? '—'} />
            <ProfileField label="Leeftijd" value={meta.leeftijd ? `${meta.leeftijd} jaar` : '—'} />
            <ProfileField label="Woonplaats" value={meta.woonplaats ?? '—'} />
            <ProfileField label="Situatie" value={situatieLabel(meta.situatie)} />
            <ProfileField label="Reisbereidheid" value={reisLabel(meta.reis_afstand)} />
          </div>

          {meta.bio && (
            <>
              <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-2">Over mezelf</p>
                <p className="text-sm text-fp-offwhite leading-relaxed">{meta.bio}</p>
              </div>
            </>
          )}

          {meta.uitje_types && meta.uitje_types.length > 0 && (
            <>
              <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />
              <div>
                <p className="font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-2">Uitjes</p>
                <div className="flex flex-wrap gap-2">
                  {meta.uitje_types.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-[10px] tracking-wide px-2 py-1 border"
                      style={{ borderColor: 'rgba(232,53,42,0.3)', color: 'rgba(232,53,42,0.8)', background: 'rgba(232,53,42,0.05)' }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="h-px" style={{ background: 'rgba(238,240,244,0.07)' }} />

          <LogoutButton />
        </div>
      </div>
    </main>
  )
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-fp-muted mb-1">{label}</p>
      <p className="text-sm text-fp-white">{value}</p>
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
