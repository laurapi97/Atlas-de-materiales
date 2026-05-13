import type { Material } from '@/types'
import { MaterialCard } from './MaterialCard'

interface MaterialGridProps {
  materials: Material[]
  filtered: Material[]
  compareSet: Set<string>
  onOpen: (id: string) => void
  onToggleCompare: (id: string) => void
  onReset: () => void
  filterPills: Array<{ k: string; lbl: string; clear: () => void }>
}

export function MaterialGrid({
  materials, filtered, compareSet, onOpen, onToggleCompare, onReset, filterPills,
}: MaterialGridProps) {
  return (
    <div className="main">
      <div className="section-head">
        <h1>Catálogo <span className="it">general</span></h1>
        <div className="meta">
          <div><b>{String(filtered.length).padStart(2, '0')}</b>&nbsp;de&nbsp;{String(materials.length).padStart(2, '0')} entradas</div>
          <div style={{ marginTop: 6 }}>vol. 01 · ed. 2026</div>
        </div>
      </div>

      {filterPills.length > 0 && (
        <div className="activefilters">
          {filterPills.map((p) => (
            <span key={p.k} className="pill">
              {p.lbl} <button type="button" onClick={p.clear}>✕</button>
            </span>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="empty">
          Ningún material cumple esa combinación.
          <br />
          <button type="button" onClick={onReset}>Reiniciar exploración</button>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((m) => (
            <MaterialCard
              key={m.id}
              material={m}
              index={materials.indexOf(m)}
              inCompare={compareSet.has(m.id)}
              onOpen={onOpen}
              onToggleCompare={onToggleCompare}
            />
          ))}
        </div>
      )}
    </div>
  )
}
