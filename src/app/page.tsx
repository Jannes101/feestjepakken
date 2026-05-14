'use client'

import { useState } from 'react'
import HeroSection from '@/components/HeroSection'
import { StatsRow, TickerBanner, FilterBar, ProfielCard, HoeHetWerkt, Quotes, FotoCarousel, CtaBanner, Footer } from '@/components/HomeComponents'
import type { UitjeType, UserProfile } from '@/types'

const DUMMY: Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'bio' | 'situatie' | 'uitje_types'>[] = [
  { id: '1', naam: 'Sara V.',  leeftijd: 28, woonplaats: 'Amsterdam', bio: 'Zoekt iemand voor **techno & festivals** — vrienden zijn niet van de scène 🙈',                       situatie: 'single',            uitje_types: ['techno', 'festival'] },
  { id: '2', naam: 'Max H.',   leeftijd: 34, woonplaats: 'Utrecht',   bio: 'Partner is thuis-type. Zoekt iemand voor **theater of film** — goede gesprekken zijn een must.',        situatie: 'relatie',           uitje_types: ['theater', 'film', 'museum'] },
  { id: '3', naam: 'Lena R.',  leeftijd: 26, woonplaats: 'Rotterdam', bio: 'Wie gaat er mee naar **Lowlands of Pinkpop**? Mijn vriend houdt er echt niet van 😅',                  situatie: 'relatie',           uitje_types: ['concert', 'festival'] },
  { id: '4', naam: 'Daan P.',  leeftijd: 31, woonplaats: 'Den Haag',  bio: 'Zoekt maatje voor **voetbal & live muziek**. Casual, geen verplichtingen.',                            situatie: 'relatie',           uitje_types: ['sport', 'concert'] },
  { id: '5', naam: 'Joyce K.', leeftijd: 41, woonplaats: 'Eindhoven', bio: 'Dol op **kunst, museum en theater**. Kids bij papa — dan wil ik tóch nog uit!',                       situatie: 'liever_niet_zeggen', uitje_types: ['museum', 'theater'] },
]
const ONLINE = new Set(['1', '3', '5'])

const B1 = 'rgba(28,21,16,0.08)'
const INK = '#1C1510'

export default function HomePage() {
  const [filter, setFilter] = useState<UitjeType | 'all'>('all')
  const gefilterd = filter === 'all' ? DUMMY : DUMMY.filter(p => p.uitje_types.includes(filter))

  return (
    <main>
      <HeroSection />
      <StatsRow />
      <TickerBanner />
      <FilterBar activeFilter={filter} onFilter={setFilter} />

      {/* Profielen grid */}
      <section id="profielen" style={{ padding: '0 2rem 2rem', maxWidth: '980px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: '1.25rem', borderTop: `1.5px solid ${B1}`, paddingTop: '1.75rem' }}>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.3rem', letterSpacing: '2px', textTransform: 'uppercase', color: INK, margin: 0 }}>Nieuwe leden</h2>
          <a href="/uitjes" style={{ fontSize: '0.75rem', fontWeight: 500, color: '#8A7D72', textDecoration: 'none' }}>Alle profielen →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {gefilterd.map(p => <ProfielCard key={p.id} profiel={p} online={ONLINE.has(p.id)} />)}
        </div>
        {gefilterd.length === 0 && (
          <div style={{ padding: '4rem 0', textAlign: 'center', fontSize: '0.78rem', color: '#8A7D72', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Geen leden gevonden voor dit filter
          </div>
        )}
      </section>

      <HoeHetWerkt />
      <Quotes />
      <FotoCarousel />
      <CtaBanner />
      <Footer />
    </main>
  )
}
