const sellerOrders = [
  ['#ACH-00123', 'Amortecedor Dianteiro Premium', 'R$ 289,90', 'A separar'],
  ['#ACH-00119', 'Pastilha de Freio Cerâmica', 'R$ 145,50', 'Enviado'],
  ['#ACH-00115', 'Bateria 60Ah Premium', 'R$ 389,90', 'Entregue']
]

export default function SellerDashboard({ onNavigate }) {
  return (
    <main className="container dashboard-page seller-dashboard">
      <section className="dashboard-hero">
        <div className="profile-avatar store">AP</div>
        <div><small>PORTAL DO VENDEDOR</small><h1>AutoPeças Premium SP</h1><p>Seu desempenho está 12% acima do último mês.</p></div>
        <button className="primary">+ Adicionar produto</button>
      </section>
      <section className="dashboard-cards">
        <article><span>💰</span><b>R$ 18.420</b><small>Vendas no mês</small></article>
        <article><span>🛒</span><b>86</b><small>Pedidos recebidos</small></article>
        <article><span>⭐</span><b>4,9</b><small>Avaliação da loja</small></article>
        <article><span>📦</span><b>124</b><small>Produtos ativos</small></article>
      </section>
      <section className="dashboard-grid">
        <article className="panel wide"><div className="panel-title"><h2>Pedidos para processar</h2><button>Ver pedidos</button></div>{sellerOrders.map(([id,name,total,status]) => <div className="order-row" key={id}><span>🧾</span><div><b>{id}</b><small>{name}</small></div><em className={status === 'Entregue' ? 'done' : ''}>{status}</em><b>{total}</b></div>)}</article>
        <article className="panel"><div className="panel-title"><h2>Ações rápidas</h2></div><button className="quick-link">📦 Atualizar estoque <span>›</span></button><button className="quick-link">🏷️ Criar promoção <span>›</span></button><button className="quick-link" onClick={() => onNavigate('seller')}>🏪 Ver minha loja <span>›</span></button></article>
      </section>
    </main>
  )
}
