import { useMemo, useState } from 'react'
import AddressFields from '../components/AddressFields.jsx'

const initialRegister = {
  name: '',
  email: '',
  phone: '',
  cpf: '',
  company: '',
  cnpj: '',
  pix: '',
  password: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
}

export default function Auth({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [role, setRole] = useState('buyer')
  const [register, setRegister] = useState(initialRegister)

  const roleTitle = useMemo(
    () => (role === 'seller' ? 'Sou empresa / lojista' : 'Sou comprador'),
    [role],
  )

  return (
    <main className="auth">
      <section>
        <div className="logo">🔥 ACHEII</div>
        <p>Seu marketplace automotivo favorito</p>

        <div className="tabs">
          <button className={tab === 'login' ? 'active' : ''} onClick={() => setTab('login')} type="button">
            Entrar
          </button>
          <button className={tab === 'register' ? 'active' : ''} onClick={() => setTab('register')} type="button">
            Cadastrar
          </button>
        </div>

        {tab === 'login' ? (
          <>
            <label>
              E-mail, telefone ou CNPJ
              <input placeholder="seu@email.com" />
            </label>
            <label>
              Senha
              <input type="password" placeholder="••••••••" />
            </label>
            <button className="primary" onClick={onLogin} type="button">
              Entrar →
            </button>
          </>
        ) : (
          <>
            <div className="role-switch">
              <button className={role === 'buyer' ? 'active' : ''} onClick={() => setRole('buyer')} type="button">
                Sou comprador
              </button>
              <button className={role === 'seller' ? 'active' : ''} onClick={() => setRole('seller')} type="button">
                Sou empresa / lojista
              </button>
            </div>

            <small className="field-note">{roleTitle}</small>

            {role === 'seller' ? (
              <>
                <label>
                  Nome da empresa
                  <input
                    value={register.company}
                    onChange={event => setRegister({ ...register, company: event.target.value })}
                    placeholder="Razão social ou nome fantasia"
                  />
                </label>
                <label>
                  E-mail
                  <input
                    type="email"
                    value={register.email}
                    onChange={event => setRegister({ ...register, email: event.target.value })}
                    placeholder="contato@empresa.com.br"
                  />
                </label>
                <label>
                  Telefone
                  <input
                    value={register.phone}
                    onChange={event => setRegister({ ...register, phone: event.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </label>
                <label>
                  CNPJ
                  <input
                    value={register.cnpj}
                    onChange={event => setRegister({ ...register, cnpj: event.target.value })}
                    placeholder="00.000.000/0000-00"
                  />
                </label>
                <label>
                  Chave PIX
                  <input
                    value={register.pix}
                    onChange={event => setRegister({ ...register, pix: event.target.value })}
                    placeholder="CPF, CNPJ, e-mail, telefone ou chave aleatória"
                  />
                </label>
                <AddressFields
                  compact
                  title="Endereço da loja"
                  description="Preencha o CEP para o endereço ser trazido automaticamente."
                  value={register}
                  onChange={setRegister}
                />
              </>
            ) : (
              <>
                <label>
                  Nome completo
                  <input
                    value={register.name}
                    onChange={event => setRegister({ ...register, name: event.target.value })}
                    placeholder="Seu nome"
                  />
                </label>
                <label>
                  E-mail
                  <input
                    type="email"
                    value={register.email}
                    onChange={event => setRegister({ ...register, email: event.target.value })}
                    placeholder="seu@email.com"
                  />
                </label>
                <label>
                  Telefone
                  <input
                    value={register.phone}
                    onChange={event => setRegister({ ...register, phone: event.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </label>
                <label>
                  CPF
                  <input
                    value={register.cpf}
                    onChange={event => setRegister({ ...register, cpf: event.target.value })}
                    placeholder="000.000.000-00"
                  />
                </label>
              </>
            )}

            <label>
              Senha
              <input
                type="password"
                value={register.password}
                onChange={event => setRegister({ ...register, password: event.target.value })}
                placeholder="Mínimo 8 caracteres"
              />
            </label>

            <button className="primary" onClick={onLogin} type="button">
              Criar conta →
            </button>
          </>
        )}
      </section>
    </main>
  )
}
