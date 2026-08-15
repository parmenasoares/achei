import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase.js'

const data = {
  orders: [['#ACH-00123','Pármenas Soares','R$ 289,90','Em trânsito'],['#ACH-00122','João Mendes','R$ 145,50','A separar'],['#ACH-00121','Ana Lima','R$ 389,90','Entregue']],
  users: [['Pármenas Soares','comprador@acheii.demo','Comprador','Ativo'],['João Mendes','joao@email.com','Comprador','Ativo'],['Maria Alves','maria@email.com','Comprador','Bloqueado']],
  sellers: [['AutoPeças Premium SP','4,9','124 produtos','Ativo'],['Oficina do Zé','—','0 produtos','Pendente'],['Garage Performance','4,7','78 produtos','Ativo']],
  catalog: [['Amortecedor Dianteiro Premium','Suspensão','R$ 289,90','Publicado'],['Kit Correia Dentada','Motor','R$ 450,00','Em revisão'],['Bateria 60Ah Premium','Energia','R$ 389,90','Publicado']]
}

// ─── Dados simulados de acesso (substituir por Supabase/PostHog/Plausible futuramente) ───
const MOCK_SESSIONS = [
  { id:'s1', user:'Pármenas Soares', email:'parmenas@gmail.com', role:'admin',    ip:'177.92.14.33',  city:'São Paulo',      state:'SP', country:'Brasil', device:'Desktop', browser:'Chrome',  os:'Windows', page:'/admin',      duration:1420, actions:38, at:'Agora',     online:true  },
  { id:'s2', user:'João Mendes',     email:'joao@email.com',     role:'buyer',    ip:'189.60.22.11',  city:'Rio de Janeiro', state:'RJ', country:'Brasil', device:'Mobile',  browser:'Safari',  os:'iOS',     page:'/produto/2',  duration:180,  actions:5,  at:'2 min',     online:true  },
  { id:'s3', user:'Ana Lima',        email:'ana@email.com',       role:'buyer',    ip:'201.17.44.88',  city:'Belo Horizonte', state:'MG', country:'Brasil', device:'Mobile',  browser:'Chrome',  os:'Android', page:'/home',       duration:90,   actions:3,  at:'5 min',     online:true  },
  { id:'s4', user:'AutoPeças SP',    email:'loja@autopecas.com',  role:'seller',   ip:'187.72.10.5',   city:'Campinas',       state:'SP', country:'Brasil', device:'Desktop', browser:'Firefox', os:'macOS',   page:'/dashboard',  duration:3600, actions:72, at:'12 min',    online:false },
  { id:'s5', user:'Maria Souza',     email:'maria@email.com',     role:'buyer',    ip:'200.99.34.201', city:'Salvador',       state:'BA', country:'Brasil', device:'Mobile',  browser:'Chrome',  os:'Android', page:'/busca',      duration:240,  actions:9,  at:'18 min',    online:false },
  { id:'s6', user:'Carlos Pereira',  email:'carlos@email.com',    role:'buyer',    ip:'177.45.67.90',  city:'Fortaleza',      state:'CE', country:'Brasil', device:'Tablet',  browser:'Chrome',  os:'Android', page:'/produto/7',  duration:310,  actions:11, at:'24 min',    online:false },
  { id:'s7', user:'Garage Perf.',    email:'gp@garage.com',       role:'seller',   ip:'189.28.77.14',  city:'Curitiba',       state:'PR', country:'Brasil', device:'Desktop', browser:'Chrome',  os:'Windows', page:'/dashboard',  duration:870,  actions:24, at:'31 min',    online:false },
  { id:'s8', user:'Visitante',       email:'—',                   role:'guest',    ip:'201.55.88.32',  city:'Recife',         state:'PE', country:'Brasil', device:'Mobile',  browser:'Safari',  os:'iOS',     page:'/home',       duration:45,   actions:2,  at:'35 min',    online:false },
]

const MOCK_METRICS = {
  today: { pageviews:1842, sessions:634, users:412, bounce:38, avg_time:'3m 12s', conversion:2.8 },
  week:  { pageviews:11240, sessions:3890, users:2140, bounce:41, avg_time:'2m 58s', conversion:3.1 },
  month: { pageviews:48600, sessions:16200, users:8740, bounce:39, avg_time:'3m 05s', conversion:3.4 },
}

const MOCK_PAGES = [
  { page:'/home',        views:3820, uniq:2140, avg:'2m 10s', bounce:42 },
  { page:'/busca',       views:2940, uniq:1890, avg:'4m 32s', bounce:28 },
  { page:'/produto/*',   views:2210, uniq:1540, avg:'3m 48s', bounce:31 },
  { page:'/checkout',    views:980,  uniq:740,  avg:'5m 12s', bounce:12 },
  { page:'/auth',        views:760,  uniq:660,  avg:'1m 44s', bounce:55 },
  { page:'/track',       views:540,  uniq:420,  avg:'2m 20s', bounce:35 },
  { page:'/seller',      views:380,  uniq:290,  avg:'3m 02s', bounce:38 },
]

const MOCK_GEO = [
  { state:'SP', city:'São Paulo',      sessions:1840, pct:47 },
  { state:'RJ', city:'Rio de Janeiro', sessions:620,  pct:16 },
  { state:'MG', city:'Belo Horizonte', sessions:380,  pct:10 },
  { state:'PR', city:'Curitiba',       sessions:290,  pct:7  },
  { state:'BA', city:'Salvador',       sessions:210,  pct:5  },
  { state:'CE', city:'Fortaleza',      sessions:180,  pct:5  },
  { state:'RS', city:'Porto Alegre',   sessions:140,  pct:4  },
  { state:'PE', city:'Recife',         sessions:120,  pct:3  },
  { state:'GO', city:'Goiânia',        sessions:100,  pct:3  },
]

const MOCK_DEVICES = [
  { type:'Mobile',  pct:58, color:'#FF5A1F' },
  { type:'Desktop', pct:35, color:'#FFC93C' },
  { type:'Tablet',  pct:7,  color:'#3FBF7F' },
]

const MOCK_CHART = [
  { day:'Seg', views:1240, sessions:420 },
  { day:'Ter', views:1560, sessions:530 },
  { day:'Qua', views:1120, sessions:380 },
  { day:'Qui', views:1840, sessions:634 },
  { day:'Sex', views:2100, sessions:720 },
  { day:'Sáb', views:1980, sessions:680 },
  { day:'Dom', views:1400, sessions:480 },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const roleBadge = r => ({
  admin:  { bg:'rgba(255,201,60,.15)',  c:'#FFC93C', l:'Admin'     },
  seller: { bg:'rgba(255,90,31,.15)',   c:'#FF5A1F', l:'Vendedor'  },
  buyer:  { bg:'rgba(63,191,127,.15)', c:'#3FBF7F', l:'Comprador' },
  guest:  { bg:'rgba(122,132,148,.15)',c:'#7A8494', l:'Visitante' },
})[r] || { bg:'var(--g600)', c:'var(--steel)', l:r }

const devIcon = d => ({ Mobile:'📱', Desktop:'🖥️', Tablet:'📟' })[d] || '💻'
const fmtSec = s => s >= 3600 ? `${Math.floor(s/3600)}h ${Math.floor((s%3600)/60)}m` : s >= 60 ? `${Math.floor(s/60)}m ${s%60}s` : `${s}s`

// ═════════════════════════════════════════════════════════════════════════════
// MÓDULO: Analytics
// ═════════════════════════════════════════════════════════════════════════════
function Analytics() {
  const [period, setPeriod] = useState('today')
  const [sessionFilter, setSessionFilter] = useState('all')
  const [selectedSession, setSelectedSession] = useState(null)
  const [searchIP, setSearchIP] = useState('')
  const metrics = MOCK_METRICS[period]
  const maxViews = Math.max(...MOCK_CHART.map(d => d.views))

  const sessions = MOCK_SESSIONS.filter(s => {
    if (sessionFilter !== 'all' && s.role !== sessionFilter) return false
    if (searchIP && !s.ip.includes(searchIP) && !s.user.toLowerCase().includes(searchIP.toLowerCase())) return false
    return true
  })

  const onlineCount = MOCK_SESSIONS.filter(s => s.online).length

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:20 }}>

      {/* ── Header métricas ── */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', gap:8 }}>
          {['today','week','month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              padding:'8px 16px', borderRadius:8, fontSize:13, fontWeight:600, cursor:'pointer',
              background: period===p ? 'var(--orange)' : 'var(--surface-1)',
              color: period===p ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${period===p ? 'var(--orange)' : 'var(--border)'}`,
            }}>{ {today:'Hoje',week:'7 dias',month:'30 dias'}[p] }</button>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:13 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#3FBF7F', display:'inline-block', boxShadow:'0 0 0 3px rgba(63,191,127,.25)' }} />
          <span style={{ color:'var(--text-secondary)' }}><b style={{ color:'var(--text-primary)' }}>{onlineCount}</b> online agora</span>
        </div>
      </div>

      {/* ── Cards de métricas ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(140px,1fr))', gap:12 }}>
        {[
          { l:'Visualizações', v:metrics.pageviews.toLocaleString('pt-BR'), icon:'👁️', c:'var(--text-primary)' },
          { l:'Sessões',       v:metrics.sessions.toLocaleString('pt-BR'),  icon:'🔗', c:'#FF5A1F' },
          { l:'Usuários únicos',v:metrics.users.toLocaleString('pt-BR'),    icon:'👤', c:'#FFC93C' },
          { l:'Taxa de rejeição',v:`${metrics.bounce}%`,                    icon:'↩️', c:'#7A8494' },
          { l:'Tempo médio',   v:metrics.avg_time,                          icon:'⏱️', c:'#3FBF7F' },
          { l:'Conversão',     v:`${metrics.conversion}%`,                  icon:'✅', c:'#4A9EFF' },
        ].map(m => (
          <div key={m.l} style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:'16px 14px' }}>
            <div style={{ fontSize:11, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>{m.l}</div>
            <div style={{ fontSize:22, fontWeight:700, color:m.c, fontFamily:'Oswald,sans-serif' }}>{m.v}</div>
          </div>
        ))}
      </div>

      {/* ── Gráfico de barras + Dispositivos ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:16 }}>

        {/* Gráfico */}
        <div style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:20 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
            <b style={{ fontSize:14 }}>Tráfego — últimos 7 dias</b>
            <div style={{ display:'flex', gap:12, fontSize:11 }}>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8,height:8,borderRadius:2,background:'#FF5A1F',display:'inline-block' }} />Pageviews</span>
              <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8,height:8,borderRadius:2,background:'#FFC93C',display:'inline-block' }} />Sessões</span>
            </div>
          </div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:6, height:120 }}>
            {MOCK_CHART.map(d => (
              <div key={d.day} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%' }}>
                <div style={{ flex:1, width:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', gap:3 }}>
                  <div style={{ width:'100%', height:`${(d.views/maxViews)*100}%`, background:'#FF5A1F', borderRadius:'4px 4px 0 0', minHeight:4 }} title={`${d.views} views`} />
                  <div style={{ width:'100%', height:`${(d.sessions/maxViews)*100}%`, background:'#FFC93C', borderRadius:'4px 4px 0 0', minHeight:3 }} title={`${d.sessions} sessões`} />
                </div>
                <span style={{ fontSize:10, color:'var(--text-secondary)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dispositivos */}
        <div style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:20, minWidth:160 }}>
          <b style={{ fontSize:14, display:'block', marginBottom:16 }}>Dispositivos</b>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {MOCK_DEVICES.map(d => (
              <div key={d.type}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:5 }}>
                  <span>{devIcon(d.type)} {d.type}</span>
                  <b style={{ color:d.color }}>{d.pct}%</b>
                </div>
                <div style={{ height:6, background:'var(--border)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${d.pct}%`, background:d.color, borderRadius:3, transition:'width .5s' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Páginas mais visitadas ── */}
      <div style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:20 }}>
        <b style={{ fontSize:14, display:'block', marginBottom:16 }}>Páginas mais acessadas</b>
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:0, fontSize:11, color:'var(--text-secondary)', borderBottom:'0.5px solid var(--border)', paddingBottom:8, marginBottom:4 }}>
          {['Página','Visualizações','Únicos','Tempo médio','Rejeição'].map(h => <span key={h}>{h}</span>)}
        </div>
        {MOCK_PAGES.map((p,i) => (
          <div key={p.page} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:0, padding:'10px 0', borderBottom: i < MOCK_PAGES.length-1 ? '0.5px solid var(--border)' : 'none', fontSize:13, alignItems:'center' }}>
            <span style={{ fontFamily:'monospace', fontSize:12, color:'var(--orange)' }}>{p.page}</span>
            <span style={{ fontWeight:600 }}>{p.views.toLocaleString('pt-BR')}</span>
            <span style={{ color:'var(--text-secondary)' }}>{p.uniq.toLocaleString('pt-BR')}</span>
            <span style={{ color:'var(--text-secondary)' }}>{p.avg}</span>
            <span style={{ color: p.bounce > 45 ? '#E5484D' : p.bounce < 25 ? '#3FBF7F' : 'var(--text-secondary)' }}>{p.bounce}%</span>
          </div>
        ))}
      </div>

      {/* ── Localização geográfica ── */}
      <div style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:20 }}>
        <b style={{ fontSize:14, display:'block', marginBottom:16 }}>📍 Distribuição geográfica</b>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {MOCK_GEO.map(g => (
            <div key={g.state} style={{ display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:12, fontWeight:700, color:'var(--text-secondary)', width:28, flexShrink:0 }}>{g.state}</span>
              <span style={{ fontSize:13, flex:1, minWidth:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{g.city}</span>
              <div style={{ width:120, height:6, background:'var(--border)', borderRadius:3, overflow:'hidden', flexShrink:0 }}>
                <div style={{ height:'100%', width:`${g.pct}%`, background:'#FF5A1F', borderRadius:3 }} />
              </div>
              <span style={{ fontSize:12, color:'var(--text-secondary)', width:32, textAlign:'right', flexShrink:0 }}>{g.pct}%</span>
              <span style={{ fontSize:12, color:'var(--text-secondary)', width:52, textAlign:'right', flexShrink:0 }}>{g.sessions.toLocaleString('pt-BR')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Sessões ativas e recentes ── */}
      <div style={{ background:'var(--surface-1)', border:'0.5px solid var(--border)', borderRadius:12, padding:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16, flexWrap:'wrap', gap:10 }}>
          <b style={{ fontSize:14 }}>Sessões de acesso</b>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <input
              value={searchIP}
              onChange={e => setSearchIP(e.target.value)}
              placeholder="Buscar IP ou usuário..."
              style={{ background:'var(--surface-2,#242730)', border:'0.5px solid var(--border)', borderRadius:8, padding:'7px 12px', color:'var(--text-primary)', fontSize:12, outline:'none', width:180 }}
            />
            {['all','buyer','seller','admin','guest'].map(f => (
              <button key={f} onClick={() => setSessionFilter(f)} style={{
                padding:'6px 12px', borderRadius:8, fontSize:11, fontWeight:600, cursor:'pointer',
                background: sessionFilter===f ? 'var(--orange)' : 'var(--surface-2,#242730)',
                color: sessionFilter===f ? '#fff' : 'var(--text-secondary)',
                border: `0.5px solid ${sessionFilter===f ? 'var(--orange)' : 'var(--border)'}`,
              }}>{ {all:'Todos',buyer:'Compradores',seller:'Vendedores',admin:'Admin',guest:'Visitantes'}[f] }</button>
            ))}
          </div>
        </div>

        {sessions.map(s => (
          <div key={s.id} style={{
            display:'flex', alignItems:'flex-start', gap:12, padding:'14px 0',
            borderBottom:'0.5px solid var(--border)', cursor:'pointer',
            opacity: s.online ? 1 : 0.75,
          }} onClick={() => setSelectedSession(selectedSession?.id === s.id ? null : s)}>

            {/* Status online */}
            <div style={{ marginTop:4, flexShrink:0 }}>
              <span style={{
                width:8, height:8, borderRadius:'50%', display:'inline-block',
                background: s.online ? '#3FBF7F' : 'var(--border)',
                boxShadow: s.online ? '0 0 0 3px rgba(63,191,127,.2)' : 'none',
              }} />
            </div>

            {/* Info principal */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:4 }}>
                <span style={{ fontWeight:600, fontSize:13 }}>{s.user}</span>
                <span style={{
                  fontSize:10, fontWeight:700, padding:'2px 7px', borderRadius:5,
                  background: roleBadge(s.role).bg, color: roleBadge(s.role).c,
                }}>{roleBadge(s.role).l}</span>
                {s.online && <span style={{ fontSize:10, color:'#3FBF7F', fontWeight:600 }}>● ONLINE</span>}
              </div>
              <div style={{ fontSize:11, color:'var(--text-secondary)', display:'flex', flexWrap:'wrap', gap:'4px 14px' }}>
                <span>📧 {s.email}</span>
                <span>🌐 {s.ip}</span>
                <span>📍 {s.city}/{s.state}</span>
                <span>{devIcon(s.device)} {s.device} · {s.browser} · {s.os}</span>
                <span>📄 {s.page}</span>
              </div>
            </div>

            {/* Métricas rápidas */}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0, fontSize:11 }}>
              <span style={{ color:'var(--text-secondary)' }}>{s.at}</span>
              <span style={{ color:'var(--text-secondary)' }}>⏱ {fmtSec(s.duration)}</span>
              <span style={{ color:'var(--text-secondary)' }}>🖱 {s.actions} ações</span>
            </div>
          </div>
        ))}

        {/* Detalhe expandido da sessão */}
        {selectedSession && (
          <div style={{ marginTop:16, background:'var(--surface-2,#242730)', border:'0.5px solid var(--orange)', borderRadius:12, padding:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
              <b style={{ fontSize:14 }}>Detalhe da sessão — {selectedSession.user}</b>
              <button onClick={() => setSelectedSession(null)} style={{ background:'none', border:'none', color:'var(--text-secondary)', fontSize:18, cursor:'pointer' }}>×</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:12, fontSize:13 }}>
              {[
                ['Usuário',    selectedSession.user],
                ['E-mail',     selectedSession.email],
                ['Perfil',     roleBadge(selectedSession.role).l],
                ['IP',         selectedSession.ip],
                ['Cidade',     selectedSession.city],
                ['Estado',     selectedSession.state],
                ['País',       selectedSession.country],
                ['Dispositivo',selectedSession.device],
                ['Navegador',  selectedSession.browser],
                ['Sistema',    selectedSession.os],
                ['Página atual',selectedSession.page],
                ['Tempo na sessão', fmtSec(selectedSession.duration)],
                ['Ações realizadas', `${selectedSession.actions}`],
                ['Status',     selectedSession.online ? '🟢 Online' : '⚫ Offline'],
                ['Último acesso', selectedSession.at],
              ].map(([label, value]) => (
                <div key={label} style={{ background:'var(--surface-1)', borderRadius:8, padding:'10px 12px' }}>
                  <div style={{ fontSize:10, color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.5px', marginBottom:4 }}>{label}</div>
                  <div style={{ fontWeight:600, fontSize:13, wordBreak:'break-all' }}>{value}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', gap:8, marginTop:14, flexWrap:'wrap' }}>
              <button style={{ background:'var(--red,#e5484d)', border:'none', color:'#fff', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                🚫 Encerrar sessão
              </button>
              <button style={{ background:'var(--g600,#2E3138)', border:'none', color:'var(--text-primary)', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                👤 Ver perfil
              </button>
              <button style={{ background:'var(--g600,#2E3138)', border:'none', color:'var(--text-primary)', padding:'8px 16px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>
                📋 Ver histórico
              </button>
            </div>
          </div>
        )}

        {sessions.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 20px', color:'var(--text-secondary)', fontSize:14 }}>
            Nenhuma sessão encontrada para os filtros selecionados.
          </div>
        )}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// COMPONENTES EXISTENTES (mantidos)
// ═════════════════════════════════════════════════════════════════════════════
function Overview({ onNavigate }) {
  return <>
    <div className="admin-metrics">
      <article><small>GMV total</small><b>R$ 248,6 mil</b><em>↑ 18,4%</em></article>
      <article><small>Pedidos hoje</small><b>124</b><em>↑ 8,2%</em></article>
      <article><small>Clientes ativos</small><b>3.842</b><em>↑ 12,1%</em></article>
      <article><small>Vendedores ativos</small><b>86</b><em>↑ 4,6%</em></article>
    </div>
    <div className="admin-panels">
      <article className="panel chart-panel">
        <div className="panel-title"><h2>Vendas dos últimos 7 dias</h2><button>Este mês ▾</button></div>
        <div className="chart">{[38,56,47,72,62,91,78].map((v,i) => <i key={i} style={{height:`${v}%`}} />)}</div>
      </article>
      <article className="panel">
        <div className="panel-title"><h2>Para revisar</h2><button onClick={() => onNavigate('sellers')}>Ver fila</button></div>
        <div className="review-count"><b>12</b><span>itens aguardando sua ação</span></div>
        <button className="quick-link" onClick={() => onNavigate('sellers')}>🏪 4 vendedores pendentes <span>›</span></button>
        <button className="quick-link" onClick={() => onNavigate('orders')}>⚠ 8 ocorrências abertas <span>›</span></button>
      </article>
    </div>
    <article className="panel">
      <div className="panel-title"><h2>Atividade recente</h2></div>
      {[
        ['Novo vendedor aguardando aprovação','Oficina do Zé','Agora'],
        ['Pedido sinalizado para análise','#ACH-00123','12 min'],
        ['Novo cadastro de produto','Kit Correia Dentada','28 min'],
      ].map(([title,detail,time]) => (
        <div className="order-row" key={title}>
          <span>•</span><div><b>{title}</b><small>{detail}</small></div><small>{time}</small>
        </div>
      ))}
    </article>
  </>
}

function Management({ type, rows, onUpdate }) {
  const labels = { orders:['Pedido','Cliente','Total','Status'], users:['Nome','E-mail','Perfil','Status'], sellers:['Loja','Avaliação','Catálogo','Status'], catalog:['Produto','Categoria','Preço','Status'] }[type]
  const action = type === 'sellers' ? 'Aprovar' : type === 'catalog' ? 'Publicar' : type === 'users' ? 'Bloquear' : 'Atualizar'
  return (
    <article className="panel management">
      <div className="panel-title">
        <h2>{ type === 'orders' ? 'Acompanhe e resolva pedidos' : type === 'users' ? 'Gestão de clientes' : type === 'sellers' ? 'Gestão de vendedores' : 'Moderação de catálogo' }</h2>
        <button>Exportar CSV</button>
      </div>
      <div className="table-head">{labels.map(l => <small key={l}>{l}</small>)}</div>
      {rows.map((row, i) => (
        <div className="table-row" key={row[0]}>
          {row.map((cell, col) => <span key={col} className={col===3?'status':''}>{cell}</span>)}
          <button className="table-action" onClick={() => onUpdate(type, i, type==='sellers'||type==='catalog' ? 'Ativo' : type==='users' ? (row[3]==='Ativo'?'Bloqueado':'Ativo') : 'Em análise')}>{action}</button>
        </div>
      ))}
    </article>
  )
}

function Finance() {
  return <>
    <div className="admin-metrics">
      <article><small>Receita de comissões</small><b>R$ 24.860</b><em>↑ 9,8%</em></article>
      <article><small>Repasses pendentes</small><b>R$ 16.240</b><em>12 vendedores</em></article>
      <article><small>Reembolsos</small><b>R$ 1.890</b><em>↓ 3,2%</em></article>
      <article><small>Ticket médio</small><b>R$ 286</b><em>↑ 4,1%</em></article>
    </div>
    <article className="panel">
      <div className="panel-title"><h2>Repasses programados</h2><button>Gerar relatório</button></div>
      {[['AutoPeças Premium SP','18 jan 2025','R$ 2.189,80'],['Garage Performance','19 jan 2025','R$ 1.420,40'],['Mecânica Central','20 jan 2025','R$ 892,10']].map(row => (
        <div className="order-row" key={row[0]}><span>💰</span><div><b>{row[0]}</b><small>{row[1]}</small></div><b>{row[2]}</b></div>
      ))}
    </article>
  </>
}

function Settings({ setNotice }) {
  return (
    <article className="panel profile-form">
      <div className="panel-title"><h2>Configurações da plataforma</h2></div>
      <label>Nome da plataforma<input defaultValue="Acheii" /></label>
      <label>Comissão padrão<select defaultValue="12%"><option>10%</option><option>12%</option><option>15%</option></select></label>
      <label>Limite para frete grátis<input defaultValue="R$ 500,00" /></label>
      <button className="primary" onClick={() => setNotice('Configurações salvas com sucesso.')}>Salvar configurações</button>
    </article>
  )
}

// ═════════════════════════════════════════════════════════════════════════════
// DASHBOARD PRINCIPAL
// ═════════════════════════════════════════════════════════════════════════════
export default function AdminDashboard() {
  const [section, setSection] = useState('overview')
  const [records, setRecords] = useState(data)
  const [notice,  setNotice]  = useState('')

  const navigation = [
    ['overview',  '▦', 'Visão geral'],
    ['orders',    '◫', 'Pedidos'],
    ['users',     '◉', 'Usuários'],
    ['sellers',   '▣', 'Vendedores'],
    ['catalog',   '◇', 'Catálogo'],
    ['analytics', '📊', 'Acessos & Métricas'],
    ['finance',   '◌', 'Financeiro'],
    ['settings',  '⚙', 'Configurações'],
  ]

  const title = {
    overview:  'Visão geral',
    orders:    'Pedidos',
    users:     'Usuários',
    sellers:   'Vendedores',
    catalog:   'Catálogo',
    analytics: 'Acessos & Métricas',
    finance:   'Financeiro',
    settings:  'Configurações',
  }[section]

  const updateStatus = (type, index, status) => {
    setRecords(v => ({ ...v, [type]: v[type].map((item, i) => i === index ? [...item.slice(0,-1), status] : item) }))
    setNotice('Atualização salva com sucesso.')
  }

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div className="logo">🔥 ACHEII</div>
        <small>SUPER ADMIN</small>
        {navigation.map(([id, icon, label]) => (
          <button key={id} className={section === id ? 'active' : ''} onClick={() => { setSection(id); setNotice('') }}>
            {icon} {label}
          </button>
        ))}
      </aside>
      <section className="admin-content">
        <header>
          <div><small>ADMINISTRAÇÃO</small><h1>{title}</h1></div>
          <button className="admin-user">PS <span>Super Admin</span></button>
        </header>
        {notice && <p className="admin-notice">{notice}</p>}
        {section === 'overview'   && <Overview onNavigate={setSection} />}
        {section === 'analytics'  && <Analytics />}
        {['orders','users','sellers','catalog'].includes(section) && (
          <Management type={section} rows={records[section]} onUpdate={updateStatus} />
        )}
        {section === 'finance'    && <Finance />}
        {section === 'settings'   && <Settings setNotice={setNotice} />}
      </section>
    </main>
  )
}
