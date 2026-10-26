import type { Avatar, WorldId } from './types'

export interface WorldDef {
  id: WorldId
  name: string
  short: string
  epithet: string
  crystal: string
  crystalHue: string
  unlockAt: number
  blurb: string
  action: string
}

export const WORLDS: Record<WorldId, WorldDef> = {
  forest: {
    id: 'forest',
    name: 'Whispering Forest',
    short: 'Forest',
    epithet: 'Where every beginning is quiet',
    crystal: 'Moss Jade',
    crystalHue: '#5f7a4c',
    unlockAt: 0,
    blurb: 'Ancient trees hold the realm\u2019s first stories. Wander, listen, and play the Whisper Match.',
    action: 'Play Whisper Match',
  },
  forge: {
    id: 'forge',
    name: 'Quest Forge',
    short: 'Forge',
    epithet: 'Where heavy tasks become small stars',
    crystal: 'Ember Garnet',
    crystalHue: '#a3282f',
    unlockAt: 1,
    blurb: 'Tell Lumi what feels too big. The forge hammers it into tiny, doable steps.',
    action: 'Forge a quest',
  },
  island: {
    id: 'island',
    name: 'Focus Island',
    short: 'Island',
    epithet: 'Where one calm voyage is enough',
    crystal: 'Tide Sapphire',
    crystalHue: '#2f5a7d',
    unlockAt: 3,
    blurb: 'Set sail for 5 to 25 minutes. Pause whenever you need. Landfall always counts.',
    action: 'Set sail',
  },
  garden: {
    id: 'garden',
    name: 'Blooming Garden',
    short: 'Garden',
    epithet: 'Where small care becomes bloom',
    crystal: 'Petal Quartz',
    crystalHue: '#c4788a',
    unlockAt: 5,
    blurb: 'Each step you finish gives sunbeams. Plant, tend and decorate your living garden.',
    action: 'Tend the garden',
  },
  sanctuary: {
    id: 'sanctuary',
    name: 'Moonlight Sanctuary',
    short: 'Sanctuary',
    epithet: 'Where rest is part of the journey',
    crystal: 'Moon Opal',
    crystalHue: '#8d8fb8',
    unlockAt: 8,
    blurb: 'Breathe with the moon, dress your traveller, and keep a gentle reflection journal.',
    action: 'Breathe with the moon',
  },
}

export const WORLD_ORDER: WorldId[] = ['forest', 'forge', 'island', 'garden', 'sanctuary']

/** Crystals needed in a world for each stage of restoration (0 dormant to 4 radiant). */
export const STAGE_AT = [0, 1, 3, 6, 10]
export const STAGE_NAMES = ['Dormant', 'Stirring', 'Awake', 'Glowing', 'Radiant']

export function stageFor(crystals: number): number {
  let s = 0
  for (let i = 0; i < STAGE_AT.length; i++) if (crystals >= STAGE_AT[i]) s = i
  return s
}

export interface Chapter {
  id: string
  world: WorldId
  title: string
  needs: number
  paragraphs: string[]
}

export const CHAPTERS: Chapter[] = [
  {
    id: 'forest-1', world: 'forest', title: 'The First Lantern', needs: 0,
    paragraphs: [
      'The forest was not asleep, only waiting. Every trunk leaned a little closer as you stepped through the mist, the way old friends lean in to hear a secret.',
      'Lumi circled your shoulder, a small moon-wisp humming without hurry. \u201CNothing here is late,\u201D she whispered. \u201CWe light one lantern at a time.\u201D',
      'At the base of the oldest oak, a lantern waited, cold and unlit. It needed only one thing: a first small step.',
    ],
  },
  {
    id: 'forest-2', world: 'forest', title: 'What the Moss Remembers', needs: 2,
    paragraphs: [
      'Where you lit the first lantern, moss glowed green-gold along the path. It remembered every footfall, and none of them were wrong.',
      'Tiny paper moths drifted out from the hollow trunks. Each carried a forgotten wish, folded small enough to fit in a thumb.',
      '\u201CThey are not demands,\u201D said Lumi. \u201CThey are invitations. Take any one that feels light.\u201D',
    ],
  },
  {
    id: 'forest-3', world: 'forest', title: 'The Crown of Branches', needs: 5,
    paragraphs: [
      'High above, the branches wove themselves into a crown of silver leaves, and the whole forest exhaled.',
      'You understood then: the path was never about how far you walked. It was that you kept coming back to it, gently, as many times as it took.',
      'The way to the Quest Forge opened ahead, warm with ember light.',
    ],
  },
  {
    id: 'forge-1', world: 'forge', title: 'The Forge that Listens', needs: 0,
    paragraphs: [
      'The Quest Forge hummed in a cavern of burgundy stone, its great anvil carved with constellations. Nothing here shouted. It listened.',
      '\u201CBring me the heavy thing,\u201D said the forge, in a voice like coals settling. \u201CThe one you keep circling.\u201D',
      'Lumi tapped the anvil. \u201CWe do not lift it. We cut it into pieces small enough to hold in one hand.\u201D',
    ],
  },
  {
    id: 'forge-2', world: 'forge', title: 'A Hammer of Tiny Things', needs: 2,
    paragraphs: [
      'Sparks rose like tiny stars. Each strike on the anvil made a task smaller, then smaller still, until it fit inside a breath.',
      'The apprentice smiths, shy clockwork foxes, left you a gift: a hammer with a handle shaped like a crescent.',
      '\u201CFirst steps are allowed to be ridiculous,\u201D said Lumi. \u201COpen the box. Touch the cloth. That counts.\u201D',
    ],
  },
  {
    id: 'forge-3', world: 'forge', title: 'The Anvil Remembers You', needs: 5,
    paragraphs: [
      'Your name now glowed on the anvil, forged from every little thing you finished. No streaks. No scoreboard. Only a bright record of what you did.',
      'The forge opened a hatch to the sea, where a small boat was bobbing in lantern light.',
      '\u201CNext,\u201D said Lumi, \u201Cwe learn what it feels like to stay.\u201D',
    ],
  },
  {
    id: 'island-1', world: 'island', title: 'Landfall at Sleeping Water', needs: 0,
    paragraphs: [
      'The boat slid up onto Focus Island with a sound like a long exhale. The sea was glass, the sky a deep wine-colored dusk.',
      'On the island sat a single tide-bell. \u201CIt rings when you arrive,\u201D said Lumi, \u201Cnot when you finish. Arriving is the brave part.\u201D',
      'You could set sail for five minutes, or twenty-five. Either way, the island would be here.',
    ],
  },
  {
    id: 'island-2', world: 'island', title: 'Bottles on the Tide', needs: 2,
    paragraphs: [
      'Bottles washed ashore, each holding a stray thought that had tried to pull you off course.',
      '\u201CDo not scold them,\u201D said Lumi. \u201CJust park them here. They will wait until you are ready.\u201D',
      'The sea held them gently. Your sail felt lighter than it had in a long time.',
    ],
  },
  {
    id: 'island-3', world: 'island', title: 'The Long Tide', needs: 5,
    paragraphs: [
      'A great, slow tide rolled in, and with it a path of stepping-stones glowing gold across the dark water, one stone for every minute you had given.',
      'You walked it without hurry. Behind you the stones stayed lit, a bridge you built from kindness to your own attention.',
      'On the far shore, green things were beginning to stir.',
    ],
  },
  {
    id: 'garden-1', world: 'garden', title: 'Seeds in a Pocket', needs: 0,
    paragraphs: [
      'The Blooming Garden was a quiet ruin of fountains and empty beds, waiting for someone to care a little.',
      '\u201CEvery step you finish drops a sunbeam,\u201D said Lumi, \u201Cand sunbeams are all a seed ever really needs.\u201D',
      'You pressed your first seed into the soil, and something under it sighed with relief.',
    ],
  },
  {
    id: 'garden-2', world: 'garden', title: 'The Patient Bloom', needs: 2,
    paragraphs: [
      'Some flowers open in an hour; some take a season. The garden does not mind. It cheers for both.',
      'Fireflies arrived to inspect your work and nodded their small lights approvingly.',
      '\u201CRest is also sunlight,\u201D said Lumi, settling on a lavender stalk. \u201CSeeds grow while you sleep.\u201D',
    ],
  },
  {
    id: 'garden-3', world: 'garden', title: 'The Fountain Wakes', needs: 5,
    paragraphs: [
      'At the heart of the garden, the old fountain coughed, sputtered, and then sang. Water fell in silver ribbons through the evening air.',
      'Everything you had tended leaned toward the sound. The whole garden was a small proof that gentle effort adds up.',
      'Above the hedge, a crescent moon was rising over a quiet white tower.',
    ],
  },
  {
    id: 'sanctuary-1', world: 'sanctuary', title: 'The Tower of Soft Light', needs: 0,
    paragraphs: [
      'The Moonlight Sanctuary was built to be a place of rest. Its stairs were wide, its windows round, its floors warm as a held hand.',
      '\u201CHere,\u201D said Lumi, \u201Cwe set the day down. You do not have to earn the right to be tired.\u201D',
      'The moon leaned in at the window, listening to your breathing.',
    ],
  },
  {
    id: 'sanctuary-2', world: 'sanctuary', title: 'The Wardrobe of Stars', needs: 2,
    paragraphs: [
      'In a hall of mirrors you found a wardrobe that held every version of you, each draped in a different star.',
      'There was no right outfit. There was only the one that made you feel like yourself, tonight.',
      'Lumi tried on a tiny crown and refused to take it off.',
    ],
  },
  {
    id: 'sanctuary-3', world: 'sanctuary', title: 'The Moon Opens Her Eye', needs: 5,
    paragraphs: [
      'At the top of the tower, the moon opened one great pearl eye and looked at you, and in it you saw every world you had woken.',
      'Forest lanterns. Forge embers. Tide-bells. Blooming rows. All of it lit by small steps you thought did not count.',
      '\u201CThey counted,\u201D said Lumi. \u201CThey always counted. Now, shall we begin again tomorrow, whenever tomorrow feels ready?\u201D',
    ],
  },
]

export interface StoryPrompt {
  world: WorldId
  title: string
  steps: { text: string; minutes: number }[]
}

export const STORY_PROMPTS: StoryPrompt[] = [
  {
    world: 'garden', title: 'A glass of water for the garden',
    steps: [
      { text: 'Stand up and walk to where your cup lives', minutes: 1 },
      { text: 'Fill it with water', minutes: 1 },
      { text: 'Take three slow sips', minutes: 1 },
    ],
  },
  {
    world: 'forge', title: 'Clear one tiny surface',
    steps: [
      { text: 'Choose one small surface (a corner of your desk is enough)', minutes: 1 },
      { text: 'Pick up anything that is trash and drop it in the bin', minutes: 2 },
      { text: 'Move the remaining things into one neat pile', minutes: 2 },
    ],
  },
  {
    world: 'forest', title: 'Borrow a breath of outside air',
    steps: [
      { text: 'Open a window or step to the door', minutes: 1 },
      { text: 'Look at the farthest thing you can see for 20 seconds', minutes: 1 },
      { text: 'Take two deep breaths of fresh air', minutes: 1 },
    ],
  },
  {
    world: 'sanctuary', title: 'One kind line to yourself',
    steps: [
      { text: 'Place a hand on your chest', minutes: 1 },
      { text: 'Think of one thing you did today, however small', minutes: 1 },
      { text: 'Say \u201Cthank you\u201D to yourself, out loud or in your head', minutes: 1 },
    ],
  },
  {
    world: 'island', title: 'Five minutes on one thing',
    steps: [
      { text: 'Name the one thing you will touch for five minutes', minutes: 1 },
      { text: 'Close other tabs, or put your phone face down', minutes: 1 },
      { text: 'Sail on Focus Island for 5 minutes', minutes: 5 },
    ],
  },
]

export interface Achievement {
  id: string
  name: string
  desc: string
  keepsake?: number
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'spark', name: 'First Spark', desc: 'Finish your very first step.', keepsake: 0 },
  { id: 'brave', name: 'Brave Beginning', desc: 'Complete your first quest.', keepsake: 1 },
  { id: 'tiny3', name: 'Three Tiny Wins', desc: 'Finish three steps.' },
  { id: 'apprentice', name: 'Forge Apprentice', desc: 'Complete five quests.' },
  { id: 'lantern', name: 'Forest Lantern', desc: 'Gather 3 Moss Jade.', keepsake: 2 },
  { id: 'ember', name: 'Forge Ember', desc: 'Gather 3 Ember Garnet.', keepsake: 3 },
  { id: 'tide', name: 'Tide Charm', desc: 'Gather 3 Tide Sapphire.', keepsake: 4 },
  { id: 'bloomcrystal', name: 'Garden Bloom', desc: 'Gather 3 Petal Quartz.', keepsake: 5 },
  { id: 'opal', name: 'Moon Opal', desc: 'Gather 3 Moon Opal.', keepsake: 6 },
  { id: 'collector', name: 'Crystal Collector', desc: 'Hold all five kinds of crystal.', keepsake: 7 },
  { id: 'longtide', name: 'Long Tide Voyager', desc: 'Complete a 25 minute voyage.', keepsake: 8 },
  { id: 'firstbloom', name: 'First Bloom', desc: 'Watch a plant fully bloom.', keepsake: 9 },
  { id: 'return', name: 'Gentle Return', desc: 'Come back after a few days away. You are always welcome.', keepsake: 10 },
  { id: 'realm', name: 'Realm Awakened', desc: 'Bring every world to the Awake stage.', keepsake: 11 },
  { id: 'deepbreath', name: 'Deep Breath', desc: 'Finish a breathing ritual.' },
  { id: 'voyager', name: 'First Voyage', desc: 'Land on Focus Island after any voyage.' },
  { id: 'dresser', name: 'Moon Dresser', desc: 'Change your traveller\u2019s look.' },
  { id: 'reflect', name: 'Quiet Page', desc: 'Write a reflection.' },
  { id: 'reader', name: 'Story Keeper', desc: 'Read five story chapters.' },
  { id: 'gardener', name: 'Seed Sower', desc: 'Plant your first seed.' },
  { id: 'atlas', name: 'Sky Cartographer', desc: 'Chart all nine constellations in the Star Chart.' },
  { id: 'allgames', name: 'Five Worlds of Play', desc: 'Win each of the five mini-games at least once.' },
]

export interface PlantDef { id: string; name: string; cost: number; need: number; hue: string; accent: string }

export const PLANTS: PlantDef[] = [
  { id: 'glowmoss', name: 'Glow Moss', cost: 0, need: 2, hue: '#5f7a4c', accent: '#d9e6a8' },
  { id: 'lavender', name: 'Lavender', cost: 6, need: 3, hue: '#6a5a96', accent: '#c9b8ee' },
  { id: 'sunpetal', name: 'Sunpetal', cost: 8, need: 3, hue: '#b8893a', accent: '#f0d17a' },
  { id: 'moonflower', name: 'Moonflower', cost: 14, need: 4, hue: '#8d8fb8', accent: '#f3f0ff' },
  { id: 'rose', name: 'Velvet Rose', cost: 18, need: 5, hue: '#7d2a40', accent: '#e58aa0' },
]

export interface DecorDef { id: string; name: string; cost: number }

export const DECOR: DecorDef[] = [
  { id: 'lantern', name: 'Gilded Lantern', cost: 10 },
  { id: 'birdbath', name: 'Stone Birdbath', cost: 16 },
  { id: 'bench', name: 'Carved Bench', cost: 20 },
  { id: 'arch', name: 'Rose Arch', cost: 30 },
  { id: 'fountain', name: 'Mini Fountain', cost: 40 },
]

export interface Cosmetic { id: string; name: string; slot: keyof Avatar; value: string; level: number; cost: number }

export const COSMETICS: Cosmetic[] = [
  { id: 'cloak-burgundy', name: 'Burgundy', slot: 'cloak', value: '#6b1a2d', level: 1, cost: 0 },
  { id: 'cloak-midnight', name: 'Midnight', slot: 'cloak', value: '#2a2742', level: 1, cost: 8 },
  { id: 'cloak-moss', name: 'Moss', slot: 'cloak', value: '#4b6140', level: 2, cost: 12 },
  { id: 'cloak-ink', name: 'Ink', slot: 'cloak', value: '#1d1613', level: 3, cost: 16 },
  { id: 'trim-gold', name: 'Gold', slot: 'trim', value: '#d4a94c', level: 1, cost: 0 },
  { id: 'trim-silver', name: 'Silver', slot: 'trim', value: '#cfd2dc', level: 2, cost: 8 },
  { id: 'trim-rose', name: 'Rose', slot: 'trim', value: '#e58aa0', level: 3, cost: 10 },
  { id: 'hat-none', name: 'Bare', slot: 'hat', value: 'none', level: 1, cost: 0 },
  { id: 'hat-hood', name: 'Hood', slot: 'hat', value: 'hood', level: 1, cost: 6 },
  { id: 'hat-crown', name: 'Moon Crown', slot: 'hat', value: 'crown', level: 3, cost: 24 },
  { id: 'hat-witch', name: 'Starcap', slot: 'hat', value: 'starcap', level: 2, cost: 14 },
  { id: 'aura-none', name: 'None', slot: 'aura', value: 'none', level: 1, cost: 0 },
  { id: 'aura-gold', name: 'Golden', slot: 'aura', value: '#e6c677', level: 2, cost: 10 },
  { id: 'aura-rose', name: 'Rosy', slot: 'aura', value: '#e58aa0', level: 3, cost: 14 },
  { id: 'charm-star', name: 'Star', slot: 'charm', value: 'star', level: 1, cost: 0 },
  { id: 'charm-moon', name: 'Crescent', slot: 'charm', value: 'moon', level: 2, cost: 10 },
  { id: 'charm-key', name: 'Key', slot: 'charm', value: 'key', level: 3, cost: 12 },
]

export const DEFAULT_AVATAR: Avatar = { cloak: '#6b1a2d', trim: '#d4a94c', hat: 'none', aura: 'none', charm: 'star' }

export const MOODS = ['Calm', 'Hopeful', 'Tired', 'Scattered', 'Proud', 'Tender']
