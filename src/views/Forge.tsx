import Residents from '@/characters/ui/Residents'
import RuneEcho from '@/games/RuneEcho'
import GameShell from '@/games/GameShell'
import { gameWin } from '@/games/rewards'
import { useNav } from '@/ui/nav'
import TaskForge from '@/ui/TaskForge'
import WorldHeader, { Chapters } from './WorldHeader'

export default function Forge() {
  const nav = useNav()
  return (
    <div className="space-y-6">
      <WorldHeader world="forge" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <section className="page p-5 sm:p-6">
          <p className="small-caps text-burgundy-600">The anvil listens</p>
          <h2 className="font-display text-3xl font-semibold text-burgundy-700">Forge a quest</h2>
          <p className="mb-4 text-ink-700/85">Tell Lumi something real that feels big. She will hammer it into small steps. Edit anything, shrink what still feels heavy, then start.</p>
          <TaskForge onForged={() => nav.go('quests')} />
        </section>
        <div className="space-y-6">
          <GameShell
            dark
            gameId="runes"
            intro="Watch the runes glow and echo the song back. Finish it for an Ember Garnet."
            howTo={['Watch and listen while the runes light up in order.', 'Then tap the same runes in the same order.', 'A slip only replays the song. Use Hear it again any time.']}
          >
            <RuneEcho onWin={() => gameWin('forge', 'The forge sings', 'runes')} />
          </GameShell>
          <Chapters world="forge" />
        </div>
      </div>
      <Residents world="forge" />
    </div>
  )
}
