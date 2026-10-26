import { useState } from 'react'
import { actions, useGame } from '@/game/store'
import Sheet from './Sheet'

function Toggle({ label, hint, on, onChange }: { label: string; hint: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-[56px] cursor-pointer items-center justify-between gap-4 border-b border-gold-500/30 py-3">
      <span>
        <span className="block font-display text-xl font-semibold text-ink-800">{label}</span>
        <span className="block text-sm text-ink-700/80">{hint}</span>
      </span>
      <input type="checkbox" className="peer sr-only" checked={on} onChange={(e) => onChange(e.target.checked)} />
      <span className={`relative h-7 w-12 shrink-0 rounded-full border border-burgundy-600/60 transition-colors ${on ? 'bg-burgundy-600' : 'bg-ivory-200'} peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy-600`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-gold-400 shadow transition-all ${on ? 'left-6' : 'left-0.5'}`} />
      </span>
    </label>
  )
}

export default function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { save } = useGame()
  const [confirm, setConfirm] = useState(false)
  return (
    <Sheet open={open} onClose={onClose} title="Gentle settings">
      <Toggle label="Soft chimes" hint="Quiet bell tones for rewards and games." on={save.settings.sound} onChange={(v) => actions.setSetting('sound', v)} />
      <Toggle label="Ambient soundscape" hint="Soft wind, embers, waves, birds and moonlit drones that change with each world." on={save.settings.ambient} onChange={(v) => actions.setSetting('ambient', v)} />
      <label className="flex min-h-[56px] items-center justify-between gap-4 border-b border-gold-500/30 py-3">
        <span className="font-display text-xl font-semibold text-ink-800">Volume</span>
        <input type="range" min={0} max={100} value={Math.round(save.settings.volume * 100)} onChange={(e) => actions.setSetting('volume', Number(e.target.value) / 100)} className="w-40 accent-[#6b1a2d]" aria-label="Volume" />
      </label>
      <Toggle label="Calm motion" hint="Stops drifting and twinkling animations." on={save.settings.calm} onChange={(v) => actions.setSetting('calm', v)} />
      <Toggle label="Gentle vibration" hint="A tiny buzz on rewards, on phones that support it." on={save.settings.haptics} onChange={(v) => actions.setSetting('haptics', v)} />
      <Toggle label="Larger text" hint="Makes reading easier on tired eyes." on={save.settings.bigText} onChange={(v) => actions.setSetting('bigText', v)} />
      <p className="mt-5 text-sm leading-relaxed text-ink-700/80">
        Playing as <b>{save.name}</b>. Progress is saved on this device automatically. LUNITA has no streaks, timers that punish, or lost progress.
      </p>
      <div className="mt-5">
        {!confirm ? (
          <button className="btn-ghost" onClick={() => setConfirm(true)}>Start a fresh realm</button>
        ) : (
          <div className="rounded-[3px] border border-burgundy-600/50 bg-burgundy-600/5 p-4">
            <p className="text-ink-800">This erases quests, garden and treasures on this device. Onchain keepsakes stay in your wallet.</p>
            <div className="mt-3 flex gap-2">
              <button className="btn-primary" onClick={() => { actions.reset(); setConfirm(false); onClose() }}>Yes, begin again</button>
              <button className="btn-ghost" onClick={() => setConfirm(false)}>Keep my realm</button>
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}
