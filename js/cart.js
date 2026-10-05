/* Cart: add, change quantity, totals, coupons */
'use strict';

/* ---------- cart ---------- */
const cartQty = id => { const l = S.cart.find(x => x.id === id); return l ? l.qty : 0; };
const cartCount = () => sum(S.cart, l => l.qty);
const maxFor = p => Math.min(p.stock, MAX_QTY);
function saveCart() { store.set('cart', S.cart); }

function addToCart(id, qty = 1, opts = {}) {
  const p = byId(id); if (!p) return false;
  const cur = cartQty(p.id), max = maxFor(p);
  if (cur >= max) { toast(`You already have the maximum available (${max}) of this saree.`, 'warn'); return false; }
  const add = Math.min(qty, max - cur);
  if (add < qty) toast(`Only ${max} available, so we added ${add}.`, 'warn');
  const l = S.cart.find(x => x.id === p.id);
  if (l) l.qty += add; else S.cart.push({id: p.id, qty: add});
  saveCart(); afterChange();
  if (opts.drawer !== false) openDrawer();
  return true;
}
function setQty(id, qty) {
  const p = byId(id); if (!p) return;
  qty = Math.max(0, Math.min(qty, maxFor(p)));
  if (qty === 0) S.cart = S.cart.filter(l => l.id !== id);
  else { const l = S.cart.find(x => x.id === id); if (l) l.qty = qty; }
  saveCart(); afterChange();
}
function totals() {
  const items = S.cart.map(l => ({...l, p: byId(l.id)})).filter(l => l.p);
  const subtotal = sum(items, l => l.p.price * l.qty);
  const mrpTotal = sum(items, l => l.p.mrp * l.qty);
  const c = S.coupon ? COUPONS[S.coupon] : null;
  let discount = 0, freeShip = false, couponNote = '';
  if (c) {
    if (subtotal >= c.min && items.length) {
      if (c.pct) discount = Math.round(subtotal * c.pct / 100);
      if (c.ship) freeShip = true;
    } else couponNote = `Add ${fmt(c.min - subtotal)} more to use ${S.coupon}.`;
  }
  const after = subtotal - discount;
  const shipping = !items.length ? 0 : (freeShip || after >= FREE_SHIP_AT ? 0 : SHIP_FEE);
  return {items, count: sum(items, l => l.qty), subtotal, mrpTotal, discount, shipping, total: after + shipping,
          savings: (mrpTotal - subtotal) + discount, couponNote, toFree: Math.max(0, FREE_SHIP_AT - after)};
}
