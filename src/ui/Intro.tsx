import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lumi from '@/art/Lumi'
import { Crescent, Divider, Sparkles, Star, Sunburst } from '@/art/Ornaments'
import WorldScene from '@/art/WorldScene'
import { actions } from '@/game/store'

const PROLOGUE = [
  'Long ago the realm of Lunita fell quiet. Its lanterns dimmed and its gardens slept. Nothing broke it. It was only waiting for someone to take a first small step.',
  'I am Lumi, a wisp of moonlight. I help heavy things become light. Tell me what feels too big, and we will cut it into steps you can hold in one hand.',
  'There are no streaks to keep here and nothing to lose. You can rest, wander off, and come back any time, and your realm will have been waiting, warm and glowing.',
]

export default function Intro() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <Sunburst size={900} color="#b8893a" className="pointer-events-none absolute left-1/2 top-[-260px] -translate-x-1/2 opacity-[0.13] anim-spin-slow" />
      <Sparkles count={8} />
      <div className="relative mx-auto flex min-h-dvh max-w-5xl flex-col items-center justify-center gap-8 px-5 py-10 md:flex-row md:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="relative w-[78%] max-w-[330px] shrink-0 md:w-[340px]"
        >
          <div className="absolute -inset-3 rounded-t-full border border-gold-500/70" />
          <WorldScene world="forest" stage={3} className="aspect-[3/4] w-full !rounded-b-[3px] !rounded-t-full">
            <div className="absolute inset-x-0 bottom-3 flex justify-center">
              <Lumi size={92} mood="happy" />
            </div>
          </WorldScene>
          <Crescent size={34} color="#b8893a" className="absolute -right-5 -top-2 rotate-12" />
          <Star size={20} color="#b8893a" className="anim-twinkle absolute -left-6 top-14" />
        </motion.div>

        <div className="w-full max-w-md text-center md:text-left">
          <p className="small-caps text-base text-burgundy-600">A cozy fantasy of tiny quests</p>
          <h1 className="mt-1 font-display text-[4.4rem] font-semibold leading-none tracking-[0.12em] text-burgundy-700 sm:text-[5.6rem]">LUNITA</h1>
          <Divider className="mt-3 md:justify-start" />
          <p className="mt-4 font-display text-2xl italic text-ink-700">Small Steps. Magical Worlds.</p>

          <div className="page mt-6 min-h-[210px] p-6 text-left">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="s0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
                  <p className="small-caps text-burgundy-600">Before we begin</p>
                  <p className="text-lg leading-relaxed text-ink-700">What shall Lumi call you, traveller?</p>
                  <input
                    className="input-field"
                    placeholder="Your name or nickname"
                    value={name}
                    maxLength={24}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && setStep(1)}
                    aria-label="Your name"
                  />
                  <button className="btn-primary w-full" onClick={() => setStep(1)}>
                    Open the first page
                  </button>
                </motion.div>
              )}
              {step >= 1 && step <= PROLOGUE.length && (
                <motion.div key={`s${step}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                  <p className="small-caps text-burgundy-600">Prologue &middot; {step} of {PROLOGUE.length}</p>
                  <p className={`text-lg leading-relaxed text-ink-800 ${step === 1 ? 'drop-cap' : ''}`}>{PROLOGUE[step - 1]}</p>
                  <div className="flex items-center justify-between gap-3">
                    <button className="btn-ghost" onClick={() => actions.begin(name)}>Skip story</button>
                    <button className="btn-primary" onClick={() => (step === PROLOGUE.length ? actions.begin(name) : setStep(step + 1))}>
                      {step === PROLOGUE.length ? 'Enter the realm' : 'Turn the page'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="mt-4 text-sm italic text-ink-700/70">Your progress is saved on this device. Nothing is ever taken away.</p>
        </div>
      </div>
    </div>
  )
}
