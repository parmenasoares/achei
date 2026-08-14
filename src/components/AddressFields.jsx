import { useEffect, useRef, useState } from 'react'

const onlyDigits = value => String(value || '').replace(/\D/g, '')
const defaultFields = {
  cep: 'cep',
  street: 'street',
  number: 'number',
  complement: 'complement',
  neighborhood: 'neighborhood',
  city: 'city',
  state: 'state',
}

const formatCep = value => {
  const digits = onlyDigits(value).slice(0, 8)
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
}

export default function AddressFields({
  title,
  description,
  value,
  onChange,
  compact = false,
  inline = false,
  className = 'form-grid',
  fields = defaultFields,
}) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const lastLookup = useRef('')
  const names = { ...defaultFields, ...fields }
  const getField = field => value[names[field]] || ''
  const setField = (field, fieldValue) => onChange({ ...value, [names[field]]: fieldValue })

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
        [names.cep]: formatCep(cep),
        [names.street]: data.logradouro || getField('street'),
        [names.neighborhood]: data.bairro || getField('neighborhood'),
        [names.city]: data.localidade || getField('city'),
        [names.state]: data.uf || getField('state'),
      })
      setMessage('Endereço preenchido automaticamente.')
    } catch {
      setMessage('Não foi possível consultar o CEP agora.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const cep = onlyDigits(getField('cep'))
    if (cep.length === 8) {
      void lookupCep(cep)
    } else {
      setMessage('')
      lastLookup.current = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value[names.cep]])

  const fieldsMarkup = (
    <>
      <label>
        CEP
        <div className="lookup-row">
          <input
            inputMode="numeric"
            placeholder="00000-000"
            value={getField('cep')}
            onChange={event => setField('cep', formatCep(event.target.value))}
          />
          <button type="button" className="secondary lookup-button" onClick={() => lookupCep(getField('cep'))}>
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
      </label>
      <label className="wide">
        Endereço
        <input
          placeholder="Rua, avenida, travessa..."
          value={getField('street')}
          onChange={event => setField('street', event.target.value)}
        />
      </label>
      <label>
        Número
        <input
          placeholder="123"
          value={getField('number')}
          onChange={event => setField('number', event.target.value)}
        />
      </label>
      <label>
        Complemento
        <input
          placeholder="Sala, bloco, apto..."
          value={getField('complement')}
          onChange={event => setField('complement', event.target.value)}
        />
      </label>
      <label>
        Bairro
        <input
          placeholder="Nome do bairro"
          value={getField('neighborhood')}
          onChange={event => setField('neighborhood', event.target.value)}
        />
      </label>
      <label>
        Cidade
        <input
          placeholder="Cidade"
          value={getField('city')}
          onChange={event => setField('city', event.target.value)}
        />
      </label>
      <label>
        Estado
        <input
          placeholder="UF"
          value={getField('state')}
          onChange={event => setField('state', event.target.value.toUpperCase().slice(0, 2))}
        />
      </label>
      {message && <small className="field-note wide">{message}</small>}
    </>
  )

  if (inline) return <div className={className}>{fieldsMarkup}</div>

  return (
    <article className={`form-card address-card${compact ? ' compact' : ''}`}>
      {title && <h3>{title}</h3>}
      {description && <p className="field-note">{description}</p>}
      <div className="form-grid">{fieldsMarkup}</div>
    </article>
  )
}
