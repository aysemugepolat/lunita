import type { RewardBundle } from '@/game/types'

/** Bond points needed for levels 1..5. Bonds only ever grow. */
export const BOND_AT = [0, 3, 8, 15, 25]
export const BOND_MAX = BOND_AT.length

export function bondLevel(points: number): number {
  let lvl = 1
  for (let i = 0; i < BOND_AT.length; i++) if (points >= BOND_AT[i]) lvl = i + 1
  return lvl
}

export function bondProgress(points: number): { level: number; into: number; span: number; maxed: boolean } {
  const level = bondLevel(points)
  if (level >= BOND_MAX) return { level, into: 1, span: 1, maxed: true }
  const lo = BOND_AT[level - 1]
  const hi = BOND_AT[level]
  return { level, into: points - lo, span: hi - lo, maxed: false }
}

export const BOND_NAMES = ['Acquaintance', 'Friend', 'Close friend', 'Trusted ally', 'Kindred spirit']

/** Gifts waiting at each bond level (level 1 has none). Item gifts come from the character. */
export function giftReward(level: number): RewardBundle {
  switch (level) {
    case 2: return { xp: 10, stardust: 6, sunbeams: 0 }
    case 3: return { xp: 15, stardust: 0, sunbeams: 3 }
    case 4: return { xp: 20, stardust: 12, sunbeams: 0 }
    default: return { xp: 40, stardust: 10, sunbeams: 2 }
  }
}

export const giftKey = (charId: string, level: number) => `${charId}:${level}`
