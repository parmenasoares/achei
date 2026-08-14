import { useEffect, useRef, useState } from 'react'

const onlyDigits = value => value.replace(/\D/g, '')

const formatCep = value => {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export default function AddressFields({ title, description, value, onChange, compact = false }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const lastLookup = useRef('')

  const setField = (field, fieldValue) => onChange({ ...value, [field]: fieldValue })

  const lookupCep = async cepValue => {
    const cep = onlyDigits(cepValue)

    if (cep.length !== 8) {
      setMessage('Digite um CEP com 8 números.')
      return
    }

    if (lastLookup.current === cep) return

    lastLookup.current = cep
    setLoading(true)
    setMessage('Buscando endereço...')

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setMessage('CEP não encontrado.')
        return
      }

      onChange({
        ...value,
        cep: formatCep(cep),
        street: data.logradouro || value.street || '',
        neighborhood: data.bairro || value.neighborhood || '',
        city: data.localidade || value.city || '',
        state: data.uf || value.state || '',
      })
      setMessage('Endereço preenchido automaticamente.')
    } catch {
      setMessage('Não foi possível consultar o CEP agora.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cep = onlyDigits(value.cep || '')
    if (cep.length === 8) {
      void lookupCep(cep)
    } else {
      setMessage('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.cep])

  return (
    <article className={`form-card address-card${compact ? ' compact' : ''}`}>
      {title && <h3>{title}</h3>}
      {description && <p className="field-note">{description}</p>}
      <div className="form-grid">
        <label>
          CEP
          <div className="lookup-row">
            <input
              inputMode="numeric"
              placeholder="00000-000"
              value={value.cep || ''}
              onChange={event => setField('cep', formatCep(event.target.value))}
            />
            <button type="button" className="secondary lookup-button" onClick={() => lookupCep(value.cep)}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </div>
        </label>
        <label className="wide">
          Endereço
          <input
            placeholder="Rua, avenida, travessa..."
            value={value.street || ''}
            onChange={event => setField('street', event.target.value)}
          />
        </label>
        <label>
          Número
          <input
            placeholder="123"
            value={value.number || ''}
            onChange={event => setField('number', event.target.value)}
          />
        </label>
        <label>
          Complemento
          <input
            placeholder="Sala, bloco, apto..."
            value={value.complement || ''}
            onChange={event => setField('complement', event.target.value)}
          />
        </label>
        <label>
          Bairro
          <input
            placeholder="Nome do bairro"
            value={value.neighborhood || ''}
            onChange={event => setField('neighborhood', event.target.value)}
          />
        </label>
        <label>
          Cidade
          <input
            placeholder="Cidade"
            value={value.city || ''}
            onChange={event => setField('city', event.target.value)}
          />
        </label>
        <label>
          Estado
          <input
            placeholder="UF"
            value={value.state || ''}
            onChange={event => setField('state', event.target.value.toUpperCase().slice(0, 2))}
          />
        </label>
      </div>
      {message && <small className="field-note">{message}</small>}
    </article>
  )
}
