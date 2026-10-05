/* Shop page: filters, sorting, search */
'use strict';

/* ---------- SHOP ---------- */
let shop = null;
function parseShop(q) {
  const cat = q.get('cat'), price = q.get('price');
  return {
    cat: CATS[cat] ? cat : 'all',
    price: (price === 'custom' || (price && BANDS[Number(price)])) ? price : 'all',
    min: q.get('min') || '', max: q.get('max') || '',
    colors: new Set((q.get('color') || '').split(',').filter(c => COLORS[c])),
    fabrics: new Set((q.get('fabric') || '').split(',').filter(f => FABRICS.includes(f))),
    occ: new Set((q.get('occ') || '').split(',').filter(o => OCCASIONS.includes(o))),
    q: q.get('q') || '',
    sort: ['price-asc','price-desc','rating','discount','newest','popular'].includes(q.get('sort')) ? q.get('sort') : 'featured'
  };
}
function shopHash() {
  const p = new URLSearchParams();
  if (shop.cat !== 'all') p.set('cat', shop.cat);
  if (shop.price !== 'all') p.set('price', shop.price);
  if (shop.price === 'custom') { if (shop.min) p.set('min', shop.min); if (shop.max) p.set('max', shop.max); }
  if (shop.colors.size) p.set('color', [...shop.colors].join(','));
  if (shop.fabrics.size) p.set('fabric', [...shop.fabrics].join(','));
  if (shop.occ.size) p.set('occ', [...shop.occ].join(','));
  if (shop.q) p.set('q', shop.q);
  if (shop.sort !== 'featured') p.set('sort', shop.sort);
  const s = p.toString(); return '#shop' + (s ? '?' + s : '');
}
function passes(p) {
  if (shop.cat !== 'all' && p.cat !== shop.cat) return false;
  if (shop.price === 'custom') {
    const mn = Number(shop.min) || 0, mx = Number(shop.max) || Infinity;
    if (p.price < mn || p.price > mx) return false;
  } else if (shop.price !== 'all') {
    const [a, b] = BANDS[Number(shop.price)]; const last = Number(shop.price) === 7;
    if (p.price < a || (last ? p.price > b : p.price >= b)) return false;
  }
  if (shop.colors.size && !shop.colors.has(p.color)) return false;
  if (shop.fabrics.size && !shop.fabrics.has(p.fabric)) return false;
  if (shop.occ.size && !p.occ.some(o => shop.occ.has(o))) return false;
  if (shop.q) {
    const hay = [p.name, p.cat, p.fabric, p.colorName, p.occ.join(' '), p.origin].join(' ').toLowerCase();
    if (!shop.q.toLowerCase().split(/\s+/).filter(Boolean).every(w => hay.includes(w))) return false;
  }
  return true;
}
function sorted(list) {
  const a = [...list];
  switch (shop.sort) {
    case 'price-asc': return a.sort((x, y) => x.price - y.price);
    case 'price-desc': return a.sort((x, y) => y.price - x.price);
    case 'rating': return a.sort((x, y) => ratingOf(y).avg - ratingOf(x).avg);
    case 'discount': return a.sort((x, y) => pct(y) - pct(x));
    case 'newest': return a.sort((x, y) => Number(y.isNew) - Number(x.isNew) || y.id - x.id);
    case 'popular': return a.sort((x, y) => y.sold - x.sold);
    default: return a;
  }
}
function shopChips() {
  const c = [];
  if (shop.cat !== 'all') c.push(['cat', CATS[shop.cat].name]);
  if (shop.price === 'custom') c.push(['price', `${shop.min ? fmt(shop.min) : '₹0'} – ${shop.max ? fmt(shop.max) : 'any'}`]);
  else if (shop.price !== 'all') c.push(['price', bandLabel(Number(shop.price))]);
  shop.colors.forEach(x => c.push(['color:' + x, COLOR_LABEL[x]]));
  shop.fabrics.forEach(x => c.push(['fabric:' + x, x]));
  shop.occ.forEach(x => c.push(['occ:' + x, x]));
  if (shop.q) c.push(['q', `“${shop.q}”`]);
  return c;
}
function applyShop(push) {
  const list = sorted(PRODUCTS.filter(passes));
  const grid = $('#grid'); if (!grid) return;
  grid.innerHTML = list.map(card).join('');
  $('#count').textContent = `Showing ${list.length} of ${PRODUCTS.length} sarees`;
  $('#empty').hidden = list.length > 0; grid.hidden = list.length === 0;
  const chips = shopChips();
  $('#chips').innerHTML = chips.map(([k, l]) => `<button class="chip" data-act="rm-chip" data-k="${esc(k)}" aria-label="Remove filter ${esc(l)}">${esc(l)} ✕</button>`).join('') + (chips.length ? `<button class="lnk" data-act="reset-filters">Clear all</button>` : '');
  $('#shopTitle').textContent = shop.cat === 'all' ? 'Shop sarees' : CATS[shop.cat].name + ' sarees';
  try { history.replaceState(null, '', shopHash()); } catch (e) {}
  refreshStates();
}
function syncShopControls() {
  const f = $('#filters'); if (!f) return;
  $$('input[name=cat]', f).forEach(i => i.checked = i.value === shop.cat);
  $$('input[name=price]', f).forEach(i => i.checked = i.value === shop.price);
  $$('input[data-set]', f).forEach(i => i.checked = shop[i.dataset.set].has(i.value));
  $('#pmin').value = shop.price === 'custom' ? shop.min : ''; $('#pmax').value = shop.price === 'custom' ? shop.max : '';
  $('#sort').value = shop.sort; $('#shopQ').value = shop.q;
}
function shopView(_, q) {
  shop = parseShop(q);
  const html = `
  <div class="page-head"><div class="wrap"><h1 id="shopTitle">Shop sarees</h1>
    <p>${PRODUCTS.length} handpicked weaves, all between ₹1,000 and ₹8,000, with two to three sarees in every price band and colour. Pick a category, a price band, a colour or search by fabric.</p>
    <form class="shop-search" data-form="shopsearch"><input type="search" id="shopQ" placeholder="Search by fabric, colour or occasion" aria-label="Search sarees" autocomplete="off"><button class="btn" type="submit">Search</button></form>
  </div></div>
  <div class="wrap shop">
    <form class="filters" id="filters" onsubmit="return false" aria-label="Filters">
      <fieldset><legend>Category</legend>
        <div class="opt"><input type="radio" name="cat" id="cat-all" value="all"><label for="cat-all">All sarees</label></div>
        ${Object.entries(CATS).map(([k, c]) => `<div class="opt"><input type="radio" name="cat" id="cat-${k}" value="${k}"><label for="cat-${k}">${c.name}</label></div>`).join('')}
      </fieldset>
      <fieldset><legend>Price</legend>
        <div class="opt"><input type="radio" name="price" id="pr-all" value="all"><label for="pr-all">All prices</label></div>
        ${[1,2,3,4,5,6,7].map(i => `<div class="opt"><input type="radio" name="price" id="pr-${i}" value="${i}"><label for="pr-${i}">${bandLabel(i)}</label></div>`).join('')}
        <div class="range"><input type="number" id="pmin" min="0" placeholder="Min ₹" aria-label="Minimum price"><span>to</span><input type="number" id="pmax" min="0" placeholder="Max ₹" aria-label="Maximum price"></div>
      </fieldset>
      <fieldset><legend>Colour</legend>
        ${Object.keys(COLORS).map(c => `<div class="opt"><input type="checkbox" id="co-${c}" data-set="colors" value="${c}"><label for="co-${c}"><i class="sw" style="background:${COLORS[c]}"></i>${COLOR_LABEL[c]}</label></div>`).join('')}
      </fieldset>
      <fieldset><legend>Fabric</legend>
        ${FABRICS.map(f => `<div class="opt"><input type="checkbox" id="fa-${f}" data-set="fabrics" value="${f}"><label for="fa-${f}">${f}</label></div>`).join('')}
      </fieldset>
      <fieldset><legend>Occasion</legend>
        ${OCCASIONS.map(o => `<div class="opt"><input type="checkbox" id="oc-${o.replace(/\s/g, '')}" data-set="occ" value="${o}"><label for="oc-${o.replace(/\s/g, '')}">${o}</label></div>`).join('')}
      </fieldset>
      <button class="btn ghost block" type="button" data-act="reset-filters">Reset filters</button>
    </form>
    <div>
      <div class="toolbar"><div class="left"><button class="btn ghost sm filter-toggle" data-act="filters-toggle" aria-expanded="false">Filters</button><p id="count" aria-live="polite"></p></div>
        <label>Sort by <select class="sort" id="sort"><option value="featured">Featured</option><option value="popular">Best selling</option><option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option><option value="discount">Biggest discount</option></select></label></div>
      <div class="chips" id="chips"></div>
      <div class="grid" id="grid"></div>
      <div class="empty" id="empty" hidden><h3>No sarees match these filters</h3><p>Try a wider price range or remove a filter.</p><button class="btn" data-act="reset-filters">Clear all filters</button></div>
    </div>
  </div>`;
  return {title: 'Shop sarees', html, mount() { syncShopControls(); applyShop(); }};
}
