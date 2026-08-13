import { useState } from 'react'

const initial = { name: '', phone: '', email: '', city: '', vehicle: '', document: '' }

export default function DeliverySignup() {
  const [form, setForm] = useState(initial)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const update = (field, value) => setForm(current => ({ ...current, [field]: value }))
  const submit = event => {
    event.preventDefault()
    if (Object.values(form).some(value => !value)) return setError('Preencha todos os campos para enviar o cadastro.')
    const applications = JSON.parse(localStorage.getItem('acheii_delivery_applications') || '[]')
    localStorage.setItem('acheii_delivery_applications', JSON.stringify([{ ...form, createdAt: new Date().toISOString(), status: 'Em análise' }, ...applications]))
    setError('')
    setSent(true)
  }

  return <main className="container delivery-page">
    <section className="delivery-hero"><div><small>PARCEIRO ENTREGADOR</small><h1>Entregue com a Acheii</h1><p>Faça entregas de peças automotivas na sua região e acompanhe cada pedido pelo app.</p></div><div className="delivery-benefits"><span>⚡ Chamadas próximas</span><span>💰 Ganhos por entrega</span><span>🛡️ Suporte ao parceiro</span></div></section>
    {sent ? <section className="delivery-success"><b>✓ Cadastro enviado</b><h2>Recebemos seus dados!</h2><p>Vamos analisar o seu cadastro e entrar em contato pelo telefone informado.</p><button className="primary" onClick={() => { setSent(false); setForm(initial) }}>Novo cadastro</button></section> : <form className="delivery-form" onSubmit={submit}><div className="section-heading"><div><small>CADASTRO RÁPIDO</small><h2>Seja um entregador</h2></div><span>Leva menos de 2 minutos</span></div>
      <div className="form-grid"><label className="wide">Nome completo<input value={form.name} onChange={event => update('name', event.target.value)} placeholder="Seu nome" /></label><label>Celular com WhatsApp<input value={form.phone} onChange={event => update('phone', event.target.value)} inputMode="tel" placeholder="(00) 00000-0000" /></label><label>E-mail<input value={form.email} onChange={event => update('email', event.target.value)} type="email" placeholder="voce@email.com" /></label><label>Cidade de atuação<input value={form.city} onChange={event => update('city', event.target.value)} placeholder="Ex.: São Paulo" /></label><label>CPF<input value={form.document} onChange={event => update('document', event.target.value)} inputMode="numeric" placeholder="000.000.000-00" /></label></div>
      <fieldset className="vehicle-choice"><legend>Como você vai fazer as entregas?</legend><div><button type="button" className={form.vehicle === 'Bicicleta' ? 'active' : ''} onClick={() => update('vehicle', 'Bicicleta')}><span>🚲</span><b>Bicicleta</b><small>Ideal para entregas leves e próximas</small></button><button type="button" className={form.vehicle === 'Moto' ? 'active' : ''} onClick={() => update('vehicle', 'Moto')}><span>🛵</span><b>Moto</b><small>Mais alcance e entregas rápidas</small></button></div></fieldset>
      {error && <p className="checkout-error">{error}</p>}<button className="primary delivery-submit">Enviar cadastro para análise</button>
    </form>}
  </main>
}