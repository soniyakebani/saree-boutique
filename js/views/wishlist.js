/* Wishlist page */
'use strict';

/* ---------- WISHLIST ---------- */
function wishlistView() {
  const list = S.wish.map(byId).filter(Boolean);
  const html = `<div class="page-head"><div class="wrap"><h1>Wishlist</h1><p>Sarees you have saved with the heart.</p></div></div>
  <div class="wrap" style="padding:36px 24px 90px">
    ${list.length ? `<div style="margin-bottom:22px;display:flex;gap:12px;flex-wrap:wrap"><button class="btn" data-act="wish-all">Add all to cart</button><button class="btn ghost" data-act="wish-clear">Clear wishlist</button></div><div class="grid">${list.map(card).join('')}</div>`
      : `<div class="empty"><h3>Nothing saved yet</h3><p>Tap the heart on any saree to keep it here.</p><a class="btn" href="#shop">Browse sarees</a></div>`}
  </div>`;
  return {title: 'Wishlist', html};
}
