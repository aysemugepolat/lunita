import type { Character } from '../types'

export const oriel: Character = {
  id: 'oriel',
  name: 'Oriel',
  title: 'Teller of Bedtime Tales',
  home: 'sanctuary',
  role: 'storyteller',
  roleBlurb: 'Tells short bedtime tales that end in rest and a quiet reflection.',
  backstory: 'Oriel lives at the top of the Sanctuary tower and tells stories that end with everyone safely asleep. Her tales are short on purpose, so no one has to stay awake to finish them.',
  personality: ['Velvet-voiced', 'Wise', 'Loves a good pause'],
  quote: 'Rest is where the story catches up with you.',
  unlock: { kind: 'chapter', id: 'sanctuary-1' },
  hint: 'Read the first page of the Moonlight Sanctuary.',
  image: '/characters/oriel',
  accent: '#8d8fb8',
  talk: ['Settle in. This tale is a short one.', 'You did enough today. Truly.', 'Shall we close our eyes for a moment?'],
  react: {
    step: ['Another gentle line in tonight\u2019s tale.', 'Mm. A good page.'],
    quest: ['That will be a lovely chapter to remember.'],
    focus: ['A long quiet hour. How restful.'],
    joy: ['Even stories need laughter.'],
    rest: ['Sleep well. I will tell the dreams to be kind.'],
  },
  arc: [
    { title: 'The Tale That Ended', text: ['Oriel\u2019s tales used to go on and on, and listeners fell asleep before the ending. She felt she had failed them.', 'Then she realised that falling asleep was the happy ending.'] },
    { title: 'Short Stories, Long Rest', text: ['She began to tell shorter tales, each ending in a warm blanket. Travellers started waking up smiling.', '\u201CBe brief and be kind,\u201D Oriel wrote on her wall.'] },
    { title: 'The Last Page', text: ['On a stormy night, a wide-awake traveller asked for a story about themselves. She told one about a person who did small things and was very loved.', '\u201CThat is you,\u201D she said softly.'] },
  ],
  giftItems: { 3: 'cosmetic:hat-witch', 5: 'cosmetic:trim-rose' },
}
