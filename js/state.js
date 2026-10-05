/* App state loaded from localStorage */
'use strict';

const S = {
  cart:   store.get('cart', []),
  wish:   store.get('wish', []),
  users:  store.get('users', []),
  orders: store.get('orders', []),
  reviews:store.get('reviews', {}),
  coupon: store.get('coupon', null),
  recent: store.get('recent', []),
  subs:   store.get('subs', []),
  msgs:   store.get('msgs', [])
};
// clean any stale data (e.g. product removed from the list)
S.cart = S.cart.filter(l => byId(l.id) && l.qty > 0);
S.wish = S.wish.filter(id => byId(id));
