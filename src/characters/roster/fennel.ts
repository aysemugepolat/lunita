import type { Character } from '../types'

export const fennel: Character = {
  id: 'fennel',
  name: 'Fennel',
  title: 'Dew Whisperer',
  home: 'garden',
  role: 'ally',
  roleBlurb: 'A shy, loyal friend who hums to the seedlings and to you.',
  backstory: 'Fennel gathers dew at dawn and sings to the seedlings so they feel less alone. They are small, but the whole garden leans toward their voice.',
  personality: ['Shy', 'Musical', 'Fiercely loyal'],
  quote: 'Even a seed likes to be hummed to.',
  unlock: { kind: 'blooms', n: 1 },
  hint: 'Watch one plant fully bloom in the garden.',
  image: '/characters/fennel',
  accent: '#7fb59a',
  talk: ['Hmm hmm... oh! Hello. I was singing to the lavender.', 'I brought you some dew. It is the good kind.', 'You do not have to be loud to be heard here.'],
  react: {
    step: ['A small hum for a small step.', 'La la... well done.'],
    quest: ['Bloom! Bloom! I am humming for you.'],
    focus: ['Quiet is my favourite song.'],
    joy: ['Ooh! A happy sound!'],
    rest: ['Hush, hush. Sleep now.'],
  },
  arc: [
    { title: 'A Quiet Song', text: ['Fennel was too shy to speak in crowds, so they practised on seedlings. The seedlings never interrupted.', 'In time, their humming became the garden\u2019s morning song.'] },
    { title: 'Dew at Dawn', text: ['Each dawn Fennel collected a thimble of dew, one drop for every plant that needed it. It took a long time and nobody minded.', '\u201CSlow care is still care,\u201D Fennel hummed.'] },
    { title: 'The Chorus', text: ['One evening every flower in the garden turned toward Fennel and swayed in time.', 'Fennel stopped humming from surprise, then hummed even louder.'] },
  ],
  giftItems: { 3: 'plant:lavender', 5: 'decor:birdbath' },
}
