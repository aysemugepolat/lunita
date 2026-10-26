import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { play } from '@/game/sound'
import { actions, useGame } from '@/game/store'
import { CONSTELLATIONS, type Constellation } from './discoveries'
import { shuffle } from './session'

const ROUNDS = 3

/** Undiscovered constellations first, so every session can add to the atlas. */
function pick(found: string[]): Constellation[] {
  const fresh = shuffle(CONSTELLATIONS.filter((c) => !found.includes(c.id)))
  const old = shuffle(CONSTELLATIONS.filter((c) => found.includes(c.id)))
  return [...fresh, ...old].slice(0, ROUNDS)
}

export default function StarChart({ onWin }: { onWin: () => void }) {
  const { save } = useGame()
  const sound = save.settings.sound
  const [order, setOrder] = useState(() => pick(save.games.stars?.found ?? []))
  const [round, setRound] = useState(0)
  const [next, setNext] = useState(0)
  const [guide, setGuide] = useState(true)
  const [msg, setMsg] = useState('Tap the stars in order, from 1.')
  const [won, setWon] = useState(false)

  const chart = order[Math.min(round, ROUNDS - 1)]
  const done = next >= chart.stars.length
  const pts = useMemo(() => chart.stars, [chart])

  const tap = (i: number) => {
    if (done || won) return
    if (i === next) {
      play(sound, 'island', [349.23 * 1.12246 ** next], 0, 0.05)
      const n = next + 1
      setNext(n)
      if (n === pts.length) {
        play(sound, 'island', [523.25, 659.25, 783.99, 1046.5], 0.12, 0.05)
        const isNew = actions.discover('stars', chart.id)
        setMsg(`${chart.name}. ${chart.text}${isNew ? ' Added to your atlas.' : ''}`)
        if (round + 1 >= ROUNDS) {
          setWon(true)
          setMsg(`${chart.name}. ${chart.text} The whole sky is lit.`)
          onWin()
        }
      } else {
        setMsg('Lovely. Keep following the light.')
      }
    } else if (i > next) {
      setMsg(`That one comes later. Look for star ${next + 1}.`)
    }
  }

  const nextChart = () => {
    setRound(round + 1)
    setNext(0)
    setMsg('Tap the stars in order, from 1.')
  }

  const restart = () => {
    setOrder(pick(save.games.stars?.found ?? []))
    setRound(0)
    setNext(0)
    setWon(false)
    setMsg('Tap the stars in order, from 1.')
  }

  const path = pts.slice(0, next)
  const closing = chart.closed && done

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="small-caps text-ivory-200/90">Constellation {Math.min(round + 1, ROUNDS)} of {ROUNDS}</p>
        <button className={`inline-flex min-h-[40px] items-center gap-1.5 rounded-full border px-3 text-sm ${guide ? 'border-gold-300 bg-gold-300 text-burgundy-800' : 'border-gold-400/50 text-ivory-100'}`} aria-pressed={guide} onClick={() => setGuide((g) => !g)}>
          <Lightbulb size={14} /> Guide glow
        </button>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-[420px] overflow-hidden rounded-[3px] border border-gold-400/70" style={{ background: 'radial-gradient(ellipse at 50% 30%, #3a1530 0%, #1a0a1a 60%, #0d0710 100%)' }}>
        {Array.from({ length: 36 }, (_, i) => (
          <span key={i} className="anim-twinkle absolute h-px w-px rounded-full bg-ivory-100" style={{ left: `${(i * 37) % 100}%`, top: `${(i * 59) % 100}%`, animationDelay: `${(i % 7) * 0.4}s`, boxShadow: '0 0 3px 1px rgba(247,231,179,.6)' }} aria-hidden />
        ))}
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          {path.slice(1).map((p, i) => (
            <motion.line key={`${round}-${i}`} x1={path[i][0]} y1={path[i][1]} x2={p[0]} y2={p[1]} stroke="#e6c677" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.95 }} transition={{ duration: 0.5 }} />
          ))}
          {closing && <motion.line x1={pts[pts.length - 1][0]} y1={pts[pts.length - 1][1]} x2={pts[0][0]} y2={pts[0][1]} stroke="#e6c677" strokeWidth="1.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />}
        </svg>
        {done && <div className="anim-glow pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(230,198,119,.28), transparent 65%)' }} aria-hidden />}
        {pts.map(([x, y], i) => {
          const lit = i < next
          const isNext = i === next
          return (
            <button
              key={`${round}-${i}`}
              onClick={() => tap(i)}
              aria-label={`Star ${i + 1}${lit ? ', lit' : ''}`}
              className="absolute grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center"
              style={{ left: `${x}%`, top: `${y}%` }}
            >
              {isNext && guide && <span className="absolute h-10 w-10 animate-ping rounded-full border border-gold-300/80" aria-hidden />}
              <span className={`relative grid h-6 w-6 place-items-center rounded-full font-display text-xs font-bold transition-all duration-300 ${lit ? 'bg-gold-300 text-burgundy-900 shadow-[0_0_16px_4px_rgba(230,198,119,.75)]' : 'bg-ivory-100/15 text-ivory-100 ring-1 ring-ivory-100/50'}`}>{i + 1}</span>
            </button>
          )
        })}
      </div>

      <p className="mt-3 min-h-[3rem] text-ivory-100/90" aria-live="polite">{msg}</p>
      <div className="flex flex-wrap gap-2">
        {done && !won && <button className="btn-gold" onClick={nextChart}>Next constellation</button>}
        {won && <button className="btn-gold" onClick={restart}>Chart a new sky</button>}
      </div>
    </div>
  )
}
