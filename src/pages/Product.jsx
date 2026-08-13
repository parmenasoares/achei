import { useState } from 'react'
import { reviews } from '../data/catalog.js'

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=85'
const recoverImage = event => {
  const image = event.currentTarget
  if (image.dataset.recovered) return
  image.dataset.recovered = 'true'
  image.src = FALLBACK_IMAGE
}

export default function Product({ product, favorite, onFavorite, onAdd, onBack, onSeller }) {
  const [detail, setDetail] = useState('compatibility')
  if (!product) return null
  const discount = Math.round((1 - product.price / product.oldPrice) * 100)
  const fitment = product.fitment

  return <main className="container product-page">
    <button className="breadcrumb" onClick={onBack}>Início / {product.category} / {product.name}</button>
    <div className="product-layout">
      <section><div className="gallery"><img src={product.image} alt={product.name} referrerPolicy="no-referrer" onError={recoverImage} /></div></section>
      <section className="details"><span className="badge">{product.badge}</span><h1>{product.name}</h1>
        <div className="rating">★★★★★ <b>{product.rating}</b> ({product.reviews} avaliações)</div>
        <div className="price-box"><b>{money(product.price)}</b><del>{money(product.oldPrice)}</del><mark>-{discount}%</mark><p>ou 12x de {money(product.price / 12)} sem juros</p></div>
        <div className="actions"><button className="primary" onClick={() => onAdd(product, true)}>🛒 Comprar agora</button><button className={favorite ? 'wish active' : 'wish'} onClick={() => onFavorite(product.id)}>{favorite ? '♥' : '♡'}</button></div>
        <div className="features"><span>✅ Produto original</span><span>📦 Entrega em 1–3 dias</span><span>🔄 Troca em 30 dias</span><span>💳 12x sem juros</span></div>
        <button className="seller-box" onClick={onSeller}>🏪 <span><b>AutoPeças Premium SP</b><small>⭐ 4.9 · 2.3k vendas · Vendedor verificado ✅</small></span>›</button>
      </section>
    </div>
    <section className="product-details">
      <div className="detail-tabs"><button className={detail === 'compatibility' ? 'active' : ''} onClick={() => setDetail('compatibility')}>Compatibilidade</button><button className={detail === 'description' ? 'active' : ''} onClick={() => setDetail('description')}>Descrição técnica</button></div>
      {detail === 'compatibility'
        ? <div className="compatibility-card"><div><small>PEÇA COMPATÍVEL COM</small><h2>{fitment.make} {fitment.model}</h2><p>Confira o ano e a motorização antes de finalizar a compra.</p></div><div className="compatibility-specs"><span><b>Montadora</b>{fitment.make}</span><span><b>Modelo</b>{fitment.model}</span><span><b>Anos</b>{fitment.years[0]}–{fitment.years.at(-1)}</span><span><b>Motor</b>{fitment.engines.join(' / ')}</span></div><p className="fitment-note">✓ Compatibilidade conferida para os veículos acima. Em caso de dúvida, informe o chassi ao vendedor.</p></div>
        : <article className="technical-description"><h2>Sobre esta peça</h2><p>{product.description}</p><ul><li>Aplicação indicada para {fitment.make} {fitment.model}.</li><li>Fabricada para desempenho e encaixe preciso.</li><li>Verifique a compatibilidade pelo ano, motor e chassi.</li></ul></article>}
    </section>
    <section className="reviews"><h2>💬 Avaliações</h2><div className="review-summary"><div><b>{product.rating}</b><span>★★★★★</span><small>{product.reviews} avaliações</small></div><div className="bars">{[75,18,5,2,1].map((value, index) => <p key={index}>{5 - index}★ <i><em style={{ width: `${value}%` }} /></i> {value}%</p>)}</div></div>{reviews.map(review => <article className="review" key={review.name}><b>👤 {review.name}</b><small>{review.date} · Compra verificada ✅</small><span>{'★'.repeat(review.stars)}</span><p>{review.text}</p></article>)}</section>
  </main>
}