import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react'
import { WORLDS } from '@/game/data'
import { actions, useGame } from '@/game/store'
import { useNav } from '@/ui/nav'
import Sheet from '@/ui/Sheet'
import { CHARACTERS, ROLE_LABEL } from '../index'
import CharacterArt from './CharacterArt'
import PortraitCard from './PortraitCard'

export default function CompanionSelect({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { save } = useGame()
  const nav = useNav()
  const met = CHARACTERS.filter((c) => save.charUnlocked[c.id])
  const startIdx = Math.max(0, met.findIndex((c) => c.id === save.companion))
  const [idx, setIdx] = useState(startIdx)
  const [dir, setDir] = useState(1)
  const safe = Math.min(idx, met.length - 1)
  const c = met[safe]
  const unmet = CHARACTERS.length - met.length

  const move = (d: number) => {
    setDir(d)
    setIdx((safe + d + met.length) % met.length)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Choose your travel companion" dark>
      {c && (
        <div>
          <p className="text-ivory-200/85">Your companion appears beside you, cheers you on, and grows closer as you finish quests.</p>
          <div className="relative mt-4 flex items-center justify-center gap-2">
            <button className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-400/60 text-ivory-100 disabled:opacity-30" onClick={() => move(-1)} disabled={met.length < 2} aria-label="Previous friend">
              <ChevronLeft size={22} />
            </button>
            <div className="w-[min(58vw,230px)]">
              <AnimatePresence mode="wait" custom={dir} initial={false}>
                <motion.div
                  key={c.id}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 60, scale: 0.94 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: dir * -60, scale: 0.94 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <PortraitCard char={c} bond={save.charBond[c.id] ?? 0} isCompanion={save.companion === c.id} idle />
                </motion.div>
              </AnimatePresence>
            </div>
            <button className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-gold-400/60 text-ivory-100 disabled:opacity-30" onClick={() => move(1)} disabled={met.length < 2} aria-label="Next friend">
              <ChevronRight size={22} />
            </button>
          </div>

          <motion.div key={c.id + 'info'} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
            <p className="small-caps text-gold-300">{ROLE_LABEL[c.role]} &middot; {WORLDS[c.home].name}</p>
            <p className="mt-1 text-lg text-ivory-100">{c.roleBlurb}</p>
            <p className="mt-2 font-display text-xl italic text-gold-300">&ldquo;{c.quote}&rdquo;</p>
          </motion.div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button className="btn-gold" disabled={save.companion === c.id} onClick={() => { actions.setCompanion(c.id); onClose() }}>
              {save.companion === c.id ? `Travelling with ${c.name}` : `Travel with ${c.name}`}
            </button>
            <button className="btn-ghost !border-gold-400/60 !text-ivory-100" onClick={() => { onClose(); nav.openCharacter(c.id) }}>Read their story</button>
          </div>

          <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="Friends you have met">
            {met.map((m, i) => (
              <li key={m.id}>
                <button
                  onClick={() => { setDir(i > safe ? 1 : -1); setIdx(i) }}
                  aria-label={m.name}
                  aria-current={i === safe}
                  className={`relative h-14 w-12 overflow-hidden rounded-t-full rounded-b-[2px] border-2 transition-all ${i === safe ? 'border-gold-300 shadow-[0_0_14px_rgba(230,198,119,.7)]' : 'border-gold-600/50 opacity-75 hover:opacity-100'}`}
                >
                  <CharacterArt char={m} className="absolute inset-0 bg-ivory-200" />
                </button>
              </li>
            ))}
            {unmet > 0 && (
              <li className="flex items-center gap-1.5 px-2 text-sm text-ivory-200/80"><Lock size={14} /> {unmet} more to meet</li>
            )}
          </ul>
        </div>
      )}
    </Sheet>
  )
}
