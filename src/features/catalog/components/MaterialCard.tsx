import type { Material } from '@/types'

interface MaterialCardProps {
  material: Material
  onClick?: (material: Material) => void
}

export function MaterialCard({ material, onClick }: MaterialCardProps) {
  return (
    <article
      className="cursor-pointer overflow-hidden rounded-lg border border-neutral-200 transition-colors hover:border-neutral-400"
      onClick={() => onClick?.(material)}
    >
      <div className="aspect-square bg-neutral-100">
        {material.thumbnailUrl && (
          <img
            src={material.thumbnailUrl}
            alt={material.name}
            className="h-full w-full object-cover"
          />
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-medium text-neutral-900">{material.name}</h3>
        <p className="mt-1 text-xs text-neutral-500">{material.category}</p>
      </div>
    </article>
  )
}
