/* Product details page and reviews */
'use strict';

/* ---------- PRODUCT ---------- */
function recentAdd(id) { S.recent = [id, ...S.recent.filter(x => x !== id)].slice(0, 8); store.set('recent', S.recent); }
function reviewsFor(p) { return [...(S.reviews[p.id] || []).slice().reverse(), ...seedReviewsFor(p)]; }
function hasBought(pid) {
  const u = currentUser(); if (!u) return false;
  return S.orders.some(o => o.email === u.email && o.status !== 'Cancelled' && o.items.some(i => i.id === pid));
}
function reviewListHtml(p) {
  return reviewsFor(p).map(r => `<div class="rev">${stars(r.rating)}<p>${esc(r.text)}</p><small><b>${esc(r.name)}</b>${r.city ? ', ' + esc(r.city) : ''}${r.date ? ', ' + fmtDate(r.date) : ''}</small>${r.verified ? '<span class="badge-ok">Verified buyer</span>' : ''}</div>`).join('');
}
function productView([id]) {
  const p = byId(id); if (!p) return notFound();
  recentAdd(p.id);
  const rt = ratingOf(p), u = currentUser();
  const related = PRODUCTS.filter(x => x.id !== p.id && x.cat === p.cat).concat(PRODUCTS.filter(x => x.id !== p.id && x.cat !== p.cat)).slice(0, 4);
  const recent = S.recent.filter(x => x !== p.id).map(byId).filter(Boolean).slice(0, 4);
  const gal = p.gallery && p.gallery.length ? p.gallery : [p.img, p.img, p.img];
  const views = ['Full drape', 'Styled look', 'Detail view'];
  const html = `
  <div class="wrap crumbs"><a href="#home">Home</a> / <a href="#shop">Shop</a> / <a href="#shop?cat=${p.cat}">${CATS[p.cat].name}</a> / ${esc(p.name)}</div>
  <div class="wrap pd">
    <div class="gal">
      <div class="thumbs">${views.map((v, i) => `<button class="thumb${i === 0 ? ' on' : ''}" data-act="view" data-v="${i}" data-id="${p.id}" aria-label="${v}"><img src="${gal[i]}" alt="${esc(p.name)}, ${v}" loading="lazy"></button>`).join('')}</div>
      <div class="pimg" id="pimg"><img id="pmain" src="${gal[0]}" alt="${esc(p.name)}, ${esc(p.colorName)}"><span class="tag">${pct(p)}% off</span></div>
    </div>
    <div class="pd-info">
      <h1>${esc(p.name)}</h1>
      <p class="rate">${stars(rt.avg)}<a class="lnk" href="#product/${p.id}" data-scroll="reviews">${rt.avg} from ${rt.n} reviews</a></p>
      <div class="pd-price"><b>${fmt(p.price)}</b><s>${fmt(p.mrp)}</s><span>${pct(p)}% off</span></div>
      <small>You save ${fmt(p.mrp - p.price)}. Inclusive of taxes. ${p.price >= FREE_SHIP_AT ? 'Free shipping.' : `Shipping ${fmt(SHIP_FEE)}, free above ${fmt(FREE_SHIP_AT)}.`}</small>
      <p style="margin-top:14px">${esc(p.desc)}</p>
      <table class="spec">
        <tr><th>Fabric</th><td>${esc(p.fabric)}</td></tr><tr><th>Colour</th><td>${esc(p.colorName)}</td></tr>
        <tr><th>Occasion</th><td>${esc(p.occ.join(', '))}</td></tr><tr><th>Availability</th><td>${p.stock <= 5 ? `<span class="low">Only ${p.stock} left</span>` : 'In stock'}</td></tr>
      </table>
      <div class="qtyrow"><span class="stepper" role="group" aria-label="Quantity"><button type="button" data-act="pq" data-d="-1" aria-label="Decrease quantity">−</button><output id="pq" aria-live="polite">1</output><button type="button" data-act="pq" data-d="1" aria-label="Increase quantity">+</button></span>
        <small id="pInCart" data-id="${p.id}">${cartQty(p.id) ? `${cartQty(p.id)} of this saree already in your cart.` : ''}</small></div>
      <div class="buy">
        <button class="btn" data-act="padd" data-id="${p.id}">Add to cart</button>
        <button class="btn ghost" data-act="pbuy" data-id="${p.id}">Buy now</button>
        <button class="btn ghost wish" id="pWish" data-act="wish" data-id="${p.id}" aria-pressed="${S.wish.includes(p.id)}">${S.wish.includes(p.id) ? '♥ Saved' : '♡ Save'}</button>
      </div>
      <form class="pin" data-form="pincode" novalidate><input type="text" name="pin" inputmode="numeric" maxlength="6" placeholder="Enter delivery PIN code" aria-label="Delivery PIN code"><button class="btn ghost sm" type="submit">Check</button></form>
      <p class="pin-msg" id="pinMsg" aria-live="polite"></p>
      <button class="lnk" data-act="share" data-id="${p.id}">Share this saree</button>

      <details open><summary>Product details</summary><p>${esc(p.desc)}</p></details>
      <details><summary>Specifications</summary><ul><li>Length: 5.5 m saree with 0.8 m blouse piece</li><li>Weight: ${esc(p.weight)}</li><li>Weave: ${esc(p.weave)}</li><li>Origin: ${esc(p.origin)}</li><li>Care: ${esc(p.care)}</li></ul></details>
      <details><summary>Delivery information</summary><p>Dispatched within 2 working days. Delivery across India takes 4 to 7 days. Cash on delivery is available on orders up to ₹10,000.</p></details>
      <details><summary>Return policy</summary><p>Return unworn sarees with tags within 7 days of delivery for a refund or exchange. Stitched blouses cannot be returned.</p></details>
    </div>
  </div>

  <div class="wrap" id="reviews" style="padding-bottom:40px">
    <h2 style="font-size:1.9rem">Customer reviews</h2>
    <div class="rev-wrap">
      <div id="revList">${reviewListHtml(p)}</div>
      <form class="panel" data-form="review" data-id="${p.id}" novalidate>
        <h3 style="margin-bottom:12px">Write a review</h3>
        <div class="field"><label id="ratelbl">Your rating</label><div class="starpick" role="radiogroup" aria-labelledby="ratelbl">${[1,2,3,4,5].map(n => `<button type="button" data-act="rate" data-n="${n}" role="radio" aria-checked="false" aria-label="${n} star${n > 1 ? 's' : ''}">★</button>`).join('')}</div><input type="hidden" name="rating" value=""></div>
        <div class="field"><label for="rvName">Name</label><input id="rvName" name="name" type="text" value="${u ? esc(u.name) : ''}" autocomplete="name"></div>
        <div class="field"><label for="rvText">Your review</label><textarea id="rvText" name="text" rows="4" maxlength="500"></textarea></div>
        <button class="btn" type="submit">Submit review</button>
      </form>
    </div>
  </div>

  <section class="sec alt"><div class="wrap"><div class="sec-head"><h2>You may also like</h2></div><div class="grid four">${related.map(card).join('')}</div></div></section>
  ${recent.length ? `<section class="sec"><div class="wrap"><div class="sec-head"><h2>Recently viewed</h2></div><div class="grid four">${recent.map(card).join('')}</div></div></section>` : ''}`;
  return {title: p.name, html, mount() {
    const box = $('#pimg'), img = $('#pmain');
    if (box && window.matchMedia && matchMedia('(hover:hover)').matches) {
      box.addEventListener('mousemove', e => {
        const r = box.getBoundingClientRect();
        box.style.setProperty('--zx', ((e.clientX - r.left) / r.width * 100) + '%');
        box.style.setProperty('--zy', ((e.clientY - r.top) / r.height * 100) + '%');
        box.classList.add('zooming');
      });
      box.addEventListener('mouseleave', () => box.classList.remove('zooming'));
    }
  }};
}
