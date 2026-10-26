import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { haptic, play, sfx } from '@/game/sound'
import { actions, useGame } from '@/game/store'
import { Star } from '@/art/Ornaments'
import Sparkle from '@/characters/ui/Sparkle'
import { GAMES } from './discoveries'
import { rnd, rndInt } from './session'

interface Fly {
  x: number
  y: number
  a: number
  speed: number
  turn: number
}

const GOAL = 10
const ON_SCREEN = 6

const makeFly = (): Fly => ({ x: rnd(12, 88), y: rnd(14, 80), a: rnd(0, Math.PI * 2), speed: rnd(5, 9), turn: rnd(0.8, 1.6) })

export default function FireflyCatch({ onWin }: { onWin: () => void }) {
  const { save } = useGame()
  const calm = save.settings.calm
  const sound = save.settings.sound
  const haptics = save.settings.haptics
  const [ids, setIds] = useState<number[]>(() => Array.from({ length: ON_SCREEN }, (_, i) => i))
  const [caught, setCaught] = useState(0)
  const [pops, setPops] = useState<{ key: number; x: number; y: number }[]>([])
  const [msg, setMsg] = useState('Tap the fireflies to guide them into the jar.')
  const box = useRef<HTMLDivElement>(null)
  const flies = useRef(new Map<number, Fly>())
  const els = useRef(new Map<number, HTMLButtonElement>())
  const idsRef = useRef<number[]>(ids)
  const nextId = useRef(ON_SCREEN)
  const popKey = useRef(0)
  const foundRef = useRef<string[]>([])
  useEffect(() => {
    foundRef.current = save.games.fireflies?.found ?? []
  })
  const [goldenId, setGoldenId] = useState<number | null>(null)
  const won = caught >= GOAL

  useEffect(() => {
    idsRef.current = ids
  }, [ids])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const speedScale = calm ? 0.35 : 1
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const el = box.current
      if (el) {
        const w = el.clientWidth
        const h = el.clientHeight
        for (const id of idsRef.current) {
          let f = flies.current.get(id)
          if (!f) {
            f = makeFly()
            flies.current.set(id, f)
          }
          f.a += Math.sin(now / 900 + id * 2.1) * f.turn * dt
          f.x += Math.cos(f.a) * f.speed * dt * speedScale
          f.y += Math.sin(f.a) * f.speed * dt * 0.8 * speedScale
          if (f.x < 8 || f.x > 92) { f.a = Math.PI - f.a; f.x = Math.min(92, Math.max(8, f.x)) }
          if (f.y < 10 || f.y > 78) { f.a = -f.a; f.y = Math.min(78, Math.max(10, f.y)) }
          const b = els.current.get(id)
          if (b) b.style.transform = `translate3d(${(f.x / 100) * w - 28}px, ${(f.y / 100) * h - 28}px, 0)`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [calm])

  const catchFly = (id: number) => {
    if (won) return
    const f = flies.current.get(id)
    const total = caught + 1
    setCaught(total)
    play(sound, 'garden', [784 + (total % 4) * 98, 1174.66], 0.07, 0.05)
    if (f) {
      const key = popKey.current++
      setPops((p) => [...p, { key, x: f.x, y: f.y }])
      window.setTimeout(() => setPops((p) => p.filter((q) => q.key !== key)), 1500)
    }
    flies.current.delete(id)
    const wasGolden = goldenId === id
    let gold = wasGolden ? null : goldenId
    haptic(haptics, wasGolden ? 30 : 10)
    const rest = idsRef.current.filter((i) => i !== id)
    const want = Math.min(ON_SCREEN, GOAL - total)
    while (rest.length < want) {
      const nid = nextId.current++
      // A rare wishing firefly, never more than one at a time
      if (gold === null && rnd(0, 1) < 0.2) gold = nid
      rest.push(nid)
    }
    setIds(rest)
    setGoldenId(gold)
    if (wasGolden) {
      sfx(sound, 'sparkle')
      const items = GAMES.fireflies.items
      const fresh = items.find((i) => !foundRef.current.includes(i.id))
      const wish = fresh ?? items[rndInt(items.length)]
      if (fresh) actions.discover('fireflies', fresh.id)
      setMsg(`A wishing firefly! ${wish.text}${fresh ? ' Added to your collection.' : ''}`)
      if (total >= GOAL) onWin()
      return
    }
    if (total >= GOAL) {
      setMsg('The jar glows warm and gold. Lovely catching.')
      onWin()
    } else {
      setMsg(`${total} in the jar. ${GOAL - total} to go.`)
    }
  }

  const restart = () => {
    flies.current.clear()
    setGoldenId(null)
    const fresh = Array.from({ length: ON_SCREEN }, () => nextId.current++)
    setIds(fresh)
    setCaught(0)
    setMsg('Tap the fireflies to guide them into the jar.')
  }

  const fill = Math.min(1, caught / GOAL)

  return (
    <div>
      <div ref={box} className="relative h-[300px] w-full overflow-hidden rounded-[3px] border border-gold-500 sm:h-[340px]" style={{ background: 'linear-gradient(180deg, #1c1030 0%, #2f1a3e 55%, #1f2a22 100%)' }}>
        <svg viewBox="0 0 400 340" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <path d="M0 300 Q60 270 120 296 T240 290 T400 288 V340 H0Z" fill="#14201a" />
          <path d="M0 320 Q80 300 160 318 T320 312 T400 316 V340 H0Z" fill="#0d1612" />
          {[30, 90, 150, 230, 300, 360].map((x, i) => (
            <g key={x} className="anim-sway" style={{ animationDelay: `${i * 0.5}s` }}>
              <line x1={x} y1="320" x2={x} y2={290 - (i % 3) * 10} stroke="#2f4a35" strokeWidth="2" />
              <circle cx={x} cy={288 - (i % 3) * 10} r="5" fill={i % 2 ? '#c4788a' : '#e6c677'} opacity=".8" />
            </g>
          ))}
        </svg>
        {ids.map((id) => (
          <button
            key={id}
            ref={(el) => {
              if (el) els.current.set(id, el)
              else els.current.delete(id)
            }}
            onClick={() => catchFly(id)}
            aria-label="Catch a firefly"
            className="absolute left-0 top-0 grid h-14 w-14 place-items-center will-change-transform"
          >
            {goldenId === id ? (
              <>
                <span className="anim-glow absolute h-14 w-14 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,214,102,.9), transparent 70%)' }} />
                <Star size={20} color="#ffe08a" className="relative drop-shadow-[0_0_8px_rgba(255,214,102,1)]" />
              </>
            ) : (
              <>
                <span className="anim-glow absolute h-9 w-9 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,240,150,.75), transparent 70%)' }} />
                <span className="h-2.5 w-2.5 rounded-full bg-[#fff3a8] shadow-[0_0_12px_4px_rgba(255,240,150,.9)]" />
              </>
            )}
          </button>
        ))}
        {pops.map((p) => (
          <div key={p.key} className="pointer-events-none absolute" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
            <Sparkle burstKey={p.key} color="#fff3a8" count={7} />
          </div>
        ))}
        {/* the jar */}
        <div className="pointer-events-none absolute bottom-3 right-3 h-24 w-16" aria-label={`Jar with ${caught} of ${GOAL} fireflies`} role="img">
          <svg viewBox="0 0 64 96" className="h-full w-full">
            <defs><clipPath id="jar-clip"><path d="M14 22h36v8q8 6 8 20v32q0 8-8 8H14q-8 0-8-8V50q0-14 8-20Z" /></clipPath></defs>
            <rect x="18" y="8" width="28" height="14" rx="3" fill="#946a27" />
            <g clipPath="url(#jar-clip)">
              <rect x="0" y={92 - fill * 70} width="64" height={fill * 70 + 4} fill="rgba(255,236,140,.55)" />
              <rect x="0" y="0" width="64" height="96" fill="rgba(255,255,255,.07)" />
            </g>
            <path d="M14 22h36v8q8 6 8 20v32q0 8-8 8H14q-8 0-8-8V50q0-14 8-20Z" fill="none" stroke="#e6c677" strokeWidth="2" />
          </svg>
          <p className="absolute inset-x-0 top-9 text-center font-display text-lg font-bold text-ivory-100 tabular-nums">{caught}</p>
        </div>
      </div>
      <p className="mt-3 min-h-[1.5rem] text-sm italic text-ink-700/85" aria-live="polite">{msg}</p>
      {(won || caught > 0) && (
        <button className="btn-ghost mt-2" onClick={restart}><RotateCcw size={16} /> {won ? 'Catch more' : 'Release them and restart'}</button>
      )}
    </div>
  )
}
