import type { ReactNode } from 'react'

export type GameId = 'whisper' | 'runes' | 'stars' | 'fireflies' | 'moon'

export interface Discovery {
  id: string
  name: string
  text: string
}

export interface GameInfo {
  id: GameId
  title: string
  /** What the player collects: "whispers", "songs"... */
  noun: string
  items: Discovery[]
}

export interface Constellation extends Discovery {
  closed?: boolean
  stars: [number, number][]
}

export const CONSTELLATIONS: Constellation[] = [
  { id: 'lantern', name: 'The Lantern', text: 'It hangs over the harbour so no one sails in the dark.', closed: true, stars: [[50, 12], [68, 26], [68, 60], [58, 76], [42, 76], [32, 60], [32, 26]] },
  { id: 'crescent', name: 'The Crescent', text: 'A sleeping moon, resting between two clouds.', stars: [[66, 12], [48, 20], [35, 36], [30, 54], [38, 72], [54, 84], [74, 82]] },
  { id: 'key', name: 'The Little Key', text: 'It opens whatever you are ready to begin.', stars: [[34, 26], [50, 14], [66, 26], [66, 42], [50, 52], [50, 88], [64, 88], [64, 74]] },
  { id: 'boat', name: 'The Little Boat', text: 'It sails the night sky at exactly your speed.', stars: [[14, 62], [32, 78], [68, 78], [86, 62], [50, 62], [50, 20], [74, 50]] },
  { id: 'teacup', name: 'The Teacup', text: 'Warm hands, slow sips, nowhere to be.', closed: true, stars: [[24, 36], [28, 64], [42, 78], [62, 78], [74, 64], [78, 36]] },
  { id: 'fern', name: 'The Fern', text: 'It unfurls one small leaf at a time.', stars: [[50, 88], [42, 72], [58, 60], [40, 48], [60, 36], [44, 24], [54, 10]] },
  { id: 'bell', name: 'The Bell', text: 'It rings when you arrive, not when you finish.', closed: true, stars: [[50, 10], [36, 28], [30, 56], [18, 72], [82, 72], [70, 56], [64, 28]] },
  { id: 'door', name: 'The Doorway', text: 'It is always open. You may step through when ready.', stars: [[30, 86], [30, 30], [40, 16], [60, 16], [70, 30], [70, 86]] },
  { id: 'thread', name: 'The Thread', text: 'It ties tomorrow gently to today.', stars: [[12, 70], [26, 40], [40, 64], [54, 36], [68, 60], [82, 30], [90, 50]] },
]

const WHISPERS: Discovery[] = [
  { id: 'w1', name: 'First whisper', text: 'You are allowed to begin badly.' },
  { id: 'w2', name: 'Second whisper', text: 'Rest counts as part of the work.' },
  { id: 'w3', name: 'Third whisper', text: 'A small thing done is a whole thing done.' },
  { id: 'w4', name: 'Fourth whisper', text: 'You do not have to feel ready.' },
  { id: 'w5', name: 'Fifth whisper', text: 'Kindness to yourself is also progress.' },
  { id: 'w6', name: 'Sixth whisper', text: 'Today can be gentle and still matter.' },
  { id: 'w7', name: 'Seventh whisper', text: 'Coming back is the bravest part.' },
  { id: 'w8', name: 'Eighth whisper', text: 'Slow is a speed, too.' },
  { id: 'w9', name: 'Ninth whisper', text: 'Your pace is the right pace.' },
  { id: 'w10', name: 'Tenth whisper', text: 'Not finishing is not failing.' },
  { id: 'w11', name: 'Eleventh whisper', text: 'You are doing better than you think.' },
  { id: 'w12', name: 'Twelfth whisper', text: 'The forest is glad you came.' },
]

const SONGS: Discovery[] = [
  { id: 's1', name: 'Song of Embers', text: 'Low and warm, like a banked fire.' },
  { id: 's2', name: 'The Anvil Waltz', text: 'Three steady strikes, then a breath.' },
  { id: 's3', name: 'Cinder\u2019s Lullaby', text: 'For tired hands at the end of a day.' },
  { id: 's4', name: 'Pip\u2019s Fanfare', text: 'Bright, bouncy and slightly out of tune.' },
  { id: 's5', name: 'The Quiet Hammer', text: 'Each note lands softly on purpose.' },
  { id: 's6', name: 'Rune Rain', text: 'Notes falling like sparks on stone.' },
  { id: 's7', name: 'The Open Door', text: 'A tune for anyone who feels stuck.' },
  { id: 's8', name: 'Forge Dawn', text: 'The first light through the chimney.' },
]

const WISHES: Discovery[] = [
  { id: 'f1', name: 'A slow morning', text: 'A wish for a slow, soft morning.' },
  { id: 'f2', name: 'A kind word', text: 'A wish that someone says one kind thing today.' },
  { id: 'f3', name: 'A clear desk', text: 'A wish for one small, clear corner.' },
  { id: 'f4', name: 'Good sleep', text: 'A wish for the deep, easy kind of sleep.' },
  { id: 'f5', name: 'A warm drink', text: 'A wish for something warm to hold.' },
  { id: 'f6', name: 'A quiet mind', text: 'A wish for ten minutes of quiet.' },
  { id: 'f7', name: 'A brave start', text: 'A wish for a first step that feels easy.' },
  { id: 'f8', name: 'A glad evening', text: 'A wish for a glad and gentle evening.' },
]

export const PHASES: (Discovery & { lit: number; waxing: boolean })[] = [
  { id: 'p1', name: 'New Moon', text: 'A fresh start, hidden and quiet.', lit: 0, waxing: true },
  { id: 'p2', name: 'Waxing Crescent', text: 'A thin smile growing.', lit: 0.25, waxing: true },
  { id: 'p3', name: 'First Quarter', text: 'Half way there, and that is plenty.', lit: 0.5, waxing: true },
  { id: 'p4', name: 'Waxing Gibbous', text: 'Almost full, and no hurry.', lit: 0.75, waxing: true },
  { id: 'p5', name: 'Full Moon', text: 'Everything you did is lit.', lit: 1, waxing: true },
  { id: 'p6', name: 'Waning Gibbous', text: 'Letting the light settle.', lit: 0.75, waxing: false },
  { id: 'p7', name: 'Last Quarter', text: 'Release what you do not need.', lit: 0.5, waxing: false },
  { id: 'p8', name: 'Waning Crescent', text: 'Rest before the next beginning.', lit: 0.25, waxing: false },
]

export const GAMES: Record<GameId, GameInfo> = {
  whisper: { id: 'whisper', title: 'Whisper Match', noun: 'whispers', items: WHISPERS },
  runes: { id: 'runes', title: 'Rune Echo', noun: 'songs', items: SONGS },
  stars: { id: 'stars', title: 'Star Chart', noun: 'constellations', items: CONSTELLATIONS },
  fireflies: { id: 'fireflies', title: 'Firefly Catch', noun: 'wishes', items: WISHES },
  moon: { id: 'moon', title: 'Moon Breathing', noun: 'moon phases', items: PHASES },
}

export const GAME_IDS = Object.keys(GAMES) as GameId[]

export const RANKS = [
  { at: 0, name: 'Newcomer' },
  { at: 1, name: 'Apprentice' },
  { at: 3, name: 'Adept' },
  { at: 6, name: 'Master' },
  { at: 10, name: 'Sage' },
]

export function rankFor(wins: number): { index: number; name: string; next?: { name: string; at: number } } {
  let index = 0
  RANKS.forEach((r, i) => {
    if (wins >= r.at) index = i
  })
  const nx = RANKS[index + 1]
  return { index, name: RANKS[index].name, next: nx ? { name: nx.name, at: nx.at } : undefined }
}

/** Small engraved picture for a collected item. */
export function DiscoveryArt({ game, id, size = 56 }: { game: GameId; id: string; size?: number }): ReactNode {
  if (game === 'stars') {
    const c = CONSTELLATIONS.find((x) => x.id === id)
    if (!c) return null
    const pts = c.stars.map(([x, y]) => `${x},${y}`).join(' ') + (c.closed ? ` ${c.stars[0][0]},${c.stars[0][1]}` : '')
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
        <rect width="100" height="100" rx="6" fill="#1a0a1a" />
        <polyline points={pts} fill="none" stroke="#e6c677" strokeWidth="2.5" strokeLinejoin="round" />
        {c.stars.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="4" fill="#fff3c4" />)}
      </svg>
    )
  }
  if (game === 'moon') {
    const p = PHASES.find((x) => x.id === id)
    return p ? <MoonPhase lit={p.lit} waxing={p.waxing} size={size} /> : null
  }
  return null
}

/** A moon phase: `lit` 0 (new) to 1 (full). Waxing is lit on the right. */
export function MoonPhase({ lit, waxing, size = 56 }: { lit: number; waxing: boolean; size?: number }) {
  const r = 40
  const rx = Math.abs(1 - 2 * lit) * r
  const outer = `A ${r} ${r} 0 0 1 50 ${50 + r}`
  const inner = lit < 0.5 ? `A ${rx} ${r} 0 0 0 50 ${50 - r}` : `A ${rx} ${r} 0 0 1 50 ${50 - r}`
  const d = lit <= 0 ? '' : `M 50 ${50 - r} ${outer} ${inner} Z`
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden>
      <circle cx="50" cy="50" r={r} fill="#2a1226" stroke="#e6c677" strokeWidth="2" />
      {d && <path d={d} fill="#f6e4a6" transform={waxing ? undefined : 'translate(100 0) scale(-1 1)'} />}
    </svg>
  )
}
