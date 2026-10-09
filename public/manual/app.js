/**
 * STYLE-RENT: PURE VANILLA JAVASCRIPT ARCHITECTURE
 * Hand-written client application without external frameworks or build tools.
 */

// -------------------------------------------------------------
// 1. STATE MANAGEMENT
// -------------------------------------------------------------
let globalDuration = 1; // Default 1-Day Rental
let activeCategory = 'All';
let cart = [];
let userMembership = {
  planName: 'None',
  depositWaiver: 0 // percentage
};
let currentOrder = null;

// -------------------------------------------------------------
// 2. MOCK PRODUCT CATALOG
// -------------------------------------------------------------
const PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Imperial Crimson Velvet Sherwani',
    category: 'Royal Sherwani',
    tagline: 'Hand-zardozi embroidered with raw silk dhoti & stole',
    retailPrice: 58000,
    rental3Days: 2499,
    securityDeposit: 3000,
    image: '/assets/images/maroon_achkan_dhoti_1791404123213.jpg',
    sameDay: true
  },
  {
    id: 'prod-2',
    name: 'Midnight Black 3-Piece Tuxedo',
    category: 'Tuxedos & Suits',
    tagline: 'Satin peak lapel, wool-blend jacket, vest & trousers',
    retailPrice: 42000,
    rental3Days: 1899,
    securityDeposit: 2500,
    image: '/assets/images/emerald_velvet_tuxedo_1791404221729.jpg',
    sameDay: true
  },
  {
    id: 'prod-3',
    name: 'Lord Krishna Pitambari Costume',
    category: 'Costumes',
    tagline: 'Authentic theatrical ensemble with peacock crown & flute',
    retailPrice: 22000,
    rental3Days: 999,
    securityDeposit: 1500,
    image: '/assets/images/krishna_costume_1791404140168.jpg',
    sameDay: true
  },
  {
    id: 'prod-4',
    name: 'Italian Double-Breasted Pinstripe Suit',
    category: 'College Formals',
    tagline: 'Bespoke corporate cut, perfect for college placements',
    retailPrice: 28000,
    rental3Days: 1299,
    securityDeposit: 1800,
    image: '/assets/images/pinstripe_double_suit_1791404178297.jpg',
    sameDay: true
  },
  {
    id: 'prod-5',
    name: 'Taupe Executive Power Suit',
    category: 'College Formals',
    tagline: 'Sharp slim-fit power silhouette for debates & presentations',
    retailPrice: 24000,
    rental3Days: 1199,
    securityDeposit: 1500,
    image: '/assets/images/taupe_power_suit_1791404163130.jpg',
    sameDay: true
  },
  {
    id: 'prod-6',
    name: 'Heritage Raw Silk Bandhgala Jodhpuri',
    category: 'Royal Sherwani',
    tagline: 'Royal crest buttons with structured equestrian cut',
    retailPrice: 38000,
    rental3Days: 1799,
    securityDeposit: 2200,
    image: '/assets/images/brown_blazer_suit_1791404152977.jpg',
    sameDay: true
  }
];

// -------------------------------------------------------------
// 3. UTILITY FUNCTIONS & PRICING FORMULAS
// -------------------------------------------------------------
function formatINR(val) {
  return '₹' + Math.round(val).toLocaleString('en-IN');
}

/**
 * Calculates rental price based on duration:
 * 1 Day = 65% of 3-day base price
 * 3 Days = 100% of base price
 * 7 Days = 160% of base price
 * 10 Days = 210% of base price
 */
function calculateRentalPrice(base3DayPrice, duration) {
  switch (duration) {
    case 1: return Math.round(base3DayPrice * 0.65);
    case 3: return base3DayPrice;
    case 7: return Math.round(base3DayPrice * 1.6);
    case 10: return Math.round(base3DayPrice * 2.1);
    default: return base3DayPrice;
  }
}

// -------------------------------------------------------------
// 4. CATALOG RENDERING
// -------------------------------------------------------------
function renderProducts() {
  const container = document.getElementById('productsGrid');
  if (!container) return;

  const searchQuery = document.getElementById('searchInput')?.value.toLowerCase() || '';

  const filtered = PRODUCTS.filter(p => {
    const matchesCategory = (activeCategory === 'All' || p.category === activeCategory);
    const matchesSearch = p.name.toLowerCase().includes(searchQuery) ||
                          p.category.toLowerCase().includes(searchQuery) ||
                          p.tagline.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 40px; color: #78716C;">
      No outfits found matching your search.
    </div>`;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const currentRentalFee = calculateRentalPrice(p.rental3Days, globalDuration);
    return `
      <div class="product-card">
        <div class="card-image-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600'">
          <span class="badge-tag">${p.category}</span>
          ${p.sameDay ? '<span class="badge-express">⚡ 2-Hr SOS Eligible</span>' : ''}
        </div>
        <div class="card-info">
          <span class="card-category">${p.category}</span>
          <h3 class="card-name">${p.name}</h3>
          <p class="card-tagline">${p.tagline}</p>

          <div class="card-pricing">
            <div>
              <span class="text-xs text-muted">${globalDuration} Day Rental</span>
              <div class="price-big">${formatINR(currentRentalFee)}</div>
            </div>
            <div style="text-align: right;">
              <span class="retail-strike">Buy: ${formatINR(p.retailPrice)}</span>
              <div class="text-xs text-muted">Dep: ${formatINR(p.securityDeposit)}</div>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-primary btn-block" onclick="addToCart('${p.id}')">
              Rent for ${globalDuration} Day${globalDuration > 1 ? 's' : ''}
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setGlobalDuration(duration, btnElement) {
  globalDuration = duration;
  document.querySelectorAll('.dur-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  renderProducts();
}

function filterCategory(category, btnElement) {
  activeCategory = category;
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  btnElement.classList.add('active');
  renderProducts();
}

function filterProducts() {
  renderProducts();
}

// -------------------------------------------------------------
// 5. CART OPERATIONS
// -------------------------------------------------------------
function addToCart(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const itemFee = calculateRentalPrice(product.rental3Days, globalDuration);

  cart.push({
    product,
    duration: globalDuration,
    rentalFee: itemFee,
    securityDeposit: product.securityDeposit
  });

  updateCartUI();
  openCartDrawer();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function updateCartUI() {
  document.getElementById('cartCount').textContent = cart.length;

  const container = document.getElementById('cartItemsContainer');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 40px 0; color: #78716C;">
      Your rental bag is empty.<br>Select an outfit to get started.
    </div>`;
    document.getElementById('cartSubtotal').textContent = '₹0';
    document.getElementById('cartDeposit').textContent = '₹0';
    document.getElementById('cartWaiver').textContent = '-₹0';
    document.getElementById('cartGrandTotal').textContent = '₹0';
    return;
  }

  container.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <img src="${item.product.image}" alt="${item.product.name}" onerror="this.src='https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200'">
      <div class="cart-item-info">
        <h4 class="cart-item-title">${item.product.name}</h4>
        <div class="cart-item-sub">Duration: ${item.duration} Day(s) • Fee: ${formatINR(item.rentalFee)}</div>
        <div class="text-xs text-muted">Refundable Deposit: ${formatINR(item.securityDeposit)}</div>
        <button class="cart-item-remove" onclick="removeFromCart(${idx})">✕ Remove</button>
      </div>
    </div>
  `).join('');

  // Calculations
  const subtotal = cart.reduce((sum, i) => sum + i.rentalFee, 0);
  const totalDeposit = cart.reduce((sum, i) => sum + i.securityDeposit, 0);
  const waiverAmount = Math.round(totalDeposit * (userMembership.depositWaiver / 100));
  const effectiveDeposit = totalDeposit - waiverAmount;
  const grandTotal = subtotal + effectiveDeposit;

  document.getElementById('cartSubtotal').textContent = formatINR(subtotal);
  document.getElementById('cartDeposit').textContent = formatINR(totalDeposit);
  document.getElementById('cartWaiver').textContent = `-${formatINR(waiverAmount)} (${userMembership.depositWaiver}% off)`;
  document.getElementById('cartGrandTotal').textContent = formatINR(grandTotal);
}

// -------------------------------------------------------------
// 6. DRAWERS & MODALS HANDLERS
// -------------------------------------------------------------
function openCartDrawer() {
  document.getElementById('cartOverlay').classList.add('active');
  document.getElementById('cartDrawer').classList.add('active');
}

function closeCartDrawer() {
  document.getElementById('cartOverlay').classList.remove('active');
  document.getElementById('cartDrawer').classList.remove('active');
}

function openCheckoutModal() {
  if (cart.length === 0) {
    alert('Please add at least one outfit to your bag first.');
    return;
  }
  closeCartDrawer();
  updateCheckoutTotal();
  document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckoutModal() {
  document.getElementById('checkoutModal').classList.remove('active');
}

function updateCheckoutTotal() {
  const speed = document.querySelector('input[name="deliverySpeed"]:checked')?.value || 'standard';
  let speedCharge = 0;
  if (speed === 'sameday') speedCharge = 99;
  if (speed === 'express_2hr') speedCharge = 299;

  const subtotal = cart.reduce((sum, i) => sum + i.rentalFee, 0);
  const totalDeposit = cart.reduce((sum, i) => sum + i.securityDeposit, 0);
  const waiver = Math.round(totalDeposit * (userMembership.depositWaiver / 100));
  const netDeposit = totalDeposit - waiver;
  const grandTotal = subtotal + netDeposit + speedCharge;

  const box = document.getElementById('checkoutSummaryBox');
  if (box) {
    box.innerHTML = `
      <div class="price-row"><span>Rental Fee:</span><strong>${formatINR(subtotal)}</strong></div>
      <div class="price-row"><span>Security Deposit (${userMembership.depositWaiver}% waiver):</span><span>${formatINR(netDeposit)}</span></div>
      <div class="price-row"><span>Delivery Charge:</span><span>${speedCharge === 0 ? 'FREE' : formatINR(speedCharge)}</span></div>
      <div class="price-row grand-total"><span>Payable Amount:</span><strong>${formatINR(grandTotal)}</strong></div>
    `;
  }
}

function handlePlaceOrder(e) {
  e.preventDefault();
  const name = document.getElementById('custName').value;
  const phone = document.getElementById('custPhone').value;
  const city = document.getElementById('custCity').value;
  const speed = document.querySelector('input[name="deliverySpeed"]:checked').value;
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const orderId = 'SR-' + Math.floor(10000 + Math.random() * 90000);

  currentOrder = {
    orderId,
    name,
    phone,
    city,
    speed,
    otp,
    items: [...cart]
  };

  closeCheckoutModal();
  cart = [];
  updateCartUI();

  // Populate Tracker with new order
  document.getElementById('trackOrderId').textContent = currentOrder.orderId;
  document.getElementById('trackOtp').textContent = currentOrder.otp;
  if (speed === 'express_2hr') {
    document.getElementById('riderEtaText').textContent = '⚡ 2-HOUR SOS DISPATCH: Rider is 1.2 km away (ETA: 18 mins)';
  } else {
    document.getElementById('riderEtaText').textContent = 'Standard logistics scheduled for doorstep arrival.';
  }

  openTrackerModal();
}

function openTrackerModal() {
  document.getElementById('trackerModal').classList.add('active');
}

function closeTrackerModal() {
  document.getElementById('trackerModal').classList.remove('active');
}

function openStylePassModal() {
  document.getElementById('stylePassModal').classList.add('active');
}

function closeStylePassModal() {
  document.getElementById('stylePassModal').classList.remove('active');
}

function selectMembership(planName, waiverPercent) {
  userMembership = {
    planName,
    depositWaiver: waiverPercent
  };
  document.getElementById('navMembershipText').textContent = `StylePass (${planName})`;
  closeStylePassModal();
  updateCartUI();
  alert(`🎉 Welcome to StylePass ${planName}! You now enjoy a ${waiverPercent}% security deposit waiver.`);
}

// -------------------------------------------------------------
// 7. INITIALIZATION
// -------------------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartUI();
});
