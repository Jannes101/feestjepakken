'use client'

import { useState } from 'react'
import { UITJE_TYPES, type UitjeType, type UserProfile } from '@/types'

const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'
const AMBER = '#FF6B2B'
const INK = '#1C1510'
const INK2 = '#3A2E26'
const MUTED = '#8A7D72'
const MUTED2 = '#BFB5AC'
const S1 = '#FFFFFF'
const S2 = '#F2EDE8'

// ── StatsRow ─────────────────────────────────────────────────
export function StatsRow() {
  const stats = [
    { n: '847', suffix: '+', label: 'Actieve leden' },
    { n: '24–50', suffix: '', label: 'Leeftijdscategorie' },
    { n: 'NL', suffix: '', label: 'Heel Nederland' },
    { n: '12', suffix: '+', label: 'Type uitjes' },
  ]
  return (
    <div style={{ display: 'flex', borderTop: `1.5px solid ${B1}`, borderBottom: `1.5px solid ${B1}`, background: S1 }}>
      {stats.map((s, i) => (
        <div key={s.label} style={{ flex: 1, padding: '1.25rem 2rem', borderRight: i < stats.length - 1 ? `1px solid ${B1}` : 'none' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '1px', color: INK, lineHeight: 1 }}>
            {s.n}<span style={{ color: AMBER }}>{s.suffix}</span>
          </div>
          <div style={{ fontSize: '0.68rem', fontWeight: 500, letterSpacing: '0.8px', textTransform: 'uppercase', color: MUTED, marginTop: '3px' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ── TickerBanner ─────────────────────────────────────────────
const ITEMS = ['Techno', 'Theater', 'Concert', 'Festival', 'Film', 'Museum', 'Sport', 'Bar', 'Expo', 'Comedy']

export function TickerBanner() {
  const doubled = [...ITEMS, ...ITEMS]
  return (
    <div style={{ overflow: 'hidden', borderBottom: `1.5px solid ${B1}`, padding: '0.65rem 0', background: S2 }}>
      <div className="animate-ticker" style={{ display: 'flex', whiteSpace: 'nowrap', width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span key={i} style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0 2rem', color: MUTED }}>
            {item} <span style={{ color: AMBER }}>·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── FilterBar ────────────────────────────────────────────────
interface FilterBarProps {
  activeFilter: UitjeType | 'all'
  onFilter: (f: UitjeType | 'all') => void
}

export function FilterBar({ activeFilter, onFilter }: FilterBarProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', padding: '1.75rem 2rem', maxWidth: '980px', margin: '0 auto' }}>
      {[{ value: 'all' as const, label: 'Alles' }, ...UITJE_TYPES.map(t => ({ value: t.value, label: t.label }))].map(tag => {
        const active = activeFilter === tag.value
        return (
          <button key={tag.value} onClick={() => onFilter(tag.value)} style={{
            fontSize: '0.73rem', fontWeight: 500, padding: '0.4rem 1rem',
            background: active ? INK : S1,
            border: `1.5px solid ${active ? INK : B1}`,
            color: active ? '#FAF7F4' : MUTED,
            cursor: 'pointer', borderRadius: '100px', transition: 'all 0.2s',
          }}>{tag.label}</button>
        )
      })}
    </div>
  )
}

// ── Avatar colours ────────────────────────────────────────────
const AV = [
  { bg: '#FDEEE6', color: '#C04A1A', border: 'rgba(192,74,26,0.15)' },
  { bg: '#E6F5EE', color: '#1A7A4A', border: 'rgba(26,122,74,0.15)' },
  { bg: '#EEE6FD', color: '#5B1AC0', border: 'rgba(91,26,192,0.15)' },
  { bg: '#E6EEFF', color: '#1A3AC0', border: 'rgba(26,58,192,0.15)' },
  { bg: '#FDF5E6', color: '#C07A1A', border: 'rgba(192,122,26,0.15)' },
]

// ── ProfielCard ──────────────────────────────────────────────
type CardProfile = Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'bio' | 'situatie' | 'uitje_types'>
const SITUATIE_LABELS: Record<string, string> = { single: 'Single', relatie: 'In relatie', getrouwd: 'Getrouwd', liever_niet_zeggen: '—' }
const UITJE_MAP = Object.fromEntries(UITJE_TYPES.map(t => [t.value, t.label]))

export function ProfielCard({ profiel, online }: { profiel: CardProfile; online?: boolean }) {
  const initials = profiel.naam.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const av = AV[profiel.naam.charCodeAt(0) % AV.length]
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: S1, padding: '1.4rem', cursor: 'pointer',
        borderRadius: '12px', border: `1.5px solid ${hovered ? B2 : B1}`,
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 6px 24px rgba(28,21,16,0.07)' : 'none',
        transition: 'all 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '1px', background: av.bg, color: av.color, border: `1px solid ${av.border}` }}>{initials}</div>
        {online && <span style={{ fontSize: '0.65rem', fontWeight: 600, color: '#16a34a', letterSpacing: '0.3px', display: 'flex', alignItems: 'center', gap: '4px' }}><span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />Online</span>}
      </div>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1rem', letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: '1px', color: INK }}>{profiel.naam}</div>
      <div style={{ fontSize: '0.68rem', color: MUTED, marginBottom: '0.85rem' }}>{profiel.leeftijd} jr · {profiel.woonplaats} · {SITUATIE_LABELS[profiel.situatie]}</div>
      {profiel.bio && (
        <p style={{ fontSize: '0.8rem', fontWeight: 300, color: MUTED, borderLeft: `2.5px solid #E8E0D8`, paddingLeft: '0.7rem', marginBottom: '0.9rem', lineHeight: 1.6, margin: '0 0 0.9rem' }}>
          <span dangerouslySetInnerHTML={{ __html: (profiel.bio.length > 90 ? profiel.bio.slice(0, 90) + '…' : profiel.bio).replace(/\*\*(.*?)\*\*/g, `<b style="color:${INK2};font-weight:500">$1</b>`) }} />
        </p>
      )}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
        {profiel.uitje_types.slice(0, 2).map(type => (
          <span key={type} style={{ fontSize: '0.66rem', fontWeight: 500, padding: '0.2rem 0.6rem', border: '1.5px solid rgba(255,107,43,0.25)', color: AMBER, background: 'rgba(255,107,43,0.08)', borderRadius: '100px' }}>{UITJE_MAP[type] ?? type}</span>
        ))}
        <span style={{ fontSize: '0.66rem', fontWeight: 500, padding: '0.2rem 0.6rem', border: `1.5px solid ${B1}`, color: MUTED, borderRadius: '100px' }}>{SITUATIE_LABELS[profiel.situatie]}</span>
      </div>
    </div>
  )
}

// ── HoeHetWerkt ──────────────────────────────────────────────
const STAPPEN = [
  { n: '01', title: 'Maak een profiel', body: 'Gratis en anoniem. Vertel wat je leuk vindt en wat voor maatje je zoekt.' },
  { n: '02', title: 'Blader & filter',  body: 'Zoek op type uitje, stad of leeftijd. Vind iemand op dezelfde golflengte.' },
  { n: '03', title: 'Stuur een berichtje', body: 'Neem contact op en bespreek waar jullie naartoe gaan. Direct en zonder gedoe.' },
  { n: '04', title: 'Ga samen!', body: 'Geen labels, geen verplichtingen. Gewoon lekker genieten van een avond uit.' },
]

export function HoeHetWerkt() {
  return (
    <section id="hoe-het-werkt" style={{ padding: '2rem 2rem 3rem', maxWidth: '980px', margin: '0 auto', borderTop: `1.5px solid ${B1}` }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', color: INK }}>Zo werkt het</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {STAPPEN.map(s => (
          <div key={s.n} style={{ background: S1, padding: '1.5rem', borderRadius: '12px', border: `1.5px solid ${B1}` }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', letterSpacing: '2px', color: '#E8E0D8', lineHeight: 1, marginBottom: '0.7rem' }}>{s.n}</div>
            <h3 style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem', color: INK }}>{s.title}</h3>
            <p style={{ fontSize: '0.78rem', fontWeight: 300, color: MUTED, lineHeight: 1.65, margin: 0 }}>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── Quotes ───────────────────────────────────────────────────
const QUOTES = [
  { text: '"Via feestjepakken iemand gevonden voor Awakenings. Zelfde muziekssmaak, top avond. Mijn vrienden snappen dat gewoon niet."', name: 'Sara, 28', detail: 'Amsterdam · Techno', av: AV[0], initials: 'SV' },
  { text: '"Mijn vrouw houdt niet van theater. Nu ga ik gewoon met iemand die er ook van geniet. Zo simpel is het eigenlijk."', name: 'Max, 34', detail: 'Utrecht · Theater & Film', av: AV[1], initials: 'MH' },
  { text: '"Eindelijk iemand gevonden voor Lowlands! Had al bijna mijn kaartje verkocht. Zo blij dat ik dit platform heb gevonden."', name: 'Lena, 26', detail: 'Rotterdam · Festival', av: AV[2], initials: 'LR' },
]

export function Quotes() {
  return (
    <section style={{ padding: '0 2rem 3rem', maxWidth: '980px', margin: '0 auto', borderTop: `1.5px solid ${B1}`, paddingTop: '2rem' }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem', color: INK }}>Wat anderen zeggen</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {QUOTES.map((q, i) => (
          <div key={i} style={{ background: S1, border: `1.5px solid ${B1}`, borderRadius: '12px', padding: '1.4rem' }}>
            <p style={{ fontSize: '0.88rem', fontWeight: 300, color: INK2, lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>{q.text}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '0.75rem', background: q.av.bg, color: q.av.color, flexShrink: 0 }}>{q.initials}</div>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: INK }}>{q.name}</div>
                <div style={{ fontSize: '0.68rem', color: MUTED }}>{q.detail}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ── FotoCarousel ─────────────────────────────────────────────
const PHOTOS = [
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
  const photos = [...PHOTOS, ...PHOTOS]
  return (
    <section style={{ borderTop: `1.5px solid ${B1}`, paddingTop: '2rem', paddingBottom: '3rem', background: S2 }}>
      <div style={{ padding: '0 2rem 1.5rem', maxWidth: '980px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase', color: INK }}>Zo ziet een goed avondje eruit</h2>
      </div>
      <div style={{ overflow: 'hidden' }}>
        <div className="animate-carousel" style={{ display: 'flex', gap: '10px', width: 'max-content' }}>
          {photos.map((p, i) => (
            <div key={i} style={{ flexShrink: 0, width: '240px', height: '180px', overflow: 'hidden', borderRadius: '10px' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://images.unsplash.com/photo-${p.id}?w=480&h=360&fit=crop&auto=format&q=60`}
                alt={p.alt} loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'saturate(0.85) brightness(0.92)', transition: 'filter 0.4s' }}
                onMouseEnter={e => (e.currentTarget.style.filter = 'saturate(1) brightness(1)')}
                onMouseLeave={e => (e.currentTarget.style.filter = 'saturate(0.85) brightness(0.92)')}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── CtaBanner ────────────────────────────────────────────────
export function CtaBanner() {
  return (
    <div style={{ padding: '3rem 2rem', maxWidth: '980px', margin: '0 auto' }}>
      <div style={{ background: INK, borderRadius: '16px', padding: '2.5rem 2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2rem', letterSpacing: '2px', textTransform: 'uppercase', lineHeight: 1.05, color: '#FAF7F4', margin: 0 }}>
            Klaar om <span style={{ color: AMBER }}>samen uit</span> te gaan?
          </h2>
          <p style={{ color: 'rgba(250,247,244,0.55)', fontSize: '0.85rem', fontWeight: 300, marginTop: '0.4rem', margin: '0.4rem 0 0' }}>Gratis aanmelden, eerste reactie is op ons. Geen verplichtingen.</p>
        </div>
        <a href="/aanmelden" style={{ display: 'inline-flex', alignItems: 'center', padding: '0.85rem 2rem', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500, color: '#fff', background: AMBER, borderRadius: '6px', textDecoration: 'none', border: 'none', whiteSpace: 'nowrap' }}>
          Maak gratis profiel aan →
        </a>
      </div>
    </div>
  )
}

// ── Footer ───────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ borderTop: `1.5px solid ${B1}`, padding: '2rem', textAlign: 'center', background: S1 }}>
      <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '3px', marginBottom: '0.35rem', color: INK }}>
        FEESTJE<span style={{ color: AMBER }}>PAKKEN</span>
      </div>
      <p style={{ fontSize: '0.7rem', fontWeight: 400, color: MUTED, letterSpacing: '0.5px', textTransform: 'uppercase', margin: '0 0 0.6rem' }}>
        Uitjesmaatjes vinden in heel Nederland · Gratis · Geen datingsite
      </p>
      <a href="/spelregels" style={{ fontSize: '0.68rem', fontWeight: 500, color: MUTED, textDecoration: 'none', letterSpacing: '0.5px', textTransform: 'uppercase', borderBottom: `1px solid ${B2}`, paddingBottom: '1px' }}>
        Spelregels
      </a>
    </footer>
  )
}
