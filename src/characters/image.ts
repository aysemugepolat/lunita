import { useEffect, useState } from 'react'
import type { Character } from './types'

const EXTENSIONS = ['png', 'webp', 'jpg', 'jpeg']

/** Resolved URL, or null when no art file exists for that base path. */
const cache = new Map<string, string | null>()
const inflight = new Map<string, Promise<string | null>>()

function tryLoad(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

export function resolveArt(base: string): Promise<string | null> {
  if (cache.has(base)) return Promise.resolve(cache.get(base) ?? null)
  const existing = inflight.get(base)
  if (existing) return existing
  const p = (async () => {
    for (const ext of EXTENSIONS) {
      const url = `${base}.${ext}`
      if (await tryLoad(url)) {
        cache.set(base, url)
        return url
      }
    }
    cache.set(base, null)
    return null
  })()
  inflight.set(base, p)
  return p
}

/** The character's uploaded artwork URL, `null` if none was found, `undefined` while checking. */
export function useCharacterArt(c: Pick<Character, 'image'> | undefined): string | null | undefined {
  const base = c?.image
  const [state, setState] = useState<{ base?: string; url: string | null | undefined }>({ base, url: base && cache.has(base) ? cache.get(base) : undefined })
  useEffect(() => {
    if (!base) return
    let live = true
    void resolveArt(base).then((url) => {
      if (live) setState({ base, url })
    })
    return () => {
      live = false
    }
  }, [base])
  if (!base) return null
  if (state.base !== base) return cache.has(base) ? cache.get(base) : undefined
  return state.url
}
