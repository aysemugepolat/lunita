import { useState } from 'react'
import { Lock } from 'lucide-react'
import { Gem, Seal } from '@/art/Ornaments'
import { ACHIEVEMENTS, STAGE_AT, STAGE_NAMES, WORLDS, WORLD_ORDER, stageFor } from '@/game/data'
import { useGame } from '@/game/store'
import Keepsakes from './Keepsakes'

type Tab = 'crystals' | 'achievements' | 'keepsakes'

export default function Collection() {
  const { save } = useGame()
  const [tab, setTab] = useState<Tab>('crystals')
  const tabs: { id: Tab; label: string }[] = [
    { id: 'crystals', label: 'Crystals' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'keepsakes', label: 'Arc keepsakes' },
  ]
  const earned = ACHIEVEMENTS.filter((a) => save.achievements[a.id]).length

  return (
    <div className="space-y-5">
      <div>
        <p className="small-caps text-burgundy-600">Your treasures</p>
        <h1 className="font-display text-4xl font-semibold text-burgundy-700">Collection</h1>
      </div>
      <div role="tablist" className="flex gap-1 border-b border-gold-500/50">
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`min-h-[48px] border-b-2 px-4 font-display text-xl font-semibold transition-colors ${tab === t.id ? 'border-burgundy-700 text-burgundy-700' : 'border-transparent text-ink-700/65 hover:text-burgundy-700'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'crystals' && (
        <div className="space-y-4">
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {WORLD_ORDER.map((w) => {
              const def = WORLDS[w]
              const n = save.crystals[w]
              const stage = stageFor(n)
              const next = STAGE_AT[stage + 1]
              return (
                <li key={w} className="page flex flex-col items-center gap-2 p-5 text-center">
                  <Gem size={72} hue={def.crystalHue} glow={n > 0} className={n === 0 ? 'opacity-30 grayscale' : 'anim-float'} />
                  <h3 className="font-display text-2xl font-semibold leading-tight text-ink-800">{def.crystal}</h3>
                  <p className="font-display text-4xl font-bold text-burgundy-700 tabular-nums">{n}</p>
                  <p className="small-caps text-xs text-ink-700/80">{def.name}</p>
                  <p className="text-sm italic text-ink-700/75">{STAGE_NAMES[stage]}{next !== undefined ? `, ${next - n} to grow` : ''}</p>
                </li>
              )
            })}
          </ul>
          <div className="page grid grid-cols-2 gap-4 p-5 text-center sm:grid-cols-4">
            <Stat label="Steps finished" value={save.stats.steps} />
            <Stat label="Quests complete" value={save.stats.quests} />
            <Stat label="Focus minutes" value={save.stats.focusMinutes} />
            <Stat label="Blooms grown" value={save.stats.blooms} />
          </div>
        </div>
      )}

      {tab === 'achievements' && (
        <div>
          <p className="mb-3 text-ink-700/85">{earned} of {ACHIEVEMENTS.length} found. Nothing here expires or can be lost.</p>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ACHIEVEMENTS.map((a) => {
              const got = save.achievements[a.id]
              return (
                <li key={a.id} className={`flex items-center gap-3 rounded-[3px] border p-3 ${got ? 'page' : 'border-dashed border-ink-700/25 opacity-70'}`}>
                  <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${got ? 'bg-burgundy-700' : 'bg-ivory-200'}`}>
                    {got ? <Seal size={38} /> : <Lock size={16} className="text-ink-700/50" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-display text-xl font-semibold leading-tight text-ink-800">{a.name}</span>
                    <span className="block text-sm text-ink-700/80">{a.desc}</span>
                    {got && <span className="small-caps block text-xs text-burgundy-600">{new Date(got).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {tab === 'keepsakes' && <Keepsakes />}
    </div>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="font-display text-4xl font-bold text-burgundy-700 tabular-nums">{value}</p>
      <p className="small-caps text-xs text-ink-700/80">{label}</p>
    </div>
  )
}
