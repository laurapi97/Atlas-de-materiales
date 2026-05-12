import { useState, useCallback, useMemo } from 'react'
import type { MaterialsFilter } from '@/types'
import type { ActiveFilters } from '../types'
import { defaultFilters } from '../types'

interface UseFiltersResult {
  activeFilters: ActiveFilters
  materialFilters: MaterialsFilter
  setCategory: (category: ActiveFilters['category']) => void
  setFinish: (finish: ActiveFilters['finish']) => void
  setSearch: (search: string) => void
  resetFilters: () => void
}

export function useFilters(): UseFiltersResult {
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>(defaultFilters)

  const setCategory = useCallback((category: ActiveFilters['category']) => {
    setActiveFilters((prev) => ({ ...prev, category }))
  }, [])

  const setFinish = useCallback((finish: ActiveFilters['finish']) => {
    setActiveFilters((prev) => ({ ...prev, finish }))
  }, [])

  const setSearch = useCallback((search: string) => {
    setActiveFilters((prev) => ({ ...prev, search }))
  }, [])

  const resetFilters = useCallback(() => {
    setActiveFilters(defaultFilters)
  }, [])

  const materialFilters = useMemo(
    (): MaterialsFilter => ({
      ...(activeFilters.category && { category: activeFilters.category }),
      ...(activeFilters.finish && { finish: activeFilters.finish }),
      ...(activeFilters.search && { search: activeFilters.search }),
    }),
    [activeFilters],
  )

  return { activeFilters, materialFilters, setCategory, setFinish, setSearch, resetFilters }
}
