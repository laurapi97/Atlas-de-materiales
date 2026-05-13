import { useState, useMemo, useCallback } from 'react'
import type { MaterialFilters } from '@/types'
import { createDefaultFilters, applyFilters, buildFilterPills, isFilterActive } from '../utils/filters'
import { useMaterials } from './useMaterials'

export type CatalogView = 'catalog' | 'map' | 'compare'

export function useCatalog() {
  const { materials, isLoading, error } = useMaterials()

  const [view, setView] = useState<CatalogView>('catalog')
  const [filters, setFilters] = useState<MaterialFilters>(createDefaultFilters)
  const [openId, setOpenId] = useState<string | null>(null)
  const [compare, setCompare] = useState<string[]>([])

  const compareSet = useMemo(() => new Set(compare), [compare])

  const updateFilters = useCallback((patch: Partial<MaterialFilters>) => {
    setFilters((prev) => ({ ...prev, ...patch }))
  }, [])

  const toggleSet = useCallback(<K extends 'tactile' | 'spatial' | 'emotions'>(
    key: K,
    value: string,
  ) => {
    setFilters((prev) => {
      const nx = new Set(prev[key])
      nx.has(value) ? nx.delete(value) : nx.add(value)
      return { ...prev, [key]: nx }
    })
  }, [])

  const toggleSingle = useCallback(<K extends 'category' | 'thermal' | 'durability'>(
    key: K,
    value: string,
  ) => {
    setFilters((prev) => ({ ...prev, [key]: prev[key] === value ? null : value }))
  }, [])

  const resetFilters = useCallback(() => setFilters(createDefaultFilters()), [])

  const toggleCompare = useCallback((id: string) => {
    setCompare((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id)
      if (prev.length >= 4) return [...prev.slice(1), id]
      return [...prev, id]
    })
  }, [])

  const filtered = useMemo(() => applyFilters(materials, filters), [materials, filters])

  const filterPills = useMemo(
    () => buildFilterPills(filters, updateFilters),
    [filters, updateFilters],
  )

  const openMaterial = useMemo(
    () => (openId ? materials.find((m) => m.id === openId) ?? null : null),
    [openId, materials],
  )

  return {
    materials,
    filtered,
    isLoading,
    error,
    view,
    setView,
    filters,
    updateFilters,
    toggleSet,
    toggleSingle,
    resetFilters,
    filterPills,
    filterActive: isFilterActive(filters),
    openId,
    openMaterial,
    openMaterialById: setOpenId,
    closeMaterial: useCallback(() => setOpenId(null), []),
    compare,
    compareSet,
    toggleCompare,
  }
}
