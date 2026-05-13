export interface MaterialSwatch {
  base: string
  css: string
  blend: string
}

export interface MaterialPhysical {
  density: string
  hardness: string
  absorption: string
}

export type MaterialThermal = 'cálido' | 'frío' | 'neutro'
export type MaterialDurability = 'baja' | 'media' | 'alta'

export interface Material {
  id: string
  name: string
  category: string
  year: string
  origin: string
  short: string
  description: string
  physical: MaterialPhysical
  tactile: string[]
  thermal: MaterialThermal
  spatial: string[]
  durability: MaterialDurability
  emotions: string[]
  keywords: string[]
  related: string[]
  swatch: MaterialSwatch
  imageUrl?: string
  thumbnailUrl?: string
}

export interface MaterialFilters {
  search: string
  category: string | null
  tactile: Set<string>
  thermal: string | null
  spatial: Set<string>
  durability: string | null
  emotions: Set<string>
}
