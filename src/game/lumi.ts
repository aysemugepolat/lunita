import type { WorldId } from './types'

export type Energy = 'tiny' | 'steady' | 'bold'

export interface DraftStep {
  text: string
  minutes: number
}

interface Archetype {
  id: string
  world: WorldId
  match: RegExp
  steps: (t: string) => DraftStep[]
}

const ARCHETYPES: Archetype[] = [
  {
    id: 'tidy', world: 'forge',
    match: /\b(clean|tidy|declutter|laundry|dishes|vacuum|room|desk|organi[sz]e|sort|mess|kitchen|bathroom|bed)\b/i,
    steps: () => [
      { text: 'Stand up and look at the space for 10 seconds, no judging', minutes: 1 },
      { text: 'Grab a bag or basket and walk it to where the mess is', minutes: 1 },
      { text: 'Collect all obvious trash and put it in the bag', minutes: 3 },
      { text: 'Gather anything that belongs in another room into one pile', minutes: 3 },
      { text: 'Put away just five things from the pile', minutes: 4 },
      { text: 'Wipe or tidy one surface you can see', minutes: 3 },
      { text: 'Step back and enjoy what you changed', minutes: 1 },
    ],
  },
  {
    id: 'inbox', world: 'forge',
    match: /\b(email|emails|inbox|reply|respond|message|messages|text|dm)\b/i,
    steps: (t) => [
      { text: 'Open your inbox and just look. Nothing to do yet', minutes: 1 },
      { text: `Find the one message most connected to "${t}"`, minutes: 2 },
      { text: 'Write a first line, even if it is only "Hi,"', minutes: 2 },
      { text: 'Write the one thing you most need to say', minutes: 4 },
      { text: 'Read it once, out loud in your head, and fix one thing', minutes: 2 },
      { text: 'Press send, then take a slow breath', minutes: 1 },
    ],
  },
  {
    id: 'study', world: 'island',
    match: /\b(study|homework|essay|read|reading|revise|exam|assignment|write|writing|report|thesis|paper|learn|course)\b/i,
    steps: (t) => [
      { text: 'Gather what you need for it and put it in front of you', minutes: 2 },
      { text: 'Write the exact name of the task at the top of a blank page', minutes: 1 },
      { text: `Write 3 messy bullet points about "${t}"`, minutes: 3 },
      { text: 'Pick just the first bullet and work on it for 10 minutes', minutes: 10 },
      { text: 'Stand, stretch, and sip some water', minutes: 2 },
      { text: 'Do one more round on the next bullet', minutes: 10 },
      { text: 'Write one line about where to pick this up next time', minutes: 2 },
    ],
  },
  {
    id: 'move', world: 'forest',
    match: /\b(exercise|workout|walk|run|gym|stretch|yoga|jog|bike|swim|outside|hike|move)\b/i,
    steps: () => [
      { text: 'Put on shoes or something comfy to move in', minutes: 2 },
      { text: 'Fill a water bottle or cup', minutes: 1 },
      { text: 'Step outside, or to your movement spot', minutes: 1 },
      { text: 'Move gently for just 3 minutes', minutes: 3 },
      { text: 'Decide: stop here (that counts) or add 5 more minutes', minutes: 1 },
      { text: 'Cool down with three slow breaths', minutes: 1 },
    ],
  },
  {
    id: 'eat', world: 'garden',
    match: /\b(cook|meal|dinner|lunch|breakfast|eat|food|snack|groceries|shopping|shop|prep)\b/i,
    steps: () => [
      { text: 'Decide on the simplest version of the meal. Easy is great', minutes: 2 },
      { text: 'Take out only the first ingredient or item', minutes: 1 },
      { text: 'Take out the rest and put them in one place', minutes: 2 },
      { text: 'Do the first cooking or buying action, nothing else', minutes: 5 },
      { text: 'Finish the meal or the shop in your own time', minutes: 10 },
      { text: 'Sit down and enjoy the first bite or return home', minutes: 2 },
    ],
  },
  {
    id: 'selfcare', world: 'sanctuary',
    match: /\b(shower|bath|teeth|brush|hair|sleep|bed|rest|nap|meds|medication|therapy|doctor|appointment|self[- ]?care|hygiene)\b/i,
    steps: () => [
      { text: 'Tell yourself: this is for the version of you who is coming next', minutes: 1 },
      { text: 'Lay out what you need within arm\u2019s reach', minutes: 2 },
      { text: 'Do the very first action only', minutes: 3 },
      { text: 'Keep going at the gentlest pace you can', minutes: 8 },
      { text: 'Finish with something cosy: a towel, a blanket, a warm drink', minutes: 3 },
    ],
  },
  {
    id: 'admin', world: 'forge',
    match: /\b(bill|bills|pay|taxes|tax|form|forms|paperwork|admin|budget|call|phone|book|renew|apply|application|insurance)\b/i,
    steps: (t) => [
      { text: `Write down exactly what "${t}" needs, as one sentence`, minutes: 2 },
      { text: 'Collect any numbers, logins or papers you will need', minutes: 4 },
      { text: 'Open the website, app or phone keypad', minutes: 1 },
      { text: 'Do the first field, button or sentence', minutes: 3 },
      { text: 'Continue until you hit something unclear, then note it down', minutes: 8 },
      { text: 'Put the finished thing, or your note, somewhere you will see it', minutes: 1 },
    ],
  },
  {
    id: 'project', world: 'island',
    match: /\b(project|work|presentation|slides|plan|planning|launch|build|design|prepare|proposal|meeting|code)\b/i,
    steps: (t) => [
      { text: `Write "${t}" at the top of a blank page`, minutes: 1 },
      { text: 'Brain-dump every piece you can think of, in any order', minutes: 4 },
      { text: 'Circle the one piece that would feel best to finish first', minutes: 2 },
      { text: 'Break that piece into three even smaller bits', minutes: 3 },
      { text: 'Do the first bit for 10 minutes on a timer', minutes: 10 },
      { text: 'Write a single sentence about what is next', minutes: 2 },
    ],
  },
]

const GENERIC = (t: string): DraftStep[] => [
  { text: 'Take one slow breath and name the task out loud', minutes: 1 },
  { text: `Gather the first thing you need for "${t}"`, minutes: 2 },
  { text: 'Set a gentle 5 minute timer', minutes: 1 },
  { text: 'Do the smallest first action you can think of', minutes: 5 },
  { text: 'Decide whether to continue, rest, or stop here. All are fine', minutes: 1 },
  { text: 'Tidy up what you used and note what comes next', minutes: 2 },
]

export function detectWorld(task: string): WorldId {
  return ARCHETYPES.find((a) => a.match.test(task))?.world ?? 'forge'
}

export function titleFor(task: string): string {
  const t = task.trim().replace(/\s+/g, ' ').replace(/[.!]+$/, '')
  if (!t) return 'A small quest'
  const cap = t.charAt(0).toUpperCase() + t.slice(1)
  return cap.length > 60 ? cap.slice(0, 57) + '...' : cap
}

export function breakDown(task: string, energy: Energy): DraftStep[] {
  const t = task.trim().replace(/\s+/g, ' ').slice(0, 70) || 'this'
  const arch = ARCHETYPES.find((a) => a.match.test(t))
  const all = arch ? arch.steps(t) : GENERIC(t)
  if (energy === 'tiny') {
    return all.slice(0, 3).map((s) => ({ ...s, minutes: Math.min(s.minutes, 2) }))
  }
  if (energy === 'steady') return all.slice(0, 6)
  return [...all, { text: 'Treat yourself to a small reward you chose in advance', minutes: 2 }]
}

const SHRINKERS: ((t: string) => DraftStep[])[] = [
  (t) => [
    { text: 'Just get up, or shift position, to be ready', minutes: 1 },
    { text: `Touch the first thing you need for: ${lower(t)}`, minutes: 1 },
    { text: 'Do it for two minutes only, then decide', minutes: 2 },
  ],
  (t) => [
    { text: 'Look at it for 10 seconds without doing anything', minutes: 1 },
    { text: `Do only the first tiny piece of: ${lower(t)}`, minutes: 2 },
  ],
  (t) => [
    { text: 'Say out loud what the first move would be', minutes: 1 },
    { text: `Make that one move for: ${lower(t)}`, minutes: 2 },
    { text: 'Pause and breathe. Everything past this is a bonus', minutes: 1 },
  ],
]

function lower(t: string) {
  return t.charAt(0).toLowerCase() + t.slice(1)
}

let shrinkIdx = 0
export function shrink(stepText: string): DraftStep[] {
  const fn = SHRINKERS[shrinkIdx % SHRINKERS.length]
  shrinkIdx += 1
  return fn(stepText)
}

/* ---------- Lumi's voice ---------- */

export type Intent = 'overwhelmed' | 'stuck' | 'break' | 'celebrate' | 'tired' | 'distracted' | 'hello' | 'task'

export function classify(text: string): Intent {
  const t = text.toLowerCase()
  if (/(overwhelm|too much|so much|panic|anxious|stress|can.?t cope|drowning)/.test(t)) return 'overwhelmed'
  if (/(stuck|can.?t start|don.?t know where|procrastinat|avoid|frozen|paraly)/.test(t)) return 'stuck'
  if (/(tired|exhaust|burn|drained|no energy|sleepy)/.test(t)) return 'tired'
  if (/(distract|focus|scatter|wander|adhd|brain)/.test(t) && t.split(' ').length < 9) return 'distracted'
  if (/(break|rest|pause|snack|stretch)/.test(t) && t.split(' ').length < 6) return 'break'
  if (/(did it|done|finished|proud|celebrate|yay)/.test(t) && t.split(' ').length < 8) return 'celebrate'
  if (/^(hi|hello|hey|yo|good (morning|evening|night))\b/.test(t) && t.split(' ').length < 4) return 'hello'
  return 'task'
}

const pick = <T,>(arr: T[], seed: number) => arr[Math.abs(seed) % arr.length]

export function replyFor(intent: Intent, name: string, seed = Date.now()): string {
  const n = name || 'friend'
  switch (intent) {
    case 'overwhelmed':
      return pick(
        [
          `That sounds like a lot, ${n}. Let\u2019s make it smaller than a whole to-do list. Tell me just one thing that is on your mind, and we will cut it into tiny steps.`,
          `Deep breath first. You do not have to carry all of it today. Name one thing, any thing, and I will shrink it for you.`,
        ],
        seed,
      )
    case 'stuck':
      return pick(
        [
          `Being stuck is not a flaw, it is a signal that the first step is too big. Tell me the task and I will make the first step almost silly.`,
          `Let\u2019s trick the starting line. What is the task? I will give you a step that takes under two minutes.`,
        ],
        seed,
      )
    case 'tired':
      return `Tired is allowed. Choose the Tiny energy level and we will only plan three gentle steps, or visit the Moonlight Sanctuary to breathe for a minute. Both count.`
    case 'distracted':
      return `Wandering minds find the most interesting things. On Focus Island you can park stray thoughts in a bottle and return to them later. Want to set sail for five minutes?`
    case 'break':
      return `Rest is part of the quest. Stand, stretch, sip some water. When you are back, your quests will be right here, exactly as you left them.`
    case 'celebrate':
      return `That is wonderful, ${n}. I mean it: every step you finish lights something in the realm. Go and look at what has changed.`
    case 'hello':
      return `Hello, ${n}. I am glad you are here. Tell me one thing you would like help with, and I will cut it into small, magical steps.`
    default:
      return `Here is a gentle path for that. Change anything that does not feel right, then forge it into a quest.`
  }
}

export const NUDGES = [
  'Small steps are still steps.',
  'You can stop at any time. Nothing is lost.',
  'One tiny thing is enough for today.',
  'You showed up. That is the brave part.',
  'Slow is a speed, too.',
  'Your pace is the right pace.',
]

export function nudge(seed: number): string {
  return NUDGES[Math.abs(seed) % NUDGES.length]
}
