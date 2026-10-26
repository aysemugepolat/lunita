import { useState } from 'react'
import { motion } from 'framer-motion'
import { Repeat2 } from 'lucide-react'
import { Crescent, Divider, Sparkles, Star } from '@/art/Ornaments'
import { CHARACTERS, getCharacter } from '@/characters'
import PortraitCard from '@/characters/ui/PortraitCard'
import { WORLDS, WORLD_ORDER } from '@/game/data'
import { useGame } from '@/game/store'
import type { WorldId } from '@/game/types'
import { useNav } from '@/ui/nav'

export default function Library() {
  const { save } = useGame()
  const nav = useNav()
  const [world, setWorld] = useState<WorldId | 'all'>('all')
  const met = CHARACTERS.filter((c) => save.charUnlocked[c.id]).length
  const list = CHARACTERS.filter((c) => world === 'all' || c.home === world)
  const companion = getCharacter(save.companion)

  return (
    <div className="space-y-6">
      <section className="page-dark relative overflow-hidden px-5 py-8 text-center sm:py-10">
        <Sparkles count={8} color="#e6c677" />
        <div className="relative">
          <p className="small-caps flex items-center justify-center gap-2 text-gold-300"><Crescent size={16} /> The Sanctum Library <Star size={10} /></p>
          <h1 className="mt-1 font-display text-4xl font-semibold text-ivory-100 sm:text-5xl">Friends of the Realm</h1>
          <Divider className="my-3 !text-gold-300" />
          <p className="mx-auto max-w-xl text-ivory-200/90">
            Every friend you meet is kept here. They are found through the stories you read and the quests you finish, never through grinding. {met} of {CHARACTERS.length} met.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button className="btn-gold" onClick={() => nav.openCompanions()}><Repeat2 size={18} /> Travel companion{companion ? `: ${companion.name}` : ''}</button>
          </div>
        </div>
      </section>

      <div className="scrollbar-none flex gap-1.5 overflow-x-auto pb-1" role="tablist" aria-label="Filter by world">
        {(['all', ...WORLD_ORDER] as const).map((w) => (
          <button
            key={w}
            role="tab"
            aria-selected={world === w}
            onClick={() => setWorld(w)}
            className={`min-h-[44px] shrink-0 rounded-full border px-4 ${world === w ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700 hover:bg-burgundy-600/10'}`}
          >
            {w === 'all' ? 'Everyone' : WORLDS[w].short}
          </button>
        ))}
      </div>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-5">
        {list.map((c, i) => {
          const locked = !save.charUnlocked[c.id]
          return (
            <motion.li key={c.id} layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <PortraitCard char={c} locked={locked} bond={save.charBond[c.id] ?? 0} isCompanion={save.companion === c.id} onClick={() => nav.openCharacter(c.id)} />
              {locked && <p className="mt-2 text-center text-sm italic text-ink-700/80">{c.hint}</p>}
            </motion.li>
          )
        })}
      </ul>
    </div>
  )
}
