import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Spelregels — Feestjepakken',
  description: 'De spelregels, het schorsingsbeleid en de privacyregels van Feestjepakken.',
}

const INK = '#1C1510'
const INK2 = '#3A2E26'
const AMBER = '#FF6B2B'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

const HOOFDSTUKKEN = [
  {
    nr: '01',
    titel: 'Voor wie is feestjepakken?',
    body: 'Feestjepakken is bedoeld voor mensen tussen 24 en 50 jaar die op zoek zijn naar een maatje om samen een uitje mee te beleven. Of je nu single bent of in een relatie — iedereen is welkom zolang je je aan de spelregels houdt.',
  },
  {
    nr: '02',
    titel: 'Hoe werkt de social score?',
    body: 'Na elk uitje kunnen deelnemers elkaar beoordelen. Je kiest of je de ander aanbeveelt of niet. Bij een negatieve beoordeling moet je verplicht een reden opgeven. Alle beoordelingen samen vormen je social score, die loopt van 5 (onvoldoende) tot 10 (ruim voldoende). Je score is zichtbaar op je profiel.',
  },
  {
    nr: '03',
    titel: 'Spelregels',
    lijst: [
      'Wees eerlijk in je profiel',
      'Behandel anderen met respect',
      'Geef alleen een beoordeling als je daadwerkelijk samen op stap bent geweest',
      'Misbruik van het beoordelingssysteem is niet toegestaan',
      'Ongepast gedrag kan worden gemeld via de meldknop op een profiel',
    ],
  },
  {
    nr: '04',
    titel: 'Schorsingsbeleid',
    body: 'Bij 3 opeenvolgende negatieve beoordelingen wordt je account automatisch tijdelijk geschorst. Je kunt dan geen reacties meer geven op uitjes. Om je account te laten vrijgeven mail je naar support@feestjepakken.nl met een uitleg. Feestjepakken behoudt het recht om de beoordelingen te verifiëren bij betrokken leden.',
    mailto: 'support@feestjepakken.nl',
  },
  {
    nr: '05',
    titel: 'Blokkering en verwijdering',
    body: 'Als blijkt dat een lid het beoordelingssysteem moedwillig misbruikt, heeft Feestjepakken het recht om het account permanent te blokkeren. Na een blokkering van 1 maand wordt het account geanonimiseerd en definitief verwijderd. Bij verwijdering worden alle persoonsgegevens gewist conform de AVG.',
  },
  {
    nr: '06',
    titel: 'Privacyregels',
    lijst: [
      'Achternamen zijn nooit zichtbaar voor andere leden',
      'Je exacte adres is nooit zichtbaar, alleen je stad',
      'Je geboortedatum is niet zichtbaar, alleen je leeftijd',
      'Feestjepakken deelt geen gegevens met derden',
    ],
  },
]

export default function SpelregelsPage() {
  return (
    <main style={{ minHeight: '100vh', padding: '2.5rem 2rem 5rem', background: '#FAF7F4' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Logo */}
        <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.4rem', letterSpacing: '2px', color: INK, textDecoration: 'none', display: 'inline-block', marginBottom: '2.5rem' }}>
          FEESTJE<span style={{ color: AMBER }}>PAKKEN</span>
        </Link>

        {/* Header */}
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '2.8rem', letterSpacing: '3px', textTransform: 'uppercase', color: INK, marginBottom: '0.25rem' }}>
          Spelregels
        </h1>
        <p style={{ fontSize: '0.72rem', fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', color: MUTED, marginBottom: '3rem' }}>
          Laatste update: mei 2025 · Geldig voor alle leden
        </p>

        {/* Hoofdstukken */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {HOOFDSTUKKEN.map((h) => (
            <div
              key={h.nr}
              style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.75rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.9rem' }}>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.8rem', letterSpacing: '2px', color: '#E8E0D8', lineHeight: 1, flexShrink: 0 }}>{h.nr}</span>
                <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.15rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: INK, margin: 0 }}>
                  {h.titel}
                </h2>
              </div>

              {'body' in h && h.body && (
                <p style={{ fontSize: '0.9rem', color: INK2, lineHeight: 1.75, margin: 0, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                  {h.mailto
                    ? h.body.replace(h.mailto, '').split(h.mailto).reduce<React.ReactNode[]>((acc, part, i, arr) => {
                        acc.push(part)
                        if (i < arr.length - 1)
                          acc.push(
                            <a key={i} href={`mailto:${h.mailto}`} style={{ color: AMBER, textDecoration: 'none', fontWeight: 500 }}>
                              {h.mailto}
                            </a>
                          )
                        return acc
                      }, [])
                    : h.body}
                </p>
              )}

              {'lijst' in h && h.lijst && (
                <ul style={{ margin: 0, paddingLeft: '1.1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {h.lijst.map((item, i) => (
                    <li key={i} style={{ fontSize: '0.9rem', color: INK2, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* Contact block */}
        <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#fff', border: `1.5px solid ${B1}`, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ margin: 0, fontSize: '0.84rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>
            Vragen of een melding?
          </p>
          <a href="mailto:support@feestjepakken.nl" style={{ fontSize: '0.82rem', fontWeight: 500, color: AMBER, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            support@feestjepakken.nl →
          </a>
        </div>

        <p style={{ marginTop: '2rem', textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.78rem', color: MUTED, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}>
            ← Terug naar home
          </Link>
        </p>
      </div>
    </main>
  )
}
