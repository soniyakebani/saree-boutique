# Saree Boutique

Handwoven saree store. Plain HTML, CSS and JavaScript: no build step, no server.

## Run it
Open `index.html` in a browser (or use VS Code Live Server). Cart, wishlist, accounts and orders are saved in the browser (localStorage). There is no real payment or email.

## Project structure
```
saree-boutique/
├── index.html
├── css/
│   ├── base.css         global styles, typography, buttons
│   ├── header.css       header and navigation
│   ├── home.css         hero, categories, product cards, offers, reviews
│   ├── shop.css         shop page and product details
│   ├── forms.css        form fields
│   ├── cart.css         cart and checkout
│   ├── footer.css       newsletter and footer
│   └── responsive.css   mobile and tablet rules
├── js/
│   ├── utils.js         helpers, storage, toasts
│   ├── data/
│   │   ├── products.js  PRODUCT LIST (edit products, prices, images here)
│   │   ├── config.js    coupons, shipping fee, categories, filters
│   │   └── content.js   seed reviews, policy page text
│   ├── state.js         app state
│   ├── auth.js          accounts and sessions
│   ├── cart.js          cart logic and totals
│   ├── wishlist.js
│   ├── ui.js            product card, cart drawer, badges
│   ├── validation.js    form validation
│   ├── views/           one file per page
│   │   ├── shared.js  home.js  shop.js  product.js  cart.js  checkout.js
│   │   └── order.js  account.js  wishlist.js  auth.js  pages.js
│   ├── router.js        hash router
│   ├── actions.js       click / keyboard / input handlers
│   ├── forms.js         form submit handlers
│   └── main.js          starts the app
└── images/              your own product photos
```

## Notes
- The scripts share one global scope, so the order of the `<script>` tags in `index.html` matters. If you add a file, load it before the files that use it.
- To use your own photos, put them in `images/` and set `img: "images/saree-01.jpg"` in `js/data/products.js`.
- Coupon codes to try: `SHUBH10`, `WELCOME5`, `FREESHIP`.
