import ProductCard from '../components/ProductCard.jsx'
import VehicleFilter from '../components/VehicleFilter.jsx'
import { categories } from '../data/catalog.js'

export default function Search({ products, category, setCategory, sort, setSort, favorites, onFavorite, onOpen, onAdd, vehicleFilters, setVehicleFilters }) {
  return <main className="container catalog search-page">
    <section className="search-page__hero"><small>BUSCA INTELIGENTE</small><h1>Encontre a peça certa para o seu veículo.</h1><p>Informe a peça e a compatibilidade para comparar lojas e preços.</p></section>
    <VehicleFilter value={vehicleFilters} onChange={setVehicleFilters} />
    <div className="section-heading"><div><small>CATÁLOGO AUTOMOTIVO</small><h2>Produtos compatíveis</h2></div><span>{products.length} produtos</span></div>
    <div className="filters">{categories.map(c => <button className={c === category ? 'active' : ''} key={c} onClick={() => setCategory(c)}>{c}</button>)}<select value={sort} onChange={e => setSort(e.target.value)}><option value="default">Ordenar por</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="rating">Melhor avaliação</option></select></div>
    <div className="products">{products.length ? products.map(p => <ProductCard key={p.id} product={p} favorite={favorites.includes(p.id)} onFavorite={onFavorite} onOpen={onOpen} onAdd={onAdd} />) : <div className="empty">🔎<br />Nenhum produto encontrado.</div>}</div>
  </main>
}