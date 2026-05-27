import { useCatalog } from '@/features/catalog'
import { MaterialGrid } from '@/features/catalog/components/MaterialGrid'
import { MaterialDetail } from '@/features/catalog/components/MaterialDetail'
import { SensoryMap } from '@/features/catalog/components/SensoryMap'
import { MaterialCompare } from '@/features/catalog/components/MaterialCompare'
import { FilterSidebar } from '@/features/filters'
import { Footer } from '@/components/Footer'

export function CatalogPage() {
  const {
    materials, filtered, isLoading, error,
    view, setView,
    filters, updateFilters, toggleSet, toggleSingle, updateScore, resetFilters,
    filterPills, filterActive,
    openMaterial, openMaterialById, closeMaterial,
    compare, compareSet, toggleCompare,
  } = useCatalog()

  const showSidebar = view !== 'compare'

  return (
    <div className="atlas">
      {/* ── Topbar ── */}
      <header className="topbar">
        <div className="left">
          <img src="/MORPHE2.png" alt="Morphé Studio" style={{ height: 48, width: 'auto', objectFit: 'contain' }} />
          <div className="wordmark">Morphé Studio</div>
          <div className="wordmark-sub">Vol.&nbsp;I · {materials.length} entradas · ed. 2026</div>
        </div>

        <div className="viewswitch">
          <button type="button" className={view === 'catalog' ? 'active' : ''} onClick={() => setView('catalog')}>
            Catálogo
          </button>
          <button
            type="button"
            className={view === 'map' ? 'active' : ''}
            onClick={() => setView('map')}
            style={view === 'map' ? undefined : { backgroundColor: 'rgb(199,170,141)', color: 'rgb(86,57,57)' }}
          >
            Mapa sensorial
          </button>
          <button type="button" className={view === 'compare' ? 'active' : ''} onClick={() => setView('compare')}>
            Comparar
          </button>
        </div>

        <div className="right">
          <button type="button" className="iconbtn" title="Comparación" onClick={() => setView('compare')}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="5" width="8" height="14" rx="1" />
              <rect x="13" y="5" width="8" height="14" rx="1" />
            </svg>
            {compare.length > 0 && <span className="cnt">{compare.length}</span>}
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={'body' + (showSidebar ? '' : ' full')}>
        {showSidebar && (
          <FilterSidebar
            materials={materials}
            filters={filters}
            total={materials.length}
            shown={filtered.length}
            onUpdate={updateFilters}
            onToggleSet={toggleSet}
            onToggleSingle={toggleSingle}
            onUpdateScore={updateScore}
            onReset={resetFilters}
            filterActive={filterActive}
          />
        )}

        {isLoading && (
          <div className="main">
            <div className="empty">Cargando materiales…</div>
          </div>
        )}

        {error && (
          <div className="main">
            <div className="empty">{error}</div>
          </div>
        )}

        {!isLoading && !error && view === 'catalog' && (
          <MaterialGrid
            materials={materials}
            filtered={filtered}
            compareSet={compareSet}
            onOpen={openMaterialById}
            onToggleCompare={toggleCompare}
            onReset={resetFilters}
            filterPills={filterPills}
          />
        )}

        {!isLoading && !error && view === 'map' && (
          <SensoryMap
            materials={materials}
            filters={filters}
            compareSet={compareSet}
            onOpen={openMaterialById}
          />
        )}

        {!isLoading && !error && view === 'compare' && (
          <MaterialCompare
            materials={materials}
            compare={compare}
            onToggleCompare={toggleCompare}
            onOpen={openMaterialById}
          />
        )}
      </div>

      <Footer />

      {/* ── Detail overlay ── */}
      {openMaterial && (
        <MaterialDetail
          material={openMaterial}
          materials={materials}
          compareSet={compareSet}
          onClose={closeMaterial}
          onOpen={openMaterialById}
          onToggleCompare={toggleCompare}
        />
      )}
    </div>
  )
}
