/* Wishlist toggle */
'use strict';

/* ---------- wishlist ---------- */
function toggleWish(id) {
  const i = S.wish.indexOf(id);
  if (i >= 0) { S.wish.splice(i, 1); toast('Removed from wishlist'); }
  else { S.wish.push(id); toast('Saved to wishlist'); }
  store.set('wish', S.wish); afterChange();
}
