import { bondLevel } from './bond'
import { CHARACTERS } from './index'
import type { Character } from './types'
import type { Save } from '@/game/types'

export const arcChapterId = (charId: string, n: number) => `${charId}-arc-${n}`

export interface ArcStatus {
  n: number
  id: string
  title: string
  open: boolean
  read: boolean
  needsLevel: number
}

/** Story arc state: chapter 1 opens on meeting, chapters 2 and 3 open at bond levels 2 and 3. */
export function arcStatus(save: Save, c: Character): ArcStatus[] {
  const met = !!save.charUnlocked[c.id]
  const level = bondLevel(save.charBond[c.id] ?? 0)
  return c.arc.map((ch, i) => {
    const n = i + 1
    const id = arcChapterId(c.id, n)
    return { n, id, title: ch.title, open: met && level >= n, read: save.chaptersRead.includes(id), needsLevel: n }
  })
}

export function nextUnreadChapter(save: Save, c: Character): ArcStatus | undefined {
  return arcStatus(save, c).find((a) => a.open && !a.read)
}

/** Resolve a character chapter id such as "elowen-arc-2". */
export function findArcChapter(id: string): { character: Character; n: number; title: string; text: string[] } | undefined {
  for (const c of CHARACTERS) {
    for (let i = 0; i < c.arc.length; i++) {
      if (arcChapterId(c.id, i + 1) === id) return { character: c, n: i + 1, title: c.arc[i].title, text: c.arc[i].text }
    }
  }
  return undefined
}
