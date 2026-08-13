import HeroSlider from '../components/HeroSlider.jsx'
import CategoryRail from '../components/CategoryRail.jsx'
import PartnerCarousel from '../components/PartnerCarousel.jsx'
import { categories } from '../data/catalog.js'

export default function Home({ products, onOpen, onPage, onCategory }) {
  return <><HeroSlider onCatalog={() => onPage('search')} onSellers={() => onPage('seller')} onTrack={() => onPage('track')} />
    <CategoryRail categories={categories} selected="Todos" onSelect={onCategory} />
    <main className="container home-impact">
      <section className="home-intro"><div><small>ENCONTRE. COMPARE. COMPRE.</small><h2>Peças, lojas e ofertas em um só lugar.</h2><p>Escolha uma categoria para iniciar sua busca com compatibilidade completa para o seu veículo.</p></div><button className="primary" onClick={() => onPage('search')}>Buscar peça e veículo →</button></section>
      <PartnerCarousel products={products} onOpen={onOpen} onSellers={() => onPage('seller')} />
    </main></>
}