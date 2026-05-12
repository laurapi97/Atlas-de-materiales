import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components'

export function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
