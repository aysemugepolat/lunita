import { motion } from 'framer-motion'
import { Heart, Lock } from 'lucide-react'
import { Corners } from '@/art/Ornaments'
import { WORLDS } from '@/game/data'
import { BOND_MAX, bondLevel } from '../bond'
import { ROLE_LABEL } from '../index'
import type { Character } from '../types'
import CharacterArt from './CharacterArt'

interface Props {
  char: Character
  locked?: boolean
  bond?: number
  isCompanion?: boolean
  onClick?: () => void
  size?: 'sm' | 'md' | 'lg'
  idle?: boolean
  className?: string
}

/** Ornate gold-framed ivory parchment portrait card. */
export default function PortraitCard({ char, locked = false, bond = 0, isCompanion = false, onClick, size = 'md', idle = false, className = '' }: Props) {
  const level = bondLevel(bond)
  const Tag = onClick ? motion.button : motion.div
  return (
    <Tag
      {...(onClick ? { onClick, type: 'button' as const, whileHover: { y: -4 }, whileTap: { scale: 0.98 } } : {})}
      aria-label={locked ? `Unmet friend. ${char.hint}` : `${char.name}, ${char.title}`}
      className={`group relative block w-full text-left ${className}`}
    >
      <div className="relative rounded-[3px] bg-gradient-to-b from-gold-300 via-gold-500 to-gold-600 p-[5px] shadow-page">
        <div className="relative rounded-[2px] bg-ivory-100 p-2" style={{ backgroundImage: 'var(--grain)' }}>
          <div className="relative overflow-hidden rounded-t-[999px] rounded-b-[2px] border border-gold-600 bg-ivory-200" style={{ aspectRatio: size === 'sm' ? '4 / 5' : '3 / 4' }}>
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 85%, ${char.accent}55, transparent 70%)` }} />
            <CharacterArt char={char} silhouette={locked} idle={idle && !locked} className="absolute inset-0" />
            {locked && (
              <span className="absolute inset-0 grid place-items-center bg-burgundy-900/30">
                <Lock size={size === 'sm' ? 20 : 28} className="text-ivory-100" />
              </span>
            )}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_26px_rgba(61,12,24,0.35)]" />
          </div>
          <Corners />
          <div className="mt-2 text-center">
            <p className={`font-display font-semibold leading-tight text-burgundy-700 ${size === 'lg' ? 'text-3xl' : size === 'sm' ? 'text-lg' : 'text-2xl'}`}>{locked ? 'Unmet friend' : char.name}</p>
            <p className={`small-caps text-ink-700/80 ${size === 'sm' ? 'text-[0.7rem]' : 'text-xs'} leading-tight`}>{locked ? WORLDS[char.home].short : char.title}</p>
            {!locked && size !== 'sm' && (
              <p className="mt-1.5 flex items-center justify-center gap-0.5" aria-label={`Bond level ${level} of ${BOND_MAX}`}>
                {Array.from({ length: BOND_MAX }, (_, i) => (
                  <Heart key={i} size={13} className={i < level ? 'fill-burgundy-600 text-burgundy-600' : 'text-gold-500/60'} />
                ))}
                <span className="small-caps ml-1.5 text-[0.7rem] text-ink-700/70">{ROLE_LABEL[char.role]}</span>
              </p>
            )}
          </div>
        </div>
      </div>
      {isCompanion && (
        <span className="small-caps absolute -right-1.5 -top-2 z-10 rounded-full border border-gold-400 bg-burgundy-700 px-2.5 py-0.5 text-[0.7rem] text-ivory-100 shadow-gold">Travelling with you</span>
      )}
    </Tag>
  )
}
