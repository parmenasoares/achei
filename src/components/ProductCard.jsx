const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85'
const recoverImage = event => {
  const image = event.currentTarget
  if (image.dataset.recovered) return
  image.dataset.recovered = 'true'
  image.src = FALLBACK_IMAGE
}

export default function ProductCard({ product, favorite, onFavorite, onOpen, onAdd }) {
  return (
    <article className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" onError={recoverImage} />
        <small className={`badge ${product.badge === 'PROMOÇÃO' ? 'red' : ''}`}>{product.badge}</small>
        <button className={favorite ? 'favorite active' : 'favorite'} aria-label="Favoritar" onClick={event => { event.stopPropagation(); onFavorite(product.id) }}>{favorite ? '♥' : '♡'}</button>
      </div>
      <div className="product-info">
        <small>{product.category}</small><h3>{product.name}</h3><p>{product.description}</p>
        <div className="rating">★ {product.rating} ({product.reviews} avaliações)</div>
        <footer><b>{money(product.price)}</b><button aria-label="Adicionar ao carrinho" onClick={event => { event.stopPropagation(); onAdd(product) }}>+</button></footer>
      </div>
    </article>
  )
}
