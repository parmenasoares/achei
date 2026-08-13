const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductCard({ product, favorite, onFavorite, onOpen, onAdd }) {
  return (
    <article className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" />
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
