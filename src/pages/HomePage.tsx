import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { APP_NAME } from '@/lib/constants'
import { Button } from '@/components/ui'

export function HomePage() {
  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <h1 className="text-4xl font-semibold text-neutral-900">{APP_NAME}</h1>
      <p className="max-w-md text-neutral-500">
        Explora y descubre materiales para tus proyectos de diseño interior.
      </p>
      <Link to={PATHS.CATALOG}>
        <Button size="lg">Ver catálogo</Button>
      </Link>
    </div>
  )
}
