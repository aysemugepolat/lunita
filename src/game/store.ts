import { useSyncExternalStore } from 'react'
import { bondLevel, giftKey, giftReward } from '@/characters/bond'
import { CHARACTERS, getCharacter } from '@/characters'
import type { ReactionKind } from '@/characters/types'
import { ACHIEVEMENTS, COSMETICS, DECOR, DEFAULT_AVATAR, PLANTS, STAGE_NAMES, STORY_PROMPTS, WORLDS, stageFor } from './data'
import { haptic, NOTES, setMasterVolume, sfx } from './sound'
import { GAME_IDS, GAMES, type GameId } from '@/games/discoveries'
import { WORLD_IDS } from './types'
import type { Celebration, Quest, RewardBundle, Save, Step, WorldId } from './types'

const KEY = 'lunita:save:v1'
const DAY = 86_400_000

const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4)

function freshSave(): Save {
  const now = Date.now()
  return {
    v: 1,
    name: '',
    createdAt: now,
    lastSeen: now,
    introDone: false,
    xp: 0,
    stardust: 4,
    sunbeams: 2,
    crystals: { forest: 0, forge: 0, island: 0, garden: 0, sanctuary: 0 },
    quests: [],
    chaptersRead: [],
    achievements: {},
    plots: Array.from({ length: 12 }, () => null),
    avatar: { ...DEFAULT_AVATAR },
    owned: ['cloak-burgundy', 'trim-gold', 'hat-none', 'aura-none', 'charm-star'],
    reflections: [],
    focus: null,
    parked: [],
    stats: { steps: 0, quests: 0, focusMinutes: 0, focusSessions: 0, longestFocus: 0, miniWins: 0, breaths: 0, blooms: 0 },
    settings: { sound: false, calm: false, bigText: false, haptics: false, ambient: false, volume: 0.7 },
    returnedGently: false,
    charUnlocked: { lumi: now },
    charBond: {},
    companion: 'lumi',
    giftsClaimed: [],
    inventory: [],
    games: {},
  }
}

function load(): { save: Save; welcomeBack: boolean } {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Save>
      const base = freshSave()
      const save: Save = {
        ...base,
        ...parsed,
        crystals: { ...base.crystals, ...(parsed.crystals ?? {}) },
        stats: { ...base.stats, ...(parsed.stats ?? {}) },
        settings: { ...base.settings, ...(parsed.settings ?? {}) },
        avatar: { ...base.avatar, ...(parsed.avatar ?? {}) },
        plots: Array.from({ length: 12 }, (_, i) => parsed.plots?.[i] ?? null),
        charUnlocked: { ...base.charUnlocked, ...(parsed.charUnlocked ?? {}) },
        charBond: { ...(parsed.charBond ?? {}) },
        giftsClaimed: parsed.giftsClaimed ?? [],
        inventory: parsed.inventory ?? [],
        games: parsed.games ?? {},
        companion: parsed.companion ?? 'lumi',
      }
      evaluateCharacters(save)
      const away = Date.now() - save.lastSeen
      const welcomeBack = save.introDone && away > 2 * DAY
      if (welcomeBack && !save.achievements.return) save.achievements.return = Date.now()
      save.lastSeen = Date.now()
      return { save, welcomeBack }
    }
  } catch {
    /* corrupted save: start gently fresh */
  }
  return { save: freshSave(), welcomeBack: false }
}

export interface Reaction {
  id: number
  charId: string
  text: string
  kind: ReactionKind
}

interface Snapshot {
  save: Save
  celebrations: Celebration[]
  welcomeBack: boolean
  toastQueue: string[]
  reaction: Reaction | null
}

const initial = load()
let snap: Snapshot = { save: initial.save, celebrations: [], welcomeBack: initial.welcomeBack, toastQueue: [], reaction: null }
const listeners = new Set<() => void>()

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(snap.save))
  } catch {
    /* storage full or blocked: play on */
  }
}

function emit(next: Snapshot) {
  snap = next
  persist()
  listeners.forEach((l) => l())
}

export function useGame(): Snapshot {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => snap,
  )
}

/* ---------- derived helpers ---------- */

export function levelFor(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50)) + 1
}
export function levelProgress(xp: number): { level: number; into: number; span: number } {
  const level = levelFor(xp)
  const lo = 50 * (level - 1) ** 2
  const hi = 50 * level ** 2
  return { level, into: xp - lo, span: hi - lo }
}
export function totalCrystals(s: Save): number {
  return WORLD_IDS.reduce((n, w) => n + s.crystals[w], 0)
}
export function isUnlocked(s: Save, w: WorldId): boolean {
  return totalCrystals(s) >= WORLDS[w].unlockAt
}
export function plotCount(s: Save): number {
  return Math.min(12, 6 + (levelFor(s.xp) - 1))
}
export function focusElapsedMs(s: Save['focus'], now = Date.now()): number {
  if (!s) return 0
  return Math.max(0, (s.pausedAt ?? now) - s.startedAt - s.pausedTotal)
}

function evaluateAchievements(s: Save): string[] {
  const got: string[] = []
  const grant = (id: string, cond: boolean) => {
    if (cond && !s.achievements[id]) {
      s.achievements[id] = Date.now()
      got.push(id)
    }
  }
  const c = s.crystals
  grant('spark', s.stats.steps >= 1)
  grant('tiny3', s.stats.steps >= 3)
  grant('brave', s.stats.quests >= 1)
  grant('apprentice', s.stats.quests >= 5)
  grant('lantern', c.forest >= 3)
  grant('ember', c.forge >= 3)
  grant('tide', c.island >= 3)
  grant('bloomcrystal', c.garden >= 3)
  grant('opal', c.sanctuary >= 3)
  grant('collector', WORLD_IDS.every((w) => c[w] >= 1))
  grant('firstbloom', s.stats.blooms >= 1)
  grant('deepbreath', s.stats.breaths >= 1)
  grant('voyager', s.stats.focusSessions >= 1)
  grant('longtide', s.stats.longestFocus >= 25)
  grant('reader', s.chaptersRead.length >= 5)
  grant('realm', WORLD_IDS.every((w) => stageFor(c[w]) >= 2))
  grant('atlas', (s.games.stars?.found.length ?? 0) >= GAMES.stars.items.length)
  grant('allgames', GAME_IDS.every((g) => (s.games[g]?.wins ?? 0) >= 1))
  return got
}

/* ---------- characters ---------- */

export function isCharUnlocked(s: Save, id: string): boolean {
  return !!s.charUnlocked[id]
}
export function bondOf(s: Save, id: string): number {
  return s.charBond[id] ?? 0
}

/** Unlocks any character whose gentle condition is now met. Returns newly met ids. */
function evaluateCharacters(s: Save): string[] {
  const met: string[] = []
  for (const c of CHARACTERS) {
    if (s.charUnlocked[c.id]) continue
    const u = c.unlock
    const ok =
      u.kind === 'start' ||
      (u.kind === 'chapter' && s.chaptersRead.includes(u.id)) ||
      (u.kind === 'quests' && s.stats.quests >= u.n) ||
      (u.kind === 'focus' && s.stats.focusSessions >= u.n) ||
      (u.kind === 'blooms' && s.stats.blooms >= u.n) ||
      (u.kind === 'breaths' && s.stats.breaths >= u.n)
    if (ok) {
      s.charUnlocked[c.id] = Date.now()
      met.push(c.id)
    }
  }
  return met
}

interface BondGain {
  /** Residents of this world each gain `pts`. */
  world: WorldId | null
  pts: number
  /** The travel companion gains this many extra points. */
  companion: number
}

/** Bonds only ever grow. Returns the level-ups for characters the player has met. */
function addBond(s: Save, gain: BondGain): { id: string; level: number }[] {
  const ups: { id: string; level: number }[] = []
  const give = (id: string, p: number) => {
    if (p <= 0) return
    const before = bondLevel(s.charBond[id] ?? 0)
    s.charBond[id] = (s.charBond[id] ?? 0) + p
    const after = bondLevel(s.charBond[id])
    if (after > before && s.charUnlocked[id]) ups.push({ id, level: after })
  }
  if (gain.world) for (const c of CHARACTERS) if (c.home === gain.world) give(c.id, gain.pts)
  give(s.companion, gain.companion)
  return ups
}

let pendingReact: ReactionKind | null = null
const setReact = (k: ReactionKind) => {
  pendingReact = k
}
let reactSeq = 1

interface GrantOpts {
  title: string
  subtitle: string
  quiet?: boolean
  bond?: BondGain
}

/** Mutates `s`, returns a celebration (or null when nothing worth showing). */
function grantReward(s: Save, r: RewardBundle, opts: GrantOpts): Celebration | null {
  const lvlBefore = levelFor(s.xp)
  const stageBefore = r.crystal ? stageFor(s.crystals[r.crystal]) : 0
  s.xp += r.xp
  s.stardust += r.stardust
  s.sunbeams += r.sunbeams
  if (r.crystal) s.crystals[r.crystal] += r.crystalCount ?? 1
  const lvlAfter = levelFor(s.xp)
  const newA = evaluateAchievements(s)
  const bondUps = opts.bond ? addBond(s, opts.bond) : []
  const newChars = evaluateCharacters(s)
  let worldShift: string | undefined
  if (r.crystal) {
    const after = stageFor(s.crystals[r.crystal])
    if (after > stageBefore) {
      worldShift = `${WORLDS[r.crystal].name} grows ${STAGE_NAMES[after].toLowerCase()}.`
    }
  }
  const celebration: Celebration = {
    id: uid(),
    title: opts.title,
    subtitle: opts.subtitle,
    reward: r,
    worldShift,
    levelUp: lvlAfter > lvlBefore ? lvlAfter : undefined,
    newAchievements: newA,
    newChars,
    bondUps,
  }
  const worthy = !opts.quiet || celebration.levelUp || newA.length > 0 || worldShift || newChars.length > 0 || bondUps.length > 0
  return worthy ? celebration : null
}

function mutate(fn: (s: Save) => Celebration | null | void, notes: number[] = NOTES.step) {
  const next = structuredClone(snap.save)
  next.lastSeen = Date.now()
  pendingReact = null
  const cel = fn(next)
  const celebrations = cel ? [...snap.celebrations, cel] : snap.celebrations
  const kind = pendingReact as ReactionKind | null
  pendingReact = null
  emit({ ...snap, save: next, celebrations, reaction: kind ? makeReaction(next, kind) : snap.reaction })
  if (cel) sfx(next.settings.sound, cel.levelUp ? 'levelup' : 'win')
  else sfx(next.settings.sound, notes === NOTES.step ? 'step' : 'nav')
  haptic(next.settings.haptics, cel ? 30 : 10)
  applyDomSettings(next)
}

function makeReaction(s: Save, kind: ReactionKind): Reaction | null {
  const c = getCharacter(s.companion) ?? getCharacter('lumi')
  if (!c) return null
  const pool = kind === 'tap' ? c.talk : c.react[kind]
  const text = pool[Math.floor(Math.random() * pool.length)]
  return { id: reactSeq++, charId: c.id, text, kind }
}

export function applyDomSettings(s: Save) {
  document.documentElement.classList.toggle('calm', s.settings.calm)
  document.documentElement.classList.toggle('big-text', s.settings.bigText)
  setMasterVolume(s.settings.volume)
}

/* ---------- actions ---------- */

export const actions = {
  begin(name: string) {
    mutate((s) => {
      s.name = name.trim().slice(0, 24) || 'Traveller'
      s.introDone = true
      s.stardust += 2
    })
  },
  dismissCelebration() {
    emit({ ...snap, celebrations: snap.celebrations.slice(1) })
  },
  dismissWelcomeBack() {
    emit({ ...snap, welcomeBack: false })
  },

  forgeQuest(title: string, world: WorldId, steps: { text: string; minutes: number }[], origin: Quest['origin'] = 'forged'): string {
    const id = uid()
    mutate((s) => {
      const q: Quest = {
        id,
        title: title.trim().slice(0, 80) || 'A small quest',
        world,
        origin,
        createdAt: Date.now(),
        steps: steps.map((st) => ({ id: uid(), text: st.text, minutes: st.minutes, done: false })),
      }
      s.quests.unshift(q)
    }, NOTES.soft)
    return id
  },
  acceptStory(index: number): string | null {
    const p = STORY_PROMPTS[index]
    if (!p) return null
    return actions.forgeQuest(p.title, p.world, p.steps, 'story')
  },
  completeStep(questId: string, stepId: string) {
    mutate((s) => {
      const q = s.quests.find((x) => x.id === questId)
      const st = q?.steps.find((x) => x.id === stepId)
      if (!q || !st || st.done) return
      st.done = true
      s.stats.steps += 1
      const stepReward: RewardBundle = { xp: 10, stardust: 2, sunbeams: 1 }
      const allDone = q.steps.every((x) => x.done)
      if (allDone) {
        q.completedAt = Date.now()
        s.stats.quests += 1
        const total: RewardBundle = {
          xp: stepReward.xp + 30,
          stardust: stepReward.stardust + 10,
          sunbeams: stepReward.sunbeams + 1,
          crystal: q.world,
          crystalCount: 1,
        }
        setReact('quest')
        return grantReward(s, total, { title: 'Quest complete', subtitle: q.title, bond: { world: q.world, pts: 3, companion: 1 } })
      }
      setReact('step')
      return grantReward(s, stepReward, { title: 'Step done', subtitle: st.text, quiet: true, bond: { world: null, pts: 0, companion: 1 } })
    })
  },
  shrinkStep(questId: string, stepId: string, parts: { text: string; minutes: number }[]) {
    mutate((s) => {
      const q = s.quests.find((x) => x.id === questId)
      if (!q) return
      const idx = q.steps.findIndex((x) => x.id === stepId)
      if (idx < 0 || q.steps[idx].done) return
      const repl: Step[] = parts.map((p) => ({ id: uid(), text: p.text, minutes: p.minutes, done: false }))
      q.steps.splice(idx, 1, ...repl)
    }, NOTES.soft)
  },
  removeQuest(questId: string) {
    mutate((s) => {
      s.quests = s.quests.filter((q) => q.id !== questId)
    }, NOTES.soft)
  },
  addStep(questId: string, text: string) {
    const clean = text.trim().slice(0, 120)
    if (!clean) return
    mutate((s) => {
      const q = s.quests.find((x) => x.id === questId)
      if (q && !q.completedAt) q.steps.push({ id: uid(), text: clean, minutes: 5, done: false })
    }, NOTES.soft)
  },

  miniWin(world: WorldId, label: string, gameId?: GameId) {
    mutate((s) => {
      s.stats.miniWins += 1
      if (gameId) {
        const rec = (s.games[gameId] ??= { plays: 0, wins: 0, found: [] })
        rec.plays += 1
        rec.wins += 1
      }
      setReact('joy')
      return grantReward(s, { xp: 15, stardust: 5, sunbeams: 1, crystal: world, crystalCount: 1 }, { title: label, subtitle: 'A moment of play, beautifully done.', bond: { world, pts: 2, companion: 1 } })
    })
  },
  /** Record a collectible found while playing. Quiet: the game shows it inline. */
  discover(gameId: GameId, itemId: string): boolean {
    let isNew = false
    mutate((s) => {
      const rec = (s.games[gameId] ??= { plays: 0, wins: 0, found: [] })
      if (rec.found.includes(itemId)) return
      rec.found.push(itemId)
      isNew = true
      const item = GAMES[gameId].items.find((i) => i.id === itemId)
      return grantReward(s, { xp: 4, stardust: 1, sunbeams: 0 }, { title: 'A discovery', subtitle: item?.name ?? '', quiet: true })
    }, NOTES.step)
    return isNew
  },
  breathDone(rounds: number) {
    mutate((s) => {
      s.stats.breaths += 1
      const moon = (s.games.moon ??= { plays: 0, wins: 0, found: [] })
      moon.plays += 1
      moon.wins += 1
      setReact('rest')
      return grantReward(s, { xp: 10 + rounds * 2, stardust: 4, sunbeams: 1, crystal: 'sanctuary', crystalCount: 1 }, { title: 'Breath ritual', subtitle: `${rounds} slow breaths with the moon.`, bond: { world: 'sanctuary', pts: 2, companion: 1 } })
    })
  },

  startFocus(minutes: number, stepRef: { questId: string; stepId: string } | null) {
    mutate((s) => {
      s.focus = { startedAt: Date.now(), durationMs: minutes * 60_000, pausedAt: null, pausedTotal: 0, stepRef }
    }, NOTES.soft)
  },
  pauseFocus() {
    mutate((s) => {
      if (s.focus && s.focus.pausedAt === null) s.focus.pausedAt = Date.now()
    }, NOTES.soft)
  },
  resumeFocus() {
    mutate((s) => {
      if (s.focus && s.focus.pausedAt !== null) {
        s.focus.pausedTotal += Date.now() - s.focus.pausedAt
        s.focus.pausedAt = null
      }
    }, NOTES.soft)
  },
  /** Ends a voyage. Early landings still count in proportion. Nothing is ever lost. */
  endFocus(): { minutes: number; full: boolean } {
    let result = { minutes: 0, full: false }
    mutate((s) => {
      const f = s.focus
      if (!f) return
      const elapsed = Math.min(focusElapsedMs(f), f.durationMs)
      const full = elapsed >= f.durationMs - 500
      const minutes = Math.floor(elapsed / 60_000)
      const planned = Math.round(f.durationMs / 60_000)
      s.focus = null
      result = { minutes, full }
      if (elapsed < 30_000) return null
      const exact = elapsed / 60_000
      const crystalCount = full ? (planned >= 25 ? 3 : planned >= 15 ? 2 : planned >= 5 ? 1 : 0) : Math.floor(minutes / 5)
      s.stats.focusSessions += 1
      setReact('focus')
      s.stats.focusMinutes += minutes
      s.stats.longestFocus = Math.max(s.stats.longestFocus, full ? planned : minutes)
      return grantReward(
        s,
        { xp: Math.max(2, Math.round(exact * 2)), stardust: Math.max(1, Math.round(exact)), sunbeams: Math.max(1, Math.round(exact / 5)), crystal: crystalCount > 0 ? 'island' : undefined, crystalCount },
        { title: full ? 'Landfall' : 'You landed gently', subtitle: full ? `${planned} calm minutes on Focus Island.` : `${minutes || 'A few'} minute${minutes === 1 ? '' : 's'} counted. That is real progress.`, bond: { world: 'island', pts: full ? 3 : 1, companion: 1 } },
      )
    })
    return result
  },
  parkThought(text: string) {
    const clean = text.trim().slice(0, 140)
    if (!clean) return
    mutate((s) => {
      s.parked.unshift({ id: uid(), text: clean, at: Date.now() })
      s.parked = s.parked.slice(0, 30)
    }, NOTES.soft)
  },
  clearParked(id: string) {
    mutate((s) => {
      s.parked = s.parked.filter((p) => p.id !== id)
    }, NOTES.soft)
  },

  plant(slot: number, plantId: string) {
    const def = PLANTS.find((p) => p.id === plantId)
    if (!def) return
    mutate((s) => {
      const gift = s.inventory.indexOf(`plant:${plantId}`)
      if (s.plots[slot] || (gift < 0 && s.stardust < def.cost) || slot >= plotCount(s)) return
      if (gift >= 0) s.inventory.splice(gift, 1)
      else s.stardust -= def.cost
      s.plots[slot] = { kind: 'plant', item: plantId, care: 0, bloomed: false }
      const got = evaluateAchievements(s)
      if (!s.achievements.gardener) {
        s.achievements.gardener = Date.now()
        got.push('gardener')
      }
      return got.length
        ? { id: uid(), title: 'Seed Sower', subtitle: 'Your first seed is in the soil.', reward: { xp: 0, stardust: 0, sunbeams: 0 }, newAchievements: got }
        : null
    }, NOTES.soft)
  },
  placeDecor(slot: number, decorId: string) {
    const def = DECOR.find((d) => d.id === decorId)
    if (!def) return
    mutate((s) => {
      const gift = s.inventory.indexOf(`decor:${decorId}`)
      if (s.plots[slot] || (gift < 0 && s.stardust < def.cost) || slot >= plotCount(s)) return
      if (gift >= 0) s.inventory.splice(gift, 1)
      else s.stardust -= def.cost
      s.plots[slot] = { kind: 'decor', item: decorId, care: 0, bloomed: true }
    })
  },
  clearPlot(slot: number) {
    mutate((s) => {
      s.plots[slot] = null
    }, NOTES.soft)
  },
  tend(slot: number) {
    mutate((s) => {
      const p = s.plots[slot]
      const def = p && PLANTS.find((x) => x.id === p.item)
      if (!p || !def || p.kind !== 'plant' || p.bloomed || s.sunbeams < 1) return
      s.sunbeams -= 1
      p.care += 1
      if (p.care >= def.need) {
        p.bloomed = true
        s.stats.blooms += 1
        setReact('joy')
        return grantReward(s, { xp: 20, stardust: 5, sunbeams: 0, crystal: 'garden', crystalCount: 1 }, { title: `${def.name} blooms`, subtitle: 'Your care became something beautiful.', bond: { world: 'garden', pts: 2, companion: 1 } })
      }
    })
  },

  buyCosmetic(id: string) {
    const c = COSMETICS.find((x) => x.id === id)
    if (!c) return
    mutate((s) => {
      if (s.owned.includes(id) || s.stardust < c.cost || levelFor(s.xp) < c.level) return
      s.stardust -= c.cost
      s.owned.push(id)
    })
  },
  equip(id: string) {
    const c = COSMETICS.find((x) => x.id === id)
    if (!c) return
    mutate((s) => {
      if (!s.owned.includes(id)) return
      s.avatar[c.slot] = c.value
      if (!s.achievements.dresser && id !== 'cloak-burgundy' && id !== 'trim-gold') {
        s.achievements.dresser = Date.now()
        return { id: uid(), title: 'Moon Dresser', subtitle: 'A new look for the realm\u2019s traveller.', reward: { xp: 0, stardust: 0, sunbeams: 0 }, newAchievements: ['dresser'] }
      }
    }, NOTES.soft)
  },
  reflect(mood: string, text: string) {
    const clean = text.trim().slice(0, 280)
    if (!clean) return
    mutate((s) => {
      s.reflections.unshift({ id: uid(), at: Date.now(), mood, text: clean })
      s.reflections = s.reflections.slice(0, 40)
      setReact('rest')
      const first = !s.achievements.reflect
      if (first) s.achievements.reflect = Date.now()
      return grantReward(s, { xp: 12, stardust: 3, sunbeams: 1, crystal: 'sanctuary', crystalCount: first ? 1 : 0 }, { title: 'A quiet page', subtitle: 'Your words are kept safe.', quiet: !first, bond: { world: 'sanctuary', pts: 1, companion: 1 } })
    })
  },
  readChapter(id: string) {
    mutate((s) => {
      if (s.chaptersRead.includes(id)) return
      s.chaptersRead.push(id)
      return grantReward(s, { xp: 8, stardust: 2, sunbeams: 0 }, { title: 'Chapter read', subtitle: 'The story turns a page.', quiet: true })
    }, NOTES.soft)
  },
  setCompanion(id: string) {
    mutate((s) => {
      if (!s.charUnlocked[id]) return
      s.companion = id
      setReact('tap')
    }, NOTES.soft)
  },
  tapCompanion() {
    mutate(() => {
      setReact('tap')
    }, NOTES.soft)
  },
  clearReaction(id: number) {
    if (snap.reaction?.id === id) emit({ ...snap, reaction: null })
  },
  claimGift(charId: string, level: number) {
    const c = getCharacter(charId)
    if (!c) return
    mutate((s) => {
      const key = giftKey(charId, level)
      if (!s.charUnlocked[charId] || level < 2 || level > bondLevel(s.charBond[charId] ?? 0) || s.giftsClaimed.includes(key)) return
      s.giftsClaimed.push(key)
      let item = ''
      const raw = level === 3 || level === 5 ? c.giftItems?.[level] : undefined
      if (raw) {
        const [kind, id] = raw.split(':')
        if (kind === 'cosmetic') {
          if (!s.owned.includes(id)) s.owned.push(id)
          item = COSMETICS.find((x) => x.id === id)?.name ?? ''
        } else {
          s.inventory.push(raw)
          item = (kind === 'plant' ? PLANTS.find((x) => x.id === id)?.name : DECOR.find((x) => x.id === id)?.name) ?? ''
        }
      }
      setReact('joy')
      return grantReward(s, giftReward(level), { title: `A gift from ${c.name}`, subtitle: item ? `${item}, ${giftBlurb(raw)}.` : 'Given with warmth.' })
    })
  },
  setSetting<K extends keyof Save['settings']>(key: K, value: Save['settings'][K]) {
    mutate((s) => {
      s.settings[key] = value
    }, NOTES.soft)
  },
  reset() {
    const fresh = freshSave()
    emit({ save: fresh, celebrations: [], welcomeBack: false, toastQueue: [], reaction: null })
    applyDomSettings(fresh)
  },
}

export { ACHIEVEMENTS }
applyDomSettings(initial.save)

function giftBlurb(raw: string | undefined): string {
  if (!raw) return ''
  const k = raw.split(':')[0]
  return k === 'plant' ? 'a seed for your garden' : k === 'decor' ? 'a garden decoration' : 'added to your wardrobe'
}
