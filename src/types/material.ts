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
  coverImage?: string
  imageUrl?: string
  thumbnailUrl?: string

  // Extended fields from BASE-GENERAL
  nombresComunes?: string
  estadoVerificacion?: string
  usosPrincipales?: string[]

  // Scores (1–5) — raw numeric values preserved
  puntajeHumedad?: number
  puntajeDurabilidad?: number
  puntajeMantenimiento?: number
  puntajeCalidez?: number
  puntajeExpresividad?: number
  puntajeAcustica?: number
  puntajeSostenibilidad?: number

  // Spatial
  espaciosCondicionados?: string[]
  espaciosNoRecomendados?: string

  // Compatibility
  materialesCompatibles?: string[]
  alternativas?: string[]

  // Sustainability
  certificaciones?: string[]

  // Maintenance & risks
  notasMantenimiento?: string
  requisitosInstalacion?: string
  riesgosPrincipales?: string

  // Suppliers & sources
  proveedoresEjemplo?: string[]
  urlsFuente?: string[]

  // Extra
  datosTecnicos?: string
  notas?: string
}

export interface MaterialFilters {
  search: string
  familia: string | null
  atmosfera: Set<string>
  certificaciones: Set<string>
  // Score thresholds: 0 = sin filtro, 1–5 = puntaje mínimo requerido
  minHumedad: number
  minDurabilidad: number
  minMantenimiento: number
  minCalidez: number
  minExpresividad: number
  minAcustica: number
  minSostenibilidad: number
}

// Raw row from Supabase "BASE-GENERAL"
export interface MaterialDB {
  id?: number | string
  nombre_material: string
  nombres_comunes?: string | null
  slug?: string | null
  familia?: string | null
  descripcion?: string | null
  descripcion_corta?: string | null
  origen?: string | null
  anio_referencia?: string | null
  estado_verificacion?: string | null
  usos_principales?: string | null
  espacios_aptos?: string | null
  espacios_condicionados?: string | null
  espacios_no_recomendados?: string | null
  sensacion_tactil?: string | null
  puntaje_humedad?: number | null
  puntaje_durabilidad?: number | null
  puntaje_mantenimiento?: number | null
  puntaje_calidez?: number | null
  puntaje_expresividad?: number | null
  puntaje_absorcion_acustica?: number | null
  emocion_primaria?: string | null
  emocion_secundaria?: string | null
  etiquetas_atmosfera?: string | null
  puntaje_sostenibilidad?: number | null
  certificaciones_posibles?: string | null
  datos_tecnicos_adicionales?: string | null
  riesgos_principales?: string | null
  notas_mantenimiento?: string | null
  requisitos_instalacion?: string | null
  materiales_compatibles?: string | null
  alternativas?: string | null
  proveedores_ejemplo?: string | null
  urls_fuente?: string | null
  notas?: string | null
  densidad?: string | null
  dureza?: string | null
  absorcion_agua?: string | null
  palabras_clave?: string | null
  color_base?: string | null
  cover_image?: string | null
  image_url?: string | null
  thumbnail_url?: string | null
}
