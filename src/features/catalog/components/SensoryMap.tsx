import { useState } from 'react'
import type { Material, MaterialFilters } from '@/types'
import { applyFilters, materialPosition } from '../utils/filters'

interface SensoryMapProps {
  materials: Material[]
  filters: MaterialFilters
  compareSet: Set<string>
  onOpen: (id: string) => void
}

function MapDot({ m, dim, cmp, onOpen }: Readonly<{ m: Material; dim: boolean; cmp: boolean; onOpen: () => void }>) {
  const [imgErr, setImgErr] = useState(false)
  const showImg = !!m.coverImage && !imgErr
  const p = materialPosition(m)

  return (
    <button
      type="button"
      className={'map-dot' + (dim ? ' dim' : '') + (cmp ? ' compare-on' : '')}
      style={{
        padding: 0,
        left: `${p.x * 100}%`,
        top: `${p.y * 100}%`,
        background: m.swatch.css,
        backgroundColor: m.swatch.base,
        backgroundBlendMode: m.swatch.blend || 'normal',
      }}
      onClick={onOpen}
      aria-label={m.name}
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
      <span className="lbl">{m.name}</span>
    </button>
  )
}

export function SensoryMap({ materials, filters, compareSet, onOpen }: Readonly<SensoryMapProps>) {
  const filtered = applyFilters(materials, filters)
  const filteredIds = new Set(filtered.map((m) => m.id))
  return (
    <div className="main">
      <div className="section-head">
        <h1>Mapa <span className="it">sensorial</span></h1>
        <div className="meta">
          <div><b>{String(filtered.length).padStart(2, '0')}</b> activos · {String(materials.length).padStart(2, '00')} totales</div>
          <div style={{ marginTop: 6 }}>distribución por emoción × térmica</div>
        </div>
      </div>

      <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-soft)', maxWidth: '68ch', marginTop: 0, marginBottom: 24 }}>
        Cada material se posiciona según su carga emocional dominante (eje horizontal)
        y su temperatura percibida (eje vertical). Los filtros del panel izquierdo atenúan
        los materiales que no aplican.
      </p>

      <div className="map-wrap">
        <div className="map-grid" />
        <div className="map-cross h" />
        <div className="map-cross v" />
        <div className="map-axis x-l">← introspectivo</div>
        <div className="map-axis x-r">expresivo →</div>
        <div className="map-axis y-t">↑ cálido</div>
        <div className="map-axis y-b">↓ frío</div>

        {materials.map((m) => (
          <MapDot
            key={m.id}
            m={m}
            dim={!filteredIds.has(m.id)}
            cmp={compareSet.has(m.id)}
            onOpen={() => onOpen(m.id)}
          />
        ))}

        <div className="map-legend">
          <h5>Lectura</h5>
          <div>X · introspección → dinamismo</div>
          <div>Y · cálido → frío</div>
          <div style={{ color: 'var(--muted)' }}>click sobre un punto para abrir</div>
        </div>
      </div>

    </div>
  )
}
