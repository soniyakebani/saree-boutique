/* Home page and hero slider */
'use strict';

/* ---------- HOME ---------- */
const SLIDES = [
  {h:'Traditional elegance<br>for every occasion', p:'Discover our exclusive saree collection: handwoven silks from Varanasi, Paithan and Kanchipuram, and everyday cottons that feel like home.', a:['Shop now','#shop'], b:['Browse by weave','#categories'], img:U('1641699862936-be9f49b1c38d', 800)},
  {h:'The wedding edit<br>is here', p:'Bridal zari silks and tissue weaves for the whole family. Use code SHUBH10 for 10% off orders above ₹2,000.', a:['Shop wedding sarees','#shop?cat=wedding'], b:['See all offers','#offers'], img:U('1610030469839-f909584b43f1', 800)},
  {h:'Everyday cottons,<br>from ₹1,099', p:'Breathable handloom and chanderi sarees that soften with every wash. Made for long working days.', a:['Shop cotton','#shop?cat=cotton'], b:['Shop by budget','#budget'], img:U('1610030469978-6bb537f3b982', 800)}
];
function homeView() {
  const arrivals = PRODUCTS.filter(p => p.isNew).slice(0, 4);
  const best = [...PRODUCTS].sort((a, b) => b.sold - a.sold).slice(0, 4);
  const html = `
  <section class="hero" aria-roledescription="carousel" aria-label="Featured collections">
    ${SLIDES.map((s, i) => `<div class="hero-slide${i === 0 ? ' active' : ''}" aria-hidden="${i !== 0}">
      <div><h1>${s.h}</h1><p>${s.p}</p><div class="cta"><a class="btn light" href="${s.a[1]}">${s.a[0]}</a><a class="btn line-light" href="${s.b[1]}" ${s.b[1][1] !== 's' ? 'data-scroll="1"' : ''}>${s.b[0]}</a></div></div>
      <div class="hero-photo"><img src="${s.img}" alt="Model wearing a saree from our collection"${i ? ' loading="lazy"' : ''}></div>
    </div>`).join('')}
    <div class="hero-ctrl">
      <button class="arrow" data-act="hero-prev" aria-label="Previous slide">‹</button>
      <div class="hero-dots">${SLIDES.map((_, i) => `<button data-act="hero-go" data-i="${i}" aria-label="Go to slide ${i + 1}" aria-current="${i === 0}"></button>`).join('')}</div>
      <button class="arrow" data-act="hero-next" aria-label="Next slide">›</button>
    </div>
  </section>

  <div class="trust"><div class="wrap"><ul>
    <li><b>Free shipping</b>on orders of ₹5,000+</li><li><b>7-day returns</b>on unworn sarees</li>
    <li><b>Secure payment</b>UPI, cards or cash on delivery</li><li><b>Handwoven</b>direct from weaving clusters</li></ul></div></div>

  <section class="sec" id="categories"><div class="wrap">
    <div class="sec-head"><h2>Shop by category</h2><a class="lnk" href="#shop">See every saree</a></div>
    <div class="cats">${Object.entries(CATS).map(([k, c]) => `<a class="ctile" href="#shop?cat=${k}"><img src="${c.img}" alt="${c.name} sarees" loading="lazy"><span class="lbl">${c.name}<small>${c.blurb}</small></span></a>`).join('')}</div>
    <div class="budget" id="budget"><b>Shop by budget:</b>${[1,2,3,4,5,6,7].map(i => `<a class="pill" href="#shop?price=${i}">${bandLabel(i)}</a>`).join('')}</div>
  </div></section>

  <section class="sec alt"><div class="wrap">
    <div class="sec-head"><h2>New arrivals</h2><a class="lnk" href="#shop?sort=newest">Shop everything new</a></div>
    <div class="arrivals">${arrivals.map(p => `<a class="tile" href="#product/${p.id}"><div class="art"><img src="${p.img}" alt="${esc(p.name)}" loading="lazy"></div><h3>${esc(p.name)}</h3><p class="price"><b>${fmt(p.price)}</b><s>${fmt(p.mrp)}</s></p></a>`).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="sec-head"><h2>Best sellers</h2></div>
    <div class="best">
      <div class="art"><a href="#product/${best[0].id}"><img src="${best[0].img}" alt="${esc(best[0].name)}" loading="lazy"></a></div>
      <ol class="best-list">${best.map((p, i) => `<li><span class="rank">${i + 1}</span><a href="#product/${p.id}"><img src="${p.img}" alt="" loading="lazy"></a>
        <div><b><a href="#product/${p.id}">${esc(p.name)}</a></b><small>${p.sold.toLocaleString('en-IN')} sold</small></div>
        <p class="price"><b>${fmt(p.price)}</b></p></li>`).join('')}
        <li style="display:block;border:0;padding-top:22px"><a class="btn" href="#shop?sort=popular">Shop the collection</a></li></ol>
    </div>
  </div></section>

  <section class="sec alt" id="offers"><div class="wrap"><div class="offer">
    <div><h2>The wedding edit is here</h2><p>Bridal zari silks and tissue weaves for the whole family, with an extra 10% off orders above ₹2,000.</p><a class="btn light" href="#shop?cat=wedding">Shop wedding sarees</a></div>
    <div class="coupon"><span>Tap to copy and apply at checkout</span><b>SHUBH10</b><button class="btn light sm" style="margin-top:12px" data-act="copy-coupon" data-code="SHUBH10">Copy code</button></div>
  </div></div></section>

  <section class="sec"><div class="wrap why">
    <div><h2>Why choose us</h2><p class="lead" style="margin-top:14px">Every saree is inspected by hand before it leaves the shop, and you can send it back if it is not right.</p></div>
    <ul class="ticks">
      <li><b>Premium quality</b><span>Pure silk and cotton, checked for weave and colour.</span></li>
      <li><b>Authentic designs</b><span>Sourced from weaving clusters, not mills.</span></li>
      <li><b>Affordable pricing</b><span>Direct from weavers, from ₹1,099 to ₹7,999.</span></li>
      <li><b>Secure packaging</b><span>Wrapped in muslin and sealed against damp.</span></li>
      <li><b>Easy returns</b><span>7 days to return anything unworn.</span></li>
      <li><b>Fast delivery</b><span>Dispatched in 2 days, delivered in 4 to 7.</span></li>
    </ul></div></section>

  <section class="sec alt"><div class="wrap">
    <div class="sec-head"><h2>Customer reviews</h2></div>
    <div class="reviews">
      <figure class="big"><blockquote>“The maroon Banarasi arrived folded in muslin with a note from the weaver's family. It looked better than the photos, and my mother cried at the wedding.”</blockquote>
        <figcaption>${stars(5)}<b>Meera K.</b>Bought for her sister's wedding</figcaption></figure>
      <figure><blockquote>“Indigo handloom cotton at ₹1,099 is unbeatable. It softens with every wash.”</blockquote><figcaption>${stars(4.5)}<b>Anita D.</b>Wears it to work every week</figcaption></figure>
      <figure><blockquote>“Exchange was painless. I swapped a size of blouse piece in two days.”</blockquote><figcaption>${stars(4)}<b>Priya I.</b>First-time buyer</figcaption></figure>
    </div></div></section>`;
  return {title: 'Handwoven Indian Sarees', html, mount: mountHero};
}
let heroGo = null;
function mountHero() {
  const slides = $$('.hero-slide'), dots = $$('.hero-dots button'); if (!slides.length) return;
  let i = 0, timer = null;
  heroGo = n => {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => { s.classList.toggle('active', k === i); s.setAttribute('aria-hidden', k !== i); });
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i));
  };
  heroGo.next = () => heroGo(i + 1); heroGo.prev = () => heroGo(i - 1);
  const reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const start = () => { if (!reduce && !timer) timer = setInterval(() => heroGo(i + 1), 5000); };
  const stop = () => { clearInterval(timer); timer = null; };
  const hero = $('.hero');
  hero.addEventListener('mouseenter', stop); hero.addEventListener('mouseleave', start);
  hero.addEventListener('focusin', stop); hero.addEventListener('focusout', start);
  start(); cleanup.push(stop, () => { heroGo = null; });
}
