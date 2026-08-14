import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import '../styles/auth-flow.css'

const cleanDigits = value => value.replace(/\D/g, '')
const toBrazilPhone = value => {
  const digits = cleanDigits(value)
  return digits.startsWith('55') ? `+${digits}` : `+55${digits}`
}

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [accountType, setAccountType] = useState('buyer')
  const [login, setLogin] = useState({ identifier:'', password:'' })
  const [form, setForm] = useState({ fullName:'', businessName:'', email:'', phone:'', cpf:'', cnpj:'', pixKey:'', password:'', confirmPassword:'', accepted:false })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  const switchTab = value => { setTab(value); setMessage('') }

  const signIn = async event => {
    event.preventDefault()
    const identifier = login.identifier.trim()
    if (!identifier || !login.password) return setMessage('Informe seu e-mail ou telefone e a senha.')
    if (cleanDigits(identifier).length === 14 && !identifier.includes('@')) return setMessage('Por segurança, entre com o e-mail ou telefone vinculado à empresa. O login por CNPJ será ativado pelo serviço seguro do servidor.')
    setBusy(true)
    const credentials = identifier.includes('@') ? { email:identifier.toLowerCase(), password:login.password } : { phone:toBrazilPhone(identifier), password:login.password }
    const { data, error } = await supabase.auth.signInWithPassword(credentials)
    setBusy(false)
    if (error) return setMessage(error.message === 'Invalid login credentials' ? 'Dados de acesso inválidos ou e-mail ainda não confirmado.' : error.message)
    const role = data.user?.user_metadata?.account_type === 'seller' ? 'seller' : 'buyer'
    setMessage('Acesso realizado.')
    onLogin(role)
  }

  const register = async event => {
    event.preventDefault()
    const document = accountType === 'seller' ? cleanDigits(form.cnpj) : cleanDigits(form.cpf)
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !document || !form.password) return setMessage('Preencha todos os campos obrigatórios.')
    if (accountType === 'seller' && (!form.businessName.trim() || !form.pixKey.trim())) return setMessage('Informe a razão social/nome da loja e a chave PIX.')
    if (accountType === 'buyer' && document.length !== 11) return setMessage('Informe um CPF com 11 números.')
    if (accountType === 'seller' && document.length !== 14) return setMessage('Informe um CNPJ com 14 números.')
    if (cleanDigits(form.phone).length < 10) return setMessage('Informe um telefone válido com DDD.')
    if (form.password.length < 8) return setMessage('A senha deve ter pelo menos 8 caracteres.')
    if (form.password !== form.confirmPassword) return setMessage('As senhas não coincidem.')
    if (!form.accepted) return setMessage('Aceite os termos para concluir seu cadastro.')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email:form.email.trim().toLowerCase(),
      password:form.password,
      options:{
        emailRedirectTo:window.location.origin,
        data:{
          full_name:form.fullName.trim(),
          account_type:accountType,
          phone:toBrazilPhone(form.phone),
          cpf:accountType === 'buyer' ? document : null,
          cnpj:accountType === 'seller' ? document : null,
          business_name:accountType === 'seller' ? form.businessName.trim() : null,
          pix_key:accountType === 'seller' ? form.pixKey.trim() : null
        }
      }
    })
    setBusy(false)
    if (error) return setMessage(error.message)
    if (!data.session) return setMessage('Cadastro recebido. Confira seu e-mail e confirme o acesso antes de comprar ou vender.')
    setMessage('Conta criada com sucesso.')
    onLogin(accountType === 'seller' ? 'seller' : 'buyer')
  }

  return <main className="auth auth-flow"><section><div className="logo">🔥 ACHEI</div><p>Seu marketplace automotivo favorito</p><div className="tabs"><button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Entrar</button><button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>Cadastrar</button></div>{tab === 'login' ? <form onSubmit={signIn}><label>E-mail, telefone ou CNPJ<input value={login.identifier} onChange={event => setLogin(current => ({ ...current, identifier:event.target.value }))} placeholder="E-mail, telefone ou CNPJ" autoComplete="username" /></label><label>Senha<input value={login.password} onChange={event => setLogin(current => ({ ...current, password:event.target.value }))} type="password" placeholder="••••••••" autoComplete="current-password" /></label><p className="auth-help">Use o e-mail confirmado ou telefone vinculado à sua conta.</p>{message && <p className="auth-message" role="status">{message}</p>}<button className="primary" disabled={busy} type="submit">{busy ? 'Entrando...' : 'Entrar →'}</button></form> : <form onSubmit={register}><div className="account-type"><button type="button" className={accountType === 'buyer' ? 'active' : ''} onClick={() => setAccountType('buyer')}><span>🛒</span><b>Sou comprador</b><small>Quero comprar peças</small></button><button type="button" className={accountType === 'seller' ? 'active' : ''} onClick={() => setAccountType('seller')}><span>🏪</span><b>Sou empresa / lojista</b><small>Quero vender peças</small></button></div><h2>{accountType === 'seller' ? 'Cadastro da empresa' : 'Cadastro do comprador'}</h2><div className="auth-fields"><label>Nome completo<input required name="fullName" value={form.fullName} onChange={change} placeholder="Seu nome" /></label>{accountType === 'seller' && <label>Razão social ou nome da loja<input required name="businessName" value={form.businessName} onChange={change} placeholder="Nome da empresa" /></label>}<label>E-mail<input required name="email" value={form.email} onChange={change} type="email" placeholder="voce@email.com" autoComplete="email" /></label><label>Telefone com DDD<input required name="phone" value={form.phone} onChange={change} type="tel" placeholder="(21) 99999-9999" autoComplete="tel" /></label>{accountType === 'seller' ? <><label>CNPJ<input required name="cnpj" value={form.cnpj} onChange={change} inputMode="numeric" placeholder="00.000.000/0000-00" /></label><label>Chave PIX<input required name="pixKey" value={form.pixKey} onChange={change} placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" /></label></> : <label>CPF<input required name="cpf" value={form.cpf} onChange={change} inputMode="numeric" placeholder="000.000.000-00" /></label>}<label>Senha<input required name="password" value={form.password} onChange={change} type="password" minLength="8" placeholder="Mínimo 8 caracteres" autoComplete="new-password" /></label><label>Confirmar senha<input required name="confirmPassword" value={form.confirmPassword} onChange={change} type="password" minLength="8" placeholder="Repita sua senha" autoComplete="new-password" /></label></div><label className="terms"><input required name="accepted" checked={form.accepted} onChange={change} type="checkbox" />Li e aceito os termos e a política de privacidade.</label><p className="auth-help">Após o cadastro, enviaremos um link para validar o seu e-mail. A conta só poderá comprar ou vender após essa confirmação.</p>{message && <p className="auth-message" role="status">{message}</p>}<button className="primary" disabled={busy} type="submit">{busy ? 'Criando cadastro...' : accountType === 'seller' ? 'Criar conta de lojista →' : 'Criar conta de comprador →'}</button></form>}</section></main>
}
