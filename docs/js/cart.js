
let cart = JSON.parse(localStorage.getItem("nexora-cart") || "[]");

function saveCart() {
  localStorage.setItem("nexora-cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cart-count").textContent = count;
}

function addToCart(productId) {
  const product = products.find(p => p._id === productId);
  if (!product || product.stock < 1) return alert("Product is out of stock.");

  const existing = cart.find(item => item.productId === productId);

  if (existing) {
    if (existing.quantity >= product.stock) return alert("Maximum available stock reached.");
    existing.quantity++;
  } else {
    cart.push({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCart();
  alert("Added to cart!");
}

function changeQuantity(id, change) {
  const item = cart.find(p => p.productId === id);
  const product = products.find(p => p._id === id);
  if (!item) return;

  item.quantity += change;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.productId !== id);
  } else if (product && item.quantity > product.stock) {
    item.quantity = product.stock;
    alert("Maximum available stock reached.");
  }

  saveCart();
  renderCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.productId !== id);
  saveCart();
  renderCart();
}

function renderCart() {
  const container = document.getElementById("cart-items");

  if (!cart.length) {
    container.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    container.innerHTML = cart.map(item => `
      <div class="cart-row">
        <div>
          <strong>${escapeHTML(item.name)}</strong>
          <p>₹${item.price.toLocaleString("en-IN")} × ${item.quantity}</p>
          <button onclick="changeQuantity('${item.productId}',-1)">−</button>
          <button onclick="changeQuantity('${item.productId}',1)">+</button>
          <button onclick="removeFromCart('${item.productId}')">Remove</button>
        </div>
        <strong>₹${(item.price * item.quantity).toLocaleString("en-IN")}</strong>
      </div>
    `).join("");
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  document.getElementById("cart-total").textContent = "₹" + total.toLocaleString("en-IN");
}

function openCart() {
  renderCart();
  document.getElementById("cart-overlay").classList.add("show");
}

function closeCart(event) {
  if (event && event.target !== document.getElementById("cart-overlay")) return;
  document.getElementById("cart-overlay").classList.remove("show");
}

updateCartCount();
