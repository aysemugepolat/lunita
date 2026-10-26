import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import Lumi from '@/art/Lumi'
import { Compass, Divider, Gem, Star } from '@/art/Ornaments'
import { CHAPTERS, STAGE_NAMES, STORY_PROMPTS, WORLDS, WORLD_ORDER, stageFor } from '@/game/data'
import { actions, isUnlocked, totalCrystals, useGame } from '@/game/store'
import type { WorldId } from '@/game/types'
import { useNav } from '@/ui/nav'

const POS: Record<WorldId, [number, number]> = {
  forest: [15, 66],
  forge: [34, 30],
  island: [54, 72],
  garden: [74, 34],
  sanctuary: [88, 70],
}

export default function Realm() {
  const { save, welcomeBack } = useGame()
  const nav = useNav()
  const active = save.quests.filter((q) => !q.completedAt)
  const nextStep = active.flatMap((q) => q.steps.filter((s) => !s.done).slice(0, 1).map((s) => ({ q, s })))[0]
  const unread = CHAPTERS.find((c) => isUnlocked(save, c.world) && save.crystals[c.world] >= c.needs && !save.chaptersRead.includes(c.id))
  const weakest = [...WORLD_ORDER].filter((w) => isUnlocked(save, w)).sort((a, b) => save.crystals[a] - save.crystals[b])[0]

  return (
    <div className="space-y-6">
      {welcomeBack && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="page-dark flex items-center gap-4 p-5">
          <Lumi size={64} mood="cheer" />
          <div className="flex-1">
            <p className="font-display text-2xl font-semibold text-ivory-100">Welcome back, {save.name}.</p>
            <p className="text-ivory-200/90">Your realm kept every light on for you. Nothing was lost while you were away.</p>
          </div>
          <button className="btn-gold shrink-0" onClick={() => actions.dismissWelcomeBack()}>Thank you</button>
        </motion.div>
      )}

      <section className="page p-3 sm:p-5">
        <div className="flex items-end justify-between px-1 pb-3">
          <div>
            <p className="small-caps text-burgundy-600">The realm of Lunita</p>
            <h1 className="font-display text-3xl font-semibold text-burgundy-700 sm:text-4xl">Your map</h1>
          </div>
          <p className="hidden text-sm italic text-ink-700/80 sm:block">Tap a place to enter. Every small step wakes it a little.</p>
        </div>

        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[3px] border border-gold-500/70 bg-ivory-200 sm:aspect-[5/3]" style={{ backgroundImage: 'radial-gradient(ellipse at 50% 50%, #f7efdc 0%, #e9d6a8 100%)' }}>
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
            <path d="M-2 18Q10 8 22 14T46 8 70 14 102 8V-2H-2Z" fill="#d9c08a" opacity=".5" />
            <path d="M-2 92Q20 84 40 92T80 88 102 92V102H-2Z" fill="#d9c08a" opacity=".5" />
            <polyline
              points={WORLD_ORDER.map((w) => POS[w].join(',')).join(' ')}
              fill="none" stroke="#6b1a2d" strokeWidth="1.6" strokeDasharray="1 2.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" opacity=".7"
            />
          </svg>
          <Compass size={96} className="absolute bottom-2 left-2 hidden opacity-80 sm:block" />
          <Star size={18} color="#b8893a" className="anim-twinkle absolute left-[48%] top-[10%]" />
          <Star size={12} color="#b8893a" className="anim-twinkle absolute left-[62%] top-[20%]" />
          <p className="small-caps absolute right-4 top-3 hidden text-sm text-burgundy-600/80 sm:block">here be gentle dragons</p>
          <div className="absolute bottom-2 right-3 hidden text-right sm:block">
            <p className="font-display text-sm italic text-ink-700/70">{totalCrystals(save)} crystals gathered</p>
          </div>

          {WORLD_ORDER.map((w, i) => {
            const def = WORLDS[w]
            const unlocked = isUnlocked(save, w)
            const stage = stageFor(save.crystals[w])
            const [x, y] = POS[w]
            return (
              <motion.button
                key={w}
                onClick={() => nav.go(w)}
                className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${x}%`, top: `${y}%` }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 220, damping: 20 }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`${def.name}. ${unlocked ? STAGE_NAMES[stage] : 'Still dreaming'}`}
              >
                <span className="relative grid h-[68px] w-[68px] place-items-center rounded-full sm:h-[92px] sm:w-[92px]">
                  {unlocked && stage > 0 && <span className="anim-glow absolute inset-[-10px] rounded-full" style={{ background: `radial-gradient(circle, ${def.crystalHue}55, transparent 70%)` }} />}
                  <span className={`absolute inset-0 rounded-full border-2 ${unlocked ? 'border-gold-500' : 'border-ink-700/30'} ${unlocked ? 'bg-burgundy-800' : 'bg-ivory-300'} shadow-page`} />
                  <span className="absolute inset-[5px] rounded-full border border-gold-400/70" />
                  {unlocked ? <Gem size={36} hue={def.crystalHue} glow={stage > 1} className="relative sm:scale-125" /> : <Lock size={22} className="relative text-ink-700/60" />}
                  <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full border border-gold-500 bg-ivory-100 px-1 font-display text-sm font-bold text-burgundy-700 tabular-nums">{save.crystals[w]}</span>
                </span>
                <span className="mt-1.5 rounded-[2px] border border-gold-500/70 bg-ivory-50/95 px-2 py-0.5 text-center shadow-page">
                  <span className="block font-display text-[0.95rem] font-bold leading-tight text-burgundy-700 sm:text-lg">{def.short}</span>
                  <span className="small-caps block text-[0.7rem] leading-none text-ink-700/80">{unlocked ? STAGE_NAMES[stage] : `${def.unlockAt} crystals`}</span>
                </span>
              </motion.button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
        <div className="page flex items-start gap-4 p-5">
          <Lumi size={72} mood="happy" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="small-caps text-burgundy-600">Lumi suggests</p>
            {nextStep ? (
              <>
                <p className="mt-1 font-display text-2xl font-semibold leading-snug text-ink-800">{nextStep.s.text}</p>
                <p className="text-sm text-ink-700/80">From your quest &ldquo;{nextStep.q.title}&rdquo;. Only this one step, nothing else.</p>
                <button className="btn-primary mt-3" onClick={() => nav.go('quests')}>Open my quests <ArrowRight size={18} /></button>
              </>
            ) : (
              <>
                <p className="mt-1 font-display text-2xl font-semibold leading-snug text-ink-800">
                  {save.stats.quests === 0 ? 'Let\u2019s begin with something tiny.' : 'Ready for another tiny thing?'}
                </p>
                <p className="text-sm text-ink-700/80">Pick a gentle starter, or tell Lumi about something real that feels heavy.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button className="btn-primary" onClick={() => { actions.acceptStory(Math.floor(Math.random() * STORY_PROMPTS.length)); nav.go('quests') }}>Give me a tiny quest</button>
                  <button className="btn-ghost" onClick={() => nav.openLumi()}>Tell Lumi a task</button>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {unread && (
            <button onClick={() => nav.openChapter(unread.id)} className="page-dark flex w-full items-center gap-3 p-4 text-left">
              <span className="grid h-10 w-10 place-items-center rounded-full border border-gold-400 text-gold-300"><Star size={16} /></span>
              <span>
                <span className="small-caps block text-gold-300">A new page is waiting</span>
                <span className="font-display text-xl font-semibold text-ivory-100">{unread.title}</span>
              </span>
            </button>
          )}
          {weakest && (
            <button onClick={() => nav.go(weakest)} className="page flex w-full items-center gap-3 p-4 text-left">
              <Gem size={30} hue={WORLDS[weakest].crystalHue} />
              <span className="flex-1">
                <span className="small-caps block text-burgundy-600">A place that would love a visit</span>
                <span className="font-display text-xl font-semibold text-ink-800">{WORLDS[weakest].name}</span>
              </span>
              <ArrowRight size={18} className="text-burgundy-600" />
            </button>
          )}
          <Divider />
          <p className="text-center text-sm italic text-ink-700/75">No streaks. No timers that punish. Come and go as you please.</p>
        </div>
      </section>
    </div>
  )
}
