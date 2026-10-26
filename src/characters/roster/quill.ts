import type { Character } from '../types'

export const quill: Character = {
  id: 'quill',
  name: 'Quill',
  title: 'Bottler of Thoughts',
  home: 'island',
  role: 'ally',
  roleBlurb: 'Keeps your stray thoughts safe so you can sail on.',
  backstory: 'Quill collects the stray thoughts that drift off travellers mid-voyage and seals them in tiny bottles. Nothing is lost, only kept safe until you are ready.',
  personality: ['Dreamy', 'Forgetful', 'Kind to every idea'],
  quote: 'Good thoughts keep. Park them and sail on.',
  unlock: { kind: 'focus', n: 1 },
  hint: 'Finish one voyage on Focus Island.',
  image: '/characters/quill',
  accent: '#8a6fb0',
  talk: ['Another idea? Into the bottle it goes.', 'I wrote your thought on a very small label.', 'Where was I? Oh, helping you. Yes.'],
  react: {
    step: ['Noted in my tiny ledger.', 'Ah, a step! Lovely.'],
    quest: ['Bottled and labelled: one finished quest.'],
    focus: ['Not one thought escaped. Not one mattered more.'],
    joy: ['Oh! I must write that down.'],
    rest: ['Dreams are just thoughts at rest.'],
  },
  arc: [
    { title: 'Too Many Thoughts', text: ['Quill\u2019s head was once so full of ideas that they could not finish a single sentence.', 'A bottle on the beach gave them an idea: what if thoughts could be set down, gently?'] },
    { title: 'The First Bottle', text: ['Quill wrote the most distracting thought on a scrap and corked it. The relief felt like putting down a heavy bag.', 'The thought was still there, just quieter.'] },
    { title: 'A Library of Bottles', text: ['Travellers began leaving thoughts with Quill. Soon a whole shelf shimmered with them.', 'Some were worries, some were wonders. Quill never ranked them.'] },
  ],
  giftItems: { 3: 'cosmetic:charm-moon' },
}
