import { AnimatePresence, motion } from 'framer-motion'
import { Gem, Seal, Star } from '@/art/Ornaments'
import { ACHIEVEMENTS, WORLDS } from '@/game/data'
import { getCharacter } from '@/characters'
import CharacterArt from '@/characters/ui/CharacterArt'
import { actions, useGame } from '@/game/store'

export default function CelebrationModal() {
  const { celebrations } = useGame()
  const c = celebrations[0]
  return (
    <AnimatePresence>
      {c && (
        <motion.div
          key={c.id}
          className="fixed inset-0 z-[80] grid place-items-center bg-ink-900/60 p-4 backdrop-blur-[2px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={c.title}
        >
          <motion.div
            className="page-dark relative w-full max-w-sm overflow-hidden p-7 text-center"
            initial={{ scale: 0.9, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <motion.span
                key={i}
                className="pointer-events-none absolute text-gold-300"
                style={{ left: `${(i * 83) % 100}%`, top: '45%' }}
                initial={{ opacity: 0, y: 0, scale: 0.4 }}
                animate={{ opacity: [0, 1, 0], y: -140 - (i % 4) * 30, scale: 1 }}
                transition={{ duration: 2.2, delay: i * 0.08, repeat: 0 }}
              >
                <Star size={10 + (i % 3) * 5} />
              </motion.span>
            ))}
            <div className="mx-auto mb-3 flex justify-center">
              <Seal size={64} />
            </div>
            <p className="small-caps text-sm text-gold-300">{c.levelUp ? `Level ${c.levelUp}` : 'A small victory'}</p>
            <h2 className="mt-1 font-display text-3xl font-semibold text-ivory-100">{c.title}</h2>
            <p className="mt-1 text-ivory-200/90">{c.subtitle}</p>

            <div className="my-5 flex flex-wrap items-center justify-center gap-2">
              {c.reward.xp > 0 && <Chip>+{c.reward.xp} XP</Chip>}
              {c.reward.stardust > 0 && <Chip><Star size={12} color="#e6c677" /> {c.reward.stardust}</Chip>}
              {c.reward.sunbeams > 0 && <Chip>{c.reward.sunbeams} sunbeam{c.reward.sunbeams > 1 ? 's' : ''}</Chip>}
              {c.reward.crystal && (c.reward.crystalCount ?? 1) > 0 && (
                <Chip>
                  <Gem size={16} hue={WORLDS[c.reward.crystal].crystalHue} glow /> {c.reward.crystalCount ?? 1} {WORLDS[c.reward.crystal].crystal}
                </Chip>
              )}
            </div>

            {c.worldShift && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mb-3 font-display text-lg italic text-gold-300">
                {c.worldShift}
              </motion.p>
            )}
            {c.newChars?.map((id) => {
              const ch = getCharacter(id)
              return ch ? (
                <div key={id} className="mx-auto mb-3 flex items-center gap-3 rounded-[3px] border border-gold-400/60 bg-burgundy-900/60 p-2 text-left">
                  <CharacterArt char={ch} className="h-14 w-12 shrink-0 overflow-hidden rounded-t-full bg-ivory-200" />
                  <p className="text-ivory-100"><span className="small-caps block text-gold-300">A new friend</span><span className="font-display text-xl font-semibold">{ch.name}</span> joins the Sanctum Library.</p>
                </div>
              ) : null
            })}
            {c.bondUps?.map((b) => {
              const ch = getCharacter(b.id)
              return ch ? (
                <p key={b.id} className="mb-1 text-sm text-ivory-100">
                  <span className="small-caps text-gold-300">Bond</span> &nbsp;{ch.name} grew closer (level {b.level})
                </p>
              ) : null
            })}
            {c.newAchievements.map((id) => {
              const a = ACHIEVEMENTS.find((x) => x.id === id)
              return a ? (
                <p key={id} className="mb-1 text-sm text-ivory-100">
                  <span className="small-caps text-gold-300">Achievement</span> &nbsp;{a.name}
                </p>
              ) : null
            })}
            <button className="btn-gold mt-4 w-full" onClick={() => actions.dismissCelebration()} autoFocus>
              Continue
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/70 bg-burgundy-900/70 px-3 py-1 font-display text-lg font-semibold text-ivory-100">{children}</span>
}
