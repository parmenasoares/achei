import { useState } from 'react'

const data = {
  orders: [['#ACH-00123','Pármenas Soares','R$ 289,90','Em trânsito'],['#ACH-00122','João Mendes','R$ 145,50','A separar'],['#ACH-00121','Ana Lima','R$ 389,90','Entregue']],
  users: [['Pármenas Soares','comprador@acheii.demo','Comprador','Ativo'],['João Mendes','joao@email.com','Comprador','Ativo'],['Maria Alves','maria@email.com','Comprador','Bloqueado']],
  sellers: [['AutoPeças Premium SP','4,9','124 produtos','Ativo'],['Oficina do Zé','—','0 produtos','Pendente'],['Garage Performance','4,7','78 produtos','Ativo']],
  catalog: [['Amortecedor Dianteiro Premium','Suspensão','R$ 289,90','Publicado'],['Kit Correia Dentada','Motor','R$ 450,00','Em revisão'],['Bateria 60Ah Premium','Energia','R$ 389,90','Publicado']]
}

export default function AdminDashboard() {
  const [section, setSection] = useState('overview')
  const [records, setRecords] = useState(data)
  const [notice, setNotice] = useState('')
  const navigation = [['overview','▦','Visão geral'],['orders','◫','Pedidos'],['users','◉','Usuários'],['sellers','▣','Vendedores'],['catalog','◇','Catálogo'],['finance','◌','Financeiro'],['settings','⚙','Configurações']]
  const title = { overview:'Visão geral', orders:'Pedidos', users:'Usuários', sellers:'Vendedores', catalog:'Catálogo', finance:'Financeiro', settings:'Configurações' }[section]
  const updateStatus = (type, index, status) => { setRecords(value => ({...value, [type]: value[type].map((item, i) => i === index ? [...item.slice(0,-1), status] : item)})); setNotice('Atualização salva com sucesso.') }

  return <main className="admin-shell"><aside className="admin-sidebar"><div className="logo">🔥 ACHEII</div><small>SUPER ADMIN</small>{navigation.map(([id,icon,label]) => <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setNotice('') }}>{icon} {label}</button>)}</aside>
    <section className="admin-content"><header><div><small>ADMINISTRAÇÃO</small><h1>{title}</h1></div><button className="admin-user">PS <span>Super Admin</span></button></header>{notice && <p className="admin-notice">{notice}</p>}
      {section === 'overview' && <Overview onNavigate={setSection} />}
      {['orders','users','sellers','catalog'].includes(section) && <Management type={section} rows={records[section]} onUpdate={updateStatus} />}
      {section === 'finance' && <Finance />}
      {section === 'settings' && <Settings setNotice={setNotice} />}
    </section>
  </main>
}

function Overview({ onNavigate }) { return <><div className="admin-metrics"><article><small>GMV total</small><b>R$ 248,6 mil</b><em>↑ 18,4%</em></article><article><small>Pedidos hoje</small><b>124</b><em>↑ 8,2%</em></article><article><small>Clientes ativos</small><b>3.842</b><em>↑ 12,1%</em></article><article><small>Vendedores ativos</small><b>86</b><em>↑ 4,6%</em></article></div><div className="admin-panels"><article className="panel chart-panel"><div className="panel-title"><h2>Vendas dos últimos 7 dias</h2><button>Este mês ▾</button></div><div className="chart">{[38,56,47,72,62,91,78].map((value,index) => <i key={index} style={{height:`${value}%`}} />)}</div></article><article className="panel"><div className="panel-title"><h2>Para revisar</h2><button onClick={() => onNavigate('sellers')}>Ver fila</button></div><div className="review-count"><b>12</b><span>itens aguardando sua ação</span></div><button className="quick-link" onClick={() => onNavigate('sellers')}>🏪 4 vendedores pendentes <span>›</span></button><button className="quick-link" onClick={() => onNavigate('orders')}>⚠ 8 ocorrências abertas <span>›</span></button></article></div><article className="panel"><div className="panel-title"><h2>Atividade recente</h2></div>{[['Novo vendedor aguardando aprovação','Oficina do Zé','Agora'],['Pedido sinalizado para análise','#ACH-00123','12 min'],['Novo cadastro de produto','Kit Correia Dentada','28 min']].map(([title,detail,time]) => <div className="order-row" key={title}><span>•</span><div><b>{title}</b><small>{detail}</small></div><small>{time}</small></div>)}</article></> }

function Management({ type, rows, onUpdate }) {
  const labels = { orders:['Pedido','Cliente','Total','Status'], users:['Nome','E-mail','Perfil','Status'], sellers:['Loja','Avaliação','Catálogo','Status'], catalog:['Produto','Categoria','Preço','Status'] }[type]
  const action = type === 'sellers' ? 'Aprovar' : type === 'catalog' ? 'Publicar' : type === 'users' ? 'Bloquear' : 'Atualizar'
  return <article className="panel management"><div className="panel-title"><h2>{type === 'orders' ? 'Acompanhe e resolva pedidos' : type === 'users' ? 'Gestão de clientes' : type === 'sellers' ? 'Gestão de vendedores' : 'Moderação de catálogo'}</h2><button>Exportar CSV</button></div><div className="table-head">{labels.map(label => <small key={label}>{label}</small>)}</div>{rows.map((row,index) => <div className="table-row" key={row[0]}>{row.map((cell,column) => <span key={column} className={column === 3 ? 'status' : ''}>{cell}</span>)}<button className="table-action" onClick={() => onUpdate(type,index, type === 'sellers' || type === 'catalog' ? 'Ativo' : type === 'users' ? (row[3] === 'Ativo' ? 'Bloqueado' : 'Ativo') : 'Em análise')}>{action}</button></div>)}</article>
}

function Finance() { return <><div className="admin-metrics"><article><small>Receita de comissões</small><b>R$ 24.860</b><em>↑ 9,8%</em></article><article><small>Repasses pendentes</small><b>R$ 16.240</b><em>12 vendedores</em></article><article><small>Reembolsos</small><b>R$ 1.890</b><em>↓ 3,2%</em></article><article><small>Ticket médio</small><b>R$ 286</b><em>↑ 4,1%</em></article></div><article className="panel"><div className="panel-title"><h2>Repasses programados</h2><button>Gerar relatório</button></div>{[['AutoPeças Premium SP','18 jan 2025','R$ 2.189,80'],['Garage Performance','19 jan 2025','R$ 1.420,40'],['Mecânica Central','20 jan 2025','R$ 892,10']].map(row => <div className="order-row" key={row[0]}><span>💰</span><div><b>{row[0]}</b><small>{row[1]}</small></div><b>{row[2]}</b></div>)}</article></> }

function Settings({ setNotice }) { return <article className="panel profile-form"><div className="panel-title"><h2>Configurações da plataforma</h2></div><label>Nome da plataforma<input defaultValue="Acheii" /></label><label>Comissão padrão<select defaultValue="12%"><option>10%</option><option>12%</option><option>15%</option></select></label><label>Limite para frete grátis<input defaultValue="R$ 500,00" /></label><button className="primary" onClick={() => setNotice('Configurações salvas com sucesso.')}>Salvar configurações</button></article> }
