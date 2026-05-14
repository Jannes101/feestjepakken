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
      className="font-mono text-[11px] tracking-widest uppercase px-6 py-2.5 border transition-colors hover:border-fp-red hover:text-fp-red"
      style={{ borderColor: 'rgba(238,240,244,0.13)', color: '#6B7590' }}
    >
      Uitloggen
    </button>
  )
}
