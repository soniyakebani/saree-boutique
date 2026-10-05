/* About, Contact and policy pages */
'use strict';

/* ---------- STATIC PAGES ---------- */
function aboutView() {
  return {title: 'Our story', html: `
  <div class="page-head"><div class="wrap"><h1>Our story</h1><p>A family shop that got tired of seeing weavers paid last.</p></div></div>
  <div class="wrap about"><div><h2>Three generations, one loom at a time</h2>
    <p>Saree Boutique began as a single counter in a textile market, selling sarees our grandmother bought straight from weavers she knew by name. We kept that habit: we still buy directly from weaving clusters and pay on delivery of the cloth, not sixty days later.</p>
    <p>Our philosophy is simple. A saree should be worn for decades, so we choose fabric that ages well, dyes that hold, and zari that stays bright. We inspect every piece for weave, colour and finish before it is folded.</p>
    <p>Traditional craftsmanship is the point, not the marketing. When a design is woven by hand it takes days, and we tell you which days.</p>
    <a class="btn" href="#shop">Explore the collection</a></div>
    <img src="${U('1609748340041-f5d61e061ebc')}" alt="A woman in an emerald green handwoven saree" loading="lazy"></div>
  <div class="sec alt"><div class="wrap"><h2 style="margin-bottom:28px">How every saree reaches you</h2>
    <ol class="process"><li><b>Sourced</b><span>Bought directly from weaving families.</span></li><li><b>Inspected</b><span>Checked by hand for flaws and colour.</span></li><li><b>Wrapped</b><span>Folded in muslin, sealed against damp.</span></li><li><b>Delivered</b><span>Tracked to your door in 4 to 7 days.</span></li></ol></div></div>
  <div class="sec"><div class="wrap why"><div><h2>Our commitment</h2><p class="lead" style="margin-top:12px">If you are not delighted, we will make it right.</p></div>
    <ul class="ticks"><li><b>Premium quality</b><span>Only fabric we would wear ourselves.</span></li><li><b>Authentic designs</b><span>Traditional motifs, correctly woven.</span></li><li><b>Affordable pricing</b><span>Fair to the weaver and to you.</span></li><li><b>Secure packaging</b><span>Arrives crisp and dry.</span></li><li><b>Easy returns</b><span>Seven days, no awkward questions.</span></li><li><b>Fast delivery</b><span>Dispatched in two days.</span></li></ul></div></div>`};
}
function contactView() {
  const u = currentUser();
  return {title: 'Contact us', html: `
  <div class="page-head"><div class="wrap"><h1>Contact us</h1><p>Ask about a fabric, a colour match or an order. We reply within one working day.</p></div></div>
  <div class="wrap contact">
    <form data-form="contact" novalidate>
      <div id="contactMsg" aria-live="polite"></div>
      <div class="two"><div class="field"><label for="ct-name">Name</label><input id="ct-name" name="name" type="text" value="${u ? esc(u.name) : ''}" autocomplete="name"></div>
        <div class="field"><label for="ct-email">Email</label><input id="ct-email" name="email" type="email" value="${u ? esc(u.email) : ''}" autocomplete="email"></div></div>
      <div class="two"><div class="field"><label for="ct-phone">Phone (optional)</label><input id="ct-phone" name="phone" type="tel" inputmode="numeric" maxlength="10" value="${u ? esc(u.phone || '') : ''}" autocomplete="tel-national"></div>
        <div class="field"><label for="ct-subject">Subject</label><input id="ct-subject" name="subject" type="text"></div></div>
      <div class="field"><label for="ct-msg">Message</label><textarea id="ct-msg" name="message" rows="6" maxlength="1000"></textarea></div>
      <button class="btn" type="submit">Send message</button>
    </form>
    <ul class="info-list">
      <li><span>📍</span><div><b>Store address</b>12 Weaver's Lane, Old Market, Your City 411001</div></li>
      <li><span>📞</span><div><b>Phone</b><a class="lnk" href="tel:+919876543210">+91 98765 43210</a></div></li>
      <li><span>✉</span><div><b>Email</b><a class="lnk" href="mailto:hello@sareeboutique.example">hello@sareeboutique.example</a></div></li>
      <li><span>🕐</span><div><b>Business hours</b>Mon to Sat, 10 am to 8 pm. Closed Sunday.</div></li>
    </ul>
  </div>`};
}
function infoView([key]) {
  const i = INFO[key]; if (!i) return notFound();
  return {title: i.title, html: `<div class="page-head"><div class="wrap"><h1>${i.title}</h1></div></div><div class="wrap prose">${i.body}</div>`};
}
