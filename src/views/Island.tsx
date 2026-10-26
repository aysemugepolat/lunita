import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, Pause, Play, Plus, Trash2 } from 'lucide-react'
import Lumi from '@/art/Lumi'
import { getCharacter } from '@/characters'
import Bubble from '@/characters/ui/Bubble'
import CharacterArt from '@/characters/ui/CharacterArt'
import Residents from '@/characters/ui/Residents'
import GameShell from '@/games/GameShell'
import { gameWin } from '@/games/rewards'
import StarChart from '@/games/StarChart'
import { nudge } from '@/game/lumi'
import { actions, focusElapsedMs, useGame } from '@/game/store'
import WorldHeader, { Chapters } from './WorldHeader'

const OPTIONS = [
  { m: 1, label: '1', note: 'A spark' },
  { m: 5, label: '5', note: 'A short hop' },
  { m: 10, label: '10', note: 'A calm crossing' },
  { m: 15, label: '15', note: 'A steady sail' },
  { m: 25, label: '25', note: 'The long tide' },
]

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000))
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

export default function Island() {
  const { save } = useGame()
  const f = save.focus
  const [minutes, setMinutes] = useState(10)
  const [stepKey, setStepKey] = useState('')
  const [thought, setThought] = useState('')
  const [now, setNow] = useState(() => Date.now())
  const [landed, setLanded] = useState<{ minutes: number; full: boolean; stepRef: NonNullable<typeof f>['stepRef'] } | null>(null)

  useEffect(() => {
    if (!f || f.pausedAt !== null) return
    const id = window.setInterval(() => {
      const t = Date.now()
      setNow(t)
      // Land automatically when the voyage completes.
      if (focusElapsedMs(f, t) >= f.durationMs - 100) {
        const r = actions.endFocus()
        setLanded({ ...r, stepRef: f.stepRef })
      }
    }, 500)
    return () => window.clearInterval(id)
  }, [f])

  const elapsed = focusElapsedMs(f, now)
  const total = f?.durationMs ?? 0
  const remaining = total - elapsed
  const progress = total ? Math.min(1, elapsed / total) : 0

  const openSteps = useMemo(
    () => save.quests.filter((q) => !q.completedAt).flatMap((q) => q.steps.filter((s) => !s.done).map((s) => ({ key: `${q.id}|${s.id}`, text: s.text, questId: q.id, stepId: s.id, quest: q.title }))),
    [save.quests],
  )

  const sail = () => {
    const sel = openSteps.find((s) => s.key === stepKey)
    setLanded(null)
    setNow(Date.now())
    actions.startFocus(minutes, sel ? { questId: sel.questId, stepId: sel.stepId } : null)
  }

  const landEarly = () => {
    const stepRef = f?.stepRef ?? null
    const r = actions.endFocus()
    setLanded({ ...r, stepRef })
  }

  const seren = getCharacter('seren')
  const serenMet = !!save.charUnlocked.seren && !!seren?.voyage
  const serenLine = serenMet && seren?.voyage ? seren.voyage[progress < 0.15 ? 0 : progress < 0.7 ? 1 : 2] : null
  const phrase = progress < 0.25 ? 'Leaving the harbour. The water is kind.' : progress < 0.6 ? 'Steady now. The island is getting closer.' : progress < 0.9 ? 'You are most of the way there.' : 'The lighthouse is almost in sight.'

  return (
    <div className="space-y-6">
      <WorldHeader world="island" voyage={!!f} progress={progress} sceneClass={f ? 'aspect-[16/10] sm:aspect-[21/9]' : undefined} />

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="page p-5 sm:p-6">
          {!f ? (
            <>
              <p className="small-caps text-burgundy-600">Focus adventure</p>
              <h2 className="font-display text-3xl font-semibold text-burgundy-700">Set sail</h2>
              <p className="mb-4 text-ink-700/85">Choose a voyage length. You can pause or land early at any time and still keep what you earned.</p>
              <div role="radiogroup" aria-label="Voyage length" className="grid grid-cols-5 gap-2">
                {OPTIONS.map((o) => (
                  <button
                    key={o.m}
                    role="radio"
                    aria-checked={minutes === o.m}
                    onClick={() => setMinutes(o.m)}
                    className={`min-h-[72px] rounded-[3px] border px-1 py-2 text-center transition-colors ${minutes === o.m ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700 hover:bg-burgundy-600/10'}`}
                  >
                    <span className="block font-display text-3xl font-bold leading-none tabular-nums">{o.label}</span>
                    <span className="small-caps block pt-1 text-[0.7rem] leading-tight">min</span>
                  </button>
                ))}
              </div>
              <p className="mt-2 text-center text-sm italic text-ink-700/80">{OPTIONS.find((o) => o.m === minutes)?.note}</p>

              <div className="mt-4">
                <label className="small-caps text-burgundy-600" htmlFor="sail-for">Sail for (optional)</label>
                <select id="sail-for" className="input-field mt-1.5" value={stepKey} onChange={(e) => setStepKey(e.target.value)}>
                  <option value="">Just the calm of it</option>
                  {openSteps.map((s) => <option key={s.key} value={s.key}>{s.text}</option>)}
                </select>
              </div>
              <button className="btn-primary mt-5 w-full" onClick={sail}><Anchor size={18} /> Set sail for {minutes} minute{minutes === 1 ? '' : 's'}</button>
            </>
          ) : (
            <div className="text-center">
              <p className="small-caps text-burgundy-600">{f.pausedAt !== null ? 'Resting in the harbour' : 'Sailing'}</p>
              <p className="font-display text-[5.5rem] font-semibold leading-none tracking-wide text-burgundy-700 tabular-nums" role="timer" aria-live="off">{fmt(remaining)}</p>
              <div className="mx-auto mt-4 h-2.5 max-w-sm overflow-hidden rounded-full border border-gold-500/60 bg-ivory-200">
                <div className="h-full bg-gradient-to-r from-burgundy-600 to-gold-400 transition-[width] duration-500" style={{ width: `${progress * 100}%` }} />
              </div>
              {serenMet && seren ? (
                <div className="mx-auto mt-4 grid max-w-md grid-cols-[64px_1fr] items-center gap-3 text-left">
                  <CharacterArt char={seren} idle className="h-20 w-16 overflow-hidden rounded-t-full border border-gold-500 bg-ivory-200" />
                  <Bubble text={f.pausedAt !== null ? 'The harbour is calm. Rest as long as you like.' : serenLine} id={`${f.pausedAt !== null}-${serenLine}`} tail="left" />
                </div>
              ) : (
                <p className="mt-4 font-display text-xl italic text-ink-700">{f.pausedAt !== null ? 'Paused. The tide will wait for you.' : phrase}</p>
              )}
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {f.pausedAt === null ? (
                  <button className="btn-ghost" onClick={() => actions.pauseFocus()}><Pause size={18} /> Rest a moment</button>
                ) : (
                  <button className="btn-primary" onClick={() => actions.resumeFocus()}><Play size={18} /> Keep sailing</button>
                )}
                <button className="btn-ghost" onClick={landEarly}>Land early (keeps your progress)</button>
              </div>
            </div>
          )}
        </section>

        <div className="space-y-6">
          {!f && (
            <GameShell
              dark
              gameId="stars"
              intro="Between voyages, draw the sky. Three constellations earn a Tide Sapphire."
              howTo={['Tap the glowing stars in number order, starting at 1.', 'Lines draw themselves as you go.', 'A wrong tap just whispers which star comes next. Guide glow can be switched off.']}
            >
              <StarChart onWin={() => gameWin('island', 'The sky is charted', 'stars')} />
            </GameShell>
          )}
          <section className="page p-5">
            <h2 className="font-display text-2xl font-semibold text-burgundy-700">Bottled thoughts</h2>
            <p className="text-sm text-ink-700/80">Mind wandering? Park the thought here and return to the sea. It will keep.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); actions.parkThought(thought); setThought('') }}>
              <input className="input-field" placeholder="Something I do not want to forget" value={thought} onChange={(e) => setThought(e.target.value)} maxLength={140} aria-label="Park a thought" />
              <button className="btn-primary !px-4" type="submit" aria-label="Bottle thought"><Plus size={18} /></button>
            </form>
            <ul className="mt-3 space-y-1.5">
              <AnimatePresence initial={false}>
                {save.parked.slice(0, 6).map((p) => (
                  <motion.li key={p.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2 rounded-[3px] border border-gold-500/40 bg-ivory-50 px-3 py-1.5">
                    <span className="flex-1 text-ink-800">{p.text}</span>
                    <button className="min-h-[36px] px-2 text-sm text-burgundy-600 underline-offset-2 hover:underline" onClick={() => { actions.clearParked(p.id); actions.forgeQuest(p.text, 'forge', [{ text: 'Take one tiny first action', minutes: 2 }, { text: 'Decide what the next step is', minutes: 1 }]) }}>Make quest</button>
                    <button className="grid h-9 w-9 place-items-center text-ink-700/60" aria-label="Release thought" onClick={() => actions.clearParked(p.id)}><Trash2 size={14} /></button>
                  </motion.li>
                ))}
              </AnimatePresence>
              {save.parked.length === 0 && <li className="text-sm italic text-ink-700/60">The sea is quiet.</li>}
            </ul>
          </section>
          <Chapters world="island" />
        </div>
      </div>

      <Residents world="island" />

      <AnimatePresence>
        {landed && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="page-dark flex flex-wrap items-center gap-4 p-5">
            <Lumi size={64} mood="cheer" />
            <div className="min-w-[200px] flex-1">
              <p className="font-display text-2xl font-semibold text-ivory-100">{landed.full ? 'Landfall. You did it.' : 'Landed gently.'}</p>
              <p className="text-ivory-200/90">{serenMet && seren?.voyage ? seren.voyage[3] : nudge(landed.minutes + 3)}</p>
            </div>
            {landed.stepRef && (
              <button className="btn-gold" onClick={() => { actions.completeStep(landed.stepRef!.questId, landed.stepRef!.stepId); setLanded(null) }}>Mark my step done</button>
            )}
            <button className="btn-ghost !border-gold-400/60 !text-ivory-100" onClick={() => setLanded(null)}>Not yet</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
