import { useEffect } from 'react'
import type { Material } from '@/types'
import { DuraBar } from './DuraBar'

interface MaterialDetailProps {
  material: Material
  materials: Material[]
  compareSet: Set<string>
  onClose: () => void
  onOpen: (id: string) => void
  onToggleCompare: (id: string) => void
}

export function MaterialDetail({
  material: m, materials, compareSet, onClose, onOpen, onToggleCompare,
}: MaterialDetailProps) {
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
            }}
          />
          <div className="info">
            <div>
              <div className="num">№ {String(idx).padStart(3, '0')} · {m.category}</div>
              <h2>{m.name}</h2>
            </div>
            <p className="lead">{m.short}</p>
            <div className="origin">
              <span><b>Origen</b><br />{m.origin}</span>
              <span><b>Referencia</b><br />{m.year}</span>
            </div>
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
          <p className="narrative">{m.description}</p>

          <div className="detail-section-h">
            <span><span className="ix">01</span>&nbsp;&nbsp;Ficha técnica</span>
            <span>propiedades</span>
          </div>
          <div className="spec-grid">
            <div className="cell"><div className="k">Densidad</div><div className="v">{m.physical.density}</div></div>
            <div className="cell"><div className="k">Dureza</div><div className="v">{m.physical.hardness}</div></div>
            <div className="cell"><div className="k">Absorción</div><div className="v">{m.physical.absorption}</div></div>
            <div className="cell">
              <div className="k">Durabilidad</div>
              <div className="v" style={{ textTransform: 'capitalize' }}>{m.durability}</div>
              <DuraBar level={m.durability} />
            </div>
          </div>

          <div className="detail-section-h">
            <span><span className="ix">02</span>&nbsp;&nbsp;Lectura sensorial</span>
            <span>tacto · térmica · emoción</span>
          </div>
          <div className="spec-grid">
            <div className="cell">
              <div className="k">Tacto</div>
              <div className="vsmall">{m.tactile.map((t) => <span key={t} className="t">{t}</span>)}</div>
            </div>
            <div className="cell">
              <div className="k">Térmica</div>
              <div className="v" style={{ textTransform: 'capitalize' }}>{m.thermal}</div>
            </div>
            <div className="cell">
              <div className="k">Emociones</div>
              <div className="vsmall">{m.emotions.map((e) => <span key={e} className="t">{e}</span>)}</div>
            </div>
            <div className="cell">
              <div className="k">Uso espacial</div>
              <div className="vsmall">{m.spatial.map((s) => <span key={s} className="t">{s}</span>)}</div>
            </div>
          </div>

          <div className="detail-section-h">
            <span><span className="ix">03</span>&nbsp;&nbsp;Vocabulario</span>
            <span>palabras clave</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {m.keywords.map((k) => (
              <span key={k} style={{ fontFamily: 'var(--mono)', fontSize: 11, padding: '5px 10px', border: '1px solid var(--rule)', borderRadius: 999 }}>
                #{k}
              </span>
            ))}
          </div>

          {related.length > 0 && (
            <>
              <div className="detail-section-h">
                <span><span className="ix">04</span>&nbsp;&nbsp;Materiales afines</span>
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
