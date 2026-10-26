export type WorldId = 'forest' | 'forge' | 'island' | 'garden' | 'sanctuary'

export const WORLD_IDS: WorldId[] = ['forest', 'forge', 'island', 'garden', 'sanctuary']

export interface Step {
  id: string
  text: string
  minutes: number
  done: boolean
}

export interface Quest {
  id: string
  title: string
  world: WorldId
  steps: Step[]
  createdAt: number
  completedAt?: number
  origin: 'forged' | 'story'
}

export interface PlotState {
  kind: 'plant' | 'decor'
  item: string
  care: number
  bloomed: boolean
}

export interface Avatar {
  cloak: string
  trim: string
  hat: string
  aura: string
  charm: string
}

export interface Reflection {
  id: string
  at: number
  mood: string
  text: string
}

export interface FocusSession {
  startedAt: number
  durationMs: number
  pausedAt: number | null
  pausedTotal: number
  stepRef: { questId: string; stepId: string } | null
}

export interface Parked {
  id: string
  text: string
  at: number
}

export interface Settings {
  sound: boolean
  calm: boolean
  bigText: boolean
  /** Tiny vibration on rewards (phones that support it). */
  haptics: boolean
  /** Procedural ambient soundscape per world. */
  ambient: boolean
  /** Master volume, 0 to 1. */
  volume: number
}

export interface GameRecord {
  plays: number
  wins: number
  /** Ids of collected discoveries (whispers, songs, constellations, wishes, moon phases). */
  found: string[]
}

export interface Stats {
  steps: number
  quests: number
  focusMinutes: number
  focusSessions: number
  longestFocus: number
  miniWins: number
  breaths: number
  blooms: number
}

export interface Save {
  v: 1
  name: string
  createdAt: number
  lastSeen: number
  introDone: boolean
  xp: number
  stardust: number
  sunbeams: number
  crystals: Record<WorldId, number>
  quests: Quest[]
  chaptersRead: string[]
  achievements: Record<string, number>
  plots: (PlotState | null)[]
  avatar: Avatar
  owned: string[]
  reflections: Reflection[]
  focus: FocusSession | null
  parked: Parked[]
  stats: Stats
  settings: Settings
  returnedGently: boolean
  /** Character system: unlock timestamps, bond points (never decay), chosen companion, claimed gifts, gifted garden items. */
  charUnlocked: Record<string, number>
  charBond: Record<string, number>
  companion: string
  giftsClaimed: string[]
  inventory: string[]
  games: Record<string, GameRecord>
}

export interface RewardBundle {
  xp: number
  stardust: number
  sunbeams: number
  crystal?: WorldId
  crystalCount?: number
}

export interface Celebration {
  id: string
  title: string
  subtitle: string
  reward: RewardBundle
  worldShift?: string
  levelUp?: number
  newAchievements: string[]
  newChars?: string[]
  bondUps?: { id: string; level: number }[]
}
