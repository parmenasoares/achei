import { useState } from 'react'
import '../styles/seller-product-form.css'
import { supabase } from '../lib/supabase.js'

// ─── Dados iniciais ──────────────────────────────────────────────────────────
const initialOrders = [
  { id:'#ACH-00123', name:'Amortecedor Dianteiro Premium', total:'R$ 289,90', status:'A separar' },
  { id:'#ACH-00119', name:'Pastilha de Freio Cerâmica',    total:'R$ 145,50', status:'Enviado'   },
  { id:'#ACH-00115', name:'Bateria 60Ah Premium',           total:'R$ 389,90', status:'Entregue'  },
]
const initialProducts = [
  { id:1, name:'Amortecedor Dianteiro Premium', price:'R$ 289,90', stock:12, active:true,  marketplaces:{} },
  { id:2, name:'Pastilha de Freio Cerâmica',    price:'R$ 145,50', stock:4,  active:true,  marketplaces:{} },
  { id:3, name:'Alternador 80A Original',        price:'R$ 456,00', stock:0,  active:false, marketplaces:{} },
]

const EMPTY_COMPAT = { maker:'', brand:'', model:'', year_from:'', year_to:'', engine:'', displacement:'', version:'' }
const EMPTY_PRODUCT = {
  name:'', brand:'', category:'', price:'', stock:'',
  description:'', part_description:'', tech_description:'',
  condition:'new', warranty_part:'', warranty_factory:'',
  photos:[], videos:[],
  compatibility:[ { ...EMPTY_COMPAT } ],
  marketplaces: { mercadolivre: false, shopee: false },
}

const MARKETPLACE_META = {
  mercadolivre: { label:'Mercado Livre', icon:'🛍️', color:'#FFE600', text:'#333' },
  shopee:       { label:'Shopee',        icon:'🟠', color:'#EE4D2D', text:'#fff' },
}

const fmt = v => new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' }).format(Number(v || 0))

// ─── Componente externo: ProductForm ─────────────────────────────────────────
// FORA do SellerDashboard para evitar perda de foco nos inputs
function ProductForm({ draft, setDraft, notice, onSubmit, onClear }) {
  const handleChange = e => {
    const { name, value, type, checked } = e.target
    setDraft(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleMarketplace = e => {
    const { name, checked } = e.target
    setDraft(prev => ({ ...prev, marketplaces: { ...prev.marketplaces, [name]: checked } }))
  }

  const addPhotos = e => {
    const files = Array.from(e.target.files || [])
    const remaining = 8 - draft.photos.length
    const newPhotos = files.slice(0, remaining).map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }))
    setDraft(prev => ({ ...prev, photos: [...prev.photos, ...newPhotos] }))
    e.target.value = ''
  }

  const removePhoto = i => setDraft(prev => ({ ...prev, photos: prev.photos.filter((_, idx) => idx !== i) }))

  const addVideo = e => {
    const files = Array.from(e.target.files || [])
    const remaining = 2 - draft.videos.length
    const newVids = files.slice(0, remaining).map(f => ({ name: f.name, url: URL.createObjectURL(f), file: f }))
    setDraft(prev => ({ ...prev, videos: [...prev.videos, ...newVids] }))
    e.target.value = ''
  }

  const removeVideo = i => setDraft(prev => ({ ...prev, videos: prev.videos.filter((_, idx) => idx !== i) }))

  const changeCompat = (i, field, value) => {
    setDraft(prev => {
      const list = prev.compatibility.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
      return { ...prev, compatibility: list }
    })
  }

  const addCompat  = () => setDraft(prev => ({ ...prev, compatibility: [...prev.compatibility, { ...EMPTY_COMPAT }] }))
  const removeCompat = i => setDraft(prev => ({ ...prev, compatibility: prev.compatibility.filter((_, idx) => idx !== i) }))

  return (
    <form className="panel product-editor" onSubmit={onSubmit}>
      <div className="panel-title">
        <div>
          <h2>Adicionar produto</h2>
          <p>Preencha todas as informações para que o comprador encontre e confie na sua peça.</p>
        </div>
      </div>

      {/* ── MÍDIA ────────────────────────────────────────────────────── */}
      <section className="editor-section">
        <h3 className="editor-section__title">📷 Mídia</h3>

        <div className="media-field">
          <div>
            <b>Fotos ({draft.photos.length}/8)</b>
            <small>A primeira foto será a capa do anúncio.</small>
          </div>
          {draft.photos.length < 8 && (
            <label className="media-upload">
              + Adicionar fotos
              <input type="file" accept="image/*" multiple onChange={addPhotos} aria-label="Selecionar fotos" />
            </label>
          )}
        </div>

        {draft.photos.length > 0 && (
          <div className="media-preview">
            {draft.photos.map((p, i) => (
              <figure key={p.url}>
                <div className="photo-wrap">
                  <img src={p.url} alt={p.name} />
                  <button type="button" onClick={() => removePhoto(i)} aria-label={`Remover foto ${i+1}`}>×</button>
                </div>
                <figcaption>{i === 0 ? 'Capa' : `Foto ${i+1}`}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <div className="media-field" style={{ marginTop: 16 }}>
          <div>
            <b>Vídeos ({draft.videos.length}/2)</b>
            <small>Vídeos curtos da peça. Máximo 2.</small>
          </div>
          {draft.videos.length < 2 && (
            <label className="media-upload">
              + Adicionar vídeo
              <input type="file" accept="video/*" onChange={addVideo} aria-label="Selecionar vídeo" />
            </label>
          )}
        </div>

        {draft.videos.length > 0 && (
          <div className="media-preview-video">
            {draft.videos.map((v, i) => (
              <figure key={v.url}>
                <video src={v.url} controls />
                <button type="button" onClick={() => removeVideo(i)} aria-label={`Remover vídeo ${i+1}`}>×</button>
                <figcaption>Vídeo {i+1}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {/* ── INFORMAÇÕES BÁSICAS ───────────────────────────────────────── */}
      <section className="editor-section">
        <h3 className="editor-section__title">📋 Informações do produto</h3>
        <div className="product-editor__grid">
          <label>
            Nome da peça *
            <input required name="name" value={draft.name} onChange={handleChange} placeholder="Ex.: Amortecedor dianteiro" />
          </label>
          <label>
            Marca da peça
            <input name="brand" value={draft.brand} onChange={handleChange} placeholder="Ex.: Monroe, Cofap, Bosch" />
          </label>
          <label>
            Categoria
            <select name="category" value={draft.category} onChange={handleChange}>
              <option value="">Selecione</option>
              <option>Suspensão</option><option>Freio</option><option>Motor</option>
              <option>Elétrica</option><option>Arrefecimento</option><option>Ignição</option>
              <option>Lubrificantes</option><option>Filtros</option><option>Transmissão</option>
              <option>Carroceria</option><option>Acessórios</option><option>Outros</option>
            </select>
          </label>
          <label>
            Condição da peça
            <select name="condition" value={draft.condition} onChange={handleChange}>
              <option value="new">Nova</option>
              <option value="used">Usada</option>
              <option value="reconditioned">Recondicionada</option>
            </select>
          </label>
          <label>
            Preço (R$) *
            <input required min="0.01" step="0.01" type="number" name="price" value={draft.price} onChange={handleChange} placeholder="0,00" />
          </label>
          <label>
            Estoque
            <input min="0" type="number" name="stock" value={draft.stock} onChange={handleChange} placeholder="0" />
          </label>
          <label>
            Garantia da peça
            <input name="warranty_part" value={draft.warranty_part} onChange={handleChange} placeholder="Ex.: 6 meses" />
          </label>
          <label>
            Garantia da fábrica
            <input name="warranty_factory" value={draft.warranty_factory} onChange={handleChange} placeholder="Ex.: 12 meses" />
          </label>
        </div>

        <label className="product-editor__description">
          Descrição do produto *
          <textarea required name="description" value={draft.description} onChange={handleChange} placeholder="Descrição geral do produto para o cliente." rows={3} />
        </label>

        <label className="product-editor__description">
          Descrição da peça
          <textarea name="part_description" value={draft.part_description} onChange={handleChange} placeholder="Informações específicas sobre a peça: itens inclusos, características visuais, estado de conservação." rows={3} />
        </label>
      </section>

      {/* ── DESCRIÇÃO TÉCNICA ─────────────────────────────────────────── */}
      <section className="editor-section">
        <h3 className="editor-section__title">🔧 Descrição técnica</h3>
        <p className="editor-section__hint">Informe código da peça, código OEM, código do fabricante, especificações elétricas/mecânicas, aplicação e outras informações técnicas relevantes.</p>
        <label className="product-editor__description">
          <textarea name="tech_description" value={draft.tech_description} onChange={handleChange}
            placeholder={"Código da peça: MAP-001\nCódigo OEM: LR006873\nCódigo fabricante: BSCH-0280217810\nAplicação: Sensor de pressão absoluta do coletor\nTensão: 5V\nObservações: Compatível com centralinas Bosch série EDC15."}
            rows={6}
          />
        </label>
      </section>

      {/* ── COMPATIBILIDADE ───────────────────────────────────────────── */}
      <section className="editor-section">
        <h3 className="editor-section__title">🚗 Compatibilidade da peça</h3>
        <p className="editor-section__hint">Adicione todos os veículos compatíveis com esta peça.</p>

        {draft.compatibility.map((item, i) => (
          <div key={i} className="compat-card">
            <div className="compat-card__header">
              <b>Veículo {i + 1}</b>
              {draft.compatibility.length > 1 && (
                <button type="button" className="compat-remove" onClick={() => removeCompat(i)}>Remover</button>
              )}
            </div>
            <div className="product-editor__grid">
              <label>
                Montadora
                <input value={item.maker} onChange={e => changeCompat(i, 'maker', e.target.value)} placeholder="Ex.: GM, Ford, VW" />
              </label>
              <label>
                Marca do veículo
                <input value={item.brand} onChange={e => changeCompat(i, 'brand', e.target.value)} placeholder="Ex.: Chevrolet, Toyota" />
              </label>
              <label>
                Modelo
                <input value={item.model} onChange={e => changeCompat(i, 'model', e.target.value)} placeholder="Ex.: Corsa, Gol, Corolla" />
              </label>
              <label>
                Versão
                <input value={item.version} onChange={e => changeCompat(i, 'version', e.target.value)} placeholder="Ex.: LT, GTI, Comfort" />
              </label>
              <label>
                Ano inicial
                <input type="number" min="1950" max="2030" value={item.year_from} onChange={e => changeCompat(i, 'year_from', e.target.value)} placeholder="2010" />
              </label>
              <label>
                Ano final
                <input type="number" min="1950" max="2030" value={item.year_to} onChange={e => changeCompat(i, 'year_to', e.target.value)} placeholder="2020" />
              </label>
              <label>
                Motor
                <input value={item.engine} onChange={e => changeCompat(i, 'engine', e.target.value)} placeholder="Ex.: 1.0, 1.6, 2.2 Diesel" />
              </label>
              <label>
                Motorização
                <input value={item.displacement} onChange={e => changeCompat(i, 'displacement', e.target.value)} placeholder="Ex.: Flex, Turbo, GNV" />
              </label>
            </div>
          </div>
        ))}

        <button type="button" className="compat-add" onClick={addCompat}>
          + Adicionar outro veículo compatível
        </button>
      </section>

      {/* ── ESPELHAR NOS MARKETPLACES ─────────────────────────────────── */}
      <section className="editor-section">
        <h3 className="editor-section__title">🌐 Espelhar nos Marketplaces</h3>
        <p className="editor-section__hint">
          Selecione onde deseja publicar este produto. As informações cadastradas aqui serão usadas para criar o anúncio automaticamente.
          <br /><strong>Nota:</strong> é necessário conectar sua conta de cada marketplace em <em>Configurações da Loja</em> antes de publicar.
        </p>
        <div className="marketplace-list">
          {Object.entries(MARKETPLACE_META).map(([key, meta]) => (
            <label key={key} className="marketplace-item">
              <input
                type="checkbox"
                name={key}
                checked={draft.marketplaces[key] || false}
                onChange={handleMarketplace}
              />
              <span className="marketplace-badge" style={{ background: meta.color, color: meta.text }}>
                {meta.icon} {meta.label}
              </span>
              <span className="marketplace-status">
                {draft.marketplaces[key] ? '✅ Será publicado ao salvar' : '—'}
              </span>
            </label>
          ))}
        </div>
        <p className="editor-section__hint" style={{ marginTop: 8 }}>
          Outros marketplaces (OLX Autos, Amazon, B2W) poderão ser adicionados futuramente.
        </p>
      </section>

      {notice && <p className="product-editor__notice" role="status">{notice}</p>}

      <div className="product-editor__actions">
        <button type="button" onClick={onClear}>Limpar formulário</button>
        <button className="primary" type="submit">Salvar produto</button>
      </div>
    </form>
  )
}

// ─── Card de produto no catálogo ─────────────────────────────────────────────
function ProductCatalogRow({ product, onToggle, onMirror }) {
  const [showMarket, setShowMarket] = useState(false)

  return (
    <div className="order-row" style={{ flexWrap: 'wrap', gap: 8 }}>
      <span>
        {product.photos?.[0]
          ? <img className="product-row-image" src={product.photos[0].url} alt="" />
          : '🧩'}
      </span>
      <div style={{ flex: 1 }}>
        <b>{product.name}</b>
        <small>{product.price} · estoque: {product.stock}{product.category ? ` · ${product.category}` : ''}</small>
        {/* Status marketplaces */}
        {Object.keys(product.marketplaces || {}).length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
            {Object.entries(product.marketplaces).map(([key, status]) =>
              status ? (
                <span key={key} style={{ fontSize: 11, padding: '2px 7px', borderRadius: 5, background: '#3fbf7f22', color: 'var(--green)', fontWeight: 700 }}>
                  {MARKETPLACE_META[key]?.icon} {MARKETPLACE_META[key]?.label}: {
                    status === 'published' ? '🟢 Publicado' :
                    status === 'pending'   ? '🟡 Aguardando' :
                    status === 'error'     ? '🔴 Erro'       : '—'
                  }
                </span>
              ) : null
            )}
          </div>
        )}
      </div>
      <em className={product.active ? 'done' : ''}>{product.active ? 'Ativo' : 'Rascunho'}</em>
      <button className="table-action" onClick={() => onToggle(product.id)}>
        {product.active ? 'Pausar' : 'Publicar'}
      </button>
      <button className="table-action" onClick={() => setShowMarket(v => !v)} style={{ background: 'var(--surface2)' }}>
        🌐 Marketplaces
      </button>
      {showMarket && (
        <div className="marketplace-panel" style={{ width: '100%' }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 8 }}>Espelhar / gerenciar publicação</p>
          {Object.entries(MARKETPLACE_META).map(([key, meta]) => {
            const status = product.marketplaces?.[key]
            return (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--line)', fontSize: 13 }}>
                <span className="marketplace-badge" style={{ background: meta.color, color: meta.text, fontSize: 11 }}>
                  {meta.icon} {meta.label}
                </span>
                <span style={{ flex: 1, color: 'var(--muted)' }}>
                  {!status       ? '— Não publicado'        : ''}
                  {status === 'published' ? '🟢 Publicado'   : ''}
                  {status === 'pending'   ? '🟡 Aguardando'  : ''}
                  {status === 'error'     ? '🔴 Erro na publicação' : ''}
                </span>
                <button className="table-action" onClick={() => onMirror(product.id, key, 'publish')} style={{ fontSize: 11 }}>Publicar</button>
                {status === 'published' && <>
                  <button className="table-action" onClick={() => onMirror(product.id, key, 'update')}   style={{ fontSize: 11 }}>Atualizar</button>
                  <button className="table-action" onClick={() => onMirror(product.id, key, 'pause')}    style={{ fontSize: 11 }}>Pausar</button>
                  <button className="table-action" onClick={() => onMirror(product.id, key, 'unlink')}   style={{ fontSize: 11 }}>Desvincular</button>
                </>}
              </div>
            )
          })}
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 8 }}>
            ⚠️ Conecte sua conta de cada marketplace em Configurações da Loja para ativar a publicação automática.
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Dashboard principal ──────────────────────────────────────────────────────
export default function SellerDashboard({ onNavigate }) {
  const [section,  setSection]  = useState('overview')
  const [orders,   setOrders]   = useState(initialOrders)
  const [products, setProducts] = useState(initialProducts)
  const [draft,    setDraft]    = useState({ ...EMPTY_PRODUCT, compatibility: [{ ...EMPTY_COMPAT }], marketplaces: { mercadolivre: false, shopee: false } })
  const [notice,   setNotice]   = useState('')

  // ─── Configurações da loja ────────────────────────────────────────────────
  const [storeSettings, setStoreSettings] = useState({
    name:     'AutoPeças Premium SP',
    desc:     'Especialistas em peças originais e paralelas.',
    shipping: '24h',
    phone:    '',
    whatsapp: '',
    city:     '',
    state:    '',
  })
  const [settingsBusy,    setSettingsBusy]    = useState(false)
  const [settingsNotice,  setSettingsNotice]  = useState('')
  const [settingsEditing, setSettingsEditing] = useState(false)
  const [settingsDraft,   setSettingsDraft]   = useState(null)

  const openSettingsEdit = () => {
    setSettingsDraft({ ...storeSettings })
    setSettingsEditing(true)
    setSettingsNotice('')
  }

  const cancelSettingsEdit = () => {
    setSettingsEditing(false)
    setSettingsDraft(null)
    setSettingsNotice('')
  }

  const handleSettingsChange = e => {
    const { name, value } = e.target
    setSettingsDraft(prev => ({ ...prev, [name]: value }))
  }

  const saveSettings = async e => {
    e.preventDefault()
    if (!settingsDraft.name.trim()) {
      setSettingsNotice('O nome da loja é obrigatório.')
      return
    }
    setSettingsBusy(true)
    setSettingsNotice('')

    // Tenta salvar no Supabase (tabela store_profiles)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('store_profiles')
        .upsert({
          user_id:           user.id,
          name:              settingsDraft.name.trim(),
          description:       settingsDraft.desc.trim(),
          shipping_deadline: settingsDraft.shipping,
          phone:             settingsDraft.phone.trim(),
          whatsapp:          settingsDraft.whatsapp.trim(),
          city:              settingsDraft.city.trim(),
          state:             settingsDraft.state.trim().toUpperCase(),
          updated_at:        new Date().toISOString(),
        }, { onConflict: 'user_id' })

      if (error) {
        setSettingsNotice('Erro ao salvar. Tente novamente.')
        setSettingsBusy(false)
        return
      }
    } else {
      // Sem sessão: salva no localStorage
      localStorage.setItem('acheii_store_settings', JSON.stringify(settingsDraft))
    }

    setStoreSettings({ ...settingsDraft })
    setSettingsEditing(false)
    setSettingsDraft(null)
    setSettingsBusy(false)
    setSettingsNotice('')
    setNotice('✅ Informações da loja salvas com sucesso!')
  }

  const markShipped = id => setOrders(list => list.map(o => o.id === id ? { ...o, status: o.status === 'A separar' ? 'Enviado' : 'Entregue' } : o))

  const toggleProduct = id => setProducts(list => list.map(p => p.id === id ? { ...p, active: !p.active } : p))

  // Simula ação de marketplace — estrutura preparada para integração real com APIs
  const mirrorMarketplace = (productId, marketplace, action) => {
    setProducts(list => list.map(p => {
      if (p.id !== productId) return p
      const statusMap = { publish: 'published', update: 'published', pause: 'paused', unlink: false }
      return { ...p, marketplaces: { ...p.marketplaces, [marketplace]: statusMap[action] } }
    }))
    const meta = MARKETPLACE_META[marketplace]
    const msgs = { publish: `Produto enviado para publicação no ${meta.label}. Aguarde a aprovação.`, update: `Anúncio atualizado no ${meta.label}.`, pause: `Anúncio pausado no ${meta.label}.`, unlink: `Produto desvinculado do ${meta.label}.` }
    setNotice(msgs[action] || '')
  }

  const addProduct = e => {
    e.preventDefault()
    if (!draft.name.trim() || !draft.price || !draft.description.trim()) {
      setNotice('Preencha nome, preço e descrição antes de salvar.')
      return
    }
    // Definir status inicial dos marketplaces selecionados
    const marketplaces = {}
    Object.entries(draft.marketplaces).forEach(([key, selected]) => {
      if (selected) marketplaces[key] = 'pending'
    })
    setProducts(list => [...list, {
      id: Date.now(),
      name: draft.name.trim(), brand: draft.brand, category: draft.category,
      price: fmt(draft.price), stock: Number(draft.stock || 0),
      condition: draft.condition, warranty_part: draft.warranty_part,
      warranty_factory: draft.warranty_factory,
      description: draft.description, part_description: draft.part_description,
      tech_description: draft.tech_description,
      photos: draft.photos, videos: draft.videos,
      compatibility: draft.compatibility.filter(c => c.brand || c.model),
      marketplaces,
      active: false,
    }])
    setDraft({ ...EMPTY_PRODUCT, compatibility: [{ ...EMPTY_COMPAT }], marketplaces: { mercadolivre: false, shopee: false } })
    setNotice('Produto salvo como rascunho. Revise e clique em Publicar.')
  }

  const clearDraft = () => {
    setDraft({ ...EMPTY_PRODUCT, compatibility: [{ ...EMPTY_COMPAT }], marketplaces: { mercadolivre: false, shopee: false } })
    setNotice('')
  }

  const tabs = [['overview','Visão geral'],['orders','Pedidos'],['products','Produtos'],['stock','Estoque'],['finance','Financeiro'],['settings','Loja']]

  return (
    <main className="container dashboard-page seller-dashboard">
      <section className="dashboard-hero">
        <div className="profile-avatar store">AP</div>
        <div>
          <small>PORTAL DO VENDEDOR</small>
          <h1>AutoPeças Premium SP</h1>
          <p>Seu desempenho está 12% acima do último mês.</p>
        </div>
        <button className="primary" onClick={() => setSection('products')}>+ Adicionar produto</button>
      </section>

      <div className="dashboard-tabs">
        {tabs.map(([id, label]) => (
          <button key={id} className={section === id ? 'active' : ''} onClick={() => setSection(id)}>{label}</button>
        ))}
      </div>

      {/* Visão geral */}
      {section === 'overview' && (
        <>
          <section className="dashboard-cards seller-cards">
            <article><span>💰</span><b>R$ 18.420</b><small>Vendas no mês</small></article>
            <article><span>🛒</span><b>86</b><small>Pedidos recebidos</small></article>
            <article><span>⭐</span><b>4,9</b><small>Avaliação da loja</small></article>
            <article><span>📦</span><b>{products.length}</b><small>Produtos ativos</small></article>
          </section>
          <section className="dashboard-grid">
            <article className="panel wide">
              <div className="panel-title"><h2>Pedidos para processar</h2><button onClick={() => setSection('orders')}>Ver pedidos</button></div>
              {orders.map(o => <SellerOrder key={o.id} order={o} onAction={markShipped} />)}
            </article>
            <article className="panel">
              <div className="panel-title"><h2>Ações rápidas</h2></div>
              <button className="quick-link" onClick={() => setSection('stock')}>📦 Atualizar estoque <span>›</span></button>
              <button className="quick-link" onClick={() => setSection('products')}>🏷️ Criar promoção <span>›</span></button>
              <button className="quick-link" onClick={() => onNavigate('seller')}>🏪 Ver minha loja <span>›</span></button>
            </article>
          </section>
        </>
      )}

      {/* Pedidos */}
      {section === 'orders' && (
        <article className="panel">
          <div className="panel-title"><h2>Todos os pedidos</h2><button>Exportar CSV</button></div>
          {orders.map(o => <SellerOrder key={o.id} order={o} onAction={markShipped} />)}
        </article>
      )}

      {/* Produtos */}
      {section === 'products' && (
        <>
          <ProductForm
            draft={draft}
            setDraft={setDraft}
            notice={notice}
            onSubmit={addProduct}
            onClear={clearDraft}
          />
          <article className="panel" style={{ marginTop: 24 }}>
            <div className="panel-title">
              <h2>Catálogo da loja</h2>
              <button>{products.length} produtos</button>
            </div>
            {products.map(p => (
              <ProductCatalogRow
                key={p.id}
                product={p}
                onToggle={toggleProduct}
                onMirror={mirrorMarketplace}
              />
            ))}
          </article>
        </>
      )}

      {/* Estoque */}
      {section === 'stock' && (
        <article className="panel">
          <div className="panel-title"><h2>Controle de estoque</h2><button>Baixar relatório</button></div>
          {products.map(p => (
            <div className="order-row" key={p.id}>
              <span>📦</span>
              <div><b>{p.name}</b><small>Disponível para venda</small></div>
              <b className={p.stock < 5 ? 'low-stock' : ''}>{p.stock} un.</b>
              <button className="table-action" onClick={() => setProducts(list => list.map(item => item.id === p.id ? { ...item, stock: item.stock + 1 } : item))}>+ 1</button>
            </div>
          ))}
        </article>
      )}

      {/* Financeiro */}
      {section === 'finance' && (
        <section className="portal-grid">
          <article className="panel finance-card"><small>Saldo disponível</small><b>R$ 12.841,30</b><button className="primary">Solicitar saque</button></article>
          <article className="panel finance-card"><small>Próximo repasse</small><b>R$ 2.189,80</b><p>Disponível em 18 jan 2025</p></article>
        </section>
      )}

      {/* Configurações */}
      {section === 'settings' && (
        <>
          {/* ── Informações da loja ── */}
          <form className="panel profile-form" onSubmit={saveSettings}>
            <div className="panel-title">
              <h2>Informações da loja</h2>
              {settingsEditing
                ? <button type="button" onClick={cancelSettingsEdit}>Cancelar</button>
                : <button type="button" onClick={openSettingsEdit}>Editar</button>
              }
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <label style={{ gridColumn: '1/-1' }}>
                Nome da loja *
                <input
                  name="name"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.name : storeSettings.name}
                  onChange={handleSettingsChange}
                />
              </label>
              <label style={{ gridColumn: '1/-1' }}>
                Descrição
                <textarea
                  name="desc"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.desc : storeSettings.desc}
                  onChange={handleSettingsChange}
                  rows={3}
                />
              </label>
              <label>
                Telefone
                <input
                  name="phone"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.phone : storeSettings.phone}
                  onChange={handleSettingsChange}
                  placeholder="(11) 9 9999-0000"
                />
              </label>
              <label>
                WhatsApp
                <input
                  name="whatsapp"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.whatsapp : storeSettings.whatsapp}
                  onChange={handleSettingsChange}
                  placeholder="(11) 9 9999-0000"
                />
              </label>
              <label>
                Cidade
                <input
                  name="city"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.city : storeSettings.city}
                  onChange={handleSettingsChange}
                  placeholder="São Paulo"
                />
              </label>
              <label>
                Estado (UF)
                <input
                  name="state"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.state : storeSettings.state}
                  onChange={handleSettingsChange}
                  placeholder="SP"
                  maxLength={2}
                />
              </label>
              <label>
                Prazo de envio
                <select
                  name="shipping"
                  disabled={!settingsEditing}
                  value={settingsEditing ? settingsDraft.shipping : storeSettings.shipping}
                  onChange={handleSettingsChange}
                >
                  <option value="24h">24 horas</option>
                  <option value="48h">48 horas</option>
                  <option value="72h">72 horas</option>
                  <option value="5d">5 dias úteis</option>
                  <option value="10d">10 dias úteis</option>
                </select>
              </label>
            </div>

            {settingsNotice && (
              <p className="auth-message" role="alert">{settingsNotice}</p>
            )}

            {settingsEditing && (
              <button className="primary" type="submit" disabled={settingsBusy} style={{ marginTop: 8 }}>
                {settingsBusy ? 'Salvando...' : 'Salvar alterações'}
              </button>
            )}
          </form>

          {/* ── Marketplaces ── */}
          <article className="panel" style={{ marginTop: 16 }}>
            <div className="panel-title">
              <h2>🌐 Conexões com Marketplaces</h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
              Conecte suas contas para habilitar o espelhamento automático de produtos.
            </p>
            {Object.entries(MARKETPLACE_META).map(([key, meta]) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: '1px solid var(--line)' }}>
                <span className="marketplace-badge" style={{ background: meta.color, color: meta.text }}>
                  {meta.icon} {meta.label}
                </span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--muted)' }}>Conta não conectada</span>
                <button
                  className="table-action"
                  onClick={() => setNotice(`Para conectar o ${meta.label}, acesse as configurações de API do marketplace e insira as credenciais.`)}
                >
                  Conectar conta
                </button>
              </div>
            ))}
            <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 12 }}>
              A integração utiliza as APIs oficiais de cada marketplace. Ao conectar, você será redirecionado para autorizar o acesso.
            </p>
          </article>
        </>
      )}

      {notice && section !== 'products' && <div className="toast">{notice}</div>}
    </main>
  )
}

function SellerOrder({ order, onAction }) {
  return (
    <div className="order-row">
      <span>🧾</span>
      <div><b>{order.id}</b><small>{order.name}</small></div>
      <em className={order.status === 'Entregue' ? 'done' : ''}>{order.status}</em>
      <b>{order.total}</b>
      {order.status !== 'Entregue' && (
        <button className="table-action" onClick={() => onAction(order.id)}>
          {order.status === 'A separar' ? 'Enviar' : 'Concluir'}
        </button>
      )}
    </div>
  )
}


