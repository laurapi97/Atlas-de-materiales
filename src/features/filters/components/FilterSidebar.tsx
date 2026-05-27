import { useMemo } from 'react'
import { Chip } from '@/components/ui/Chip'
import type { Material, MaterialFilters } from '@/types'

type SetFilterKey = 'atmosfera' | 'certificaciones'
type SingleFilterKey = 'familia'
type ScoreFilterKey = 'minHumedad' | 'minDurabilidad' | 'minMantenimiento' | 'minCalidez' | 'minExpresividad' | 'minAcustica' | 'minSostenibilidad'

interface FilterSidebarProps {
  materials: Material[]
  filters: MaterialFilters
  total: number
  shown: number
  onUpdate: (patch: Partial<MaterialFilters>) => void
  onToggleSet: (key: SetFilterKey, value: string) => void
  onToggleSingle: (key: SingleFilterKey, value: string) => void
  onUpdateScore: (key: ScoreFilterKey, value: number) => void
  onReset: () => void
  filterActive: boolean
}

function derive(materials: Material[], pick: (m: Material) => string[]): string[] {
  return [...new Set(materials.flatMap(pick).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'es'))
}

function ScoreSlider({
  label, scoreKey, value, onUpdate,
}: Readonly<{
  label: string
  scoreKey: ScoreFilterKey
  value: number
  onUpdate: (key: ScoreFilterKey, v: number) => void
}>) {
  return (
    <div className="score-filter">
      <div className="score-header">
        <span className="score-lbl">{label}</span>
        <span className="score-val">{value === 0 ? '—' : `≥ ${value}`}</span>
      </div>
      <input
        type="range"
        min={0}
        max={5}
        step={1}
        value={value}
        onChange={(e) => onUpdate(scoreKey, Number(e.target.value))}
        className="score-range"
        style={{ '--pct': `${(value / 5) * 100}%` } as React.CSSProperties}
        aria-label={label}
      />
    </div>
  )
}

export function FilterSidebar({
  materials, filters, total, shown,
  onUpdate, onToggleSet, onToggleSingle, onUpdateScore, onReset, filterActive,
}: Readonly<FilterSidebarProps>) {
  // Familias derivadas de los datos reales de Supabase
  const availableFamilias = useMemo(
    () => derive(materials, (m) => [m.category]),
    [materials],
  )
  const availableAtmosfera = useMemo(() => derive(materials, (m) => m.emotions), [materials])
  const availableCerts = useMemo(() => derive(materials, (m) => m.certificaciones ?? []), [materials])

  const scoreActive = [
    filters.minHumedad, filters.minDurabilidad, filters.minMantenimiento,
    filters.minCalidez, filters.minExpresividad, filters.minAcustica, filters.minSostenibilidad,
  ].some((v) => v > 0)

  return (
    <aside className="sidebar">
      <input
        className="search"
        placeholder="Buscar material…"
        value={filters.search}
        onChange={(e) => onUpdate({ search: e.target.value })}
      />

      {/* Familia material — valores reales de la BD */}
      <details open>
        <summary className="filter-summary">
          Familia material
          {filters.familia && <span className="filter-badge">1</span>}
        </summary>
        <div className="chiprow">
          {availableFamilias.map((f) => (
            <Chip
              key={f}
              on={filters.familia?.toLowerCase() === f.toLowerCase()}
              onClick={() => onToggleSingle('familia', f)}
              variant="cat"
            >
              {f}
            </Chip>
          ))}
        </div>
      </details>

      {/* Puntajes */}
      <details open={scoreActive}>
        <summary className="filter-summary">
          Puntajes
          {scoreActive && <span className="filter-badge">·</span>}
        </summary>
        <div className="score-group">
          <ScoreSlider label="Humedad" scoreKey="minHumedad" value={filters.minHumedad} onUpdate={onUpdateScore} />
          <ScoreSlider label="Durabilidad" scoreKey="minDurabilidad" value={filters.minDurabilidad} onUpdate={onUpdateScore} />
          <ScoreSlider label="Mantenimiento" scoreKey="minMantenimiento" value={filters.minMantenimiento} onUpdate={onUpdateScore} />
          <ScoreSlider label="Calidez" scoreKey="minCalidez" value={filters.minCalidez} onUpdate={onUpdateScore} />
          <ScoreSlider label="Expresividad" scoreKey="minExpresividad" value={filters.minExpresividad} onUpdate={onUpdateScore} />
          <ScoreSlider label="Acústica" scoreKey="minAcustica" value={filters.minAcustica} onUpdate={onUpdateScore} />
          <ScoreSlider label="Sostenibilidad" scoreKey="minSostenibilidad" value={filters.minSostenibilidad} onUpdate={onUpdateScore} />
        </div>
      </details>

      {/* Atmósfera */}
      {availableAtmosfera.length > 0 && (
        <details>
          <summary className="filter-summary">
            Atmósfera
            {filters.atmosfera.size > 0 && <span className="filter-badge">{filters.atmosfera.size}</span>}
          </summary>
          <div className="chiprow">
            {availableAtmosfera.map((a) => (
              <Chip key={a} on={filters.atmosfera.has(a)} onClick={() => onToggleSet('atmosfera', a)}>
                {a}
              </Chip>
            ))}
          </div>
        </details>
      )}

      {/* Certificaciones */}
      {availableCerts.length > 0 && (
        <details>
          <summary className="filter-summary">
            Certificaciones
            {filters.certificaciones.size > 0 && <span className="filter-badge">{filters.certificaciones.size}</span>}
          </summary>
          <div className="chiprow">
            {availableCerts.map((c) => (
              <Chip key={c} on={filters.certificaciones.has(c)} onClick={() => onToggleSet('certificaciones', c)}>
                {c}
              </Chip>
            ))}
          </div>
        </details>
      )}

      {filterActive && (
        <button type="button" className="clear" onClick={onReset}>
          Limpiar filtros ✕
        </button>
      )}

      <div className="summary-row">
        <div>
          <div className="num">
            {String(shown).padStart(2, '0')}
            <span style={{ color: 'var(--muted-soft)' }}>/{String(total).padStart(2, '0')}</span>
          </div>
          <div className="lbl">Materiales en vista</div>
        </div>
      </div>
    </aside>
  )
}
