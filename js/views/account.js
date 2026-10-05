/* My account page */
'use strict';

function accountView() {
  const u = currentUser();
  if (!u) return {redirect: '#login?next=account'};
  const orders = S.orders.filter(o => o.email === u.email);
  const html = `
  <div class="page-head"><div class="wrap"><h1>My account</h1><p>Signed in as ${esc(u.email)}.</p></div></div>
  <div class="wrap acct">
    <form class="panel" data-form="profile" novalidate><h3 style="margin-bottom:14px">Profile</h3>
      <div class="field"><label for="pf-name">Full name</label><input id="pf-name" name="name" type="text" value="${esc(u.name)}"></div>
      <div class="field"><label for="pf-phone">Phone</label><input id="pf-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" value="${esc(u.phone || '')}"></div>
      <div class="field"><label>Email</label><input type="email" value="${esc(u.email)}" disabled></div>
      <button class="btn" type="submit">Save changes</button> <button class="btn ghost" type="button" data-act="logout">Log out</button></form>
    <div><h2 style="font-size:1.6rem;margin-bottom:16px">My orders</h2>
      ${orders.length ? orders.map(o => { const st = orderStage(o); return `<div class="order"><div><b><a href="#order/${esc(o.id)}">${esc(o.id)}</a></b> <span class="status ${o.status === 'Cancelled' ? 'Cancelled' : ''}">${st === -1 ? 'Cancelled' : STAGES[st]}</span><br><small>${fmtDate(o.ts)}, ${sum(o.items, i => i.qty)} item(s): ${esc(o.items.map(i => i.name).join(', ').slice(0, 90))}</small></div><div style="text-align:right"><b>${fmt(o.total)}</b><br><a class="lnk" href="#order/${esc(o.id)}">View</a></div></div>`; }).join('')
      : `<div class="panel"><p>You have not placed any orders yet.</p><p style="margin-top:12px"><a class="btn" href="#shop">Start shopping</a></p></div>`}
    </div>
  </div>`;
  return {title: 'My account', html};
}
