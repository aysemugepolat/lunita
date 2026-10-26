import { cinder } from './roster/cinder'
import { elowen } from './roster/elowen'
import { fennel } from './roster/fennel'
import { lumi } from './roster/lumi'
import { marigold } from './roster/marigold'
import { nox } from './roster/nox'
import { oriel } from './roster/oriel'
import { pip } from './roster/pip'
import { quill } from './roster/quill'
import { seren } from './roster/seren'
import type { Character } from './types'
import type { WorldId } from '@/game/types'

/**
 * The roster. To add a character: create a file in ./roster, then add it here.
 * To swap art: replace the file in /public/characters, or change `image` on the character.
 */
export const CHARACTERS: Character[] = [lumi, elowen, cinder, pip, seren, quill, marigold, fennel, oriel, nox]

export const CHARACTER_MAP: Record<string, Character> = Object.fromEntries(CHARACTERS.map((c) => [c.id, c]))

export const getCharacter = (id: string): Character | undefined => CHARACTER_MAP[id]

export const residentsOf = (world: WorldId): Character[] => CHARACTERS.filter((c) => c.home === world)

export const ROLE_LABEL: Record<Character['role'], string> = {
  guide: 'Guide',
  questgiver: 'Quest giver',
  mentor: 'Mentor',
  guardian: 'Guardian',
  keeper: 'Keeper',
  storyteller: 'Storyteller',
  ally: 'Ally',
}

export type { Character } from './types'
