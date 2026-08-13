const categoryIcons = {
  Todos: '✨',
  Suspensão: '🔩',
  Freio: '🛞',
  Elétrico: '⚡',
  Arrefecimento: '❄️',
  Energia: '🔋',
  Lubrificantes: '🛢️',
  Filtros: '🌬️',
  Ignição: '✨',
  Motor: '⚙️'
}

export default function CategoryRail({ categories, selected, onSelect }) {
  return (
    <section className="category-section" aria-labelledby="category-heading">
      <div className="container">
        <div className="category-heading">
          <div>
            <small>ENCONTRE MAIS RÁPIDO</small>
            <h2 id="category-heading">Compre por categoria</h2>
          </div>
          <span>Arraste para o lado →</span>
        </div>
        <div className="category-rail" role="list">
          {categories.map((category) => (
            <button
              className={category === selected ? 'category-tile active' : 'category-tile'}
              key={category}
              onClick={() => onSelect(category)}
              role="listitem"
            >
              <span className="category-icon">{categoryIcons[category] ?? '🔧'}</span>
              <span>{category}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
