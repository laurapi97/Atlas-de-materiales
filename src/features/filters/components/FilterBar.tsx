import { MATERIAL_CATEGORIES, MATERIAL_FINISHES } from '@/lib/constants'
import type { ActiveFilters } from '../types'

interface FilterBarProps {
  activeFilters: ActiveFilters
  onCategoryChange: (category: ActiveFilters['category']) => void
  onFinishChange: (finish: ActiveFilters['finish']) => void
  onSearchChange: (search: string) => void
  onReset: () => void
}

export function FilterBar({
  activeFilters,
  onCategoryChange,
  onFinishChange,
  onSearchChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        type="search"
        placeholder="Buscar material..."
        value={activeFilters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="min-w-48 rounded border border-neutral-200 px-3 py-1.5 text-sm"
      />

      <select
        value={activeFilters.category ?? ''}
        onChange={(e) =>
          onCategoryChange((e.target.value as ActiveFilters['category']) || null)
        }
        className="rounded border border-neutral-200 px-3 py-1.5 text-sm"
      >
        <option value="">Todas las categorías</option>
        {MATERIAL_CATEGORIES.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>

      <select
        value={activeFilters.finish ?? ''}
        onChange={(e) =>
          onFinishChange((e.target.value as ActiveFilters['finish']) || null)
        }
        className="rounded border border-neutral-200 px-3 py-1.5 text-sm"
      >
        <option value="">Todos los acabados</option>
        {MATERIAL_FINISHES.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={onReset}
        className="text-sm text-neutral-500 underline hover:text-neutral-900"
      >
        Limpiar
      </button>
    </div>
  )
}
