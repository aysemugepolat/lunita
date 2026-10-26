import type { WorldId } from '@/game/types'

export type Role = 'guide' | 'questgiver' | 'mentor' | 'guardian' | 'keeper' | 'storyteller' | 'ally'

export type ReactionKind = 'step' | 'quest' | 'focus' | 'joy' | 'rest' | 'tap'

/** How a character is met. Always gentle: reading, finishing a quest, or one calm act. Never grinding or streaks. */
export type Unlock =
  | { kind: 'start' }
  | { kind: 'chapter'; id: string }
  | { kind: 'quests'; n: number }
  | { kind: 'focus'; n: number }
  | { kind: 'blooms'; n: number }
  | { kind: 'breaths'; n: number }

export interface ArcChapter {
  title: string
  text: string[]
}

export interface Character {
  id: string
  name: string
  title: string
  home: WorldId
  role: Role
  /** One short sentence describing the gentle gameplay role. */
  roleBlurb: string
  backstory: string
  personality: string[]
  quote: string
  unlock: Unlock
  /** Shown while locked. */
  hint: string
  /**
   * Image path WITHOUT extension, served from /public. The app tries .png, .webp, .jpg and .jpeg.
   * Example: '/characters/lumi' loads public/characters/lumi.png
   */
  image: string
  /** CSS object-position for portrait crops, e.g. 'center 20%'. */
  crop?: string
  /** Glow and accent colour for this character. */
  accent: string
  /** NPC dialogue. Max 2 short sentences each. */
  talk: string[]
  /** Companion reactions to what the player just did. */
  react: Record<Exclude<ReactionKind, 'tap'>, string[]>
  /** Focus Island host lines: leaving, steady, nearly there, landed. */
  voyage?: [string, string, string, string]
  /** Three short story chapters. Chapter 1 opens on meeting; chapters 2 and 3 open at bond levels 2 and 3. */
  arc: [ArcChapter, ArcChapter, ArcChapter]
  /** Items gifted at a bond level. Prefixes: plant:, decor:, cosmetic:. */
  giftItems?: Partial<Record<3 | 5, string>>
}
