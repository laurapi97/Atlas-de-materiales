import type { Material } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { DuraBar } from './DuraBar'

interface MaterialCompareProps {
  materials: Material[]
  compare: string[]
  onToggleCompare: (id: string) => void
  onOpen: (id: string) => void
}

const ROWS = [
  { k: 'swatch',     h: 'Muestra' },
  { k: 'name',       h: 'Material' },
  { k: 'short',      h: 'Descripción' },
  { k: 'tactile',    h: 'Tacto' },
  { k: 'thermal',    h: 'Térmica' },
  { k: 'spatial',    h: 'Uso espacial' },
  { k: 'durability', h: 'Durabilidad' },
  { k: 'emotions',   h: 'Emociones' },
  { k: 'physical',   h: 'Físicas' },
  { k: 'keywords',   h: 'Vocabulario' },
] as const

export function MaterialCompare({ materials, compare, onToggleCompare, onOpen }: MaterialCompareProps) {
  const items = compare.map((id) => materials.find((m) => m.id === id)).filter((m): m is Material => m != null)
  const cols = Math.max(items.length, 1)

  return (
    <div className="main">
      <div className="section-head">
        <h1>Comparar <span className="it">lado a lado</span></h1>
        <div className="meta">
          <div><b>{items.length}</b>&nbsp;de 4 ranuras</div>
          <div style={{ marginTop: 6 }}>añade desde el catálogo o el mapa</div>
        </div>
      </div>

      <div className="compare-pick">
        <h4>Añadir material rápidamente</h4>
        <div className="pickrow">
          {materials.map((m) => (
            <Chip key={m.id} on={compare.includes(m.id)} onClick={() => onToggleCompare(m.id)}>
              {m.name}
            </Chip>
          ))}
        </div>
      </div>

      <div className="compare-wrap" style={{ '--cols': cols } as React.CSSProperties}>
        {ROWS.map((r) => (
          <div className="row" key={r.k}>
            <div className="cell h">{r.h}</div>
            {items.length === 0 && r.k === 'swatch' && (
              <div className="cell">
                <div className="compare-empty">vacío<small>añade materiales para comparar</small></div>
              </div>
            )}
            {items.map((m) => {
              if (r.k === 'swatch') return (
                <div key={m.id} className="cell swatch-cell" style={{ background: m.swatch.css, backgroundColor: m.swatch.base, backgroundBlendMode: m.swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal' }}>
                  <button type="button" className="x" onClick={() => onToggleCompare(m.id)}>✕</button>
                </div>
              )
              if (r.k === 'name') return (
                <div key={m.id} className="cell name-cell" onClick={() => onOpen(m.id)} style={{ cursor: 'pointer' }}>
                  {m.name}<small>{m.category}</small>
                </div>
              )
              if (r.k === 'short') return <div key={m.id} className="cell" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>{m.short}</div>
              if (r.k === 'tactile') return <div key={m.id} className="cell">{m.tactile.join(' · ')}</div>
              if (r.k === 'thermal') return <div key={m.id} className="cell" style={{ textTransform: 'capitalize' }}>{m.thermal}</div>
              if (r.k === 'spatial') return <div key={m.id} className="cell">{m.spatial.join(' · ')}</div>
              if (r.k === 'durability') return (
                <div key={m.id} className="cell" style={{ textTransform: 'capitalize' }}>
                  {m.durability}<DuraBar level={m.durability} />
                </div>
              )
              if (r.k === 'emotions') return <div key={m.id} className="cell">{m.emotions.join(' · ')}</div>
              if (r.k === 'physical') return (
                <div key={m.id} className="cell" style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.6 }}>
                  ρ {m.physical.density}<br />H {m.physical.hardness}<br />A {m.physical.absorption}
                </div>
              )
              if (r.k === 'keywords') return <div key={m.id} className="cell" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>{m.keywords.map((k) => '#' + k).join(' ')}</div>
              return null
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
