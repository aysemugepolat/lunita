import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  /** Bubble content. Falsy hides it. */
  text?: string | null
  /** Used to re-run the entrance animation when a new line arrives. */
  id?: string | number
  /** Where the tail points. */
  tail?: 'bottom-right' | 'bottom-left' | 'left'
  className?: string
}

/** Parchment speech bubble with a gold border. */
export default function Bubble({ text, id, tail = 'bottom-right', className = '' }: Props) {
  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={id ?? text}
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 8, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          className={`relative rounded-[3px] border border-gold-500 bg-ivory-50 px-3.5 py-2.5 font-body text-[1.02rem] leading-snug text-ink-800 shadow-page ${className}`}
        >
          {text}
          <span
            aria-hidden
            className={`absolute h-3 w-3 rotate-45 border-gold-500 bg-ivory-50 ${
              tail === 'bottom-right' ? '-bottom-[7px] right-8 border-b border-r' : tail === 'bottom-left' ? '-bottom-[7px] left-8 border-b border-r' : '-left-[7px] top-5 border-b border-l'
            }`}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
