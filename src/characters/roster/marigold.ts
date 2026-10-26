import type { Character } from '../types'

export const marigold: Character = {
  id: 'marigold',
  name: 'Marigold',
  title: 'Keeper of the Blooming Garden',
  home: 'garden',
  role: 'keeper',
  roleBlurb: 'Presses seeds and garden decorations into your hands as your bond grows.',
  backstory: 'Marigold has tended the garden since before the fountain stopped singing. She presses a seed into every visitor\u2019s palm and promises it will grow at its own pace.',
  personality: ['Warm', 'Patient', 'Pockets full of seeds'],
  quote: 'Nothing blooms on a schedule, dear.',
  unlock: { kind: 'chapter', id: 'garden-1' },
  hint: 'Read the first page of the Blooming Garden.',
  image: '/characters/marigold',
  accent: '#c4788a',
  talk: ['Take a seed, dear. No need to decide everything today.', 'A little water, a little time. That is the whole secret.', 'Weeds are just flowers nobody has met yet.'],
  react: {
    step: ['A drop of sun for the garden.', 'That will help something grow.'],
    quest: ['A whole bed finished! Lovely work.'],
    focus: ['Quiet hours grow the best roots.'],
    joy: ['Oh, how that made me smile.'],
    rest: ['Rest is sunlight too.'],
  },
  arc: [
    { title: 'The Silent Fountain', text: ['When the fountain stopped, the garden dried and the visitors stopped coming. Marigold kept watering anyway.', '\u201CSomeone might come back,\u201D she told the empty beds.'] },
    { title: 'A Seed in Every Hand', text: ['One spring a traveller returned, tired and unsure. Marigold gave them a seed and asked no questions.', 'It grew crooked, and they both loved it.'] },
    { title: 'The Fountain Sings', text: ['Years of small care added up. One morning the fountain coughed, and then it sang.', 'Marigold only said, \u201CThere you are. I knew you were coming.\u201D'] },
  ],
  giftItems: { 3: 'plant:moonflower', 5: 'decor:arch' },
}
