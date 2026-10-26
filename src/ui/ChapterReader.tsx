import { motion } from 'framer-motion'
import Lumi from '@/art/Lumi'
import { Divider } from '@/art/Ornaments'
import { findArcChapter } from '@/characters/progress'
import CharacterArt from '@/characters/ui/CharacterArt'
import { CHAPTERS, WORLDS } from '@/game/data'
import { actions } from '@/game/store'
import Sheet from './Sheet'

export default function ChapterReader({ id, onClose }: { id: string | null; onClose: () => void }) {
  const world = CHAPTERS.find((c) => c.id === id)
  const arc = id ? findArcChapter(id) : undefined
  const open = !!(world || arc)
  const title = world?.title ?? arc?.title ?? ''
  const kicker = world ? WORLDS[world.world].name : arc ? `${arc.character.name} \u00B7 Chapter ${arc.n}` : ''
  const paragraphs = world?.paragraphs ?? arc?.text ?? []

  const close = () => {
    if (id && open) actions.readChapter(id)
    onClose()
  }
  return (
    <Sheet open={open} onClose={close} title={title}>
      {open && (
        <div>
          <p className="small-caps text-burgundy-600">{kicker}</p>
          <Divider className="my-3" />
          <div className="space-y-4 text-lg leading-relaxed text-ink-800">
            {paragraphs.map((p, i) => (
              <motion.p key={i} className={i === 0 ? 'drop-cap' : ''} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 + i * 0.5, duration: 0.7 }}>
                {p}
              </motion.p>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            {arc ? <CharacterArt char={arc.character} fit="contain" idle className="h-20 w-16" /> : <Lumi size={56} mood="happy" />}
            <button className="btn-primary" onClick={close}>Close the book</button>
          </div>
        </div>
      )}
    </Sheet>
  )
}
