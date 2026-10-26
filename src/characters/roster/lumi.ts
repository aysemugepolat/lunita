import type { Character } from '../types'

export const lumi: Character = {
  id: 'lumi',
  name: 'Lumi',
  title: 'The Moon-Wisp Guide',
  home: 'forest',
  role: 'guide',
  roleBlurb: 'Breaks big tasks into tiny steps and walks beside you everywhere.',
  backstory: 'Born from a single beam of moonlight that fell into a sleeping forest, Lumi has helped travellers for longer than the lanterns can remember. She believes every great journey is just many tiny ones.',
  personality: ['Gentle', 'Playful', 'Endlessly patient'],
  quote: 'Small steps are still steps.',
  unlock: { kind: 'start' },
  hint: 'Lumi is with you from the very start.',
  image: '/characters/lumi',
  accent: '#e6c677',
  talk: ['Hello, friend. What shall we make small today?', 'No rush. I will glow right here.', 'You can stop any time. Nothing is lost.'],
  react: {
    step: ['That counts. I saw it!', 'One tiny light, lit.'],
    quest: ['A whole quest! The realm is glowing for you.'],
    focus: ['You stayed with it. I am so proud.'],
    joy: ['Wheee! That was lovely.'],
    rest: ['Rest well. I will keep the light on.'],
  },
  arc: [
    { title: 'The Light That Fell', text: ['Long ago, a beam of moonlight slipped through the clouds and landed in the silent forest. It did not know what it was for.', 'A weary traveller sat beside it and said, \u201CThank you for being here.\u201D That was the first time Lumi felt like someone.'] },
    { title: 'Learning to Be Small', text: ['Lumi tried to help by doing everything at once, and it only made travellers dizzy. An old owl whispered, \u201CTry the smallest thing.\u201D', 'So she did. The traveller smiled, and Lumi finally understood her purpose.'] },
    { title: 'Every Lantern', text: ['Now Lumi visits every world, lighting what needs light. She never hurries anyone.', 'Her secret is simple. She is not here to make you faster. She is here to keep you company.'] },
  ],
  giftItems: { 3: 'cosmetic:aura-gold' },
}
