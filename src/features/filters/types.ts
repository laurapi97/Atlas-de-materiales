import type { MaterialCategory, MaterialFinish } from '@/types'

export interface ActiveFilters {
  category: MaterialCategory | null
  finish: MaterialFinish | null
  search: string
}

export const defaultFilters: ActiveFilters = {
  category: null,
  finish: null,
  search: '',
}
