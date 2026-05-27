import type { Material } from '@/types'
import { Chip } from '@/components/ui/Chip'
import { DuraBar } from './DuraBar'
import { useState } from 'react'

interface MaterialCompareProps {
  materials: Material[]
  compare: string[]
  onToggleCompare: (id: string) => void
  onOpen: (id: string) => void
}

function SwatchCell({ m, onRemove }: Readonly<{ m: Material; onRemove: () => void }>) {
  const [imgErr, setImgErr] = useState(false)
  const showImg = !!m.coverImage && !imgErr
  return (
    <div
      className="cell swatch-cell"
      style={{
        background: m.swatch.css,
        backgroundColor: m.swatch.base,
        backgroundBlendMode: m.swatch.blend || 'normal',
      }}
    >
      {showImg && (
        <img
          src={m.coverImage}
          alt={m.name}
          loading="lazy"
          onError={() => setImgErr(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      )}
      <button type="button" className="x" onClick={onRemove}>✕</button>
    </div>
  )
}

// ─── Row definitions ──────────────────────────────────────────────────────────

type RowKey = 'swatch' | 'name' | 'short' | 'tactile' | 'thermal' | 'spatial' | 'durability' | 'emotions' | 'physical' | 'keywords'

const ALL_ROWS: ReadonlyArray<{ k: RowKey; h: string }> = [
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
]

function rowHasContent(m: Material, k: RowKey): boolean {
  switch (k) {
    case 'swatch':
    case 'name':
    case 'thermal':
    case 'durability':  return true
    case 'short':       return !!m.short
    case 'tactile':     return m.tactile.length > 0
    case 'spatial':     return m.spatial.length > 0
    case 'emotions':    return m.emotions.length > 0
    case 'physical':    return [m.physical.density, m.physical.hardness, m.physical.absorption].some((v) => v !== '—')
    case 'keywords':    return m.keywords.length > 0
    default:            return false
  }
}

// ─── Cell atoms ──────────────────────────────────────────────────────────────

const Dash = () => <span style={{ color: 'var(--muted-soft)', fontFamily: 'var(--mono)', fontSize: 11 }}>—</span>

function physicalParts(m: Material): string[] {
  const { density, hardness, absorption } = m.physical
  return [
    density === '—' ? null : `ρ ${density}`,
    hardness === '—' ? null : `H ${hardness}`,
    absorption === '—' ? null : `A ${absorption}`,
  ].filter((p): p is string => p !== null)
}

// ─── Cell lookup — one entry per RowKey, no switch needed ─────────────────────

type CellFn = (m: Material, onOpen: () => void, onRemove: () => void) => React.ReactNode

const CELL: Record<RowKey, CellFn> = {
  swatch: (m, _open, onRemove) => (
    <SwatchCell key={m.id} m={m} onRemove={onRemove} />
  ),
  name: (m, onOpen) => (
    <button key={m.id} type="button" className="cell name-cell" onClick={onOpen}>
      {m.name}<small>{m.category}</small>
    </button>
  ),
  short: (m) => (
    <div key={m.id} className="cell" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>
      {m.short || <Dash />}
    </div>
  ),
  tactile: (m) => (
    <div key={m.id} className="cell">{m.tactile.join(' · ') || <Dash />}</div>
  ),
  thermal: (m) => (
    <div key={m.id} className="cell" style={{ textTransform: 'capitalize' }}>{m.thermal}</div>
  ),
  spatial: (m) => (
    <div key={m.id} className="cell">{m.spatial.join(' · ') || <Dash />}</div>
  ),
  durability: (m) => (
    <div key={m.id} className="cell" style={{ textTransform: 'capitalize' }}>
      {m.durability}<DuraBar level={m.durability} />
    </div>
  ),
  emotions: (m) => (
    <div key={m.id} className="cell">{m.emotions.join(' · ') || <Dash />}</div>
  ),
  physical: (m) => {
    const parts = physicalParts(m)
    return (
      <div key={m.id} className="cell" style={{ fontFamily: 'var(--mono)', fontSize: 11, lineHeight: 1.6 }}>
        {parts.length > 0 ? parts.map((p) => <span key={p} style={{ display: 'block' }}>{p}</span>) : <Dash />}
      </div>
    )
  },
  keywords: (m) => (
    <div key={m.id} className="cell" style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)' }}>
      {m.keywords.map((kw) => `#${kw}`).join(' ') || <Dash />}
    </div>
  ),
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MaterialCompare({ materials, compare, onToggleCompare, onOpen }: Readonly<MaterialCompareProps>) {
  const items = compare
    .map((id) => materials.find((m) => m.id === id))
    .filter((m): m is Material => m != null)
  const cols = Math.max(items.length, 1)

  const visibleRows = items.length === 0
    ? ALL_ROWS.slice(0, 1)
    : ALL_ROWS.filter((r) => items.some((m) => rowHasContent(m, r.k)))

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
        {visibleRows.map((r) => (
          <div className="row" key={r.k}>
            <div className="cell h">{r.h}</div>
            {items.length === 0 ? (
              <div className="cell">
                <div className="compare-empty">
                  vacío<small>añade materiales para comparar</small>
                </div>
              </div>
            ) : (
              items.map((m) => CELL[r.k](m, () => onOpen(m.id), () => onToggleCompare(m.id)))
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
