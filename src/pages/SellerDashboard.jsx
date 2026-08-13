import { useState } from 'react'

const initialOrders = [
  { id:'#ACH-00123', name:'Amortecedor Dianteiro Premium', total:'R$ 289,90', status:'A separar' },
  { id:'#ACH-00119', name:'Pastilha de Freio Cerâmica', total:'R$ 145,50', status:'Enviado' },
  { id:'#ACH-00115', name:'Bateria 60Ah Premium', total:'R$ 389,90', status:'Entregue' }
]
const initialProducts = [
  { id:1, name:'Amortecedor Dianteiro Premium', price:'R$ 289,90', stock:12, active:true },
  { id:2, name:'Pastilha de Freio Cerâmica', price:'R$ 145,50', stock:4, active:true },
  { id:3, name:'Alternador 80A Original', price:'R$ 456,00', stock:0, active:false }
]

export default function SellerDashboard({ onNavigate }) {
  const [section, setSection] = useState('overview')
  const [orders, setOrders] = useState(initialOrders)
  const [products, setProducts] = useState(initialProducts)
  const [newProduct, setNewProduct] = useState('')
  const tabs = [['overview','Visão geral'],['orders','Pedidos'],['products','Produtos'],['stock','Estoque'],['finance','Financeiro'],['settings','Loja']]

  const markShipped = id => setOrders(list => list.map(order => order.id === id ? { ...order, status: order.status === 'A separar' ? 'Enviado' : 'Entregue' } : order))
  const addProduct = () => { if (!newProduct.trim()) return; setProducts(list => [...list, { id:Date.now(), name:newProduct, price:'R$ 0,00', stock:0, active:false }]); setNewProduct('') }

  return <main className="container dashboard-page seller-dashboard">
    <section className="dashboard-hero"><div className="profile-avatar store">AP</div><div><small>PORTAL DO VENDEDOR</small><h1>AutoPeças Premium SP</h1><p>Seu desempenho está 12% acima do último mês.</p></div><button className="primary" onClick={() => setSection('products')}>+ Adicionar produto</button></section>
    <div className="dashboard-tabs">{tabs.map(([id,label]) => <button className={section === id ? 'active' : ''} key={id} onClick={() => setSection(id)}>{label}</button>)}</div>
    {section === 'overview' && <><section className="dashboard-cards seller-cards"><article><span>💰</span><b>R$ 18.420</b><small>Vendas no mês</small></article><article><span>🛒</span><b>86</b><small>Pedidos recebidos</small></article><article><span>⭐</span><b>4,9</b><small>Avaliação da loja</small></article><article><span>📦</span><b>{products.length}</b><small>Produtos ativos</small></article></section><section className="dashboard-grid"><article className="panel wide"><div className="panel-title"><h2>Pedidos para processar</h2><button onClick={() => setSection('orders')}>Ver pedidos</button></div>{orders.map(order => <SellerOrder key={order.id} order={order} onAction={markShipped} />)}</article><article className="panel"><div className="panel-title"><h2>Ações rápidas</h2></div><button className="quick-link" onClick={() => setSection('stock')}>📦 Atualizar estoque <span>›</span></button><button className="quick-link" onClick={() => setSection('products')}>🏷️ Criar promoção <span>›</span></button><button className="quick-link" onClick={() => onNavigate('seller')}>🏪 Ver minha loja <span>›</span></button></article></section></>}
    {section === 'orders' && <article className="panel"><div className="panel-title"><h2>Todos os pedidos</h2><button>Exportar CSV</button></div>{orders.map(order => <SellerOrder key={order.id} order={order} onAction={markShipped} />)}</article>}
    {section === 'products' && <><article className="panel product-create"><div className="panel-title"><h2>Adicionar produto</h2></div><input value={newProduct} onChange={event => setNewProduct(event.target.value)} placeholder="Nome do novo produto" /><button className="primary" onClick={addProduct}>Adicionar</button></article><article className="panel"><div className="panel-title"><h2>Catálogo da loja</h2><button>{products.length} produtos</button></div>{products.map(product => <div className="order-row" key={product.id}><span>🧩</span><div><b>{product.name}</b><small>{product.price} · estoque: {product.stock}</small></div><em className={product.active ? 'done' : ''}>{product.active ? 'Ativo' : 'Rascunho'}</em><button className="table-action" onClick={() => setProducts(list => list.map(item => item.id === product.id ? {...item, active:!item.active} : item))}>{product.active ? 'Pausar' : 'Publicar'}</button></div>)}</article></>}
    {section === 'stock' && <article className="panel"><div className="panel-title"><h2>Controle de estoque</h2><button>Baixar relatório</button></div>{products.map(product => <div className="order-row" key={product.id}><span>📦</span><div><b>{product.name}</b><small>Disponível para venda</small></div><b className={product.stock < 5 ? 'low-stock' : ''}>{product.stock} un.</b><button className="table-action" onClick={() => setProducts(list => list.map(item => item.id === product.id ? {...item, stock:item.stock+1} : item))}>+ 1</button></div>)}</article>}
    {section === 'finance' && <section className="portal-grid"><article className="panel finance-card"><small>Saldo disponível</small><b>R$ 12.841,30</b><button className="primary">Solicitar saque</button></article><article className="panel finance-card"><small>Próximo repasse</small><b>R$ 2.189,80</b><p>Disponível em 18 jan 2025</p></article></section>}
    {section === 'settings' && <article className="panel profile-form"><div className="panel-title"><h2>Informações da loja</h2><button>Salvar</button></div><label>Nome da loja<input defaultValue="AutoPeças Premium SP" /></label><label>Descrição<textarea defaultValue="Especialistas em peças originais e paralelas." /></label><label>Prazo de envio<select defaultValue="24h"><option>24h</option><option>48h</option><option>72h</option></select></label></article>}
  </main>
}

function SellerOrder({ order, onAction }) { return <div className="order-row"><span>🧾</span><div><b>{order.id}</b><small>{order.name}</small></div><em className={order.status === 'Entregue' ? 'done' : ''}>{order.status}</em><b>{order.total}</b>{order.status !== 'Entregue' && <button className="table-action" onClick={() => onAction(order.id)}>{order.status === 'A separar' ? 'Enviar' : 'Concluir'}</button>}</div> }
