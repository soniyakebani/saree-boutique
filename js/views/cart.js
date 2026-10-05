/* Cart page */
'use strict';

/* ---------- CART ---------- */
function couponBox(t) {
  return S.coupon && COUPONS[S.coupon]
    ? `<div class="applied"><span><b>${esc(S.coupon)}</b> applied${t.couponNote ? '' : ''}</span><button class="lnk bad" data-act="rm-coupon">Remove</button></div>${t.couponNote ? `<small class="err">${esc(t.couponNote)}</small>` : ''}`
    : `<form class="coupon-form" data-form="coupon" novalidate><input type="text" name="code" placeholder="Coupon code" aria-label="Coupon code" autocomplete="off"><button class="btn ghost sm" type="submit">Apply</button></form><small>Try SHUBH10, WELCOME5 or FREESHIP</small>`;
}
function cartView() {
  const t = totals();
  if (!t.items.length) return {title: 'Cart', html: `<div class="page-head"><div class="wrap"><h1>My cart</h1></div></div><div class="wrap empty" style="padding:60px 24px 100px"><h3>Your cart is empty</h3><p>Add a saree from the shop and it will appear here.</p><a class="btn" href="#shop">Browse sarees</a></div>`};
  const html = `
  <div class="page-head"><div class="wrap"><h1>My cart</h1><p>${t.count} item${t.count > 1 ? 's' : ''} in your cart.</p></div></div>
  <div class="wrap cart">
    <div>
      <div class="ship-bar">${t.toFree > 0 ? `Add <b>${fmt(t.toFree)}</b> more for free shipping.` : '<b>You have free shipping.</b>'}<div class="bar-track"><i style="width:${Math.min(100, (FREE_SHIP_AT - t.toFree) / FREE_SHIP_AT * 100)}%"></i></div></div>
      ${t.items.map(l => `<div class="line">
        <a href="#product/${l.p.id}"><img src="${l.p.img}" alt="${esc(l.p.name)}"></a>
        <div><h3><a href="#product/${l.p.id}">${esc(l.p.name)}</a></h3><small>${esc(l.p.colorName)}, ${esc(l.p.fabric.toLowerCase())}</small>
          <p class="price"><b>${fmt(l.p.price)}</b><s>${fmt(l.p.mrp)}</s></p>
          <div class="acts"><span class="stepper" role="group" aria-label="Quantity for ${esc(l.p.name)}"><button data-act="qty" data-id="${l.p.id}" data-d="-1" aria-label="Decrease quantity">−</button><output>${l.qty}</output><button data-act="qty" data-id="${l.p.id}" data-d="1" aria-label="Increase quantity">+</button></span>
            <button class="lnk" data-act="save" data-id="${l.p.id}">Move to wishlist</button><button class="lnk bad" data-act="remove" data-id="${l.p.id}">Remove</button></div>
          ${l.qty >= maxFor(l.p) ? `<small class="low">Maximum available quantity</small>` : ''}</div>
        <div class="lt">${fmt(l.p.price * l.qty)}</div></div>`).join('')}
      <p style="margin-top:20px"><a class="lnk" href="#shop">← Continue shopping</a></p>
    </div>
    <aside class="sum"><h3>Order summary</h3>
      <div class="sum-line"><span>Subtotal (${t.count} item${t.count > 1 ? 's' : ''})</span><span>${fmt(t.subtotal)}</span></div>
      ${t.discount ? `<div class="sum-line save"><span>Coupon ${esc(S.coupon)}</span><span>−${fmt(t.discount)}</span></div>` : ''}
      <div class="sum-line"><span>Shipping</span><span>${t.shipping ? fmt(t.shipping) : 'Free'}</span></div>
      <div class="sum-line total"><span>Total</span><span>${fmt(t.total)}</span></div>
      ${t.savings > 0 ? `<p class="sum-line save"><span>You are saving ${fmt(t.savings)} on this order</span></p>` : ''}
      ${couponBox(t)}
      <a class="btn block" href="#checkout">Proceed to checkout</a><small>Free returns within 7 days.</small>
    </aside>
  </div>`;
  return {title: 'Cart', html};
}
