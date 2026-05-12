import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/layouts/RootLayout'
import { CatalogLayout } from '@/layouts/CatalogLayout'
import { HomePage } from '@/pages/HomePage'
import { CatalogPage } from '@/pages/CatalogPage'
import { MaterialDetailPage } from '@/pages/MaterialDetailPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { PATHS } from './paths'

export const router = createBrowserRouter([
  {
    path: PATHS.HOME,
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        element: <CatalogLayout />,
        children: [
          {
            path: PATHS.CATALOG,
            element: <CatalogPage />,
          },
          {
            path: PATHS.MATERIAL_DETAIL,
            element: <MaterialDetailPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
