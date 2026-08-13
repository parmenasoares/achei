import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import MobileBottomNav from './components/MobileBottomNav.jsx'
import Home from './pages/Home.jsx'
import Search from './pages/Search.jsx'
import Product from './pages/Product.jsx'
import Seller from './pages/Seller.jsx'
import Checkout from './pages/Checkout.jsx'
import Track from './pages/Track.jsx'
import Auth from './pages/Auth.jsx'
import Account from './pages/Account.jsx'
import SellerDashboard from './pages/SellerDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import DeliverySignup from './pages/DeliverySignup.jsx'
import { products } from './data/catalog.js'
import { loadRemoteProducts } from './data/productRepository.js'

const read = key => { try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] } }
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
const synonyms = { amortecedor: 'suspensao', suspensao: 'amortecedor', freio: 'pastilha disco', pastilha: 'freio', disco: 'freio', bateria: 'energia', oleo: 'lubrificantes motor', vela: 'ignicao', correia: 'motor', filtro: 'ar filtros', radiador: 'arrefecimento' }

export default function App() {
  const [page, setPage] = useState('home')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('Todos')
  const [sort, setSort] = useState('default')
  const [vehicleFilters, setVehicleFilters] = useState({ part: '', make: '', model: '', year: '', engine: '' })
  const [catalogProducts, setCatalogProducts] = useState(products)
  const [favorites, setFavorites] = useState(read('acheii_wish'))
  const [cart, setCart] = useState(read('acheii_cart'))
  const [selected, setSelected] = useState(null)
  const [drawer, setDrawer] = useState(null)
  const [payment, setPayment] = useState('Cartão de crédito')
  const [toast, setToast] = useState('')
  const [chat, setChat] = useState(false)

  useEffect(() => localStorage.setItem('acheii_wish', JSON.stringify(favorites)), [favorites])
  useEffect(() => localStorage.setItem('acheii_cart', JSON.stringify(cart)), [cart])
  useEffect(() => { loadRemoteProducts().then(remote => { if (remote?.length) setCatalogProducts(remote) }).catch(() => {}) }, [])
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer) }, [toast])

  const visible = useMemo(() => catalogProducts.filter(product => {
    const fit = product.fitment
    const expandedSearch = normalize(query).split(/\s+/).filter(Boolean).flatMap(term => [term, ...(synonyms[term] || '').split(' ')]).filter(Boolean)
    const text = normalize(`${product.name} ${product.category} ${product.description} ${fit.make} ${fit.model} ${fit.engines.join(' ')}`)
    return (category === 'Todos' || product.category === category)
      && expandedSearch.every(term => text.includes(term))
      && text.includes(vehicleFilters.part.toLowerCase())
      && (!vehicleFilters.make || fit.make === vehicleFilters.make)
      && (!vehicleFilters.model || fit.model === vehicleFilters.model)
      && (!vehicleFilters.year || fit.years.includes(vehicleFilters.year))
      && (!vehicleFilters.engine || fit.engines.includes(vehicleFilters.engine))
  }).sort((a, b) => sort === 'price-asc' ? a.price - b.price : sort === 'price-desc' ? b.price - a.price : sort === 'rating' ? b.rating - a.rating : 0), [query, category, sort, vehicleFilters])

  const navigate = nextPage => { setPage(nextPage); setDrawer(null); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const openSearch = () => navigate('search')
  const add = product => { setCart(items => { const item = items.find(x => x.id === product.id); return item ? items.map(x => x.id === product.id ? { ...x, qty: x.qty + 1 } : x) : [...items, { ...product, qty: 1 }] }); setToast('Produto adicionado ao carrinho!') }
  const open = product => { setSelected(product); navigate('product') }
  const toggle = id => setFavorites(items => items.includes(id) ? items.filter(x => x !== id) : [...items, id])
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const selectCategory = value => { setCategory(value); navigate('search') }

  const content = page === 'home' ? <Home products={catalogProducts} onOpen={open} onPage={navigate} onCategory={selectCategory} />
    : page === 'search' ? <Search products={visible} category={category} setCategory={setCategory} sort={sort} setSort={setSort} favorites={favorites} onFavorite={toggle} onOpen={open} onAdd={add} vehicleFilters={vehicleFilters} setVehicleFilters={setVehicleFilters} />
    : page === 'product' ? <Product product={selected} favorite={selected && favorites.includes(selected.id)} onFavorite={toggle} onAdd={(product, buy) => { add(product); if (buy) navigate('checkout') }} onBack={() => navigate('search')} onSeller={() => navigate('seller')} />
    : page === 'seller' ? <Seller products={catalogProducts} favorites={favorites} onFavorite={toggle} onOpen={open} onAdd={add} onChat={() => setChat(true)} />
    : page === 'checkout' ? <Checkout cart={cart} payment={payment} setPayment={setPayment} onConfirm={order => { const orders = read('acheii_orders'); localStorage.setItem('acheii_orders', JSON.stringify([order, ...orders])); setCart([]); setToast('Pedido confirmado! Código: ' + order.id); navigate('track') }} />
    : page === 'track' ? <Track onSearch={openSearch} />
    : page === 'account' ? <Account onNavigate={navigate} />
    : page === 'seller-dashboard' ? <SellerDashboard onNavigate={navigate} />
    : page === 'admin-dashboard' ? <AdminDashboard />
    : page === 'delivery' ? <DeliverySignup />
    : <Auth onLogin={role => { setToast('Acesso realizado!'); navigate(role === 'seller' ? 'seller-dashboard' : role === 'admin' ? 'admin-dashboard' : 'account') }} />

  return <><Header query={query} setQuery={setQuery} cartCount={cartCount} favorites={favorites.length} onPage={navigate} onCategory={selectCategory} onCart={() => setDrawer('cart')} onFavorites={() => setDrawer('favorites')} />{content}<Footer onPage={navigate} /><MobileBottomNav activePage={page === 'account' ? 'auth' : page} onNavigate={navigate} onSearch={openSearch} />
    {drawer && <div className="overlay" onClick={() => setDrawer(null)}><aside className="drawer" onClick={event => event.stopPropagation()}><button className="close" onClick={() => setDrawer(null)}>×</button><h2>{drawer === 'cart' ? '🛒 Carrinho' : '♥ Favoritos'}</h2>{(drawer === 'cart' ? cart : catalogProducts.filter(product => favorites.includes(product.id))).length === 0 ? <p className="empty">Nada por aqui ainda.</p> : (drawer === 'cart' ? cart : catalogProducts.filter(product => favorites.includes(product.id))).map(product => <div className="drawer-item" key={product.id}><img src={product.image} alt="" /><p>{product.name}<b>R$ {(product.price * (product.qty || 1)).toFixed(2).replace('.', ',')}</b></p>{drawer === 'cart' ? <div><button onClick={() => setCart(items => items.map(item => item.id === product.id ? { ...item, qty: Math.max(1, item.qty - 1) } : item))}>−</button> {product.qty} <button onClick={() => setCart(items => items.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item))}>+</button></div> : <button onClick={() => toggle(product.id)}>🗑</button>}</div>)}{drawer === 'cart' && <button className="primary full" onClick={() => navigate('checkout')}>Finalizar compra →</button>}</aside></div>}
    {chat && <section className="chat"><button onClick={() => setChat(false)}>×</button><b>🏪 AutoPeças Premium SP</b><p>Olá! Como posso ajudar? 😊</p><input placeholder="Digite uma mensagem..." /></section>}{toast && <div className="toast">{toast}</div>}</>
}