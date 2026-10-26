import { useEffect, useRef, useState } from 'react'
import { Send } from 'lucide-react'
import Lumi from '@/art/Lumi'
import { classify, nudge, replyFor } from '@/game/lumi'
import { useGame } from '@/game/store'
import { useNav } from './nav'
import Sheet from './Sheet'
import TaskForge from './TaskForge'

interface Msg {
  id: number
  from: 'lumi' | 'you'
  text: string
  forge?: string
  action?: { label: string; run: () => void }
}

const CHIPS = ['Break down a task', 'I feel overwhelmed', 'I cannot start', 'I need a break']

export default function LumiDrawer({ open, prefill, onClose }: { open: boolean; prefill: string; onClose: () => void }) {
  const { save } = useGame()
  const nav = useNav()
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState('')
  const idRef = useRef(1)
  const endRef = useRef<HTMLDivElement>(null)

  const push = (m: Omit<Msg, 'id'>) => setMsgs((prev) => [...prev, { ...m, id: idRef.current++ }])

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ id: idRef.current++, from: 'lumi', text: `Hello, ${save.name}. Tell me one thing that feels heavy. I will cut it into steps small enough to start right now.` }])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    if (open && prefill) send(prefill)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, prefill])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [msgs])

  function send(raw: string) {
    const t = raw.trim()
    if (!t) return
    push({ from: 'you', text: t })
    setText('')
    const intent = classify(t)
    window.setTimeout(() => {
      if (t === 'Break down a task') {
        push({ from: 'lumi', text: 'Gladly. Type the task in your own words, like "do my taxes" or "clean the kitchen".' })
        return
      }
      if (intent === 'task') {
        push({ from: 'lumi', text: replyFor('task', save.name), forge: t })
        return
      }
      const act =
        intent === 'tired' || intent === 'break'
          ? { label: 'Visit the Sanctuary', run: () => { nav.go('sanctuary'); onClose() } }
          : intent === 'distracted'
            ? { label: 'Sail to Focus Island', run: () => { nav.go('island'); onClose() } }
            : intent === 'celebrate'
              ? { label: 'Look at the realm', run: () => { nav.go('realm'); onClose() } }
              : undefined
      push({ from: 'lumi', text: replyFor(intent, save.name), action: act })
    }, 380)
  }

  return (
    <Sheet open={open} onClose={onClose} title="Lumi" side="right">
      <div className="flex min-h-[60dvh] flex-col gap-4">
        <div className="flex items-center gap-3 rounded-[3px] border border-gold-500/40 bg-burgundy-700/5 p-3">
          <Lumi size={58} mood="happy" />
          <p className="text-sm italic text-ink-700">{nudge(new Date().getDate())}</p>
        </div>
        <div className="flex-1 space-y-4" aria-live="polite">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === 'you' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[92%] rounded-[3px] border p-3.5 ${m.from === 'you' ? 'border-burgundy-700 bg-burgundy-700 text-ivory-100' : 'border-gold-500/50 bg-ivory-50 text-ink-800'}`}>
                <p className="text-[1.05rem] leading-snug">{m.text}</p>
                {m.forge && (
                  <div className="mt-3 border-t border-gold-500/40 pt-3">
                    <TaskForge compact initialTask={m.forge} autoBreak onForged={() => { nav.go('quests'); onClose() }} />
                  </div>
                )}
                {m.action && (
                  <button className="btn-ghost mt-3" onClick={m.action.run}>{m.action.label}</button>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {CHIPS.map((c) => (
            <button key={c} className="min-h-[40px] rounded-full border border-burgundy-600/40 px-3 text-sm text-burgundy-700 hover:bg-burgundy-600/10" onClick={() => send(c)}>
              {c}
            </button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(text) }} className="flex gap-2">
          <input className="input-field" value={text} onChange={(e) => setText(e.target.value)} placeholder="Tell Lumi anything..." maxLength={120} aria-label="Message to Lumi" />
          <button className="btn-primary !px-4" type="submit" aria-label="Send"><Send size={18} /></button>
        </form>
      </div>
    </Sheet>
  )
}
