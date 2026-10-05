/* Checkout page */
'use strict';

/* ---------- CHECKOUT ---------- */
const STATES = ['Andhra Pradesh','Assam','Bihar','Chhattisgarh','Delhi','Goa','Gujarat','Haryana','Jharkhand','Karnataka','Kerala','Madhya Pradesh','Maharashtra','Odisha','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','Uttarakhand','West Bengal','Other'];
function lastAddress(u) {
  if (!u) return {};
  const o = S.orders.find(o => o.email === u.email); return o ? o.address : {};
}
function checkoutView() {
  const t = totals();
  if (!t.items.length) return {title: 'Checkout', html: `<div class="page-head"><div class="wrap"><h1>Checkout</h1></div></div><div class="wrap empty" style="padding:60px 24px 100px"><h3>Your cart is empty</h3><p>Add a saree before checking out.</p><a class="btn" href="#shop">Browse sarees</a></div>`};
  const u = currentUser(), a = lastAddress(u);
  const [fn, ...rest] = (u ? u.name : '').split(' ');
  const v = {first: a.first || fn || '', last: a.last || rest.join(' ') || '', email: u ? u.email : '', phone: a.phone || (u ? u.phone : '') || '', address: a.address || '', city: a.city || '', state: a.state || 'Maharashtra', pin: a.pin || ''};
  const html = `
  <div class="page-head"><div class="wrap"><h1>Checkout</h1><p>${u ? `Ordering as ${esc(u.email)}.` : `Checking out as a guest. <a class="lnk" href="#login?next=checkout">Log in</a> to fill this in automatically.`}</p></div></div>
  <div class="wrap chk">
    <form id="checkoutForm" data-form="checkout" novalidate autocomplete="on">
      <h3>Customer information</h3>
      <div class="two"><div class="field"><label for="ck-first">First name</label><input id="ck-first" name="first" type="text" value="${esc(v.first)}" autocomplete="given-name"></div>
        <div class="field"><label for="ck-last">Last name</label><input id="ck-last" name="last" type="text" value="${esc(v.last)}" autocomplete="family-name"></div></div>
      <div class="two"><div class="field"><label for="ck-email">Email</label><input id="ck-email" name="email" type="email" value="${esc(v.email)}" autocomplete="email"></div>
        <div class="field"><label for="ck-phone">Phone (10 digits)</label><input id="ck-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" value="${esc(v.phone)}" autocomplete="tel-national"></div></div>
      <div class="field"><label for="ck-address">Address</label><input id="ck-address" name="address" type="text" value="${esc(v.address)}" autocomplete="street-address"></div>
      <div class="two"><div class="field"><label for="ck-city">City</label><input id="ck-city" name="city" type="text" value="${esc(v.city)}" autocomplete="address-level2"></div>
        <div class="field"><label for="ck-state">State</label><select id="ck-state" name="state">${STATES.map(s => `<option${s === v.state ? ' selected' : ''}>${s}</option>`).join('')}</select></div></div>
      <div class="field" style="max-width:240px"><label for="ck-pin">PIN code</label><input id="ck-pin" name="pin" type="text" inputmode="numeric" maxlength="6" value="${esc(v.pin)}" autocomplete="postal-code"></div>

      <h3>Payment method</h3>
      <div class="pay" role="radiogroup" aria-label="Payment method">
        <div class="opt"><input type="radio" name="pay" id="pay-upi" value="UPI" checked><label for="pay-upi">UPI</label></div>
        <div class="opt"><input type="radio" name="pay" id="pay-card" value="Card"><label for="pay-card">Credit or debit card</label></div>
        <div class="opt"><input type="radio" name="pay" id="pay-cod" value="Cash on delivery"><label for="pay-cod">Cash on delivery</label></div>
      </div>
      <div class="pay-panel" id="panel-upi"><div class="field"><label for="ck-upi">UPI ID</label><input id="ck-upi" name="upi" type="text" placeholder="name@bank" autocomplete="off"><span class="hint">Demo store: no request is sent to your UPI app.</span></div></div>
      <div class="pay-panel" id="panel-card" hidden>
        <div class="field"><label for="ck-cname">Name on card</label><input id="ck-cname" name="cname" type="text" autocomplete="cc-name"></div>
        <div class="field"><label for="ck-cnum">Card number</label><input id="ck-cnum" name="cnum" type="text" inputmode="numeric" maxlength="23" placeholder="4111 1111 1111 1111" data-fmt="card" autocomplete="cc-number"></div>
        <div class="two"><div class="field"><label for="ck-exp">Expiry (MM/YY)</label><input id="ck-exp" name="exp" type="text" inputmode="numeric" maxlength="5" placeholder="08/29" data-fmt="exp" autocomplete="cc-exp"></div>
          <div class="field"><label for="ck-cvv">CVV</label><input id="ck-cvv" name="cvv" type="password" inputmode="numeric" maxlength="4" autocomplete="cc-csc"></div></div>
        <span class="hint">Demo store: card details are checked for format only and never stored.</span></div>
      <div class="pay-panel" id="panel-cod" hidden><p class="hint">Pay in cash when your saree arrives. Available on orders up to ₹10,000.</p></div>
      <div class="check" style="margin-top:20px"><input type="checkbox" id="ck-terms" name="terms"><label for="ck-terms">I agree to the <a class="lnk" href="#info/terms" target="_blank" rel="noopener">terms and conditions</a></label></div>
      <button class="btn" type="submit">Place order</button>
    </form>
    <aside class="sum"><h3>Order summary</h3>
      ${t.items.map(l => `<div class="mini"><span>${esc(l.p.name)} × ${l.qty}</span><span>${fmt(l.p.price * l.qty)}</span></div>`).join('')}
      <hr style="border:0;border-top:1px solid var(--line);margin:10px 0">
      <div class="sum-line"><span>Subtotal</span><span>${fmt(t.subtotal)}</span></div>
      ${t.discount ? `<div class="sum-line save"><span>Coupon ${esc(S.coupon)}</span><span>−${fmt(t.discount)}</span></div>` : ''}
      <div class="sum-line"><span>Shipping</span><span>${t.shipping ? fmt(t.shipping) : 'Free'}</span></div>
      <div class="sum-line total"><span>Total</span><span>${fmt(t.total)}</span></div>
      <p style="margin-top:10px"><a class="lnk" href="#cart">Edit cart</a></p>
    </aside>
  </div>`;
  return {title: 'Checkout', html};
}
