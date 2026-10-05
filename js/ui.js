/* Reusable UI pieces: stars, product card, badges, cart drawer */
'use strict';

const stars = r => `<span class="stars" style="--r:${r}" role="img" aria-label="${r} out of 5">★★★★★</span>`;
function ratingOf(p) {
  const user = S.reviews[p.id] || [];
  const n = p.reviews + user.length;
  const avg = (p.rating * p.reviews + sum(user, r => r.rating)) / n;
  return {avg: Math.round(avg * 10) / 10, n};
}

function card(p) {
  const w = S.wish.includes(p.id), q = cartQty(p.id), rt = ratingOf(p);
  return `<article class="card">
    <div class="art">
      <a href="#product/${p.id}" aria-label="View ${esc(p.name)}"><img src="${p.img}" alt="${esc(p.name)}, ${esc(p.colorName)}" loading="lazy"></a>
      <span class="tag">${pct(p)}% off</span>
      <button class="heart${w ? ' on' : ''}" data-act="wish" data-id="${p.id}" aria-pressed="${w}" aria-label="${w ? 'Remove from' : 'Add to'} wishlist">${w ? '♥' : '♡'}</button>
    </div>
    <div class="info">
      <h3><a href="#product/${p.id}">${esc(p.name)}</a></h3>
      <p class="meta">${esc(p.colorName)}, ${esc(p.fabric.toLowerCase())}</p>
      <p class="rate">${stars(rt.avg)}<span>${rt.avg}</span></p>
      <p class="price"><b>${fmt(p.price)}</b><s>${fmt(p.mrp)}</s></p>
      ${p.stock <= 5 ? `<p class="low">Only ${p.stock} left</p>` : ''}
      <button class="btn add" data-act="add" data-id="${p.id}">${q ? `Add another (${q} in cart)` : 'Add to cart'}</button>
    </div>
  </article>`;
}

function updateBadges() {
  const c = cartCount(), w = S.wish.length;
  const cn = $('#cartN'), wn = $('#wishN');
  cn.textContent = c; cn.hidden = !c;
  wn.textContent = w; wn.hidden = !w;
}
function renderAccountMenu() {
  const u = currentUser(), box = $('#acct');
  box.innerHTML = u
    ? `<div class="has-menu"><a class="login-link" href="#account">Hi, ${esc(u.name.split(' ')[0])} ▾</a>
        <div class="menu right"><a href="#account">My account and orders</a><a href="#wishlist">Wishlist</a><button data-act="logout">Log out</button></div></div>`
    : `<a class="login-link" href="#login">Login</a>`;
}
function refreshStates() {
  $$('.heart[data-id]').forEach(b => {
    const id = Number(b.dataset.id), on = S.wish.includes(id);
    b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
    b.textContent = on ? '♥' : '♡';
    b.setAttribute('aria-label', (on ? 'Remove from' : 'Add to') + ' wishlist');
  });
  $$('.card .add[data-id]').forEach(b => {
    const q = cartQty(Number(b.dataset.id));
    b.textContent = q ? `Add another (${q} in cart)` : 'Add to cart';
  });
  const pw = $('#pWish'); if (pw) { const on = S.wish.includes(Number(pw.dataset.id)); pw.textContent = on ? '♥ Saved' : '♡ Save'; pw.setAttribute('aria-pressed', on); }
  const pc = $('#pInCart'); if (pc) { const q = cartQty(Number(pc.dataset.id)); pc.textContent = q ? `${q} of this saree already in your cart.` : ''; }
}
function afterChange() {
  updateBadges(); renderDrawer(); refreshStates();
  const name = currentRoute.name;
  if (name === 'cart' || name === 'wishlist') refreshView();
}

/* ---------- cart drawer ---------- */
let lastFocus = null;
function renderDrawer() {
  const t = totals(), d = $('#drawer');
  d.innerHTML = `
    <div class="dr-head"><h3>Your cart (${t.count})</h3><button class="icon-btn" data-act="drawer-close" aria-label="Close cart">✕</button></div>
    <div class="dr-body">${t.items.length ? t.items.map(l => `
      <div class="dr-line">
        <a href="#product/${l.p.id}"><img src="${l.p.img}" alt="${esc(l.p.name)}"></a>
        <div><b>${esc(l.p.name)}</b><small>${esc(l.p.colorName)}</small>
          <div class="row"><span class="stepper" role="group" aria-label="Quantity">
            <button data-act="qty" data-id="${l.p.id}" data-d="-1" aria-label="Decrease quantity">−</button><output>${l.qty}</output>
            <button data-act="qty" data-id="${l.p.id}" data-d="1" aria-label="Increase quantity">+</button></span>
            <b>${fmt(l.p.price * l.qty)}</b></div></div></div>`).join('')
      : `<p style="padding:30px 0">Your cart is empty.</p>`}</div>
    <div class="dr-foot">
      <div class="sum-line"><span>Subtotal</span><b>${fmt(t.subtotal)}</b></div>
      <small>${t.items.length ? (t.shipping ? `Add ${fmt(t.toFree)} more for free shipping.` : 'You get free shipping.') : ''}</small>
      <div style="display:grid;gap:10px;margin-top:12px">
        <a class="btn ghost" href="#cart" data-act="drawer-close">View cart</a>
        <a class="btn" href="#checkout" data-act="drawer-close" ${t.items.length ? '' : 'aria-disabled="true" style="opacity:.5;pointer-events:none"'}>Checkout</a>
      </div></div>`;
}
function openDrawer() {
  lastFocus = document.activeElement; renderDrawer();
  $('#drawer').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false'); $('#overlay').classList.add('on');
  const c = $('#drawer [data-act="drawer-close"]'); if (c) c.focus();
}
function closeDrawer() {
  $('#drawer').classList.remove('on'); $('#drawer').setAttribute('aria-hidden', 'true'); $('#overlay').classList.remove('on');
  if (lastFocus && document.contains(lastFocus)) { try { lastFocus.focus(); } catch (e) {} } lastFocus = null;
}
