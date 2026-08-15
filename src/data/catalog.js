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
  { make: 'Volkswagen', model: 'Gol', years: ['2013','2014','2015','2016','2017','2018','2019','2020'], engines: ['1.0','1.6'] },
  { make: 'Fiat', model: 'Uno', years: ['2010','2011','2012','2013','2014','2015','2016'], engines: ['1.0','1.4'] },
  { make: 'Chevrolet', model: 'Corsa', years: ['2009','2010','2011','2012'], engines: ['1.0','1.4','1.8'] },
  { make: 'Volkswagen', model: 'Polo', years: ['2018','2019','2020','2021','2022','2023','2024'], engines: ['1.0','1.6'] },
  { make: 'Honda', model: 'Civic', years: ['2012','2013','2014','2015','2016'], engines: ['1.8','2.0'] },
  { make: 'Toyota', model: 'Etios', years: ['2013','2014','2015','2016','2017','2018','2019','2020'], engines: ['1.3','1.5'] },
  { make: 'Renault', model: 'Kwid', years: ['2017','2018','2019','2020','2021','2022','2023','2024'], engines: ['1.0'] },
  { make: 'Hyundai', model: 'HB20', years: ['2013','2014','2015','2016','2017','2018','2019','2020'], engines: ['1.0','1.6'] },
  { make: 'Jeep', model: 'Renegade', years: ['2015','2016','2017','2018','2019','2020','2021','2022'], engines: ['1.8','2.0'] },
  { make: 'Ford', model: 'Ka', years: ['2015','2016','2017','2018','2019','2020'], engines: ['1.0','1.5'] },
  { make: 'Nissan', model: 'Versa', years: ['2012','2013','2014','2015','2016','2017','2018','2019'], engines: ['1.0','1.6'] }
]

export const stores = [
  { id: 'premium-sp', name: 'AutoPeças Premium SP', rating: '4.9', sales: '2.3k', response: '24h', specialty: 'Suspensão e freios', icon: '🏪', verified: true },
  { id: 'motor-brasil', name: 'Motor Brasil Peças', rating: '4.8', sales: '1.8k', response: '2h', specialty: 'Motor e injeção', icon: '⚙️', verified: true },
  { id: 'eletrica-rapida', name: 'Elétrica Rápida Auto', rating: '4.7', sales: '950', response: '1h', specialty: 'Baterias e elétrica', icon: '⚡', verified: true },
  { id: 'auto-centro', name: 'Auto Centro Nacional', rating: '4.8', sales: '1.2k', response: '3h', specialty: 'Peças multimarcas', icon: '🔧', verified: true }
]

const categoryEmoji = { Suspensão: '🔩', Freio: '🛞', Elétrico: '⚡', Arrefecimento: '❄️', Energia: '🔋', Lubrificantes: '🛢️', Filtros: '🌬️', Ignição: '✨', Motor: '⚙️', Transmissão: '⚙️', Combustível: '⛽', Direção: '🧭', Iluminação: '💡', Vedação: '🔧' }

export const products = [
  ['Amortecedor Dianteiro Premium','Suspensão','Para Toyota Corolla 2015–2022. Kit dianteiro completo.',289.9,349.9,'PROMOÇÃO',4.8,143,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Pastilha de Freio Cerâmica','Freio','Freio traseiro de alta performance e baixo ruído.',145.5,180,'POPULAR',4.9,267,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Alternador 80A Original','Elétrico','Para Volkswagen Golf — série completa 1.6 e 2.0.',456,520,'QUALIDADE',4.7,89,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Radiador de Alumínio','Arrefecimento','Universal 330mm, alta performance.',567.8,650,'NOVO',4.9,134,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Bateria 60Ah Premium','Energia','Selada, garantia de 36 meses.',389.9,450,'CONFIÁVEL',4.6,198,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Disco de Freio Ventilado','Freio','330mm ventilado, dissipação superior.',234.9,280,'TOP',4.8,112,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Óleo do Motor 5W-30','Lubrificantes','100% sintético, embalagem de 1 litro.',45.9,59.9,'PROMOÇÃO',4.9,567,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Filtro de Ar','Filtros','Filtro de ar do motor, encaixe universal.',89.9,110,'POPULAR',4.7,234,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Jogo de Velas Iridium','Ignição','Velas de alta performance, jogo com 4 unidades.',120,150,'QUALIDADE',4.8,178,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Correia Dentada Kit','Motor','Kit completo com tensor e correia.',450,520,'NOVO',4.6,95,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Kit de Embreagem Completo','Transmissão','Disco, platô e rolamento para Fiat Uno.',639.9,720,'NOVO',4.8,76,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Bomba de Combustível Flex','Combustível','Módulo completo com boia e vedação.',318.5,370,'POPULAR',4.7,121,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Sensor ABS Dianteiro','Elétrico','Sensor de rotação da roda com conector.',159.9,190,'QUALIDADE',4.8,64,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Coxim do Motor Hidráulico','Motor','Reduz vibrações e ruídos do motor.',249.9,295,'TOP',4.6,92,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Filtro de Combustível','Filtros','Filtragem eficiente para sistema de injeção.',52.9,69.9,'PROMOÇÃO',4.8,205,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Par de Faróis Principais','Iluminação','Lente cristal e encaixe original.',699.9,790,'NOVO',4.7,58,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Bieleta Dianteira Reforçada','Suspensão','Estabilizador com alta resistência.',79.9,99.9,'POPULAR',4.9,183,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Junta do Cabeçote','Vedação','Kit para reparo completo do cabeçote.',189.9,230,'QUALIDADE',4.6,44,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Terminal de Direção','Direção','Terminal externo com porca e trava.',119.9,150,'TOP',4.8,109,'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&q=80'],
  ['Kit Cabos de Ignição','Ignição','Jogo completo com 4 cabos de alta tensão.',139.9,175,'PROMOÇÃO',4.7,87,'https://images.unsplash.com/photo-1597766353939-3b8b41f11ef3?w=600&q=80']
].map(([name,category,description,price,oldPrice,badge,rating,reviews,image], index) => ({ id:index + 1, name, category, description, price, oldPrice, badge, rating, reviews, image, emoji: categoryEmoji[category], fitment: fitments[index], sellerId: stores[index % stores.length].id }))

export const categories = ['Todos', ...new Set(products.map(({ category }) => category))]
export const reviews = [
  { name:'Carlos M.', stars:5, date:'15/01/2025', text:'Produto excelente! Chegou em 2 dias, embalagem perfeita. Encaixou perfeitamente no meu Corolla.' },
  { name:'Ana L.', stars:5, date:'08/01/2025', text:'Melhor custo-benefício do mercado. Já comprei 3 vezes e sempre top!' },
  { name:'Roberto F.', stars:4, date:'02/01/2025', text:'Bom produto e entrega rápida. Só demorou um pouco mais que o esperado.' }
]
