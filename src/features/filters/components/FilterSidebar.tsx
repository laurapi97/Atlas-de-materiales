import { Chip } from '@/components/ui/Chip'
import { VOCAB } from '@/lib/constants'
import type { MaterialFilters } from '@/types'

interface FilterSidebarProps {
  filters: MaterialFilters
  total: number
  shown: number
  onUpdate: (patch: Partial<MaterialFilters>) => void
  onToggleSet: (key: 'tactile' | 'spatial' | 'emotions', value: string) => void
  onToggleSingle: (key: 'category' | 'thermal' | 'durability', value: string) => void
  onReset: () => void
  filterActive: boolean
}

export function FilterSidebar({
  filters, total, shown, onUpdate, onToggleSet, onToggleSingle, onReset, filterActive,
}: FilterSidebarProps) {
  return (
    <aside className="sidebar">
      <input
        className="search"
        placeholder="Buscar material, sensación, emoción…"
        value={filters.search}
        onChange={(e) => onUpdate({ search: e.target.value })}
      />

      <h4>Categoría técnica</h4>
      <div className="chiprow">
        {VOCAB.categories.map((c) => (
          <Chip key={c} on={filters.category === c} onClick={() => onToggleSingle('category', c)} variant="cat">{c}</Chip>
        ))}
      </div>

      <h4>Sensación táctil</h4>
      <div className="chiprow">
        {VOCAB.tactile.map((t) => (
          <Chip key={t} on={filters.tactile.has(t)} onClick={() => onToggleSet('tactile', t)}>{t}</Chip>
        ))}
      </div>

      <h4>Sensación térmica</h4>
      <div className="chiprow">
        {VOCAB.thermal.map((t) => (
          <Chip key={t} on={filters.thermal === t} onClick={() => onToggleSingle('thermal', t)}>{t}</Chip>
        ))}
      </div>

      <h4>Uso espacial</h4>
      <div className="chiprow">
        {VOCAB.spatial.map((s) => (
          <Chip key={s} on={filters.spatial.has(s)} onClick={() => onToggleSet('spatial', s)}>{s}</Chip>
        ))}
      </div>

      <h4>Durabilidad</h4>
      <div className="chiprow">
        {VOCAB.durability.map((d) => (
          <Chip key={d} on={filters.durability === d} onClick={() => onToggleSingle('durability', d)}>{d}</Chip>
        ))}
      </div>

      <h4>Atmósfera / emoción</h4>
      <div className="chiprow">
        {VOCAB.emotions.map((e) => (
          <Chip key={e} on={filters.emotions.has(e)} onClick={() => onToggleSet('emotions', e)}>{e}</Chip>
        ))}
      </div>

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
