import Residents from '@/characters/ui/Residents'
import { useState } from 'react'
import { Check, Lock } from 'lucide-react'
import Traveller from '@/art/Traveller'
import { Star } from '@/art/Ornaments'
import GameShell from '@/games/GameShell'
import MoonBreath from '@/games/MoonBreath'
import { recordWin } from '@/games/session'
import { COSMETICS, MOODS } from '@/game/data'
import { actions, levelFor, useGame } from '@/game/store'
import type { Avatar } from '@/game/types'
import WorldHeader, { Chapters } from './WorldHeader'

const SLOTS: { id: keyof Avatar; label: string }[] = [
  { id: 'cloak', label: 'Cloak' },
  { id: 'trim', label: 'Trim' },
  { id: 'hat', label: 'Headwear' },
  { id: 'aura', label: 'Aura' },
  { id: 'charm', label: 'Charm' },
]

function Wardrobe() {
  const { save } = useGame()
  const [slot, setSlot] = useState<keyof Avatar>('cloak')
  const lvl = levelFor(save.xp)
  const items = COSMETICS.filter((c) => c.slot === slot)
  return (
    <section className="page p-5 sm:p-6">
      <p className="small-caps text-burgundy-600">Wardrobe of stars</p>
      <h2 className="font-display text-3xl font-semibold text-burgundy-700">Dress your traveller</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-[200px_1fr]">
        <div className="grid place-items-center rounded-[3px] border border-gold-500/50 bg-gradient-to-b from-burgundy-800 to-ink-900 p-3">
          <Traveller avatar={save.avatar} size={150} />
          <p className="font-display text-xl font-semibold text-ivory-100">{save.name}</p>
        </div>
        <div>
          <div className="flex flex-wrap gap-1.5" role="tablist">
            {SLOTS.map((s) => (
              <button key={s.id} role="tab" aria-selected={slot === s.id} onClick={() => setSlot(s.id)} className={`min-h-[40px] rounded-full border px-3 text-sm ${slot === s.id ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700'}`}>
                {s.label}
              </button>
            ))}
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {items.map((c) => {
              const owned = save.owned.includes(c.id)
              const equipped = save.avatar[c.slot] === c.value
              const tooLow = lvl < c.level
              return (
                <li key={c.id}>
                  <button
                    disabled={!owned && (tooLow || save.stardust < c.cost)}
                    onClick={() => (owned ? actions.equip(c.id) : (actions.buyCosmetic(c.id), actions.equip(c.id)))}
                    className={`flex min-h-[56px] w-full items-center gap-2 rounded-[3px] border p-2 text-left ${equipped ? 'border-burgundy-700 bg-burgundy-700/10' : 'border-gold-500/50 bg-ivory-50'} disabled:opacity-50`}
                  >
                    <span className="h-7 w-7 shrink-0 rounded-full border border-ink-800/40" style={{ background: c.value.startsWith('#') ? c.value : 'conic-gradient(#d4a94c, #6b1a2d, #d4a94c)' }} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display text-lg font-semibold leading-tight text-ink-800">{c.name}</span>
                      <span className="block text-xs text-ink-700/75">
                        {equipped ? 'Wearing' : owned ? 'Owned' : tooLow ? `Level ${c.level}` : `${c.cost} stardust`}
                      </span>
                    </span>
                    {equipped ? <Check size={18} className="text-burgundy-700" /> : !owned && tooLow ? <Lock size={14} className="text-ink-700/50" /> : !owned ? <Star size={14} color="#b8893a" /> : null}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}

function Reflection() {
  const { save } = useGame()
  const [mood, setMood] = useState(MOODS[0])
  const [text, setText] = useState('')
  return (
    <section className="page p-5 sm:p-6">
      <p className="small-caps text-burgundy-600">Quiet page</p>
      <h2 className="font-display text-3xl font-semibold text-burgundy-700">How does today feel?</h2>
      <div className="mt-3 flex flex-wrap gap-1.5" role="radiogroup" aria-label="Mood">
        {MOODS.map((m) => (
          <button key={m} role="radio" aria-checked={mood === m} onClick={() => setMood(m)} className={`min-h-[40px] rounded-full border px-3.5 ${mood === m ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-burgundy-600/40 text-burgundy-700'}`}>{m}</button>
        ))}
      </div>
      <textarea className="input-field mt-3 min-h-[96px] resize-y" placeholder="One line is plenty. What happened, or what you are grateful for." value={text} maxLength={280} onChange={(e) => setText(e.target.value)} aria-label="Reflection" />
      <button className="btn-primary mt-3" disabled={!text.trim()} onClick={() => { actions.reflect(mood, text); setText('') }}>Keep this page</button>
      {save.reflections.length > 0 && (
        <ul className="mt-5 space-y-2">
          {save.reflections.slice(0, 4).map((r) => (
            <li key={r.id} className="border-l-2 border-gold-500 pl-3">
              <p className="small-caps text-xs text-burgundy-600">{r.mood} &middot; {new Date(r.at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
              <p className="text-ink-800">{r.text}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function Sanctuary() {
  return (
    <div className="space-y-6">
      <WorldHeader world="sanctuary" />
      <div className="grid gap-6 lg:grid-cols-2">
        <GameShell
          dark
          gameId="moon"
          intro="Follow the glowing moon. Breathe in as it grows, out as it settles. Finish for a Moon Opal."
          howTo={['Choose a pattern and how many breaths.', 'Breathe in while the moon grows, out while it settles.', 'Every breath lights a star. Stop any time.']}
        >
          <MoonBreath onDone={(n) => { recordWin(); actions.breathDone(n) }} />
        </GameShell>
        <Reflection />
      </div>
      <Wardrobe />
      <Chapters world="sanctuary" />
      <Residents world="sanctuary" />
    </div>
  )
}
