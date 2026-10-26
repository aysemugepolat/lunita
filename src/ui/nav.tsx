import { createContext, useContext } from 'react'
import type { WorldId } from '@/game/types'

export type View = 'realm' | WorldId | 'quests' | 'library' | 'collection'

export interface NavApi {
  view: View
  go: (v: View) => void
  openLumi: (prefill?: string) => void
  openChapter: (id: string) => void
  openSettings: () => void
  /** Open a character's detail page. */
  openCharacter: (id: string) => void
  /** Open the travel companion picker. */
  openCompanions: () => void
}

export const NavContext = createContext<NavApi | null>(null)

export function useNav(): NavApi {
  const n = useContext(NavContext)
  if (!n) throw new Error('useNav outside provider')
  return n
}
