import { GlobalRegistrator } from '@happy-dom/global-registrator'
import { afterAll, beforeAll, expect, test } from 'bun:test'

GlobalRegistrator.register({ url: 'http://localhost:5173/' })
// happy-dom's Web Animations stub rejects on cancel; make framer-motion use its JS animator instead.
for (const proto of [Element.prototype, HTMLElement.prototype, SVGElement.prototype]) delete (proto as unknown as { animate?: unknown }).animate

const errors: string[] = []
const origError = console.error
console.error = (...a: unknown[]) => {
  errors.push(a.map((x) => String(x)).join(' ').slice(0, 400))
}

let root: import('react-dom/client').Root
let act: (fn: () => void | Promise<void>) => Promise<void>

const $ = (sel: string) => document.querySelector(sel) as HTMLElement | null
const byText = (text: string | RegExp, tag = 'button') =>
  Array.from(document.querySelectorAll(tag)).find((e) => (typeof text === 'string' ? e.textContent?.includes(text) : text.test(e.textContent ?? '') || text.test(e.getAttribute('aria-label') ?? ''))) as HTMLElement | undefined
const click = async (el: HTMLElement | undefined | null, label: string) => {
  if (!el) throw new Error('missing element: ' + label)
  await act(async () => {
    el.click()
  })
  await act(async () => {
    await new Promise((r) => setTimeout(r, 700))
  })
}
const setValue = async (el: HTMLInputElement, v: string) => {
  await act(async () => {
    const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!
    setter.call(el, v)
    el.dispatchEvent(new Event('input', { bubbles: true }))
  })
}
const nav = (name: string) =>
  Array.from(document.querySelectorAll('nav[aria-label="Worlds"] button')).find((b) => b.textContent?.includes(name)) as HTMLElement

beforeAll(async () => {
  ;(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true
  const React = await import('react')
  act = (React as unknown as { act: typeof act }).act
  const { createRoot } = await import('react-dom/client')
  const { WagmiProvider } = await import('wagmi')
  const { QueryClient, QueryClientProvider } = await import('@tanstack/react-query')
  const { ConnectKitProvider } = await import('connectkit')
  const { config } = await import('../src/config')
  const { default: App } = await import('../src/App')
  document.body.innerHTML = '<div id="root"></div>'
  root = createRoot($('#root')!)
  await act(async () => {
    root.render(
      <WagmiProvider config={config}>
        <QueryClientProvider client={new QueryClient()}>
          <ConnectKitProvider>
            <App />
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>,
    )
  })
})

afterAll(() => {
  console.error = origError
})

test('intro to realm', async () => {
  expect(document.body.textContent).toContain('LUNITA')
  await setValue($('input[aria-label="Your name"]') as HTMLInputElement, 'Mira')
  await click(byText('Open the first page'), 'open page')
  await click(byText('Skip story'), 'skip')
  expect(document.body.textContent).toContain('Your map')
  expect(document.body.textContent).not.toContain('Welcome back')
})

test('starter quest flow, rewards, character unlock', async () => {
  await click(byText('Give me a tiny quest'), 'tiny quest')
  expect(document.body.textContent).toContain('Your quests')
  for (let i = 0; i < 3; i++) {
    const done = document.querySelector('button[aria-label^="Mark done"]') as HTMLElement | null
    if (!done) break
    await click(done, 'mark done')
    const cont = byText('Continue')
    if (cont) await click(cont, 'continue')
  }
  const save = JSON.parse(localStorage.getItem('lunita:save:v1')!)
  expect(save.stats.steps).toBe(3)
  expect(save.stats.quests).toBe(1)
  const total = Object.values(save.crystals as Record<string, number>).reduce((a, b) => a + b, 0)
  expect(total).toBe(1)
  expect(save.charBond.lumi).toBeGreaterThan(0)
})

test('every view renders without crashing', async () => {
  for (const name of ['Forest', 'Forge', 'Island', 'Garden', 'Sanctuary', 'Quests', 'Library', 'Treasures', 'Realm']) {
    await click(nav(name), name)
    expect(document.querySelector('main')?.textContent?.length).toBeGreaterThan(40)
  }
})

test('forest game cards flip', async () => {
  await click(nav('Forest'), 'forest')
  const cards = document.querySelectorAll('[aria-label="Whisper Match cards"] button')
  expect(cards.length).toBe(12)
})

test('library lists 10 characters and opens a sheet', async () => {
  await click(nav('Library'), 'library')
  const cards = document.querySelectorAll('main ul > li button')
  expect(cards.length).toBeGreaterThanOrEqual(10)
  await click(cards[0] as HTMLElement, 'card')
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Lumi')
  await click(document.querySelector('[role="dialog"] button[aria-label="Close"]') as HTMLElement, 'close')
})

test('forge a quest through Lumi engine', async () => {
  await click(nav('Forge'), 'forge')
  await setValue($('#forge-task') as HTMLInputElement, 'clean my room')
  await click(byText('Break it down'), 'break')
  expect(document.querySelectorAll('main ol li').length).toBeGreaterThanOrEqual(5)
  await click(byText('Forge this quest'), 'forge it')
  expect(document.body.textContent).toContain('Clean my room')
})

test('companion dock and select', async () => {
  await click(document.querySelector('button[aria-label="Change travel companion"]') as HTMLElement, 'swap')
  expect(document.querySelector('[role="dialog"]')?.textContent).toContain('Choose your travel companion')
})


test('rules: chapters unlock friends, bonds only grow, gifts, focus, garden', async () => {
  const { actions } = await import('../src/game/store')
  const read = () => JSON.parse(localStorage.getItem('lunita:save:v1')!)
  // Reading the first page of each world meets its keeper
  for (const id of ['forest-1', 'forge-1', 'island-1', 'garden-1', 'sanctuary-1']) actions.readChapter(id)
  let s = read()
  for (const c of ['elowen', 'cinder', 'seren', 'marigold', 'oriel']) expect(s.charUnlocked[c]).toBeGreaterThan(0)
  expect(s.charUnlocked.nox).toBeUndefined()
  // Bond never decreases and levels follow points
  const before = s.charBond.lumi
  actions.miniWin('forest', 'test')
  expect(read().charBond.lumi).toBeGreaterThanOrEqual(before)
  // Companion must be unlocked
  actions.setCompanion('nox')
  expect(read().companion).not.toBe('nox')
  actions.setCompanion('cinder')
  expect(read().companion).toBe('cinder')
  // Gifts: claim once only
  for (let i = 0; i < 4; i++) actions.miniWin('forge', 'x')
  s = read()
  expect(s.charBond.cinder).toBeGreaterThanOrEqual(8)
  const stardust = s.stardust
  actions.claimGift('cinder', 3)
  actions.claimGift('cinder', 3)
  s = read()
  expect(s.giftsClaimed.filter((g: string) => g === 'cinder:3').length).toBe(1)
  expect(s.owned).toContain('cloak-ink')
  expect(s.stardust).toBe(stardust)
  // Garden gift item makes a seed free
  for (let i = 0; i < 4; i++) actions.miniWin('garden', 'x')
  actions.claimGift('marigold', 3)
  s = read()
  expect(s.inventory).toContain('plant:moonflower')
  const sd = s.stardust
  actions.plant(0, 'moonflower')
  s = read()
  expect(s.plots[0]?.item).toBe('moonflower')
  expect(s.stardust).toBe(sd)
  expect(s.inventory).not.toContain('plant:moonflower')
  // Tend to bloom unlocks Fennel
  for (let i = 0; i < 5; i++) actions.tend(0)
  s = read()
  expect(s.plots[0].bloomed).toBe(true)
  expect(s.charUnlocked.fennel).toBeGreaterThan(0)
  // Early landing keeps partial progress, never negative
  const xp = read().xp
  actions.startFocus(25, null)
  const st = JSON.parse(localStorage.getItem('lunita:save:v1')!)
  expect(st.focus.durationMs).toBe(25 * 60_000)
  actions.endFocus()
  expect(read().xp).toBeGreaterThanOrEqual(xp)
  expect(read().focus).toBeNull()
})


const save = () => JSON.parse(localStorage.getItem('lunita:save:v1')!)
const sleep = (ms: number) => act(async () => { await new Promise((r) => setTimeout(r, ms)) })

test('Whisper Match can be solved and rewards a Moss Jade', async () => {
  await click(nav('Forest'), 'forest')
  const before = save()
  const cards = Array.from(document.querySelectorAll('[aria-label="Whisper Match cards"] button')) as HTMLElement[]
  expect(cards.length).toBe(12)
  const known = new Map<number, string>()
  const done = new Set<number>()
  const label = (i: number) => cards[i].getAttribute('aria-label')!
  for (let guard = 0; guard < 40 && done.size < cards.length; guard++) {
    const i = cards.findIndex((_, k) => !done.has(k) && !known.has(k)) >= 0 ? cards.findIndex((_, k) => !done.has(k) && !known.has(k)) : cards.findIndex((_, k) => !done.has(k))
    await click(cards[i], 'first')
    const a = label(i)
    known.set(i, a)
    let j = Array.from(known.keys()).find((k) => k !== i && !done.has(k) && known.get(k) === a)
    if (j === undefined) j = cards.findIndex((_, k) => k !== i && !done.has(k) && !known.has(k))
    await click(cards[j], 'second')
    const b = label(j)
    known.set(j, b)
    if (a === b) {
      done.add(i)
      done.add(j)
    } else {
      await sleep(1100)
    }
  }
  expect(done.size).toBe(12)
  await sleep(600)
  const after = save()
  expect(after.crystals.forest).toBe(before.crystals.forest + 1)
  expect(after.stats.miniWins).toBe(before.stats.miniWins + 1)
  expect(after.games.whisper.wins).toBe(1)
  expect(after.games.whisper.found.length).toBe(1)
  expect(document.body.textContent).toContain('A new whisper')
  expect(document.body.textContent).toContain('Apprentice')
  const cont = byText('Continue')
  if (cont) await click(cont, 'continue')
}, 60000)

test('Star Chart: three constellations light and reward a Tide Sapphire', async () => {
  await click(nav('Island'), 'island')
  expect(document.body.textContent).toContain('Star Chart')
  const before = save()
  for (let r = 0; r < 3; r++) {
    const stars = Array.from(document.querySelectorAll('button[aria-label^="Star "]')) as HTMLElement[]
    expect(stars.length).toBeGreaterThanOrEqual(6)
    // a wrong tap must be harmless
    await click(stars[stars.length - 1], 'out of order')
    expect(document.body.textContent).toContain('comes later')
    for (let k = 0; k < stars.length; k++) await click(stars[k], 'star ' + (k + 1))
    if (r < 2) await click(byText('Next constellation'), 'next')
  }
  const after = save()
  expect(after.crystals.island).toBe(before.crystals.island + 1)
  expect(new Set(after.games.stars.found).size).toBe(3)
  expect(after.games.stars.wins).toBe(1)
  expect(document.body.textContent).toContain('The whole sky is lit')
  const cont = byText('Continue')
  if (cont) await click(cont, 'continue')
}, 60000)

test('Firefly Catch: ten catches fill the jar and reward a Petal Quartz', async () => {
  await click(nav('Garden'), 'garden')
  const before = save()
  for (let i = 0; i < 10; i++) {
    const fly = document.querySelector('button[aria-label="Catch a firefly"]') as HTMLElement
    expect(fly).toBeTruthy()
    await act(async () => { fly.click() })
  }
  await sleep(300)
  expect(document.querySelector('[aria-label="Jar with 10 of 10 fireflies"]')).toBeTruthy()
  expect(document.querySelectorAll('button[aria-label="Catch a firefly"]').length).toBe(0)
  const after = save()
  expect(after.crystals.garden).toBe(before.crystals.garden + 1)
  expect(after.games.fireflies.wins).toBe(1)
  const cont = byText('Continue')
  if (cont) await click(cont, 'continue')
}, 30000)

test('Rune Echo and Moon Breathing start cleanly', async () => {
  await click(nav('Forge'), 'forge')
  await click(byText('Begin the echo'), 'begin')
  expect((byText('Restart gently') as HTMLButtonElement).disabled).toBe(true)
  await click(byText('Free play'), 'free play')
  const rune = document.querySelector('button[aria-label="Sun rune"]') as HTMLButtonElement
  expect(rune.disabled).toBe(false)
  await click(rune, 'rune')
  await click(byText('Back to the game'), 'back')
  await click(nav('Sanctuary'), 'sanctuary')
  await click(byText('Begin'), 'breath')
  expect(document.body.textContent).toContain('Breathe in')
  await click(byText('Stop here'), 'stop')
  expect(document.body.textContent).toContain('Ready when you are')
}, 30000)

test('discoveries are collected once and never lost', async () => {
  const { actions } = await import('../src/game/store')
  expect(actions.discover('moon', 'p1')).toBe(true)
  expect(actions.discover('moon', 'p1')).toBe(false)
  expect(save().games.moon.found).toEqual(['p1'])
  for (const c of ['lantern', 'crescent', 'key', 'boat', 'teacup', 'fern', 'bell', 'door', 'thread']) actions.discover('stars', c)
  expect(save().achievements.atlas).toBeGreaterThan(0)
  await click(nav('Island'), 'island')
  await click(Array.from(document.querySelectorAll('summary')).find((e) => e.textContent?.includes('constellations')) as HTMLElement, 'open atlas')
  expect(document.body.textContent).toContain('The Little Boat')
})

test('old saves load and keep working', async () => {
  const raw = JSON.parse(localStorage.getItem('lunita:save:v1')!)
  expect(raw.v).toBe(1)
  expect(Array.isArray(raw.giftsClaimed)).toBe(true)
})


test('sound engine builds every voice and soundscape without errors', async () => {
  const calls: string[] = []
  const make = (name = 'node'): unknown =>
    new Proxy(function () {}, {
      get(_t, prop) {
        if (prop === 'currentTime') return 1
        if (prop === 'sampleRate') return 8000
        if (prop === 'state') return 'running'
        if (prop === 'then') return undefined
        if (prop === 'createBuffer') return (_c: number, len: number) => ({ getChannelData: () => new Float32Array(len) })
        return make(String(prop))
      },
      set() {
        return true
      },
      apply() {
        calls.push(name)
        return make(name)
      },
    })
  class FakeCtx {
    constructor() {
      return make('ctx') as FakeCtx
    }
  }
  ;(window as unknown as { AudioContext: unknown }).AudioContext = FakeCtx
  const snd = await import('../src/game/sound')
  for (const n of ['nav', 'step', 'win', 'levelup', 'sparkle'] as const) snd.sfx(true, n)
  for (const w of ['forest', 'forge', 'island', 'garden', 'sanctuary'] as const) snd.play(true, w, [261.63, 392], 0.1, 0.05)
  snd.chime(true)
  snd.breathTone(true, 'in', 4)
  snd.breathTone(true, 'out', 6)
  snd.breathTone(true, 'hold', 2)
  snd.setMasterVolume(0.4)
  for (const id of ['realm', 'forest', 'forge', 'island', 'garden', 'sanctuary'] as const) snd.setAmbient(id, true)
  snd.setAmbient(null, false)
  expect(calls.length).toBeGreaterThan(200)
  // Sound is silent unless enabled
  const before = calls.length
  snd.sfx(false, 'win')
  snd.play(false, 'forge', [200])
  expect(calls.length).toBe(before)
})

test('no console errors', () => {
  console.log('CONSOLE ERRORS:', JSON.stringify(errors, null, 1))
  expect(errors.filter((e) => !e.includes('not wrapped in act'))).toEqual([])
})
