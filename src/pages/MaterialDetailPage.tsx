import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { fetchMaterialBySlug } from '@/services/materials'
import type { Material } from '@/types'

// ─── Utility ──────────────────────────────────────────────────────────────────

function cleanDomain(url: string): string {
  try { return new URL(url).hostname.replace(/^www\./, '') }
  catch { return url }
}

// ─── Atoms ────────────────────────────────────────────────────────────────────

function FieldLabel({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div style={{
      fontFamily: 'var(--mono)', fontSize: 9,
      textTransform: 'uppercase', letterSpacing: '0.18em',
      color: 'var(--muted)', marginBottom: 7,
    }}>
      {children}
    </div>
  )
}

function SectionDivider({ index, title, sub }: Readonly<{ index: string; title: string; sub?: string }>) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      marginTop: 72, marginBottom: 32,
    }}>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--accent)', letterSpacing: '0.12em', flexShrink: 0 }}>
        {index}
      </span>
      <div style={{ flex: 1, height: 1, background: 'var(--rule)' }} />
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted)', flexShrink: 0 }}>
        {title}{sub ? ` · ${sub}` : ''}
      </span>
    </div>
  )
}

function ScoreRow({ label, value }: Readonly<{ label: string; value: number }>) {
  const pct = Math.round((value / 5) * 100)
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px auto', alignItems: 'center', gap: 14 }}>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--ink-soft)' }}>{label}</span>
      <div style={{ height: 2, background: 'var(--paper-deep)', borderRadius: 1 }}>
        <div style={{ width: `${pct}%`, height: '100%', background: 'var(--ink)', borderRadius: 1, transition: 'width .6s cubic-bezier(.2,.8,.2,1)' }} />
      </div>
      <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', textAlign: 'right' }}>{value}/5</span>
    </div>
  )
}

function EditorialChip({ children, tone = 'default' }: Readonly<{ children: React.ReactNode; tone?: 'default' | 'muted' | 'faint' }>) {
  const s: React.CSSProperties =
    tone === 'muted' ? { border: '1px dashed var(--muted-soft)', color: 'var(--muted)' } :
    tone === 'faint' ? { border: '1px dashed var(--rule)', color: 'var(--muted-soft)', opacity: 0.6 } :
    { border: '1px solid var(--rule)', color: 'var(--ink-soft)' }
  return (
    <span style={{
      fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
      textTransform: 'lowercase', padding: '4px 11px', borderRadius: 999,
      lineHeight: 1, ...s,
    }}>
      {children}
    </span>
  )
}

function SpecCell({ label, value, serif = false }: Readonly<{ label: string; value: React.ReactNode; serif?: boolean }>) {
  return (
    <div style={{ padding: '18px 20px', borderRight: '1px solid var(--rule)', borderBottom: '1px solid var(--rule)' }}>
      <FieldLabel>{label}</FieldLabel>
      <div style={{
        fontFamily: serif ? 'var(--serif)' : 'var(--sans)',
        fontSize: serif ? 20 : 14,
        lineHeight: 1.3,
        color: 'var(--ink)',
      }}>
        {value}
      </div>
    </div>
  )
}

function AccordionBlock({ title, children }: Readonly<{ title: string; children: React.ReactNode }>) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ borderTop: '1px solid var(--rule)' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '16px 0', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.14em', color: 'var(--ink-soft)' }}>
          {title}
        </span>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 18, color: 'var(--muted)', lineHeight: 1, fontWeight: 300 }}>
          {open ? '−' : '+'}
        </span>
      </button>
      {open && (
        <div style={{ paddingBottom: 24, fontSize: 13, lineHeight: 1.75, color: 'var(--ink-soft)' }}>
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ m }: Readonly<{ m: Material }>) {
  const [imgErr, setImgErr] = useState(false)
  const showImg = !!m.coverImage && !imgErr

  const categoryPath = [m.category, m.subfamilia, m.categoriaMaterial]
    .filter(Boolean).join(' · ').toUpperCase()

  return (
    <div className="dp-hero">
      {/* Image panel */}
      <div
        className="dp-hero-img"
        style={{
          background: m.swatch.css,
          backgroundColor: m.swatch.base,
          backgroundBlendMode: (m.swatch.blend as React.CSSProperties['backgroundBlendMode']) || 'normal',
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
        {m.tipoOrigen && (
          <div style={{
            position: 'absolute', bottom: 18, left: 20,
            fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.16em',
            color: 'rgba(255,255,255,0.75)', mixBlendMode: 'difference',
          }}>
            {m.tipoOrigen.toUpperCase()}
          </div>
        )}
      </div>

      {/* Info panel */}
      <div className="dp-hero-info">
        {/* Category path */}
        {categoryPath && (
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.18em', color: 'var(--muted)' }}>
            {categoryPath}
          </div>
        )}

        {/* Title block */}
        <div>
          <h1 style={{
            fontFamily: 'var(--serif)', fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(34px, 4.5vw, 58px)', lineHeight: 1,
            letterSpacing: '-0.01em', margin: '0 0 10px',
          }}>
            {m.name}
          </h1>
          {m.nombresComunes && (
            <p style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--muted)', margin: '0 0 22px' }}>
              {m.nombresComunes}
            </p>
          )}
          {m.short && (
            <p style={{
              fontFamily: 'var(--serif)', fontStyle: 'italic',
              fontSize: 16, lineHeight: 1.6, color: 'var(--ink-soft)',
              margin: 0, borderLeft: '2px solid var(--rule)', paddingLeft: 16,
            }}>
              {m.short}
            </p>
          )}
        </div>

        {/* Key metadata grid */}
        {(m.tipoOrigen || m.nivelTransformacion || m.origin) && (
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '14px 24px', paddingTop: 22, borderTop: '1px solid var(--rule)',
          }}>
            {m.tipoOrigen && (
              <div><FieldLabel>Origen</FieldLabel><div style={{ fontSize: 14 }}>{m.tipoOrigen}</div></div>
            )}
            {m.nivelTransformacion && (
              <div><FieldLabel>Transformación</FieldLabel><div style={{ fontSize: 14 }}>{m.nivelTransformacion}</div></div>
            )}
            {m.origin && !m.tipoOrigen && (
              <div><FieldLabel>Procedencia</FieldLabel><div style={{ fontSize: 14 }}>{m.origin}</div></div>
            )}
            {m.year && (
              <div><FieldLabel>Referencia</FieldLabel><div style={{ fontSize: 14 }}>{m.year}</div></div>
            )}
          </div>
        )}

        {/* Key scores strip */}
        {(m.puntajeDurabilidad != null || m.puntajeSostenibilidad != null) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {m.puntajeDurabilidad != null && <ScoreRow label="Durabilidad" value={m.puntajeDurabilidad} />}
            {m.puntajeSostenibilidad != null && <ScoreRow label="Sostenibilidad" value={m.puntajeSostenibilidad} />}
          </div>
        )}

        {/* Primary emotion */}
        {m.emotions.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {m.emotions.slice(0, 4).map((e) => <EditorialChip key={e}>{e}</EditorialChip>)}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Section: Ficha técnica ────────────────────────────────────────────────────

function FichaSection({ m }: Readonly<{ m: Material }>) {
  const hasPhysical = m.physical.density !== '—' || m.physical.hardness !== '—' || m.physical.absorption !== '—'
  const hasData = m.composicionPrincipal || m.tipoOrigen || m.procesoFabricacion
    || m.nivelTransformacion || hasPhysical || (m.presentacionesHabituales ?? []).length > 0

  if (!hasData) return null

  const cells: Array<{ label: string; value: string }> = [
    m.composicionPrincipal ? { label: 'Composición', value: m.composicionPrincipal } : null,
    m.tipoOrigen ? { label: 'Tipo de origen', value: m.tipoOrigen } : null,
    m.procesoFabricacion ? { label: 'Proceso', value: m.procesoFabricacion } : null,
    m.nivelTransformacion ? { label: 'Transformación', value: m.nivelTransformacion } : null,
    m.physical.density !== '—' ? { label: 'Densidad', value: m.physical.density } : null,
    m.physical.hardness !== '—' ? { label: 'Dureza', value: m.physical.hardness } : null,
    m.physical.absorption !== '—' ? { label: 'Absorción', value: m.physical.absorption } : null,
  ].filter((c): c is { label: string; value: string } => c !== null)

  return (
    <>
      <SectionDivider index="01" title="Origen y fabricación" sub="composición · proceso" />
      <div className="dp-spec">
        {cells.map(({ label, value }) => (
          <SpecCell key={label} label={label} value={value} serif />
        ))}
      </div>
      {(m.presentacionesHabituales ?? []).length > 0 && (
        <div style={{ marginTop: 20 }}>
          <FieldLabel>Presentaciones habituales</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {(m.presentacionesHabituales ?? []).map((p) => <EditorialChip key={p}>{p}</EditorialChip>)}
          </div>
        </div>
      )}
    </>
  )
}

// ─── Section: Propiedades (scores) ────────────────────────────────────────────

function PropiedadesSection({ m }: Readonly<{ m: Material }>) {
  const rendimiento = [
    { label: 'Durabilidad', v: m.puntajeDurabilidad },
    { label: 'Resistencia a humedad', v: m.puntajeHumedad },
    { label: 'Facilidad de mantenimiento', v: m.puntajeMantenimiento },
    { label: 'Resistencia relativa', v: m.puntajeResistenciaRelativa },
    { label: 'Absorción acústica', v: m.puntajeAcustica },
  ].filter((x): x is { label: string; v: number } => x.v != null)

  const sensacion = [
    { label: 'Calidez', v: m.puntajeCalidez },
    { label: 'Rigidez', v: m.puntajeRigidez },
    { label: 'Peso visual', v: m.puntajePesoVisual },
    { label: 'Expresividad', v: m.puntajeExpresividad },
  ].filter((x): x is { label: string; v: number } => x.v != null)

  const hasSostenibilidad = m.puntajeSostenibilidad != null
  if (rendimiento.length === 0 && sensacion.length === 0 && !hasSostenibilidad) return null

  return (
    <>
      <SectionDivider index="02" title="Propiedades" sub="escala 1–5" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: rendimiento.length > 0 && sensacion.length > 0 ? '1fr 1fr' : '1fr',
        gap: rendimiento.length > 0 && sensacion.length > 0 ? '0 64px' : 0,
      }}>
        {rendimiento.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
              Rendimiento técnico
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {rendimiento.map(({ label, v }) => <ScoreRow key={label} label={label} value={v} />)}
            </div>
          </div>
        )}
        {sensacion.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
              Sensación espacial
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {sensacion.map(({ label, v }) => <ScoreRow key={label} label={label} value={v} />)}
            </div>
          </div>
        )}
      </div>

      {hasSostenibilidad && (
        <div style={{ marginTop: 40, paddingTop: 28, borderTop: '1px solid var(--rule)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 18 }}>
            Sostenibilidad
          </div>
          <ScoreRow label="Índice de sostenibilidad" value={m.puntajeSostenibilidad!} />
          {(m.certificaciones ?? []).length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 16 }}>
              {(m.certificaciones ?? []).map((c) => <EditorialChip key={c}>{c}</EditorialChip>)}
            </div>
          )}
        </div>
      )}
    </>
  )
}

// ─── Section: Lectura sensorial ────────────────────────────────────────────────

function SensorialSection({ m }: Readonly<{ m: Material }>) {
  const tactileItems = [...new Set([...(m.texturaTactil ?? []), ...m.tactile])]
  const cells: Array<{ key: string; label: string; content: React.ReactNode }> = []

  if (m.comportamientoLuz) {
    cells.push({
      key: 'luz', label: 'Comportamiento de la luz',
      content: <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, margin: 0, color: 'var(--ink-soft)' }}>{m.comportamientoLuz}</p>,
    })
  }
  if (tactileItems.length > 0) {
    cells.push({
      key: 'tactil', label: 'Textura táctil',
      content: <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>{tactileItems.map((t) => <EditorialChip key={t}>{t}</EditorialChip>)}</div>,
    })
  }
  if (m.texturaVisual) {
    cells.push({
      key: 'visual', label: 'Textura visual',
      content: <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.6, margin: 0, color: 'var(--ink-soft)' }}>{m.texturaVisual}</p>,
    })
  }

  if (cells.length === 0) return null

  return (
    <>
      <SectionDivider index="03" title="Lectura sensorial" sub="luz · tacto · visión" />
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cells.length}, 1fr)`, border: '1px solid var(--rule)' }}>
        {cells.map((cell, i) => (
          <div key={cell.key} style={{ padding: '24px 22px', borderRight: i < cells.length - 1 ? '1px solid var(--rule)' : 'none' }}>
            <FieldLabel>{cell.label}</FieldLabel>
            {cell.content}
          </div>
        ))}
      </div>
    </>
  )
}

// ─── Section: Uso espacial ────────────────────────────────────────────────────

function EspacialSection({ m }: Readonly<{ m: Material }>) {
  const aptos = m.spatial ?? []
  const condicionados = m.espaciosCondicionados ?? []
  const noRec = m.espaciosNoRecomendados
    ? m.espaciosNoRecomendados.split(/[;,]/).map((s) => s.trim()).filter(Boolean)
    : []
  const usos = m.usosPrincipales ?? []

  type ColDef = { key: string; label: string; items: string[]; itemStyle: React.CSSProperties; prefix: string }
  const columns = ([
    aptos.length > 0 ? { key: 'aptos', label: 'Espacios aptos', items: aptos, itemStyle: { fontSize: 13, color: 'var(--ink)' }, prefix: '· ' } : null,
    condicionados.length > 0 ? { key: 'cond', label: 'Condicionados', items: condicionados, itemStyle: { fontSize: 13, color: 'var(--muted)' }, prefix: '◦ ' } : null,
    noRec.length > 0 ? { key: 'norec', label: 'No recomendados', items: noRec, itemStyle: { fontSize: 13, color: 'var(--muted-soft)', textDecoration: 'line-through' }, prefix: '× ' } : null,
  ] as (ColDef | null)[]).filter((c): c is ColDef => c !== null)

  if (columns.length + usos.length === 0) return null

  return (
    <>
      <SectionDivider index="04" title="Uso espacial" sub="aplicación" />
      {usos.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <FieldLabel>Usos principales</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {usos.map((u) => <EditorialChip key={u}>{u}</EditorialChip>)}
          </div>
        </div>
      )}
      {columns.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns.length}, 1fr)`,
          border: '1px solid var(--rule)',
        }}>
          {columns.map((col, i) => (
            <div key={col.key} style={{
              padding: '20px 20px 24px',
              borderRight: i < columns.length - 1 ? '1px solid var(--rule)' : 'none',
            }}>
              <FieldLabel>{col.label}</FieldLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
                {col.items.map((s) => <span key={s} style={col.itemStyle}>{col.prefix}{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Section: Atmósfera ────────────────────────────────────────────────────────

function AtmosferaSection({ m }: Readonly<{ m: Material }>) {
  if (m.emotions.length === 0) return null

  return (
    <>
      <SectionDivider index="05" title="Atmósfera" sub="emoción · sensación" />
      <div className="dp-atmosfera">
        <div>
          {m.emotions[0] && (
            <div style={{ marginBottom: 28 }}>
              <FieldLabel>Emoción primaria</FieldLabel>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 36, lineHeight: 1, color: 'var(--ink)', marginTop: 8 }}>
                {m.emotions[0]}
              </div>
            </div>
          )}
          {m.emotions[1] && (
            <div>
              <FieldLabel>Emoción secundaria</FieldLabel>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-soft)', marginTop: 6 }}>
                {m.emotions[1]}
              </div>
            </div>
          )}
        </div>
        <div>
          <FieldLabel>Etiquetas de atmósfera</FieldLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            {m.emotions.map((e) => (
              <span key={e} style={{
                fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.06em',
                padding: '7px 16px', borderRadius: 999, border: '1px solid var(--rule)',
                color: 'var(--ink-soft)', textTransform: 'lowercase',
              }}>
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Section: Riesgos y mantenimiento ─────────────────────────────────────────

function RiesgosSection({ m }: Readonly<{ m: Material }>) {
  const hasData = m.riesgosPrincipales || (m.patologiasTipicas ?? []).length > 0 || m.notasMantenimiento
  if (!hasData) return null

  return (
    <>
      <SectionDivider index="06" title="Riesgos y mantenimiento" />
      <div style={{ border: '1px solid var(--rule)', borderBottom: 'none' }}>
        {m.riesgosPrincipales && (
          <AccordionBlock title="Riesgos principales">
            <p style={{ margin: 0 }}>{m.riesgosPrincipales}</p>
          </AccordionBlock>
        )}
        {(m.patologiasTipicas ?? []).length > 0 && (
          <AccordionBlock title="Patologías típicas">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {(m.patologiasTipicas ?? []).map((p) => <EditorialChip key={p} tone="muted">{p}</EditorialChip>)}
            </div>
          </AccordionBlock>
        )}
        {m.notasMantenimiento && (
          <AccordionBlock title="Notas de mantenimiento">
            <p style={{ margin: 0 }}>{m.notasMantenimiento}</p>
          </AccordionBlock>
        )}
      </div>
    </>
  )
}

// ─── Section: Instalación ─────────────────────────────────────────────────────

function InstalacionSection({ m }: Readonly<{ m: Material }>) {
  if (!m.requisitosInstalacion) return null
  return (
    <>
      <SectionDivider index="07" title="Instalación" sub="requisitos técnicos" />
      <div style={{ border: '1px solid var(--rule)', borderBottom: 'none' }}>
        <AccordionBlock title="Requisitos de instalación">
          <p style={{ margin: 0 }}>{m.requisitosInstalacion}</p>
        </AccordionBlock>
      </div>
    </>
  )
}

// ─── Section: Compatibilidades ────────────────────────────────────────────────

function CompatSection({ m }: Readonly<{ m: Material }>) {
  const compatibles = m.materialesCompatibles ?? []
  const alts = m.alternativas ?? []
  if (compatibles.length + alts.length === 0) return null

  return (
    <>
      <SectionDivider index="08" title="Compatibilidades" sub="relaciones materiales" />
      <div className="dp-two">
        {compatibles.length > 0 && (
          <div>
            <FieldLabel>Materiales compatibles</FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {compatibles.map((c) => <EditorialChip key={c}>{c}</EditorialChip>)}
            </div>
          </div>
        )}
        {alts.length > 0 && (
          <div>
            <FieldLabel>Alternativas</FieldLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
              {alts.map((a) => <EditorialChip key={a} tone="muted">{a}</EditorialChip>)}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Section: Referencias ─────────────────────────────────────────────────────

function ReferenciasSection({ m }: Readonly<{ m: Material }>) {
  const proveedores = m.proveedoresEjemplo ?? []
  const urls = m.urlsFuente ?? []
  if (proveedores.length + urls.length === 0) return null

  return (
    <>
      <SectionDivider index="09" title="Referencias" sub="fuentes y proveedores" />
      <div className="dp-two">
        {proveedores.length > 0 && (
          <div>
            <FieldLabel>Proveedores ejemplo</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 10 }}>
              {proveedores.map((p) => (
                <span key={p} style={{ fontSize: 13, color: 'var(--ink-soft)' }}>· {p}</span>
              ))}
            </div>
          </div>
        )}
        {urls.length > 0 && (
          <div>
            <FieldLabel>Fuentes de referencia</FieldLabel>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 10 }}>
              {urls.map((u) => (
                <a
                  key={u}
                  href={u}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 12, color: 'var(--ink)',
                    fontFamily: 'var(--mono)', letterSpacing: '0.06em',
                    textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 7,
                    borderBottom: '1px solid var(--rule)', paddingBottom: 3,
                  }}
                >
                  {cleanDomain(u)}
                  <span style={{ color: 'var(--accent)', fontSize: 11 }}>↗</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

// ─── Section: Notas técnicas ──────────────────────────────────────────────────

function NotasSection({ m }: Readonly<{ m: Material }>) {
  if (!m.datosTecnicos && !m.notas) return null
  return (
    <>
      <SectionDivider index="—" title="Notas técnicas" sub="datos adicionales" />
      {m.datosTecnicos && (
        <div style={{ marginBottom: m.notas ? 24 : 0 }}>
          <FieldLabel>Datos técnicos adicionales</FieldLabel>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', margin: '8px 0 0' }}>
            {m.datosTecnicos}
          </p>
        </div>
      )}
      {m.notas && (
        <div>
          <FieldLabel>Notas</FieldLabel>
          <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-soft)', margin: '8px 0 0' }}>
            {m.notas}
          </p>
        </div>
      )}
    </>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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
      .catch((err) => setError(err instanceof Error ? err.message : 'Error'))
      .finally(() => setLoading(false))
    return () => { document.title = 'Atlas de Materiales' }
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--paper)' }}>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Cargando…
        </span>
      </div>
    )
  }

  if (error ?? !material) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--paper)' }}>
        <p style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--muted)' }}>
          {error ?? 'Material no encontrado'}
        </p>
        <Link to={PATHS.CATALOG} style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--ink)', letterSpacing: '0.1em' }}>
          ← Volver al catálogo
        </Link>
      </div>
    )
  }

  const m = material

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper)', color: 'var(--ink)' }}>

      {/* Sticky breadcrumb nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 10,
        borderBottom: '1px solid var(--rule)',
        background: 'var(--paper)',
        padding: '13px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backdropFilter: 'blur(6px)',
      }}>
        <Link to={PATHS.CATALOG} style={{
          fontFamily: 'var(--mono)', fontSize: 11,
          color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.08em',
        }}>
          ← Atlas de Materiales / {m.category}
        </Link>
        <span style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted-soft)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          Vol. I · Ed. 2026
        </span>
      </nav>

      {/* Hero */}
      <HeroSection m={m} />

      {/* Lead description */}
      {m.description && (
        <div style={{ maxWidth: 680, margin: '72px auto 0', padding: '0 32px' }}>
          <p style={{
            fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.7,
            color: 'var(--ink-soft)', margin: 0,
          }}>
            {m.description}
          </p>
        </div>
      )}

      {/* All sections */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '0 32px 120px' }}>
        <FichaSection m={m} />
        <PropiedadesSection m={m} />
        <SensorialSection m={m} />
        <EspacialSection m={m} />
        <AtmosferaSection m={m} />
        <RiesgosSection m={m} />
        <InstalacionSection m={m} />
        <CompatSection m={m} />
        <ReferenciasSection m={m} />
        <NotasSection m={m} />

        {/* Keywords */}
        {m.keywords.length > 0 && (
          <>
            <SectionDivider index="—" title="Vocabulario" sub="palabras clave" />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {m.keywords.map((k) => (
                <span key={k} style={{
                  fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.06em',
                  padding: '4px 10px', border: '1px solid var(--rule)', borderRadius: 999,
                  color: 'var(--muted)',
                }}>
                  #{k}
                </span>
              ))}
            </div>
          </>
        )}
      </div>

    </div>
  )
}
