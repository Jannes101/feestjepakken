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

export type LeeftijdCategorie = '21_29' | '30_39' | '40_49' | '50_59' | '60_plus'
export type Omvang = 'solo' | 'klein' | 'groep' | 'groot'
export type Geslacht = 'man' | 'vrouw' | 'anders'
export type Gender = 'man' | 'vrouw' | 'non_binair' | 'anders' | 'zeg_liever_niet'
export type DeelnameVoorkeur = 'iedereen' | 'alleen_mannen' | 'alleen_vrouwen' | 'alleen_non_binair'

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
  geslacht: Geslacht
  gender: Gender
  social_score: number | null
  aantal_beoordelingen: number
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
  provincie: string | null
  max_personen: number
  leeftijdscategorie: LeeftijdCategorie[]
  omvang: Omvang
  deelname_voorkeur: DeelnameVoorkeur
  actief: boolean
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

export interface Beoordeling {
  id: string
  beoordelaar_id: string
  beoordeelde_id: string
  uitje_id: string
  aanbevolen: boolean
  reden: string | null
  created_at: string
}

/** null = nog geen beoordelingen ontvangen; number = 5.0–10.0 */
export type SocialScore = number | null

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

export const LEEFTIJD_CATEGORIEEN: { value: LeeftijdCategorie; label: string }[] = [
  { value: '21_29', label: '21–29 jaar' },
  { value: '30_39', label: '30–39 jaar' },
  { value: '40_49', label: '40–49 jaar' },
  { value: '50_59', label: '50–59 jaar' },
  { value: '60_plus', label: '60+ jaar' },
]

export const OMVANG_OPTIES: { value: Omvang; label: string; beschrijving: string }[] = [
  { value: 'solo',  label: '1 op 1',      beschrijving: 'Jij + 1 maatje' },
  { value: 'klein', label: 'Klein groepje', beschrijving: '3–5 personen' },
  { value: 'groep', label: 'Groep',        beschrijving: '6–15 personen' },
  { value: 'groot', label: 'Grote groep',  beschrijving: '15+ personen' },
]

export const DEELNAME_OPTIES: { value: DeelnameVoorkeur; label: string }[] = [
  { value: 'iedereen',       label: 'Iedereen welkom' },
  { value: 'alleen_mannen',  label: 'Alleen mannen' },
  { value: 'alleen_vrouwen', label: 'Alleen vrouwen' },
  { value: 'alleen_non_binair', label: 'Alleen non-binair' },
]

export const NL_PROVINCIES = [
  'Drenthe', 'Flevoland', 'Friesland', 'Gelderland', 'Groningen',
  'Limburg', 'Noord-Brabant', 'Noord-Holland', 'Overijssel',
  'Utrecht', 'Zeeland', 'Zuid-Holland',
]

export function leeftijdNaarCategorie(leeftijd: number): LeeftijdCategorie {
  if (leeftijd < 30) return '21_29'
  if (leeftijd < 40) return '30_39'
  if (leeftijd < 50) return '40_49'
  if (leeftijd < 60) return '50_59'
  return '60_plus'
}
