import { useNavigate } from 'react-router-dom'
import { MaterialGrid, useMaterials } from '@/features/catalog'
import { FilterBar, useFilters } from '@/features/filters'
import type { Material } from '@/types'
import { materialDetailPath } from '@/routes/paths'

export function CatalogPage() {
  const navigate = useNavigate()
  const { activeFilters, materialFilters, setCategory, setFinish, setSearch, resetFilters } =
    useFilters()
  const { materials, isLoading, error } = useMaterials(materialFilters)

  function handleSelectMaterial(material: Material) {
    navigate(materialDetailPath(material.slug))
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Catálogo</h1>

      <FilterBar
        activeFilters={activeFilters}
        onCategoryChange={setCategory}
        onFinishChange={setFinish}
        onSearchChange={setSearch}
        onReset={resetFilters}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-neutral-400">
          <p>Cargando materiales...</p>
        </div>
      ) : (
        <MaterialGrid materials={materials} onSelectMaterial={handleSelectMaterial} />
      )}
    </div>
  )
}
