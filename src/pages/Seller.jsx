import { useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { stores } from '../data/catalog.js'

export default function Seller({ products, favorites, onFavorite, onOpen, onAdd, onChat }) {
  const [selectedStore, setSelectedStore] = useState(stores[0])
  const storeProducts = products.filter(product => product.sellerId === selectedStore.id)
  return <main className="container seller-page">
    <button className="breadcrumb">Início / Vendedores</button>
    <section className="store-list"><div className="section-heading"><div><small>LOJAS VERIFICADAS</small><h2>Encontre seu vendedor</h2></div><span>{stores.length} lojas</span></div>
      <div className="store-grid">{stores.map(store => <button key={store.id} className={selectedStore.id === store.id ? 'store-card active' : 'store-card'} onClick={() => setSelectedStore(store)}><span className="store-icon">{store.icon}</span><b>{store.name}</b><small>⭐ {store.rating} · {store.sales} vendas</small><em>{store.specialty}</em></button>)}</div>
    </section>
    <section className="seller-hero"><div className="seller-avatar">{selectedStore.icon}</div><div><h1>{selectedStore.name} {selectedStore.verified && '✓'}</h1><p>Loja verificada, com catálogo atualizado, pagamento protegido e envio para todo o Brasil.</p><div className="seller-stats"><span><b>{selectedStore.rating}</b>Avaliação</span><span><b>{selectedStore.sales}</b>Vendas</span><span><b>98%</b>Satisfação</span><span><b>{selectedStore.response}</b>Resposta</span></div></div><div className="actions"><button className="primary">Seguir</button><button className="secondary" onClick={onChat}>💬 Chat</button></div></section>
    <div className="section-heading"><div><small>{selectedStore.specialty.toUpperCase()}</small><h2>Produtos da loja</h2></div><span>{storeProducts.length} produtos</span></div>
    <div className="products">{storeProducts.map(product => <ProductCard key={product.id} product={product} favorite={favorites.includes(product.id)} onFavorite={onFavorite} onOpen={onOpen} onAdd={onAdd} />)}</div>
  </main>
}