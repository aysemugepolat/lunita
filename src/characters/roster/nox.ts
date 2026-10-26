import type { Character } from '../types'

export const nox: Character = {
  id: 'nox',
  name: 'Nox',
  title: 'Lantern of Quiet Hours',
  home: 'sanctuary',
  role: 'ally',
  roleBlurb: 'Sits with you in the calm. No advice, only company.',
  backstory: 'Nox glows only when the world is calm, and rests in the dark when it is not. Travellers say sitting beside Nox makes their shoulders drop.',
  personality: ['Still', 'Observant', 'Surprisingly funny at midnight'],
  quote: 'Darkness is only light taking a break.',
  unlock: { kind: 'breaths', n: 1 },
  hint: 'Finish a Moon Breathing ritual.',
  image: '/characters/nox',
  accent: '#d8a64a',
  talk: ['I do not need you to talk. Just sit with me.', 'Your shoulders can come down now.', 'Night is not an enemy. It is a blanket.'],
  react: {
    step: ['Mm. Quietly done.', 'I felt that one. Good.'],
    quest: ['A bright thing, finished softly.'],
    focus: ['Hours like velvet. Well kept.'],
    joy: ['...Heh. I laughed on the inside.'],
    rest: ['Good night. I will dim for you.'],
  },
  arc: [
    { title: 'A Light That Dims', text: ['Nox once believed a lantern must always shine. They burned bright until they cracked.', 'A friend said, \u201CYou are allowed to be dim.\u201D It was the kindest sentence Nox had ever heard.'] },
    { title: 'The Quiet Hours', text: ['Now Nox glows softly through the night, a small amber promise. Travellers find it when they cannot sleep.', 'No advice is offered. Company is enough.'] },
    { title: 'Dawn, Eventually', text: ['Nox watched the first dawn after a very long night. It arrived without being hurried.', '\u201CSee?\u201D they whispered. \u201CEven morning takes its time.\u201D'] },
  ],
  giftItems: { 3: 'cosmetic:aura-rose' },
}
