import { useState } from 'react'
import AddressFields from '../components/AddressFields.jsx'

const money = value => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Checkout({ cart, payment, setPayment, onConfirm }) {
  const [delivery, setDelivery] = useState({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  })

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0)
  const shipping = subtotal >= 500 ? 0 : 19.9

  return (
    <main className="container checkout">
      <h1>Finalizar compra</h1>
      <div className="steps">
        <b>✓ Carrinho</b>
        <b>2 Dados</b>
        <span>3 Pagamento</span>
        <span>4 Confirmação</span>
      </div>

      <div className="checkout-grid">
        <section>
          <AddressFields
            title="📍 Endereço de entrega"
            description="Digite o CEP e o restante do endereço será preenchido automaticamente."
            value={delivery}
            onChange={setDelivery}
          />

          <article className="form-card">
            <h3>💳 Forma de pagamento</h3>
            <div className="payment">
              {['Cartão de crédito', 'PIX', 'Boleto'].map(option => (
                <button
                  key={option}
                  className={payment === option ? 'active' : ''}
                  onClick={() => setPayment(option)}
                  type="button"
                >
                  {option === 'PIX' ? '📱' : option === 'Boleto' ? '🏦' : '💳'}
                  <br />
                  {option}
                </button>
              ))}
            </div>

            {payment === 'Cartão de crédito' && (
              <div className="form-grid">
                <label className="wide">
                  Número do cartão
                  <input placeholder="0000 0000 0000 0000" />
                </label>
                <label>
                  Validade
                  <input placeholder="MM/AA" />
                </label>
                <label>
                  CVV
                  <input placeholder="000" />
                </label>
              </div>
            )}

            <button className="primary confirm" onClick={onConfirm} type="button">
              ✅ Confirmar pedido
            </button>
          </article>
        </section>

        <aside className="summary">
          <h3>Resumo do pedido</h3>
          {cart.length ? cart.map(item => (
            <p key={item.id}>
              {item.emoji} {item.name} <b>{money(item.price * item.qty)}</b>
            </p>
          )) : <p>Carrinho vazio</p>}
          <hr />
          <p>Subtotal <b>{money(subtotal)}</b></p>
          <p>Frete <b>{shipping ? money(shipping) : 'Grátis ✅'}</b></p>
          <h3>Total <b>{money(subtotal + shipping)}</b></h3>
        </aside>
      </div>
    </main>
  )
}
