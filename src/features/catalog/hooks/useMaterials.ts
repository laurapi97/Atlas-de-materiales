import { useState, useEffect } from 'react'
import type { Material, MaterialsFilter } from '@/types'
import { fetchMaterials } from '../services/materials.service'

interface UseMaterialsResult {
  materials: Material[]
  isLoading: boolean
  error: string | null
}

export function useMaterials(filters?: MaterialsFilter): UseMaterialsResult {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchMaterials(filters)
        if (!cancelled) setMaterials(data)
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [filters])

  return { materials, isLoading, error }
}
