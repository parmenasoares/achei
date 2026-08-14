import { useState } from 'react'
import { supabase } from '../lib/supabase.js'
import AddressFields from '../components/AddressFields.jsx'
import '../styles/auth-flow.css'

const categories = ['Injeção Eletrônica','GNV','Ar condicionado','Elétrica','Vidros para-brisas','Vidros de portas','Vidros traseiros','Suspensão','Insulfilm','Borrachas','Acessórios','Baterias','Pneus']
const cleanDigits = value => value.replace(/\D/g, '')
const formatCpf = value => cleanDigits(value).slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
const formatCnpj = value => cleanDigits(value).slice(0, 14).replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2')
const formatPhone = value => {
  const digits = cleanDigits(value).slice(0, 11)
  if (digits.length <= 2) return digits
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}
const formatCep = value => cleanDigits(value).slice(0, 8).replace(/^(\d{5})(\d)/, '$1-$2')
const isValidEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
const isValidPhone = value => {
  const digits = cleanDigits(value)
  return /^\d{10,11}$/.test(digits) && !/^(\d)\1+$/.test(digits)
}
const normalizeFieldValue = (name, value) => {
  if (name === 'cpf') return formatCpf(value)
  if (name === 'cnpj') return formatCnpj(value)
  if (name === 'phone') return formatPhone(value)
  if (name === 'storePostalCode') return formatCep(value)
  if (name === 'storeState') return value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2)
  return value
}
const toBrazilPhone = value => { const digits = cleanDigits(value); return digits.startsWith('55') ? `+${digits}` : `+55${digits}` }
const isValidCpf = value => {
  const digits = cleanDigits(value)
  if (!/^\d{11}$/.test(digits) || /^(\d)\1{10}$/.test(digits)) return false
  const digit = length => {
    const sum = digits.slice(0, length).split('').reduce((total, item, index) => total + Number(item) * (length + 1 - index), 0)
    const rest = (sum * 10) % 11
    return rest === 10 ? 0 : rest
  }
  return digit(9) === Number(digits[9]) && digit(10) === Number(digits[10])
}
const isValidCnpj = value => {
  const digits = cleanDigits(value)
  if (!/^\d{14}$/.test(digits) || /^(\d)\1{13}$/.test(digits)) return false
  const digit = weights => {
    const sum = weights.reduce((total, weight, index) => total + Number(digits[index]) * weight, 0)
    const rest = sum % 11
    return rest < 2 ? 0 : 11 - rest
  }
  return digit([5,4,3,2,9,8,7,6,5,4,3,2]) === Number(digits[12]) && digit([6,5,4,3,2,9,8,7,6,5,4,3,2]) === Number(digits[13])
}
const isValidPixKey = value => {
  const key = value.trim()
  const digits = cleanDigits(key)
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const evp = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  const phone = /^\+?55\d{10,11}$/.test(key.replace(/[\s()-]/g, '')) || /^\d{10,11}$/.test(digits)
  return isValidCpf(digits) || isValidCnpj(digits) || email.test(key) || evp.test(key) || phone
}

// Componente de input de senha com toggle de visibilidade
const EyeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

function PasswordInput({ value, onChange, placeholder, name, autoComplete }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-wrap">
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength="8"
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(v => !v)}
        aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        tabIndex={-1}
      >
        {visible ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  )
}

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [accountType, setAccountType] = useState('buyer')
  const [sellerStep, setSellerStep] = useState(1)
  const [login, setLogin] = useState({ identifier: '', password: '' })
  const [showLoginPass, setShowLoginPass] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [form, setForm] = useState({ fullName:'', businessName:'', email:'', phone:'', cpf:'', cnpj:'', pixKey:'', storePostalCode:'', storeAddress:'', storeNumber:'', storeComplement:'', storeNeighborhood:'', storeCity:'', storeState:'', password:'', confirmPassword:'', accepted:false, categories:[] })
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.type === 'checkbox' ? event.target.checked : normalizeFieldValue(event.target.name, event.target.value) }))
  const switchTab = value => { setTab(value); setMessage(''); setSellerStep(1); setForgotMode(false) }
  const chooseType = type => { setAccountType(type); setSellerStep(1); setMessage('') }
  const toggleCategory = category => setForm(current => ({ ...current, categories: current.categories.includes(category) ? current.categories.filter(item => item !== category) : [...current.categories, category] }))

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) setMessage('Não foi possível iniciar o login com Google.')
  }

  const signIn = async event => {
    event.preventDefault()
    const identifier = login.identifier.trim()
    if (!identifier || !login.password) return setMessage('Informe seu e-mail ou telefone e a senha.')
    if (cleanDigits(identifier).length === 14 && !identifier.includes('@')) return setMessage('Por segurança, entre com o e-mail ou telefone vinculado à empresa. O login por CNPJ será ativado pelo serviço seguro do servidor.')
    setBusy(true)
    let user
    let error
    if (identifier.includes('@')) {
      const response = await supabase.auth.signInWithPassword({ email: identifier.toLowerCase(), password: login.password })
      user = response.data.user
      error = response.error
    } else {
      const response = await supabase.functions.invoke('sign-in-with-identifier', { body: { identifier, password: login.password } })
      error = response.error
      if (!error && response.data?.access_token) {
        const session = await supabase.auth.setSession({ access_token: response.data.access_token, refresh_token: response.data.refresh_token })
        error = session.error
        user = session.data.user
      } else if (!error) error = new Error('Não foi possível iniciar a sessão.')
    }
    setBusy(false)
    if (error) return setMessage('Dados de acesso inválidos ou e-mail ainda não confirmado.')
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
    const role = profile?.role === 'admin' ? 'admin' : profile?.role === 'seller' ? 'seller' : 'buyer'
    onLogin(role)
  }

  const sendForgot = async event => {
    event.preventDefault()
    if (!isValidEmail(forgotEmail)) return setMessage('Informe um e-mail válido.')
    setBusy(true)
    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim().toLowerCase(), {
      redirectTo: `${window.location.origin}?reset=1`,
    })
    setBusy(false)
    if (error) return setMessage('Não foi possível enviar o e-mail. Tente novamente.')
    setForgotSent(true)
    setMessage('')
  }

  const nextSellerStep = () => {
    if (sellerStep === 1 && (!form.fullName.trim() || !form.businessName.trim() || !form.email.trim() || !form.phone.trim() || !form.cnpj.trim() || !form.pixKey.trim())) return setMessage('Preencha todos os dados da empresa antes de continuar.')
    if (sellerStep === 1 && !isValidEmail(form.email)) return setMessage('Informe um e-mail corporativo válido.')
    if (sellerStep === 1 && !isValidPhone(form.phone)) return setMessage('Informe um telefone válido com DDD.')
    if (sellerStep === 1 && !isValidCnpj(form.cnpj)) return setMessage('Informe um CNPJ válido.')
    if (sellerStep === 1 && !isValidPixKey(form.pixKey)) return setMessage('Informe uma chave PIX válida: CPF, CNPJ, e-mail, telefone ou chave aleatória.')
    if (sellerStep === 2 && (!cleanDigits(form.storePostalCode).match(/^\d{8}$/) || !form.storeAddress.trim() || !form.storeNumber.trim() || !form.storeNeighborhood.trim() || !form.storeCity.trim() || form.storeState.length !== 2)) return setMessage('Preencha o endereço completo da loja, incluindo CEP, cidade e UF.')
    if (sellerStep === 3 && !form.categories.length) return setMessage('Selecione pelo menos uma categoria de atuação.')
    setMessage('')
    setSellerStep(step => Math.min(4, step + 1))
  }

  const register = async event => {
    event.preventDefault()
    const document = accountType === 'seller' ? cleanDigits(form.cnpj) : cleanDigits(form.cpf)
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim() || !document || !form.password) return setMessage('Preencha todos os campos obrigatórios.')
    if (!isValidEmail(form.email)) return setMessage('Informe um e-mail válido.')
    if (!isValidPhone(form.phone)) return setMessage('Informe um telefone válido com DDD.')
    if (accountType === 'seller' && (!form.businessName.trim() || !form.pixKey.trim() || !form.storeAddress.trim() || !form.storeCity.trim() || !form.storeState.trim() || !form.categories.length)) return setMessage('Informe os dados da empresa, endereço e pelo menos uma categoria de atuação.')
    if (accountType === 'buyer' && !isValidCpf(document)) return setMessage('Informe um CPF válido.')
    if (accountType === 'seller' && !isValidCnpj(document)) return setMessage('Informe um CNPJ válido.')
    if (accountType === 'seller' && !isValidPixKey(form.pixKey)) return setMessage('Informe uma chave PIX válida: CPF, CNPJ, e-mail, telefone ou chave aleatória.')
    if (form.password.length < 8) return setMessage('A senha deve ter pelo menos 8 caracteres.')
    if (form.password !== form.confirmPassword) return setMessage('As senhas não coincidem.')
    if (!form.accepted) return setMessage('Aceite os termos para concluir seu cadastro.')
    setBusy(true)
    const { data, error } = await supabase.auth.signUp({
      email: form.email.trim().toLowerCase(), password: form.password,
      options: {
        emailRedirectTo: window.location.origin, data: {
          full_name: form.fullName.trim(), account_type: accountType, phone: toBrazilPhone(form.phone),
          cpf: accountType === 'buyer' ? document : null, cnpj: accountType === 'seller' ? document : null,
          business_name: accountType === 'seller' ? form.businessName.trim() : null,
          pix_key: accountType === 'seller' ? form.pixKey.trim() : null,
          store_postal_code: accountType === 'seller' ? cleanDigits(form.storePostalCode) : null,
          store_address: accountType === 'seller' ? form.storeAddress.trim() : null,
          store_number: accountType === 'seller' ? form.storeNumber.trim() : null,
          store_complement: accountType === 'seller' ? form.storeComplement.trim() : null,
          store_neighborhood: accountType === 'seller' ? form.storeNeighborhood.trim() : null,
          store_city: accountType === 'seller' ? form.storeCity.trim() : null,
          store_state: accountType === 'seller' ? form.storeState.trim().toUpperCase() : null,
          business_categories: accountType === 'seller' ? form.categories : []
        }
      }
    })
    setBusy(false)
    if (error) return setMessage(error.message)
    if (!data.session) return setMessage('Cadastro recebido. Confira seu e-mail e confirme o acesso antes de comprar ou vender.')
    onLogin(accountType === 'seller' ? 'seller' : 'buyer')
  }

  const credentials = (
    <>
      <label>
        Senha
        <PasswordInput name="password" value={form.password} onChange={change} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
      </label>
      <label>
        Confirmar senha
        <PasswordInput name="confirmPassword" value={form.confirmPassword} onChange={change} placeholder="Repita sua senha" autoComplete="new-password" />
      </label>
    </>
  )

  const sellerProgress = (
    <div className="seller-progress" aria-label={`Etapa ${sellerStep} de 4`}>
      {['Dados da empresa', 'Endereço', 'Categorias', 'Segurança'].map((label, index) => (
        <div className={sellerStep >= index + 1 ? 'active' : ''} key={label}>
          <b>{index + 1}</b><span>{label}</span>
        </div>
      ))}
    </div>
  )

  const storeAddressFields = { cep: 'storePostalCode', street: 'storeAddress', number: 'storeNumber', complement: 'storeComplement', neighborhood: 'storeNeighborhood', city: 'storeCity', state: 'storeState' }

  // Tela de esqueci a senha
  if (forgotMode) {
    return (
      <main className="auth auth-flow">
        <section>
          <div className="logo">🔥 ACHEI</div>
          <h2>Recuperar senha</h2>
          {forgotSent ? (
            <>
              <p className="auth-help">✅ Enviamos um link de recuperação para <strong>{forgotEmail}</strong>. Verifique sua caixa de entrada e spam.</p>
              <button className="primary" style={{ marginTop: 16 }} onClick={() => { setForgotMode(false); setForgotSent(false); setForgotEmail('') }}>Voltar para o login</button>
            </>
          ) : (
            <form onSubmit={sendForgot}>
              <p className="auth-help">Informe o e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>
              <label>
                E-mail
                <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="voce@email.com" autoComplete="email" required />
              </label>
              {message && <p className="auth-message" role="status">{message}</p>}
              <button className="primary" disabled={busy} type="submit">{busy ? 'Enviando...' : 'Enviar link de recuperação'}</button>
              <button type="button" className="secondary" style={{ marginTop: 10 }} onClick={() => { setForgotMode(false); setMessage('') }}>Voltar</button>
            </form>
          )}
        </section>
      </main>
    )
  }

  return (
    <main className="auth auth-flow">
      <section>
        <div className="logo">🔥 ACHEI</div>
        <p>Seu marketplace automotivo favorito</p>
        <div className="tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => switchTab('login')}>Entrar</button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => switchTab('register')}>Cadastrar</button>
        </div>

        {tab === 'login' ? (
          <>
            <button type="button" className="social google-btn" onClick={signInWithGoogle}>
              <svg width="18" height="18" viewBox="0 0 48 48" style={{flexShrink:0}}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                <path fill="none" d="M0 0h48v48H0z"/>
              </svg>
              Continuar com Google
            </button>
            <div className="auth-divider"><span>ou</span></div>
            <form onSubmit={signIn}>
              <label>
                E-mail, telefone ou CNPJ
              <input value={login.identifier} onChange={event => setLogin(current => ({ ...current, identifier: event.target.value }))} placeholder="E-mail, telefone ou CNPJ" autoComplete="username" />
            </label>
            <label>
              Senha
              <div className="password-wrap">
                <input
                  value={login.password}
                  onChange={event => setLogin(current => ({ ...current, password: event.target.value }))}
                  type={showLoginPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowLoginPass(v => !v)}
                  aria-label={showLoginPass ? 'Ocultar senha' : 'Mostrar senha'}
                  tabIndex={-1}
                >
                  {showLoginPass ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </label>
            <p className="auth-help">Use o e-mail confirmado ou telefone vinculado à sua conta.</p>
            <button
              type="button"
              className="forgot-link"
              onClick={() => { setForgotMode(true); setMessage('') }}
            >
              Esqueci minha senha
            </button>
            {message && <p className="auth-message" role="status">{message}</p>}
            <button className="primary" disabled={busy} type="submit">{busy ? 'Entrando...' : 'Entrar →'}</button>
          </form>
          </>
        ) : (
          <form onSubmit={register}>
            <div className="account-type">
              <button type="button" className={accountType === 'buyer' ? 'active' : ''} onClick={() => chooseType('buyer')}><span>🛒</span><b>Sou comprador</b><small>Quero comprar peças</small></button>
              <button type="button" className={accountType === 'seller' ? 'active' : ''} onClick={() => chooseType('seller')}><span>🏪</span><b>Sou empresa / lojista</b><small>Quero vender peças</small></button>
            </div>
            {accountType === 'seller' ? (
              <>
                <h2>Cadastro da empresa</h2>
                {sellerProgress}
                <div className="step-panel" key={sellerStep}>
                  {sellerStep === 1 && <div className="auth-fields"><label>Responsável pela conta<input required name="fullName" value={form.fullName} onChange={change} placeholder="Seu nome" /></label><label>Razão social ou nome da loja<input required name="businessName" value={form.businessName} onChange={change} placeholder="Nome da empresa" /></label><label>E-mail corporativo<input required name="email" value={form.email} onChange={change} type="email" placeholder="voce@empresa.com.br" /></label><label>Telefone com DDD<input required name="phone" value={form.phone} onChange={change} type="tel" placeholder="(21) 99999-9999" /></label><label>CNPJ<input required name="cnpj" value={form.cnpj} onChange={change} inputMode="numeric" placeholder="00.000.000/0000-00" /></label><label>Chave PIX<input required name="pixKey" value={form.pixKey} onChange={change} placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória" /></label></div>}
                  {sellerStep === 2 && <AddressFields inline className="auth-fields store-address-fields" value={form} onChange={setForm} fields={storeAddressFields} />}
                  {sellerStep === 3 && <div className="category-picker"><p>Com o que a sua empresa trabalha?</p><small>Selecione uma ou mais categorias.</small><div>{categories.map(category => <button type="button" className={form.categories.includes(category) ? 'active' : ''} onClick={() => toggleCategory(category)} key={category}>{form.categories.includes(category) ? '✓ ' : ''}{category}</button>)}</div></div>}
                  {sellerStep === 4 && <div className="auth-fields">{credentials}</div>}
                </div>
                {sellerStep === 4 && <><label className="terms"><input required name="accepted" checked={form.accepted} onChange={change} type="checkbox" />Li e aceito os termos e a política de privacidade.</label><p className="auth-help">Enviaremos um link para validar o seu e-mail. A empresa só poderá vender após essa confirmação.</p></>}
                {message && <p className="auth-message" role="status">{message}</p>}
                <div className="step-actions">
                  {sellerStep > 1 && <button type="button" onClick={() => { setSellerStep(step => step - 1); setMessage('') }}>Voltar</button>}
                  {sellerStep < 4 ? <button type="button" className="primary" onClick={nextSellerStep}>Continuar →</button> : <button className="primary" disabled={busy} type="submit">{busy ? 'Criando cadastro...' : 'Criar conta de lojista →'}</button>}
                </div>
              </>
            ) : (
              <>
                <h2>Cadastro do comprador</h2>
                <div className="auth-fields">
                  <label>Nome completo<input required name="fullName" value={form.fullName} onChange={change} placeholder="Seu nome" /></label>
                  <label>E-mail<input required name="email" value={form.email} onChange={change} type="email" placeholder="voce@email.com" /></label>
                  <label>Telefone com DDD<input required name="phone" value={form.phone} onChange={change} type="tel" placeholder="(21) 99999-9999" /></label>
                  <label>CPF<input required name="cpf" value={form.cpf} onChange={change} inputMode="numeric" placeholder="000.000.000-00" /></label>
                  {credentials}
                </div>
                <label className="terms"><input required name="accepted" checked={form.accepted} onChange={change} type="checkbox" />Li e aceito os termos e a política de privacidade.</label>
                <p className="auth-help">Após o cadastro, enviaremos um link para validar o seu e-mail. A conta só poderá comprar após essa confirmação.</p>
                {message && <p className="auth-message" role="status">{message}</p>}
                <button className="primary" disabled={busy} type="submit">{busy ? 'Criando cadastro...' : 'Criar conta de comprador →'}</button>
              </>
            )}
          </form>
        )}
      </section>
    </main>
  )
}

