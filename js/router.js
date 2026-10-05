/* Hash router: picks the page to show */
'use strict';

const VIEWS = {home: homeView, shop: shopView, product: productView, cart: cartView, checkout: checkoutView,
  order: orderView, account: accountView, wishlist: wishlistView, login: loginView, register: registerView,
  forgot: forgotView, about: aboutView, contact: contactView, info: infoView};

function parseHash() {
  const raw = decodeURIComponent(location.hash.replace(/^#\/?/, '') || 'home');
  const qi = raw.indexOf('?');
  const path = qi >= 0 ? raw.slice(0, qi) : raw, qs = qi >= 0 ? raw.slice(qi + 1) : '';
  const parts = path.split('/').filter(Boolean);
  return {name: parts[0] || 'home', args: parts.slice(1), q: new URLSearchParams(qs)};
}
function renderRoute(keepScroll) {
  cleanup.forEach(f => { try { f(); } catch (e) {} }); cleanup = [];
  const r = parseHash(); currentRoute = r;
  const fn = VIEWS[r.name];
  let out;
  try { out = fn ? fn(r.args, r.q) : notFound(); }
  catch (err) { console.error(err); out = {title: 'Something went wrong', html: `<div class="wrap" style="padding:90px 0"><h1>Something went wrong</h1><p class="lead" style="margin:14px 0 24px">Please try again.</p><a class="btn" href="#home">Back to home</a></div>`}; }
  if (out.redirect) { location.replace(out.redirect); return; }
  const app = $('#app'), y = window.scrollY;
  app.innerHTML = out.html;
  document.title = out.title + ' | Saree Boutique';
  if (keepScroll) window.scrollTo(0, y); else { window.scrollTo(0, 0); }
  $$('.nav a[data-nav]').forEach(a => a.removeAttribute('aria-current'));
  const navKey = r.name === 'shop' && r.q.get('cat') ? '' : r.name;
  const cur = $(`.nav a[data-nav="${navKey}"]`); if (cur) cur.setAttribute('aria-current', 'page');
  if (out.mount) out.mount();
  refreshStates();
  const nav = $('#nav'); nav.classList.remove('open'); $('[data-act="menu"]').setAttribute('aria-expanded', 'false');
  if (!keepScroll) closeDrawer();
}
function refreshView() {
  const act = document.activeElement, sel = act && act.dataset && act.dataset.act
    ? `[data-act="${act.dataset.act}"]${act.dataset.id ? `[data-id="${act.dataset.id}"]` : ''}${act.dataset.d ? `[data-d="${act.dataset.d}"]` : ''}` : null;
  renderRoute(true);
  if (sel) { const n = $('#app ' + sel); if (n) n.focus(); }
}
window.addEventListener('hashchange', () => renderRoute(false));
