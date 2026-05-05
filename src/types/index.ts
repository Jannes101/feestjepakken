// ============================================================
// feestjepakken — centrale TypeScript types
// ============================================================

export type UitjeType =
  | 'techno'
  | 'concert'
  | 'theater'
  | 'film'
  | 'festival'
  | 'sport'
  | 'museum'
  | 'bar'
  | 'opera'
  | 'comedy'
  | 'expo'
  | 'overig'

export type Situatie =
  | 'single'
  | 'relatie'
  | 'getrouwd'
  | 'liever_niet_zeggen'

export type ReisAfstand =
  | 'eigen_stad'
  | '25km'
  | '50km'
  | 'heel_nl'

// ── Database row types ────────────────────────────────────────

export interface UserProfile {
  id: string
  email: string
  naam: string
  leeftijd: number
  woonplaats: string
  bio: string | null
  situatie: Situatie
  reis_afstand: ReisAfstand
  uitje_types: UitjeType[]
  credits: number
  gratis_reactie_gebruikt: boolean
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface Uitje {
  id: string
  user_id: string
  titel: string
  beschrijving: string
  type: UitjeType
  datum: string | null
  locatie: string
  max_personen: number
  created_at: string
  // joined
  user?: Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'avatar_url'>
  reactie_count?: number
  gem_rating?: number
}

export interface Reactie {
  id: string
  uitje_id: string
  van_user_id: string
  bericht: string
  status: 'pending' | 'geaccepteerd' | 'afgewezen'
  created_at: string
  // joined
  van_user?: Pick<UserProfile, 'id' | 'naam' | 'leeftijd' | 'woonplaats' | 'avatar_url'>
}

export interface Rating {
  id: string
  beoordelaar_id: string
  beoordeelde_id: string
  uitje_id: string
  sterren: 1 | 2 | 3 | 4 | 5
  opmerking: string | null
  created_at: string
}

export interface Transactie {
  id: string
  user_id: string
  bedrag: number
  type: 'aankoop_credits' | 'gebruik_credit'
  credits_delta: number
  mollie_id: string | null
  created_at: string
}

// ── UI helper types ───────────────────────────────────────────

export interface UitjeTypeConfig {
  value: UitjeType
  label: string
  emoji: string
}

export const UITJE_TYPES: UitjeTypeConfig[] = [
  { value: 'techno',   label: 'Techno / Club', emoji: '🎧' },
  { value: 'concert',  label: 'Concert',        emoji: '🎸' },
  { value: 'theater',  label: 'Theater',        emoji: '🎭' },
  { value: 'film',     label: 'Film',           emoji: '🎬' },
  { value: 'festival', label: 'Festival',       emoji: '⛺' },
  { value: 'sport',    label: 'Sport',          emoji: '🏟️' },
  { value: 'museum',   label: 'Museum & expo',  emoji: '🖼️' },
  { value: 'bar',      label: 'Bar & etentje',  emoji: '🍷' },
  { value: 'opera',    label: 'Opera',          emoji: '🎶' },
  { value: 'comedy',   label: 'Comedy',         emoji: '🎤' },
  { value: 'expo',     label: 'Expo',           emoji: '🏛️' },
  { value: 'overig',   label: 'Overig',         emoji: '✨' },
]

export const CREDIT_PRIJS_EURO = 2
