/* Login, register and forgot password pages */
'use strict';

/* ---------- AUTH ---------- */
function safeNext(q) { const n = q.get('next') || ''; return /^[a-z0-9\/_\-]{1,40}$/i.test(n) ? n : ''; }
function authArt(img) { return `<div class="auth-art"><img src="${img}" alt="" loading="lazy"></div>`; }
function pwField(id, name, label, auto, meter) {
  return `<div class="field"><label for="${id}">${label}</label><div class="pwrap"><input id="${id}" name="${name}" type="password" autocomplete="${auto}"${meter ? ' data-meter="1"' : ''}><button type="button" data-act="toggle-pw" aria-label="Show password">Show</button></div>${meter ? '<div class="meter" aria-hidden="true"><i></i></div>' : ''}</div>`;
}
function loginView(_, q) {
  if (currentUser()) return {redirect: '#account'};
  const next = safeNext(q);
  const html = `<div class="auth">${authArt(U('1610030469983-98e550d6193c', 900))}
    <form class="box" data-form="login" data-next="${esc(next)}" novalidate>
      <h1>Login</h1><p class="sub-note">Welcome back. Sign in to see your orders.</p>
      <div class="field"><label for="lg-email">Email</label><input id="lg-email" name="email" type="email" autocomplete="email"></div>
      ${pwField('lg-pw', 'password', 'Password', 'current-password')}
      <div class="check"><input type="checkbox" id="lg-rm" name="remember" checked><label for="lg-rm">Remember me</label></div>
      <button class="btn block" type="submit">Login</button>
      <p class="foot"><a class="lnk" href="#forgot">Forgot password?</a></p>
      <p class="foot">Don't have an account? <a class="lnk" href="#register${next ? '?next=' + esc(next) : ''}">Create account</a></p>
    </form></div>`;
  return {title: 'Login', html};
}
function registerView(_, q) {
  if (currentUser()) return {redirect: '#account'};
  const next = safeNext(q);
  const html = `<div class="auth">${authArt(U('1609748340041-f5d61e061ebc', 900))}
    <form class="box" data-form="register" data-next="${esc(next)}" novalidate>
      <h1>Create account</h1><p class="sub-note">Save your wishlist and track every order.</p>
      <div class="field"><label for="rg-name">Full name</label><input id="rg-name" name="name" type="text" autocomplete="name"></div>
      <div class="field"><label for="rg-email">Email</label><input id="rg-email" name="email" type="email" autocomplete="email"></div>
      <div class="field"><label for="rg-phone">Phone (10 digits)</label><input id="rg-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" autocomplete="tel-national"></div>
      ${pwField('rg-pw', 'password', 'Password', 'new-password', true)}
      ${pwField('rg-pc', 'confirm', 'Confirm password', 'new-password')}
      <div class="check"><input type="checkbox" id="rg-terms" name="terms"><label for="rg-terms">I agree to the <a class="lnk" href="#info/terms" target="_blank" rel="noopener">Terms &amp; Conditions</a></label></div>
      <button class="btn block" type="submit">Create account</button>
      <p class="foot">Already registered? <a class="lnk" href="#login${next ? '?next=' + esc(next) : ''}">Login</a></p>
    </form></div>`;
  return {title: 'Create account', html};
}
function forgotView() {
  const html = `<div class="auth">${authArt(U('1614881064213-180b1c28f743', 900))}
    <form class="box" data-form="forgot" novalidate>
      <h1>Reset password</h1><p class="sub-note">Demo store: no email is sent, so you can choose a new password right here for an account that exists in this browser.</p>
      <div class="field"><label for="fp-email">Email</label><input id="fp-email" name="email" type="email" autocomplete="email"></div>
      ${pwField('fp-pw', 'password', 'New password', 'new-password', true)}
      ${pwField('fp-pc', 'confirm', 'Confirm new password', 'new-password')}
      <button class="btn block" type="submit">Reset password</button>
      <p class="foot"><a class="lnk" href="#login">Back to login</a></p>
    </form></div>`;
  return {title: 'Reset password', html};
}
