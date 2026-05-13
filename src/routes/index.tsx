import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PATHS } from './paths'

export const router = createBrowserRouter([
  {
    path: PATHS.CATALOG,
    element: <CatalogPage />,
  },
  {
    path: PATHS.HOME,
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
