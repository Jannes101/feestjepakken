'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import {
  UITJE_TYPES, OMVANG_OPTIES, DEELNAME_OPTIES, NL_PROVINCIES,
  type UitjeType, type Omvang, type DeelnameVoorkeur,
  type LeeftijdCategorie, type Geslacht, type Gender, LEEFTIJD_CATEGORIEEN,
} from '@/types'

const AMBER = '#FF6B2B'
const INK = '#1C1510'
const MUTED = '#8A7D72'
const B1 = 'rgba(28,21,16,0.08)'
const B2 = 'rgba(28,21,16,0.14)'

interface Props {
  userId: string
  leeftijdCategorie: LeeftijdCategorie
  geslacht: Geslacht
  gender: Gender
}

function toegestaneDeelnameOpties(geslacht: Geslacht, gender: Gender) {
  return DEELNAME_OPTIES.filter(o => {
    if (o.value === 'iedereen') return true
    if (o.value === 'alleen_mannen') return geslacht === 'man'
    if (o.value === 'alleen_vrouwen') return geslacht === 'vrouw'
    if (o.value === 'alleen_non_binair') return gender === 'non_binair' || gender === 'anders'
    return false
  })
}

const LABEL_MAP = Object.fromEntries(LEEFTIJD_CATEGORIEEN.map(c => [c.value, c.label]))

export default function NieuwUitjeFormulier({ userId, leeftijdCategorie, geslacht, gender }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fout, setFout] = useState('')
  const [selectedType, setSelectedType] = useState<UitjeType>('overig')
  const [omvang, setOmvang] = useState<Omvang>('solo')
  const [deelname, setDeelname] = useState<DeelnameVoorkeur>('iedereen')
  const [selectedCats, setSelectedCats] = useState<LeeftijdCategorie[]>([leeftijdCategorie])

  function toggleCat(cat: LeeftijdCategorie) {
    if (cat === leeftijdCategorie) return
    setSelectedCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }

  const deelnameOpties = toegestaneDeelnameOpties(geslacht, gender)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setFout('')

    const fd = new FormData(e.currentTarget)
    const supabase = createClient()

    const { data: uitje, error } = await supabase
      .from('uitjes')
      .insert({
        user_id: userId,
        titel: fd.get('titel') as string,
        beschrijving: fd.get('beschrijving') as string,
        type: selectedType,
        datum: (fd.get('datum') as string) || null,
        locatie: fd.get('locatie') as string,
        provincie: (fd.get('provincie') as string) || null,
        max_personen: Number(fd.get('max_personen')),
        leeftijdscategorie: selectedCats,
        omvang,
        deelname_voorkeur: deelname,
      })
      .select('id')
      .single()

    if (error) {
      setFout('Er is iets misgegaan. Probeer het opnieuw.')
      setLoading(false)
      return
    }

    router.push(`/uitjes/${uitje.id}`)
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: `1.5px solid ${B2}`, borderRadius: '14px', padding: '1.75rem' }}>

      {/* Type */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={labelStyle}>Type uitje</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
          {UITJE_TYPES.map(t => {
            const on = selectedType === t.value
            return (
              <button key={t.value} type="button" onClick={() => setSelectedType(t.value)}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.45rem 0.75rem', fontSize: '0.73rem', fontWeight: 500, cursor: 'pointer', borderRadius: '8px', border: `1.5px solid ${on ? 'rgba(255,107,43,0.4)' : B1}`, color: on ? AMBER : MUTED, background: on ? 'rgba(255,107,43,0.08)' : '#FAF7F4', transition: 'all 0.15s', textAlign: 'left' }}>
                <span style={{ width: '13px', height: '13px', border: `1.5px solid ${on ? AMBER : B2}`, borderRadius: '3px', background: on ? AMBER : 'transparent', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', flexShrink: 0 }}>{on ? '✓' : ''}</span>
                {t.emoji} {t.label}
              </button>
            )
          })}
        </div>
      </div>

      <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />

      {/* Titel + beschrijving */}
      <div style={{ marginBottom: '1rem' }}><FieldWrap label="Titel"><input type="text" name="titel" required placeholder="Wie gaat er mee naar Dekmantel?" /></FieldWrap></div>
      <div style={{ marginBottom: '1rem' }}><FieldWrap label="Beschrijving"><textarea name="beschrijving" required rows={3} placeholder="Vertel iets meer over het uitje, wat je zoekt, en hoe je de dag / avond ziet..." /></FieldWrap></div>

      <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />

      {/* Locatie + provincie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <FieldWrap label="Locatie / stad"><input type="text" name="locatie" required placeholder="Amsterdam" /></FieldWrap>
        <FieldWrap label="Provincie">
          <select name="provincie" defaultValue="">
            <option value="">Kies provincie...</option>
            {NL_PROVINCIES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </FieldWrap>
      </div>

      {/* Datum + max_personen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <FieldWrap label="Datum (optioneel)"><input type="date" name="datum" /></FieldWrap>
        <FieldWrap label="Max. personen"><input type="number" name="max_personen" required defaultValue={2} min={2} max={100} /></FieldWrap>
      </div>

      <div style={{ height: '1px', background: B1, margin: '1.25rem 0' }} />

      {/* Omvang */}
      <div style={{ marginBottom: '1.25rem' }}>
        <p style={labelStyle}>Omvang</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {OMVANG_OPTIES.map(o => {
            const on = omvang === o.value
            return (
              <button key={o.value} type="button" onClick={() => setOmvang(o.value)}
                style={{ padding: '0.6rem 0.9rem', borderRadius: '8px', border: `1.5px solid ${on ? 'rgba(255,107,43,0.4)' : B1}`, background: on ? 'rgba(255,107,43,0.08)' : '#FAF7F4', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s' }}>
                <div style={{ fontSize: '0.73rem', fontWeight: 600, color: on ? AMBER : INK }}>{o.label}</div>
                <div style={{ fontSize: '0.65rem', color: MUTED, marginTop: '1px' }}>{o.beschrijving}</div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Leeftijdscategorie multi-select */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.6rem' }}>
          <p style={{ ...labelStyle, margin: 0 }}>Leeftijdscategorie</p>
          <span style={{ fontSize: '0.65rem', color: MUTED, fontFamily: "'DM Sans', sans-serif" }}>Meerdere mogelijk</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {LEEFTIJD_CATEGORIEEN.map(c => {
            const isOwn = c.value === leeftijdCategorie
            const isSelected = selectedCats.includes(c.value)
            return (
              <button
                key={c.value}
                type="button"
                disabled={isOwn}
                onClick={() => toggleCat(c.value)}
                style={{
                  fontSize: '0.73rem', fontWeight: isOwn ? 600 : 500, padding: '0.4rem 1rem',
                  borderRadius: '100px',
                  border: `1.5px solid ${isSelected ? 'rgba(255,107,43,0.4)' : B1}`,
                  background: isSelected ? 'rgba(255,107,43,0.08)' : '#FAF7F4',
                  color: isSelected ? AMBER : MUTED,
                  cursor: isOwn ? 'default' : 'pointer',
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: '4px',
                }}>
                {c.label}
                {isOwn && <span style={{ fontSize: '0.55rem', opacity: 0.6 }}>●</span>}
              </button>
            )
          })}
        </div>
        <p style={{ fontSize: '0.65rem', color: MUTED, marginTop: '0.45rem', fontFamily: "'DM Sans', sans-serif" }}>
          Jouw categorie ({LABEL_MAP[leeftijdCategorie]}) is altijd inbegrepen en kan niet worden uitgevinkt.
        </p>
      </div>

      {/* Deelname voorkeur */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={labelStyle}>Wie mag reageren?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
          {deelnameOpties.map(o => {
            const on = deelname === o.value
            return (
              <button key={o.value} type="button" onClick={() => setDeelname(o.value)}
                style={{ fontSize: '0.73rem', fontWeight: 500, padding: '0.4rem 1rem', borderRadius: '100px', border: `1.5px solid ${on ? 'rgba(255,107,43,0.4)' : B1}`, background: on ? 'rgba(255,107,43,0.08)' : '#FAF7F4', color: on ? AMBER : MUTED, cursor: 'pointer', transition: 'all 0.15s' }}>
                {o.label}
              </button>
            )
          })}
        </div>
      </div>

      <button type="submit" disabled={loading}
        style={{ width: '100%', padding: '0.95rem', border: 'none', background: AMBER, color: '#fff', fontFamily: "'Bebas Neue', sans-serif", fontSize: '1.1rem', letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', borderRadius: '8px', opacity: loading ? 0.7 : 1 }}>
        {loading ? 'Even geduld…' : 'Uitje aanmaken →'}
      </button>

      {fout && <p style={{ fontSize: '0.78rem', color: '#dc2626', marginTop: '1rem', fontFamily: "'DM Sans', sans-serif" }}>{fout}</p>}
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: '0.65rem', fontWeight: 600, color: MUTED,
  letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '0.6rem',
}

const inputClass = `
  [&_input]:w-full [&_input]:bg-[#FAF7F4] [&_input]:border [&_input]:border-[rgba(28,21,16,0.1)]
  [&_input]:rounded-lg [&_input]:px-3 [&_input]:py-2.5 [&_input]:text-[#1C1510] [&_input]:text-sm [&_input]:outline-none
  [&_input:focus]:border-[rgba(255,107,43,0.45)] [&_input]:placeholder:text-[#BFB5AC]
  [&_select]:w-full [&_select]:bg-[#FAF7F4] [&_select]:border [&_select]:border-[rgba(28,21,16,0.1)]
  [&_select]:rounded-lg [&_select]:px-3 [&_select]:py-2.5 [&_select]:text-[#1C1510] [&_select]:text-sm [&_select]:outline-none
  [&_textarea]:w-full [&_textarea]:bg-[#FAF7F4] [&_textarea]:border [&_textarea]:border-[rgba(28,21,16,0.1)]
  [&_textarea]:rounded-lg [&_textarea]:px-3 [&_textarea]:py-2.5 [&_textarea]:text-[#1C1510] [&_textarea]:text-sm
  [&_textarea]:outline-none [&_textarea]:resize-y [&_textarea:focus]:border-[rgba(255,107,43,0.45)]
  [&_textarea]:placeholder:text-[#BFB5AC]
`

function FieldWrap({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 600, color: '#8A7D72', marginBottom: '0.4rem', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</label>
      <div className={inputClass}>{children}</div>
    </div>
  )
}
