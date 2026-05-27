import type { Material, MaterialFilters } from '@/types'

export function createDefaultFilters(): MaterialFilters {
  return {
    search: '',
    familia: null,
    atmosfera: new Set(),
    certificaciones: new Set(),
    minHumedad: 0,
    minDurabilidad: 0,
    minMantenimiento: 0,
    minCalidez: 0,
    minExpresividad: 0,
    minAcustica: 0,
    minSostenibilidad: 0,
  }
}

function matchesSet(haystack: string[], needles: Set<string>): boolean {
  if (needles.size === 0) return true
  const lower = new Set(haystack.map((s) => s.toLowerCase()))
  return [...needles].some((n) => lower.has(n.toLowerCase()))
}

function passesScores(m: Material, f: MaterialFilters): boolean {
  if (f.minHumedad > 0 && (m.puntajeHumedad ?? 0) < f.minHumedad) return false
  if (f.minDurabilidad > 0 && (m.puntajeDurabilidad ?? 0) < f.minDurabilidad) return false
  if (f.minMantenimiento > 0 && (m.puntajeMantenimiento ?? 0) < f.minMantenimiento) return false
  if (f.minCalidez > 0 && (m.puntajeCalidez ?? 0) < f.minCalidez) return false
  if (f.minExpresividad > 0 && (m.puntajeExpresividad ?? 0) < f.minExpresividad) return false
  if (f.minAcustica > 0 && (m.puntajeAcustica ?? 0) < f.minAcustica) return false
  if (f.minSostenibilidad > 0 && (m.puntajeSostenibilidad ?? 0) < f.minSostenibilidad) return false
  return true
}

function matchesSearch(m: Material, q: string): boolean {
  if (!q) return true
  const hay = [
    m.name, m.category, m.short, m.description,
    m.nombresComunes ?? '',
    ...m.keywords, ...m.emotions,
    ...(m.usosPrincipales ?? []),
  ].join(' ').toLowerCase()
  return hay.includes(q)
}

export function applyFilters(materials: Material[], f: MaterialFilters): Material[] {
  const q = f.search.trim().toLowerCase()
  return materials.filter((m) => {
    if (f.familia && m.category.toLowerCase() !== f.familia.toLowerCase()) return false
    if (f.atmosfera.size > 0 && !matchesSet(m.emotions, f.atmosfera)) return false
    if (f.certificaciones.size > 0 && !matchesSet(m.certificaciones ?? [], f.certificaciones)) return false
    if (!passesScores(m, f)) return false
    if (!matchesSearch(m, q)) return false
    return true
  })
}

export function isFilterActive(f: MaterialFilters): boolean {
  return !!(
    f.search || f.familia ||
    f.atmosfera.size || f.certificaciones.size ||
    f.minHumedad || f.minDurabilidad || f.minMantenimiento ||
    f.minCalidez || f.minExpresividad || f.minAcustica || f.minSostenibilidad
  )
}

interface FilterPill {
  k: string
  lbl: string
  clear: () => void
}

type ScoreKey = 'minHumedad' | 'minDurabilidad' | 'minMantenimiento' | 'minCalidez' | 'minExpresividad' | 'minAcustica' | 'minSostenibilidad'
const SCORE_LABELS: Record<ScoreKey, string> = {
  minHumedad: 'humedad',
  minDurabilidad: 'durabilidad',
  minMantenimiento: 'mantenimiento',
  minCalidez: 'calidez',
  minExpresividad: 'expresividad',
  minAcustica: 'acústica',
  minSostenibilidad: 'sostenibilidad',
}

export function buildFilterPills(
  f: MaterialFilters,
  update: (patch: Partial<MaterialFilters>) => void,
): FilterPill[] {
  const out: FilterPill[] = []

  if (f.search) out.push({ k: 'search', lbl: `"${f.search}"`, clear: () => update({ search: '' }) })
  if (f.familia) out.push({ k: 'familia', lbl: f.familia, clear: () => update({ familia: null }) })

  for (const a of f.atmosfera) {
    out.push({ k: `atm-${a}`, lbl: a, clear: () => { const nx = new Set(f.atmosfera); nx.delete(a); update({ atmosfera: nx }) } })
  }
  for (const c of f.certificaciones) {
    out.push({ k: `cert-${c}`, lbl: c, clear: () => { const nx = new Set(f.certificaciones); nx.delete(c); update({ certificaciones: nx }) } })
  }

  for (const key of Object.keys(SCORE_LABELS) as ScoreKey[]) {
    const val = f[key]
    if (val > 0) {
      out.push({
        k: `score-${key}`,
        lbl: `${SCORE_LABELS[key]} ≥ ${val}`,
        clear: () => update({ [key]: 0 }),
      })
    }
  }

  return out
}

const EMO_X: Record<string, number> = {
  introspección: 0.12, calma: 0.22, naturalidad: 0.35,
  rusticidad: 0.5, confort: 0.58,
  sofisticación: 0.72, monumentalidad: 0.84, dinamismo: 0.92,
}
const THERM_Y: Record<string, number> = { cálido: 0.18, neutro: 0.5, frío: 0.82 }

export function materialPosition(m: Material): { x: number; y: number } {
  const xs = m.emotions.map((e) => EMO_X[e]).filter((v): v is number => v != null)
  let x = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0.5
  let y = THERM_Y[m.thermal] ?? 0.5
  const seed = m.id.split('').reduce((a, c) => a + (c.codePointAt(0) ?? 0), 0)
  const jx = ((seed * 9301) % 1000) / 1000 - 0.5
  const jy = ((seed * 49297) % 1000) / 1000 - 0.5
  x = Math.max(0.06, Math.min(0.94, x + jx * 0.04))
  y = Math.max(0.07, Math.min(0.93, y + jy * 0.04))
  return { x, y }
}
