import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Anchor, Flower2, Gem as GemIcon, Hammer, Library as LibraryIcon, Map as MapIcon, Moon, ScrollText, Settings as Cog, Sparkles as SparkIcon, TreePine, Lock, Volume2, VolumeX } from 'lucide-react'
import { toast } from 'sonner'
import Lumi from '@/art/Lumi'
import { Crescent } from '@/art/Ornaments'
import { WORLDS } from '@/game/data'
import { actions, isUnlocked, totalCrystals, useGame } from '@/game/store'
import { setAmbient, sfx, type AmbientId } from '@/game/sound'
import CharacterSheet from '@/characters/ui/CharacterSheet'
import CompanionDock from '@/characters/ui/CompanionDock'
import CompanionSelect from '@/characters/ui/CompanionSelect'
import CelebrationModal from './CelebrationModal'
import ChapterReader from './ChapterReader'
import Hud from './Hud'
import LumiDrawer from './LumiDrawer'
import { NavContext, type View } from './nav'
import SettingsModal from './SettingsModal'
import Collection from '@/views/Collection'
import Forest from '@/views/Forest'
import Forge from '@/views/Forge'
import Garden from '@/views/Garden'
import Island from '@/views/Island'
import Library from '@/views/Library'
import Quests from '@/views/Quests'
import Realm from '@/views/Realm'
import Sanctuary from '@/views/Sanctuary'

const WORLD_ICON = { forest: TreePine, forge: Hammer, island: Anchor, garden: Flower2, sanctuary: Moon } as const

export default function Shell() {
  const { save } = useGame()
  const [view, setView] = useState<View>('realm')
  const [lumiOpen, setLumiOpen] = useState(false)
  const [prefill, setPrefill] = useState('')
  const [chapter, setChapter] = useState<string | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [charId, setCharId] = useState<string | null>(null)
  const [companionsOpen, setCompanionsOpen] = useState(false)

  const soundOn = save.settings.sound
  const ambientOn = save.settings.ambient && save.settings.sound
  const ambientId: AmbientId = view in WORLDS ? (view as keyof typeof WORLDS) : 'realm'
  useEffect(() => {
    setAmbient(ambientId, ambientOn)
  }, [ambientId, ambientOn])

  const go = useCallback(
    (v: View) => {
      if (v in WORLDS && !isUnlocked(save, v as keyof typeof WORLDS)) {
        const w = WORLDS[v as keyof typeof WORLDS]
        const left = w.unlockAt - totalCrystals(save)
        toast(`${w.name} is still dreaming`, { description: `Gather ${left} more crystal${left === 1 ? '' : 's'} and Lumi will wake it. Any quest or game gives one.` })
        return
      }
      sfx(save.settings.sound, 'nav')
      setView(v)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [save],
  )

  const api = useMemo(
    () => ({
      view,
      go,
      openLumi: (p?: string) => {
        setPrefill(p ?? '')
        setLumiOpen(true)
      },
      openChapter: (id: string) => setChapter(id),
      openSettings: () => setSettingsOpen(true),
      openCharacter: (id: string) => setCharId(id),
      openCompanions: () => setCompanionsOpen(true),
    }),
    [view, go],
  )

  const tabs: { id: View; label: string; icon: typeof MapIcon; locked?: boolean }[] = [
    { id: 'realm', label: 'Realm', icon: MapIcon },
    ...(Object.keys(WORLDS) as (keyof typeof WORLDS)[]).map((w) => ({ id: w as View, label: WORLDS[w].short, icon: WORLD_ICON[w], locked: !isUnlocked(save, w) })),
    { id: 'quests', label: 'Quests', icon: ScrollText },
    { id: 'library', label: 'Library', icon: LibraryIcon },
    { id: 'collection', label: 'Treasures', icon: GemIcon },
  ]

  return (
    <NavContext.Provider value={api}>
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(40)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="#000" strokeOpacity=".18" strokeWidth="1.2" />
          </pattern>
        </defs>
      </svg>
      <div className="mx-auto min-h-dvh max-w-6xl px-3 pb-36 sm:px-6">
        <header className="flex items-center justify-between gap-2 py-3 sm:gap-3 sm:py-4">
          <button className="flex items-center gap-2.5 text-left" onClick={() => go('realm')} aria-label="LUNITA, go to the realm map">
            <Crescent size={26} color="#6b1a2d" className="hidden min-[400px]:block" />
            <span>
              <span className="block font-display text-[1.35rem] font-semibold leading-none tracking-[0.12em] text-burgundy-700 sm:text-[1.7rem] sm:tracking-[0.16em]">LUNITA</span>
              <span className="small-caps hidden text-xs text-ink-700/70 sm:block">Small steps. Magical worlds.</span>
            </span>
          </button>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Hud />
            <button
              className="btn-ghost !min-h-[44px] !w-11 !shrink-0 !p-0"
              aria-pressed={soundOn}
              aria-label={soundOn ? 'Turn sound off' : 'Turn sound on'}
              title={soundOn ? 'Sound on' : 'Sound off'}
              onClick={() => {
                const next = !soundOn
                actions.setSetting('sound', next)
                actions.setSetting('ambient', next)
              }}
            >
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
            <button className="btn-ghost !min-h-[44px] !w-11 !shrink-0 !p-0" onClick={() => setSettingsOpen(true)} aria-label="Settings">
              <Cog size={18} />
            </button>
          </div>
        </header>

        <nav className="sticky top-0 z-30 -mx-3 border-y border-gold-500/50 bg-ivory-100/90 px-3 backdrop-blur-md sm:-mx-6 sm:px-6" aria-label="Worlds">
          <ul className="scrollbar-none mx-auto flex max-w-6xl gap-1 overflow-x-auto py-1.5 md:justify-center">
            {tabs.map((t) => {
              const active = view === t.id
              const Icon = t.icon
              return (
                <li key={t.id}>
                  <button
                    onClick={() => go(t.id)}
                    aria-current={active ? 'page' : undefined}
                    className={`relative flex min-h-[52px] min-w-[68px] flex-col items-center justify-center gap-0.5 rounded-[3px] px-3 py-1 transition-colors ${active ? 'bg-burgundy-700 text-ivory-100' : 'text-burgundy-700 hover:bg-burgundy-600/10'} ${t.locked ? 'opacity-55' : ''}`}
                  >
                    {t.locked ? <Lock size={16} /> : <Icon size={18} />}
                    <span className="small-caps text-[0.82rem] leading-none">{t.label}</span>
                    {active && <motion.span layoutId="nav-underline" className="absolute inset-x-2 -bottom-0.5 h-[2px] bg-gold-400" />}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <main className="pt-6">
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              {view === 'realm' && <Realm />}
              {view === 'forest' && <Forest />}
              {view === 'forge' && <Forge />}
              {view === 'island' && <Island />}
              {view === 'garden' && <Garden />}
              {view === 'sanctuary' && <Sanctuary />}
              {view === 'quests' && <Quests />}
              {view === 'library' && <Library />}
              {view === 'collection' && <Collection />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <button
        onClick={() => api.openLumi()}
        className="fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full border border-gold-400 bg-burgundy-800 py-1.5 pl-1.5 pr-4 text-ivory-100 shadow-gold transition hover:brightness-110"
        aria-label="Talk to Lumi"
      >
        <span className="grid h-12 w-12 place-items-center rounded-full bg-ivory-100/95">
          <Lumi size={44} float={false} />
        </span>
        <span className="font-display text-lg font-semibold">Ask Lumi</span>
        <SparkIcon size={16} className="text-gold-300" />
      </button>

      <LumiDrawer open={lumiOpen} prefill={prefill} onClose={() => setLumiOpen(false)} />
      <CompanionDock />
      <CharacterSheet id={charId} onClose={() => setCharId(null)} />
      <CompanionSelect key={String(companionsOpen)} open={companionsOpen} onClose={() => setCompanionsOpen(false)} />
      <ChapterReader id={chapter} onClose={() => setChapter(null)} />
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
      <CelebrationModal />
    </NavContext.Provider>
  )
}
