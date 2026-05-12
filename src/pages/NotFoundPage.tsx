import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { Button } from '@/components/ui'

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <h1 className="text-6xl font-semibold text-neutral-200">404</h1>
      <p className="text-neutral-500">Esta página no existe</p>
      <Link to={PATHS.HOME}>
        <Button variant="secondary">Ir al inicio</Button>
      </Link>
    </div>
  )
}
