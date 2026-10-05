/* Store settings: shipping fee, coupons, categories, filters, price bands */
'use strict';

const U = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=75`;
const FALLBACK = 'data:image/svg+xml;utf8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7A1F2B"/><stop offset="1" stop-color="#C9A227"/></linearGradient></defs><rect width="300" height="400" fill="url(#g)"/><rect x="14" y="14" width="272" height="372" fill="none" stroke="#FFF9F2" stroke-opacity=".6" stroke-width="2"/><text x="150" y="205" text-anchor="middle" font-family="Georgia,serif" font-size="26" fill="#FFF9F2">Saree Boutique</text></svg>');

const SHIP_FEE = 100, FREE_SHIP_AT = 5000, MAX_QTY = 10;
const COUPONS = {
  SHUBH10:  {pct:10, min:2000, label:'10% off orders above ₹2,000'},
  WELCOME5: {pct:5,  min:0,    label:'5% off your order'},
  FREESHIP: {ship:true, min:0, label:'Free shipping'}
};
const CATS = {
  silk:     {name:'Silk',     blurb:'Kanjivaram, mulberry',   img:U('1614881064213-180b1c28f743')},
  paithani: {name:'Paithani', blurb:'Peacock pallus',         img:U('1609748340041-f5d61e061ebc')},
  banarasi: {name:'Banarasi', blurb:'Brocade and katan',      img:U('1610030469983-98e550d6193c')},
  cotton:   {name:'Cotton',   blurb:'Handloom, chanderi',     img:U('1610030469978-6bb537f3b982')},
  designer: {name:'Designer', blurb:'Organza and sequins',    img:U('1692992193981-d3d92fabd9cb')},
  wedding:  {name:'Wedding',  blurb:'Bridal zari heirlooms',  img:U('1633685894176-9f715a092b79')}
};
const COLORS = {red:'#a41630', green:'#0F5B45', blue:'#1d4c7a', pink:'#d1527d', black:'#1b1b1f', neutral:'#d9c07a'};
const COLOR_LABEL = {red:'Red and maroon', green:'Green', blue:'Blue', pink:'Pink and magenta', black:'Black', neutral:'Gold, ivory and mustard'};
const FABRICS = ['Silk','Cotton','Georgette','Organza'];
const OCCASIONS = ['Wedding','Festive','Party','Daily wear'];
const BANDS = [null,[1000,2000],[2000,3000],[3000,4000],[4000,5000],[5000,6000],[6000,7000],[7000,8000]];
const bandLabel = i => `${fmt(BANDS[i][0])} – ${fmt(BANDS[i][1])}`;
