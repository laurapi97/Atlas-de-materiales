import type { Material } from '@/types'

interface MaterialCardProps {
  material: Material
  index: number
  inCompare: boolean
  onOpen: (id: string) => void
  onToggleCompare: (id: string) => void
}

export function MaterialCard({ material: m, index, inCompare, onOpen, onToggleCompare }: MaterialCardProps) {
  return (
    <button
      className="card"
      onClick={() => onOpen(m.id)}
      style={{ animationDelay: `${Math.min(index, 12) * 30}ms` }}
    >
      <div
        className="swatch"
        style={{
          background: m.swatch.css,
          backgroundColor: m.swatch.base,
          backgroundBlendMode: m.swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal',
        }}
      >
        <span className="num">№ {String(index + 1).padStart(3, '0')}</span>
        <div className="actions">
          <button
            type="button"
            className={inCompare ? 'on' : ''}
            title="Añadir a comparación"
            onClick={(e) => { e.stopPropagation(); onToggleCompare(m.id) }}
          >
            {inCompare ? '✓' : '+'}
          </button>
        </div>
      </div>
      <div className="info">
        <div className="name">{m.name}</div>
        <div className="cat">{m.category}</div>
      </div>
      <div className="desc">{m.short}</div>
      <div className="tagrow">
        {m.emotions.slice(0, 3).map((e) => <span key={e}>{e}</span>)}
      </div>
    </button>
  )
}
