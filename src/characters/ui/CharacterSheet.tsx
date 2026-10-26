import { BookOpen, Check, Gift, Heart, Lock, Map as MapIcon } from 'lucide-react'
import { Divider } from '@/art/Ornaments'
import { DECOR, PLANTS, WORLDS, COSMETICS } from '@/game/data'
import { actions, useGame } from '@/game/store'
import { useNav } from '@/ui/nav'
import Sheet from '@/ui/Sheet'
import { BOND_AT, BOND_MAX, BOND_NAMES, bondProgress, giftKey } from '../bond'
import { getCharacter, ROLE_LABEL } from '../index'
import { arcStatus } from '../progress'
import type { Character } from '../types'
import PortraitCard from './PortraitCard'

function giftLabel(c: Character, level: number): string {
  const raw = level === 3 || level === 5 ? c.giftItems?.[level] : undefined
  if (!raw) return level === 2 ? 'A little stardust' : level === 4 ? 'More stardust' : 'A bundle of thanks'
  const [kind, id] = raw.split(':')
  if (kind === 'cosmetic') return `${COSMETICS.find((x) => x.id === id)?.name ?? id} (wardrobe)`
  if (kind === 'plant') return `${PLANTS.find((x) => x.id === id)?.name ?? id} seed`
  return DECOR.find((x) => x.id === id)?.name ?? id
}

export default function CharacterSheet({ id, onClose }: { id: string | null; onClose: () => void }) {
  const { save } = useGame()
  const nav = useNav()
  const c = id ? getCharacter(id) : undefined
  const met = !!c && !!save.charUnlocked[c.id]
  const points = c ? (save.charBond[c.id] ?? 0) : 0
  const bp = bondProgress(points)
  const arc = c ? arcStatus(save, c) : []

  return (
    <Sheet open={!!c} onClose={onClose} title={c ? (met ? c.name : 'An unmet friend') : ''} wide>
      {c && (
        <div className="grid gap-5 sm:grid-cols-[210px_1fr]">
          <div className="mx-auto w-[210px] max-w-full sm:mx-0">
            <PortraitCard char={c} locked={!met} bond={points} isCompanion={save.companion === c.id} size="lg" idle />
          </div>

          <div className="min-w-0 space-y-4">
            {!met ? (
              <div>
                <p className="small-caps text-burgundy-600">Lives in {WORLDS[c.home].name}</p>
                <p className="mt-2 text-lg text-ink-800">Someone is waiting to meet you here.</p>
                <p className="mt-1 flex items-center gap-2 text-ink-700"><Lock size={16} /> {c.hint}</p>
              </div>
            ) : (
              <>
                <div>
                  <p className="small-caps text-burgundy-600">{c.title}</p>
                  <p className="text-ink-700/85">{ROLE_LABEL[c.role]} &middot; {WORLDS[c.home].name}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {c.personality.map((p) => <li key={p} className="rounded-full border border-gold-500/60 bg-ivory-50 px-3 py-0.5 text-sm text-burgundy-700">{p}</li>)}
                  </ul>
                </div>
                <p className="drop-cap text-lg leading-relaxed text-ink-800">{c.backstory}</p>
                <blockquote className="border-l-2 border-gold-500 pl-3 font-display text-2xl italic leading-snug text-burgundy-700">&ldquo;{c.quote}&rdquo;</blockquote>

                <div>
                  <p className="flex items-center justify-between font-display text-xl font-semibold text-ink-800">
                    <span className="flex items-center gap-2"><Heart size={18} className="fill-burgundy-600 text-burgundy-600" /> {BOND_NAMES[bp.level - 1]}</span>
                    <span className="small-caps text-sm text-ink-700/80">Bond {bp.level} of {BOND_MAX}</span>
                  </p>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full border border-gold-500/60 bg-ivory-200">
                    <div className="h-full bg-gradient-to-r from-burgundy-600 to-gold-400 transition-[width] duration-700" style={{ width: `${bp.maxed ? 100 : (bp.into / bp.span) * 100}%` }} />
                  </div>
                  <p className="mt-1 text-sm italic text-ink-700/80">{bp.maxed ? 'A bond that will never fade.' : `${BOND_AT[bp.level] - points} more shared moments to the next bond. Bonds never fade.`}</p>
                </div>

                <div>
                  <p className="small-caps text-burgundy-600">Gifts</p>
                  <ul className="mt-1.5 space-y-1.5">
                    {[2, 3, 4, 5].map((lvl) => {
                      const claimed = save.giftsClaimed.includes(giftKey(c.id, lvl))
                      const ready = bp.level >= lvl
                      return (
                        <li key={lvl} className="flex min-h-[48px] items-center gap-3 rounded-[3px] border border-gold-500/40 bg-ivory-50/70 px-3 py-1.5">
                          <Gift size={18} className={ready ? 'text-burgundy-600' : 'text-ink-700/35'} />
                          <span className={`min-w-0 flex-1 ${ready ? 'text-ink-800' : 'text-ink-700/55'}`}>
                            {giftLabel(c, lvl)}
                            <span className="small-caps ml-2 text-xs">bond {lvl}</span>
                          </span>
                          {claimed ? <Check size={18} className="text-burgundy-600" aria-label="Received" /> : ready ? (
                            <button className="btn-primary !min-h-[40px] !px-3 !text-base" onClick={() => actions.claimGift(c.id, lvl)}>Receive</button>
                          ) : <Lock size={14} className="text-ink-700/40" />}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                <div>
                  <p className="small-caps text-burgundy-600">Their story</p>
                  <ol className="mt-1.5 space-y-1.5">
                    {arc.map((a) => (
                      <li key={a.id}>
                        <button
                          disabled={!a.open}
                          onClick={() => nav.openChapter(a.id)}
                          className={`flex min-h-[52px] w-full items-center gap-3 rounded-[3px] border px-3 text-left ${a.open ? 'border-gold-500/60 bg-ivory-50 hover:bg-ivory-200/60' : 'border-dashed border-ink-700/25 opacity-65'}`}
                        >
                          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-burgundy-600/50 font-display font-bold text-burgundy-700">{a.n}</span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-display text-lg font-semibold leading-tight text-ink-800">{a.open ? a.title : 'A page still sleeping'}</span>
                            <span className="block text-xs text-ink-700/75">{a.open ? (a.read ? 'Read' : 'Ready to read') : `Opens at bond ${a.needsLevel}`}</span>
                          </span>
                          {a.open ? <BookOpen size={17} className={a.read ? 'text-ink-700/40' : 'text-burgundy-600'} /> : <Lock size={15} className="text-ink-700/40" />}
                        </button>
                      </li>
                    ))}
                  </ol>
                </div>

                <Divider />
                <div className="flex flex-wrap gap-2">
                  <button className="btn-primary" disabled={save.companion === c.id} onClick={() => actions.setCompanion(c.id)}>
                    {save.companion === c.id ? 'Travelling with you' : `Travel with ${c.name}`}
                  </button>
                  <button className="btn-ghost" onClick={() => { onClose(); nav.go(c.home) }}><MapIcon size={16} /> Visit {WORLDS[c.home].short}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </Sheet>
  )
}
