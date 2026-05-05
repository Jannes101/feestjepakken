'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 border-b"
      style={{
        background: 'rgba(14,18,26,0.96)',
        backdropFilter: 'blur(10px)',
        borderColor: 'rgba(238,240,244,0.07)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="font-display text-2xl tracking-widest text-fp-white">
        FEESTJE<span className="text-fp-red">PAKKEN</span>
      </Link>

      {/* Desktop nav */}
      <ul className="hidden md:flex gap-8 list-none">
        {[
          { label: 'Profielen', href: '/uitjes' },
          { label: 'Hoe het werkt', href: '/#hoe-het-werkt' },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-mono text-xs tracking-widest uppercase text-fp-muted hover:text-fp-white transition-colors"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* CTA buttons */}
      <div className="hidden md:flex gap-2">
        <Link
          href="/inloggen"
          className="font-mono text-xs tracking-widest uppercase px-4 py-2 text-fp-muted border transition-colors hover:text-fp-white hover:border-fp-offwhite/30"
          style={{ borderColor: 'rgba(238,240,244,0.13)', background: 'transparent' }}
        >
          Inloggen
        </Link>
        <Link
          href="/aanmelden"
          className="font-mono text-xs tracking-widest uppercase px-4 py-2 text-white bg-fp-red hover:bg-red-500 transition-colors"
        >
          Aanmelden
        </Link>
      </div>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-fp-muted hover:text-fp-white"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu openen"
      >
        <div className="w-5 h-0.5 bg-current mb-1" />
        <div className="w-5 h-0.5 bg-current mb-1" />
        <div className="w-5 h-0.5 bg-current" />
      </button>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 right-0 p-6 flex flex-col gap-4 border-b"
          style={{
            background: 'rgba(14,18,26,0.98)',
            borderColor: 'rgba(238,240,244,0.07)',
          }}
        >
          <Link href="/uitjes" className="font-mono text-xs tracking-widest uppercase text-fp-muted">Profielen</Link>
          <Link href="/#hoe-het-werkt" className="font-mono text-xs tracking-widest uppercase text-fp-muted">Hoe het werkt</Link>
          <Link href="/inloggen" className="font-mono text-xs tracking-widest uppercase text-fp-muted">Inloggen</Link>
          <Link href="/aanmelden" className="font-mono text-xs tracking-widest uppercase text-fp-red">Aanmelden →</Link>
        </div>
      )}
    </nav>
  )
}
