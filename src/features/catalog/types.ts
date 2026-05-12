export type CatalogView = 'grid' | 'list'

export interface CatalogState {
  view: CatalogView
  isLoading: boolean
}
