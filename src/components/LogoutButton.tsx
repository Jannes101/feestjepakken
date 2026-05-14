'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LogoutButton() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button
      onClick={handleSignOut}
      style={{
        padding: '0.45rem 1rem',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.8rem', fontWeight: 500,
        color: '#8A7D72', background: 'transparent',
        border: '1.5px solid rgba(28,21,16,0.14)', borderRadius: '6px',
        cursor: 'pointer', transition: 'all 0.2s',
      }}
    >
      Uitloggen
    </button>
  )
}
