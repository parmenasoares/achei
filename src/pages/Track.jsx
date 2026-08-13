import { useState } from 'react'
const readOrders = () => { try { return JSON.parse(localStorage.getItem('acheii_orders') || '[]') } catch { return [] } }
export default function Track({ onSearch }) {
  const [code, setCode] = useState(''); const [searched, setSearched] = useState(false); const orders = readOrders()
  const steps = ['Pedido confirmado', 'Em separação', 'Coletado pela transportadora', 'Em trânsito', 'Saiu para entrega', 'Entregue']
  return <main className="container track"><section><small>MINHA COMPRA</small><h1>📦 Pedidos e rastreamento</h1><p>Acompanhe cada etapa da sua entrega em um só lugar.</p></section>
    {orders.length > 0 && <section className="my-orders"><h2>Meus pedidos</h2>{orders.map(order => <button key={order.id} onClick={() => { setCode(order.id); setSearched(true) }}><b>{order.id}</b><span>Pedido confirmado · acompanhar entrega →</span></button>)}</section>}
    <section className="track-box"><h2>Rastrear pedido</h2><p>Digite o número do pedido ou código de rastreio.</p><div><input value={code} onChange={e => setCode(e.target.value)} placeholder="Ex: ACH-2026-00123 ou BR123456789BR" /><button className="primary" onClick={() => setSearched(Boolean(code))}>Rastrear</button></div>{searched && <div className="timeline"><h3>Pedido {code} <span>Em trânsito 🚚</span></h3>{steps.map((step, i) => <p className={i < 3 ? 'done' : i === 3 ? 'current' : ''} key={step}><b>{i < 3 ? '✓' : i === 3 ? '●' : '○'}</b>{step}<small>{i < 4 ? 'Atualizado hoje' : 'Aguardando'}</small></p>)}</div>}</section>
    <section className="track-help"><b>Não encontrou a peça que procura?</b><button onClick={onSearch}>Buscar peça por veículo →</button></section>
  </main>
}