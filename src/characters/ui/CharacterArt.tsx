import Lumi from '@/art/Lumi'
import { Crescent, Star } from '@/art/Ornaments'
import { useCharacterArt } from '../image'
import type { Character } from '../types'

interface Props {
  char: Character
  /** 'cover' fills a frame (portraits). 'contain' keeps the full figure visible (sprites). */
  fit?: 'cover' | 'contain'
  className?: string
  /** Show only a dark silhouette, for characters not met yet. */
  silhouette?: boolean
  /** Gentle float, breathing and blink. */
  idle?: boolean
}

/**
 * Shows the uploaded artwork exactly as supplied. Never recoloured or restyled
 * (a silhouette is just the same image darkened). When no file exists yet, shows a neutral frame.
 */
export default function CharacterArt({ char, fit = 'cover', className = '', silhouette = false, idle = false }: Props) {
  const url = useCharacterArt(char)

  if (url) {
    return (
      <div className={`${idle ? 'char-idle' : ''} ${className}`}>
        <div className="char-body h-full w-full">
          <img
            src={url}
            alt={silhouette ? 'An unmet friend' : char.name}
            draggable={false}
            className={`h-full w-full select-none ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
            style={{ objectPosition: char.crop ?? (fit === 'cover' ? 'center 18%' : 'center bottom'), ...(silhouette ? { filter: 'brightness(0) opacity(.55)' } : {}) }}
          />
        </div>
      </div>
    )
  }

  // No artwork file yet. Lumi keeps her original in-game figure; others get a neutral placeholder.
  if (char.id === 'lumi' && !silhouette) {
    return (
      <div className={`grid place-items-center ${className}`}>
        <Lumi size={fit === 'cover' ? 140 : 96} mood="happy" />
      </div>
    )
  }
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-gradient-to-b from-ivory-100 to-ivory-300 ${className}`} role="img" aria-label={silhouette ? 'An unmet friend' : `${char.name}, portrait awaiting`}>
      <div className="absolute inset-0 hatch opacity-60" />
      <div className="relative flex flex-col items-center gap-1 text-burgundy-600/70">
        {silhouette ? <Star size={26} /> : <Crescent size={34} />}
        <span className="font-display text-3xl font-semibold text-burgundy-700/80">{silhouette ? '?' : char.name.charAt(0)}</span>
      </div>
    </div>
  )
}
