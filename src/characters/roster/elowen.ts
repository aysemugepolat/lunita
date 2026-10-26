import type { Character } from '../types'

export const elowen: Character = {
  id: 'elowen',
  name: 'Elowen',
  title: 'Keeper of the Whispering Path',
  home: 'forest',
  role: 'questgiver',
  roleBlurb: 'Hands you gentle starter quests that fit in a pocket.',
  backstory: 'Elowen walks the forest paths each dawn, listening to what the trees want to say. She leaves little quests on mossy stones for anyone who needs a gentle nudge.',
  personality: ['Curious', 'Calm', 'Quietly funny'],
  quote: 'Every path begins with one step off the porch.',
  unlock: { kind: 'chapter', id: 'forest-1' },
  hint: 'Read the first page of the Whispering Forest.',
  image: '/characters/elowen',
  accent: '#7f9a62',
  talk: ['The moss says you are doing fine. I agree.', 'Want a tiny quest? I have a few that fit in a pocket.', 'Breathe in the green. It is free.'],
  react: {
    step: ['Lovely. Another stone passed.', 'Soft feet, steady heart.'],
    quest: ['You walked the whole path. The trees noticed.'],
    focus: ['Even the leaves held still for you.'],
    joy: ['Ha! The forest giggled.'],
    rest: ['Sit a while. The path will wait.'],
  },
  arc: [
    { title: 'Mossy Beginnings', text: ['Elowen once feared the forest was too big to ever understand. So she learned one tree each morning.', 'In a year she knew them all, and not one felt like work.'] },
    { title: 'The Stone Notes', text: ['She began leaving small notes on stones: drink water, open a window, say hello. Travellers found them exactly when they needed them.', 'No one ever knew who wrote them, and that was how she liked it.'] },
    { title: 'The Crown Path', text: ['On the longest night, the path glowed silver beneath her feet. Every note she had left lit up at once.', '\u201COh,\u201D she whispered. \u201CIt was never me. It was all of you.\u201D'] },
  ],
  giftItems: { 3: 'cosmetic:hat-hood' },
}
