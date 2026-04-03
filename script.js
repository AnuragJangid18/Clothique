// ─── NAV SCROLL ───
window.addEventListener('scroll', () => {
  document.getElementById('mainNav').classList.toggle('scrolled', window.scrollY > 20);
});

// ─── MOBILE MENU ───
function toggleMenu() {
  document.getElementById('mobileMenu').classList.toggle('open');
}

// ─── SCROLL REVEAL ───
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), 80 * (Array.from(revealEls).indexOf(e.target) % 4));
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObs.observe(el));

// ─── COLOR DOTS ───
document.querySelectorAll('.color-dot').forEach(dot => {
  dot.addEventListener('click', function() {
    this.closest('.product-colors').querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
    this.classList.add('active');
  });
});

// ─── CART STATE ───
let cartItems = [];
let cartCount = 0;
let cartTotalVal = 0;

function updateCartBadge() {
  document.getElementById('cartBadge').textContent = cartCount;
  document.getElementById('fabBadge').textContent = cartCount;
  document.getElementById('cartTotal').textContent = '₹' + cartTotalVal.toLocaleString('en-IN');
}

function addToCart(name, price) {
  cartCount++;
  cartTotalVal += price;
  cartItems.push({ name, price });
  updateCartBadge();
  renderCartItems();
  showToast(`${name} added to cart!`);
}

function renderCartItems() {
  const container = document.getElementById('cartItems');
  if (cartItems.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--mid-gray); margin-top:60px; font-family:var(--font-display); font-size:18px; font-style:italic">Your cart is empty.<br><span style="font-size:14px; font-style:normal; font-family:var(--font-body)">Start shopping to add items!</span></p>';
    return;
  }
  container.innerHTML = cartItems.map((item, i) => `
    <div class="cart-item">
      <div class="cart-item-img" style="display:flex;align-items:center;justify-content:center;font-size:28px;">👕</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-meta">Size: M &nbsp;·&nbsp; Qty: 1</div>
        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
      </div>
      <button onclick="removeFromCart(${i})" style="background:none;border:none;cursor:pointer;color:var(--mid-gray);align-self:flex-start;padding:4px;" title="Remove">✕</button>
    </div>
  `).join('');
}

function removeFromCart(i) {
  cartTotalVal -= cartItems[i].price;
  cartCount--;
  cartItems.splice(i, 1);
  updateCartBadge();
  renderCartItems();
}

function openCart() {
  document.getElementById('cartPanel').classList.add('open');
  document.getElementById('cartOverlay').classList.add('open');
}

function closeCart() {
  document.getElementById('cartPanel').classList.remove('open');
  document.getElementById('cartOverlay').classList.remove('open');
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

function wishlist(btn) {
  btn.style.background = '#C4583A';
  btn.style.color = '#fff';
  btn.style.opacity = '1';
  showToast('Added to Wishlist ♥');
}

// ─── CUSTOMIZER ───
let customQty = 1;
const basePrice = 1499;

function setColor(swatch) {
  document.querySelectorAll('#colorSwatches .swatch').forEach(s => s.classList.remove('active'));
  swatch.classList.add('active');
  const color = swatch.dataset.color;
  const textColor = swatch.dataset.text;
  document.getElementById('tshirtBody').setAttribute('fill', color);
  document.getElementById('tshirtSleeves').setAttribute('fill', color);
  document.getElementById('tshirtCollar').setAttribute('fill', color);
  document.getElementById('tshirtTextLayer').style.color = textColor;
}

function updateText(val) {
  document.getElementById('tshirtTextLayer').textContent = val || 'YOUR TEXT';
}

function setSize(btn) {
  document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function changeQty(delta) {
  customQty = Math.max(1, customQty + delta);
  document.getElementById('qtyVal').textContent = customQty;
  document.getElementById('customPrice').textContent = (basePrice * customQty).toLocaleString('en-IN');
}

function addCustomToCart() {
  const text = document.getElementById('tshirtTextInput').value || 'Custom Tee';
  const activeSize = document.querySelector('.size-btn.active')?.textContent || 'M';
  const name = `Custom Tee "${text}" (${activeSize})`;
  addToCart(name, basePrice * customQty);
}

// ─── SUBSCRIBE BUTTON ───
document.querySelector('.discount-btn').addEventListener('click', function() {
  const inp = this.previousElementSibling;
  if (inp.value.includes('@')) {
    showToast('🎉 Subscribed! Check your inbox for 20% off.');
    inp.value = '';
  } else {
    showToast('Please enter a valid email address.');
  }
});

// ─── NEWSLETTER FOOTER ───
document.querySelector('.newsletter-btn').addEventListener('click', function() {
  const inp = this.previousElementSibling;
  if (inp.value.includes('@')) {
    showToast('Thanks for subscribing!');
    inp.value = '';
  }
});
