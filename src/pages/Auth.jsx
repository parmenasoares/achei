import { useState } from 'react'

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [role, setRole] = useState('buyer')

  return <main className="auth"><section>
    <div className="logo">🔥 ACHEII</div><p>Seu marketplace automotivo favorito</p>
    <div className="tabs"><button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')}>Entrar</button><button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')}>Cadastrar</button></div>
    {tab === 'login' ? <><button className="social">🔵 Continuar com Google</button><i>ou</i><label>E-mail<input type="email" placeholder="seu@email.com" /></label><label>Senha<input type="password" placeholder="••••••••" /></label>
      <fieldset className="access-role"><legend>Acessar como</legend><button className={role === 'buyer' ? 'active' : ''} onClick={() => setRole('buyer')}>Comprador</button><button className={role === 'seller' ? 'active' : ''} onClick={() => setRole('seller')}>Vendedor</button><button className={role === 'admin' ? 'active' : ''} onClick={() => setRole('admin')}>Super admin</button></fieldset>
      <button className="primary" onClick={() => onLogin(role)}>Entrar →</button></> : <><label>Nome<input placeholder="Seu nome" /></label><label>E-mail<input type="email" placeholder="seu@email.com" /></label><label>Senha<input type="password" placeholder="Mínimo 8 caracteres" /></label><button className="primary" onClick={() => onLogin('buyer')}>Criar conta →</button></>}
  </section></main>
}
