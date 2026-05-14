import Link from 'next/link'

export default function HeroSection() {
  return (
    <section style={{ padding: '5rem 2rem 4rem', maxWidth: '980px', margin: '0 auto' }}>
      {/* Eyebrow */}
      <div style={{ marginBottom: '1.5rem' }}>
        <span style={{
          display: 'inline-block',
          background: 'rgba(255,107,43,0.08)',
          border: '1px solid rgba(255,107,43,0.2)',
          color: '#FF6B2B',
          fontSize: '0.72rem', fontWeight: 600,
          letterSpacing: '0.8px', textTransform: 'uppercase',
          padding: '0.3rem 0.85rem', borderRadius: '100px',
        }}>Geen datingsite — wél gezelschap</span>
      </div>

      {/* Headline */}
      <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(3.8rem, 10vw, 7rem)', lineHeight: 0.92, letterSpacing: '2px', marginBottom: '2.2rem', textTransform: 'uppercase' }}>
        <span style={{ display: 'block', color: '#1C1510' }}>NIEMAND</span>
        <span style={{ display: 'block', color: 'transparent', WebkitTextStroke: '1.5px rgba(28,21,16,0.18)' }}>OM MEE TE</span>
        <span style={{ display: 'block', color: '#FF6B2B' }}>GAAN?</span>
      </h1>

      {/* Bottom row */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
        <p style={{ fontWeight: 300, fontSize: '1rem', color: '#8A7D72', maxWidth: '380px', lineHeight: 1.85, margin: 0 }}>
          Vind iemand die net zo graag uitgaat als jij.{' '}
          <strong style={{ color: '#3A2E26', fontWeight: 500 }}>Techno, theater, festival, concert</strong>{' '}
          — voor elk uitje is een maatje te vinden. Geen gedoe, geen labels.
        </p>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          <Link href="/aanmelden" style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.8rem 1.8rem',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500,
            color: '#fff', background: '#FF6B2B', borderRadius: '6px',
            textDecoration: 'none', border: 'none', transition: 'all 0.2s',
          }}>Maak profiel aan</Link>
          <Link href="/#profielen" style={{
            display: 'inline-flex', alignItems: 'center', padding: '0.8rem 1.8rem',
            fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500,
            color: '#3A2E26', background: 'transparent',
            border: '1.5px solid rgba(28,21,16,0.14)', borderRadius: '6px',
            textDecoration: 'none', transition: 'all 0.2s',
          }}>Bekijk wie er is</Link>
        </div>
      </div>
    </section>
  )
}
