import { Link, useLocation } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { APP_NAME } from '@/lib/constants'

export function Navbar() {
  const location = useLocation()

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={PATHS.HOME} className="font-semibold text-neutral-900">
          {APP_NAME}
        </Link>
        <ul className="flex items-center gap-6">
          <li>
            <Link
              to={PATHS.CATALOG}
              className={
                location.pathname.startsWith('/catalogo')
                  ? 'text-sm font-medium text-neutral-900'
                  : 'text-sm text-neutral-500 transition-colors hover:text-neutral-900'
              }
            >
              Catálogo
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}
