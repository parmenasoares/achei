const orders = [
  { id: 'ACH-2025-00123', status: 'Em trânsito', date: '12 jan 2025', total: 'R$ 289,90' },
  { id: 'ACH-2024-00992', status: 'Entregue', date: '28 dez 2024', total: 'R$ 145,50' }
]

export default function Account({ onNavigate }) {
  return (
    <main className="container dashboard-page">
      <section className="dashboard-hero">
        <div className="profile-avatar">PS</div>
        <div><small>MINHA CONTA</small><h1>Olá, Pármenas</h1><p>Gerencie pedidos, dados e seus produtos favoritos.</p></div>
        <button className="secondary" onClick={() => onNavigate('auth')}>Editar perfil</button>
      </section>
      <div className="dashboard-tabs">
        <button className="active">Visão geral</button><button onClick={() => onNavigate('track')}>Meus pedidos</button><button>Endereços</button><button>Pagamentos</button>
      </div>
      <section className="dashboard-cards">
        <article><span>📦</span><b>2</b><small>Pedidos em andamento</small></article>
        <article><span>♥</span><b>6</b><small>Produtos favoritos</small></article>
        <article><span>🏆</span><b>R$ 84</b><small>Economia acumulada</small></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel"><div className="panel-title"><h2>Pedidos recentes</h2><button onClick={() => onNavigate('track')}>Ver todos</button></div>{orders.map(order => <div className="order-row" key={order.id}><span>📦</span><div><b>{order.id}</b><small>{order.date}</small></div><em className={order.status === 'Entregue' ? 'done' : ''}>{order.status}</em><b>{order.total}</b></div>)}</article>
        <article className="panel"><div className="panel-title"><h2>Atalhos</h2></div><button className="quick-link" onClick={() => onNavigate('home')}>🛍️ Continuar comprando <span>›</span></button><button className="quick-link">📍 Meus endereços <span>›</span></button><button className="quick-link">💳 Formas de pagamento <span>›</span></button></article>
      </section>
    </main>
  )
}
