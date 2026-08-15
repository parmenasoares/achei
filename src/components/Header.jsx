import { useState, useRef, useEffect } from 'react'
import { categories } from '../data/catalog.js'

export default function Header({ query, setQuery, cartCount, favorites, onPage, onCategory, onCart, onFavorites, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const openSearch = () => onPage('search')

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handler = e => { if (!menuRef.current?.contains(e.target)) setMenuOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Primeiro nome apenas
  const firstName = user?.name?.split(' ')[0] || ''

  const userMenu = user ? (
    <div className="user-menu-wrap" ref={menuRef}>
      <button className="user-trigger" onClick={() => setMenuOpen(v => !v)}>
        {user.avatar
          ? <img src={user.avatar} alt={firstName} className="user-avatar" />
          : <span className="user-initials">{firstName.charAt(0).toUpperCase()}</span>
        }
        <span className="user-greeting">Olá, {firstName}</span>
        <span className="user-arrow">{menuOpen ? '▴' : '▾'}</span>
      </button>
      {menuOpen && (
        <div className="user-dropdown">
          <div className="user-dropdown-header">
            {user.avatar
              ? <img src={user.avatar} alt={firstName} className="user-avatar-lg" />
              : <span className="user-initials-lg">{firstName.charAt(0).toUpperCase()}</span>
            }
            <div>
              <div className="user-dropdown-name">{user.name}</div>
              <div className="user-dropdown-email">{user.email}</div>
            </div>
          </div>
          <div className="user-dropdown-divider" />
          <button onClick={() => { onPage('account'); setMenuOpen(false) }}>👤 Meu perfil</button>
          <button onClick={() => { onPage('account'); setMenuOpen(false) }}>📦 Meus pedidos</button>
          <button onClick={() => { onPage('account'); setMenuOpen(false) }}>🛍️ Minhas compras</button>
          <button onClick={() => { onPage('account'); setMenuOpen(false) }}>📍 Endereços</button>
          {user.role === 'seller' && (
            <button onClick={() => { onPage('seller-dashboard'); setMenuOpen(false) }}>🏪 Painel do vendedor</button>
          )}
          {user.role === 'admin' && (
            <button onClick={() => { onPage('admin-dashboard'); setMenuOpen(false) }}>⚙️ Painel admin</button>
          )}
          <div className="user-dropdown-divider" />
          <button className="logout-btn" onClick={() => { onLogout(); setMenuOpen(false) }}>🚪 Sair</button>
        </div>
      )}
    </div>
  ) : (
    <button className="login" onClick={() => onPage('auth')}>Entrar</button>
  )

  return (
    <>
      <div className="offer">
        Frete grátis acima de R$ 500 <i>•</i> Até 12x sem juros <i>•</i> Compra protegida
      </div>
      <header>
        <div className="container top">
          <button className="logo" onClick={() => onPage('home')}>🔥 ACHEI</button>
          <label className="search">
            🔎
            <input
              value={query}
              onFocus={openSearch}
              onChange={e => { setQuery(e.target.value); openSearch() }}
              placeholder="Buscar peças, categorias, marcas..."
            />
          </label>
          <div className="header-actions">
            <button onClick={onFavorites}>♡{favorites > 0 && <sup />}</button>
            <button aria-label="Pedidos" onClick={() => onPage('track')}>📦</button>
            {userMenu}
            <button className="cart" onClick={onCart}>🛒 Carrinho <b>{cartCount}</b></button>
          </div>
        </div>
        <nav className="container">
          <button onClick={() => onPage('home')}>Início</button>
          <div className="nav-dropdown">
            <button>Categorias ▾</button>
            <div>{categories.slice(1).map(c => <button key={c} onClick={() => onCategory(c)}>{c}</button>)}</div>
          </div>
          <button onClick={() => onPage('track')}>📦 Pedidos</button>
          <button onClick={() => onPage('seller')}>🏪 Vendedores</button>
        </nav>
      </header>
    </>
  )
}
