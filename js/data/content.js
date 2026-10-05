/* Text content: seed reviews and policy pages (shipping, returns, privacy, terms) */
'use strict';

const SEED_REVIEWS = [
  {name:'Meera K.',  city:'Pune',    rating:5, text:'Better than the photos. The weave is fine and the pallu is beautifully finished.'},
  {name:'Anita D.',  city:'Nashik',  rating:5, text:'Wore it to a family wedding and got compliments all evening. Delivery was quick too.'},
  {name:'Priya I.',  city:'Chennai', rating:4, text:'Lovely fabric and the colour is exactly as shown. The pleats hold well.'},
  {name:'Sunita R.', city:'Mumbai',  rating:4, text:'A little heavier than I expected, but that is why it falls so well. Good value.'},
  {name:'Kavya S.',  city:'Hyderabad', rating:5, text:'Packed in muslin with a thank-you note. Will order again for Diwali.'},
  {name:'Farah N.',  city:'Bengaluru', rating:4, text:'Very good quality for the price. Border work is neat.'}
];
const seedReviewsFor = p => [0,1,2].map(i => SEED_REVIEWS[(p.id + i * 2) % SEED_REVIEWS.length]);

const INFO = {
  shipping:{title:'Shipping information', body:`<h2>Delivery time</h2><p>Orders are dispatched within 2 working days. Delivery across India takes 4 to 7 days after dispatch.</p><h2>Shipping charges</h2><p>Shipping is a flat ₹100. Orders of ₹5,000 and above ship free, and so does any order with the code FREESHIP.</p><h2>Tracking</h2><p>Every order is wrapped in muslin and sealed against damp. You can follow your order from the My account page.</p>`},
  returns:{title:'Returns and exchanges', body:`<h2>7-day returns</h2><ul><li>You can return an unworn saree with its tags within 7 days of delivery.</li><li>Refunds go back to your original payment method within 5 to 7 working days of us receiving the saree.</li><li>Exchanges are free, subject to stock.</li></ul><h2>What we cannot take back</h2><ul><li>Stitched or altered blouse pieces</li><li>Sarees that have been washed, worn or damaged</li></ul>`},
  privacy:{title:'Privacy policy', body:`<h2>What we collect</h2><p>Your name, email, phone, address and order details, only to process and deliver your order.</p><h2>How it is stored</h2><p>In this demo store, everything is saved only in your own browser. Nothing is sent to a server.</p><h2>Your choices</h2><p>You can clear all saved data at any time by clearing your browser's site data.</p>`},
  terms:{title:'Terms and conditions', body:`<h2>Products</h2><p>Handwoven sarees can show small variations in weave and colour. These are marks of the craft, not defects.</p><h2>Pricing</h2><p>All prices are in Indian rupees and include taxes. We may change prices without notice, but confirmed orders keep the price you paid.</p><h2>Demo notice</h2><p>This store is a demonstration. No real payment is taken and no goods are shipped.</p>`}
};
