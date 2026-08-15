import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const orders = [
  { id: 'ACH-2025-00123', status: 'Em trânsito', date: '12 jan 2025', total: 'R$ 289,90', item: 'Amortecedor Dianteiro Premium' },
  { id: 'ACH-2024-00992', status: 'Entregue',    date: '28 dez 2024', total: 'R$ 145,50', item: 'Pastilha de Freio Cerâmica' },
  { id: 'ACH-2024-00981', status: 'Entregue',    date: '19 dez 2024', total: 'R$ 89,90',  item: 'Filtro de Ar' },
]

const fallbackProfile = { fullName: '', email: '', phone: '' }

const EMPTY_ADDRESS = {
  id: null, label: '', recipient: '', postal_code: '',
  street: '', number: '', complement: '', neighborhood: '',
  city: '', state: '', reference: '', is_main: false,
}

// Preenchimento automático de CEP via ViaCEP
const fetchCep = async (cep, setFn) => {
  const digits = cep.replace(/\D/g, '')
  if (digits.length !== 8) return
  try {
    const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
    const data = await res.json()
    if (data.erro) return
    setFn(prev => ({
      ...prev,
      street:       data.logradouro || prev.street,
      neighborhood: data.bairro     || prev.neighborhood,
      city:         data.localidade || prev.city,
      state:        data.uf         || prev.state,
    }))
  } catch {}
}

export default function Account({ onNavigate, user: propUser, onLogout }) {
  const [section,  setSection]  = useState('overview')
  const [profile,  setProfile]  = useState(fallbackProfile)
  const [draft,    setDraft]    = useState(fallbackProfile)
  const [userId,   setUserId]   = useState('')
  const [editing,  setEditing]  = useState(false)
  const [message,  setMessage]  = useState('')
  const [saving,   setSaving]   = useState(false)

  // Endereços
  const [addresses,    setAddresses]    = useState([])
  const [addrLoading,  setAddrLoading]  = useState(false)
  const [addrForm,     setAddrForm]     = useState(null)   // null = fechado | EMPTY_ADDRESS = novo | {...} = editando
  const [addrSaving,   setAddrSaving]   = useState(false)
  const [addrMessage,  setAddrMessage]  = useState('')
  const [confirmDel,   setConfirmDel]   = useState(null)   // id do endereço aguardando confirmação

  // Pagamentos
  const [payments,         setPayments]         = useState([])
  const [paymentsLoading,  setPaymentsLoading]  = useState(false)
  const [selectedPayment,  setSelectedPayment]  = useState(null)

  // ─── Carregar perfil ────────────────────────────────────────────────────────
  useEffect(() => {
    let active = true
    supabase.auth.getUser().then(async ({ data }) => {
      const u = data.user
      if (!u || !active) return
      setUserId(u.id)
      const { data: stored } = await supabase
        .from('profiles')
        .select('full_name, email, phone')
        .eq('id', u.id)
        .maybeSingle()
      if (!active) return
      const next = {
        fullName: stored?.full_name || u.user_metadata?.full_name || propUser?.name || '',
        email:    stored?.email     || u.email || '',
        phone:    stored?.phone     || '',
      }
      setProfile(next)
      setDraft(next)
    }).catch(() => {})
    return () => { active = false }
  }, [])

  // ─── Carregar endereços do Supabase ────────────────────────────────────────
  const loadAddresses = async (uid) => {
    if (!uid) return
    setAddrLoading(true)
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', uid)
      .order('is_main', { ascending: false })
      .order('created_at', { ascending: true })
    setAddrLoading(false)
    if (!error && data) setAddresses(data)
  }

  useEffect(() => {
    if (userId) loadAddresses(userId)
  }, [userId])

  const loadPayments = async (uid) => {
    if (!uid) return
    setPaymentsLoading(true)
    // Busca pedidos do localStorage (enquanto não há tabela de pagamentos)
    const stored = []
    try {
      const raw = localStorage.getItem('acheii_orders')
      if (raw) stored.push(...JSON.parse(raw))
    } catch {}
    // Também tenta buscar da tabela orders no Supabase se existir
    const { data } = await supabase
      .from('orders')
      .select('id, created_at, total, status, payment_status, payment_method, items')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })
      .limit(50)
    setPaymentsLoading(false)
    if (data && data.length) {
      setPayments(data.map(o => ({
        id:             o.id,
        date:           new Date(o.created_at).toLocaleDateString('pt-BR'),
        total:          typeof o.total === 'number'
                          ? `R$ ${o.total.toFixed(2).replace('.', ',')}`
                          : o.total || 'R$ —',
        status:         o.payment_status || o.status || 'Pago',
        method:         o.payment_method || '—',
        items:          o.items || [],
      })))
    } else if (stored.length) {
      setPayments(stored.map(o => ({
        id:     o.id || '—',
        date:   o.date || '—',
        total:  o.total || '—',
        status: o.status || 'Pago',
        method: o.payment || '—',
        items:  o.items || [],
      })))
    } else {
      setPayments([])
    }
  }

  useEffect(() => {
    if (section === 'payments' && userId && !payments.length) loadPayments(userId)
  }, [section, userId])

  // ─── Salvar endereço (criar ou atualizar) ──────────────────────────────────
  const saveAddress = async (e) => {
    e.preventDefault()
    const { label, postal_code, street, number, city, state } = addrForm
    if (!label.trim() || !postal_code.trim() || !street.trim() || !number.trim() || !city.trim() || !state.trim()) {
      return setAddrMessage('Preencha pelo menos: apelido, CEP, rua, número, cidade e estado.')
    }
    setAddrSaving(true)
    setAddrMessage('')

    const payload = {
      user_id:      userId,
      label:        addrForm.label.trim(),
      recipient:    addrForm.recipient.trim(),
      postal_code:  addrForm.postal_code.replace(/\D/g, ''),
      street:       addrForm.street.trim(),
      number:       addrForm.number.trim(),
      complement:   addrForm.complement.trim(),
      neighborhood: addrForm.neighborhood.trim(),
      city:         addrForm.city.trim(),
      state:        addrForm.state.trim().toUpperCase(),
      reference:    addrForm.reference.trim(),
      is_main:      addrForm.is_main,
    }

    let error
    if (addrForm.id) {
      // Atualizar existente
      ;({ error } = await supabase.from('addresses').update(payload).eq('id', addrForm.id).eq('user_id', userId))
    } else {
      // Criar novo
      ;({ error } = await supabase.from('addresses').insert(payload))
    }

    // Se marcou como principal, rebaixar os outros
    if (!error && addrForm.is_main) {
      const updateId = addrForm.id || null
      await supabase
        .from('addresses')
        .update({ is_main: false })
        .eq('user_id', userId)
        .neq('id', updateId || '00000000-0000-0000-0000-000000000000')
    }

    setAddrSaving(false)
    if (error) return setAddrMessage('Não foi possível salvar o endereço. Tente novamente.')
    setAddrForm(null)
    loadAddresses(userId)
  }

  // ─── Definir como principal ────────────────────────────────────────────────
  const setMainAddress = async (id) => {
    await supabase.from('addresses').update({ is_main: false }).eq('user_id', userId)
    await supabase.from('addresses').update({ is_main: true  }).eq('id', id).eq('user_id', userId)
    loadAddresses(userId)
  }

  // ─── Excluir endereço ──────────────────────────────────────────────────────
  const deleteAddress = async (id) => {
    await supabase.from('addresses').delete().eq('id', id).eq('user_id', userId)
    setConfirmDel(null)
    loadAddresses(userId)
  }

  // ─── Perfil ────────────────────────────────────────────────────────────────
  const openEditor  = () => { setDraft(profile); setMessage(''); setSection('profile'); setEditing(true) }
  const cancelEditor = () => { setDraft(profile); setEditing(false); setMessage('') }
  const saveProfile = async (e) => {
    e.preventDefault()
    if (!draft.fullName.trim() || !draft.email.trim() || !draft.phone.trim())
      return setMessage('Preencha nome, e-mail e telefone.')
    setSaving(true)
    if (userId) {
      const { error } = await supabase.from('profiles')
        .update({ full_name: draft.fullName.trim(), phone: draft.phone.trim(), email: draft.email.trim().toLowerCase() })
        .eq('id', userId)
      if (error) { setSaving(false); return setMessage('Não foi possível salvar. Tente novamente.') }
      if (draft.email.trim().toLowerCase() !== profile.email.trim().toLowerCase()) {
        const { error: authError } = await supabase.auth.updateUser({ email: draft.email.trim().toLowerCase() })
        if (authError) { setSaving(false); return setMessage('Dados salvos, mas o e-mail não pôde ser atualizado.') }
        setMessage('Dados salvos. Confirme o novo e-mail para concluir.')
      } else {
        setMessage('Dados salvos com sucesso.')
      }
    } else {
      localStorage.setItem('achei_profile', JSON.stringify(draft))
      setMessage('Dados salvos neste dispositivo.')
    }
    setProfile({ ...draft, fullName: draft.fullName.trim(), email: draft.email.trim().toLowerCase(), phone: draft.phone.trim() })
    setSaving(false)
    setEditing(false)
  }

  // ─── UI helpers ───────────────────────────────────────────────────────────
  const tabs  = [['overview','Visão geral'],['orders','Meus pedidos'],['addresses','Endereços'],['payments','Pagamentos'],['profile','Perfil']]
  const title = { overview:'Minha conta', orders:'Meus pedidos', addresses:'Endereços', payments:'Pagamentos', profile:'Dados pessoais' }[section]

  const addrField = (field, label, opts = {}) => (
    <label key={field} style={opts.wide ? { gridColumn: '1/-1' } : {}}>
      {label}
      <input
        value={addrForm?.[field] || ''}
        onChange={e => {
          const val = e.target.value
          setAddrForm(prev => ({ ...prev, [field]: val }))
          if (field === 'postal_code') fetchCep(val, setAddrForm)
        }}
        placeholder={opts.placeholder || ''}
        maxLength={opts.maxLength}
        style={{ width: '100%' }}
      />
    </label>
  )

  // ─── Formulário de endereço ───────────────────────────────────────────────
  const AddressForm = () => (
    <form className="panel profile-form" onSubmit={saveAddress} style={{ marginBottom: 24 }}>
      <div className="panel-title">
        <h2>{addrForm?.id ? 'Editar endereço' : 'Novo endereço'}</h2>
        <button type="button" onClick={() => { setAddrForm(null); setAddrMessage('') }}>Cancelar</button>
      </div>
      <div className="form-grid">
        {addrField('label',        'Apelido (ex: Casa, Trabalho)',  { wide: false, placeholder: 'Casa' })}
        {addrField('recipient',    'Nome do destinatário',          { wide: false, placeholder: 'Opcional' })}
        <label>
          CEP
          <input
            value={addrForm?.postal_code || ''}
            onChange={e => {
              const val = e.target.value.replace(/\D/g,'').slice(0,8).replace(/^(\d{5})(\d)/,'$1-$2')
              setAddrForm(prev => ({ ...prev, postal_code: val }))
              fetchCep(val, setAddrForm)
            }}
            placeholder="00000-000"
            maxLength={9}
          />
        </label>
        {addrField('state',        'Estado (UF)',    { placeholder: 'SP' })}
        {addrField('street',       'Rua / Avenida', { wide: true, placeholder: 'Rua das Flores' })}
        {addrField('number',       'Número',        { placeholder: '123' })}
        {addrField('complement',   'Complemento',   { placeholder: 'Apto 42, Bloco B' })}
        {addrField('neighborhood', 'Bairro',        { placeholder: 'Centro' })}
        {addrField('city',         'Cidade',        { placeholder: 'São Paulo' })}
        {addrField('reference',    'Ponto de referência', { wide: true, placeholder: 'Próximo à padaria' })}
      </div>
      <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, fontSize: 14, cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={addrForm?.is_main || false}
          onChange={e => setAddrForm(prev => ({ ...prev, is_main: e.target.checked }))}
          style={{ width: 16, height: 16 }}
        />
        Definir como endereço principal
      </label>
      {addrMessage && <p className="auth-message" role="alert">{addrMessage}</p>}
      <button className="primary" type="submit" disabled={addrSaving} style={{ marginTop: 8 }}>
        {addrSaving ? 'Salvando...' : addrForm?.id ? 'Salvar alterações' : 'Adicionar endereço'}
      </button>
    </form>
  )

  // ─── Card de endereço ─────────────────────────────────────────────────────
  const AddressCard = ({ addr }) => (
    <article className="panel address-card" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <b>📍 {addr.label} {addr.is_main && <em>Principal</em>}</b>
      </div>
      {addr.recipient && <p style={{ margin: '0 0 4px', fontWeight: 600, fontSize: 13 }}>{addr.recipient}</p>}
      <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 13 }}>
        {addr.street}{addr.number ? `, ${addr.number}` : ''}{addr.complement ? ` — ${addr.complement}` : ''}
      </p>
      <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 13 }}>
        {addr.neighborhood ? `${addr.neighborhood} — ` : ''}{addr.city}/{addr.state}
      </p>
      {addr.postal_code && (
        <p style={{ margin: '0 0 4px', color: 'var(--muted)', fontSize: 12 }}>
          CEP: {addr.postal_code.replace(/^(\d{5})(\d{3})$/, '$1-$2')}
        </p>
      )}
      {addr.reference && (
        <p style={{ margin: '0 0 8px', color: 'var(--muted)', fontSize: 12, fontStyle: 'italic' }}>
          📌 {addr.reference}
        </p>
      )}

      {/* Ações */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
        {!addr.is_main && (
          <button onClick={() => setMainAddress(addr.id)} style={{ fontSize: 12 }}>
            Definir como principal
          </button>
        )}
        <button
          onClick={() => { setAddrForm({ ...addr }); setAddrMessage(''); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          style={{ fontSize: 12, color: 'var(--orange)', background: 'transparent', border: '1px solid var(--orange)', borderRadius: 7, padding: '6px 12px' }}
        >
          ✏️ Editar
        </button>
        {confirmDel === addr.id ? (
          <>
            <span style={{ fontSize: 12, color: 'var(--muted)', alignSelf: 'center' }}>Confirmar exclusão?</span>
            <button onClick={() => deleteAddress(addr.id)} style={{ fontSize: 12, color: '#fff', background: 'var(--red, #e5484d)', border: 'none', borderRadius: 7, padding: '6px 12px' }}>
              Sim, excluir
            </button>
            <button onClick={() => setConfirmDel(null)} style={{ fontSize: 12 }}>Cancelar</button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDel(addr.id)}
            style={{ fontSize: 12, color: 'var(--red, #e5484d)', background: 'transparent', border: '1px solid var(--red, #e5484d)', borderRadius: 7, padding: '6px 12px' }}
          >
            🗑️ Excluir
          </button>
        )}
      </div>
    </article>
  )

  // ─── Render principal ─────────────────────────────────────────────────────
  return (
    <main className="container dashboard-page">
      <section className="dashboard-hero">
        <div className="profile-avatar">
          {profile.fullName.split(' ').map(w => w[0]).slice(0,2).join('').toUpperCase() || '?'}
        </div>
        <div>
          <small>ÁREA DO COMPRADOR</small>
          <h1>Olá, {profile.fullName.split(' ')[0] || 'Usuário'}</h1>
          <p>Gerencie suas compras, dados e preferências.</p>
        </div>
        <button className="secondary" onClick={openEditor}>Editar perfil</button>
      </section>

      <div className="dashboard-tabs">
        {tabs.map(([id, label]) => (
          <button
            className={section === id ? 'active' : ''}
            key={id}
            onClick={() => { setSection(id); if (id !== 'profile') setEditing(false); if (id !== 'addresses') setAddrForm(null) }}
          >{label}</button>
        ))}
      </div>

      <section className="portal-title">
        <div><small>PAINEL DO COMPRADOR</small><h2>{title}</h2></div>
        {section === 'orders' && <button className="secondary" onClick={() => onNavigate('track')}>Rastrear pedido</button>}
        {section === 'addresses' && !addrForm && (
          <button className="primary" onClick={() => { setAddrForm({ ...EMPTY_ADDRESS }); setAddrMessage('') }}>
            + Novo endereço
          </button>
        )}
      </section>

      {/* Visão geral */}
      {section === 'overview' && (
        <>
          <section className="dashboard-cards">
            <article><span>📦</span><b>2</b><small>Pedidos em andamento</small></article>
            <article><span>♥</span><b>6</b><small>Produtos favoritos</small></article>
            <article><span>🏆</span><b>R$ 84</b><small>Economia acumulada</small></article>
          </section>
          <section className="dashboard-grid">
            <article className="panel">
              <div className="panel-title"><h2>Pedidos recentes</h2><button onClick={() => setSection('orders')}>Ver todos</button></div>
              {orders.slice(0,2).map(o => <OrderRow key={o.id} order={o} />)}
            </article>
            <article className="panel">
              <div className="panel-title"><h2>Atalhos</h2></div>
              <button className="quick-link" onClick={() => onNavigate('home')}>🛍️ Continuar comprando <span>›</span></button>
              <button className="quick-link" onClick={() => setSection('addresses')}>📍 Meus endereços <span>›</span></button>
              <button className="quick-link" onClick={() => setSection('payments')}>💳 Histórico de pagamentos <span>›</span></button>
            </article>
          </section>
        </>
      )}

      {/* Pedidos */}
      {section === 'orders' && (
        <article className="panel">
          <div className="panel-title"><h2>Histórico de pedidos</h2><button onClick={() => onNavigate('home')}>Comprar novamente</button></div>
          {orders.map(o => <OrderRow key={o.id} order={o} detail />)}
        </article>
      )}

      {/* Endereços */}
      {section === 'addresses' && (
        <>
          {addrForm && <AddressForm />}
          {addrLoading
            ? <p style={{ color: 'var(--muted)', padding: '20px 0' }}>Carregando endereços...</p>
            : addresses.length === 0 && !addrForm
              ? (
                <div className="panel" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📍</div>
                  <p>Você ainda não tem endereços cadastrados.</p>
                  <button className="primary" style={{ marginTop: 16 }} onClick={() => setAddrForm({ ...EMPTY_ADDRESS })}>
                    + Adicionar primeiro endereço
                  </button>
                </div>
              )
              : (
                <section className="portal-grid">
                  {addresses.map(addr => <AddressCard key={addr.id} addr={addr} />)}
                </section>
              )
          }
        </>
      )}

      {/* Pagamentos — histórico de pagamentos realizados */}
      {section === 'payments' && (
        <>
          {selectedPayment ? (
            // Detalhe do pagamento
            <article className="panel" style={{ maxWidth: 560 }}>
              <div className="panel-title">
                <h2>Detalhes do pagamento</h2>
                <button onClick={() => setSelectedPayment(null)}>← Voltar</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>Pedido</span>
                  <b>{selectedPayment.id}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>Data</span>
                  <span>{selectedPayment.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>Valor</span>
                  <b style={{ color: 'var(--yellow)' }}>{selectedPayment.total}</b>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>Forma de pagamento</span>
                  <span>{selectedPayment.method}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--line)' }}>
                  <span style={{ color: 'var(--muted)' }}>Status</span>
                  <PaymentBadge status={selectedPayment.status} />
                </div>
                {selectedPayment.items && selectedPayment.items.length > 0 && (
                  <div style={{ paddingTop: 8 }}>
                    <p style={{ color: 'var(--muted)', fontSize: 12, marginBottom: 8 }}>ITENS DA COMPRA</p>
                    {selectedPayment.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
                        <span>{item.name || item}</span>
                        {item.price && <span style={{ color: 'var(--yellow)' }}>R$ {Number(item.price).toFixed(2).replace('.', ',')}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </article>
          ) : (
            // Lista de pagamentos
            <article className="panel">
              <div className="panel-title">
                <h2>Histórico de pagamentos</h2>
                <button onClick={() => loadPayments(userId)} style={{ fontSize: 12 }}>↻ Atualizar</button>
              </div>
              {paymentsLoading ? (
                <p style={{ color: 'var(--muted)', padding: '20px 0' }}>Carregando pagamentos...</p>
              ) : payments.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--muted)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>💳</div>
                  <p>Nenhum pagamento encontrado.</p>
                  <p style={{ fontSize: 13, marginTop: 6 }}>Seus pagamentos aparecerão aqui após realizar uma compra.</p>
                  <button className="primary" style={{ marginTop: 16 }} onClick={() => onNavigate('home')}>
                    Explorar produtos
                  </button>
                </div>
              ) : (
                payments.map((p, i) => (
                  <div
                    key={p.id + i}
                    onClick={() => setSelectedPayment(p)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 0', borderTop: '1px solid var(--line)',
                      cursor: 'pointer', gap: 12, flexWrap: 'wrap',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '.75'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                  >
                    <span style={{ fontSize: 24, flexShrink: 0 }}>🧾</span>
                    <div style={{ flex: 1 }}>
                      <b style={{ fontSize: 14 }}>Pedido {p.id}</b>
                      <small style={{ display: 'block', color: 'var(--muted)', fontSize: 12, marginTop: 2 }}>{p.date}</small>
                    </div>
                    <PaymentBadge status={p.status} />
                    <b style={{ color: 'var(--yellow)', fontFamily: 'Oswald, sans-serif', fontSize: 18 }}>{p.total}</b>
                    <span style={{ color: 'var(--muted)', fontSize: 18 }}>›</span>
                  </div>
                ))
              )}
            </article>
          )}
        </>
      )}

      {/* Perfil */}
      {section === 'profile' && (
        <form className="panel profile-form" onSubmit={saveProfile}>
          <div className="panel-title">
            <h2>Dados pessoais</h2>
            {editing
              ? <button type="button" onClick={cancelEditor}>Cancelar</button>
              : <button type="button" onClick={() => setEditing(true)}>Editar</button>
            }
          </div>
          <label>Nome<input disabled={!editing} value={editing ? draft.fullName : profile.fullName} onChange={e => setDraft(c => ({ ...c, fullName: e.target.value }))} /></label>
          <label>E-mail<input disabled={!editing} value={editing ? draft.email : profile.email} onChange={e => setDraft(c => ({ ...c, email: e.target.value }))} type="email" /></label>
          <label>Telefone<input disabled={!editing} value={editing ? draft.phone : profile.phone} onChange={e => setDraft(c => ({ ...c, phone: e.target.value }))} type="tel" /></label>
          {message && <p className="auth-message" role="status">{message}</p>}
          {editing && <button className="primary" disabled={saving} type="submit">{saving ? 'Salvando...' : 'Salvar alterações'}</button>}
        </form>
      )}
    </main>
  )
}

function PaymentBadge({ status }) {
  const map = {
    'Pago':               { bg: '#3fbf7f22', color: 'var(--green)', label: '✅ Pago' },
    'Entregue':           { bg: '#3fbf7f22', color: 'var(--green)', label: '✅ Pago' },
    'Pagamento pendente': { bg: '#ffc93c22', color: 'var(--yellow)', label: '⏳ Pendente' },
    'Pendente':           { bg: '#ffc93c22', color: 'var(--yellow)', label: '⏳ Pendente' },
    'Cancelado':          { bg: '#e5484d22', color: '#e5484d',       label: '❌ Cancelado' },
    'Estornado':          { bg: '#e5484d22', color: '#e5484d',       label: '↩️ Estornado' },
  }
  const style = map[status] || { bg: 'var(--surface2)', color: 'var(--muted)', label: status || '—' }
  return (
    <span style={{
      background: style.bg, color: style.color,
      padding: '4px 10px', borderRadius: 7,
      fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
    }}>{style.label}</span>
  )
}

function OrderRow({ order, detail }) {
  return (
    <div className="order-row">
      <span>📦</span>
      <div><b>{order.id}</b><small>{detail ? order.item : order.date}</small></div>
      <em className={order.status === 'Entregue' ? 'done' : ''}>{order.status}</em>
      <b>{order.total}</b>
    </div>
  )
}

