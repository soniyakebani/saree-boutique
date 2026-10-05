/* Form validation helpers */
'use strict';

const RX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/,
  phone: /^[6-9]\d{9}$/,
  pin:   /^[1-9]\d{5}$/,
  upi:   /^[\w.\-]{2,}@[a-zA-Z]{2,}$/,
  name:  /^[A-Za-z][A-Za-z .'\-]{1,}$/
};
function luhn(num) {
  let s = 0, alt = false;
  for (let i = num.length - 1; i >= 0; i--) { let n = +num[i]; if (alt) { n *= 2; if (n > 9) n -= 9; } s += n; alt = !alt; }
  return s % 10 === 0;
}
function clearErrors(form) {
  $$('.err', form).forEach(e => e.remove());
  $$('[aria-invalid]', form).forEach(i => i.removeAttribute('aria-invalid'));
}
function setErr(form, name, msg) {
  const el = form.elements[name]; if (!el) return null;
  el.setAttribute('aria-invalid', 'true');
  const holder = el.closest('.pwrap') || el;
  const e = document.createElement('small'); e.className = 'err'; e.textContent = msg; e.setAttribute('role', 'alert');
  holder.insertAdjacentElement('afterend', e);
  return el;
}
/* run rules: [name, test(value)->message|''] ; returns true if all valid */
function validate(form, rules) {
  clearErrors(form); let first = null;
  rules.forEach(([name, fn]) => {
    const el = form.elements[name]; if (!el) return;
    const v = el.type === 'checkbox' ? el.checked : String(el.value).trim();
    const msg = fn(v, el);
    if (msg) { const e = setErr(form, name, msg); if (!first) first = e; }
  });
  if (first) { first.focus(); return false; }
  return true;
}
const req = m => v => v ? '' : m;
const pwStrength = pw => {
  let s = 0; if (pw.length >= 8) s++; if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++; if (/\d/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};
const pwOk = v => v.length < 8 ? 'Use at least 8 characters.' : (!/[A-Za-z]/.test(v) || !/\d/.test(v)) ? 'Use letters and at least one number.' : '';
