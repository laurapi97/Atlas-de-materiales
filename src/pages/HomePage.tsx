import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { PATHS } from '@/routes/paths'
import { useMaterials } from '@/features/catalog'
import { Footer } from '@/components/Footer'

export function HomePage() {
  const { materials } = useMaterials()
  const [imgErr, setImgErr] = useState(false)

  const hero = useMemo(() => {
    const withImage = materials.filter((m) => m.coverImage || m.imageUrl)
    if (withImage.length === 0) return null
    return withImage[Math.floor(Math.random() * withImage.length)]
  }, [materials])

  const heroImg = hero?.coverImage ?? hero?.imageUrl
  const showImg = !!heroImg && !imgErr

  return (
    <>
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
          <div className="home-hero-inner">
            {showImg && (
              <img
                src={heroImg}
                alt={hero?.name ?? ''}
                onError={() => setImgErr(true)}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}
          </div>
          <div className="home-hero-label">
            <span>{hero?.name ?? 'Travertino Romano'}</span>
            <span>·</span>
            <span>{hero?.category ?? 'Piedra Natural'}</span>
            <span>·</span>
            <span>Ref. {hero ? String(materials.indexOf(hero) + 1).padStart(3, '0') : '001'}</span>
          </div>
        </div>

        {/* ── Description ── */}
        <p className="home-body" style={{ marginBottom: '48px' }}>
          Una referencia viva para el diseño interior, la arquitectura y el diseño industrial.
          Aquí encontrarás la información técnica, sensorial y emocional que necesitas para elegir
          con criterio los materiales de tu próximo proyecto. Busca, filtra y compara materiales
          por sus propiedades, su atmósfera y su comportamiento en el espacio.
        </p>

        {/* ── CTA ── */}
        <Link to={PATHS.CATALOG} className="home-cta">
          Entrar al Catálogo
        </Link>

        {/* ── Bottom mark ── */}
        <div style={{ marginTop: '80px', width: '1px', height: '52px', background: 'var(--rule)' }} />
      </div>

      <Footer />
    </>
  )
}
