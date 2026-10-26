import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown, Hammer, Minimize2, Plus, Trash2 } from 'lucide-react'
import { Gem } from '@/art/Ornaments'
import { STORY_PROMPTS, WORLDS } from '@/game/data'
import { shrink } from '@/game/lumi'
import { actions, useGame } from '@/game/store'
import type { Quest } from '@/game/types'
import { useNav } from '@/ui/nav'

function QuestCard({ q }: { q: Quest }) {
  const [adding, setAdding] = useState('')
  const [confirmDel, setConfirmDel] = useState(false)
  const done = q.steps.filter((s) => s.done).length
  const pct = Math.round((done / Math.max(1, q.steps.length)) * 100)
  const w = WORLDS[q.world]
  const nextId = q.steps.find((s) => !s.done)?.id
  return (
    <motion.article layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} className="page p-5">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-display text-2xl font-semibold leading-tight text-ink-800">{q.title}</h3>
          <p className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-ink-700/80">
            <Gem size={16} hue={w.crystalHue} /> Rewards {w.crystal}
            {q.origin === 'story' && <span className="small-caps text-burgundy-600">&middot; starter</span>}
          </p>
        </div>
        <span className="font-display text-xl font-bold tabular-nums text-burgundy-700">{done}/{q.steps.length}</span>
      </header>
      <div className="mt-3 h-2 overflow-hidden rounded-full border border-gold-500/60 bg-ivory-200">
        <motion.div className="h-full bg-gradient-to-r from-burgundy-600 to-gold-400" animate={{ width: `${pct}%` }} transition={{ type: 'spring', stiffness: 120, damping: 20 }} />
      </div>

      <ul className="mt-4 space-y-2">
        {q.steps.map((s) => (
          <li key={s.id} className={`flex items-center gap-2 rounded-[3px] border p-2 pl-3 transition-colors ${s.done ? 'border-transparent bg-transparent' : s.id === nextId ? 'border-gold-500 bg-ivory-50 shadow-page' : 'border-gold-500/30 bg-ivory-50/50'}`}>
            <button
              onClick={() => actions.completeStep(q.id, s.id)}
              disabled={s.done}
              aria-label={s.done ? 'Done' : `Mark done: ${s.text}`}
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border-2 transition-all ${s.done ? 'border-gold-500 bg-gold-400 text-burgundy-800' : 'border-burgundy-600 text-transparent hover:bg-burgundy-600/10 hover:text-burgundy-600/50'}`}
            >
              <Check size={20} strokeWidth={3} />
            </button>
            <div className="min-w-0 flex-1 py-1">
              <p className={`leading-snug ${s.done ? 'text-ink-700/55 line-through decoration-gold-500' : 'text-ink-800'}`}>{s.text}</p>
              {!s.done && <p className="text-xs text-ink-700/65">about {s.minutes} min</p>}
            </div>
            {!s.done && (
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-burgundy-600 hover:bg-burgundy-600/10"
                title="Too big? Make it smaller"
                aria-label={`Make smaller: ${s.text}`}
                onClick={() => actions.shrinkStep(q.id, s.id, shrink(s.text))}
              >
                <Minimize2 size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>

      <form
        className="mt-3 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          actions.addStep(q.id, adding)
          setAdding('')
        }}
      >
        <input className="input-field !min-h-[44px]" placeholder="Add a step" value={adding} onChange={(e) => setAdding(e.target.value)} aria-label="Add a step" />
        <button className="btn-ghost shrink-0" type="submit" aria-label="Add step"><Plus size={18} /></button>
      </form>

      <div className="mt-3 flex justify-end">
        {confirmDel ? (
          <span className="flex items-center gap-2 text-sm">
            Set this quest aside?
            <button className="btn-ghost !min-h-[40px]" onClick={() => actions.removeQuest(q.id)}>Yes</button>
            <button className="btn-ghost !min-h-[40px]" onClick={() => setConfirmDel(false)}>No</button>
          </span>
        ) : (
          <button className="inline-flex min-h-[40px] items-center gap-1.5 px-2 text-sm text-ink-700/70 hover:text-burgundy-700" onClick={() => setConfirmDel(true)}>
            <Trash2 size={14} /> Set aside
          </button>
        )}
      </div>
    </motion.article>
  )
}

export default function Quests() {
  const { save } = useGame()
  const nav = useNav()
  const [showDone, setShowDone] = useState(false)
  const active = save.quests.filter((q) => !q.completedAt)
  const finished = save.quests.filter((q) => q.completedAt)
  const titles = new Set(active.map((q) => q.title))

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-5">
        <div>
          <p className="small-caps text-burgundy-600">Quest journal</p>
          <h1 className="font-display text-4xl font-semibold text-burgundy-700">Your quests</h1>
          <p className="text-ink-700/80">Only the glowing step matters right now. Everything else can wait.</p>
        </div>

        <AnimatePresence>
          {active.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="page p-8 text-center">
              <p className="font-display text-2xl font-semibold text-ink-800">A clear page.</p>
              <p className="mx-auto mt-1 max-w-sm text-ink-700/80">Choose a gentle starter from the right, or forge something real from your own life.</p>
              <button className="btn-primary mt-4" onClick={() => nav.openLumi()}><Hammer size={18} /> Forge a quest with Lumi</button>
            </motion.div>
          )}
          {active.map((q) => <QuestCard key={q.id} q={q} />)}
        </AnimatePresence>

        {active.length > 0 && (
          <button className="btn-ghost w-full" onClick={() => nav.go('forge')}><Hammer size={18} /> Forge another quest</button>
        )}

        {finished.length > 0 && (
          <div>
            <button className="flex min-h-[44px] w-full items-center justify-between border-t border-gold-500/50 pt-3 text-left font-display text-xl font-semibold text-burgundy-700" onClick={() => setShowDone((v) => !v)} aria-expanded={showDone}>
              Completed ({finished.length})
              <ChevronDown size={18} className={`transition-transform ${showDone ? 'rotate-180' : ''}`} />
            </button>
            {showDone && (
              <ul className="mt-2 space-y-1.5">
                {finished.map((q) => (
                  <li key={q.id} className="flex items-center gap-3 rounded-[3px] border border-gold-500/30 bg-ivory-50/60 px-3 py-2">
                    <Gem size={20} hue={WORLDS[q.world].crystalHue} />
                    <span className="flex-1 text-ink-800">{q.title}</span>
                    <span className="text-sm text-ink-700/70">{q.steps.length} steps</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <aside className="space-y-3">
        <div className="page-dark p-5">
          <h2 className="font-display text-2xl font-semibold text-ivory-100">Gentle starters</h2>
          <p className="text-sm text-ivory-200/85">Real, tiny things. Each takes a few minutes at most.</p>
          <ul className="mt-3 space-y-2">
            {STORY_PROMPTS.map((p, i) => (
              <li key={p.title}>
                <button
                  disabled={titles.has(p.title)}
                  onClick={() => actions.acceptStory(i)}
                  className="flex min-h-[56px] w-full items-center gap-3 rounded-[3px] border border-gold-400/50 bg-burgundy-900/50 p-3 text-left transition hover:bg-burgundy-900/80 disabled:opacity-50"
                >
                  <Gem size={26} hue={WORLDS[p.world].crystalHue} />
                  <span className="flex-1">
                    <span className="block font-display text-lg font-semibold leading-tight text-ivory-100">{p.title}</span>
                    <span className="block text-xs text-ivory-200/80">{p.steps.length} steps &middot; {WORLDS[p.world].crystal}</span>
                  </span>
                  <Plus size={18} className="text-gold-300" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  )
}
