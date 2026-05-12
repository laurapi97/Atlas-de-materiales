export type MaterialCategory =
  | 'madera'
  | 'metal'
  | 'piedra'
  | 'tela'
  | 'vidrio'
  | 'ceramica'
  | 'plastico'
  | 'otro'

export type MaterialFinish = 'mate' | 'brillante' | 'satinado' | 'texturizado'

export interface Material {
  id: string
  name: string
  slug: string
  description: string
  category: MaterialCategory
  finish: MaterialFinish
  colors: string[]
  imageUrl: string
  thumbnailUrl: string
  tags: string[]
  supplier?: string
  createdAt: string
  updatedAt: string
}

export interface MaterialsFilter {
  category?: MaterialCategory
  finish?: MaterialFinish
  colors?: string[]
  tags?: string[]
  search?: string
}
