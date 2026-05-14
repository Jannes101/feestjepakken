'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

const TOEGESTANE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024

const AV = [
  { bg: '#FDEEE6', color: '#C04A1A', border: 'rgba(192,74,26,0.15)' },
  { bg: '#E6F5EE', color: '#1A7A4A', border: 'rgba(26,122,74,0.15)' },
  { bg: '#EEE6FD', color: '#5B1AC0', border: 'rgba(91,26,192,0.15)' },
  { bg: '#E6EEFF', color: '#1A3AC0', border: 'rgba(26,58,192,0.15)' },
  { bg: '#FDF5E6', color: '#C07A1A', border: 'rgba(192,122,26,0.15)' },
]

interface Props {
  userId: string
  huidigeFotoPath: string | null
  naam: string
}

const AMBER = '#FF6B2B'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

export default function ProfielFotoUpload({ userId, huidigeFotoPath, naam }: Props) {
  const supabase = useMemo(() => createClient(), [])
  const [fotoPad, setFotoPad] = useState<string | null>(huidigeFotoPath)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [fout, setFout] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const initials = naam.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const av = AV[naam.charCodeAt(0) % AV.length]

  useEffect(() => {
    if (!fotoPad) { setSignedUrl(null); return }
    supabase.storage.from('profielfoto').createSignedUrl(fotoPad, 3600).then(({ data }) => {
      if (data?.signedUrl) setSignedUrl(data.signedUrl)
    })
  }, [fotoPad, supabase])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!TOEGESTANE_TYPES.includes(file.type)) {
      setFout('Alleen JPG, PNG of WebP is toegestaan.')
      return
    }
    if (file.size > MAX_SIZE) {
      setFout('Bestand mag maximaal 5 MB zijn.')
      return
    }

    setFout(null)
    setUploading(true)

    const pad = `${userId}/avatar`

    const { error: uploadError } = await supabase.storage
      .from('profielfoto')
      .upload(pad, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setFout('Upload mislukt. Probeer het opnieuw.')
      setUploading(false)
      return
    }

    const { error: dbError } = await supabase
      .from('users')
      .update({ foto_url: pad })
      .eq('id', userId)

    if (dbError) {
      setFout('Kon profielfoto niet opslaan.')
      setUploading(false)
      return
    }

    setFotoPad(pad)
    setUploading(false)
  }

  async function handleVerwijder() {
    if (!fotoPad) return
    setDeleting(true)
    setFout(null)

    const { error: storageError } = await supabase.storage.from('profielfoto').remove([fotoPad])
    if (storageError) {
      setFout('Verwijderen mislukt.')
      setDeleting(false)
      return
    }

    const { error: dbError } = await supabase
      .from('users')
      .update({ foto_url: null })
      .eq('id', userId)

    if (dbError) {
      setFout('Kon profielfoto niet wissen.')
      setDeleting(false)
      return
    }

    setFotoPad(null)
    setDeleting(false)
  }

  const heeftFoto = !!signedUrl

  return (
    <div style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
      <p style={{ fontSize: '0.65rem', fontWeight: 600, color: MUTED, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '1rem' }}>Profielfoto</p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
        {heeftFoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={signedUrl!}
            alt="Profielfoto"
            style={{ width: '72px', height: '72px', borderRadius: '12px', objectFit: 'cover', border: `1.5px solid ${B1}`, flexShrink: 0 }}
          />
        ) : (
          <div style={{ width: '72px', height: '72px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.5rem', letterSpacing: '1px', background: av.bg, color: av.color, border: `1px solid ${av.border}`, flexShrink: 0 }}>
            {initials}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ padding: '0.5rem 1.1rem', background: AMBER, color: '#fff', border: 'none', borderRadius: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500, cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1 }}
          >
            {uploading ? 'Uploaden…' : heeftFoto ? 'Foto wijzigen' : 'Foto uploaden'}
          </button>
          {heeftFoto && (
            <button
              onClick={handleVerwijder}
              disabled={deleting}
              style={{ padding: '0.5rem 1.1rem', background: 'transparent', color: MUTED, border: `1.5px solid ${B1}`, borderRadius: '8px', fontFamily: "'DM Sans', sans-serif", fontSize: '0.78rem', fontWeight: 500, cursor: deleting ? 'not-allowed' : 'pointer' }}
            >
              {deleting ? 'Verwijderen…' : 'Foto verwijderen'}
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>

      {fout && (
        <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '0.75rem', fontFamily: "'DM Sans', sans-serif" }}>{fout}</p>
      )}

      <p style={{ fontSize: '0.72rem', color: MUTED, marginTop: '0.75rem', lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
        JPG, PNG of WebP · Max. 5 MB · Alleen zichtbaar voor leden met credits.
      </p>
    </div>
  )
}
