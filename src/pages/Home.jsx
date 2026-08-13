import HeroSlider from '../components/HeroSlider.jsx'
import CategoryRail from '../components/CategoryRail.jsx'
import ProductCard from '../components/ProductCard.jsx'
import VehicleFilter from '../components/VehicleFilter.jsx'
import { categories } from '../data/catalog.js'

export default function Home({ products, category, setCategory, sort, setSort, favorites, onFavorite, onOpen, onAdd, onPage, vehicleFilters, setVehicleFilters }) {
  const catalog = () => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <HeroSlider onCatalog={catalog} onSellers={() => onPage('seller')} onTrack={() => onPage('track')} />
      <CategoryRail categories={categories} selected={category} onSelect={setCategory} />
      <main id="catalog" className="container catalog">
        <div className="section-heading">
          <div><small>CATÁLOGO AUTOMOTIVO</small><h2>🔥 Produtos disponíveis</h2></div>
          <span>{products.length} produtos</span>
        </div>
        <VehicleFilter value={vehicleFilters} onChange={setVehicleFilters} />
        <div className="filters">
          {categories.map(c => <button className={c === category ? 'active' : ''} key={c} onClick={() => setCategory(c)}>{c}</button>)}
          <select value={sort} onChange={e => setSort(e.target.value)}>
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor preço</option>
            <option value="price-desc">Maior preço</option>
            <option value="rating">Melhor avaliação</option>
          </select>
        </div>
        <div id="products" className="products">
          {products.length
            ? products.map(p => <ProductCard key={p.id} product={p} favorite={favorites.includes(p.id)} onFavorite={onFavorite} onOpen={onOpen} onAdd={onAdd} />)
            : <div className="empty">🔎<br />Nenhum produto encontrado.</div>}
        </div>
      </main>
    </>
  )
}
