export const products = [
  ['Amortecedor Dianteiro Premium','Suspensão','Para Toyota Corolla 2015–2022. Kit dianteiro completo.',289.9,349.9,'PROMOÇÃO',4.8,143,'🔩'],
  ['Pastilha de Freio Cerâmica','Freio','Freio traseiro de alta performance e baixo ruído.',145.5,180,'POPULAR',4.9,267,'🔴'],
  ['Alternador 80A Original','Elétrico','Para Volkswagen Golf — série completa 1.6 e 2.0.',456,520,'QUALIDADE',4.7,89,'⚡'],
  ['Radiador de Alumínio','Arrefecimento','Universal 330mm, alta performance.',567.8,650,'NOVO',4.9,134,'❄️'],
  ['Bateria 60Ah Premium','Energia','Selada, garantia de 36 meses.',389.9,450,'CONFIÁVEL',4.6,198,'🔋'],
  ['Disco de Freio Ventilado','Freio','330mm ventilado, dissipação superior.',234.9,280,'TOP',4.8,112,'⭕'],
  ['Óleo do Motor 5W-30','Lubrificantes','100% sintético, embalagem de 1 litro.',45.9,59.9,'PROMOÇÃO',4.9,567,'🛢️'],
  ['Filtro de Ar','Filtros','Filtro de ar do motor, encaixe universal.',89.9,110,'POPULAR',4.7,234,'🌬️'],
  ['Jogo de Velas Iridium','Ignição','Velas de alta performance, jogo com 4 unidades.',120,150,'QUALIDADE',4.8,178,'✨'],
  ['Correia Dentada Kit','Motor','Kit completo com tensor e correia.',450,520,'NOVO',4.6,95,'⚙️']
].map(([name,category,description,price,oldPrice,badge,rating,reviews,emoji], index) => ({ id:index + 1, name, category, description, price, oldPrice, badge, rating, reviews, emoji }))

export const categories = ['Todos', ...new Set(products.map(({ category }) => category))]
export const reviews = [
  { name:'Carlos M.', stars:5, date:'15/01/2025', text:'Produto excelente! Chegou em 2 dias, embalagem perfeita. Encaixou perfeitamente no meu Corolla.' },
  { name:'Ana L.', stars:5, date:'08/01/2025', text:'Melhor custo-benefício do mercado. Já comprei 3 vezes e sempre top!' },
  { name:'Roberto F.', stars:4, date:'02/01/2025', text:'Bom produto e entrega rápida. Só demorou um pouco mais que o esperado.' }
]
