import { useEffect, useRef, useState } from 'react'

const slides = [
  { badge:'🚀 Marketplace #1 do Brasil', title:<>As melhores peças para o <em>seu veículo</em></>, text:'Encontre peças originais e paralelas com entrega rápida, garantia e os melhores preços do mercado.', art:'⚙️', note:'MELHOR PREÇO', action:'Ver produtos' },
  { badge:'⚡ Ofertas especiais', title:<>Economize de verdade em cada <em>revisão</em></>, text:'Ofertas selecionadas para deixar a manutenção do seu carro mais leve para o seu bolso.', art:'🏷️', note:'ATÉ 30% OFF', action:'Ver ofertas' },
  { badge:'🛡️ Compra protegida', title:<>Confiança em cada <em>pedido</em></>, text:'Compre de vendedores verificados, conte com garantia e acompanhe a entrega do início ao fim.', art:'🛡️', note:'COMPRA SEGURA', action:'Comprar agora' }
]

export default function HeroSlider({ onCatalog, onSellers, onTrack }) {
  const [active, setActive] = useState(0); const touchStart = useRef(0)
  useEffect(() => { const timer = setInterval(() => setActive(i => (i + 1) % slides.length), 5500); return () => clearInterval(timer) }, [])
  const slide = slides[active]
  return <section className="hero" onTouchStart={e => { touchStart.current = e.touches[0].clientX }} onTouchEnd={e => { const distance = e.changedTouches[0].clientX - touchStart.current; if (Math.abs(distance) > 50) setActive(i => (i + (distance < 0 ? 1 : slides.length - 1)) % slides.length) }}>
    <div className="container hero-inner">
      <div className="hero-copy"><span className="pill">{slide.badge}</span><h1>{slide.title}</h1><p>{slide.text}</p><div className="actions"><button className="primary" onClick={onCatalog}>{slide.action}</button><button className="secondary" onClick={active === 2 ? onTrack : onSellers}>{active === 2 ? 'Rastrear pedido' : 'Ver vendedores'}</button></div><div className="stats"><div><b>{active === 1 ? '-30%' : '12k+'}</b><span>{active === 1 ? 'Economia' : 'Produtos'}</span></div><div><b>{active === 1 ? '500+' : '98%'}</b><span>{active === 1 ? 'Ofertas' : 'Satisfação'}</span></div><div><b>{active === 2 ? '12m' : '24h'}</b><span>{active === 2 ? 'Garantia' : 'Entrega'}</span></div></div></div>
      <div className="hero-art"><span>{slide.art}</span><strong>{slide.note}</strong></div>
    </div>
    <div className="hero-controls"><div className="dots">{slides.map((_, i) => <button key={i} className={i === active ? 'active' : ''} aria-label={`Slide ${i + 1}`} onClick={() => setActive(i)} />)}</div><div><button aria-label="Slide anterior" onClick={() => setActive(i => (i + slides.length - 1) % slides.length)}>‹</button><button aria-label="Próximo slide" onClick={() => setActive(i => (i + 1) % slides.length)}>›</button></div></div>
  </section>
}
