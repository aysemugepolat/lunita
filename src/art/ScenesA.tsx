import { Fireflies, Lantern, Mist, Moon, Pine, Ridge, rng, SceneSvg, SkyGrad, StarField } from './SceneKit'

export function ForestScene({ stage }: { stage: number }) {
  const r = rng(11)
  const pines = Array.from({ length: 16 }, (_, i) => ({ x: 20 + i * 52 + r() * 22, h: 120 + r() * 90, y: 330 + r() * 18 }))
  const front = Array.from({ length: 7 }, (_, i) => ({ x: -10 + i * 140 + r() * 30, h: 240 + r() * 70 }))
  const lanterns = [
    [370, 188], [455, 205], [305, 220], [520, 178], [250, 190], [590, 215],
  ] as const
  return (
    <SceneSvg label="Whispering Forest at night with a golden moon and hanging lanterns">
      <SkyGrad id="fsky" stops={['#150a10', '#6b1a2d', '#3d0c18']} />
      <StarField count={40 + stage * 8} seed={4} maxY={200} />
      <Moon x={600} y={95} r={42} glow={0.6 + stage * 0.15} />
      <Ridge y={270} amp={26} fill="#2a0f19" seed={2} />
      {pines.map((p, i) => <Pine key={i} x={p.x} y={p.y} h={p.h} fill="#1b0b11" />)}
      <Mist y={300} opacity={0.14 + stage * 0.04} />
      <Ridge y={330} amp={18} fill="#150a0d" seed={9} freq={0.017} />
      {/* moss glow */}
      {stage >= 2 && (
        <g className="anim-glow">
          <ellipse cx="400" cy="372" rx="300" ry="16" fill="#9bb86a" opacity=".22" filter="url(#soft)" />
          <path d="M120 380q120-20 280-6t280 4" fill="none" stroke="#c8dc8b" strokeWidth="2" opacity=".5" strokeDasharray="1 7" strokeLinecap="round" />
        </g>
      )}
      {/* great oak */}
      <g fill="#0e0709">
        <path d="M388 420c4-60 2-100-6-150-30-14-70-40-90-84 30 20 62 30 92 36-6-36-24-64-48-90 34 14 52 40 62 76 10-40 34-70 70-90-22 26-34 56-38 92 28-6 62-18 86-40-14 40-48 68-92 84-8 50-6 100 4 166Z" />
      </g>
      <path d="M388 420c4-60 2-100-6-150" stroke="#946a27" strokeWidth="1" fill="none" opacity=".4" />
      {lanterns.map(([x, y], i) => <Lantern key={i} x={x} y={y} lit={i < stage + 1} size={0.9} />)}
      {front.map((p, i) => <Pine key={i} x={p.x} y={430} h={p.h} fill="#0a0507" />)}
      <Fireflies count={4 + stage * 5} seed={5} area={[60, 200, 760, 400]} />
    </SceneSvg>
  )
}

export function ForgeScene({ stage }: { stage: number }) {
  const r = rng(21)
  const embers = Array.from({ length: 6 + stage * 6 }, (_, i) => ({ x: 280 + r() * 240, y: 120 + r() * 220, s: 1 + r() * 2.2, d: i * 0.4 }))
  const glow = 0.35 + stage * 0.14
  return (
    <SceneSvg label="The Quest Forge, a burgundy stone cavern with a glowing anvil">
      <SkyGrad id="gsky" stops={['#1b0a10', '#4a1020', '#2d0b15']} />
      {/* constellation carvings on arch */}
      <g stroke="#d4a94c" strokeWidth="1" fill="#e6c677" opacity=".7">
        <polyline points="90,70 140,110 210,80 250,140" fill="none" />
        {[[90, 70], [140, 110], [210, 80], [250, 140]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" />)}
        <polyline points="560,60 620,100 690,70 730,130 700,190" fill="none" />
        {[[560, 60], [620, 100], [690, 70], [730, 130], [700, 190]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3" />)}
      </g>
      {/* arch */}
      <path d="M0 420V120Q0 0 400 0T800 120V420H690V170Q690 60 400 60T110 170V420Z" fill="#34101a" />
      <path d="M0 420V120Q0 0 400 0T800 120V420H690V170Q690 60 400 60T110 170V420Z" fill="url(#hatch)" />
      {/* forge mouth glow */}
      <ellipse cx="400" cy="300" rx="190" ry="130" fill="#ff9a3c" opacity={glow * 0.5} filter="url(#soft)" className="anim-glow" />
      <path d="M270 420V270Q400 150 530 270V420Z" fill="#1a0709" />
      <path d="M285 420V280Q400 175 515 280V420Z" fill={`rgba(255,150,60,${0.15 + stage * 0.1})`} />
      {/* fire */}
      <g className="anim-glow">
        <path d="M360 400c-10-40 14-48 8-80 24 20 22 44 32 36 6-24 22-30 20-56 24 26 36 60 12 100Z" fill="#ff8a2a" opacity={0.7 + stage * 0.06} />
        <path d="M380 400c-4-24 8-30 6-52 16 14 22 34 14 52Z" fill="#ffd66b" />
      </g>
      {/* anvil */}
      <g fill="#0f0709" stroke="#946a27" strokeWidth="1">
        <path d="M300 378h200l-10-22H350c-28 0-44-10-52-26h-30c0 30 22 46 50 48Z" />
        <rect x="350" y="378" width="100" height="16" />
        <path d="M335 394h130l12 26H323Z" />
      </g>
      {/* crescent hammer */}
      {stage >= 2 && (
        <g transform="translate(520 300) rotate(-24)">
          <rect x="-3" y="-4" width="6" height="70" fill="#7d5a20" />
          <path d="M-22 -18a22 22 0 1 0 44 0 16 16 0 0 1-44 0Z" fill="#d4a94c" stroke="#946a27" />
        </g>
      )}
      {embers.map((e, i) => (
        <circle key={i} cx={e.x} cy={e.y} r={e.s} fill="#ffb347" className="anim-twinkle" style={{ animationDelay: `${e.d}s` }} />
      ))}
      <path d="M0 420V400Q200 380 400 400T800 400V420Z" fill="#150709" />
    </SceneSvg>
  )
}
