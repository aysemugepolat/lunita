import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Repeat2 } from 'lucide-react'
import { actions, useGame } from '@/game/store'
import { useNav } from '@/ui/nav'
import { getCharacter } from '../index'
import Bubble from './Bubble'
import CharacterArt from './CharacterArt'
import Sparkle from './Sparkle'

/** The travel companion: floats on screen, reacts to what you finish, and says something kind when tapped. */
export default function CompanionDock() {
  const { save, reaction } = useGame()
  const nav = useNav()
  const char = getCharacter(save.companion) ?? getCharacter('lumi')
  const [hiddenId, setHiddenId] = useState<number | null>(null)

  useEffect(() => {
    if (!reaction) return
    const t = window.setTimeout(() => {
      setHiddenId(reaction.id)
      actions.clearReaction(reaction.id)
    }, 6500)
    return () => window.clearTimeout(t)
  }, [reaction])

  if (!char) return null
  const showing = reaction && reaction.id !== hiddenId && reaction.charId === char.id ? reaction : null

  return (
    <div className="pointer-events-none fixed bottom-14 right-2 z-40 flex w-[min(78vw,260px)] flex-col items-end sm:bottom-16 sm:right-4">
      <Bubble text={showing?.text} id={showing?.id} tail="bottom-right" className="pointer-events-auto mb-2 max-w-full" />
      <div className="pointer-events-auto relative flex items-end gap-1.5">
        <button
          onClick={() => nav.openCompanions()}
          className="mb-1 grid h-11 w-11 place-items-center rounded-full border border-gold-400 bg-burgundy-800 text-ivory-100 shadow-gold transition hover:brightness-110"
          aria-label="Change travel companion"
          title="Change companion"
        >
          <Repeat2 size={17} />
        </button>
        <motion.button
          onClick={() => actions.tapCompanion()}
          whileTap={{ scale: 0.94 }}
          className="relative h-[104px] w-[84px] sm:h-[132px] sm:w-[106px]"
          aria-label={`${char.name}, your travel companion. Tap to hear something kind.`}
        >
          <span className="char-halo absolute inset-x-1 bottom-1 h-[70%] rounded-full blur-xl" style={{ background: char.accent, opacity: 0.45 }} />
          <CharacterArt char={char} fit="contain" idle className="relative h-full w-full drop-shadow-[0_6px_10px_rgba(39,8,15,0.45)]" />
          {showing && <Sparkle burstKey={showing.id} color={char.accent} />}
        </motion.button>
      </div>
    </div>
  )
}
