/* Order tracking page */
'use strict';

/* ---------- ORDER / ACCOUNT ---------- */
const STAGES = ['Placed', 'Packed', 'Shipped', 'Delivered'];
function orderStage(o) {
  if (o.status === 'Cancelled') return -1;
  const h = (Date.now() - o.ts) / 36e5;
  return h < 1 ? 0 : h < 24 ? 1 : h < 96 ? 2 : 3;
}
function orderView([id], q) {
  const o = S.orders.find(x => x.id === id); if (!o) return notFound();
  const st = orderStage(o), isNew = q.get('new') === '1';
  const eta = new Date(o.ts + 7 * 864e5), eta0 = new Date(o.ts + 4 * 864e5);
  const html = `
  <div class="wrap">
    ${isNew ? `<div class="done-head no-print"><div class="tickmark"></div><h1>Thank you, ${esc(o.address.first)}!</h1><p class="lead" style="margin:10px auto 0">Your order <b>${esc(o.id)}</b> is confirmed. We will wrap your saree in muslin and dispatch it within 2 working days.</p></div>` : `<div class="crumbs"><a href="#account">My account</a> / Order ${esc(o.id)}</div>`}
    <div class="cart" style="padding-top:26px">
      <div>
        <h2 style="font-size:1.7rem">Order ${esc(o.id)} <span class="status ${o.status === 'Cancelled' ? 'Cancelled' : ''}">${st === -1 ? 'Cancelled' : STAGES[st]}</span></h2>
        <p><small>Placed on ${fmtDate(o.ts)}. ${st === -1 ? '' : st === 3 ? 'Delivered.' : `Estimated delivery ${fmtDay(eta0)} to ${fmtDay(eta)}.`} Status updates in this demo are simulated over time.</small></p>
        ${st === -1 ? '' : `<ol class="timeline">${STAGES.map((s, i) => `<li class="${i <= st ? 'done' : ''}">${s}</li>`).join('')}</ol>`}
        ${o.items.map(i => `<div class="line"><a href="#product/${i.id}"><img src="${i.img}" alt="${esc(i.name)}"></a><div><h3>${esc(i.name)}</h3><small>${esc(i.colorName)}, qty ${i.qty}</small></div><div class="lt">${fmt(i.price * i.qty)}</div></div>`).join('')}
        <div class="no-print" style="display:flex;gap:14px;flex-wrap:wrap;margin-top:22px">
          <button class="btn ghost sm" data-act="print">Print invoice</button>
          ${st >= 0 && st < 2 ? `<button class="btn ghost sm" data-act="cancel-order" data-id="${esc(o.id)}">Cancel order</button>` : ''}
          <a class="btn sm" href="#shop">Continue shopping</a></div>
      </div>
      <aside class="sum" style="position:static"><h3>Summary</h3>
        <div class="sum-line"><span>Subtotal</span><span>${fmt(o.subtotal)}</span></div>
        ${o.discount ? `<div class="sum-line save"><span>Coupon ${esc(o.coupon)}</span><span>−${fmt(o.discount)}</span></div>` : ''}
        <div class="sum-line"><span>Shipping</span><span>${o.shipping ? fmt(o.shipping) : 'Free'}</span></div>
        <div class="sum-line total"><span>Total</span><span>${fmt(o.total)}</span></div>
        <hr style="border:0;border-top:1px solid var(--line);margin:14px 0">
        <p><b>Delivery address</b><br>${esc(o.address.first)} ${esc(o.address.last)}<br>${esc(o.address.address)}<br>${esc(o.address.city)}, ${esc(o.address.state)} ${esc(o.address.pin)}<br>${esc(o.address.phone)}</p>
        <p style="margin-top:10px"><b>Payment</b><br>${esc(o.payment)}</p>
      </aside>
    </div>
  </div>`;
  return {title: 'Order ' + o.id, html};
}
