const API_BASE = 'http://localhost:3000/api';

function getToken() {
  return localStorage.getItem('bena_token');
}

function setToken(token) {
  if (token) localStorage.setItem('bena_token', token);
  else localStorage.removeItem('bena_token');
}

function getUser() {
  try {
    const u = localStorage.getItem('bena_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
}

function setUser(user) {
  if (user) localStorage.setItem('bena_user', JSON.stringify(user));
  else localStorage.removeItem('bena_user');
}

function isLoggedIn() {
  return !!getToken();
}

function isAdmin() {
  const u = getUser();
  return !!(u && u.isAdmin);
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'home.html';
    return true;
  }
  return false;
}

function apiHeaders() {
  const h = { 'Content-Type': 'application/json' };
  const t = getToken();
  if (t) h['Authorization'] = 'Bearer ' + t;
  return h;
}

async function fetchApi(path, options = {}) {
  const res = await fetch(API_BASE + path, { ...options, headers: { ...apiHeaders(), ...options.headers } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || res.statusText);
  return data;
}

function getCart() {
  try {
    const c = localStorage.getItem('bena_cart');
    return c ? JSON.parse(c) : [];
  } catch {
    return [];
  }
}

function setCart(items) {
  localStorage.setItem('bena_cart', JSON.stringify(items));
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const i = cart.find(x => x.productId === product._id);
  if (i) i.quantity += quantity;
  else cart.push({ productId: product._id, name: product.name, price: product.price, image: product.image, quantity });
  setCart(cart);
}

function removeFromCart(productId) {
  setCart(getCart().filter(x => x.productId !== productId));
}

function updateCartQty(productId, quantity) {
  const cart = getCart();
  const i = cart.find(x => x.productId === productId);
  if (!i) return;
  if (quantity <= 0) removeFromCart(productId);
  else { i.quantity = quantity; setCart(cart); }
}

function cartTotal() {
  return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0);
}

function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href') || '';
    a.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}
