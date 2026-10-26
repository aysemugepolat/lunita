import type { Avatar } from '@/game/types'

export default function Traveller({ avatar, size = 180, className = '' }: { avatar: Avatar; size?: number; className?: string }) {
  const { cloak, trim, hat, aura, charm } = avatar
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 120 144" className={className} role="img" aria-label="Your traveller">
      {aura !== 'none' && (
        <g className="anim-glow">
          <circle cx="60" cy="74" r="58" fill={aura} opacity=".22" />
          <circle cx="60" cy="74" r="46" fill="none" stroke={aura} strokeWidth="1" strokeDasharray="2 5" opacity=".9" className="anim-spin-slow" />
        </g>
      )}
      {/* cloak */}
      <path d="M60 52C34 54 22 84 18 128h84C98 84 86 54 60 52Z" fill={cloak} stroke="#1d1613" strokeWidth="1.5" />
      <path d="M60 52C34 54 22 84 18 128h84C98 84 86 54 60 52Z" fill="url(#hatch)" />
      <path d="M60 56v72" stroke={trim} strokeWidth="2" />
      <path d="M18 128h84" stroke={trim} strokeWidth="3" />
      <path d="M40 66q20 12 40 0" fill="none" stroke={trim} strokeWidth="2" />
      {/* charm */}
      <g transform="translate(60 88)" fill={trim} stroke="#1d1613" strokeWidth=".8">
        {charm === 'star' && <path d="M0-8l2.4 5.6L8 0l-5.6 2.4L0 8l-2.4-5.6L-8 0l5.6-2.4Z" />}
        {charm === 'moon' && <path d="M4-8a8 8 0 1 0 5 12A6.5 6.5 0 0 1 4-8Z" />}
        {charm === 'key' && (
          <g>
            <circle cx="0" cy="-4" r="4" fill="none" stroke={trim} strokeWidth="2" />
            <path d="M0 0v10M0 6h4M0 9h3" fill="none" stroke={trim} strokeWidth="2" />
          </g>
        )}
      </g>
      {/* head */}
      <circle cx="60" cy="38" r="20" fill="#f1dcb7" stroke="#1d1613" strokeWidth="1.5" />
      <path d="M50 38q3-3 6 0M64 38q3-3 6 0" fill="none" stroke="#1d1613" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M54 47q6 4 12 0" fill="none" stroke="#7d2a40" strokeWidth="1.6" strokeLinecap="round" />
      <ellipse cx="48" cy="44" rx="3.5" ry="2.2" fill="#e58aa0" opacity=".5" />
      <ellipse cx="72" cy="44" rx="3.5" ry="2.2" fill="#e58aa0" opacity=".5" />
      {/* hair */}
      <path d="M40 36q0-20 20-20t20 20q-8-10-20-10t-20 10Z" fill="#2b211c" />
      {/* hats */}
      {hat === 'hood' && (
        <g>
          <path d="M36 44Q30 12 60 10t24 34Q82 24 60 22T36 44Z" fill={cloak} stroke="#1d1613" strokeWidth="1.5" />
          <path d="M36 44Q30 12 60 10t24 34" fill="none" stroke={trim} strokeWidth="1.5" />
        </g>
      )}
      {hat === 'crown' && (
        <g fill={trim} stroke="#1d1613" strokeWidth="1">
          <path d="M44 22l4-12 6 8 6-12 6 12 6-8 4 12Z" />
          <circle cx="60" cy="9" r="2.2" fill="#fff" />
        </g>
      )}
      {hat === 'starcap' && (
        <g>
          <path d="M42 24Q60-14 90-6 80 4 78 24Z" fill={cloak} stroke="#1d1613" strokeWidth="1.5" />
          <path d="M38 26q22 8 46 0" fill="none" stroke={trim} strokeWidth="3" />
          <path d="M70 6l1.6 4 4 1.6-4 1.6L70 17l-1.6-3.8-4-1.6 4-1.6Z" fill={trim} />
        </g>
      )}
    </svg>
  )
}
