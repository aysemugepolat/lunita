import { useCallback, useEffect, useRef, useState } from 'react'
import { Ear, Flame, Leaf, Moon, Music, Star, Sun, type LucideIcon } from 'lucide-react'
import { haptic, play as playNote } from '@/game/sound'
import { actions, useGame } from '@/game/store'
import { GAMES } from './discoveries'
import { rndInt } from './session'

const RUNES: { Icon: LucideIcon; freq: number; name: string }[] = [
  { Icon: Sun, freq: 392, name: 'Sun rune' },
  { Icon: Moon, freq: 493.88, name: 'Moon rune' },
  { Icon: Star, freq: 587.33, name: 'Star rune' },
  { Icon: Flame, freq: 698.46, name: 'Ember rune' },
  { Icon: Leaf, freq: 783.99, name: 'Leaf rune' },
]

const LENGTHS = [
  { n: 4, label: 'Short' },
  { n: 6, label: 'Medium' },
  { n: 8, label: 'Long' },
]
const TEMPOS = [
  { ms: 1000, label: 'Slow' },
  { ms: 750, label: 'Steady' },
]

type Phase = 'idle' | 'showing' | 'input' | 'won'
const randRune = () => rndInt(RUNES.length)

export default function RuneEcho({ onWin }: { onWin: () => void }) {
  const { save } = useGame()
  const sound = save.settings.sound
  const haptics = save.settings.haptics
  const [free, setFree] = useState(false)
  const [goal, setGoal] = useState(6)
  const [tempo, setTempo] = useState(1000)
  const [seq, setSeq] = useState<number[]>([])
  const [phase, setPhase] = useState<Phase>('idle')
  const [lit, setLit] = useState<number | null>(null)
  const [pos, setPos] = useState(0)
  const [msg, setMsg] = useState('Press begin, watch the runes glow, then echo them back.')
  const timers = useRef<number[]>([])
  const foundRef = useRef<string[]>([])
  useEffect(() => {
    foundRef.current = save.games.runes?.found ?? []
  })

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t))
    timers.current = []
  }
  useEffect(() => clear, [])

  const play = useCallback(
    (s: number[]) => {
      clear()
      setPhase('showing')
      setPos(0)
      s.forEach((r, i) => {
        timers.current.push(
          window.setTimeout(() => {
            setLit(r)
            playNote(sound, 'forge', [RUNES[r].freq / 2], 0, 0.06)
          }, 700 + i * tempo),
          window.setTimeout(() => setLit(null), 700 + i * tempo + tempo * 0.65),
        )
      })
      timers.current.push(
        window.setTimeout(() => {
          setPhase('input')
          setMsg('Your turn. Echo the runes in order.')
        }, 700 + s.length * tempo),
      )
    },
    [sound, tempo],
  )

  const start = () => {
    const s = [randRune(), randRune()]
    setSeq(s)
    setMsg('Watch closely...')
    play(s)
  }

  const tap = (r: number) => {
    if (free) {
      setLit(r)
      playNote(sound, 'forge', [RUNES[r].freq / 2], 0, 0.07)
      haptic(haptics, 8)
      window.setTimeout(() => setLit(null), 260)
      return
    }
    if (phase !== 'input') return
    setLit(r)
    playNote(sound, 'forge', [RUNES[r].freq / 2], 0, 0.06)
    haptic(haptics, 8)
    window.setTimeout(() => setLit(null), 220)
    if (r === seq[pos]) {
      const np = pos + 1
      if (np === seq.length) {
        if (seq.length >= goal) {
          setPhase('won')
          const fresh = GAMES.runes.items.find((i) => !foundRef.current.includes(i.id))
          if (fresh) actions.discover('runes', fresh.id)
          setMsg(fresh ? `The forge sings your echo. New song: ${fresh.name}. ${fresh.text}` : 'The forge sings your echo. Wonderful.')
          onWin()
          return
        }
        const next = [...seq, randRune()]
        setSeq(next)
        setMsg('Lovely. One more rune joins the song...')
        setPhase('showing')
        timers.current.push(window.setTimeout(() => play(next), 600))
      } else {
        setPos(np)
      }
    } else {
      setMsg('The runes shimmer. No harm done. Listen once more.')
      setPhase('showing')
      timers.current.push(window.setTimeout(() => play(seq), 900))
    }
  }

  // Keys 1 to 5 play the runes
  const tapRef = useRef(tap)
  useEffect(() => {
    tapRef.current = tap
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT')) return
      const n = Number(e.key)
      if (n >= 1 && n <= RUNES.length) tapRef.current(n - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const hearAgain = () => {
    if (phase !== 'input') return
    setMsg('Listening again...')
    play(seq)
  }

  const chip = (active: boolean) =>
    `min-h-[44px] rounded-full border px-3.5 text-sm ${active ? 'border-gold-300 bg-gold-300 text-burgundy-800' : 'border-gold-400/50 text-ivory-100'}`
  const setup = !free && (phase === 'idle' || phase === 'won')

  return (
    <div>
      {setup && (
        <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
          <div role="radiogroup" aria-label="Song length" className="flex gap-1.5">
            {LENGTHS.map((l) => <button key={l.n} role="radio" aria-checked={goal === l.n} className={chip(goal === l.n)} onClick={() => setGoal(l.n)}>{l.label}</button>)}
          </div>
          <div role="radiogroup" aria-label="Tempo" className="flex gap-1.5">
            {TEMPOS.map((t) => <button key={t.ms} role="radio" aria-checked={tempo === t.ms} className={chip(tempo === t.ms)} onClick={() => setTempo(t.ms)}>{t.label}</button>)}
          </div>
        </div>
      )}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="small-caps text-ivory-200/90">Song {seq.length} of {goal}</p>
        <div className="flex gap-1" aria-hidden>
          {Array.from({ length: goal }, (_, i) => <span key={i} className={`h-2 w-4 rounded-full border border-gold-400/70 ${i < seq.length ? 'bg-gold-400' : 'bg-transparent'}`} />)}
        </div>
      </div>
      <div className="relative">
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {RUNES.map((r, i) => (
            <button
              key={i}
              onClick={() => tap(i)}
              disabled={!free && phase !== 'input'}
              aria-label={r.name}
              className={`relative grid aspect-square min-h-[56px] place-items-center rounded-[3px] border-2 transition-all duration-200 ${lit === i ? 'scale-105 border-gold-300 bg-gold-300 text-burgundy-800 shadow-[0_0_28px_rgba(230,198,119,.8)]' : 'border-gold-500/70 bg-burgundy-900/70 text-gold-300'} ${phase === 'input' ? 'hover:bg-burgundy-800' : ''}`}
            >
              <r.Icon size={28} strokeWidth={1.6} />
              <span className="absolute bottom-0.5 right-1.5 text-[0.65rem] opacity-60" aria-hidden>{i + 1}</span>
              {lit === i && <span className="absolute -inset-1 animate-ping rounded-[3px] border border-gold-300/70" aria-hidden />}
            </button>
          ))}
        </div>
        {phase === 'input' && seq.length > 0 && (
          <div className="mt-2 flex justify-center gap-1" aria-hidden>
            {seq.map((_, i) => <span key={i} className={`h-1.5 w-1.5 rounded-full ${i < pos ? 'bg-gold-300' : 'bg-ivory-100/30'}`} />)}
          </div>
        )}
      </div>
      <p className="mt-3 min-h-[3rem] text-ivory-100/90" aria-live="polite">{msg}</p>
      <div className="mt-1 flex flex-wrap gap-2">
        <button className="btn-gold" onClick={start} disabled={phase === 'showing' || free}>
          {phase === 'idle' ? 'Begin the echo' : phase === 'won' ? 'Echo again' : 'Restart gently'}
        </button>
        <button className="btn-ghost !border-gold-400/60 !text-ivory-100" onClick={hearAgain} disabled={phase !== 'input'}><Ear size={16} /> Hear it again</button>
        <button className="btn-ghost !border-gold-400/60 !text-ivory-100" aria-pressed={free} onClick={() => { setFree((f) => !f); setMsg(free ? 'Back to the echo game.' : 'Free play: tap or press 1 to 5 to make your own music.') }}><Music size={16} /> {free ? 'Back to the game' : 'Free play'}</button>
      </div>
    </div>
  )
}
