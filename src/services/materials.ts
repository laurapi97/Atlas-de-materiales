import type { Material, MaterialDB, MaterialThermal, MaterialDurability } from '@/types'
import { supabase } from './supabase'

const TABLE = 'BASE-GENERAL'

const CATEGORY_COLORS: Record<string, string> = {
  'Piedra': '#8b7355',
  'Madera': '#b5804a',
  'Metal': '#7a8ea0',
  'Cerámica': '#b8856a',
  'Vidrio': '#7fa8b8',
  'Textiles': '#9e85b0',
  'Hormigón': '#8a8a8a',
  'Compuestos': '#7a8a7a',
  'Materiales reciclados': '#7a9e7a',
  'Materiales naturales': '#9e9e60',
}

function parseList(v: string | null | undefined): string[] {
  if (!v) return []
  return v.split(/[,;]/).map((s) => s.trim()).filter(Boolean)
}

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function toThermal(score?: number | null): MaterialThermal {
  if (score == null) return 'neutro'
  if (score <= 2) return 'frío'
  if (score >= 4) return 'cálido'
  return 'neutro'
}

function toDurability(score?: number | null): MaterialDurability {
  if (score == null) return 'media'
  if (score <= 2) return 'baja'
  if (score >= 4) return 'alta'
  return 'media'
}

function mapDBToMaterial(db: MaterialDB): Material {
  const slug = db.slug || toSlug(db.nombre_material)
  const familia = db.familia || 'Sin categoría'
  const color = db.color_base || CATEGORY_COLORS[familia] || '#9e9e9e'

  const emotions = [
    ...(db.emocion_primaria ? [db.emocion_primaria] : []),
    ...(db.emocion_secundaria ? [db.emocion_secundaria] : []),
    ...parseList(db.etiquetas_atmosfera),
  ].filter((v, i, a) => a.indexOf(v) === i)

  return {
    id: slug,
    name: db.nombre_material,
    category: familia,
    year: db.anio_referencia || '',
    origin: db.origen || '',
    short: db.descripcion_corta || '',
    description: db.descripcion || '',
    physical: {
      density: db.densidad || '—',
      hardness: db.dureza || '—',
      absorption: db.absorcion_agua || '—',
    },
    tactile: parseList(db.sensacion_tactil),
    thermal: toThermal(db.puntaje_calidez),
    spatial: parseList(db.espacios_aptos),
    durability: toDurability(db.puntaje_durabilidad),
    emotions,
    keywords: parseList(db.palabras_clave),
    related: [],
    swatch: {
      base: color,
      css: color,
      blend: 'normal',
    },
    coverImage: db.cover_image || db.image_url || undefined,
    imageUrl: db.image_url || undefined,
    thumbnailUrl: db.thumbnail_url || undefined,
    nombresComunes: db.nombres_comunes || undefined,
    estadoVerificacion: db.estado_verificacion || undefined,
    subfamilia: db.subfamilia || undefined,
    categoriaMaterial: db.categoria_material || undefined,
    tipoOrigen: db.tipo_origen || undefined,
    composicionPrincipal: db.composicion_principal || undefined,
    procesoFabricacion: db.proceso_fabricacion || undefined,
    nivelTransformacion: db.nivel_transformacion || undefined,
    presentacionesHabituales: parseList(db.presentaciones_habituales),
    usosPrincipales: parseList(db.usos_principales),
    puntajeHumedad: db.puntaje_humedad ?? undefined,
    puntajeDurabilidad: db.puntaje_durabilidad ?? undefined,
    puntajeMantenimiento: db.puntaje_mantenimiento ?? undefined,
    puntajeCalidez: db.puntaje_calidez ?? undefined,
    puntajeRigidez: db.puntaje_rigidez ?? undefined,
    puntajePesoVisual: db.puntaje_peso_visual ?? undefined,
    puntajeExpresividad: db.puntaje_expresividad ?? undefined,
    puntajeAcustica: db.puntaje_absorcion_acustica ?? undefined,
    puntajeSostenibilidad: db.puntaje_sostenibilidad ?? undefined,
    puntajeResistenciaRelativa: db.puntaje_resistencia_relativa ?? undefined,
    comportamientoLuz: db.comportamiento_luz || undefined,
    texturaTactil: parseList(db.textura_tactil),
    texturaVisual: db.textura_visual || undefined,
    espaciosCondicionados: parseList(db.espacios_condicionados),
    espaciosNoRecomendados: db.espacios_no_recomendados || undefined,
    materialesCompatibles: parseList(db.materiales_compatibles),
    alternativas: parseList(db.alternativas),
    certificaciones: parseList(db.certificaciones_posibles),
    notasMantenimiento: db.notas_mantenimiento || undefined,
    requisitosInstalacion: db.requisitos_instalacion || undefined,
    riesgosPrincipales: db.riesgos_principales || undefined,
    patologiasTipicas: parseList(db.patologias_tipicas),
    proveedoresEjemplo: parseList(db.proveedores_ejemplo),
    urlsFuente: parseList(db.urls_fuente),
    datosTecnicos: db.datos_tecnicos_adicionales || undefined,
    notas: db.notas || undefined,
  }
}

export async function fetchMaterials(): Promise<Material[]> {
  const { data, error } = await supabase.from(TABLE).select('*')
  if (error) throw new Error(error.message)
  return (data as MaterialDB[]).map(mapDBToMaterial)
}

export async function fetchMaterialBySlug(slug: string): Promise<Material | null> {
  // Try direct slug column first
  const { data: bySlug } = await supabase
    .from(TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (bySlug) return mapDBToMaterial(bySlug as MaterialDB)

  // Fall back: fetch all and match by generated slug
  const { data, error } = await supabase.from(TABLE).select('*')
  if (error || !data) return null

  const match = (data as MaterialDB[]).find(
    (row) => toSlug(row.nombre_material) === slug
  )
  return match ? mapDBToMaterial(match) : null
}

export async function fetchMaterialById(id: string): Promise<Material | null> {
  return fetchMaterialBySlug(id)
}
