const makes = ['Fiat', 'Chevrolet', 'Volkswagen', 'Toyota']
const models = {
  Fiat: ['Argo'],
  Chevrolet: ['Prisma', 'Onix'],
  Volkswagen: ['Fusca', 'Gol', 'Golf'],
  Toyota: ['Corolla']
}
const years = Array.from({ length: 15 }, (_, index) => String(2010 + index))
const engines = ['1.0', '1.3', '1.4', '1.6', '1.8', '2.0', '3.5']

export default function VehicleFilter({ value, onChange }) {
  const update = (field, nextValue) => onChange(current => ({
    ...current,
    [field]: nextValue,
    ...(field === 'make' ? { model: '' } : {})
  }))
  const clear = () => onChange({ part: '', make: '', model: '', year: '', engine: '' })

  return (
    <section className="vehicle-filter" aria-label="Filtro de compatibilidade do veículo">
      <div className="vehicle-filter__heading">
        <div><small>ENCONTRE A PEÇA CERTA</small><h3>Compatibilidade do veículo</h3></div>
        <button type="button" onClick={clear}>Limpar filtros</button>
      </div>
      <div className="vehicle-filter__fields">
        <label>Nome da peça
          <input value={value.part} onChange={event => update('part', event.target.value)} placeholder="Ex.: amortecedor" />
        </label>
        <label>Montadora
          <select value={value.make} onChange={event => update('make', event.target.value)}>
            <option value="">Todas</option>{makes.map(make => <option key={make}>{make}</option>)}
          </select>
        </label>
        <label>Modelo do carro
          <select value={value.model} onChange={event => update('model', event.target.value)} disabled={!value.make}>
            <option value="">{value.make ? 'Todos' : 'Escolha a montadora'}</option>
            {(models[value.make] || []).map(model => <option key={model}>{model}</option>)}
          </select>
        </label>
        <label>Ano do carro
          <select value={value.year} onChange={event => update('year', event.target.value)}>
            <option value="">Todos</option>{years.map(year => <option key={year}>{year}</option>)}
          </select>
        </label>
        <label>Potência do motor
          <select value={value.engine} onChange={event => update('engine', event.target.value)}>
            <option value="">Todas</option>{engines.map(engine => <option key={engine}>{engine}</option>)}
          </select>
        </label>
        <button className="vehicle-filter__submit" type="button" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>Buscar peças</button>
      </div>
    </section>
  )
}
