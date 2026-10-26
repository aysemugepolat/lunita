import { motion } from 'framer-motion'
import { Star } from '@/art/Ornaments'
import { useGame } from '@/game/store'

/** A soft burst of stars. Remount with a new `burstKey` to replay. Skipped entirely in calm mode. */
export default function Sparkle({ burstKey, color = '#e6c677', count = 9 }: { burstKey: string | number; color?: string; count?: number }) {
  const { save } = useGame()
  if (save.settings.calm) return null
  return (
    <div key={burstKey} className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {Array.from({ length: count }, (_, i) => {
        const a = (i / count) * Math.PI * 2 + (i % 2) * 0.3
        const r = 46 + (i % 3) * 14
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.3 }}
            animate={{ opacity: [0, 1, 0], x: Math.cos(a) * r, y: Math.sin(a) * r - 14, scale: [0.3, 1, 0.6] }}
            transition={{ duration: 1.4, delay: i * 0.04, ease: 'easeOut' }}
          >
            <Star size={8 + (i % 3) * 4} color={color} />
          </motion.span>
        )
      })}
    </div>
  )
}
