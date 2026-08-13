const SOURCE = 'https://raw.githubusercontent.com/parmenasoares/achei/main/index.html';

const heroHTML = `
<section class="hero hero-slider-shell">
  <div class="hero-slider" id="heroSlider">
    <article class="hero-slide active">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">🚀 MARKETPLACE #1 DO BRASIL</div>
          <div class="hero-kicker">PEÇAS AUTOMOTIVAS</div>
          <h1>As melhores<br>peças para o<br><span>seu veículo</span></h1>
          <p>Encontre peças originais e paralelas com entrega rápida, garantia e os melhores preços do mercado.</p>
          <div class="hero-actions"><button class="btn-primary" onclick="document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'})">Ver Produtos</button><button class="btn-secondary" onclick="goTo('seller')">Ver Vendedores</button></div>
          <div class="hero-stats"><div class="stat"><span class="stat-value">12k+</span><span class="stat-label">Produtos</span></div><div class="stat"><span class="stat-value">98%</span><span class="stat-label">Satisfação</span></div><div class="stat"><span class="stat-value">24h</span><span class="stat-label">Entrega</span></div></div>
        </div>
        <div class="hero-visual"><div class="hero-art">🔧</div><div class="hero-promo-card">MELHOR<br>PREÇO</div></div>
      </div>
    </article>
    <article class="hero-slide">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">⚡ OFERTAS ESPECIAIS</div>
          <div class="hero-kicker">ECONOMIZE DE VERDADE</div>
          <h1>Preço baixo<br>para quem<br><span>entende de carro</span></h1>
          <p>Compare vendedores, encontre promoções e compre com segurança. Tudo em um só marketplace.</p>
          <div class="hero-actions"><button class="btn-primary" onclick="document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'})">Ver Ofertas</button><button class="btn-secondary" onclick="goTo('seller')">Encontrar Vendedores</button></div>
          <div class="hero-stats"><div class="stat"><span class="stat-value">-30%</span><span class="stat-label">Economia</span></div><div class="stat"><span class="stat-value">500+</span><span class="stat-label">Ofertas</span></div><div class="stat"><span class="stat-value">12x</span><span class="stat-label">Sem juros</span></div></div>
        </div>
        <div class="hero-visual hero-visual-offer"><div class="hero-art">🏷️</div><div class="hero-promo-card yellow">ATÉ<br>30% OFF</div></div>
      </div>
    </article>
    <article class="hero-slide">
      <div class="hero-inner">
        <div class="hero-content">
          <div class="hero-badge">🛡️ COMPRA PROTEGIDA</div>
          <div class="hero-kicker">CONFIANÇA EM CADA PEDIDO</div>
          <h1>Compre tranquilo.<br>Receba rápido.<br><span>Dirija melhor.</span></h1>
          <p>Vendedores avaliados, pagamento seguro, garantia e acompanhamento do pedido do início ao fim.</p>
          <div class="hero-actions"><button class="btn-primary" onclick="document.getElementById('catalog-section').scrollIntoView({behavior:'smooth'})">Comprar Agora</button><button class="btn-secondary" onclick="goTo('track')">Rastrear Pedido</button></div>
          <div class="hero-stats"><div class="stat"><span class="stat-value">98%</span><span class="stat-label">Satisfação</span></div><div class="stat"><span class="stat-value">4.9★</span><span class="stat-label">Avaliação</span></div><div class="stat"><span class="stat-value">12m</span><span class="stat-label">Garantia</span></div></div>
        </div>
        <div class="hero-visual hero-visual-safe"><div class="hero-art">🛡️</div><div class="hero-promo-card green">COMPRA<br>SEGURA</div></div>
      </div>
    </article>
    <div class="hero-slider-nav">
      <div class="hero-slider-left"><div class="hero-dots"><button class="hero-dot active" aria-label="Slide 1"></button><button class="hero-dot" aria-label="Slide 2"></button><button class="hero-dot" aria-label="Slide 3"></button></div><span id="heroSlideCount">01 / 03</span></div>
      <div class="hero-arrows"><button class="hero-arrow" id="heroPrev" aria-label="Anterior">‹</button><button class="hero-arrow" id="heroNext" aria-label="Próximo">›</button></div>
    </div>
    <div class="hero-progress" id="heroProgress"></div>
  </div>
</section>`;

const heroCSS = `<style>
.hero-slider-shell{min-height:520px;position:relative;background:linear-gradient(135deg,var(--g800) 0%,#1a1208 50%,var(--g800) 100%);overflow:hidden}
.hero-slider-shell:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 65% 50%,rgba(255,90,31,.14),transparent 70%);pointer-events:none}
.hero-slider{position:relative;min-height:520px}
.hero-slider .hero-slide{position:absolute;inset:0;opacity:0;visibility:hidden;transform:translateX(25px);transition:opacity .55s ease,transform .55s ease,visibility .55s;display:flex;align-items:center}
.hero-slider .hero-slide.active{opacity:1;visibility:visible;transform:translateX(0);position:relative}
.hero-slider .hero-slide .hero-inner{width:100%;min-height:520px;padding:64px 24px 92px}
.hero-slider .hero-content{max-width:620px}
.hero-slider .hero-kicker{font-size:12px;color:var(--yellow);font-weight:700;text-transform:uppercase;letter-spacing:1px;margin:-8px 0 10px}
.hero-slider .hero h1{font-size:clamp(38px,5vw,62px);letter-spacing:-.5px}
.hero-slider .hero p{max-width:590px}
.hero-slider .hero-visual{width:430px;height:330px;background:linear-gradient(145deg,var(--g700),#181a1f);border-radius:24px;border:1px solid var(--g600);box-shadow:0 24px 70px rgba(0,0,0,.38);display:flex;align-items:center;justify-content:center;position:relative;flex-shrink:0}
.hero-slider .hero-art{font-size:145px;filter:drop-shadow(0 16px 24px rgba(0,0,0,.3))}
.hero-slider .hero-promo-card{position:absolute;right:24px;top:24px;background:var(--orange);color:#fff;padding:9px 14px;border-radius:10px;font-size:11px;font-weight:800;text-align:center;line-height:1.25;box-shadow:0 10px 30px rgba(255,90,31,.25)}
.hero-slider .hero-promo-card.yellow{background:var(--yellow);color:var(--g900)}
.hero-slider .hero-promo-card.green{background:var(--green)}
.hero-visual-offer{background:linear-gradient(145deg,#2a211b,#17191d)!important}.hero-visual-safe{background:linear-gradient(145deg,#202b28,#171a1e)!important}
.hero-slider-nav{position:absolute;left:0;right:0;bottom:24px;z-index:5;max-width:1400px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between}
.hero-slider-left{display:flex;align-items:center;gap:12px}.hero-slider-left>span{font-size:12px;color:var(--steel)}
.hero-dots{display:flex;gap:8px}.hero-dot{width:32px;height:5px;border:0;border-radius:5px;background:var(--g600);padding:0;cursor:pointer;transition:all .25s}.hero-dot.active{width:52px;background:var(--orange)}
.hero-arrows{display:flex;gap:8px}.hero-arrow{width:42px;height:42px;border:1px solid var(--g600);border-radius:10px;background:rgba(26,28,33,.92);color:var(--offwhite);font-size:22px;display:flex;align-items:center;justify-content:center;cursor:pointer}.hero-arrow:hover{background:var(--orange);border-color:var(--orange);color:#fff}
.hero-progress{position:absolute;left:0;bottom:0;width:33.333%;height:3px;background:var(--orange);transition:transform .45s ease;z-index:6}
@media(max-width:1023px){.hero-slider .hero-slide .hero-inner{min-height:560px;padding:46px 24px 92px}.hero-slider .hero-visual{width:320px;height:250px}.hero-slider .hero-art{font-size:105px}}
@media(max-width:599px){.hero-slider-shell,.hero-slider,.hero-slider .hero-slide .hero-inner{min-height:620px}.hero-slider .hero-slide .hero-inner{padding:36px 16px 88px;align-items:flex-start}.hero-slider .hero-content{width:100%}.hero-slider .hero h1{font-size:36px}.hero-slider .hero p{font-size:14px;margin-bottom:24px}.hero-slider .hero-stats{margin-top:28px;gap:18px}.hero-slider .hero-visual{display:flex;width:100%;height:180px;margin-top:8px;border-radius:18px}.hero-slider .hero-art{font-size:80px}.hero-slider .hero-promo-card{right:14px;top:14px;font-size:9px;padding:7px 10px}.hero-slider-nav{padding:0 16px;bottom:20px}.hero-arrow{width:38px;height:38px}.hero-dot{width:22px}.hero-dot.active{width:38px}}
</style>`;

const heroJS = `<script>
(function(){
  const root=document.getElementById('heroSlider'); if(!root) return;
  const slides=[...root.querySelectorAll('.hero-slide')], dots=[...root.querySelectorAll('.hero-dot')], count=document.getElementById('heroSlideCount'), progress=document.getElementById('heroProgress');
  let index=0,timer;
  function render(i){index=(i+slides.length)%slides.length;slides.forEach((s,n)=>s.classList.toggle('active',n===index));dots.forEach((d,n)=>d.classList.toggle('active',n===index));if(count)count.textContent='0'+(index+1)+' / 0'+slides.length;if(progress)progress.style.transform='translateX('+(index*100)+'%)';}
  function restart(){clearInterval(timer);timer=setInterval(()=>render(index+1),5500)}
  dots.forEach((d,n)=>d.addEventListener('click',()=>{render(n);restart()}));
  document.getElementById('heroNext')?.addEventListener('click',()=>{render(index+1);restart()});
  document.getElementById('heroPrev')?.addEventListener('click',()=>{render(index-1);restart()});
  root.addEventListener('mouseenter',()=>clearInterval(timer));root.addEventListener('mouseleave',restart);
  let startX=0;root.addEventListener('touchstart',e=>startX=e.changedTouches[0].clientX,{passive:true});root.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45){render(index+(dx<0?1:-1));restart()}},{passive:true});
  render(0);restart();
})();
</script>`;

export default async function handler(req,res){
  try{
    const response=await fetch(SOURCE,{cache:'no-store'});
    if(!response.ok) throw new Error('Falha ao carregar index.html');
    let html=await response.text();
    html=html.replace(/<section class="hero">[\\s\\S]*?<\\/section>/,heroHTML);
    html=html.replace('</head>',heroCSS+'</head>');
    html=html.replace('</body>',heroJS+'</body>');
    res.setHeader('Content-Type','text/html; charset=utf-8');
    res.setHeader('Cache-Control','public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).send(html);
  }catch(error){return res.status(500).send('Erro ao carregar o marketplace: '+error.message)}
}
