import { useState } from 'react'

const partners = [
  { name: 'Auto Peças Premium', mark: 'AP', text: 'Frete rápido e peças verificadas' },
  { name: 'Motor Brasil', mark: 'MB', text: 'Especialista em motor e freios' },
  { name: 'Elétrica Rápida', mark: 'ER', text: 'Linha elétrica com garantia' },
  { name: 'Auto Centro', mark: 'AC', text: 'Manutenção para nacionais' }
]

const css = `
.partner-carousel{padding:28px 0 42px}
.partner-carousel__top{display:flex;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px;flex-wrap:wrap}
.partner-carousel small,.home-intro small,.search-page__hero small{color:#ff5a1f;font-weight:800;letter-spacing:.8px;font-size:10px}
.partner-carousel h2,.home-intro h2,.search-page__hero h1{margin:5px 0;font:700 clamp(22px,4vw,39px) Oswald,sans-serif}
.partner-tabs{display:flex;gap:7px}
.partner-tabs button{border:1px solid #343843;border-radius:999px;background:#20232b;color:#a5aaba;padding:8px 11px;font-weight:700;font-size:12px}
.partner-tabs button.active{background:#ff5a1f;color:#fff;border-color:#ff5a1f}

/* ── Grid base: 3 colunas desktop ── */
.partner-rail{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:16px;
  padding:2px 1px;
}

/* Cards */
.promo-card,.partner-card{
  min-width:0;width:100%;
  border:1px solid #343843;border-radius:14px;overflow:hidden;
  background:#1a1c21;color:#f6f7fb;text-align:left;
  cursor:pointer;
  transition:border-color .2s,transform .2s;
  display:flex;flex-direction:column;
}
.promo-card:hover,.partner-card:hover{border-color:#ff5a1f;transform:translateY(-2px)}

/* Mostrar apenas 6 no desktop */
.promo-card:nth-child(n+7){display:none}

.promo-card img{
  width:100%;aspect-ratio:4/3;object-fit:cover;display:block;
  background:#242730;
}
.promo-card div,.partner-card div{padding:12px 14px;flex:1;display:flex;flex-direction:column;gap:4px}
.promo-card small{color:#ff5a1f;font-size:10px;font-weight:800;letter-spacing:.5px}
.promo-card b,.partner-card b{
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;
  overflow:hidden;font-size:14px;line-height:1.35;margin:0;
}
.promo-card span{color:#ffc93c;font:700 16px Oswald,sans-serif;margin-top:auto;padding-top:6px}
.partner-card{min-height:180px;background:linear-gradient(135deg,#252833,#17191e)}
.partner-mark{display:grid;place-items:center;width:40px;height:40px;border-radius:11px;background:#ff5a1f;color:#fff;font-weight:900;font-size:14px;margin-bottom:6px}
.partner-card p{color:#a5aaba;font-size:12px;margin:4px 0 0}
.partner-card button{margin:10px 14px 14px;border:0;background:transparent;color:#ff6a37;font-weight:800;font-size:12px;text-align:left;cursor:pointer}

.home-intro{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:32px 0 12px;flex-wrap:wrap}
.home-intro p,.search-page__hero p{max-width:620px;color:#a5aaba;line-height:1.6}
.search-page{padding-top:38px}
.search-page__hero{margin-bottom:24px}

/* ── Tablet ── */
@media(max-width:980px){
  .partner-rail{grid-template-columns:repeat(2,minmax(0,1fr))}
  .promo-card:nth-child(n+7){display:flex}
}

/* ── Mobile: 2 COLUNAS GRID VERTICAL, sem scroll horizontal ── */
@media(max-width:700px){
  .home-intro{display:block;padding-top:20px}
  .home-intro .primary{margin-top:10px;width:100%}
  .partner-carousel__top{flex-direction:column;align-items:flex-start}
  .partner-tabs{width:100%}
  .partner-tabs button{flex:1;text-align:center}
  .search-page{padding-top:20px}

  /* 2 colunas, scroll VERTICAL */
  .partner-rail{
    display:grid !important;
    grid-template-columns:repeat(2,1fr) !important;
    gap:10px !important;
    overflow:visible !important;
    padding-bottom:4px;
  }

  /* Mostrar todos os cards */
  .promo-card:nth-child(n+1){display:flex !important}

  /* Imagem quadrada no mobile */
  .promo-card img{aspect-ratio:1/1;width:100%}

  /* Texto compacto */
  .promo-card div,.partner-card div{padding:9px 10px;gap:3px}
  .promo-card b,.partner-card b{font-size:12px;-webkit-line-clamp:2}
  .promo-card span{font-size:14px}
  .promo-card small{font-size:9px}
  .partner-card{min-height:140px}
  .partner-mark{width:32px;height:32px;font-size:12px;border-radius:9px}
  .partner-card p{font-size:11px}
}

/* ── Telas muito pequenas ── */
@media(max-width:360px){
  .partner-rail{gap:8px !important}
  .promo-card b,.partner-card b{font-size:11px}
  .promo-card span{font-size:13px}
}
`

export default function PartnerCarousel({ products, onOpen, onSellers }) {
  const [tab, setTab] = useState('offers')
  const list = tab === 'offers'
    ? products.filter(p => p.badge || p.oldPrice).slice(0, 8)
    : partners

  return (
    <section className="partner-carousel">
      <style>{css}</style>

      <div className="partner-carousel__top">
        <div>
          <small>{tab === 'offers' ? 'DESTAQUES DA SEMANA' : 'LOJAS VERIFICADAS'}</small>
          <h2>{tab === 'offers' ? 'Ofertas que valem a pena' : 'Compre de quem entende'}</h2>
        </div>
        <div className="partner-tabs">
          <button className={tab === 'offers'   ? 'active' : ''} onClick={() => setTab('offers')}>Promoções</button>
          <button className={tab === 'partners' ? 'active' : ''} onClick={() => setTab('partners')}>Parceiros</button>
        </div>
      </div>

      <div className="partner-rail">
        {tab === 'offers'
          ? list.map(product => (
              <button className="promo-card" key={product.id} onClick={() => onOpen(product)}>
                <img src={product.image} alt={product.name} loading="lazy" />
                <div>
                  <small>{product.badge || 'OFERTA'}</small>
                  <b>{product.name}</b>
                  <span>R$ {Number(product.price).toFixed(2).replace('.', ',')}</span>
                </div>
              </button>
            ))
          : list.map(partner => (
              <article className="partner-card" key={partner.name}>
                <div>
                  <span className="partner-mark">{partner.mark}</span>
                  <b>{partner.name}</b>
                  <p>{partner.text}</p>
                </div>
                <button onClick={onSellers}>Ver loja →</button>
              </article>
            ))
        }
      </div>
    </section>
  )
}
