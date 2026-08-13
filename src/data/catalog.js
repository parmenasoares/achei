const fitments = [
  { make: 'Toyota', model: 'Corolla', years: ['2015','2016','2017','2018','2019','2020','2021','2022'], engines: ['1.8','2.0'] },
  { make: 'Chevrolet', model: 'Prisma', years: ['2013','2014','2015','2016','2017','2018','2019'], engines: ['1.0','1.4'] },
  { make: 'Volkswagen', model: 'Golf', years: ['2014','2015','2016','2017','2018','2019'], engines: ['1.6','2.0'] },
  { make: 'Fiat', model: 'Argo', years: ['2017','2018','2019','2020','2021','2022','2023','2024'], engines: ['1.0','1.3'] },
  { make: 'Fiat', model: 'Argo', years: ['2017','2018','2019','2020','2021','2022','2023','2024'], engines: ['1.0','1.3'] },
  { make: 'Chevrolet', model: 'Onix', years: ['2013','2014','2015','2016','2017','2018','2019','2020'], engines: ['1.0','1.4'] },
  { make: 'Volkswagen', model: 'Fusca', years: ['2013','2014','2015','2016','2017','2018','2019'], engines: ['2.0'] },
  { make: 'Fiat', model: 'Argo', years: ['2017','2018','2019','2020','2021','2022','2023','2024'], engines: ['1.0','1.3'] },
  { make: 'Chevrolet', model: 'Prisma', years: ['2013','2014','2015','2016','2017','2018','2019'], engines: ['1.0','1.4'] },
  { make: 'Volkswagen', model: 'Gol', years: ['2013','2014','2015','2016','2017','2018','2019','2020'], engines: ['1.0','1.6'] }
]

const categoryEmoji = { Suspensão: '🔩', Freio: '🛞', Elétrico: '⚡', Arrefecimento: '❄️', Energia: '🔋', Lubrificantes: '🛢️', Filtros: '🌬️', Ignição: '✨', Motor: '⚙️' }

export const products = [
  ['Amortecedor Dianteiro Premium','Suspensão','Para Toyota Corolla 2015–2022. Kit dianteiro completo.',289.9,349.9,'PROMOÇÃO',4.8,143,'https://storage.googleapis.com/gpracing/catalog/341372.jpg'],
  ['Pastilha de Freio Cerâmica','Freio','Freio traseiro de alta performance e baixo ruído.',145.5,180,'POPULAR',4.9,267,'https://www.autohausaz.com/images/SP1178.jpg'],
  ['Alternador 80A Original','Elétrico','Para Volkswagen Golf — série completa 1.6 e 2.0.',456,520,'QUALIDADE',4.7,89,'https://productimages.biltema.com/v1/image/app/imagebyfilename/63-620_xl_1.jpg'],
  ['Radiador de Alumínio','Arrefecimento','Universal 330mm, alta performance.',567.8,650,'NOVO',4.9,134,'https://i5.walmartimages.com/asr/27c57ce2-a332-41f9-9472-dc2c6d9e61c2.f85f41f0031fc06f058e69f21229be8c.jpeg'],
  ['Bateria 60Ah Premium','Energia','Selada, garantia de 36 meses.',389.9,450,'CONFIÁVEL',4.6,198,'https://www.sosbatteriesdom.com/340-large_default/batterie-reconditionnee-70ah.jpg'],
  ['Disco de Freio Ventilado','Freio','330mm ventilado, dissipação superior.',234.9,280,'TOP',4.8,112,'https://media.autodoc.de/360_photos/454352/h-preview.jpg'],
  ['Óleo do Motor 5W-30','Lubrificantes','100% sintético, embalagem de 1 litro.',45.9,59.9,'PROMOÇÃO',4.9,567,'https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=900&q=85&sat=-40'],
  ['Filtro de Ar','Filtros','Filtro de ar do motor, encaixe universal.',89.9,110,'POPULAR',4.7,234,'https://static.summitracing.com/global/images/prod/xlarge/bch-5012ws_xl.jpg'],
  ['Jogo de Velas Iridium','Ignição','Velas de alta performance, jogo com 4 unidades.',120,150,'QUALIDADE',4.8,178,'https://www.karacanstore.com/img/products/m50-buji-0edbff1.jpg'],
  ['Correia Dentada Kit','Motor','Kit completo com tensor e correia.',450,520,'NOVO',4.6,95,'https://i.ebayimg.com/images/g/NFAAAOSwIY5hhGjd/s-l1200.jpg']
].map(([name,category,description,price,oldPrice,badge,rating,reviews,image], index) => ({ id:index + 1, name, category, description, price, oldPrice, badge, rating, reviews, image, emoji: categoryEmoji[category], fitment: fitments[index] }))

export const categories = ['Todos', ...new Set(products.map(({ category }) => category))]
export const reviews = [
  { name:'Carlos M.', stars:5, date:'15/01/2025', text:'Produto excelente! Chegou em 2 dias, embalagem perfeita. Encaixou perfeitamente no meu Corolla.' },
  { name:'Ana L.', stars:5, date:'08/01/2025', text:'Melhor custo-benefício do mercado. Já comprei 3 vezes e sempre top!' },
  { name:'Roberto F.', stars:4, date:'02/01/2025', text:'Bom produto e entrega rápida. Só demorou um pouco mais que o esperado.' }
]
