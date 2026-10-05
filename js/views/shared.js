/* View helpers shared by all pages (route state, 404 page) */
'use strict';

let currentRoute = {name: 'home'};
let cleanup = [];
const notFound = () => ({title: 'Page not found', html: `<div class="wrap" style="padding:90px 0"><h1>We could not find that page</h1><p class="lead" style="margin:14px 0 24px">The link may be old or mistyped.</p><a class="btn" href="#home">Back to home</a> <a class="btn ghost" href="#shop">Browse sarees</a></div>`});
