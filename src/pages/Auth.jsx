import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import '../styles/auth-flow.css'

const categories = ['Injeção Eletrônica','GNV','Ar condicionado','Elétrica','Vidros para-brisas','Vidros de portas','Vidros traseiros','Suspensão','Insulfilm','Borrachas','Acessórios','Baterias','Pneus']
const cleanDigits = value => value.replace(/\D/g, '')
const toBrazilPhone = value => { const digits = cleanDigits(value); return digits.startsWith('55') ? `+${digits}` : `+55${digits}` }

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [accountType, setAccountType] = useState('buyer')
  const [sellerStep, setSellerStep] = useState(1)
  const [login, setLogin] = useState({ identifier:'', password:'' })
  const [form, setForm] = useState({ fullName:'', businessName:'', email:'', phone:'', cpf:'', cnpj:'', pixKey:'', password:'', confirmPassword:'', accepted:false, categories:[] })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : event.target.value }))
  const switchTab = value => { setTab(value); setMessage(''); setSellerStep(1) }
  const chooseType = type => { setAccountType(type); setSellerStep(1); setMessage('') }
  const toggleCategory = category => setForm(current => ({ ...current, categories:current.categories.includes(category) ? current.categories.filter(item => item !== category) : [...current.categories, category] }))

  const signIn = async event => {
    event.preventDefault()
    const identifier = login.identifier.trim()
    if (!identifier || !login.password) return setMessage('Informe seu e-mail ou telefone e a senha.')
    if (cleanDigits(identifier).length === 14 && !identifier.includes('@')) return setMessage('Por segurança, entre com o e-mail ou telefone vinculado à empresa. O login por CNPJ será ativado pelo serviço seguro do servidor.')
    setBusy(true)
    let user
    let error
    if (identifier.includes('@')) {
      const response = await supabase.auth.signInWithPassword({ email:identifier.toLowerCase(), password:login.password })
      user = response.data.user
      error = response.error
    } else {
      const response = await supabase.functions.invoke('sign-in-with-identifier', { body:{ identifier, password:login.password } })
      error = response.error
      if (!error && response.data?.access_token) {
        const session = await supabase.auth.setSession({ access_token:response.data.access_token, refresh_token:response.data.refresh_token })
        error = session.error
        user = session.data.user
      } else if (!error) error = new Error('Não foi possível iniciar a sessão.')
    }
    setBusy(false)
    if (error) return setMessage('Dados de acesso inválidos ou e-mail ainda não confirmado.')
    onLogin(user?.user_metadata?.account_type === 'seller' ? 'seller' : 'buyer')
  }

  const nextSellerStep = () => {
    if (sellerStep === 1 && (!form.fullName.trim() || !form.businessName.trim() || !form.email.trim() || cleanDigits(form.phone).length < 10 || cleanDigits(form.cnpj).length !== 14 || !form.pixKey.trim())) return setMessage('Preencha todos os dados da empresa antes de continuar.')
    if (sellerStep === 2 && !form.categories.length) return setMessage('Selecione pelo menos uma categoria de atuação.')
    setMessage('')
    setSellerStep(step => Math.min(3, step + 1))
  }

  const register = async event => {
    event.preventDefault()
    const document = accountType === 'seller' ? cleanDigits(form.cnpj) : cleanDigits(form.cpf)
    if (!form.fullName.trim() || !form.email.trim() || cleanDigits(form.phone).length < 10 || !document || !form.password) return setMessage('Preencha todos os campos obrigatórios.')
    if (accountType === 'seller' && (!form.businessName.trim() || !form.pixKey.trim() || !form.categories.length)) return setMessage('Informe os dados e pelo menos uma categoria de atuação.')
    if (accountType === 'buyer' && document.length !== 11) return setMessage('Informe um CPF com 11 números.')
    if (accountType === 'seller' && document.length !== 14) return setMessage('Informe um CNPJ com 14 números.')
    if (form.password.length < 8) return setMessage('A senha deve ter pelo menos 8 caracteres.')
    if (form.password !== form.confirmPassword) return setMessage('As senhas não coincidem.')
    if (!form.accepted) return setMessage('Aceite os termos para concluir seu cadastro.')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email:form.email.trim().toLowerCase(), password:form.password,
      options:{ emailRedirectTo:window.location.origin, data:{
        full_name:form.fullName.trim(), account_type:accountType, phone:toBrazilPhone(form.phone),
        cpf:accountType === 'buyer' ? document : null, cnpj:accountType === 'seller' ? document : null,
        business_name:accountType === 'seller' ? form.businessName.trim() : null,
        pix_key:accountType === 'seller' ? form.pixKey.trim() : null,
        business_categories:accountType === 'seller' ? form.categories : []
      }}
    })
    setBusy(false)
    if (error) return setMessage(error.message)
    if (!data.session) return setMessage('Cadastro recebido. Confira seu e-mail e confirme o acesso antes de comprar ou vender.')
    onLogin(accountType === 'seller' ? 'seller' : 'buyer')
  }

  const credentials = <><label>Senha<input required name="password" value={form.password} onChange={change} type="password" minLength="8" placeholder="Mínimo 8 caracteres" autoComplete="new-password" /></label><label>Confirmar senha<input required name="confirmPassword" value={form.confirmPassword} onChange={change} type="password" minLength="8" placeholder="Repita sua senha" autoComplete="new-password" /></label></>
  const sellerProgress = <div className="seller-progress" aria-label={`Etapa ${sellerStep} de 3`}>{['Dados da empresa','Categorias','Segurança'].map((label,index) => <div className={sellerStep >= index + 1 ? 'active' : ''} key={label}><b>{index + 1}</b><span>{label}</span></div>)}</div>

  return <main className="auth auth-flow"><section><div className="logo">🔥 ACHEI</div><p>Seu marketplace automotivo favorito</p><div className="tabs"><button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Entrar</button><button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>Cadastrar</button></div>{tab === 'login' ? <form onSubmit={signIn}><label>E-mail, telefone ou CNPJ<input value={login.identifier} onChange={event => setLogin(current => ({ ...current, identifier:event.target.value }))} placeholder="E-mail, telefone ou CNPJ" autoComplete="username" /></label><label>Senha<input value={login.password} onChange={event => setLogin(current => ({ ...current, password:event.target.value }))} type="password" placeholder="••••••••" autoComplete="current-password" /></label><p className="auth-help">Use o e-mail confirmado ou telefone vinculado à sua conta.</p>{message && <p className="auth-message" role="status">{message}</p>}<button className="primary" disabled={busy} type="submit">{busy ? 'Entrando...' : 'Entrar →'}</button></form> : <form onSubmit={register}><div className="account-type"><button type="button" className={accountType === 'buyer' ? 'active' : ''} onClick={() => chooseType('buyer')}><span>🛒</span><b>Sou comprador</b><small>Quero comprar peças</small></button><button type="button" className={accountType === 'seller' ? 'active' : ''} onClick={() => chooseType('seller')}><span>🏪</span><b>Sou empresa / lojista</b><small>Quero vender peças</small></button></div>{accountType === 'seller' ? <><h2>Cadastro da empresa</h2>{sellerProgress}<div className="step-panel" key={sellerStep}>{sellerStep === 1 && <div className="auth-fields"><label>Responsável pela conta<input required name="fullName" value={form.fullName} onChange={change} placeholder="Seu nome" /></label><label>Razão social ou nome da loja<input required name="businessName" value={form.businessName} onChange={change} placeholder="Nome da empresa" /></label><label>E-mail corporativo<input required name="email" value={form.email} onChange={change} type="email" placeholder="voce@empresa.com.br" /></label><label>Telefone com DDD<input required name="phone" value={form.phone} onChange={change} type="tel" placeholder="(21) 99999-9999" /></label><label>CNPJ<input required name="cnpj" value={form.cnpj} onChange={change} inputMode="numeric" placeholder="00.000.000/0000-00" /></label><label>Chave PIX<input required name="pixKey" value={form.pixKey} onChange={change} placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" /></label></div>}{sellerStep === 2 && <div className="category-picker"><p>Com o que a sua empresa trabalha?</p><small>Selecione uma ou mais categorias.</small><div>{categories.map(category => <button type="button" className={form.categories.includes(category) ? 'active' : ''} onClick={() => toggleCategory(category)} key={category}>{form.categories.includes(category) ? '✓ ' : ''}{category}</button>)}</div></div>}{sellerStep === 3 && <div className="auth-fields">{credentials}</div>}</div>{sellerStep === 3 && <><label className="terms"><input required name="accepted" checked={form.accepted} onChange={change} type="checkbox" />Li e aceito os termos e a política de privacidade.</label><p className="auth-help">Enviaremos um link para validar o seu e-mail. A empresa só poderá vender após essa confirmação.</p></>}{message && <p className="auth-message" role="status">{message}</p>}<div className="step-actions">{sellerStep > 1 && <button type="button" onClick={() => { setSellerStep(step => step - 1); setMessage('') }}>Voltar</button>}{sellerStep < 3 ? <button type="button" className="primary" onClick={nextSellerStep}>Continuar →</button> : <button className="primary" disabled={busy} type="submit">{busy ? 'Criando cadastro...' : 'Criar conta de lojista →'}</button>}</div></> : <><h2>Cadastro do comprador</h2><div className="auth-fields"><label>Nome completo<input required name="fullName" value={form.fullName} onChange={change} placeholder="Seu nome" /></label><label>E-mail<input required name="email" value={form.email} onChange={change} type="email" placeholder="voce@email.com" /></label><label>Telefone com DDD<input required name="phone" value={form.phone} onChange={change} type="tel" placeholder="(21) 99999-9999" /></label><label>CPF<input required name="cpf" value={form.cpf} onChange={change} inputMode="numeric" placeholder="000.000.000-00" /></label>{credentials}</div><label className="terms"><input required name="accepted" checked={form.accepted} onChange={change} type="checkbox" />Li e aceito os termos e a política de privacidade.</label><p className="auth-help">Após o cadastro, enviaremos um link para validar o seu e-mail. A conta só poderá comprar após essa confirmação.</p>{message && <p className="auth-message" role="status">{message}</p>}<button className="primary" disabled={busy} type="submit">{busy ? 'Criando cadastro...' : 'Criar conta de comprador →'}</button></>}</form>}</section></main>
}
