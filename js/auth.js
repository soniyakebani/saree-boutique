/* Accounts: password hashing and login session */
'use strict';

/* ---------- auth ---------- */
async function hashPw(pw) {
  try {
    if (window.crypto && crypto.subtle) {
      const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode('sb::' + pw));
      return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
    }
  } catch (e) {}
  let h = 5381; const s = 'sb::' + pw;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return 'f' + h.toString(16);
}
function currentUser() {
  const email = store.get('session', null) || sess.get('session');
  return email ? S.users.find(u => u.email === email) || null : null;
}
function setSession(email, remember) {
  store.del('session'); sess.del('session');
  if (remember) store.set('session', email); else sess.set('session', email);
}
function clearSession() { store.del('session'); sess.del('session'); }
