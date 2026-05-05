import Link from 'next/link'

export default function HeroSection() {
  return (
    <section
      className="px-8 pt-20 pb-14 max-w-5xl mx-auto border-b"
      style={{ borderColor: 'rgba(238,240,244,0.07)' }}
    >
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-6">
        <span className="inline-block w-6 h-px bg-fp-red" />
        <span className="font-mono text-[11px] tracking-widest uppercase text-fp-muted">
          Geen datingsite — wél gezelschap
        </span>
      </div>

      {/* Headline */}
      <h1 className="font-display text-[clamp(4rem,11vw,7.5rem)] leading-none tracking-widest uppercase mb-9">
        <span className="block text-fp-white">NIEMAND</span>
        <span
          className="block"
          style={{
            color: 'transparent',
            WebkitTextStroke: '1.5px rgba(238,240,244,0.22)',
          }}
        >
          OM MEE TE
        </span>
        <span className="block text-fp-red">GAAN?</span>
      </h1>

      {/* Bottom row */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <p className="font-body font-light text-base text-fp-muted max-w-sm leading-relaxed">
          Vind iemand die net zo graag uitgaat als jij.{' '}
          <strong className="text-fp-offwhite font-normal">
            Techno, theater, festival, concert
          </strong>{' '}
          — voor elk uitje is een maatje te vinden. Geen gedoe, geen labels.
        </p>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="/aanmelden"
            className="font-mono text-[11px] tracking-widest uppercase px-7 py-3 text-white bg-fp-red hover:bg-red-500 transition-colors"
          >
            Maak profiel aan
          </Link>
          <Link
            href="#profielen"
            className="font-mono text-[11px] tracking-widest uppercase px-7 py-3 text-fp-muted border hover:text-fp-white transition-colors"
            style={{
              background: 'transparent',
              borderColor: 'rgba(238,240,244,0.13)',
            }}
          >
            Bekijk wie er is
          </Link>
        </div>
      </div>
    </section>
  )
}
