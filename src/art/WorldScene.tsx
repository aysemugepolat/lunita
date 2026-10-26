import type { ReactNode } from 'react'
import type { WorldId } from '@/game/types'
import { ForestScene, ForgeScene } from './ScenesA'
import { GardenScene, IslandScene, SanctuaryScene } from './ScenesB'

interface Props {
  world: WorldId
  stage: number
  className?: string
  children?: ReactNode
  progress?: number
  voyage?: boolean
}

/** Framed cinematic illustration for a world; restoration stage changes the scene. */
export default function WorldScene({ world, stage, className = '', children, progress, voyage }: Props) {
  return (
    <div className={`relative overflow-hidden rounded-[3px] border border-gold-500 bg-ink-900 shadow-page ${className}`}>
      <div className="absolute inset-0">
        {world === 'forest' && <ForestScene stage={stage} />}
        {world === 'forge' && <ForgeScene stage={stage} />}
        {world === 'island' && <IslandScene stage={stage} progress={progress} voyage={voyage} />}
        {world === 'garden' && <GardenScene stage={stage} />}
        {world === 'sanctuary' && <SanctuaryScene stage={stage} />}
      </div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_80px_rgba(18,13,11,0.55)]" />
      <div className="pointer-events-none absolute inset-[6px] border border-gold-400/60" />
      {children}
    </div>
  )
}
