import { BookOpen, Lock } from 'lucide-react'
import { Gem } from '@/art/Ornaments'
import WorldScene from '@/art/WorldScene'
import { CHAPTERS, STAGE_AT, STAGE_NAMES, WORLDS, stageFor } from '@/game/data'
import { useGame } from '@/game/store'
import type { WorldId } from '@/game/types'
import { useNav } from '@/ui/nav'

export function useWorld(world: WorldId) {
  const { save } = useGame()
  const crystals = save.crystals[world]
  return { save, crystals, stage: stageFor(crystals), def: WORLDS[world] }
}

export default function WorldHeader({ world, progress, voyage, sceneClass = 'aspect-[16/9] sm:aspect-[21/9]' }: { world: WorldId; progress?: number; voyage?: boolean; sceneClass?: string }) {
  const { crystals, stage, def } = useWorld(world)
  const nextAt = STAGE_AT[stage + 1]
  return (
    <WorldScene world={world} stage={stage} className={sceneClass} progress={progress} voyage={voyage}>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-900/90 via-ink-900/55 to-transparent p-4 pt-14 sm:p-6 sm:pt-20">
        <p className="small-caps text-sm text-gold-300">{def.epithet}</p>
        <h1 className="font-display text-3xl font-semibold leading-tight text-ivory-100 sm:text-5xl">{def.name}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-ivory-100/90">
          <span className="inline-flex items-center gap-1.5 font-display text-lg font-semibold">
            <Gem size={20} hue={def.crystalHue} glow /> {crystals} {def.crystal}
          </span>
          <span className="small-caps text-sm text-gold-300">{STAGE_NAMES[stage]}</span>
          {nextAt !== undefined ? (
            <span className="text-sm italic text-ivory-200/80">{nextAt - crystals} more to grow {STAGE_NAMES[stage + 1].toLowerCase()}</span>
          ) : (
            <span className="text-sm italic text-ivory-200/80">Fully radiant</span>
          )}
        </div>
      </div>
    </WorldScene>
  )
}

export function Chapters({ world }: { world: WorldId }) {
  const { save, crystals } = useWorld(world)
  const nav = useNav()
  const list = CHAPTERS.filter((c) => c.world === world)
  return (
    <section className="page p-5">
      <h2 className="font-display text-2xl font-semibold text-burgundy-700">Story</h2>
      <p className="text-sm text-ink-700/80">New pages open as this world grows.</p>
      <ul className="mt-3 space-y-2">
        {list.map((c, i) => {
          const open = crystals >= c.needs
          const read = save.chaptersRead.includes(c.id)
          return (
            <li key={c.id}>
              <button
                disabled={!open}
                onClick={() => nav.openChapter(c.id)}
                className={`flex min-h-[56px] w-full items-center gap-3 rounded-[3px] border p-3 text-left transition-colors ${open ? 'border-gold-500/60 bg-ivory-50 hover:bg-ivory-200/60' : 'border-dashed border-ink-700/25 bg-transparent opacity-65'}`}
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-burgundy-600/50 font-display text-lg font-bold text-burgundy-700">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold leading-tight text-ink-800">{open ? c.title : 'A page still sleeping'}</span>
                  <span className="block text-sm text-ink-700/75">
                    {open ? (read ? 'Read' : 'A new page is waiting') : `Needs ${c.needs - crystals} more ${WORLDS[world].crystal}`}
                  </span>
                </span>
                {open ? <BookOpen size={18} className={read ? 'text-ink-700/40' : 'text-burgundy-600'} /> : <Lock size={16} className="text-ink-700/40" />}
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
