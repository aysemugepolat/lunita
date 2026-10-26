import { actions } from '@/game/store'
import type { WorldId } from '@/game/types'
import type { GameId } from './discoveries'
import { recordWin } from './session'

/** Every mini-game win goes through here: same gentle reward, and it counts toward the break reminder. */
export function gameWin(world: WorldId, label: string, gameId: GameId) {
  recordWin()
  actions.miniWin(world, label, gameId)
}
