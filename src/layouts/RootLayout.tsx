import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
