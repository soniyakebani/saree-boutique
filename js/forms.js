/* Form submit handlers */
'use strict';

const FORMS = {
  search(f) { const v = f.elements.q.value.trim(); $$('.suggest').forEach(s => s.hidden = true); location.hash = '#shop' + (v ? '?q=' + encodeURIComponent(v) : ''); f.elements.q.blur(); },
  shopsearch(f) { shop.q = f.querySelector('#shopQ').value.trim(); applyShop(); },
  newsletter(f) {
    const email = f.elements.email.value.trim().toLowerCase(), msg = $('#newsMsg');
    if (!RX.email.test(email)) { msg.textContent = 'Please enter a valid email address.'; msg.style.color = '#ffb4ab'; return; }
    if (S.subs.includes(email)) { msg.textContent = 'You are already subscribed.'; msg.style.color = '#F2D98A'; return; }
    S.subs.push(email); store.set('subs', S.subs); f.reset(); msg.textContent = 'Thank you for subscribing!'; msg.style.color = '#9be3b4'; toast('Subscribed. Thank you!');
  },
  pincode(f) {
    const v = f.elements.pin.value.trim(), m = $('#pinMsg');
    if (!RX.pin.test(v)) { m.className = 'pin-msg bad'; m.textContent = 'Enter a valid 6-digit PIN code.'; return; }
    const a = new Date(), b = new Date();
    a.setDate(a.getDate() + 4); b.setDate(b.getDate() + 7);
    m.className = 'pin-msg ok'; m.textContent = `Delivery to ${v}: ${fmtDay(a)} to ${fmtDay(b)}. Cash on delivery available.`;
  },
  coupon(f) {
    const code = f.elements.code.value.trim().toUpperCase(), c = COUPONS[code];
    if (!code) { toast('Enter a coupon code', 'warn'); return; }
    if (!c) { toast('That coupon code is not valid', 'bad'); return; }
    const t = totals();
    if (t.subtotal < c.min) { toast(`${code} needs an order of ${fmt(c.min)} or more`, 'warn'); return; }
    S.coupon = code; store.set('coupon', code); toast(`${code} applied: ${c.label}`); afterChange();
  },
  review(f) {
    const ok = validate(f, [
      ['rating', v => v ? '' : 'Please choose a star rating.'],
      ['name', v => v.length < 2 ? 'Please enter your name.' : ''],
      ['text', v => v.length < 10 ? 'Please write at least 10 characters.' : '']
    ]);
    if (!ok) return;
    const p = byId(f.dataset.id);
    const r = {name: f.elements.name.value.trim(), rating: Number(f.elements.rating.value), text: f.elements.text.value.trim(), date: Date.now(), verified: hasBought(p.id)};
    (S.reviews[p.id] = S.reviews[p.id] || []).push(r); store.set('reviews', S.reviews);
    $('#revList').innerHTML = reviewListHtml(p); f.elements.text.value = ''; f.elements.rating.value = '';
    $$('.starpick button', f).forEach(b => { b.classList.remove('on'); b.setAttribute('aria-checked', 'false'); });
    toast('Thank you for your review!'); refreshStates();
  },
  contact(f) {
    const ok = validate(f, [
      ['name', v => v.length < 2 ? 'Please enter your name.' : ''],
      ['email', v => RX.email.test(v) ? '' : 'Enter a valid email address.'],
      ['phone', v => !v || RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number.'],
      ['subject', req('Please add a subject.')],
      ['message', v => v.length < 10 ? 'Please write at least 10 characters.' : '']
    ]);
    if (!ok) return;
    S.msgs.push({id: Date.now(), name: f.elements.name.value.trim(), email: f.elements.email.value.trim(), phone: f.elements.phone.value.trim(), subject: f.elements.subject.value.trim(), message: f.elements.message.value.trim()});
    store.set('msgs', S.msgs);
    $('#contactMsg').innerHTML = `<div class="form-msg" role="status"><b>Thank you, ${esc(f.elements.name.value.trim())}.</b> Your message has been sent. We will reply within one working day.</div>`;
    f.elements.subject.value = ''; f.elements.message.value = ''; toast('Message sent');
  },
  async register(f) {
    const ok = validate(f, [
      ['name', v => !RX.name.test(v) ? 'Please enter your full name.' : ''],
      ['email', v => !RX.email.test(v) ? 'Enter a valid email address.' : S.users.some(u => u.email === v.toLowerCase()) ? 'An account with this email already exists.' : ''],
      ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number.'],
      ['password', pwOk],
      ['confirm', (v, el) => v !== f.elements.password.value ? 'Passwords do not match.' : ''],
      ['terms', v => v ? '' : 'Please accept the terms to continue.']
    ]);
    if (!ok) return;
    const user = {id: Date.now(), name: f.elements.name.value.trim(), email: f.elements.email.value.trim().toLowerCase(), phone: f.elements.phone.value.trim(), hash: await hashPw(f.elements.password.value)};
    S.users.push(user); store.set('users', S.users); setSession(user.email, true); renderAccountMenu();
    toast(`Welcome, ${user.name.split(' ')[0]}!`); location.hash = '#' + (f.dataset.next || 'account');
  },
  async login(f) {
    const ok = validate(f, [['email', v => RX.email.test(v) ? '' : 'Enter a valid email address.'], ['password', req('Enter your password.')]]);
    if (!ok) return;
    const email = f.elements.email.value.trim().toLowerCase(), u = S.users.find(x => x.email === email);
    const good = u && u.hash === await hashPw(f.elements.password.value);
    if (!good) { clearErrors(f); const e = setErr(f, 'password', 'Incorrect email or password.'); if (e) e.focus(); return; }
    setSession(u.email, f.elements.remember.checked); renderAccountMenu();
    toast(`Welcome back, ${u.name.split(' ')[0]}!`); location.hash = '#' + (f.dataset.next || 'account');
  },
  async forgot(f) {
    const ok = validate(f, [['email', v => RX.email.test(v) ? '' : 'Enter a valid email address.'], ['password', pwOk], ['confirm', v => v !== f.elements.password.value ? 'Passwords do not match.' : '']]);
    if (!ok) return;
    const u = S.users.find(x => x.email === f.elements.email.value.trim().toLowerCase());
    if (!u) { clearErrors(f); const e = setErr(f, 'email', 'No account found with this email in this browser.'); if (e) e.focus(); return; }
    u.hash = await hashPw(f.elements.password.value); store.set('users', S.users);
    toast('Password updated. Please log in.'); location.hash = '#login';
  },
  profile(f) {
    const ok = validate(f, [['name', v => !RX.name.test(v) ? 'Please enter your full name.' : ''], ['phone', v => !v || RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number.']]);
    if (!ok) return;
    const u = currentUser(); u.name = f.elements.name.value.trim(); u.phone = f.elements.phone.value.trim(); store.set('users', S.users);
    renderAccountMenu(); toast('Profile updated');
  },
  checkout(f) {
    const pay = f.elements.pay.value, t = totals();
    if (!t.items.length) { toast('Your cart is empty', 'warn'); location.hash = '#cart'; return; }
    const rules = [
      ['first', v => !RX.name.test(v) ? 'Enter your first name.' : ''],
      ['last', v => !RX.name.test(v) ? 'Enter your last name.' : ''],
      ['email', v => RX.email.test(v) ? '' : 'Enter a valid email address.'],
      ['phone', v => RX.phone.test(v) ? '' : 'Enter a valid 10-digit mobile number.'],
      ['address', v => v.length < 6 ? 'Enter your full address.' : ''],
      ['city', v => v.length < 2 ? 'Enter your city.' : ''],
      ['state', req('Choose your state.')],
      ['pin', v => RX.pin.test(v) ? '' : 'Enter a valid 6-digit PIN code.']
    ];
    if (pay === 'UPI') rules.push(['upi', v => RX.upi.test(v) ? '' : 'Enter a valid UPI ID, like name@bank.']);
    if (pay === 'Card') rules.push(
      ['cname', v => v.length < 2 ? 'Enter the name on the card.' : ''],
      ['cnum', v => { const d = v.replace(/\s/g, ''); return d.length >= 13 && d.length <= 19 && luhn(d) ? '' : 'Enter a valid card number.'; }],
      ['exp', v => {
        const m = /^(\d{2})\/(\d{2})$/.exec(v); if (!m) return 'Use MM/YY.';
        const mo = +m[1], yr = 2000 + +m[2], now = today();
        if (mo < 1 || mo > 12) return 'Enter a valid month.';
        return (yr < now.getFullYear() || (yr === now.getFullYear() && mo < now.getMonth() + 1)) ? 'This card has expired.' : '';
      }],
      ['cvv', v => /^\d{3,4}$/.test(v) ? '' : 'Enter the 3 or 4 digit CVV.']);
    if (pay === 'Cash on delivery' && t.total > 10000) rules.push(['pin', () => 'Cash on delivery is available only up to ₹10,000.']);
    rules.push(['terms', v => v ? '' : 'Please accept the terms to place your order.']);
    if (!validate(f, rules)) return;
    const u = currentUser();
    const digits = pay === 'Card' ? f.elements.cnum.value.replace(/\s/g, '') : '';
    const order = {
      id: 'SB' + String(Date.now()).slice(-8) + Math.floor(Math.random() * 90 + 10),
      ts: Date.now(), status: 'Placed', email: (u ? u.email : f.elements.email.value.trim().toLowerCase()),
      items: t.items.map(l => ({id: l.p.id, name: l.p.name, colorName: l.p.colorName, price: l.p.price, qty: l.qty, img: l.p.img})),
      subtotal: t.subtotal, discount: t.discount, coupon: t.discount ? S.coupon : '', shipping: t.shipping, total: t.total,
      payment: pay === 'Card' ? `Card ending ${digits.slice(-4)}` : pay === 'UPI' ? `UPI (${f.elements.upi.value.trim()})` : pay,
      address: {first: f.elements.first.value.trim(), last: f.elements.last.value.trim(), phone: f.elements.phone.value.trim(), address: f.elements.address.value.trim(), city: f.elements.city.value.trim(), state: f.elements.state.value, pin: f.elements.pin.value.trim()}
    };
    S.orders.unshift(order); store.set('orders', S.orders);
    S.cart = []; saveCart(); S.coupon = null; store.del('coupon');
    updateBadges(); renderDrawer();
    location.hash = '#order/' + order.id + '?new=1';
  }
};
document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]'); if (!f) return;
  e.preventDefault();
  const fn = FORMS[f.dataset.form]; if (fn) fn(f);
});
