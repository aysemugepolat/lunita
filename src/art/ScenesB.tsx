import { Fireflies, Mist, Moon, Ridge, rng, SceneSvg, SkyGrad, StarField } from './SceneKit'

export function IslandScene({ stage, progress = 0, voyage = false }: { stage: number; progress?: number; voyage?: boolean }) {
  const boatX = 120 + progress * 480
  const boatY = 322 + Math.sin(progress * 18) * 3
  const stones = Array.from({ length: 8 }, (_, i) => ({ x: 130 + i * 62, y: 354 + (i % 2) * 6 }))
  return (
    <SceneSvg label="Focus Island at dusk with a lighthouse, calm sea and a small boat">
      <SkyGrad id="isky" stops={['#2a1020', '#8a3a4a', '#5a1a30']} />
      <StarField count={20 + stage * 10} seed={13} maxY={170} />
      <Moon x={150} y={90} r={34} glow={0.5 + stage * 0.15} />
      <Ridge y={262} amp={10} fill="#4b1526" seed={3} />
      {/* sea */}
      <rect y="272" width="800" height="150" fill="#30101e" />
      <rect y="272" width="800" height="150" fill="url(#hatch)" />
      <g stroke="#d4a94c" strokeOpacity=".35" strokeWidth="1" fill="none">
        {Array.from({ length: 9 }, (_, i) => (
          <path key={i} className="anim-wave" d={`M${-80 + (i % 3) * 30} ${290 + i * 14} q20 -7 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} />
        ))}
      </g>
      {/* moon path on water */}
      <path d="M150 280L120 420H190Z" fill="#f1dc9b" opacity=".12" />
      {/* island */}
      <path d="M520 290q40-60 120-60t120 60q-80 14-120 14t-120-14Z" fill="#1a0a10" />
      <path d="M520 290q40-60 120-60t120 60q-80 14-120 14t-120-14Z" fill="url(#hatch)" />
      {/* lighthouse */}
      <g>
        <path d="M628 236l-6 -70h36l-6 70Z" fill="#f4ead5" stroke="#6b1a2d" strokeWidth="1.5" />
        <path d="M624 200h28M626 218h24" stroke="#6b1a2d" strokeWidth="5" />
        <rect x="620" y="150" width="40" height="16" fill="#3d0c18" stroke="#d4a94c" />
        <path d="M618 150l22-24 22 24Z" fill="#6b1a2d" stroke="#d4a94c" />
        <circle cx="640" cy="158" r="5" fill="#ffe8a3" className="anim-glow" />
        {stage >= 1 && <path d="M640 158L40 120V200Z" fill="#ffe8a3" opacity={0.08 + stage * 0.03} className="anim-glow" />}
      </g>
      {/* tide bell */}
      <g transform="translate(700 238)">
        <path d="M-10 0V-22h20V0" fill="none" stroke="#d4a94c" strokeWidth="2" />
        <path d="M-6 -20q6-12 12 0Z" fill="#d4a94c" />
      </g>
      {/* stepping stones, one lit per stage */}
      {stones.map((s, i) => (
        <ellipse key={i} cx={s.x} cy={s.y} rx="18" ry="5" fill={i < stage * 2 ? '#e6c677' : '#3b1626'} opacity={i < stage * 2 ? 0.9 : 0.7} stroke="#946a27" strokeWidth=".6" />
      ))}
      {/* boat */}
      <g transform={`translate(${voyage ? boatX : 330} ${voyage ? boatY : 322})`} className={voyage ? '' : 'anim-float'}>
        <path d="M-30 0h60l-10 16h-40Z" fill="#6b1a2d" stroke="#e6c677" strokeWidth="1.5" />
        <line x1="0" y1="0" x2="0" y2="-44" stroke="#e6c677" strokeWidth="1.5" />
        <path d="M2 -42q26 14 22 36H2Z" fill="#f4ead5" stroke="#946a27" />
        <path d="M-2 -38q-18 10-16 30h16Z" fill="#ecdcba" stroke="#946a27" />
        <circle cx="0" cy="-46" r="3" fill="#ffe8a3" className="anim-glow" />
      </g>
      <Mist y={300} opacity={0.12} />
    </SceneSvg>
  )
}

export function GardenScene({ stage }: { stage: number }) {
  const r = rng(31)
  const blooms = Array.from({ length: 6 + stage * 9 }, () => ({ x: r() * 800, y: 330 + r() * 80, c: ['#c4788a', '#e6c677', '#f4ead5', '#9a3a52'][Math.floor(r() * 4)], s: 4 + r() * 5 }))
  return (
    <SceneSvg label="Blooming Garden at dawn with hedges, flowers and a fountain">
      <SkyGrad id="gasky" stops={['#f1d9a5', '#f7ecd2', '#e9b98f']} />
      <g opacity=".85" transform="translate(400 160)">
        <g className="anim-spin-slow">
          {Array.from({ length: 20 }, (_, i) => <path key={i} d="M0 -62L4 -118L0 -126L-4 -118Z" fill="#d4a94c" opacity=".5" transform={`rotate(${i * 18})`} />)}
        </g>
        <circle r="46" fill="#f3d78a" stroke="#b8893a" strokeWidth="2" />
        <circle r="38" fill="none" stroke="#b8893a" strokeWidth=".8" strokeDasharray="2 3" />
      </g>
      <Ridge y={290} amp={20} fill="#c9ae71" seed={5} />
      <Ridge y={320} amp={14} fill="#7f8f5a" seed={17} freq={0.02} />
      {/* hedge row */}
      <path d="M0 360V330q30-18 60 0t60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0V360Z" fill="#43552f" />
      <path d="M0 360V330q30-18 60 0t60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0 60 0V360Z" fill="url(#hatch)" />
      {/* arch */}
      <path d="M300 360V270q100-80 200 0v90" fill="none" stroke="#6b1a2d" strokeWidth="9" />
      <path d="M300 360V270q100-80 200 0v90" fill="none" stroke="#d4a94c" strokeWidth="1.5" />
      {/* fountain */}
      <g transform="translate(400 352)">
        <ellipse rx="64" ry="12" fill="#ecdcba" stroke="#946a27" />
        <ellipse rx="52" ry="8" fill={stage >= 3 ? '#9fc4d3' : '#cdb98a'} />
        <rect x="-6" y="-38" width="12" height="38" fill="#ecdcba" stroke="#946a27" />
        <ellipse cy="-38" rx="22" ry="5" fill="#ecdcba" stroke="#946a27" />
        {stage >= 3 && (
          <g stroke="#7fb0c4" strokeWidth="2" fill="none" className="anim-glow">
            <path d="M0 -42q-14 -22 -26 6M0 -42q14 -22 26 6M0 -42v-24" />
          </g>
        )}
      </g>
      {blooms.map((b, i) => (
        <g key={i} className="anim-sway" style={{ animationDelay: `${i * 0.2}s` }}>
          <line x1={b.x} y1={b.y} x2={b.x} y2={b.y + 14} stroke="#43552f" strokeWidth="1.5" />
          <circle cx={b.x} cy={b.y} r={b.s} fill={b.c} stroke="#6b1a2d" strokeWidth=".6" />
          <circle cx={b.x} cy={b.y} r={b.s * 0.3} fill="#b8893a" />
        </g>
      ))}
      <Fireflies count={stage * 2} seed={2} area={[40, 200, 760, 360]} color="#fff2b5" />
    </SceneSvg>
  )
}

export function SanctuaryScene({ stage }: { stage: number }) {
  const windows = [[400, 190], [400, 240], [400, 290], [400, 340], [400, 140]]
  return (
    <SceneSvg label="Moonlight Sanctuary, a white tower beneath a great moon">
      <SkyGrad id="ssky" stops={['#0f0a16', '#4a1530', '#25102a']} />
      <StarField count={50 + stage * 10} seed={19} maxY={260} />
      <Moon x={400} y={150} r={96} glow={0.7 + stage * 0.1} />
      {/* clouds */}
      <g fill="#6a3a55" opacity=".5" className="anim-drift">
        <ellipse cx="160" cy="250" rx="130" ry="18" />
        <ellipse cx="660" cy="220" rx="140" ry="16" />
      </g>
      <Ridge y={330} amp={16} fill="#1c0c18" seed={7} />
      {/* tower */}
      <g>
        <path d="M360 400V230q0-70 40-96 40 26 40 96V400Z" fill="#f4ead5" stroke="#6b1a2d" strokeWidth="2" />
        <path d="M360 400V230q0-70 40-96 40 26 40 96V400Z" fill="url(#hatch)" opacity=".7" />
        <path d="M385 134l15-26 15 26Z" fill="#6b1a2d" stroke="#d4a94c" />
        {windows.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="11" fill={i <= stage ? '#ffe8a3' : '#3d0c18'} stroke="#946a27" strokeWidth="1.5" />
            {i <= stage && <circle cx={x} cy={y} r="22" fill="#ffe8a3" opacity=".25" filter="url(#soft2)" className="anim-glow" />}
          </g>
        ))}
        <path d="M372 400v-26a28 28 0 0 1 56 0v26Z" fill="#3d0c18" stroke="#946a27" />
      </g>
      <path d="M0 400Q200 380 400 396T800 394V420H0Z" fill="#0d0710" />
      <Fireflies count={stage * 3} seed={8} area={[60, 250, 740, 400]} color="#e8e0ff" />
    </SceneSvg>
  )
}
