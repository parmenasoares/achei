import { useState } from 'react'

const demoUsers = [
  { role: 'buyer', label: 'Comprador', email: 'comprador@achei.demo', password: 'Comprador123!' },
  { role: 'seller', label: 'Vendedor', email: 'vendedor@achei.demo', password: 'Vendedor123!' },
  { role: 'admin', label: 'Super admin', email: 'admin@achei.demo', password: 'Admin123!' }
]

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const useDemo = user => { setEmail(user.email); setPassword(user.password); setMessage(`Credenciais de ${user.label} preenchidas.`) }
  const submit = () => { const user = demoUsers.find(item => item.email === email.trim().toLowerCase() && item.password === password); if (!user) return setMessage('E-mail ou senha de demonstração inválidos.'); onLogin(user.role) }
  return <main className="auth"><section><div className="logo">🔥 ACHEI</div><p>Seu marketplace automotivo favorito</p><div className="tabs"><button className={tab === 'login' ? 'active' : ''} onClick={() => { setTab('login'); setMessage('') }}>Entrar</button><button className={tab === 'register' ? 'active' : ''} onClick={() => { setTab('register'); setMessage('') }}>Cadastrar</button></div>{tab === 'login' ? <><button className="social">🔵 Continuar com Google</button><i>ou</i><label>E-mail<input value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="seu@email.com" /></label><label>Senha<input value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="••••••••" /></label><div className="demo-access"><b>Acessos para teste</b>{demoUsers.map(user => <button key={user.role} onClick={() => useDemo(user)}><span>{user.label}</span><small>{user.email}</small></button>)}</div>{message && <p className="auth-message">{message}</p>}<button className="primary" onClick={submit}>Entrar →</button></> : <><label>Nome<input placeholder="Seu nome" /></label><label>E-mail<input type="email" placeholder="seu@email.com" /></label><label>Senha<input type="password" placeholder="Mínimo 8 caracteres" /></label><button className="primary" onClick={() => onLogin('buyer')}>Criar conta →</button></>}</section></main>
}