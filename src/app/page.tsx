'use client'

import { useState } from 'react'
import NavBar from '@/components/NavBar'
import HeroSection from '@/components/HeroSection'
import {
  StatsRow,
  TickerBanner,
  FilterBar,
  ProfielCard,
  HoeHetWerkt,
  FotoCarousel,
  Footer,
} from '@/components/HomeComponents'
import type { UitjeType, UserProfile } from '@/types'

// Dummy data — wordt later vervangen door Supabase query
const DUMMY_PROFIELEN: Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'bio' | 'situatie' | 'uitje_types'>[] = [
  {
    id: '1', naam: 'Sara V.', leeftijd: 28, woonplaats: 'Amsterdam',
    bio: 'Zoekt iemand voor techno & festivals — vrienden zijn niet van de scène 🙈',
    situatie: 'single', uitje_types: ['techno', 'festival'],
  },
  {
    id: '2', naam: 'Max H.', leeftijd: 34, woonplaats: 'Utrecht',
    bio: 'Partner is thuis-type. Zoekt iemand voor theater of film — goede gesprekken zijn een must.',
    situatie: 'relatie', uitje_types: ['theater', 'film', 'museum'],
  },
  {
    id: '3', naam: 'Lena R.', leeftijd: 26, woonplaats: 'Rotterdam',
    bio: 'Wie gaat er mee naar Lowlands of Pinkpop? Mijn vriend houdt er echt niet van 😅',
    situatie: 'relatie', uitje_types: ['concert', 'festival'],
  },
  {
    id: '4', naam: 'Daan P.', leeftijd: 31, woonplaats: 'Den Haag',
    bio: 'Zoekt maatje voor voetbal & live muziek. Casual, geen verplichtingen.',
    situatie: 'relatie', uitje_types: ['sport', 'concert'],
  },
  {
    id: '5', naam: 'Joyce K.', leeftijd: 41, woonplaats: 'Eindhoven',
    bio: 'Dol op kunst, museum en theater. Kids bij papa — dan wil ik tóch nog uit!',
    situatie: 'liever_niet_zeggen', uitje_types: ['museum', 'theater'],
  },
]

const ONLINE_IDS = new Set(['1', '3', '5'])

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<UitjeType | 'all'>('all')

  const gefilterd = activeFilter === 'all'
    ? DUMMY_PROFIELEN
    : DUMMY_PROFIELEN.filter((p) => p.uitje_types.includes(activeFilter))

  return (
    <main>
      <NavBar />
      <HeroSection />
      <StatsRow />
      <TickerBanner />
      <FilterBar activeFilter={activeFilter} onFilter={setActiveFilter} />

      {/* Profielen grid */}
      <section
        id="profielen"
        className="px-8 pb-8 max-w-5xl mx-auto"
      >
        <div
          className="flex items-baseline justify-between pb-5 border-t pt-7"
          style={{ borderColor: 'rgba(238,240,244,0.07)' }}
        >
          <h2 className="font-display text-xl tracking-widest uppercase">Nieuwe leden</h2>
          <a href="/uitjes" className="font-mono text-[11px] tracking-widest uppercase text-fp-muted hover:text-fp-red transition-colors">
            Alle profielen →
          </a>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 border"
          style={{ borderColor: 'rgba(238,240,244,0.07)', gap: '1px', background: 'rgba(238,240,244,0.07)' }}
        >
          {gefilterd.map((p) => (
            <ProfielCard key={p.id} profiel={p} online={ONLINE_IDS.has(p.id)} />
          ))}
        </div>

        {gefilterd.length === 0 && (
          <div className="py-16 text-center text-fp-muted font-mono text-xs tracking-widest uppercase">
            Geen leden gevonden voor dit filter
          </div>
        )}
      </section>

      <HoeHetWerkt />
      <FotoCarousel />
      <Footer />
    </main>
  )
}
