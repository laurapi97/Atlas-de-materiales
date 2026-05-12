import { useParams, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

export function MaterialDetailPage() {
  const { slug } = useParams<{ slug: string }>()

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to={PATHS.CATALOG} className="text-sm text-neutral-500 hover:text-neutral-900">
        ← Volver al catálogo
      </Link>
      <h1 className="mt-6 text-2xl font-semibold text-neutral-900">{slug}</h1>
      <p className="mt-2 text-neutral-500">Detalle del material — en construcción</p>
    </div>
  )
}
