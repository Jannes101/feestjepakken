import { createClient } from '@/lib/supabase/server'

export default async function SchorsingsBanner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('users')
    .select('account_status')
    .eq('id', user.id)
    .single()

  if (!profile || profile.account_status !== 'geschorst') return null

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 49,
      background: '#FF6B2B',
      padding: '0.75rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      flexWrap: 'wrap',
    }}>
      <p style={{
        margin: 0,
        fontSize: '0.82rem',
        fontWeight: 500,
        color: '#fff',
        lineHeight: 1.5,
        fontFamily: "'DM Sans', sans-serif",
      }}>
        <strong>Je account is tijdelijk geschorst.</strong>{' '}
        Je hebt 3 opeenvolgende negatieve beoordelingen ontvangen.
        Mail naar{' '}
        <a
          href="mailto:support@feestjepakken.nl"
          style={{ color: '#fff', textDecoration: 'underline', fontWeight: 600 }}
        >
          support@feestjepakken.nl
        </a>
        {' '}om je account te laten vrijgeven.
      </p>
      <a
        href="mailto:support@feestjepakken.nl"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.45rem 1.1rem',
          background: '#fff',
          color: '#FF6B2B',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '0.78rem',
          fontWeight: 600,
          borderRadius: '6px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
      >
        Mail support →
      </a>
    </div>
  )
}
