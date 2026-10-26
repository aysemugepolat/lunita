import Residents from '@/characters/ui/Residents'
import FireflyCatch from '@/games/FireflyCatch'
import GameShell from '@/games/GameShell'
import { gameWin } from '@/games/rewards'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Droplets, Lock, Shovel, Sun } from 'lucide-react'
import { DecorGlyph, PlantGlyph } from '@/art/GardenArt'
import { Star } from '@/art/Ornaments'
import { DECOR, PLANTS } from '@/game/data'
import { actions, levelFor, plotCount, useGame } from '@/game/store'
import { useNav } from '@/ui/nav'
import WorldHeader, { Chapters } from './WorldHeader'

export default function Garden() {
  const { save } = useGame()
  const nav = useNav()
  const [sel, setSel] = useState<number | null>(null)
  const open = plotCount(save)
  const plot = sel !== null ? save.plots[sel] : null
  const plantDef = plot?.kind === 'plant' ? PLANTS.find((p) => p.id === plot.item) : undefined
  const decorDef = plot?.kind === 'decor' ? DECOR.find((d) => d.id === plot.item) : undefined

  return (
    <div className="space-y-6">
      <WorldHeader world="garden" />
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
        <section className="page p-4 sm:p-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="small-caps text-burgundy-600">Your living garden</p>
              <h2 className="font-display text-3xl font-semibold text-burgundy-700">Plant, tend, bloom</h2>
            </div>
            <div className="flex items-center gap-3 text-ink-800">
              <span className="inline-flex items-center gap-1.5 font-display text-xl font-bold tabular-nums"><Sun size={18} className="text-gold-500" /> {save.sunbeams}<span className="text-sm font-normal text-ink-700/70">sunbeams</span></span>
              <span className="inline-flex items-center gap-1.5 font-display text-xl font-bold tabular-nums"><Star size={14} color="#b8893a" /> {save.stardust}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3" role="grid" aria-label="Garden plots">
            {save.plots.map((p, i) => {
              const locked = i >= open
              const def = p?.kind === 'plant' ? PLANTS.find((x) => x.id === p.item) : undefined
              const growth = p && def ? Math.min(1, p.care / def.need) : 0
              return (
                <motion.button
                  key={i}
                  disabled={locked}
                  onClick={() => setSel(i)}
                  whileHover={locked ? undefined : { y: -3 }}
                  whileTap={locked ? undefined : { scale: 0.97 }}
                  aria-label={locked ? `Plot ${i + 1}, opens at level ${i - 4}` : p ? `Plot ${i + 1}: ${def?.name ?? DECOR.find((d) => d.id === p.item)?.name}` : `Empty plot ${i + 1}`}
                  className={`relative aspect-square min-h-[88px] overflow-hidden rounded-[3px] border transition-colors ${sel === i ? 'border-burgundy-700 ring-2 ring-burgundy-600/60' : 'border-gold-500/60'} ${locked ? 'bg-ink-700/10' : 'bg-gradient-to-b from-[#e7d7b0] to-[#cdb283]'}`}
                >
                  <span className="absolute inset-x-0 bottom-0 h-[38%] hatch bg-[#8a6a43]/45" />
                  {locked ? (
                    <span className="absolute inset-0 grid place-items-center text-ink-700/50"><span className="text-center"><Lock size={18} className="mx-auto" /><span className="small-caps text-xs">level {i - 4}</span></span></span>
                  ) : p ? (
                    <span className="absolute inset-0 grid place-items-center">
                      {p.kind === 'plant' ? <PlantGlyph plantId={p.item} growth={growth} bloomed={p.bloomed} size={84} /> : <DecorGlyph decorId={p.item} size={84} />}
                    </span>
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-burgundy-600/60"><Shovel size={22} /></span>
                  )}
                  {p?.kind === 'plant' && def && !p.bloomed && (
                    <span className="absolute inset-x-2 top-1.5 flex gap-0.5">
                      {Array.from({ length: def.need }, (_, k) => <span key={k} className={`h-1 flex-1 rounded-full ${k < p.care ? 'bg-burgundy-600' : 'bg-ink-700/20'}`} />)}
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
          <p className="mt-3 text-sm italic text-ink-700/75">More plots open as you level up (level {levelFor(save.xp)} now). Finish quest steps to gather sunbeams.</p>
        </section>
          <GameShell
            dark
            gameId="fireflies"
            intro="Evening fireflies drift over the garden. Guide ten into the jar for a Petal Quartz."
            howTo={['Tap a firefly to send it into the jar.', 'They drift slowly, so take your time.', 'Turn on Calm motion in settings to slow them even more.']}
          >
            <FireflyCatch onWin={() => gameWin('garden', 'The jar glows', 'fireflies')} />
          </GameShell>
        </div>

        <div className="space-y-6">
          <section className="page-dark p-5">
            {sel === null && (
              <div>
                <h3 className="font-display text-2xl font-semibold text-ivory-100">Choose a plot</h3>
                <p className="mt-1 text-ivory-200/85">Tap any plot to plant a seed, add a decoration, or tend what is growing.</p>
                {save.sunbeams === 0 && (
                  <button className="btn-gold mt-3" onClick={() => nav.go('quests')}>Earn sunbeams with a quest</button>
                )}
              </div>
            )}
            {sel !== null && !plot && (
              <div>
                <h3 className="font-display text-2xl font-semibold text-ivory-100">Plot {sel + 1} is empty</h3>
                <p className="small-caps mt-3 text-gold-300">Seeds</p>
                <ul className="mt-1.5 space-y-1.5">
                  {PLANTS.map((p) => (
                    <li key={p.id}>
                      <button disabled={save.stardust < p.cost && !save.inventory.includes(`plant:${p.id}`)} onClick={() => actions.plant(sel, p.id)} className="flex min-h-[52px] w-full items-center gap-3 rounded-[3px] border border-gold-400/50 bg-burgundy-900/50 px-3 text-left hover:bg-burgundy-900/80 disabled:opacity-45">
                        <PlantGlyph plantId={p.id} growth={1} bloomed size={36} />
                        <span className="flex-1"><span className="block font-display text-lg font-semibold text-ivory-100">{p.name}</span><span className="block text-xs text-ivory-200/80">blooms after {p.need} sunbeams</span></span>
                        <span className="font-display text-lg font-bold text-gold-300">{save.inventory.includes(`plant:${p.id}`) ? 'Gift' : p.cost === 0 ? 'Free' : p.cost}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                <p className="small-caps mt-4 text-gold-300">Decorations</p>
                <ul className="mt-1.5 space-y-1.5">
                  {DECOR.map((d) => (
                    <li key={d.id}>
                      <button disabled={save.stardust < d.cost && !save.inventory.includes(`decor:${d.id}`)} onClick={() => actions.placeDecor(sel, d.id)} className="flex min-h-[52px] w-full items-center gap-3 rounded-[3px] border border-gold-400/50 bg-burgundy-900/50 px-3 text-left hover:bg-burgundy-900/80 disabled:opacity-45">
                        <DecorGlyph decorId={d.id} size={36} />
                        <span className="flex-1 font-display text-lg font-semibold text-ivory-100">{d.name}</span>
                        <span className="font-display text-lg font-bold text-gold-300">{save.inventory.includes(`decor:${d.id}`) ? 'Gift' : d.cost}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {sel !== null && plot && (
              <div>
                <h3 className="font-display text-2xl font-semibold text-ivory-100">{plantDef?.name ?? decorDef?.name}</h3>
                {plantDef && plot.kind === 'plant' && (
                  <>
                    <p className="mt-1 text-ivory-200/90">{plot.bloomed ? 'In full bloom. It will stay beautiful as long as you like.' : `${plot.care} of ${plantDef.need} sunbeams. It grows a little each time you tend it.`}</p>
                    {!plot.bloomed && (
                      <button className="btn-gold mt-3 w-full" disabled={save.sunbeams < 1} onClick={() => actions.tend(sel)}>
                        <Droplets size={18} /> Tend with 1 sunbeam
                      </button>
                    )}
                    {!plot.bloomed && save.sunbeams < 1 && <p className="mt-2 text-sm italic text-ivory-200/80">No sunbeams right now. Finishing any quest step brings one.</p>}
                  </>
                )}
                <button className="btn-ghost mt-3 !border-gold-400/50 !text-ivory-100" onClick={() => { actions.clearPlot(sel); }}>Clear this plot</button>
              </div>
            )}
          </section>
          <Chapters world="garden" />
        </div>
      </div>
      <Residents world="garden" />
    </div>
  )
}
