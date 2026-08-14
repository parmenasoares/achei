import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const orders = [
  { id: 'ACH-2025-00123', status: 'Em trânsito', date: '12 jan 2025', total: 'R$ 289,90', item: 'Amortecedor Dianteiro Premium' },
  { id: 'ACH-2024-00992', status: 'Entregue', date: '28 dez 2024', total: 'R$ 145,50', item: 'Pastilha de Freio Cerâmica' },
  { id: 'ACH-2024-00981', status: 'Entregue', date: '19 dez 2024', total: 'R$ 89,90', item: 'Filtro de Ar' }
]
const fallbackProfile = { fullName:'Pármenas Soares', email:'', phone:'' }

export default function Account({ onNavigate }) {
  const [section, setSection] = useState('overview')
  const [addresses, setAddresses] = useState([{ name: 'Casa', address: 'Rua das Flores, 123 — São Paulo/SP', main: true }])
  const [profile, setProfile] = useState(fallbackProfile)
  const [draft, setDraft] = useState(fallbackProfile)
  const [userId, setUserId] = useState('')
  const [editing, setEditing] = useState(false)
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(async ({ data }) => {
      const user = data.user
      if (!user || !active) return
      setUserId(user.id)
      const { data: stored } = await supabase.from('profiles').select('full_name, email, phone').eq('id', user.id).maybeSingle()
      if (!active) return
      const next = { fullName:stored?.full_name || user.user_metadata?.full_name || fallbackProfile.fullName, email:stored?.email || user.email || '', phone:stored?.phone || '' }
      setProfile(next)
      setDraft(next)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  const tabs = [['overview','Visão geral'],['orders','Meus pedidos'],['addresses','Endereços'],['payments','Pagamentos'],['profile','Perfil']]
  const title = { overview:'Minha conta', orders:'Meus pedidos', addresses:'Endereços', payments:'Pagamentos', profile:'Dados pessoais' }[section]
  const openEditor = () => { setDraft(profile); setMessage(''); setSection('profile'); setEditing(true) }
  const cancelEditor = () => { setDraft(profile); setEditing(false); setMessage('') }
  const saveProfile = async event => {
    event.preventDefault()
    if (!draft.fullName.trim() || !draft.email.trim() || !draft.phone.trim()) return setMessage('Preencha nome, e-mail e telefone.')
    setSaving(true)
    if (userId) {
      const { error } = await supabase.from('profiles').update({ full_name:draft.fullName.trim(), phone:draft.phone.trim(), email:draft.email.trim().toLowerCase() }).eq('id', userId)
      if (error) { setSaving(false); return setMessage('Não foi possível salvar os dados. Tente novamente.') }
      if (draft.email.trim().toLowerCase() !== profile.email.trim().toLowerCase()) {
        const { error: authError } = await supabase.auth.updateUser({ email:draft.email.trim().toLowerCase() })
        if (authError) { setSaving(false); return setMessage('Os dados foram salvos, mas o e-mail não pôde ser atualizado.') }
        setMessage('Dados salvos. Confirme o novo e-mail para concluir a alteração.')
      } else setMessage('Dados salvos com sucesso.')
    } else {
      localStorage.setItem('achei_profile', JSON.stringify(draft))
      setMessage('Dados salvos neste dispositivo.')
    }
    setProfile({ ...draft, fullName:draft.fullName.trim(), email:draft.email.trim().toLowerCase(), phone:draft.phone.trim() })
    setSaving(false)
    setEditing(false)
  }

  return <main className="container dashboard-page">
    <section className="dashboard-hero"><div className="profile-avatar">{profile.fullName.split(' ').map(item => item[0]).slice(0,2).join('').toUpperCase()}</div><div><small>ÁREA DO COMPRADOR</small><h1>Olá, {profile.fullName.split(' ')[0]}</h1><p>Gerencie suas compras, dados e preferências.</p></div><button className="secondary" onClick={openEditor}>Editar perfil</button></section>
    <div className="dashboard-tabs">{tabs.map(([id,label]) => <button className={section === id ? 'active' : ''} key={id} onClick={() => { setSection(id); if (id !== 'profile') setEditing(false) }}>{label}</button>)}</div>
    <section className="portal-title"><div><small>PAINEL DO COMPRADOR</small><h2>{title}</h2></div>{section === 'orders' && <button className="secondary" onClick={() => onNavigate('track')}>Rastrear pedido</button>}{section === 'addresses' && <button className="primary" onClick={() => setAddresses(list => [...list, { name:'Novo endereço', address:'Av. Paulista, 1000 — São Paulo/SP', main:false }])}>+ Novo endereço</button>}</section>
    {section === 'overview' && <><section className="dashboard-cards"><article><span>📦</span><b>2</b><small>Pedidos em andamento</small></article><article><span>♥</span><b>6</b><small>Produtos favoritos</small></article><article><span>🏆</span><b>R$ 84</b><small>Economia acumulada</small></article></section><section className="dashboard-grid"><article className="panel"><div className="panel-title"><h2>Pedidos recentes</h2><button onClick={() => setSection('orders')}>Ver todos</button></div>{orders.slice(0,2).map(order => <OrderRow key={order.id} order={order} />)}</article><article className="panel"><div className="panel-title"><h2>Atalhos</h2></div><button className="quick-link" onClick={() => onNavigate('home')}>🛍️ Continuar comprando <span>›</span></button><button className="quick-link" onClick={() => setSection('addresses')}>📍 Meus endereços <span>›</span></button><button className="quick-link" onClick={() => setSection('payments')}>💳 Formas de pagamento <span>›</span></button></article></section></>}
    {section === 'orders' && <article className="panel"><div className="panel-title"><h2>Histórico de pedidos</h2><button onClick={() => onNavigate('home')}>Comprar novamente</button></div>{orders.map(order => <OrderRow key={order.id} order={order} detail />)}</article>}
    {section === 'addresses' && <section className="portal-grid">{addresses.map((address,index) => <article className="panel address-card" key={address.name+index}><b>📍 {address.name} {address.main && <em>Principal</em>}</b><p>{address.address}</p><button onClick={() => setAddresses(list => list.map((item,i) => ({...item, main:i===index})))}>Definir como principal</button></article>)}</section>}
    {section === 'payments' && <section className="portal-grid"><article className="panel address-card"><b>💳 Visa final 4821 <em>Principal</em></b><p>Válido até 08/28</p><button>Editar cartão</button></article><article className="panel address-card"><b>⚡ PIX</b><p>Pagamento instantâneo disponível</p><button>Gerenciar chaves</button></article></section>}
    {section === 'profile' && <form className="panel profile-form" onSubmit={saveProfile}><div className="panel-title"><h2>Dados pessoais</h2>{editing ? <button type="button" onClick={cancelEditor}>Cancelar</button> : <button type="button" onClick={() => setEditing(true)}>Editar</button>}</div><label>Nome<input disabled={!editing} value={editing ? draft.fullName : profile.fullName} onChange={event => setDraft(current => ({ ...current, fullName:event.target.value }))} /></label><label>E-mail<input disabled={!editing} value={editing ? draft.email : profile.email} onChange={event => setDraft(current => ({ ...current, email:event.target.value }))} type="email" /></label><label>Telefone<input disabled={!editing} value={editing ? draft.phone : profile.phone} onChange={event => setDraft(current => ({ ...current, phone:event.target.value }))} type="tel" /></label>{message && <p className="auth-message" role="status">{message}</p>}{editing && <button className="primary" disabled={saving} type="submit">{saving ? 'Salvando...' : 'Salvar alterações'}</button>}</form>}
  </main>
}

function OrderRow({ order, detail }) { return <div className="order-row"><span>📦</span><div><b>{order.id}</b><small>{detail ? order.item : order.date}</small></div><em className={order.status === 'Entregue' ? 'done' : ''}>{order.status}</em><b>{order.total}</b></div> }
