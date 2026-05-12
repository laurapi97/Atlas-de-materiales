import type { Material } from '@/types'
import { MaterialCard } from './MaterialCard'

interface MaterialGridProps {
  materials: Material[]
  onSelectMaterial?: (material: Material) => void
}

export function MaterialGrid({ materials, onSelectMaterial }: MaterialGridProps) {
  if (materials.length === 0) {
    return (
      <div className="flex items-center justify-center py-24 text-neutral-400">
        <p>No se encontraron materiales</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {materials.map((material) => (
        <MaterialCard key={material.id} material={material} onClick={onSelectMaterial} />
      ))}
    </div>
  )
}
