const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Fallback por categoria — imagem relevante para cada tipo de peça
const CATEGORY_FALLBACK = {
  'Suspensão':    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
  'Freio':        'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600&q=80',
  'Elétrico':     'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&q=80',
  'Arrefecimento':'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=600&q=80',
  'Energia':      'https://images.unsplash.com/photo-1620714223084-8fcacc2dbe5d?w=600&q=80',
  'Lubrificantes':'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&q=80',
  'Filtros':      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80',
  'Ignição':      'https://images.unsplash.com/photo-1597766353939-3b8b41f11ef3?w=600&q=80',
  'Motor':        'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80',
  'Iluminação':   'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
  'DEFAULT':      'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80',
}

const recoverImage = (event, category) => {
  const image = event.currentTarget
  if (image.dataset.recovered) return
  image.dataset.recovered = 'true'
  image.src = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK['DEFAULT']
}

export default function ProductCard({ product, favorite, onFavorite, onOpen, onAdd }) {
  return (
    <article className="product-card" onClick={() => onOpen(product)}>
      <div className="product-image">
        <img src={product.image} alt={product.name} loading="lazy" referrerPolicy="no-referrer" onError={event => recoverImage(event, product.category)} />
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

