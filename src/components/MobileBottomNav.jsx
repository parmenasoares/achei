const icons = {
  home: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10Z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.8" cy="10.8" r="6.3" />
      <path d="m16 16 4.4 4.4" />
    </svg>
  ),
  track: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 3h12v18H6zM9 7h6M9 11h6M9 15h4" />
    </svg>
  ),
  profile: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 21c.7-4 3.2-6 7.5-6s6.8 2 7.5 6" />
    </svg>
  )
}

const items = [
  { id: 'home', icon: 'home', label: 'Início' },
  { id: 'search', icon: 'search', label: 'Buscar' },
  { id: 'track', icon: 'track', label: 'Pedidos' },
  { id: 'auth', icon: 'profile', label: 'Perfil' }
]

export default function MobileBottomNav({ activePage, onNavigate, onSearch }) {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegação principal">
      {items.map((item) => {
        const active = item.id === 'search' ? false : activePage === item.id

        return (
          <button
            className={active ? 'active' : ''}
            key={item.id}
            onClick={() => item.id === 'search' ? onSearch() : onNavigate(item.id)}
          >
            <span className="bottom-icon">{icons[item.icon]}</span>
            <span>{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
