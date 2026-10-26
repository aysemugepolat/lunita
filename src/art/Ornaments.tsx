import type { CSSProperties } from 'react'

interface P {
  size?: number
  className?: string
  style?: CSSProperties
  color?: string
}

export function Crescent({ size = 24, className, color = 'currentColor', style }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M17.5 3.2a9.2 9.2 0 1 0 3.3 14.2A8 8 0 0 1 17.5 3.2Z" fill={color} />
    </svg>
  )
}

export function Star({ size = 16, className, color = 'currentColor', style }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} style={style} aria-hidden>
      <path d="M12 1l2.2 8.8L23 12l-8.8 2.2L12 23l-2.2-8.8L1 12l8.8-2.2L12 1Z" fill={color} />
    </svg>
  )
}

export function Sunburst({ size = 80, className, color = 'currentColor', style }: P) {
  const rays = Array.from({ length: 16 }, (_, i) => i * 22.5)
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} style={style} aria-hidden>
      {rays.map((a) => (
        <path key={a} d={a % 45 === 0 ? 'M0 -26 L3 -46 L0 -50 L-3 -46Z' : 'M0 -26 L1.6 -38 L0 -40 L-1.6 -38Z'} fill={color} transform={`rotate(${a})`} />
      ))}
      <circle r="21" fill="none" stroke={color} strokeWidth="1.4" />
      <circle r="17" fill="none" stroke={color} strokeWidth="0.6" />
    </svg>
  )
}

export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold-500 ${className}`} aria-hidden>
      <span className="gold-rule w-16 sm:w-28" />
      <Star size={10} />
      <Crescent size={14} />
      <Star size={10} />
      <span className="gold-rule w-16 sm:w-28" />
    </div>
  )
}

export function Corners({ color = '#b8893a' }: { color?: string }) {
  const corner = (cls: string, rot: number) => (
    <svg width="30" height="30" viewBox="0 0 30 30" className={`absolute ${cls} pointer-events-none`} style={{ transform: `rotate(${rot}deg)` }} aria-hidden>
      <path d="M2 28V8Q2 2 8 2h20" fill="none" stroke={color} strokeWidth="1.2" />
      <path d="M7 24V12q0-5 5-5h12" fill="none" stroke={color} strokeWidth="0.7" />
      <circle cx="12" cy="12" r="1.6" fill={color} />
    </svg>
  )
  return (
    <>
      {corner('left-1 top-1', 0)}
      {corner('right-1 top-1', 90)}
      {corner('right-1 bottom-1', 180)}
      {corner('left-1 bottom-1', 270)}
    </>
  )
}

/** Faceted engraved gem in a given hue. */
export function Gem({ size = 28, hue, className, glow = false }: { size?: number; hue: string; className?: string; glow?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden style={glow ? { filter: `drop-shadow(0 0 6px ${hue})` } : undefined}>
      <path d="M16 2 28 11 16 30 4 11Z" fill={hue} stroke="#2b211c" strokeWidth="1" strokeLinejoin="round" />
      <path d="M16 2 22 11H10Z" fill="#fff" opacity=".42" />
      <path d="M4 11h24L16 30Z" fill="#000" opacity=".16" />
      <path d="M10 11 16 30 22 11" fill="none" stroke="#fff" strokeWidth=".8" opacity=".5" />
      <path d="M16 2 4 11M16 2 28 11" fill="none" stroke="#fff" strokeWidth=".6" opacity=".6" />
    </svg>
  )
}

/** Burgundy wax seal with a crescent. */
export function Seal({ size = 56, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <path d="M32 3c5 0 7 4 11 5s8 0 10 4-1 7 1 11 6 6 5 11-5 6-6 10-1 8-6 9-8-2-12-1-8 4-12 2-4-7-6-11-8-5-8-10 4-7 5-11-1-8 3-11 8 0 12-2 3-6 7-6Z" fill="#6b1a2d" stroke="#3d0c18" strokeWidth="1.5" />
      <circle cx="32" cy="32" r="19" fill="none" stroke="#e6c677" strokeWidth="1" opacity=".7" />
      <path d="M36 17a14 14 0 1 0 8 22 11 11 0 0 1-8-22Z" fill="#e6c677" />
      <path d="M44 18l1.2 3.6 3.6 1.2-3.6 1.2L44 27.6l-1.2-3.6-3.6-1.2 3.6-1.2Z" fill="#e6c677" />
    </svg>
  )
}

export function Compass({ size = 90, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="-50 -50 100 100" className={className} aria-hidden>
      <circle r="38" fill="none" stroke="#6b1a2d" strokeWidth="1" />
      <circle r="34" fill="none" stroke="#b8893a" strokeWidth="0.6" strokeDasharray="1 2.5" />
      <path d="M0 -46 L6 0 L0 46 L-6 0Z" fill="#6b1a2d" opacity=".9" />
      <path d="M-46 0 L0 -6 L46 0 L0 6Z" fill="#b8893a" opacity=".9" />
      <path d="M0 -46 L6 0 L0 0Z" fill="#f4ead5" opacity=".45" />
      <circle r="4" fill="#f4ead5" stroke="#6b1a2d" strokeWidth="1" />
      <text y="-52" textAnchor="middle" fontSize="9" fontFamily="'IM Fell English SC', serif" fill="#6b1a2d">N</text>
    </svg>
  )
}

export function Sparkles({ count = 6, color = '#d4a94c', className = '' }: { count?: number; color?: string; className?: string }) {
  const spots = [
    [10, 20], [82, 12], [90, 60], [18, 80], [50, 6], [64, 88], [30, 50], [75, 38],
  ]
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {spots.slice(0, count).map(([x, y], i) => (
        <Star key={i} size={8 + (i % 3) * 4} color={color} className="anim-twinkle absolute" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.5}s` }} />
      ))}
    </div>
  )
}
