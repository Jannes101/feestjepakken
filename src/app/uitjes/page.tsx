'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  UITJE_TYPES, LEEFTIJD_CATEGORIEEN, OMVANG_OPTIES, DEELNAME_OPTIES, NL_PROVINCIES,
  type UitjeType, type LeeftijdCategorie, type Omvang, type DeelnameVoorkeur,
} from '@/types'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const INK2 = '#3A2E26'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'
const S1 = '#FFFFFF'

const OMVANG_MAP = Object.fromEntries(OMVANG_OPTIES.map(o => [o.value, o.label]))
const UITJE_MAP = Object.fromEntries(UITJE_TYPES.map(t => [t.value, `${t.emoji} ${t.label}`]))
const LEEFTIJD_MAP = Object.fromEntries(LEEFTIJD_CATEGORIEEN.map(c => [c.value, c.label]))
const DEELNAME_MAP = Object.fromEntries(DEELNAME_OPTIES.map(o => [o.value, o.label]))

type UitjeRow = {
  id: string
  titel: string
  type: UitjeType
  datum: string | null
  locatie: string
  provincie: string | null
  omvang: Omvang
  leeftijdscategorie: LeeftijdCategorie
  deelname_voorkeur: DeelnameVoorkeur
  created_at: string
  users: { naam: string; leeftijd: number; woonplaats: string } | null
}

type Filters = {
  type: UitjeType | 'all'
  leeftijd: LeeftijdCategorie | 'all'
  omvang: Omvang | 'all'
  deelname: DeelnameVoorkeur | 'all'
  provincie: string | 'all'
}

const INIT_FILTERS: Filters = { type: 'all', leeftijd: 'all', omvang: 'all', deelname: 'all', provincie: 'all' }

export default function UitjesPage() {
  const supabase = useMemo(() => createClient(), [])
  const [uitjes, setUitjes] = useState<UitjeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<Filters>(INIT_FILTERS)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user))

    supabase
      .from('uitjes')
      .select(`
        id, titel, type, datum, locatie, provincie,
        omvang, leeftijdscategorie, deelname_voorkeur, created_at,
        users!uitjes_user_id_fkey ( naam, leeftijd, woonplaats )
      `)
      .eq('actief', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setUitjes((data ?? []) as unknown as UitjeRow[])
        setLoading(false)
      })
  }, [supabase])

  const gefilterd = useMemo(() => {
    return uitjes.filter(u => {
      if (filters.type !== 'all' && u.type !== filters.type) return false
      if (filters.leeftijd !== 'all' && u.leeftijdscategorie !== filters.leeftijd) return false
      if (filters.omvang !== 'all' && u.omvang !== filters.omvang) return false
      if (filters.deelname !== 'all' && u.deelname_voorkeur !== filters.deelname) return false
      if (filters.provincie !== 'all' && u.provincie !== filters.provincie) return false
      return true
    })
  }, [uitjes, filters])

  function setFilter<K extends keyof Filters>(key: K, val: Filters[K]) {
    setFilters(prev => ({ ...prev, [key]: val }))
  }

  const actieveFilters = Object.values(filters).filter(v => v !== 'all').length

  return (
    <main style={{ minHeight: '100vh', background: '#FAF7F4' }}>

      {/* Header */}
      <div style={{ padding: '2.5rem 2rem 0', maxWidth: '980px', margin: '0 auto', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.2rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, margin: 0 }}>
            Uitjes
          </h1>
          <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginTop: '0.25rem' }}>
            {loading ? 'Laden…' : `${gefilterd.length} uitj${gefilterd.length === 1 ? 'e' : 'es'} gevonden`}
          </p>
        </div>
        {isLoggedIn && (
          <Link href="/uitjes/nieuw"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.7rem 1.4rem', background: AMBER, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500, whiteSpace: 'nowrap' }}>
            + Uitje aanmaken
          </Link>
        )}
      </div>

      {/* Filters */}
      <div style={{ padding: '1.5rem 2rem', maxWidth: '980px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        <FilterRow label="Type">
          <Pill active={filters.type === 'all'} onClick={() => setFilter('type', 'all')}>Alle types</Pill>
          {UITJE_TYPES.map(t => (
            <Pill key={t.value} active={filters.type === t.value} onClick={() => setFilter('type', t.value)}>
              {t.emoji} {t.label}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Leeftijd">
          <Pill active={filters.leeftijd === 'all'} onClick={() => setFilter('leeftijd', 'all')}>Alle leeftijden</Pill>
          {LEEFTIJD_CATEGORIEEN.map(c => (
            <Pill key={c.value} active={filters.leeftijd === c.value} onClick={() => setFilter('leeftijd', c.value)}>
              {c.label}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Omvang">
          <Pill active={filters.omvang === 'all'} onClick={() => setFilter('omvang', 'all')}>Alle</Pill>
          {OMVANG_OPTIES.map(o => (
            <Pill key={o.value} active={filters.omvang === o.value} onClick={() => setFilter('omvang', o.value)}>
              {o.label} <span style={{ opacity: 0.6, fontSize: '0.6rem' }}>({o.beschrijving})</span>
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Wie">
          <Pill active={filters.deelname === 'all'} onClick={() => setFilter('deelname', 'all')}>Iedereen</Pill>
          {DEELNAME_OPTIES.filter(o => o.value !== 'iedereen').map(o => (
            <Pill key={o.value} active={filters.deelname === o.value} onClick={() => setFilter('deelname', o.value)}>
              {o.label}
            </Pill>
          ))}
        </FilterRow>

        <FilterRow label="Provincie">
          <Pill active={filters.provincie === 'all'} onClick={() => setFilter('provincie', 'all')}>Alle provincies</Pill>
          {NL_PROVINCIES.map(p => (
            <Pill key={p} active={filters.provincie === p} onClick={() => setFilter('provincie', p)}>
              {p}
            </Pill>
          ))}
        </FilterRow>

        {actieveFilters > 0 && (
          <button onClick={() => setFilters(INIT_FILTERS)}
            style={{ alignSelf: 'flex-start', fontSize: '0.7rem', fontWeight: 500, color: MUTED, background: 'transparent', border: `1px solid ${B2}`, borderRadius: '100px', padding: '0.3rem 0.8rem', cursor: 'pointer' }}>
            Filters wissen ×
          </button>
        )}
      </div>

      {/* Grid */}
      <section style={{ padding: '0 2rem 4rem', maxWidth: '980px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ padding: '4rem 0', textAlign: 'center', color: MUTED, fontSize: '0.82rem' }}>Laden…</div>
        ) : gefilterd.length === 0 ? (
          <div style={{ padding: '4rem 0', textAlign: 'center' }}>
            <p style={{ fontSize: '0.82rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
              {actieveFilters > 0 ? 'Geen uitjes gevonden voor deze filters.' : 'Er zijn nog geen uitjes geplaatst.'}
            </p>
            {isLoggedIn && (
              <Link href="/uitjes/nieuw"
                style={{ display: 'inline-flex', marginTop: '1rem', padding: '0.65rem 1.25rem', background: AMBER, color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 500 }}>
                Wees de eerste →
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
            {gefilterd.map(u => <UitjeCard key={u.id} uitje={u} />)}
          </div>
        )}
      </section>
    </main>
  )
}

function UitjeCard({ uitje }: { uitje: UitjeRow }) {
  const [hovered, setHovered] = useState(false)
  const org = Array.isArray(uitje.users) ? uitje.users[0] : uitje.users

  return (
    <Link href={`/uitjes/${uitje.id}`} style={{ textDecoration: 'none' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: S1, borderRadius: '12px', border: `1.5px solid ${hovered ? B2 : B1}`, padding: '1.4rem', transform: hovered ? 'translateY(-2px)' : 'none', boxShadow: hovered ? '0 6px 24px rgba(28,21,16,0.07)' : 'none', transition: 'all 0.2s', cursor: 'pointer' }}>

        {/* Type badge */}
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: AMBER, letterSpacing: '1px', textTransform: 'uppercase' }}>
            {UITJE_MAP[uitje.type] ?? uitje.type}
          </span>
        </div>

        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK, margin: '0 0 0.4rem' }}>
          {uitje.titel}
        </h3>

        <p style={{ fontSize: '0.72rem', color: MUTED, marginBottom: '0.9rem' }}>
          {uitje.locatie}{uitje.provincie ? ` · ${uitje.provincie}` : ''}{uitje.datum ? ` · ${new Date(uitje.datum).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })}` : ''}
        </p>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.9rem' }}>
          <Tag>{LEEFTIJD_MAP[uitje.leeftijdscategorie]}</Tag>
          <Tag>{OMVANG_MAP[uitje.omvang]}</Tag>
          {uitje.deelname_voorkeur !== 'iedereen' && <Tag accent>{DEELNAME_MAP[uitje.deelname_voorkeur]}</Tag>}
        </div>

        {/* Organisator */}
        {org && (
          <p style={{ fontSize: '0.7rem', color: MUTED, margin: 0 }}>
            Door <strong style={{ color: INK2, fontWeight: 500 }}>{org.naam}</strong> · {org.leeftijd} jr · {org.woonplaats}
          </p>
        )}
      </div>
    </Link>
  )
}

function Tag({ children, accent }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span style={{ fontSize: '0.62rem', fontWeight: 500, padding: '0.2rem 0.55rem', borderRadius: '100px', border: accent ? '1.5px solid rgba(255,107,43,0.3)' : `1.5px solid ${B1}`, color: accent ? AMBER : MUTED, background: accent ? 'rgba(255,107,43,0.06)' : 'transparent' }}>
      {children}
    </span>
  )
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
      <span style={{ fontSize: '0.62rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', minWidth: '72px', flexShrink: 0 }}>
        {label}
      </span>
      {children}
    </div>
  )
}

function Pill({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ fontSize: '0.7rem', fontWeight: 500, padding: '0.3rem 0.8rem', borderRadius: '100px', border: `1.5px solid ${active ? INK : B1}`, background: active ? INK : S1, color: active ? '#FAF7F4' : MUTED, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap' }}>
      {children}
    </button>
  )
}
