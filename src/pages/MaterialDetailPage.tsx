import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { fetchMaterialBySlug } from '@/services/materials'
import type { Material } from '@/types'

function ScoreBar({ value, max = 5, label }: { value: number; max?: number; label?: string }) {
  const pct = Math.round((value / max) * 100)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <div style={{ flex: 1, height: 4, background: 'var(--rule)', borderRadius: 2 }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ink)', borderRadius: 2, transition: 'width 0.4s ease' }} />
        </div>
        <span style={{ fontSize: 12, fontFamily: 'var(--mono)', color: 'var(--ink)', minWidth: 16, textAlign: 'right' }}>{value}</span>
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span style={{
      fontFamily: 'var(--mono)',
      fontSize: 11,
      padding: '4px 10px',
      border: '1px solid var(--rule)',
      borderRadius: 999,
      color: 'var(--ink)',
      lineHeight: 1,
    }}>
      {children}
    </span>
  )
}

function SectionHeader({ index, title, sub }: { index: string; title: string; sub: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      borderTop: '1px solid var(--rule)',
      paddingTop: 16,
      marginTop: 32,
      marginBottom: 20,
    }}>
      <span style={{ fontWeight: 600, fontSize: 13, letterSpacing: '0.02em' }}>
        <span style={{ fontFamily: 'var(--mono)', color: 'var(--muted)', marginRight: 10 }}>{index}</span>
        {title}
      </span>
      <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{sub}</span>
    </div>
  )
}

export function MaterialDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [material, setMaterial] = useState<Material | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchMaterialBySlug(slug)
      .then((m) => {
        setMaterial(m)
        if (m) document.title = `${m.name} — Atlas de Materiales`
      })
      .catch((err) => setError(err instanceof Error ? err.message : 'Error al cargar el material'))
      .finally(() => setLoading(false))
    return () => { document.title = 'Atlas de Materiales' }
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 13, color: 'var(--muted)' }}>Cargando material…</span>
      </div>
    )
  }

  if (error || !material) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--paper)' }}>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>{error || 'Material no encontrado'}</p>
        <Link to={PATHS.CATALOG} style={{ fontSize: 13, color: 'var(--ink)', textDecoration: 'underline' }}>← Volver al catálogo</Link>
      </div>
    )
  }

  const m = material

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>
      {/* Top nav */}
      <div style={{ borderBottom: '1px solid var(--rule)', padding: '14px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, background: 'var(--paper)', zIndex: 10 }}>
        <Link
          to={PATHS.CATALOG}
          style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', fontFamily: 'var(--mono)', letterSpacing: '0.04em' }}
        >
          ← Atlas / {m.category}
        </Link>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Vol. I · Ed. 2026
        </span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 32px 96px' }}>

        {/* Hero */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 40, marginBottom: 48 }}>
          {/* Swatch / Imagen */}
          <div style={{
            aspectRatio: '4/5',
            borderRadius: 4,
            overflow: 'hidden',
            background: m.swatch.css,
            backgroundColor: m.swatch.base,
            backgroundBlendMode: m.swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal',
          }}>
            {m.coverImage && (
              <img
                src={m.coverImage}
                alt={m.name}
                loading="lazy"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>

          {/* Info principal */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, paddingTop: 8 }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
                {m.category}
              </div>
              <h1 style={{ fontSize: 36, fontWeight: 700, lineHeight: 1.1, margin: 0 }}>{m.name}</h1>
              {m.nombresComunes && (
                <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6, fontStyle: 'italic' }}>{m.nombresComunes}</p>
              )}
            </div>

            {m.short && (
              <p style={{ fontSize: 16, lineHeight: 1.6, color: 'var(--ink)', margin: 0, borderLeft: '3px solid var(--rule)', paddingLeft: 16 }}>
                {m.short}
              </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {m.origin && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Origen</div>
                  <div style={{ fontSize: 14 }}>{m.origin}</div>
                </div>
              )}
              {m.year && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Referencia</div>
                  <div style={{ fontSize: 14 }}>{m.year}</div>
                </div>
              )}
            </div>

            {/* Emociones principales */}
            {m.emotions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.emotions.map((e) => <Tag key={e}>#{e}</Tag>)}
              </div>
            )}
          </div>
        </div>

        {/* Descripción */}
        {m.description && (
          <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--ink)', marginBottom: 0, maxWidth: 680 }}>
            {m.description}
          </p>
        )}

        {/* 01 Ficha técnica */}
        <SectionHeader index="01" title="Ficha técnica" sub="propiedades físicas" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          <div style={{ padding: '16px 0', borderTop: '2px solid var(--ink)' }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Densidad</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{m.physical.density}</div>
          </div>
          <div style={{ padding: '16px 0', borderTop: '2px solid var(--ink)' }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Dureza</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{m.physical.hardness}</div>
          </div>
          <div style={{ padding: '16px 0', borderTop: '2px solid var(--ink)' }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Absorción</div>
            <div style={{ fontSize: 20, fontWeight: 600 }}>{m.physical.absorption}</div>
          </div>
        </div>

        {/* 02 Puntuaciones */}
        {(m.puntajeHumedad != null || m.puntajeMantenimiento != null || m.puntajeExpresividad != null || m.puntajeAcustica != null || m.puntajeSostenibilidad != null) && (
          <>
            <SectionHeader index="02" title="Puntuaciones" sub="escala 1–5" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 40px' }}>
              {m.puntajeHumedad != null && <ScoreBar value={m.puntajeHumedad} label="Resistencia a la humedad" />}
              {m.puntajeMantenimiento != null && <ScoreBar value={m.puntajeMantenimiento} label="Facilidad de mantenimiento" />}
              {m.puntajeExpresividad != null && <ScoreBar value={m.puntajeExpresividad} label="Expresividad" />}
              {m.puntajeAcustica != null && <ScoreBar value={m.puntajeAcustica} label="Absorción acústica" />}
              {m.puntajeSostenibilidad != null && <ScoreBar value={m.puntajeSostenibilidad} label="Sostenibilidad" />}
            </div>
            {m.certificaciones && m.certificaciones.length > 0 && (
              <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.certificaciones.map((c) => <Tag key={c}>{c}</Tag>)}
              </div>
            )}
          </>
        )}

        {/* 03 Lectura sensorial */}
        <SectionHeader index="03" title="Lectura sensorial" sub="tacto · térmica · emoción" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {m.tactile.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Sensación táctil</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.tactile.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          )}
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Sensación térmica</div>
            <span style={{ fontSize: 18, fontWeight: 600, textTransform: 'capitalize' }}>{m.thermal}</span>
          </div>
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Durabilidad</div>
            <span style={{ fontSize: 18, fontWeight: 600, textTransform: 'capitalize' }}>{m.durability}</span>
          </div>
          {m.emotions.length > 0 && (
            <div>
              <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Atmósfera / emoción</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.emotions.map((e) => <Tag key={e}>{e}</Tag>)}
              </div>
            </div>
          )}
        </div>

        {/* 04 Usos espaciales */}
        {(m.spatial.length > 0 || (m.espaciosCondicionados && m.espaciosCondicionados.length > 0) || m.espaciosNoRecomendados) && (
          <>
            <SectionHeader index="04" title="Usos espaciales" sub="aplicación" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
              {m.spatial.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Espacios aptos</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {m.spatial.map((s) => (
                      <span key={s} style={{ fontSize: 13 }}>· {s}</span>
                    ))}
                  </div>
                </div>
              )}
              {m.espaciosCondicionados && m.espaciosCondicionados.length > 0 && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Condicionados</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {m.espaciosCondicionados.map((s) => (
                      <span key={s} style={{ fontSize: 13, color: 'var(--muted)' }}>· {s}</span>
                    ))}
                  </div>
                </div>
              )}
              {m.espaciosNoRecomendados && (
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>No recomendados</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {m.espaciosNoRecomendados.split(/[,;]/).map((s) => s.trim()).filter(Boolean).map((s) => (
                      <span key={s} style={{ fontSize: 13, color: '#c0392b' }}>· {s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Advertencias */}
        {m.riesgosPrincipales && (
          <div style={{
            marginTop: 32,
            padding: '16px 20px',
            background: '#fef9ec',
            border: '1px solid #f0d070',
            borderRadius: 4,
          }}>
            <div style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#a07820', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>⚠ Advertencias</div>
            <p style={{ fontSize: 13, color: '#705a10', margin: 0, lineHeight: 1.6 }}>{m.riesgosPrincipales}</p>
          </div>
        )}

        {/* 05 Datos técnicos adicionales */}
        {m.datosTecnicos && (
          <>
            <SectionHeader index="05" title="Datos técnicos" sub="información adicional" />
            <p style={{ fontSize: 13, lineHeight: 1.7, color: 'var(--ink)', maxWidth: 680 }}>{m.datosTecnicos}</p>
          </>
        )}

        {/* Vocabulario */}
        {m.keywords.length > 0 && (
          <>
            <SectionHeader index="06" title="Vocabulario" sub="palabras clave" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {m.keywords.map((k) => <Tag key={k}>#{k}</Tag>)}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
