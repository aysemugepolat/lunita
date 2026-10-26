import { Gem, Star } from '@/art/Ornaments'
import { levelProgress, totalCrystals, useGame } from '@/game/store'

export default function Hud() {
  const { save } = useGame()
  const lp = levelProgress(save.xp)
  const pct = Math.min(100, Math.round((lp.into / lp.span) * 100))
  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <div className="flex items-center gap-2" title={`${lp.into} of ${lp.span} XP to the next level`}>
        <div className="relative grid h-10 w-10 place-items-center rounded-full border border-gold-400 bg-burgundy-700 sm:h-11 sm:w-11 font-display text-lg font-bold text-ivory-100 shadow-gold" aria-label={`Level ${lp.level}`}>
          <svg className="absolute inset-0" viewBox="0 0 44 44" aria-hidden>
            <circle cx="22" cy="22" r="19.5" fill="none" stroke="rgba(230,198,119,.25)" strokeWidth="2" />
            <circle cx="22" cy="22" r="19.5" fill="none" stroke="#e6c677" strokeWidth="2" strokeLinecap="round" strokeDasharray={`${(pct / 100) * 122.5} 122.5`} transform="rotate(-90 22 22)" style={{ transition: 'stroke-dasharray .8s ease' }} />
          </svg>
          <span className="relative">{lp.level}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 rounded-full border border-gold-500/60 bg-ivory-50/80 px-2 py-1.5 font-display text-base sm:gap-1.5 sm:px-3 sm:text-lg font-bold text-burgundy-700 tabular-nums" title="Stardust">
        <Star size={14} color="#b8893a" />
        {save.stardust}
      </div>
      <div className="flex items-center gap-1 rounded-full border border-gold-500/60 bg-ivory-50/80 px-2 py-1.5 font-display text-base sm:gap-1.5 sm:px-3 sm:text-lg font-bold text-burgundy-700 tabular-nums" title="Crystals gathered">
        <Gem size={18} hue="#7d2a40" />
        {totalCrystals(save)}
      </div>
    </div>
  )
}
