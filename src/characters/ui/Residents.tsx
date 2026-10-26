import { useState } from 'react'
import { BookOpen, Gift, Hammer, MessageCircle, Scroll, Wand2 } from 'lucide-react'
import { STORY_PROMPTS, WORLDS } from '@/game/data'
import { shrink } from '@/game/lumi'
import { actions, useGame } from '@/game/store'
import type { WorldId } from '@/game/types'
import { useNav } from '@/ui/nav'
import { residentsOf, ROLE_LABEL } from '../index'
import { nextUnreadChapter } from '../progress'
import type { Character } from '../types'
import Bubble from './Bubble'
import PortraitCard from './PortraitCard'

function Resident({ c }: { c: Character }) {
  const { save } = useGame()
  const nav = useNav()
  const met = !!save.charUnlocked[c.id]
  const [n, setN] = useState(0)
  const [override, setOverride] = useState<string | null>(null)
  const line = override ?? c.talk[n % c.talk.length]
  const story = nextUnreadChapter(save, c)
  const talk = () => {
    setOverride(null)
    setN((v) => v + 1)
  }

  const askQuest = () => {
    const active = new Set(save.quests.filter((q) => !q.completedAt).map((q) => q.title))
    const idx = STORY_PROMPTS.findIndex((p) => !active.has(p.title))
    if (idx < 0) {
      setOverride('You are already carrying all of mine. Finish one, then come back.')
      return
    }
    actions.acceptStory(idx)
    setOverride(`I left "${STORY_PROMPTS[idx].title}" in your journal. Only if it feels light.`)
  }

  const shrinkNext = () => {
    const q = save.quests.find((x) => !x.completedAt && x.steps.some((s) => !s.done))
    const st = q?.steps.find((s) => !s.done)
    if (!q || !st) {
      setOverride('Nothing heavy on the anvil right now. Lovely.')
      return
    }
    actions.shrinkStep(q.id, st.id, shrink(st.text))
    setOverride('There. Cut down to size. Try the first piece.')
  }

  return (
    <li className="grid grid-cols-[104px_1fr] items-start gap-4 sm:grid-cols-[130px_1fr]">
      <div>
        <PortraitCard char={c} locked={!met} bond={save.charBond[c.id] ?? 0} size="sm" idle onClick={() => nav.openCharacter(c.id)} />
      </div>
      <div className="min-w-0 space-y-2.5 pt-1">
        <div>
          <p className="font-display text-xl font-semibold leading-tight text-ink-800 sm:text-2xl">{met ? c.name : 'Someone is waiting here'}</p>
          <p className="small-caps text-xs text-burgundy-600">{met ? `${ROLE_LABEL[c.role]} \u00B7 ${c.roleBlurb}` : c.hint}</p>
        </div>
        {met && (
          <>
            <Bubble text={line} id={`${c.id}-${n}-${override ?? ''}`} tail="left" className="!ml-2" />
            <div className="flex flex-wrap gap-1.5 pt-1">
              <button className="btn-ghost !min-h-[44px] !px-3 !text-base" onClick={talk}><MessageCircle size={16} /> Talk</button>
              {c.role === 'questgiver' && <button className="btn-primary !min-h-[44px] !px-3 !text-base" onClick={askQuest}><Scroll size={16} /> Gentle quest</button>}
              {c.role === 'mentor' && <button className="btn-primary !min-h-[44px] !px-3 !text-base" onClick={shrinkNext}><Hammer size={16} /> Shrink my next step</button>}
              {c.role === 'guide' && <button className="btn-primary !min-h-[44px] !px-3 !text-base" onClick={() => nav.openLumi()}><Wand2 size={16} /> Break down a task</button>}
              {c.role === 'keeper' && <button className="btn-primary !min-h-[44px] !px-3 !text-base" onClick={() => nav.openCharacter(c.id)}><Gift size={16} /> Gifts</button>}
              {story && (
                <button className="btn-ghost !min-h-[44px] !px-3 !text-base" onClick={() => nav.openChapter(story.id)}>
                  <BookOpen size={16} /> {c.role === 'storyteller' ? 'Hear a bedtime tale' : 'Their story'}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  )
}

/** Characters who live in this world, shown as NPCs with dialogue and a gentle role action. */
export default function Residents({ world }: { world: WorldId }) {
  const list = residentsOf(world)
  return (
    <section className="page p-5 sm:p-6">
      <p className="small-caps text-burgundy-600">Who lives here</p>
      <h2 className="font-display text-3xl font-semibold text-burgundy-700">Friends of {WORLDS[world].short}</h2>
      <ul className="mt-4 space-y-6">
        {list.map((c) => <Resident key={c.id} c={c} />)}
      </ul>
    </section>
  )
}
