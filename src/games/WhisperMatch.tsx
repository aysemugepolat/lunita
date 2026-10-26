import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Eye, Feather, Flower2, Key, Leaf, Lock, Moon, RotateCcw, Sparkles, Star, Sun, type LucideIcon } from 'lucide-react'
import { Crescent } from '@/art/Ornaments'
import { haptic, play } from '@/game/sound'
import { actions, useGame } from '@/game/store'
import { GAMES, rankFor } from './discoveries'
import { rndInt, shuffle } from './session'

const SYMBOLS: { id: string; Icon: LucideIcon; name: string }[] = [
  { id: 'sun', Icon: Sun, name: 'Sun' },
  { id: 'moon', Icon: Moon, name: 'Moon' },
  { id: 'star', Icon: Star, name: 'Star' },
  { id: 'leaf', Icon: Leaf, name: 'Leaf' },
  { id: 'flower', Icon: Flower2, name: 'Blossom' },
  { id: 'key', Icon: Key, name: 'Key' },
  { id: 'feather', Icon: Feather, name: 'Feather' },
  { id: 'spark', Icon: Sparkles, name: 'Spark' },
]

const LEVELS = [
  { id: 'cozy', label: 'Cozy', pairs: 6, note: '12 cards' },
  { id: 'wander', label: 'Wandering', pairs: 8, note: '16 cards' },
] as const

/** Card backs unlock with mastery. Purely cosmetic, never required. */
const BACKS = [
  { id: 'classic', name: 'Burgundy', rank: 0, bg: '#6b1a2d', line: 'rgba(230,198,119,.16)', fg: '#e6c677' },
  { id: 'moon', name: 'Midnight', rank: 1, bg: '#2a2742', line: 'rgba(200,205,255,.16)', fg: '#d8dcff' },
  { id: 'rose', name: 'Rose', rank: 2, bg: '#9a3a52', line: 'rgba(255,220,225,.18)', fg: '#ffe4ea' },
  { id: 'gilded', name: 'Gilded', rank: 3, bg: '#a77c2e', line: 'rgba(61,12,24,.2)', fg: '#3d0c18' },
] as const

function deal(pairs: number) {
  const picks = shuffle(SYMBOLS).slice(0, pairs)
  return shuffle(picks.flatMap((s) => [{ uid: s.id + 'a', sym: s }, { uid: s.id + 'b', sym: s }]))
}

export default function WhisperMatch({ onWin }: { onWin: () => void }) {
  const { save } = useGame()
  const sound = save.settings.sound
  const haptics = save.settings.haptics
  const rank = rankFor(save.games.whisper?.wins ?? 0).index
  const [level, setLevel] = useState<(typeof LEVELS)[number]['id']>('cozy')
  const [backId, setBackId] = useState<(typeof BACKS)[number]['id']>('classic')
  const back = BACKS.find((b) => b.id === backId && b.rank <= rank) ?? BACKS[0]
  const pairs = LEVELS.find((l) => l.id === level)!.pairs
  const [cards, setCards] = useState(() => deal(6))
  const [open, setOpen] = useState<string[]>([])
  const [matched, setMatched] = useState<string[]>([])
  const [won, setWon] = useState(false)
  const [peeking, setPeeking] = useState(false)
  const [note, setNote] = useState('Turn two cards to find a matching pair.')
  const lock = useRef(false)
  const timer = useRef<number>()
  const foundRef = useRef<string[]>([])
  useEffect(() => {
    foundRef.current = save.games.whisper?.found ?? []
  })

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const finish = useCallback(() => {
    setWon(true)
    const items = GAMES.whisper.items
    const fresh = items.find((i) => !foundRef.current.includes(i.id))
    const pick = fresh ?? items[rndInt(items.length)]
    if (fresh) actions.discover('whisper', fresh.id)
    setNote(`${fresh ? 'A new whisper' : 'A whisper returns'}: \u201C${pick.text}\u201D`)
    onWin()
  }, [onWin])

  const flip = useCallback(
    (uid: string) => {
      if (lock.current || peeking || open.includes(uid) || matched.includes(uid) || won) return
      play(sound, 'forest', [392 + open.length * 98], 0, 0.05)
      haptic(haptics, 8)
      const next = [...open, uid]
      setOpen(next)
      if (next.length < 2) return
      const [a, b] = next.map((u) => cards.find((c) => c.uid === u)!)
      lock.current = true
      if (a.sym.id === b.sym.id) {
        timer.current = window.setTimeout(() => {
          const m = [...matched, a.uid, b.uid]
          setMatched(m)
          setOpen([])
          lock.current = false
          play(sound, 'forest', [659.25, 987.77], 0.09, 0.06)
          haptic(haptics, 18)
          if (m.length === cards.length) finish()
          else setNote(`${a.sym.name}s found. ${(cards.length - m.length) / 2} to go.`)
        }, 450)
      } else {
        setNote('Not quite. They simply flip back, no harm done.')
        timer.current = window.setTimeout(() => {
          setOpen([])
          lock.current = false
        }, 950)
      }
    },
    [open, matched, cards, won, peeking, finish, sound, haptics],
  )

  const restart = (p = pairs) => {
    window.clearTimeout(timer.current)
    lock.current = false
    setCards(deal(p))
    setOpen([])
    setMatched([])
    setWon(false)
    setPeeking(false)
    setNote('Turn two cards to find a matching pair.')
  }

  const peek = () => {
    if (lock.current || won) return
    lock.current = true
    setPeeking(true)
    setNote('A gentle peek...')
    timer.current = window.setTimeout(() => {
      setPeeking(false)
      lock.current = false
      setNote('Now you know where things are. Take your time.')
    }, 1700)
  }

  const found = matched.length / 2
  const chip = (active: boolean) => `min-h-[44px] rounded-full border px-3.5 text-sm ${active ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700'}`

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div role="radiogroup" aria-label="Difficulty" className="flex gap-1.5">
          {LEVELS.map((l) => (
            <button key={l.id} role="radio" aria-checked={level === l.id} onClick={() => { setLevel(l.id); restart(l.pairs) }} className={chip(level === l.id)}>
              {l.label} <span className="opacity-70">&middot; {l.note}</span>
            </button>
          ))}
        </div>
        <p className="font-display text-xl font-semibold text-burgundy-700 tabular-nums" aria-label={`${found} of ${pairs} pairs found`}>{found} / {pairs}</p>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3" role="group" aria-label="Whisper Match cards">
        {cards.map((c) => {
          const isMatched = matched.includes(c.uid)
          const shown = peeking || open.includes(c.uid) || isMatched
          return (
            <button key={c.uid} onClick={() => flip(c.uid)} aria-label={shown ? c.sym.name : 'Hidden card'} className="relative aspect-[3/4] min-h-[72px] [perspective:600px]">
              <motion.div className="absolute inset-0 [transform-style:preserve-3d]" animate={{ rotateY: shown ? 180 : 0, scale: isMatched ? [1, 1.06, 1] : 1 }} transition={{ duration: 0.45 }}>
                <div className="absolute inset-0 grid place-items-center rounded-[3px] border border-gold-400 [backface-visibility:hidden]" style={{ backgroundColor: back.bg, backgroundImage: `repeating-linear-gradient(45deg, ${back.line} 0 1px, transparent 1px 6px)` }}>
                  <Crescent size={26} color={back.fg} />
                </div>
                <div className={`absolute inset-0 grid place-items-center rounded-[3px] border [backface-visibility:hidden] [transform:rotateY(180deg)] ${isMatched ? 'border-gold-500 bg-gold-300/70 shadow-[0_0_18px_rgba(230,198,119,.8)]' : 'border-gold-500 bg-ivory-50'}`}>
                  <c.sym.Icon size={32} className="text-burgundy-700" strokeWidth={1.6} />
                </div>
              </motion.div>
            </button>
          )
        })}
      </div>

      <p className="mt-3 min-h-[3rem] text-sm italic text-ink-700/85" aria-live="polite">{note}</p>
      <div className="mt-1 flex flex-wrap items-center gap-2">
        <button className="btn-ghost" onClick={peek} disabled={won || peeking}><Eye size={16} /> Gentle peek</button>
        <button className="btn-ghost" onClick={() => restart()}><RotateCcw size={16} /> {won ? 'Play again' : 'Reshuffle'}</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-1.5" role="radiogroup" aria-label="Card back">
        <span className="small-caps mr-1 text-burgundy-600">Card backs</span>
        {BACKS.map((b) => {
          const locked = b.rank > rank
          return (
            <button key={b.id} role="radio" aria-checked={back.id === b.id} disabled={locked} onClick={() => setBackId(b.id)} title={locked ? 'Unlocks with mastery' : b.name} aria-label={`${b.name} card back${locked ? ', locked' : ''}`}
              className={`relative grid h-9 w-7 place-items-center rounded-[2px] border ${back.id === b.id ? 'border-burgundy-700 ring-2 ring-burgundy-600/50' : 'border-gold-500/60'} disabled:opacity-50`} style={{ background: b.bg }}>
              {locked && <Lock size={11} className="text-ivory-100" />}
            </button>
          )
        })}
      </div>
    </div>
  )
}
