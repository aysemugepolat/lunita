import type { ReactNode } from 'react'
import { ChevronDown, HeartHandshake, Lock, Trophy } from 'lucide-react'
import { useGame } from '@/game/store'
import { DiscoveryArt, GAMES, RANKS, rankFor, type GameId } from './discoveries'
import { useSessionWins } from './session'

interface Props {
  gameId: GameId
  kicker?: string
  intro: string
  howTo: string[]
  dark?: boolean
  children: ReactNode
}

/** Shared frame for every mini-game: title, mastery, how-to, collection, and a gentle break nudge. */
export default function GameShell({ gameId, kicker = 'Mini-game', intro, howTo, dark = false, children }: Props) {
  const wins = useSessionWins()
  const { save } = useGame()
  const info = GAMES[gameId]
  const rec = save.games[gameId]
  const rank = rankFor(rec?.wins ?? 0)
  const found = rec?.found ?? []
  const pct = rank.next ? Math.min(100, (((rec?.wins ?? 0) - RANKS[rank.index].at) / (rank.next.at - RANKS[rank.index].at)) * 100) : 100

  const text = dark ? 'text-ivory-100' : 'text-ink-800'
  const sub = dark ? 'text-ivory-200/90' : 'text-ink-700/85'
  const accent = dark ? 'text-gold-300' : 'text-burgundy-700'
  const line = dark ? 'border-gold-400/40' : 'border-gold-500/40'

  return (
    <section className={`${dark ? 'page-dark' : 'page'} p-5 sm:p-6`}>
      <p className={`small-caps ${dark ? 'text-gold-300' : 'text-burgundy-600'}`}>{kicker}</p>
      <div className="flex flex-wrap items-end justify-between gap-x-4 gap-y-1">
        <h2 className={`font-display text-3xl font-semibold ${dark ? 'text-ivory-100' : 'text-burgundy-700'}`}>{info.title}</h2>
        <p className={`flex items-center gap-1.5 font-display text-lg font-semibold ${accent}`} title="Your mastery grows with every win. It never goes down.">
          <Trophy size={16} /> {rank.name}
        </p>
      </div>
      <div className="mb-2 mt-1 flex items-center gap-3">
        <div className={`h-1.5 flex-1 overflow-hidden rounded-full border ${line}`} role="progressbar" aria-label="Mastery progress" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
          <div className="h-full bg-gradient-to-r from-burgundy-500 to-gold-400 transition-[width] duration-700" style={{ width: `${pct}%` }} />
        </div>
        <span className={`text-sm tabular-nums ${sub}`}>{rank.next ? `${rec?.wins ?? 0} / ${rank.next.at} wins to ${rank.next.name}` : `${rec?.wins ?? 0} wins`}</span>
      </div>
      <p className={`mb-3 ${sub}`}>{intro}</p>

      <details className={`group mb-3 rounded-[3px] border ${line}`}>
        <summary className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between px-3 font-display text-lg font-semibold ${accent}`}>
          How to play
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <ul className={`list-disc space-y-1 px-8 pb-3 ${text}`}>
          {howTo.map((h) => <li key={h}>{h}</li>)}
          <li>No timer, no score, no losing. Stop whenever you like.</li>
        </ul>
      </details>

      {children}

      <details className={`group mt-4 rounded-[3px] border ${line}`}>
        <summary className={`flex min-h-[44px] cursor-pointer list-none items-center justify-between px-3 font-display text-lg font-semibold ${accent}`}>
          <span>Your {info.noun} <span className={`text-base font-normal tabular-nums ${sub}`}>{found.length} of {info.items.length}</span></span>
          <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
        </summary>
        <ul className="grid gap-2 px-3 pb-3 sm:grid-cols-2">
          {info.items.map((it) => {
            const got = found.includes(it.id)
            return (
              <li key={it.id} className={`flex items-center gap-3 rounded-[3px] border p-2 ${got ? (dark ? 'border-gold-400/50 bg-burgundy-900/40' : 'border-gold-500/50 bg-ivory-50') : 'border-dashed border-current/20 opacity-55'}`}>
                <span className="grid h-14 w-14 shrink-0 place-items-center">
                  {got ? (gameId === 'stars' || gameId === 'moon' ? <DiscoveryArt game={gameId} id={it.id} size={52} /> : <span className={`font-display text-2xl ${accent}`}>{info.items.indexOf(it) + 1}</span>) : <Lock size={16} className={sub} />}
                </span>
                <span className="min-w-0">
                  <span className={`block font-display text-lg font-semibold leading-tight ${text}`}>{got ? it.name : 'Not found yet'}</span>
                  <span className={`block text-sm leading-snug ${sub}`}>{got ? it.text : 'Keep playing to uncover it.'}</span>
                </span>
              </li>
            )
          })}
        </ul>
      </details>

      {wins >= 3 && (
        <p className={`mt-4 flex items-start gap-2 rounded-[3px] border p-3 text-sm ${dark ? 'border-gold-400/50 bg-burgundy-900/50 text-ivory-100' : 'border-gold-500/50 bg-gold-300/20 text-ink-800'}`}>
          <HeartHandshake size={18} className="mt-0.5 shrink-0" />
          You have won {wins} games this visit. A stretch, a sip of water, or a quest in the real world might feel lovely now.
        </p>
      )}
    </section>
  )
}
