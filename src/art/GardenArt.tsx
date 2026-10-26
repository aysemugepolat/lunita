import { PLANTS } from '@/game/data'

/** Plant glyph at a growth fraction 0..1. Bloomed plants show the flower fully open. */
export function PlantGlyph({ plantId, growth, bloomed, size = 72 }: { plantId: string; growth: number; bloomed: boolean; size?: number }) {
  const def = PLANTS.find((p) => p.id === plantId) ?? PLANTS[0]
  const h = 14 + growth * 36
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      <ellipse cx="40" cy="70" rx="22" ry="5" fill="#3b2a1d" opacity=".5" />
      <path d="M26 70q14-6 28 0" fill="#5b3f27" />
      <g className={bloomed ? 'anim-sway' : ''}>
        <path d={`M40 68 C40 ${68 - h * 0.5}, 38 ${68 - h * 0.8}, 40 ${68 - h}`} fill="none" stroke="#43552f" strokeWidth="2.5" strokeLinecap="round" />
        {growth > 0.25 && <path d={`M40 ${68 - h * 0.4} q-12 -4 -14 -14 q12 0 14 14Z`} fill="#5f7a4c" stroke="#2f4020" strokeWidth=".6" />}
        {growth > 0.5 && <path d={`M40 ${68 - h * 0.55} q12 -4 14 -14 q-12 0 -14 14Z`} fill="#5f7a4c" stroke="#2f4020" strokeWidth=".6" />}
        {growth <= 0.25 && <circle cx="40" cy={68 - h} r="3" fill={def.hue} />}
        {growth > 0.25 && !bloomed && <circle cx="40" cy={68 - h} r={3 + growth * 4} fill={def.hue} opacity=".9" />}
        {bloomed && (
          <g transform={`translate(40 ${68 - h})`}>
            {Array.from({ length: 8 }, (_, i) => (
              <ellipse key={i} cx="0" cy="-9" rx="4.2" ry="8" fill={def.accent} stroke={def.hue} strokeWidth=".9" transform={`rotate(${i * 45})`} />
            ))}
            <circle r="4.6" fill="#b8893a" stroke="#6b1a2d" strokeWidth=".8" />
          </g>
        )}
      </g>
    </svg>
  )
}

export function DecorGlyph({ decorId, size = 72 }: { decorId: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden>
      <ellipse cx="40" cy="70" rx="24" ry="5" fill="#3b2a1d" opacity=".5" />
      {decorId === 'lantern' && (
        <g>
          <rect x="37" y="30" width="6" height="40" fill="#2b211c" />
          <circle cx="40" cy="26" r="16" fill="#ffe8a3" opacity=".35" className="anim-glow" />
          <path d="M33 18h14l3 6v12l-3 4H33l-3-4V24Z" fill="#ffe8a3" stroke="#946a27" strokeWidth="1.5" />
          <path d="M34 18l6-6 6 6" fill="#6b1a2d" stroke="#946a27" />
        </g>
      )}
      {decorId === 'birdbath' && (
        <g stroke="#946a27" fill="#ecdcba">
          <path d="M34 70l3-24h6l3 24Z" />
          <ellipse cx="40" cy="44" rx="24" ry="7" />
          <ellipse cx="40" cy="43" rx="18" ry="4.5" fill="#9fc4d3" />
          <path d="M44 34q6-10 12-4-4 8-12 4Z" fill="#6b1a2d" stroke="#3d0c18" />
        </g>
      )}
      {decorId === 'bench' && (
        <g stroke="#2b211c" strokeWidth="1.2">
          <rect x="12" y="40" width="56" height="8" fill="#7d2a40" />
          <rect x="12" y="26" width="56" height="8" fill="#6b1a2d" />
          <path d="M16 48v22M64 48v22M16 26v-6M64 26v-6" stroke="#2b211c" strokeWidth="3" />
          <path d="M12 44h56" stroke="#d4a94c" strokeWidth=".8" />
        </g>
      )}
      {decorId === 'arch' && (
        <g fill="none">
          <path d="M16 70V36q0-26 24-26t24 26v34" stroke="#6b1a2d" strokeWidth="5" />
          <path d="M16 70V36q0-26 24-26t24 26v34" stroke="#d4a94c" strokeWidth="1" />
          {[[20, 44], [18, 56], [60, 40], [62, 54], [40, 12], [30, 18], [50, 18]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="4" fill="#c4788a" stroke="#6b1a2d" strokeWidth=".8" />
          ))}
        </g>
      )}
      {decorId === 'fountain' && (
        <g stroke="#946a27" fill="#ecdcba">
          <ellipse cx="40" cy="62" rx="30" ry="8" />
          <ellipse cx="40" cy="60" rx="24" ry="5" fill="#9fc4d3" />
          <rect x="36" y="34" width="8" height="26" />
          <ellipse cx="40" cy="34" rx="12" ry="3.5" />
          <g stroke="#7fb0c4" strokeWidth="2" fill="none" className="anim-glow">
            <path d="M40 32q-8-14-16 4M40 32q8-14 16 4M40 32V18" />
          </g>
        </g>
      )}
    </svg>
  )
}
