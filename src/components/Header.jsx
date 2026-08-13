import { categories } from '../data/catalog.js'
export default function Header({ query, setQuery, cartCount, favorites, onPage, onCategory, onCart, onFavorites }) {
  const openSearch = () => onPage('search')
  return <><div className="offer">Frete grátis acima de R$ 500 <i>•</i> Até 12x sem juros <i>•</i> Compra protegida</div>
    <header><div className="container top"><button className="logo" onClick={() => onPage('home')}>🔥 ACHEII</button>
      <label className="search">🔎<input value={query} onFocus={openSearch} onChange={e => { setQuery(e.target.value); openSearch() }} placeholder="Buscar peças, categorias, marcas..." /></label>
      <div className="header-actions"><button onClick={onFavorites}>♡{favorites > 0 && <sup />}</button><button aria-label="Pedidos" onClick={() => onPage('track')}>📦</button><button className="login" onClick={() => onPage('auth')}>Entrar</button><button className="cart" onClick={onCart}>🛒 Carrinho <b>{cartCount}</b></button></div></div>
      <nav className="container"><button onClick={() => onPage('home')}>Início</button><div className="nav-dropdown"><button>Categorias ▾</button><div>{categories.slice(1).map(c => <button key={c} onClick={() => onCategory(c)}>{c}</button>)}</div></div><button onClick={() => onPage('track')}>📦 Pedidos</button><button onClick={() => onPage('seller')}>🏪 Vendedores</button></nav>
    </header></>
}