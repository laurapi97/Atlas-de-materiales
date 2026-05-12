export const PATHS = {
  HOME: '/',
  CATALOG: '/catalogo',
  MATERIAL_DETAIL: '/catalogo/:slug',
} as const

export function materialDetailPath(slug: string): string {
  return `/catalogo/${slug}`
}
