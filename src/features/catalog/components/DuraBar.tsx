import type { MaterialDurability } from '@/types'

const LEVEL: Record<MaterialDurability, number> = { baja: 1, media: 2, alta: 3 }

interface DuraBarProps {
  level: MaterialDurability
}

export function DuraBar({ level }: DuraBarProps) {
  const n = LEVEL[level] ?? 0
  return (
    <div className="dura-bar" aria-label={`durabilidad ${level}`}>
      {[1, 2, 3].map((i) => (
        <i key={i} className={i <= n ? 'fill' : ''} />
      ))}
    </div>
  )
}
