import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'

export function HomePage() {
  return (
    <div
      className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-start px-6 pt-24 pb-32"
      style={{ background: 'var(--paper)' }}
    >
      {/* ── Logo ── */}
      <header className="mb-14 flex flex-col items-center gap-3 text-center">
        <img src="/MORPHE.png" alt="Morphé Studio" style={{ width: 320, maxWidth: '80vw', height: 'auto', marginBottom: 4 }} />
        <p style={{ fontFamily: 'var(--serif)', fontSize: 22, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--ink)', margin: 0 }}>Morphé Studio</p>
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
