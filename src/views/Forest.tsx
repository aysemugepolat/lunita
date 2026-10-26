import Residents from '@/characters/ui/Residents'
import GameShell from '@/games/GameShell'
import { gameWin } from '@/games/rewards'
import WhisperMatch from '@/games/WhisperMatch'
import WorldHeader, { Chapters, useWorld } from './WorldHeader'

export default function Forest() {
  const { def } = useWorld('forest')
  return (
    <div className="space-y-6">
      <WorldHeader world="forest" />
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <GameShell
          gameId="whisper"
          intro={`The forest whispers in pairs. Find each matching symbol. Every full set earns a ${def.crystal}.`}
          howTo={['Tap a card to turn it over, then tap a second card.', 'Matching pairs stay lit. Others flip back by themselves.', 'Stuck? Use Gentle peek to see every card for a moment.']}
        >
          <WhisperMatch onWin={() => gameWin('forest', 'Whispers found', 'whisper')} />
        </GameShell>
        <Chapters world="forest" />
      </div>
      <Residents world="forest" />
    </div>
  )
}
