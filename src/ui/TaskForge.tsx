import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Hammer, Minimize2, Plus, Wand2, X } from 'lucide-react'
import { WORLDS, WORLD_ORDER } from '@/game/data'
import { actions } from '@/game/store'
import { breakDown, detectWorld, shrink, titleFor, type DraftStep, type Energy } from '@/game/lumi'
import type { WorldId } from '@/game/types'

const ENERGY: { id: Energy; label: string; hint: string }[] = [
  { id: 'tiny', label: 'Tiny', hint: '3 gentle steps' },
  { id: 'steady', label: 'Steady', hint: 'about 6 steps' },
  { id: 'bold', label: 'Bold', hint: 'steps and a treat' },
]

interface Props {
  initialTask?: string
  autoBreak?: boolean
  onForged?: (questId: string) => void
  compact?: boolean
}

export default function TaskForge({ initialTask = '', autoBreak = false, onForged, compact = false }: Props) {
  const [task, setTask] = useState(initialTask)
  const [energy, setEnergy] = useState<Energy>('steady')
  const [steps, setSteps] = useState<DraftStep[] | null>(null)
  const [world, setWorld] = useState<WorldId>('forge')
  const [extra, setExtra] = useState('')

  const gather = (t = task, e = energy) => {
    if (!t.trim()) return
    setSteps(breakDown(t, e))
    setWorld(detectWorld(t))
  }

  useEffect(() => {
    if (autoBreak && initialTask.trim()) {
      setSteps(breakDown(initialTask, 'steady'))
      setWorld(detectWorld(initialTask))
    }
    // run once on mount for chat-embedded forges
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const minutes = steps?.reduce((n, s) => n + s.minutes, 0) ?? 0

  const forge = () => {
    if (!steps || steps.length === 0) return
    const id = actions.forgeQuest(titleFor(task), world, steps)
    setSteps(null)
    setTask('')
    onForged?.(id)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="small-caps text-burgundy-600" htmlFor={compact ? 'forge-task-c' : 'forge-task'}>What feels too big?</label>
        <div className="mt-1.5 flex flex-col gap-2 sm:flex-row">
          <input
            id={compact ? 'forge-task-c' : 'forge-task'}
            className="input-field"
            placeholder="e.g. clean my room, reply to emails, study for exam"
            value={task}
            maxLength={90}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && gather()}
          />
          <button className="btn-primary shrink-0" onClick={() => gather()} disabled={!task.trim()}>
            <Wand2 size={18} /> Break it down
          </button>
        </div>
      </div>

      <div role="radiogroup" aria-label="Energy level" className="grid grid-cols-3 gap-2">
        {ENERGY.map((e) => (
          <button
            key={e.id}
            role="radio"
            aria-checked={energy === e.id}
            onClick={() => {
              setEnergy(e.id)
              if (steps) gather(task, e.id)
            }}
            className={`min-h-[56px] rounded-[3px] border px-2 py-1.5 text-center transition-colors ${energy === e.id ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700 hover:bg-burgundy-600/10'}`}
          >
            <span className="block font-display text-lg font-bold leading-tight">{e.label}</span>
            <span className="block text-xs opacity-80">{e.hint}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {steps && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-3">
            <hr className="gold-rule" />
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-xl font-semibold text-burgundy-700">{titleFor(task)}</h3>
              <span className="text-sm text-ink-700/80">about {minutes} min total</span>
            </div>
            <ol className="space-y-2">
              <AnimatePresence initial={false}>
                {steps.map((s, i) => (
                  <motion.li
                    key={s.text + i}
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-[3px] border border-gold-500/40 bg-ivory-50/80 p-3"
                  >
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-burgundy-600/60 font-display text-base font-bold text-burgundy-700">{i + 1}</span>
                    <div className="min-w-0 flex-1">
                      <p className="leading-snug text-ink-800">{s.text}</p>
                      <p className="text-sm text-ink-700/70">{s.minutes} min</p>
                    </div>
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-burgundy-600 hover:bg-burgundy-600/10"
                      title="Make this step smaller"
                      aria-label={`Make step ${i + 1} smaller`}
                      onClick={() => setSteps(steps.flatMap((x, j) => (j === i ? shrink(x.text) : [x])))}
                    >
                      <Minimize2 size={16} />
                    </button>
                    <button
                      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-700/60 hover:bg-burgundy-600/10"
                      title="Remove this step"
                      aria-label={`Remove step ${i + 1}`}
                      onClick={() => setSteps(steps.filter((_, j) => j !== i))}
                    >
                      <X size={16} />
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ol>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                if (extra.trim()) {
                  setSteps([...steps, { text: extra.trim().slice(0, 120), minutes: 5 }])
                  setExtra('')
                }
              }}
            >
              <input className="input-field" placeholder="Add a step of your own" value={extra} onChange={(e) => setExtra(e.target.value)} aria-label="Add a step" />
              <button className="btn-ghost shrink-0" type="submit" aria-label="Add step"><Plus size={18} /></button>
            </form>
            <div>
              <p className="small-caps mb-1.5 text-burgundy-600">Reward world</p>
              <div className="flex flex-wrap gap-1.5">
                {WORLD_ORDER.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWorld(w)}
                    className={`min-h-[40px] rounded-full border px-3 text-sm ${world === w ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700'}`}
                  >
                    {WORLDS[w].crystal}
                  </button>
                ))}
              </div>
            </div>
            <button className="btn-primary w-full" onClick={forge} disabled={steps.length === 0}>
              <Hammer size={18} /> Forge this quest
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
