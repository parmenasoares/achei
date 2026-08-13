const activity = [
  ['Novo vendedor aguardando aprovação', 'Oficina do Zé', 'Agora'],
  ['Pedido sinalizado para análise', '#ACH-00123', '12 min'],
  ['Novo cadastro de produto', 'Kit Correia Dentada', '28 min'],
  ['Solicitação de reembolso', '#ACH-00118', '1 h']
]

export default function AdminDashboard() {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar"><div className="logo">🔥 ACHEII</div><small>SUPER ADMIN</small><button className="active">▦ Visão geral</button><button>◫ Pedidos</button><button>◉ Usuários</button><button>▣ Vendedores</button><button>◇ Catálogo</button><button>◌ Financeiro</button><button>⚙ Configurações</button></aside>
      <section className="admin-content">
        <header><div><small>ADMINISTRAÇÃO</small><h1>Visão geral</h1></div><button className="admin-user">PS <span>Super Admin</span></button></header>
        <div className="admin-metrics"><article><small>GMV total</small><b>R$ 248,6 mil</b><em>↑ 18,4%</em></article><article><small>Pedidos hoje</small><b>124</b><em>↑ 8,2%</em></article><article><small>Clientes ativos</small><b>3.842</b><em>↑ 12,1%</em></article><article><small>Vendedores ativos</small><b>86</b><em>↑ 4,6%</em></article></div>
        <div className="admin-panels"><article className="panel chart-panel"><div className="panel-title"><h2>Vendas dos últimos 7 dias</h2><button>Este mês ▾</button></div><div className="chart"><i style={{height:'38%'}}/><i style={{height:'56%'}}/><i style={{height:'47%'}}/><i style={{height:'72%'}}/><i style={{height:'62%'}}/><i style={{height:'91%'}}/><i style={{height:'78%'}}/></div></article><article className="panel"><div className="panel-title"><h2>Para revisar</h2><button>Ver fila</button></div><div className="review-count"><b>12</b><span>itens aguardando sua ação</span></div><button className="quick-link">🏪 4 vendedores pendentes <span>›</span></button><button className="quick-link">⚠ 8 ocorrências abertas <span>›</span></button></article></div>
        <article className="panel"><div className="panel-title"><h2>Atividade recente</h2><button>Ver tudo</button></div>{activity.map(([title,detail,time])=><div className="order-row" key={title}><span>•</span><div><b>{title}</b><small>{detail}</small></div><small>{time}</small></div>)}</article>
      </section>
    </main>
  )
}
