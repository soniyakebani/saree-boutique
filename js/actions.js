/* Click, keyboard and input handlers (data-act buttons) */
'use strict';

function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) return navigator.clipboard.writeText(text);
  return new Promise((res, rej) => {
    try { const t = document.createElement('textarea'); t.value = text; t.style.position = 'fixed'; t.style.opacity = '0'; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); res(); }
    catch (e) { rej(e); }
  });
}
function pq() { return Number(($('#pq') || {}).textContent) || 1; }

const ACTIONS = {
  add(el) { const p = byId(el.dataset.id); if (addToCart(p.id, 1)) toast(`${p.name} added to cart`); },
  wish(el) { toggleWish(Number(el.dataset.id)); },
  qty(el) { const id = Number(el.dataset.id); setQty(id, cartQty(id) + Number(el.dataset.d)); },
  remove(el) { setQty(Number(el.dataset.id), 0); toast('Removed from cart'); },
  save(el) { const id = Number(el.dataset.id); if (!S.wish.includes(id)) { S.wish.push(id); store.set('wish', S.wish); } setQty(id, 0); toast('Moved to wishlist'); },
  drawer() { openDrawer(); },
  'drawer-close'() { closeDrawer(); },
  menu(el) { const n = $('#nav'); const on = n.classList.toggle('open'); el.setAttribute('aria-expanded', on); },
  'hero-next'() { heroGo && heroGo.next(); },
  'hero-prev'() { heroGo && heroGo.prev(); },
  'hero-go'(el) { heroGo && heroGo(Number(el.dataset.i)); },
  'copy-coupon'(el) {
    const code = el.dataset.code;
    copyText(code).catch(() => {}).then(() => { S.coupon = code; store.set('coupon', code); toast(`${code} copied and applied. It works on orders above ₹2,000.`); });
  },
  'rm-coupon'() { S.coupon = null; store.del('coupon'); toast('Coupon removed'); afterChange(); },
  'filters-toggle'(el) { const f = $('#filters'), on = f.classList.toggle('open'); el.setAttribute('aria-expanded', on); },
  'reset-filters'() { shop = parseShop(new URLSearchParams()); syncShopControls(); applyShop(); },
  'rm-chip'(el) {
    const k = el.dataset.k;
    if (k === 'cat') shop.cat = 'all'; else if (k === 'price') { shop.price = 'all'; shop.min = shop.max = ''; } else if (k === 'q') shop.q = '';
    else { const [set, v] = k.split(':'); shop[set === 'color' ? 'colors' : set === 'fabric' ? 'fabrics' : 'occ'].delete(v); }
    syncShopControls(); applyShop();
  },
  view(el) {
    const p = byId(el.dataset.id), i = Number(el.dataset.v), box = $('#pimg'), main = $('#pmain');
    const gal = (p && p.gallery && p.gallery.length) ? p.gallery : [p.img, p.img, p.img];
    box.classList.remove('zooming'); main.src = gal[i] || gal[0];
    $$('.thumb').forEach(t => t.classList.toggle('on', t === el));
  },
  pq(el) { const p = byId(currentRoute.args[0]); const o = $('#pq'); o.textContent = Math.max(1, Math.min(maxFor(p), pq() + Number(el.dataset.d))); },
  padd(el) { const p = byId(el.dataset.id); if (addToCart(p.id, pq())) toast(`${p.name} added to cart`); },
  pbuy(el) { const p = byId(el.dataset.id); const need = pq(); const have = cartQty(p.id); if (have < need) addToCart(p.id, need - have, {drawer: false}); location.hash = '#checkout'; },
  share(el) {
    const p = byId(el.dataset.id), url = location.href;
    if (navigator.share) navigator.share({title: p.name, url}).catch(() => {});
    else copyText(url).then(() => toast('Link copied'), () => toast('Could not copy the link', 'warn'));
  },
  rate(el) {
    const n = Number(el.dataset.n), form = el.closest('form');
    form.elements.rating.value = n;
    $$('.starpick button', form).forEach(b => { const on = Number(b.dataset.n) <= n; b.classList.toggle('on', on); b.setAttribute('aria-checked', Number(b.dataset.n) === n); });
    const e = $('.starpick + input + .err', form); if (e) e.remove();
  },
  'toggle-pw'(el) { const i = el.parentElement.querySelector('input'); const show = i.type === 'password'; i.type = show ? 'text' : 'password'; el.textContent = show ? 'Hide' : 'Show'; el.setAttribute('aria-label', show ? 'Hide password' : 'Show password'); },
  logout() { clearSession(); renderAccountMenu(); toast('You have been logged out'); if (currentRoute.name === 'account') location.hash = '#home'; else renderRoute(true); },
  'wish-all'() { let n = 0; S.wish.forEach(id => { if (addToCart(id, 1, {drawer: false})) n++; }); if (n) { toast(`${n} saree${n > 1 ? 's' : ''} added to cart`); openDrawer(); } },
  'wish-clear'() { S.wish = []; store.set('wish', S.wish); afterChange(); },
  'cancel-order'(el) {
    if (!confirm('Cancel this order?')) return;
    const o = S.orders.find(x => x.id === el.dataset.id); if (o) { o.status = 'Cancelled'; store.set('orders', S.orders); toast('Order cancelled'); renderRoute(true); }
  },
  print() { window.print(); }
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (el && ACTIONS[el.dataset.act]) {
    if (el.tagName === 'A' && el.dataset.act === 'drawer-close') { closeDrawer(); return; }
    e.preventDefault(); ACTIONS[el.dataset.act](el); return;
  }
  const sc = e.target.closest('[data-scroll]');
  if (sc) {
    const id = sc.dataset.scroll === '1' ? sc.getAttribute('href').slice(1) : sc.dataset.scroll;
    const tgt = document.getElementById(id);
    if (tgt) { e.preventDefault(); tgt.scrollIntoView({behavior: 'smooth', block: 'start'}); } return;
  }
  if (e.target.id === 'overlay') closeDrawer();
  // close search suggestions when clicking elsewhere
  if (!e.target.closest('.search')) $$('.suggest').forEach(s => s.hidden = true);
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeDrawer(); $$('.suggest').forEach(s => s.hidden = true); }
  if (e.key === 'Tab' && $('#drawer').classList.contains('on')) {
    const f = $$('#drawer a[href], #drawer button:not([disabled])').filter(n => n.offsetParent !== null); if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
window.addEventListener('scroll', () => $('#toTop').classList.toggle('on', window.scrollY > 600), {passive: true});
$('#toTop').addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
// broken images fall back to a branded placeholder
document.addEventListener('error', e => {
  const t = e.target;
  if (t && t.tagName === 'IMG' && t.src !== FALLBACK && !t.dataset.fb) { t.dataset.fb = '1'; t.src = FALLBACK; }
}, true);

/* ---------- input / change handlers ---------- */
document.addEventListener('change', e => {
  const t = e.target;
  if (t.closest('#filters')) {
    if (t.name === 'cat') shop.cat = t.value;
    else if (t.name === 'price') { shop.price = t.value; shop.min = shop.max = ''; $('#pmin').value = $('#pmax').value = ''; }
    else if (t.dataset.set) { t.checked ? shop[t.dataset.set].add(t.value) : shop[t.dataset.set].delete(t.value); }
    else if (t.id === 'pmin' || t.id === 'pmax') customPrice();
    applyShop();
  }
  if (t.id === 'sort') { shop.sort = t.value; applyShop(); }
  if (t.name === 'pay') {
    ['upi', 'card', 'cod'].forEach(k => { const p = $('#panel-' + k); if (p) p.hidden = ('pay-' + k) !== t.id; });
  }
});
function customPrice() {
  const mn = $('#pmin').value, mx = $('#pmax').value;
  if (mn || mx) { shop.price = 'custom'; shop.min = mn; shop.max = mx; $$('#filters input[name=price]').forEach(i => i.checked = false); }
  else { shop.price = 'all'; shop.min = shop.max = ''; $('#pr-all').checked = true; }
}
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.fmt === 'card') { const d = t.value.replace(/\D/g, '').slice(0, 19); t.value = d.replace(/(.{4})/g, '$1 ').trim(); }
  if (t.dataset.fmt === 'exp') { let d = t.value.replace(/\D/g, '').slice(0, 4); if (d.length >= 3) d = d.slice(0, 2) + '/' + d.slice(2); t.value = d; }
  if (['ck-phone','ck-pin','rg-phone','ct-phone','pf-phone'].includes(t.id) || t.name === 'pin' && t.closest('.pin')) t.value = t.value.replace(/\D/g, '');
  if (t.dataset.meter) {
    const s = pwStrength(t.value), bar = t.closest('.field').querySelector('.meter i');
    if (bar) { bar.style.width = (t.value ? Math.max(s, 1) * 25 : 0) + '%'; bar.style.background = ['#b3261e', '#b3261e', '#d88a1b', '#7aa32c', '#1f7a4d'][s]; }
  }
  if (t.id === 'shopQ') debounceShopQ(t.value);
  if (t.closest('.search') && t.name === 'q') suggest(t);
  if (t.id === 'pmin' || t.id === 'pmax') debounceCustom();
});
const debounceShopQ = debounce(v => { if (shop) { shop.q = v.trim(); applyShop(); } }, 200);
const debounceCustom = debounce(() => { if (shop) { customPrice(); applyShop(); } }, 400);

/* ---------- header search + suggestions ---------- */
function suggest(input) {
  const box = input.parentElement.querySelector('.suggest'), q = input.value.trim().toLowerCase();
  if (!q) { box.hidden = true; return; }
  const hits = PRODUCTS.filter(p => [p.name, p.colorName, p.fabric, p.cat].join(' ').toLowerCase().includes(q)).slice(0, 5);
  box.innerHTML = hits.length
    ? hits.map(p => `<a href="#product/${p.id}"><img src="${p.img}" alt=""><span>${esc(p.name)}<br><small>${fmt(p.price)}</small></span></a>`).join('') + `<a href="#shop?q=${encodeURIComponent(input.value.trim())}"><b>See all results for “${esc(input.value.trim())}”</b></a>`
    : `<p>No sarees found for “${esc(input.value.trim())}”.</p>`;
  box.hidden = false;
}
document.addEventListener('click', e => { if (e.target.closest('.suggest a')) { $$('.suggest').forEach(s => s.hidden = true); $$('.search input').forEach(i => i.value = ''); } });
