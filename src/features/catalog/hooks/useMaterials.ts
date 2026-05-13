import { useState, useEffect } from 'react'
import type { Material } from '@/types'
import { fetchMaterials } from '@/services/materials'

interface UseMaterialsResult {
  materials: Material[]
  isLoading: boolean
  error: string | null
}

export function useMaterials(): UseMaterialsResult {
  const [materials, setMaterials] = useState<Material[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchMaterials()
      .then((data) => { if (!cancelled) setMaterials(data) })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : 'Error') })
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
  }, [])

  return { materials, isLoading, error }
}
