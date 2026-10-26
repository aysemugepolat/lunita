import type { Character } from '../types'

export const cinder: Character = {
  id: 'cinder',
  name: 'Cinder',
  title: 'The Patient Smith',
  home: 'forge',
  role: 'mentor',
  roleBlurb: 'Hammers any step that still feels too heavy into smaller ones.',
  backstory: 'Cinder has hammered iron for centuries and learned one rule: nothing heavy stays heavy once it is cut into pieces. The forge is open to anyone carrying more than they can hold.',
  personality: ['Steady', 'Dry-humoured', 'Never rushes'],
  quote: 'Big things are just small things standing close together.',
  unlock: { kind: 'chapter', id: 'forge-1' },
  hint: 'Read the first page of the Quest Forge.',
  image: '/characters/cinder',
  accent: '#c4552f',
  talk: ['Bring me the heavy thing. We will find where it bends.', 'No task is too big for the anvil. Only too big for one go.', 'Slow hammer, true strike.'],
  react: {
    step: ['Good strike.', 'Tap. Tap. Shaped.'],
    quest: ['Forged and finished. Fine work.'],
    focus: ['Steady as an anvil. Well done.'],
    joy: ['Heh. Nicely played.'],
    rest: ['Even the forge banks its fire at night.'],
  },
  arc: [
    { title: 'The First Anvil', text: ['Cinder\u2019s first task was to lift a boulder alone. It would not move, and Cinder sat in the dust, ashamed.', 'A passing stranger said, \u201CWhy not break it?\u201D It was the best advice Cinder ever received.'] },
    { title: 'Pieces and Patience', text: ['From then on every job was cut down: the boulder, the wall, the long road home. Each piece took an afternoon.', 'Cinder learned that tired hands can still finish a tiny piece.'] },
    { title: 'The Open Door', text: ['Cinder left the forge door open for anyone who felt stuck. Travellers came with tangled days and left with tidy steps.', '\u201CIt is not my hammer that does the work,\u201D Cinder says. \u201CIt is your yes to the first strike.\u201D'] },
  ],
  giftItems: { 3: 'cosmetic:cloak-ink' },
}
