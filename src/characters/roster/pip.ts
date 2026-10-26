import type { Character } from '../types'

export const pip: Character = {
  id: 'pip',
  name: 'Pip',
  title: 'Apprentice of Sparks',
  home: 'forge',
  role: 'ally',
  roleBlurb: 'A cheerful ally who keeps a jar of every win you have had.',
  backstory: 'Pip is Cinder\u2019s youngest apprentice and the forge\u2019s loudest cheerleader. They keep every tiny spark that flies off the anvil in a jar for dark days.',
  personality: ['Bouncy', 'Honest', 'Easily delighted'],
  quote: 'Did you see that spark? That was YOURS!',
  unlock: { kind: 'quests', n: 2 },
  hint: 'Complete 2 quests.',
  image: '/characters/pip',
  accent: '#e69a3c',
  talk: ['Ooh, new spark! Want to hammer something small?', 'I keep a jar of your wins. It is getting full!', 'It is okay to start crooked. I always do.'],
  react: {
    step: ['Spark! Spark! Spark!', 'Tink! That was a good one.'],
    quest: ['QUEST DONE! Into the jar it goes!'],
    focus: ['You did a long thing! I am staring in awe.'],
    joy: ['Again, again!'],
    rest: ['Naps count. I checked.'],
  },
  arc: [
    { title: 'The Jar of Sparks', text: ['Pip kept a glass jar for sparks that fell from the forge. Each one was a task somebody had finished.', 'On gloomy days Pip would shake the jar and watch it glow.'] },
    { title: 'A Crooked Nail', text: ['Pip\u2019s first nail came out bent, so Pip hid it under a bench. Cinder found it and hung it on the wall.', '\u201CFirst nails are the best nails,\u201D Cinder said. Pip has loved crooked things ever since.'] },
    { title: 'The Brightest Jar', text: ['Pip showed the jar to a traveller who felt they had done nothing all week. \u201CLook,\u201D Pip said. \u201CThese are all yours.\u201D', 'The traveller stared at the glowing jar for a long time, and smiled.'] },
  ],
  giftItems: { 3: 'cosmetic:charm-key' },
}
