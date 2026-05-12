import { Outlet } from 'react-router-dom'

export function CatalogLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Outlet />
    </div>
  )
}
