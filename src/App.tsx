import { useGame } from '@/game/store'
import Intro from '@/ui/Intro'
import Shell from '@/ui/Shell'

export default function App() {
  const { save } = useGame()
  return save.introDone ? <Shell /> : <Intro />
}
