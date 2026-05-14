'use client'

import { useState } from 'react'
import BeoordelingsFormulier from '@/components/BeoordelingsFormulier'

interface Props {
  uitjeId: string
  beoordeeldeUserId: string
  beoordeeldeNaam: string
}

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const B2 = 'rgba(28,21,16,0.14)'

export default function BeoordelingsWrapper({ uitjeId, beoordeeldeUserId, beoordeeldeNaam }: Props) {
  const [open, setOpen] = useState(false)
  const [gedaan, setGedaan] = useState(false)

  if (gedaan) {
    return (
      <div style={{ background: 'rgba(34,197,94,0.06)', border: '1.5px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.84rem', fontWeight: 500, color: '#16a34a', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
          ✓ Jouw beoordeling is verstuurd. Bedankt!
        </p>
      </div>
    )
  }

  return (
    <>
      <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontSize: '0.65rem', fontWeight: 600, color: '#8A7D72', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.25rem', fontFamily: "'DM Sans', sans-serif" }}>
            Dit uitje is voorbij
          </p>
          <p style={{ fontSize: '0.88rem', color: INK, fontFamily: "'DM Sans', sans-serif", fontWeight: 300, margin: 0 }}>
            Hoe was het met <strong style={{ fontWeight: 500 }}>{beoordeeldeNaam}</strong>? Geef een anonieme beoordeling.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          style={{ padding: '0.6rem 1.25rem', background: AMBER, color: '#fff', border: 'none', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Beoordeel →
        </button>
      </div>

      {open && (
        <BeoordelingsFormulier
          uitjeId={uitjeId}
          beoordeeldeUserId={beoordeeldeUserId}
          beoordeeldeNaam={beoordeeldeNaam}
          onClose={() => setOpen(false)}
          onSuccess={() => { setGedaan(true); setOpen(false) }}
        />
      )}
    </>
  )
}
