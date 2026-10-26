import type { Character } from '../types'

export const seren: Character = {
  id: 'seren',
  name: 'Seren',
  title: 'Keeper of the Tide-Bell',
  home: 'island',
  role: 'guardian',
  roleBlurb: 'Hosts your 5 to 25 minute voyages and cheers from the harbour.',
  backstory: 'Seren rings the tide-bell whenever a traveller lands on the island. They do not count minutes or measure success. They only make sure each voyage has a safe harbour.',
  personality: ['Serene', 'Protective', 'Soft-spoken'],
  quote: 'Arriving is the brave part.',
  unlock: { kind: 'chapter', id: 'island-1' },
  hint: 'Read the first page of Focus Island.',
  image: '/characters/seren',
  accent: '#4f86ad',
  talk: ['Choose a voyage that feels kind. Five minutes is a whole sea.', 'The harbour is always here if you need to rest.', 'Wind changes. So do minds. Both are welcome.'],
  react: {
    step: ['A calm little ripple. Lovely.'],
    quest: ['A clear horizon. Well sailed.'],
    focus: ['Landfall. I rang the bell for you.'],
    joy: ['The water sparkles when you smile.'],
    rest: ['Anchor down. Sleep well.'],
  },
  voyage: ['The harbour lets you go. Sail kindly.', 'Steady water. You are doing it.', 'The lighthouse is in sight.', 'Landfall. I rang the bell for you.'],
  arc: [
    { title: 'The Bell Without a Clock', text: ['Seren was once a harbour master who timed every ship and scolded the late ones. The harbour was efficient and nobody was happy.', 'One night Seren threw the pocket watch into the sea and rang the bell instead.'] },
    { title: 'Ships That Wander', text: ['Now ships arrive whenever they can. Some drift in singing, some limp home tired.', 'Seren greets them all the same: \u201CYou made it. That is plenty.\u201D'] },
    { title: 'The Long Tide', text: ['On the longest tide of the year, a tiny boat crossed the whole dark sea. Seren rang the bell for an hour.', 'Not because the boat was fast, but because it kept going.'] },
  ],
  giftItems: { 3: 'cosmetic:cloak-midnight' },
}
