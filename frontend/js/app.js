
let products = [];

const productData = [
  ["Wireless Headphones", "Audio", 2499],
  ["Bluetooth Speaker", "Audio", 1899],
  ["Gaming Headset", "Audio", 3299],
  ["Noise Cancelling Earbuds", "Audio", 2799],
  ["Studio Headphones", "Audio", 4999],

  ["Smart Watch", "Wearables", 3999],
  ["Fitness Band", "Wearables", 1499],
  ["Premium Smart Watch", "Wearables", 6999],
  ["Smart Ring", "Wearables", 2999],
  ["Wireless Charging Watch", "Wearables", 4499],

  ["Mechanical Keyboard", "Accessories", 2999],
  ["Wireless Mouse", "Accessories", 999],
  ["Laptop Stand", "Accessories", 1299],
  ["USB C Hub", "Accessories", 1599],
  ["Laptop Sleeve", "Accessories", 899],
  ["Power Bank", "Accessories", 1799],
  ["Fast Charging Adapter", "Accessories", 799],
  ["USB C Cable", "Accessories", 399],
  ["Wireless Charger", "Accessories", 1199],
  ["Portable SSD", "Accessories", 4999],

  ["Smartphone X1", "Smartphones", 18999],
  ["Smartphone X2", "Smartphones", 24999],
  ["Smartphone Pro", "Smartphones", 34999],
  ["Budget Smartphone", "Smartphones", 9999],
  ["5G Smartphone", "Smartphones", 21999],

  ["Tablet Air", "Tablets", 19999],
  ["Tablet Pro", "Tablets", 32999],
  ["Android Tablet", "Tablets", 13999],
  ["Drawing Tablet", "Tablets", 8999],
  ["Mini Tablet", "Tablets", 10999],

  ["Gaming Laptop", "Laptops", 74999],
  ["Ultrabook Laptop", "Laptops", 62999],
  ["Student Laptop", "Laptops", 42999],
  ["Creator Laptop", "Laptops", 89999],
  ["Business Laptop", "Laptops", 55999],

  ["4K Monitor", "Monitors", 24999],
  ["Gaming Monitor", "Monitors", 18999],
  ["Portable Monitor", "Monitors", 12999],
  ["Curved Monitor", "Monitors", 27999],
  ["Full HD Monitor", "Monitors", 8999],

  ["HD Webcam", "Accessories", 1499],
  ["Gaming Mouse", "Accessories", 1799],
  ["RGB Mouse Pad", "Accessories", 799],
  ["Laptop Cooling Pad", "Accessories", 1199],

  ["Gaming Controller", "Gaming", 2499],
  ["Wireless Gamepad", "Gaming", 1999],
  ["Gaming Console", "Gaming", 39999],
  ["VR Headset", "Gaming", 24999],

  ["Streaming Microphone", "Audio", 3499],
  ["Smart Home Hub", "Smart Home", 4999]
];

// Create product objects with local images
products = productData.map((item, index) => ({
  _id: String(index + 1),
  name: item[0],
  category: item[1],
  price: item[2],
  stock: 10,
  image: `./images/${item[0].toLowerCase().replace(/[^a-z0-9]+/g, "-")}.jpg`
}));

// Prevent HTML injection
function escapeHTML(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

// Display products
function loadProducts() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;
  const sort = document.getElementById("sort").value;

  let filtered = products.filter(product =>
    product.name.toLowerCase().includes(search) &&
    (category === "All" || product.category === category)
  );

  if (sort === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sort === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  document.getElementById("product-message").textContent =
    `${filtered.length} products found`;

  document.getElementById("product-grid").innerHTML =
    filtered.map(product => `
      <article class="product-card">
        <img
          src="${escapeHTML(product.image)}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
          onerror="this.src='https://placehold.co/600x450/101b35/65c8ff?text=Image+Unavailable'"
        >

        <div class="product-info">
          <p class="product-category">
            ${escapeHTML(product.category)}
          </p>

          <h3>${escapeHTML(product.name)}</h3>

          <p class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
          </p>

          <button onclick="addToCart('${product._id}')">
            Add to Cart
          </button>
        </div>
      </article>
    `).join("");
}

// Initial product display
loadProducts();
