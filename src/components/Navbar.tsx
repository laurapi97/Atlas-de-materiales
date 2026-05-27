import { Link, useLocation } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

export function Navbar() {
  const location = useLocation()

  return (
    <header className="border-b border-neutral-200 bg-white">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to={PATHS.HOME}>
          <img src="/MORPHE.png" alt="Morphé Studio" style={{ height: 40, width: 'auto' }} />
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
