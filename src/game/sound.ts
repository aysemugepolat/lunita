import type { WorldId } from './types'

/*
 * LUNITA sound engine. Everything is synthesised with the Web Audio API (no audio files).
 * Each world has its own instrument, there is a shared hall reverb, and an optional ambient
 * soundscape per world. Everything is silent unless the player turns sound on.
 */

let ctx: AudioContext | null = null
let master: GainNode | null = null
let reverbIn: GainNode | null = null
let volume = 0.7
let noise: AudioBuffer | null = null

type Win = Window & { webkitAudioContext?: typeof AudioContext }

function impulse(c: AudioContext, seconds = 2.6, decay = 3.2): AudioBuffer {
  const len = Math.floor(c.sampleRate * seconds)
  const buf = c.createBuffer(2, len, c.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch)
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay)
  }
  return buf
}

function whiteNoise(c: AudioContext): AudioBuffer {
  if (noise) return noise
  const len = c.sampleRate * 2
  noise = c.createBuffer(1, len, c.sampleRate)
  const d = noise.getChannelData(0)
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
  return noise
}

function ensure(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as Win).webkitAudioContext
    if (!Ctor) return null
    ctx = new Ctor()
    const comp = ctx.createDynamicsCompressor()
    comp.threshold.value = -20
    comp.ratio.value = 4
    master = ctx.createGain()
    master.gain.value = volume
    master.connect(comp)
    comp.connect(ctx.destination)
    const conv = ctx.createConvolver()
    conv.buffer = impulse(ctx)
    const wet = ctx.createGain()
    wet.gain.value = 0.34
    conv.connect(wet)
    wet.connect(master)
    reverbIn = ctx.createGain()
    reverbIn.connect(conv)
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

export function setMasterVolume(v: number) {
  volume = Math.min(1, Math.max(0, v))
  if (master && ctx) master.gain.setTargetAtTime(volume, ctx.currentTime, 0.05)
}

/** Route a node to the master bus (dry) and the shared reverb (wet send). */
function route(c: AudioContext, node: AudioNode, send = 0.3) {
  if (!master || !reverbIn) return
  node.connect(master)
  if (send > 0) {
    const s = c.createGain()
    s.gain.value = send
    node.connect(s)
    s.connect(reverbIn)
  }
}

function env(g: GainParam, t: number, peak: number, attack: number, end: number) {
  g.setValueAtTime(0.0001, t)
  g.exponentialRampToValueAtTime(Math.max(0.0002, peak), t + attack)
  g.exponentialRampToValueAtTime(0.0001, t + end)
}
type GainParam = AudioParam

/* ---------- instruments ---------- */

const BELL_PARTIALS: [number, number, number][] = [[1, 1, 1], [2.76, 0.45, 0.6], [5.4, 0.2, 0.35], [8.93, 0.08, 0.2]]

function bell(c: AudioContext, f: number, t: number, vol = 0.05, dur = 1.6, send = 0.5) {
  const bus = c.createGain()
  route(c, bus, send)
  for (const [ratio, amp, dec] of BELL_PARTIALS) {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = f * ratio
    env(g.gain, t, amp * vol, 0.008, dur * dec)
    o.connect(g)
    g.connect(bus)
    o.start(t)
    o.stop(t + dur * dec + 0.05)
  }
}

function pluck(c: AudioContext, f: number, t: number, vol = 0.06, dur = 0.9, send = 0.35, wood = false) {
  const o = c.createOscillator()
  const o2 = c.createOscillator()
  const lp = c.createBiquadFilter()
  const g = c.createGain()
  o.type = wood ? 'triangle' : 'sine'
  o2.type = 'triangle'
  o.frequency.value = f
  o2.frequency.value = f * 2
  lp.type = 'lowpass'
  lp.frequency.setValueAtTime(f * 6, t)
  lp.frequency.exponentialRampToValueAtTime(f * 1.4, t + dur * 0.7)
  env(g.gain, t, vol, 0.003, dur)
  o.connect(lp)
  o2.connect(lp)
  lp.connect(g)
  route(c, g, send)
  o.start(t)
  o2.start(t)
  o.stop(t + dur + 0.05)
  o2.stop(t + dur + 0.05)
}

/** Metallic anvil strike: frequency-modulated, inharmonic. */
function anvil(c: AudioContext, f: number, t: number, vol = 0.06, dur = 1.2, send = 0.35) {
  const car = c.createOscillator()
  const mod = c.createOscillator()
  const modGain = c.createGain()
  const g = c.createGain()
  car.type = 'sine'
  mod.type = 'sine'
  car.frequency.value = f
  mod.frequency.value = f * 3.5
  modGain.gain.setValueAtTime(f * 2.6, t)
  modGain.gain.exponentialRampToValueAtTime(f * 0.05, t + dur * 0.5)
  mod.connect(modGain)
  modGain.connect(car.frequency)
  env(g.gain, t, vol, 0.004, dur)
  car.connect(g)
  route(c, g, send)
  car.start(t)
  mod.start(t)
  car.stop(t + dur + 0.05)
  mod.stop(t + dur + 0.05)
}

/** Singing bowl: slow attack, beating partials, long tail. */
function bowl(c: AudioContext, f: number, t: number, vol = 0.05, dur = 3.2, send = 0.7) {
  const bus = c.createGain()
  route(c, bus, send)
  for (const [ratio, amp] of [[1, 1], [1.004, 0.8], [2.71, 0.25], [4.1, 0.1]] as const) {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = 'sine'
    o.frequency.value = f * ratio
    env(g.gain, t, amp * vol, 0.06, dur)
    o.connect(g)
    g.connect(bus)
    o.start(t)
    o.stop(t + dur + 0.05)
  }
}

function voice(c: AudioContext, world: WorldId, f: number, t: number, vol: number) {
  switch (world) {
    case 'forest': return pluck(c, f, t, vol * 1.3, 0.7, 0.3, true)
    case 'forge': return anvil(c, f, t, vol, 1.1)
    case 'island': return bell(c, f * 2, t, vol * 0.9, 2.4, 0.8)
    case 'garden': return pluck(c, f * 2, t, vol * 1.2, 1.4, 0.5, false)
    default: return bowl(c, f, t, vol * 0.8, 2.6)
  }
}

/* ---------- public sound effects ---------- */

/** Bell-like notes in sequence. */
export function chime(enabled: boolean, freqs: number[] = [523.25, 659.25, 783.99], gap = 0.11, vol = 0.05) {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  freqs.forEach((f, i) => bell(c, f, c.currentTime + i * gap, vol))
}

/** Notes played in a world's own instrument: forest marimba, forge anvil, island glass, garden harp, sanctuary bowl. */
export function play(enabled: boolean, world: WorldId, freqs: number[], gap = 0.1, vol = 0.06) {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  freqs.forEach((f, i) => voice(c, world, f, c.currentTime + i * gap, vol))
}

export type Sfx = 'nav' | 'step' | 'win' | 'levelup' | 'sparkle'

const PENTA = [523.25, 587.33, 659.25, 783.99, 880, 1046.5, 1174.66, 1318.51]

export function sfx(enabled: boolean, name: Sfx) {
  if (!enabled) return
  const c = ensure()
  if (!c) return
  const t = c.currentTime
  switch (name) {
    case 'nav':
      pluck(c, 392, t, 0.03, 0.18, 0.1, true)
      break
    case 'step':
      bell(c, 659.25, t, 0.05, 1.2)
      bell(c, 987.77, t + 0.09, 0.045, 1.4)
      break
    case 'win':
      ;[0, 2, 3, 5, 7].forEach((n, i) => bell(c, PENTA[n], t + i * 0.09, 0.05, 1.8))
      pluck(c, 261.63, t, 0.05, 1.4, 0.5)
      break
    case 'levelup':
      ;[0, 2, 3, 4, 5, 7].forEach((n, i) => bell(c, PENTA[n], t + i * 0.1, 0.055, 2.2, 0.7))
      bowl(c, 130.81, t, 0.05, 3.4)
      bowl(c, 196, t + 0.1, 0.04, 3.4)
      break
    case 'sparkle':
      for (let i = 0; i < 4; i++) bell(c, PENTA[4 + Math.floor(Math.random() * 4)], t + i * 0.06, 0.03, 1.1, 0.7)
      break
  }
}

/** A gliding breath tone: rises for inhale, falls for exhale, still on holds. */
export function breathTone(enabled: boolean, kind: 'in' | 'out' | 'hold', secs: number) {
  if (!enabled || kind === 'hold') return
  const c = ensure()
  if (!c) return
  const t = c.currentTime
  const lo = 174.61
  const hi = 261.63
  const [from, to] = kind === 'in' ? [lo, hi] : [hi, lo]
  const g = c.createGain()
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 900
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(0.045, t + Math.min(0.8, secs * 0.25))
  g.gain.setValueAtTime(0.045, t + secs - 0.6)
  g.gain.exponentialRampToValueAtTime(0.0001, t + secs)
  lp.connect(g)
  route(c, g, 0.6)
  for (const mul of [1, 1.5]) {
    const o = c.createOscillator()
    o.type = mul === 1 ? 'triangle' : 'sine'
    o.frequency.setValueAtTime(from * mul, t)
    o.frequency.exponentialRampToValueAtTime(to * mul, t + secs)
    o.connect(lp)
    o.start(t)
    o.stop(t + secs + 0.05)
  }
}

export function haptic(enabled: boolean, ms = 12) {
  if (!enabled || typeof navigator === 'undefined' || typeof navigator.vibrate !== 'function') return
  navigator.vibrate(ms)
}

export const NOTES = {
  step: [587.33, 880],
  win: [523.25, 659.25, 783.99, 1046.5],
  soft: [392],
}

/* ---------- ambient soundscapes ---------- */

export type AmbientId = 'realm' | WorldId

interface Ambient {
  id: AmbientId
  bus: GainNode
  stops: (() => void)[]
}

let current: Ambient | null = null
let wanted: AmbientId | null = null

function every(minMs: number, maxMs: number, fn: () => void): () => void {
  let timer = 0
  let live = true
  const loop = () => {
    timer = window.setTimeout(() => {
      if (!live) return
      fn()
      loop()
    }, minMs + Math.random() * (maxMs - minMs))
  }
  loop()
  return () => {
    live = false
    window.clearTimeout(timer)
  }
}

function noiseLoop(c: AudioContext): AudioBufferSourceNode {
  const src = c.createBufferSource()
  src.buffer = whiteNoise(c)
  src.loop = true
  src.start()
  return src
}

/** Filtered noise whose loudness drifts slowly: wind or waves. */
function wind(c: AudioContext, bus: GainNode, freq: number, q: number, level: number, lfoHz: number, type: BiquadFilterType = 'bandpass'): () => void {
  const src = noiseLoop(c)
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = freq
  f.Q.value = q
  const g = c.createGain()
  g.gain.value = level
  const lfo = c.createOscillator()
  const lfoG = c.createGain()
  lfo.frequency.value = lfoHz
  lfoG.gain.value = level * 0.7
  lfo.connect(lfoG)
  lfoG.connect(g.gain)
  lfo.start()
  src.connect(f)
  f.connect(g)
  g.connect(bus)
  return () => {
    src.stop()
    lfo.stop()
  }
}

function drone(c: AudioContext, bus: GainNode, freqs: number[], type: OscillatorType, cutoff: number, level: number): () => void {
  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = cutoff
  const g = c.createGain()
  g.gain.value = level
  lp.connect(g)
  g.connect(bus)
  const lfo = c.createOscillator()
  const lfoG = c.createGain()
  lfo.frequency.value = 0.07
  lfoG.gain.value = cutoff * 0.25
  lfo.connect(lfoG)
  lfoG.connect(lp.frequency)
  lfo.start()
  const oscs = freqs.map((f, i) => {
    const o = c.createOscillator()
    o.type = type
    o.frequency.value = f
    o.detune.value = (i % 2 ? 1 : -1) * 6
    o.connect(lp)
    o.start()
    return o
  })
  return () => {
    lfo.stop()
    oscs.forEach((o) => o.stop())
  }
}

function burst(c: AudioContext, bus: GainNode, hz: number, vol: number, dur: number, type: BiquadFilterType = 'highpass') {
  const src = c.createBufferSource()
  src.buffer = whiteNoise(c)
  const f = c.createBiquadFilter()
  f.type = type
  f.frequency.value = hz
  const g = c.createGain()
  const t = c.currentTime
  g.gain.setValueAtTime(vol, t)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  src.connect(f)
  f.connect(g)
  g.connect(bus)
  src.start(t, Math.random())
  src.stop(t + dur + 0.02)
}

function chirp(c: AudioContext, bus: GainNode, f0: number, f1: number, vol: number, dur = 0.12) {
  const o = c.createOscillator()
  const g = c.createGain()
  const t = c.currentTime
  o.type = 'sine'
  o.frequency.setValueAtTime(f0, t)
  o.frequency.exponentialRampToValueAtTime(f1, t + dur)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(vol, t + 0.015)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(bus)
  o.start(t)
  o.stop(t + dur + 0.02)
}

function build(c: AudioContext, id: AmbientId, bus: GainNode): (() => void)[] {
  const stops: (() => void)[] = []
  const pick = () => PENTA[Math.floor(Math.random() * PENTA.length)] / 2
  switch (id) {
    case 'forest':
      stops.push(wind(c, bus, 520, 0.6, 0.1, 0.11))
      stops.push(every(1200, 3600, () => {
        for (let i = 0; i < 3; i++) window.setTimeout(() => chirp(c, bus, 4200, 4500, 0.012, 0.045), i * 85)
      }))
      stops.push(every(9000, 16000, () => pluck(c, pick(), c.currentTime, 0.02, 1.6, 0.7, true)))
      break
    case 'forge':
      stops.push(drone(c, bus, [55, 82.41, 110], 'sawtooth', 190, 0.07))
      stops.push(every(160, 900, () => burst(c, bus, 2600, 0.05, 0.03)))
      stops.push(every(10000, 18000, () => anvil(c, 98, c.currentTime, 0.025, 1.6, 0.6)))
      break
    case 'island':
      stops.push(wind(c, bus, 650, 0.4, 0.13, 0.13, 'lowpass'))
      stops.push(every(8000, 14000, () => bell(c, PENTA[Math.floor(Math.random() * 5)], c.currentTime, 0.018, 2.6, 0.95)))
      break
    case 'garden':
      stops.push(wind(c, bus, 900, 0.4, 0.05, 0.09))
      stops.push(every(2200, 6000, () => {
        const n = 2 + Math.floor(Math.random() * 3)
        const base = 2400 + Math.random() * 900
        for (let i = 0; i < n; i++) window.setTimeout(() => chirp(c, bus, base, base * 1.45, 0.011), i * 150)
      }))
      stops.push(every(7000, 12000, () => pluck(c, pick() * 2, c.currentTime, 0.02, 1.6, 0.7)))
      break
    case 'sanctuary':
      stops.push(drone(c, bus, [110, 164.81, 207.65, 277.18], 'sine', 600, 0.075))
      stops.push(every(5000, 9000, () => bowl(c, PENTA[Math.floor(Math.random() * 4)], c.currentTime, 0.012, 3.4, 0.9)))
      break
    default:
      stops.push(drone(c, bus, [98, 146.83, 196], 'sine', 500, 0.06))
      stops.push(wind(c, bus, 380, 0.5, 0.04, 0.08))
      stops.push(every(6000, 12000, () => bell(c, PENTA[Math.floor(Math.random() * 6)], c.currentTime, 0.013, 2.4, 0.9)))
  }
  return stops
}

function fadeOut(a: Ambient) {
  if (!ctx) return
  a.bus.gain.setTargetAtTime(0, ctx.currentTime, 0.5)
  a.stops.forEach((s) => s())
  window.setTimeout(() => a.bus.disconnect(), 2500)
}

/** Start, switch or stop the soundscape. Safe to call often; does nothing if the world is unchanged. */
export function setAmbient(id: AmbientId | null, enabled: boolean) {
  wanted = enabled ? id : null
  if (!enabled || !id) {
    if (current) {
      fadeOut(current)
      current = null
    }
    return
  }
  if (current?.id === id) return
  const c = ensure()
  if (!c || c.state !== 'running') return // started again on the first tap or key press
  if (current) fadeOut(current)
  const bus = c.createGain()
  bus.gain.setValueAtTime(0.0001, c.currentTime)
  bus.gain.setTargetAtTime(0.9, c.currentTime, 0.9)
  route(c, bus, 0.25)
  current = { id, bus, stops: build(c, id, bus) }
}

if (typeof window !== 'undefined') {
  // Browsers only allow audio after a user gesture: resume and start the wanted soundscape then.
  const unlock = () => {
    if (!ctx) return
    void ctx.resume().then(() => {
      if (wanted && !current) setAmbient(wanted, true)
    })
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return
    if (document.hidden) void ctx.suspend()
    else void ctx.resume()
  })
}
