import { useState } from 'react'
import { supabase } from '../lib/supabase.js'

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

function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="password-wrap">
      <input
        value={value}
        onChange={onChange}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength="8"
        required
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

export default function ResetPassword({ onDone }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async event => {
    event.preventDefault()
    if (password.length < 8) return setMessage('A senha deve ter pelo menos 8 caracteres.')
    if (password !== confirm) return setMessage('As senhas não coincidem.')

    setBusy(true)
    const { error } = await supabase.auth.updateUser({ password })
    setBusy(false)

    if (error) return setMessage('Não foi possível redefinir a senha. O link pode ter expirado.')

    setDone(true)
    setTimeout(() => onDone(), 2000)
  }

  return (
    <main className="auth auth-flow">
      <section>
        <div className="logo">🔥 ACHEI</div>
        <h2 style={{ textAlign: 'center', margin: '0 0 4px' }}>Redefinir senha</h2>
        <p style={{ textAlign: 'center', fontSize: 13 }}>Escolha uma nova senha para sua conta</p>

        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
            <p style={{ fontWeight: 600 }}>Senha redefinida com sucesso!</p>
            <p style={{ fontSize: 13, color: 'var(--muted)' }}>Redirecionando...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--muted)', fontSize: 13 }}>
              Nova senha
              <PasswordInput
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                autoComplete="new-password"
              />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--muted)', fontSize: 13 }}>
              Confirmar nova senha
              <PasswordInput
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="Repita a nova senha"
                autoComplete="new-password"
              />
            </label>

            {/* Indicador de força */}
            {password.length > 0 && (
              <div style={{ fontSize: 12, color: password.length < 8 ? 'var(--red, #e5484d)' : password.length < 12 ? 'var(--yellow, #ffc93c)' : 'var(--green, #3fbf7f)' }}>
                {password.length < 8 ? '⚠️ Senha fraca' : password.length < 12 ? '🔒 Senha média' : '🔐 Senha forte'}
              </div>
            )}

            {message && <p className="auth-message" role="alert">{message}</p>}

            <button
              className="primary"
              type="submit"
              disabled={busy}
              style={{ padding: 13, borderRadius: 9 }}
            >
              {busy ? 'Salvando...' : 'Redefinir senha →'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
