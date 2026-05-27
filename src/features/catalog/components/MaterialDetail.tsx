import { useEffect, useState } from 'react'
import type { Material } from '@/types'
import { DuraBar } from './DuraBar'
import { supabase } from '@/services/supabase'

interface MaterialDetailProps {
  material: Material
  materials: Material[]
  compareSet: Set<string>
  onClose: () => void
  onOpen: (id: string) => void
  onToggleCompare: (id: string) => void
}

function AiDescription({ m }: Readonly<{ m: Material }>) {
  const cacheKey = `ai_desc_${m.id}`
  const [text, setText] = useState<string | null>(() => localStorage.getItem(cacheKey))
  const [loading, setLoading] = useState(() => localStorage.getItem(cacheKey) === null)

  useEffect(() => {
    if (text !== null) return
    supabase.functions
      .invoke('generate-material-description', {
        body: {
          name: m.name, category: m.category, origin: m.origin,
          tactile: m.tactile, thermal: m.thermal, emotions: m.emotions,
          durability: m.durability, spatial: m.spatial, keywords: m.keywords,
          composicionPrincipal: m.composicionPrincipal,
          texturaVisual: m.texturaVisual,
          comportamientoLuz: m.comportamientoLuz,
        },
      })
      .then(({ data, error }) => {
        if (!error && data?.description) {
          localStorage.setItem(cacheKey, data.description)
          setText(data.description)
        }
      })
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!loading && !text) return null

  return (
    <div className="ai-narrative">
      <span className="ai-label">Descripción</span>
      {loading ? (
        <div className="ai-skel">
          <span style={{ width: '92%' }} /><span style={{ width: '78%' }} /><span style={{ width: '85%' }} />
        </div>
      ) : (
        <p>{text}</p>
      )}
    </div>
  )
}

export function MaterialDetail({
  material: m, materials, compareSet, onClose, onOpen, onToggleCompare,
}: Readonly<MaterialDetailProps>) {
  const [imgErr, setImgErr] = useState(false)

  const idx = materials.findIndex((x) => x.id === m.id) + 1
  const inCompare = compareSet.has(m.id)
  const related = m.related
    .map((id) => materials.find((x) => x.id === id))
    .filter((x): x is Material => x != null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  // Only include physical cells that have real data
  const tactileItems = [...new Set([...(m.texturaTactil ?? []), ...m.tactile])]
  const compatibles = m.materialesCompatibles ?? []
  const certs = m.certificaciones ?? []

  const physicalCells = [
    m.physical.density === '—' ? null : { k: 'Densidad', v: m.physical.density },
    m.physical.hardness === '—' ? null : { k: 'Dureza', v: m.physical.hardness },
    m.physical.absorption === '—' ? null : { k: 'Absorción', v: m.physical.absorption },
  ].filter((c): c is { k: string; v: string } => c !== null)

  const showImg = !!m.coverImage && !imgErr

  return (
    <>
      <div className="detail-back" onClick={onClose} />
      <aside className="detail" role="dialog" aria-label={`Detalle de ${m.name}`}>
        <div className="detail-close">
          <div className="crumb">Atlas / {m.category} / <b>{m.name}</b></div>
          <button type="button" className="x" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>

        <div className="detail-hero">
          <div
            className="img"
            style={{
              background: m.swatch.css,
              backgroundColor: m.swatch.base,
              backgroundBlendMode: m.swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {showImg && (
              <img
                src={m.coverImage}
                alt={m.name}
                loading="lazy"
                onError={() => setImgErr(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
          <div className="info">
            <div>
              <div className="num">№ {String(idx).padStart(3, '0')} · {m.category}</div>
              <h2>{m.name}</h2>
            </div>
            {m.short && <p className="lead">{m.short}</p>}
            {(m.origin || m.year) && (
              <div className="origin">
                {m.origin && <span><b>Origen</b><br />{m.origin}</span>}
                {m.year && <span><b>Referencia</b><br />{m.year}</span>}
              </div>
            )}
            <div className="ctaRow">
              <button
                type="button"
                className={'cta ' + (inCompare ? 'ghost' : '')}
                onClick={() => onToggleCompare(m.id)}
              >
                {inCompare ? '✓ En comparación' : '+ Añadir a comparación'}
              </button>
            </div>
          </div>
        </div>

        <div className="detail-body">
          {m.description && <p className="narrative">{m.description}</p>}
          <AiDescription key={m.id} m={m} />

          {/* Section 01 — always rendered because durability is always present */}
          <div className="detail-section-h">
            <span><span className="ix">01</span>&nbsp;&nbsp;Ficha técnica</span>
            <span>propiedades</span>
          </div>
          <div className="spec-grid">
            {physicalCells.map(({ k, v }) => (
              <div key={k} className="cell">
                <div className="k">{k}</div>
                <div className="v">{v}</div>
              </div>
            ))}
            <div className="cell">
              <div className="k">Durabilidad</div>
              <div className="v" style={{ textTransform: 'capitalize' }}>{m.durability}</div>
              <DuraBar level={m.durability} />
            </div>
          </div>

          {/* Section 02 — always rendered because thermal is always present */}
          <div className="detail-section-h">
            <span><span className="ix">02</span>&nbsp;&nbsp;Lectura sensorial</span>
            <span>tacto · térmica · emoción</span>
          </div>
          <div className="spec-grid">
            {tactileItems.length > 0 && (
              <div className="cell">
                <div className="k">Tacto</div>
                <div className="vsmall">{tactileItems.map((t) => <span key={t} className="t">{t}</span>)}</div>
              </div>
            )}
            <div className="cell">
              <div className="k">Térmica</div>
              <div className="v" style={{ textTransform: 'capitalize' }}>{m.thermal}</div>
            </div>
            {m.texturaVisual && (
              <div className="cell">
                <div className="k">Textura visual</div>
                <div className="v" style={{ fontSize: 13 }}>{m.texturaVisual}</div>
              </div>
            )}
            {m.emotions.length > 0 && (
              <div className="cell">
                <div className="k">Emociones</div>
                <div className="vsmall">{m.emotions.map((e) => <span key={e} className="t">{e}</span>)}</div>
              </div>
            )}
            {m.spatial.length > 0 && (
              <div className="cell">
                <div className="k">Uso espacial</div>
                <div className="vsmall">{m.spatial.map((s) => <span key={s} className="t">{s}</span>)}</div>
              </div>
            )}
          </div>

          {/* Section 03 — certificaciones y materiales compatibles */}
          {(certs.length > 0 || compatibles.length > 0) && (
            <>
              <div className="detail-section-h">
                <span><span className="ix">03</span>&nbsp;&nbsp;Compatibilidad</span>
                <span>certificaciones · materiales</span>
              </div>
              <div className="spec-grid">
                {certs.length > 0 && (
                  <div className="cell">
                    <div className="k">Certificaciones</div>
                    <div className="vsmall">{certs.map((c) => <span key={c} className="t">{c}</span>)}</div>
                  </div>
                )}
                {compatibles.length > 0 && (
                  <div className="cell">
                    <div className="k">Materiales compatibles</div>
                    <div className="vsmall">{compatibles.map((c) => <span key={c} className="t">{c}</span>)}</div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Section 04 — only if keywords exist */}
          {m.keywords.length > 0 && (
            <>
              <div className="detail-section-h">
                <span><span className="ix">04</span>&nbsp;&nbsp;Vocabulario</span>
                <span>palabras clave</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {m.keywords.map((k) => (
                  <span key={k} style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '5px 10px', border: '1px solid var(--rule)', borderRadius: 999 }}>
                    #{k}
                  </span>
                ))}
              </div>
            </>
          )}

          {/* Section 05 — only if related materials exist */}
          {related.length > 0 && (
            <>
              <div className="detail-section-h">
                <span><span className="ix">05</span>&nbsp;&nbsp;Materiales afines</span>
                <span>relación visual</span>
              </div>
              <div className="related">
                {related.map((r) => (
                  <button key={r.id} type="button" className="rcard" onClick={() => onOpen(r.id)}>
                    <div
                      className="swatch"
                      style={{
                        background: r.swatch.css,
                        backgroundColor: r.swatch.base,
                        backgroundBlendMode: r.swatch.blend as React.CSSProperties['backgroundBlendMode'] || 'normal',
                      }}
                    />
                    <div className="name">{r.name}</div>
                    <div className="cat">{r.category}</div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
