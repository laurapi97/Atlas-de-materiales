import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

export function HomePage() {
  return (
    <div
      className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-start px-6 pt-24 pb-32"
      style={{ background: 'var(--paper)' }}
    >
      {/* ── Editorial heading ── */}
      <header className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="home-eyebrow">Investigación Arquitectónica</span>
        <h1 className="home-title">Atlas de Materiales</h1>
        <span className="home-edition">Vol. I · Ed. 2026</span>
      </header>

      {/* ── Vertical rule ── */}
      <div style={{ width: '1px', height: '40px', background: 'var(--rule)', marginBottom: '52px' }} />

      {/* ── Hero image ── */}
      <div className="home-hero" style={{ marginBottom: '52px' }}>
        <div className="home-hero-inner" />
        <div className="home-hero-label">
          <span>Travertino Romano</span>
          <span>·</span>
          <span>Piedra Natural</span>
          <span>·</span>
          <span>Ref. 001</span>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="home-body" style={{ marginBottom: '48px' }}>
        Una colección de materiales para la arquitectura contemporánea.{' '}
        Texturas, propiedades y emociones, reunidas en un archivo editorial de referencia.
      </p>

      {/* ── CTA ── */}
      <Link to={PATHS.CATALOG} className="home-cta">
        Entrar al Catálogo
      </Link>

      {/* ── Bottom mark ── */}
      <div style={{ marginTop: '80px', width: '1px', height: '52px', background: 'var(--rule)' }} />
    </div>
  )
}
