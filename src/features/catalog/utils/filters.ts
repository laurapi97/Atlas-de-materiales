import type { Material, MaterialFilters } from '@/types'

export function createDefaultFilters(): MaterialFilters {
  return {
    search: '',
    category: null,
    tactile: new Set(),
    thermal: null,
    spatial: new Set(),
    durability: null,
    emotions: new Set(),
  }
}

export function applyFilters(materials: Material[], f: MaterialFilters): Material[] {
  const q = f.search.trim().toLowerCase()
  return materials.filter((m) => {
    if (f.category && m.category !== f.category) return false
    if (f.thermal && m.thermal !== f.thermal) return false
    if (f.durability && m.durability !== f.durability) return false
    for (const t of f.tactile) if (!m.tactile.includes(t)) return false
    for (const s of f.spatial) if (!m.spatial.includes(s)) return false
    for (const e of f.emotions) if (!m.emotions.includes(e)) return false
    if (q) {
      const hay = [
        m.name, m.category, m.short, m.description,
        ...m.keywords, ...m.emotions, ...m.tactile, ...m.spatial,
      ].join(' ').toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

export function isFilterActive(f: MaterialFilters): boolean {
  return !!(
    f.search || f.category || f.thermal || f.durability ||
    f.tactile.size || f.spatial.size || f.emotions.size
  )
}

interface FilterPill {
  k: string
  lbl: string
  clear: () => void
}

export function buildFilterPills(
  f: MaterialFilters,
  update: (patch: Partial<MaterialFilters>) => void,
): FilterPill[] {
  const out: FilterPill[] = []
  if (f.search) out.push({ k: 'search', lbl: `"${f.search}"`, clear: () => update({ search: '' }) })
  if (f.category) out.push({ k: 'cat', lbl: f.category, clear: () => update({ category: null }) })
  if (f.thermal) out.push({ k: 'th', lbl: f.thermal, clear: () => update({ thermal: null }) })
  if (f.durability) out.push({ k: 'du', lbl: `durabilidad ${f.durability}`, clear: () => update({ durability: null }) })
  for (const t of f.tactile) {
    out.push({ k: `t-${t}`, lbl: t, clear: () => { const nx = new Set(f.tactile); nx.delete(t); update({ tactile: nx }) } })
  }
  for (const s of f.spatial) {
    out.push({ k: `s-${s}`, lbl: s, clear: () => { const nx = new Set(f.spatial); nx.delete(s); update({ spatial: nx }) } })
  }
  for (const e of f.emotions) {
    out.push({ k: `e-${e}`, lbl: e, clear: () => { const nx = new Set(f.emotions); nx.delete(e); update({ emotions: nx }) } })
  }
  return out
}

const EMO_X: Record<string, number> = {
  'introspección': 0.12, 'calma': 0.22, 'naturalidad': 0.35,
  'rusticidad': 0.50, 'confort': 0.58,
  'sofisticación': 0.72, 'monumentalidad': 0.84, 'dinamismo': 0.92,
}
const THERM_Y: Record<string, number> = { 'cálido': 0.18, 'neutro': 0.50, 'frío': 0.82 }

export function materialPosition(m: Material): { x: number; y: number } {
  const xs = m.emotions.map((e) => EMO_X[e]).filter((v): v is number => v != null)
  let x = xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0.5
  let y = THERM_Y[m.thermal] ?? 0.5
  const seed = m.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const jx = ((seed * 9301) % 1000) / 1000 - 0.5
  const jy = ((seed * 49297) % 1000) / 1000 - 0.5
  x = Math.max(0.06, Math.min(0.94, x + jx * 0.04))
  y = Math.max(0.07, Math.min(0.93, y + jy * 0.04))
  return { x, y }
}
