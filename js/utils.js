/* Small helpers: DOM shortcuts, formatting, safe storage, toast messages */
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt = n => '₹' + Number(n).toLocaleString('en-IN');
const sum = (a, f) => a.reduce((t, x) => t + f(x), 0);
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
const today = () => new Date();
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', {day:'numeric', month:'short', year:'numeric'});
const fmtDay = d => d.toLocaleDateString('en-IN', {weekday:'short', day:'numeric', month:'short'});

/* storage that never throws (falls back to memory) */
const mem = {};
const store = {
  get(k, d) { try { const v = localStorage.getItem('sb_' + k); return v === null ? (k in mem ? mem[k] : d) : JSON.parse(v); } catch (e) { return k in mem ? mem[k] : d; } },
  set(k, v) { mem[k] = v; try { localStorage.setItem('sb_' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { delete mem[k]; try { localStorage.removeItem('sb_' + k); } catch (e) {} }
};
const sess = {
  get(k) { try { const v = sessionStorage.getItem('sb_' + k); return v ? JSON.parse(v) : (mem['s' + k] || null); } catch (e) { return mem['s' + k] || null; } },
  set(k, v) { mem['s' + k] = v; try { sessionStorage.setItem('sb_' + k, JSON.stringify(v)); } catch (e) {} },
  del(k) { delete mem['s' + k]; try { sessionStorage.removeItem('sb_' + k); } catch (e) {} }
};

function toast(msg, type = 'ok') {
  const box = $('#toasts'); if (!box) return;
  const t = document.createElement('div');
  t.className = 'toast ' + type; t.textContent = msg; box.appendChild(t);
  setTimeout(() => t.classList.add('out'), 3200);
  setTimeout(() => t.remove(), 3700);
}
