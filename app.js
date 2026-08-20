const PRODUCTS = [
  { id:'maria-noir', name:'Maria Noir', category:'Eau de Parfum', gender:'Unisex', family:'Woody Amber', size:50, price:1499, rating:4.8, reviews:42, badge:'Bestseller', image:'assets/products/maria-noir.webp', notes:['Oud','Amber','Sandalwood'], description:'A deep, polished fragrance built around warm woods, amber and a refined oud trail.' },
  { id:'rose-velvet', name:'Rose Velvet', category:'Eau de Parfum', gender:'Women', family:'Floral', size:50, price:1299, rating:4.7, reviews:31, badge:'New', image:'assets/products/rose-velvet.webp', notes:['Rose','Jasmine','Musk'], description:'Soft rose and jasmine wrapped in clean musk for an elegant everyday signature.' },
  { id:'amber-oud', name:'Amber Oud', category:'Attar', gender:'Unisex', family:'Oud', size:12, price:899, rating:4.9, reviews:57, badge:'Best Rated', image:'assets/products/amber-oud.webp', notes:['Oud','Amber','Leather'], description:'Concentrated attar with a rich oud opening and a warm amber dry-down.' },
  { id:'citrus-veil', name:'Citrus Veil', category:'Eau de Parfum', gender:'Unisex', family:'Citrus', size:50, price:1199, rating:4.6, reviews:24, badge:'Fresh', image:'assets/products/citrus-veil.webp', notes:['Bergamot','Orange','Vetiver'], description:'Bright bergamot and orange balanced by clean vetiver for a fresh signature.' },
  { id:'midnight-musk', name:'Midnight Musk', category:'Eau de Parfum', gender:'Men', family:'Woody Musk', size:100, price:1899, rating:4.8, reviews:36, badge:'Icon', image:'assets/products/midnight-musk.webp', notes:['Musk','Patchouli','Cedar'], description:'A confident evening fragrance with smooth musk, cedar and earthy patchouli.' },
  { id:'discovery-set', name:'Maria Discovery Set', category:'Discovery Set', gender:'Unisex', family:'Collection', size:5, price:999, rating:4.9, reviews:18, badge:'Gift Pick', image:'assets/products/discovery-set.webp', notes:['Five signatures','Travel sizes'], description:'Five curated Maria signatures in a presentation-ready discovery collection.' }
];

const state = { query:'', category:'All', sort:'featured', cart: JSON.parse(localStorage.getItem('maria-cart') || '{}') };

const money = value => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(value);
const saveCart = () => localStorage.setItem('maria-cart', JSON.stringify(state.cart));
const cartItems = () => Object.entries(state.cart).map(([id,qty]) => ({ product: PRODUCTS.find(p=>p.id===id), qty })).filter(x=>x.product);
const cartCount = () => cartItems().reduce((sum,x)=>sum+x.qty,0);
const cartTotal = () => cartItems().reduce((sum,x)=>sum+x.product.price*x.qty,0);

function productCard(p){
  return `<article class="product-card" data-product="${p.id}">
    <a class="product-media" href="product.html?id=${p.id}" aria-label="View ${p.name}"><img src="${p.image}" alt="${p.name} perfume bottle" loading="lazy"><span class="badge">${p.badge}</span></a>
    <div class="product-copy"><div class="eyebrow">${p.family} · ${p.size}${p.category==='Attar'?'ml':'ml'}</div><h3>${p.name}</h3><p>${p.notes.join(' · ')}</p><div class="product-row"><strong>${money(p.price)}</strong><button class="add-btn" data-add="${p.id}">Add to bag</button></div><div class="rating">★ ${p.rating} <span>(${p.reviews})</span></div></div>
  </article>`;
}

function renderProducts(){
  const grid=document.querySelector('#productGrid'); if(!grid)return;
  let items=PRODUCTS.filter(p=> (state.category==='All'||p.category===state.category) && `${p.name} ${p.family} ${p.notes.join(' ')}`.toLowerCase().includes(state.query.toLowerCase()));
  if(state.sort==='price-low') items.sort((a,b)=>a.price-b.price); if(state.sort==='price-high') items.sort((a,b)=>b.price-a.price); if(state.sort==='rating') items.sort((a,b)=>b.rating-a.rating);
  grid.innerHTML=items.map(productCard).join('') || `<div class="empty-state">No fragrances match your search.</div>`;
  document.querySelector('#resultCount').textContent=`${items.length} fragrances`;
}

function renderCart(){
  const items=cartItems(), drawer=document.querySelector('#cartDrawer'), list=document.querySelector('#cartItems');
  if(!list)return;
  list.innerHTML=items.length?items.map(({product:p,qty})=>`<div class="cart-item"><img src="${p.image}" alt=""><div><strong>${p.name}</strong><small>${money(p.price)} · ${p.size}ml</small><div class="qty"><button data-minus="${p.id}">−</button><span>${qty}</span><button data-plus="${p.id}">+</button></div></div><strong>${money(p.price*qty)}</strong></div>`).join(''):`<div class="empty-state">Your bag is waiting for a good decision.</div>`;
  document.querySelectorAll('[data-cart-count]').forEach(el=>el.textContent=cartCount());
  document.querySelector('#cartTotal').textContent=money(cartTotal());
  document.querySelector('#cartSubtotal').textContent=money(cartTotal());
  if(drawer) drawer.classList.toggle('open', drawer.dataset.open==='true');
}

function addToCart(id){state.cart[id]=(state.cart[id]||0)+1;saveCart();renderCart();document.querySelector('#cartDrawer').dataset.open='true';renderCart();}
function changeQty(id,delta){state.cart[id]=(state.cart[id]||0)+delta;if(state.cart[id]<=0)delete state.cart[id];saveCart();renderCart();}
function openCart(){document.querySelector('#cartDrawer').dataset.open='true';renderCart();}
function closeCart(){document.querySelector('#cartDrawer').dataset.open='false';renderCart();}

function boot(){
  document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>addToCart(b.dataset.add));
  document.querySelectorAll('[data-plus]').forEach(b=>b.onclick=()=>changeQty(b.dataset.plus,1));
  document.querySelectorAll('[data-minus]').forEach(b=>b.onclick=()=>changeQty(b.dataset.minus,-1));
  renderCart();
}

document.addEventListener('input',e=>{if(e.target.matches('#search')){state.query=e.target.value;renderProducts();}});
document.addEventListener('change',e=>{if(e.target.matches('#category')){state.category=e.target.value;renderProducts();}if(e.target.matches('#sort')){state.sort=e.target.value;renderProducts();}});
document.addEventListener('click',e=>{const add=e.target.closest('[data-add]');if(add){e.preventDefault();addToCart(add.dataset.add)}if(e.target.closest('[data-cart-open]'))openCart();if(e.target.closest('[data-cart-close]'))closeCart();if(e.target.matches('#cartBackdrop'))closeCart();});

document.addEventListener('DOMContentLoaded',()=>{renderProducts();boot();});
