import { getCharacter } from '@/characters'
import { useCharacterArt } from '@/characters/image'

interface Props {
  size?: number
  mood?: 'calm' | 'happy' | 'cheer'
  className?: string
  float?: boolean
}

/**
 * Lumi, the moon-wisp companion. If official artwork exists at /characters/lumi.*, that image is shown untouched.
 * Otherwise this original in-game figure is used.
 */
export default function Lumi({ size = 96, mood = 'calm', className = '', float = true }: Props) {
  const url = useCharacterArt(getCharacter('lumi'))
  if (url) {
    return (
      <img
        src={url}
        alt="Lumi, your moon-wisp companion"
        width={size}
        height={size}
        draggable={false}
        className={`select-none object-contain ${float ? 'anim-float' : ''} ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }
  const mouth = mood === 'cheer' ? 'M41 56q9 11 18 0q-9 4-18 0Z' : mood === 'happy' ? 'M43 57q7 6 14 0' : 'M44 58q6 3 12 0'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${float ? 'anim-float' : ''} ${className}`} role="img" aria-label="Lumi, your moon-wisp companion">
      <defs>
        <radialGradient id="lumi-body" cx="40%" cy="35%" r="75%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset="0.65" stopColor="#f1e2bd" />
          <stop offset="1" stopColor="#d9bd7e" />
        </radialGradient>
        <radialGradient id="lumi-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#e6c677" stopOpacity=".55" />
          <stop offset="1" stopColor="#e6c677" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="52" r="48" fill="url(#lumi-halo)" className="anim-glow" />
      <g opacity=".85" stroke="#946a27" strokeWidth=".8" fill="#fbf1d6">
        <path d="M30 54C14 40 8 58 12 70c4 10 16 6 22-6Z" />
        <path d="M70 54c16-14 22 4 18 16-4 10-16 6-22-6Z" />
        <path d="M18 56c4 4 8 8 14 6M82 56c-4 4-8 8-14 6" fill="none" />
      </g>
      <path d="M50 78c-4 8-14 10-18 18 10-2 20-6 24-14Z" fill="#e6c677" stroke="#946a27" strokeWidth=".8" />
      <path d="M34 28c-6-10-2-18 4-20-2 6 0 12 6 16Z" fill="#d4a94c" stroke="#946a27" strokeWidth=".8" />
      <path d="M66 28c6-10 2-18-4-20 2 6 0 12-6 16Z" fill="#d4a94c" stroke="#946a27" strokeWidth=".8" />
      <circle cx="50" cy="52" r="29" fill="url(#lumi-body)" stroke="#946a27" strokeWidth="1.2" />
      <path d="M36 47q4-5 8 0M56 47q4-5 8 0" fill="none" stroke="#3d0c18" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="34" cy="55" rx="4.5" ry="3" fill="#e58aa0" opacity=".55" />
      <ellipse cx="66" cy="55" rx="4.5" ry="3" fill="#e58aa0" opacity=".55" />
      <path d={mouth} fill={mood === 'cheer' ? '#7d2a40' : 'none'} stroke="#3d0c18" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 31l1.8 5 5 1.8-5 1.8L50 45l-1.8-5.4-5-1.8 5-1.8Z" fill="#b8893a" transform="translate(0 -4) scale(1)" />
    </svg>
  )
}
