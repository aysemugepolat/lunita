import { useSyncExternalStore } from 'react'

/** Wins this visit (not saved). Used only to offer a kind break reminder, never to limit play. */
let wins = 0
const listeners = new Set<() => void>()

export function recordWin() {
  wins += 1
  listeners.forEach((l) => l())
}

export function useSessionWins(): number {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => wins,
  )
}

export const rnd = (min: number, max: number) => min + Math.random() * (max - min)
export const rndInt = (n: number) => Math.floor(Math.random() * n)
export function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5)
}
