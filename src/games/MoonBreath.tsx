import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from '@/art/Ornaments'
import { breathTone, play } from '@/game/sound'
import { actions, useGame } from '@/game/store'
import { MoonPhase, PHASES } from './discoveries'

type Kind = 'in' | 'hold-in' | 'out' | 'hold-out'
interface Step {
  kind: Kind
  secs: number
}

const PATTERNS = {
  gentle: {
    label: 'Gentle 4-6',
    note: 'Breathe in for 4, out for 6.',
    steps: [{ kind: 'in', secs: 4 }, { kind: 'hold-in', secs: 1 }, { kind: 'out', secs: 6 }] as Step[],
  },
  box: {
    label: 'Box 4-4-4-4',
    note: 'In, hold, out, hold: all for 4.',
    steps: [{ kind: 'in', secs: 4 }, { kind: 'hold-in', secs: 4 }, { kind: 'out', secs: 4 }, { kind: 'hold-out', secs: 4 }] as Step[],
  },
}
type PatternId = keyof typeof PATTERNS

const LABEL: Record<Kind, string> = { in: 'Breathe in', 'hold-in': 'Hold softly', out: 'Breathe out slowly', 'hold-out': 'Rest empty' }

export default function MoonBreath({ onDone }: { onDone: (rounds: number) => void }) {
  const { save } = useGame()
  const sound = save.settings.sound
  const found = save.games.moon?.found ?? []
  const phase = PHASES.find((p) => !found.includes(p.id)) ?? PHASES[found.length % PHASES.length]
  const [gained, setGained] = useState<string | null>(null)
  const phaseRef = useRef(phase)
  useEffect(() => {
    phaseRef.current = phase
  })
  const [pattern, setPattern] = useState<PatternId>('gentle')
  const [rounds, setRounds] = useState(3)
  const [running, setRunning] = useState(false)
  const [finished, setFinished] = useState(false)
  const [idx, setIdx] = useState(0)
  const [round, setRound] = useState(0)
  const [left, setLeft] = useState(0)
  const startedAt = useRef(0)
  const doneRef = useRef(onDone)
  useEffect(() => {
    doneRef.current = onDone
  })
  const steps = PATTERNS[pattern].steps
  const step = steps[idx]

  useEffect(() => {
    if (!running) return
    startedAt.current = Date.now()
    breathTone(sound, step.kind === 'in' ? 'in' : step.kind === 'out' ? 'out' : 'hold', step.secs)
    const id = window.setInterval(() => {
      const el = (Date.now() - startedAt.current) / 1000
      setLeft(Math.max(1, Math.ceil(step.secs - el)))
      if (el < step.secs) return
      if (idx + 1 < steps.length) {
        setIdx(idx + 1)
        setLeft(steps[idx + 1].secs)
      } else if (round + 1 >= rounds) {
        setRunning(false)
        setFinished(true)
        const earned = phaseRef.current
        const isNew = actions.discover('moon', earned.id)
        play(sound, 'sanctuary', [220, 329.63, 440], 0.25, 0.05)
        setGained(isNew ? `New moon phase: ${earned.name}. ${earned.text}` : `${earned.name}. ${earned.text}`)
        doneRef.current(rounds)
      } else {
        setRound(round + 1)
        setIdx(0)
        setLeft(steps[0].secs)
      }
    }, 200)
    return () => window.clearInterval(id)
  }, [running, idx, round, rounds, steps, step, sound])

  const begin = () => {
    setRound(0)
    setIdx(0)
    setLeft(steps[0].secs)
    setFinished(false)
    setGained(null)
    setRunning(true)
  }

  const full = step.kind === 'in' || step.kind === 'hold-in'
  const scale = running ? (full ? 1.25 : 0.7) : 0.9
  const dur = running && (step.kind === 'in' || step.kind === 'out') ? step.secs : 0.8
  const chip = (active: boolean) =>
    `min-h-[44px] rounded-full border px-4 ${active ? 'border-gold-300 bg-gold-300 text-burgundy-800' : 'border-gold-400/60 text-ivory-100'}`

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative grid h-64 w-64 place-items-center">
        <motion.div
          className="absolute h-44 w-44 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(230,198,119,.5), rgba(230,198,119,0) 70%)' }}
          animate={{ scale: scale * 1.4 }}
          transition={{ duration: dur, ease: 'easeInOut' }}
        />
        <motion.div
          className="relative grid h-40 w-40 place-items-center rounded-full border border-gold-300 bg-gradient-to-br from-ivory-50 to-gold-300 shadow-[0_0_40px_rgba(230,198,119,.5)]"
          animate={{ scale }}
          transition={{ duration: dur, ease: 'easeInOut' }}
        >
          <MoonPhase lit={phase.lit} waxing={phase.waxing} size={92} />
          {running && <span className="absolute bottom-4 font-display text-2xl font-bold text-burgundy-700 tabular-nums" aria-hidden>{left}</span>}
        </motion.div>
      </div>

      <p className="font-display text-3xl font-semibold text-ivory-100" aria-live="polite">{running ? LABEL[step.kind] : finished ? 'Well done' : 'Ready when you are'}</p>
      <p className="mt-1 text-ivory-200/80">{running ? `Breath ${round + 1} of ${rounds}` : finished ? (gained ?? 'Your breaths became stars.') : `${PATTERNS[pattern].note} Tonight's moon to earn: ${phase.name}.`}</p>

      <div className="mt-3 flex min-h-[28px] items-center justify-center gap-2" aria-label={`${finished ? rounds : round} stars lit`}>
        {Array.from({ length: rounds }, (_, i) => (
          <Star key={i} size={20} color={i < (finished ? rounds : round) ? '#e6c677' : 'rgba(244,234,213,.25)'} className={i < (finished ? rounds : round) ? 'anim-twinkle' : ''} />
        ))}
      </div>

      {!running && (
        <div className="mt-4 flex flex-col items-center gap-3">
          <div role="radiogroup" aria-label="Breathing pattern" className="flex flex-wrap justify-center gap-2">
            {(Object.keys(PATTERNS) as PatternId[]).map((p) => (
              <button key={p} role="radio" aria-checked={pattern === p} className={chip(pattern === p)} onClick={() => setPattern(p)}>{PATTERNS[p].label}</button>
            ))}
          </div>
          <div role="radiogroup" aria-label="Number of breaths" className="flex flex-wrap justify-center gap-2">
            {[3, 5, 7].map((n) => (
              <button key={n} role="radio" aria-checked={rounds === n} className={chip(rounds === n)} onClick={() => setRounds(n)}>{n} breaths</button>
            ))}
          </div>
          <button className="btn-gold" onClick={begin}>{finished ? 'Breathe again' : 'Begin'}</button>
        </div>
      )}
      {running && <button className="btn-ghost mt-4 !border-gold-400/60 !text-ivory-100" onClick={() => setRunning(false)}>Stop here, that is fine</button>}
    </div>
  )
}
