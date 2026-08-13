import { useMemo, useState } from 'react'

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const initialAddress = { cep: '', city: '', street: '', number: '', complement: '' }

export default function Checkout({ cart, payment, setPayment, onConfirm }) {
  const [address, setAddress] = useState(initialAddress)
  const [coupon, setCoupon] = useState('')
  const [couponMessage, setCouponMessage] = useState('')
  const [error, setError] = useState('')
  const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.qty, 0), [cart])
  const discount = coupon.trim().toUpperCase() === 'ACHEI10' ? subtotal * .1 : 0
  const shipping = subtotal - discount >= 500 ? 0 : 19.9
  const total = Math.max(0, subtotal - discount + shipping)
  const updateAddress = (field, value) => setAddress(current => ({ ...current, [field]: value }))
  const applyCoupon = () => setCouponMessage(coupon.trim().toUpperCase() === 'ACHEI10' ? 'Cupom aplicado: 10% de desconto.' : 'Cupom inválido. Use ACHEI10 para testar.')

  const confirm = () => {
    if (!cart.length) return setError('Adicione um produto ao carrinho antes de continuar.')
    if (!address.cep || !address.city || !address.street || !address.number) return setError('Preencha CEP, cidade, endereço e número para continuar.')
    setError('')
    onConfirm({ id: 'ACH-' + Date.now().toString().slice(-7), createdAt: new Date().toLocaleDateString('pt-BR'), status: payment === 'PIX' ? 'Aguardando pagamento PIX' : 'Pedido confirmado', items: cart, total, address, payment })
  }

  return <main className="container checkout">
    <h1>Finalizar compra</h1><div className="steps"><b>✓ Carrinho</b><b>✓ Dados</b><b>3 Pagamento</b><span>4 Confirmação</span></div>
    <div className="checkout-grid"><section>
      <article className="form-card"><h3>📍 Endereço de entrega</h3><div className="form-grid">
        <label>CEP<input value={address.cep} onChange={event => updateAddress('cep', event.target.value)} inputMode="numeric" placeholder="00000-000" /></label>
        <label>Cidade<input value={address.city} onChange={event => updateAddress('city', event.target.value)} placeholder="Sua cidade" /></label>
        <label className="wide">Endereço<input value={address.street} onChange={event => updateAddress('street', event.target.value)} placeholder="Rua, avenida ou estrada" /></label>
        <label>Número<input value={address.number} onChange={event => updateAddress('number', event.target.value)} placeholder="123" /></label>
        <label>Complemento<input value={address.complement} onChange={event => updateAddress('complement', event.target.value)} placeholder="Apartamento, bloco..." /></label>
      </div></article>
      <article className="form-card"><h3>💳 Forma de pagamento</h3><div className="payment">{['Cartão de crédito','PIX','Boleto'].map(method => <button key={method} className={payment === method ? 'active' : ''} onClick={() => setPayment(method)}>{method === 'PIX' ? '📱' : method === 'Boleto' ? '🏦' : '💳'}<br />{method}</button>)}</div>
        {payment === 'Cartão de crédito' && <div className="form-grid"><label className="wide">Número do cartão<input inputMode="numeric" placeholder="0000 0000 0000 0000" /></label><label>Validade<input placeholder="MM/AA" /></label><label>CVV<input inputMode="numeric" placeholder="000" /></label></div>}
        {payment === 'PIX' && <p className="payment-info">⚡ O código PIX será exibido após a confirmação do pedido.</p>}
        {payment === 'Boleto' && <p className="payment-info">🏦 O boleto terá vencimento em 2 dias úteis.</p>}
      </article>
      {error && <p className="checkout-error">{error}</p>}<button className="primary confirm" onClick={confirm}>✅ Confirmar pedido</button>
    </section>
    <aside className="summary"><h3>Resumo do pedido</h3>{cart.length ? cart.map(item => <p key={item.id}>{item.name} <b>{money(item.price * item.qty)}</b><small>Quantidade: {item.qty}</small></p>) : <p>Carrinho vazio</p>}
      <div className="coupon"><input value={coupon} onChange={event => setCoupon(event.target.value)} placeholder="Cupom de desconto" /><button onClick={applyCoupon}>Aplicar</button></div>{couponMessage && <small className="coupon-message">{couponMessage}</small>}
      <hr /><p>Subtotal <b>{money(subtotal)}</b></p>{discount > 0 && <p className="discount">Desconto <b>-{money(discount)}</b></p>}<p>Frete <b>{shipping ? money(shipping) : 'Grátis ✅'}</b></p><h3>Total <b>{money(total)}</b></h3><small className="secure-checkout">🔒 Pagamento seguro e compra protegida</small>
    </aside></div>
  </main>
}