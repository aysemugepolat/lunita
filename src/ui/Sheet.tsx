import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  side?: 'center' | 'right'
  dark?: boolean
  wide?: boolean
}

export default function Sheet({ open, onClose, title, children, side = 'center', dark = false, wide = false }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  const right = side === 'right'
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={`fixed inset-0 z-[60] flex bg-ink-900/55 backdrop-blur-[2px] ${right ? 'justify-end' : 'items-center justify-center p-4'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`${dark ? 'page-dark' : 'page'} flex max-h-[100dvh] flex-col ${right ? 'h-dvh w-full max-w-md !rounded-none' : 'max-h-[90dvh] w-full ' + (wide ? 'max-w-3xl' : 'max-w-lg')}`}
            initial={right ? { x: '100%' } : { y: 30, opacity: 0 }}
            animate={right ? { x: 0 } : { y: 0, opacity: 1 }}
            exit={right ? { x: '100%' } : { y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          >
            <div className="flex items-center justify-between gap-3 px-6 pb-2 pt-5">
              <h2 className={`font-display text-2xl font-semibold ${dark ? 'text-ivory-100' : 'text-burgundy-700'}`}>{title}</h2>
              <button onClick={onClose} className={`grid h-11 w-11 place-items-center rounded-full border ${dark ? 'border-gold-400/60 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700'}`} aria-label="Close">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6">{children}</div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
