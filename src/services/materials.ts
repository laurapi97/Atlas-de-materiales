import type { Material, MaterialsFilter } from '@/types'
// import { supabase } from './supabase'

export async function fetchMaterials(_filters?: MaterialsFilter): Promise<Material[]> {
  // const { data, error } = await supabase.from('materials').select('*')
  // if (error) throw error
  // return data
  return []
}

export async function fetchMaterialBySlug(_slug: string): Promise<Material | null> {
  // const { data, error } = await supabase.from('materials').select('*').eq('slug', _slug).single()
  // if (error) throw error
  // return data
  return null
}
