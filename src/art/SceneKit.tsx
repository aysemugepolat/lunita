import type { ReactNode } from 'react'

export function rng(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

export function SceneSvg({ children, label }: { children: ReactNode; label: string }) {
  return (
    <svg viewBox="0 0 800 420" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" role="img" aria-label={label}>
      <defs>
        <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity=".18" strokeWidth="1.2" />
        </pattern>
        <pattern id="stipple" width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r=".7" fill="#000" fillOpacity=".25" />
          <circle cx="6" cy="6" r=".7" fill="#000" fillOpacity=".2" />
        </pattern>
        <filter id="soft"><feGaussianBlur stdDeviation="6" /></filter>
        <filter id="soft2"><feGaussianBlur stdDeviation="2" /></filter>
      </defs>
      {children}
    </svg>
  )
}

export function SkyGrad({ id, stops }: { id: string; stops: [string, string, string?] }) {
  return (
    <>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={stops[0]} />
          {stops[2] && <stop offset=".55" stopColor={stops[2]} />}
          <stop offset="1" stopColor={stops[1]} />
        </linearGradient>
      </defs>
      <rect width="800" height="420" fill={`url(#${id})`} />
    </>
  )
}

export function StarField({ count, seed = 7, maxY = 220, color = '#f7e7b3' }: { count: number; seed?: number; maxY?: number; color?: string }) {
  const r = rng(seed)
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = r() * 800
        const y = r() * maxY
        const s = 0.8 + r() * 1.8
        return <circle key={i} cx={x} cy={y} r={s} fill={color} className="anim-twinkle" style={{ animationDelay: `${(i % 7) * 0.45}s` }} />
      })}
    </g>
  )
}

export function Moon({ x, y, r, glow = 1 }: { x: number; y: number; r: number; glow?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r * 2.4} fill="#e6c677" opacity={0.12 * glow} filter="url(#soft)" />
      <circle cx={x} cy={y} r={r * 1.5} fill="#e6c677" opacity={0.14 * glow} />
      <circle cx={x} cy={y} r={r} fill="#f1dc9b" stroke="#946a27" strokeWidth="1.5" />
      <circle cx={x} cy={y} r={r * 0.82} fill="none" stroke="#946a27" strokeWidth=".6" strokeDasharray="2 3" />
      <circle cx={x - r * 0.3} cy={y - r * 0.2} r={r * 0.16} fill="#c9a04a" opacity=".5" />
      <circle cx={x + r * 0.28} cy={y + r * 0.3} r={r * 0.22} fill="#c9a04a" opacity=".4" />
      <circle cx={x + r * 0.1} cy={y - r * 0.45} r={r * 0.1} fill="#c9a04a" opacity=".5" />
      <path d={`M${x - r * 0.35} ${y + r * 0.05} q${r * 0.35} ${r * 0.28} ${r * 0.7} 0`} fill="none" stroke="#7d5a20" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx={x - r * 0.32} cy={y - r * 0.12} r={r * 0.04} fill="#7d5a20" />
      <circle cx={x + r * 0.32} cy={y - r * 0.12} r={r * 0.04} fill="#7d5a20" />
    </g>
  )
}

export function Ridge({ y, amp, fill, seed, hatch = true, freq = 0.012 }: { y: number; amp: number; fill: string; seed: number; hatch?: boolean; freq?: number }) {
  const r = rng(seed)
  const ph = r() * 6
  const ph2 = r() * 6
  const pts: string[] = []
  for (let x = 0; x <= 800; x += 20) {
    const yy = y + Math.sin(x * freq + ph) * amp + Math.sin(x * freq * 2.3 + ph2) * amp * 0.45
    pts.push(`${x},${yy.toFixed(1)}`)
  }
  const d = `M0,420 L${pts.join(' L')} L800,420Z`
  return (
    <g>
      <path d={d} fill={fill} />
      {hatch && <path d={d} fill="url(#hatch)" />}
    </g>
  )
}

export function Pine({ x, y, h, fill = '#150d0d' }: { x: number; y: number; h: number; fill?: string }) {
  const w = h * 0.34
  return (
    <g fill={fill}>
      <rect x={x - 1.5} y={y - h * 0.1} width="3" height={h * 0.12} />
      <path d={`M${x} ${y - h} L${x + w * 0.5} ${y - h * 0.62} L${x + w * 0.28} ${y - h * 0.62} L${x + w * 0.7} ${y - h * 0.3} L${x + w * 0.38} ${y - h * 0.3} L${x + w} ${y - h * 0.08} L${x - w} ${y - h * 0.08} L${x - w * 0.38} ${y - h * 0.3} L${x - w * 0.7} ${y - h * 0.3} L${x - w * 0.28} ${y - h * 0.62} L${x - w * 0.5} ${y - h * 0.62}Z`} />
    </g>
  )
}

export function Lantern({ x, y, lit, size = 1 }: { x: number; y: number; lit: boolean; size?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${size})`}>
      <line x1="0" y1="-30" x2="0" y2="-8" stroke="#946a27" strokeWidth="1.2" />
      {lit && <circle cy="4" r="28" fill="#f5cf72" opacity=".35" filter="url(#soft2)" className="anim-glow" />}
      <path d="M-6 -8h12l3 5v14l-3 4h-12l-3-4v-14z" fill={lit ? '#ffe8a3' : '#4a3a2c'} stroke="#d4a94c" strokeWidth="1.3" />
      <path d="M-3 -8v22M3 -8v22" stroke="#946a27" strokeWidth=".6" />
      <circle cy="-9" r="2" fill="#d4a94c" />
    </g>
  )
}

export function Fireflies({ count, seed = 3, area = [0, 180, 800, 420] as [number, number, number, number], color = '#f7e29a' }: { count: number; seed?: number; area?: [number, number, number, number]; color?: string }) {
  const r = rng(seed)
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const x = area[0] + r() * (area[2] - area[0])
        const y = area[1] + r() * (area[3] - area[1])
        return (
          <g key={i} className="anim-float" style={{ animationDelay: `${i * 0.37}s`, animationDuration: `${4 + (i % 4)}s` }}>
            <circle cx={x} cy={y} r="6" fill={color} opacity=".25" />
            <circle cx={x} cy={y} r="1.8" fill={color} className="anim-twinkle" style={{ animationDelay: `${i * 0.3}s` }} />
          </g>
        )
      })}
    </g>
  )
}

export function Mist({ y, opacity = 0.2, color = '#f4ead5' }: { y: number; opacity?: number; color?: string }) {
  return (
    <g className="anim-drift" opacity={opacity}>
      <ellipse cx="200" cy={y} rx="260" ry="26" fill={color} filter="url(#soft)" />
      <ellipse cx="620" cy={y + 18} rx="300" ry="22" fill={color} filter="url(#soft)" />
    </g>
  )
}
