'use client'

// ── StatsRow ────────────────────────────────────────────────
export function StatsRow() {
  const stats = [
    { n: '847+', label: 'Actieve leden' },
    { n: '24–50', label: 'Leeftijdscategorie' },
    { n: 'NL', label: 'Heel Nederland' },
    { n: '12+', label: 'Type uitjes' },
  ]

  return (
    <div
      className="flex border-y"
      style={{
        background: '#151C27',
        borderColor: 'rgba(238,240,244,0.07)',
      }}
    >
      {stats.map((s, i) => (
        <div
          key={s.label}
          className="flex-1 px-8 py-5 border-r last:border-r-0"
          style={{ borderColor: 'rgba(238,240,244,0.07)' }}
        >
          <div className="font-display text-3xl tracking-wide text-fp-white leading-none">
            {s.n.includes('+') ? (
              <>{s.n.replace('+', '')}<span className="text-fp-red">+</span></>
            ) : s.n.includes('–') ? (
              <>{s.n.split('–')[0]}<span className="text-fp-red">–</span>{s.n.split('–')[1]}</>
            ) : (
              s.n
            )}
          </div>
          <div className="font-mono text-[10px] tracking-widest uppercase text-fp-muted mt-1">
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── TickerBanner ─────────────────────────────────────────────
const TICKER_ITEMS = [
  'Techno', 'Theater', 'Concert', 'Festival', 'Film',
  'Museum', 'Sport', 'Bar', 'Expo', 'Dance', 'Opera', 'Comedy',
]

export function TickerBanner() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <div
      className="overflow-hidden border-b py-2.5"
      style={{ background: '#151C27', borderColor: 'rgba(238,240,244,0.07)' }}
    >
      <div className="flex whitespace-nowrap animate-ticker">
        {items.map((item, i) => (
          <span key={i} className="font-mono text-[11px] tracking-widest uppercase px-8">
            <span className="text-fp-muted">{item}</span>
            {' '}
            <span className="text-fp-red">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── FilterBar ────────────────────────────────────────────────
import { useState } from 'react'
import { UITJE_TYPES, type UitjeType } from '@/types'

interface FilterBarProps {
  activeFilter: UitjeType | 'all'
  onFilter: (filter: UitjeType | 'all') => void
}

export function FilterBar({ activeFilter, onFilter }: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-2 px-8 py-7 max-w-5xl mx-auto">
      <button
        onClick={() => onFilter('all')}
        className="font-mono text-[11px] tracking-wide uppercase px-4 py-1.5 border transition-colors"
        style={activeFilter === 'all'
          ? { background: '#EEF0F4', color: '#0E121A', borderColor: '#EEF0F4' }
          : { background: 'transparent', color: '#6B7590', borderColor: 'rgba(238,240,244,0.13)' }
        }
      >
        Alles
      </button>
      {UITJE_TYPES.map((t) => (
        <button
          key={t.value}
          onClick={() => onFilter(t.value)}
          className="font-mono text-[11px] tracking-wide uppercase px-4 py-1.5 border transition-colors"
          style={activeFilter === t.value
            ? { background: '#EEF0F4', color: '#0E121A', borderColor: '#EEF0F4' }
            : { background: 'transparent', color: '#6B7590', borderColor: 'rgba(238,240,244,0.13)' }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

// ── ProfielCard ──────────────────────────────────────────────
import type { UserProfile } from '@/types'

interface ProfielCardProps {
  profiel: Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'bio' | 'situatie' | 'uitje_types'>
  online?: boolean
}

const AVATAR_COLORS = [
  { bg: '#232E42', text: '#ff6b6b', border: 'rgba(255,107,107,0.2)' },
  { bg: '#232E42', text: '#ffd166', border: 'rgba(255,209,102,0.2)' },
  { bg: '#232E42', text: '#a29bfe', border: 'rgba(162,155,254,0.2)' },
  { bg: '#232E42', text: '#74b9ff', border: 'rgba(116,185,255,0.2)' },
  { bg: '#232E42', text: '#55efc4', border: 'rgba(85,239,196,0.2)' },
]

function getAvatarColor(naam: string) {
  const idx = naam.charCodeAt(0) % AVATAR_COLORS.length
  return AVATAR_COLORS[idx]
}

export function ProfielCard({ profiel, online }: ProfielCardProps) {
  const initials = profiel.naam.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
  const color = getAvatarColor(profiel.naam)
  const topTypes = profiel.uitje_types.slice(0, 2)
  const UITJE_LABELS = Object.fromEntries(UITJE_TYPES.map((t) => [t.value, t.label]))

  const SITUATIE_LABELS: Record<string, string> = {
    single: 'Single',
    relatie: 'In relatie',
    getrouwd: 'Getrouwd',
    liever_niet_zeggen: '—',
  }

  return (
    <div
      className="relative p-5 cursor-pointer transition-colors group"
      style={{ background: '#151C27', border: '1px solid rgba(238,240,244,0.07)' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1C2535')}
      onMouseLeave={(e) => (e.currentTarget.style.background = '#151C27')}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div
          className="w-10 h-10 flex items-center justify-center font-display text-sm tracking-wide"
          style={{ background: color.bg, color: color.text, border: `1px solid ${color.border}` }}
        >
          {initials}
        </div>
        {online && (
          <span className="font-mono text-[10px] tracking-wide flex items-center gap-1" style={{ color: '#4cde80' }}>
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#4cde80' }} />
            Online
          </span>
        )}
      </div>

      {/* Name + meta */}
      <div className="font-display text-base tracking-widest uppercase mb-0.5">{profiel.naam}</div>
      <div className="font-mono text-[10px] text-fp-muted tracking-wide mb-3">
        {profiel.leeftijd} jr · {profiel.woonplaats} · {SITUATIE_LABELS[profiel.situatie]}
      </div>

      {/* Bio blurb */}
      {profiel.bio && (
        <p
          className="text-[13px] font-light text-fp-muted leading-relaxed mb-3 pl-3"
          style={{ borderLeft: '2px solid rgba(238,240,244,0.13)' }}
        >
          {profiel.bio.length > 90 ? profiel.bio.slice(0, 90) + '…' : profiel.bio}
        </p>
      )}

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5">
        {topTypes.map((type) => (
          <span
            key={type}
            className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5"
            style={{ border: '1px solid rgba(232,53,42,0.3)', color: 'rgba(232,53,42,0.8)' }}
          >
            {UITJE_LABELS[type] ?? type}
          </span>
        ))}
        <span
          className="font-mono text-[10px] uppercase tracking-wide px-2 py-0.5"
          style={{ border: '1px solid rgba(238,240,244,0.13)', color: '#6B7590' }}
        >
          {SITUATIE_LABELS[profiel.situatie]}
        </span>
      </div>
    </div>
  )
}

// ── HoeHetWerkt ──────────────────────────────────────────────
const STAPPEN = [
  { n: '01', title: 'Maak een profiel', body: 'Gratis en anoniem. Vertel wat je leuk vindt en wat voor maatje je zoekt.' },
  { n: '02', title: 'Blader & filter', body: 'Zoek op type uitje, stad of leeftijd. Vind iemand op dezelfde golflengte.' },
  { n: '03', title: 'Stuur een berichtje', body: 'Neem contact op en bespreek waar jullie naartoe gaan. Direct en zonder gedoe.' },
  { n: '04', title: 'Ga samen!', body: 'Geen labels, geen verplichtingen. Gewoon lekker genieten van een avond uit.' },
]

export function HoeHetWerkt() {
  return (
    <section
      id="hoe-het-werkt"
      className="px-8 py-10 max-w-5xl mx-auto border-t"
      style={{ borderColor: 'rgba(238,240,244,0.07)' }}
    >
      <h2 className="font-display text-xl tracking-widest uppercase mb-6">Zo werkt het</h2>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border"
        style={{ borderColor: 'rgba(238,240,244,0.07)' }}
      >
        {STAPPEN.map((s, i) => (
          <div
            key={s.n}
            className="p-6 border-r last:border-r-0"
            style={{ background: '#151C27', borderColor: 'rgba(238,240,244,0.07)' }}
          >
            <div className="font-display text-5xl leading-none mb-3" style={{ color: '#232E42' }}>
              {s.n}
            </div>
            <h3 className="font-mono text-[11px] tracking-widest uppercase text-fp-offwhite mb-2">
              {s.title}
            </h3>
            <p className="text-[13px] font-light text-fp-muted leading-relaxed">{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── FotoCarousel ─────────────────────────────────────────────
const CAROUSEL_PHOTOS = [
  { id: '1540575467369-52fbc0f9ea4e', alt: 'Concert' },
  { id: '1501281668745-f7f57925c2ac', alt: 'Festival' },
  { id: '1493676304819-0d840a92a260', alt: 'Club' },
  { id: '1516450360452-9312f5e86fc7', alt: 'Nacht uit' },
  { id: '1470229722913-7c0e2dbbafd3', alt: 'Live muziek' },
  { id: '1429962714451-bb934ecdc4ec', alt: 'Festival crowd' },
  { id: '1524368535928-5b5e00ddc76b', alt: 'Theater' },
  { id: '1460723237483-7a6dc9d0b212', alt: 'Museum' },
]

export function FotoCarousel() {
  const photos = [...CAROUSEL_PHOTOS, ...CAROUSEL_PHOTOS]

  return (
    <section
      className="border-t pt-8 pb-12"
      style={{ borderColor: 'rgba(238,240,244,0.07)' }}
    >
      <div className="px-8 max-w-5xl mx-auto mb-6">
        <h2 className="font-display text-xl tracking-widest uppercase">Zo ziet een goed avondje eruit</h2>
      </div>
      <div className="overflow-hidden w-full">
        <div className="flex gap-3 animate-carousel" style={{ width: 'max-content' }}>
          {photos.map((p, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-64 h-48 overflow-hidden"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${p.id}?w=520&h=400&fit=crop&auto=format&q=60`}
                alt={p.alt}
                className="w-full h-full object-cover transition-all duration-300"
                style={{ filter: 'saturate(0.7) brightness(0.85)' }}
                onMouseEnter={(e) => (e.currentTarget.style.filter = 'saturate(1) brightness(1)')}
                onMouseLeave={(e) => (e.currentTarget.style.filter = 'saturate(0.7) brightness(0.85)')}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Footer ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer
      className="border-t py-8 text-center"
      style={{ borderColor: 'rgba(238,240,244,0.07)' }}
    >
      <div className="font-display text-xl tracking-widest mb-1">
        FEESTJE<span className="text-fp-red">PAKKEN</span>
      </div>
      <p className="font-mono text-[10px] tracking-widest uppercase text-fp-muted">
        Uitjesmaatjes vinden in heel Nederland · Gratis · Geen datingsite
      </p>
    </footer>
  )
}
