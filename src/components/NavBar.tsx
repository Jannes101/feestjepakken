'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1.5px solid rgba(28,21,16,0.08)',
      position: 'sticky', top: 0, zIndex: 100,
      background: 'rgba(250,247,244,0.96)',
      backdropFilter: 'blur(12px)',
    }}>
      <Link href="/" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.55rem', letterSpacing: '2px', color: '#1C1510', textDecoration: 'none' }}>
        FEESTJE<span style={{ color: '#FF6B2B' }}>PAKKEN</span>
      </Link>

      <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }} className="hidden md:flex">
        {[{ label: 'Profielen', href: '/#profielen' }, { label: 'Hoe het werkt', href: '/#hoe-het-werkt' }].map(item => (
          <li key={item.href}>
            <Link href={item.href} style={{ fontSize: '0.82rem', fontWeight: 500, color: '#8A7D72', textDecoration: 'none', letterSpacing: '0.3px', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1C1510')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8A7D72')}
            >{item.label}</Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link href="/inloggen" style={{
          display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.2rem',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
          color: '#3A2E26', background: 'transparent',
          border: '1.5px solid rgba(28,21,16,0.14)', borderRadius: '6px',
          textDecoration: 'none', transition: 'all 0.2s',
        }}>Inloggen</Link>
        <Link href="/aanmelden" style={{
          display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.2rem',
          fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
          color: '#fff', background: '#FF6B2B',
          border: 'none', borderRadius: '6px',
          textDecoration: 'none', transition: 'all 0.2s',
        }}>Aanmelden</Link>
      </div>
    </nav>
  )
}
