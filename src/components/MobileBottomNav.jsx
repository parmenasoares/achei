const items = [
  { id: 'home', icon: '⌂', label: 'Início' },
  { id: 'search', icon: '⌕', label: 'Buscar' },
  { id: 'track', icon: '▤', label: 'Pedidos' },
  { id: 'auth', icon: '●', label: 'Perfil' }
]

export default function MobileBottomNav({ activePage, onNavigate, onSearch }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação principal">
      {items.map((item) => {
        const active = item.id === 'search' ? activePage === 'home' && false : activePage === item.id

        return (
          <button
            className={active ? 'active' : ''}
            key={item.id}
            onClick={() => item.id === 'search' ? onSearch() : onNavigate(item.id)}
          >
            <span className={`bottom-icon ${item.id}`}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
