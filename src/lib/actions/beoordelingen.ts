'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { Beoordeling, SocialScore } from '@/types'

export type BeoordelingResult =
  | { success: true }
  | { error: string }

export async function maakBeoordeling(
  uitjeId: string,
  beoordeeldeId: string,
  aanbevolen: boolean,
  reden?: string
): Promise<BeoordelingResult> {
  // Client-side validatie wordt hier server-side herhaald
  if (!aanbevolen) {
    if (!reden || reden.trim().length < 25) {
      return { error: 'Toelichting verplicht bij negatieve beoordeling (minimaal 25 tekens).' }
    }
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Niet ingelogd.' }
  if (user.id === beoordeeldeId) return { error: 'Je kunt jezelf niet beoordelen.' }

  const { error } = await supabase.from('beoordelingen').insert({
    beoordelaar_id: user.id,
    beoordeelde_id: beoordeeldeId,
    uitje_id: uitjeId,
    aanbevolen,
    reden: aanbevolen ? null : reden!.trim(),
  })

  if (error) {
    if (error.code === '23505') {
      return { error: 'Je hebt deze persoon al beoordeeld voor dit uitje.' }
    }
    return { error: error.message }
  }

  revalidatePath('/profiel')
  return { success: true }
}

export async function getBeoordeling(
  uitjeId: string,
  beoordeeldeId: string
): Promise<Pick<Beoordeling, 'id' | 'aanbevolen' | 'reden' | 'created_at'> | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data } = await supabase
    .from('beoordelingen')
    .select('id, aanbevolen, reden, created_at')
    .eq('uitje_id', uitjeId)
    .eq('beoordeelde_id', beoordeeldeId)
    .eq('beoordelaar_id', user.id)
    .single()

  return data ?? null
}

export async function getSocialScore(
  userId: string
): Promise<{ social_score: SocialScore; aantal_beoordelingen: number } | null> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('users')
    .select('social_score, aantal_beoordelingen')
    .eq('id', userId)
    .single()

  return data ?? null
}
