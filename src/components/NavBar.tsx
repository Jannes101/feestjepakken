'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const BTN_BASE = {
  display: 'inline-flex', alignItems: 'center', padding: '0.5rem 1.2rem',
  fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
  borderRadius: '6px', textDecoration: 'none', transition: 'all 0.2s', cursor: 'pointer',
} as const

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setMenuOpen(false)
    router.push('/')
    router.refresh()
  }

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
        {user ? (
          <>
            <Link href="/profiel" style={{ ...BTN_BASE, color: '#3A2E26', background: 'transparent', border: '1.5px solid rgba(28,21,16,0.14)' }}>
              Mijn profiel
            </Link>
            <button onClick={handleSignOut} style={{ ...BTN_BASE, color: '#fff', background: '#FF6B2B', border: 'none' }}>
              Uitloggen
            </button>
          </>
        ) : (
          <>
            <Link href="/inloggen" style={{ ...BTN_BASE, color: '#3A2E26', background: 'transparent', border: '1.5px solid rgba(28,21,16,0.14)' }}>
              Inloggen
            </Link>
            <Link href="/aanmelden" style={{ ...BTN_BASE, color: '#fff', background: '#FF6B2B', border: 'none' }}>
              Aanmelden
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
