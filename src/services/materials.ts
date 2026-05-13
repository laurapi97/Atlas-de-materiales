import type { Material } from '@/types'
import { MATERIALS } from '@/data/materials'
// import { supabase } from './supabase'

export async function fetchMaterials(): Promise<Material[]> {
  // const { data, error } = await supabase.from('materials').select('*')
  // if (error) throw error
  // return data
  return MATERIALS
}

export async function fetchMaterialById(id: string): Promise<Material | null> {
  // const { data, error } = await supabase.from('materials').select('*').eq('id', id).single()
  // if (error) throw error
  // return data
  return MATERIALS.find((m) => m.id === id) ?? null
}
