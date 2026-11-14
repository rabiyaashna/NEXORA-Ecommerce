
function openAdmin() {
  document.getElementById("admin-modal").classList.add("show");
}

function closeAdmin() {
  document.getElementById("admin-modal").classList.remove("show");
}

async function adminRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": document.getElementById("admin-key").value,
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Admin request failed.");
  return data;
}

async function loadAdmin() {
  const area = document.getElementById("admin-area");
  area.textContent = "Loading admin data...";

  try {
    const [items, orders] = await Promise.all([
      adminRequest("/api/products"),
      adminRequest("/api/admin/orders")
    ]);

    area.innerHTML = `
      <h3>Inventory Management</h3>
      <form id="add-product-form">
        <input name="name" placeholder="Product name" required>
        <input name="category" placeholder="Category" required>
        <input name="price" type="number" min="0" placeholder="Price" required>
        <input name="stock" type="number" min="0" placeholder="Stock" required>
        <input name="image" placeholder="Image URL">
        <textarea name="description" placeholder="Description"></textarea>
        <button class="primary-button full-button">Add Product</button>
      </form>
      <h3 style="margin-top:25px">Products (${items.length})</h3>
      <div id="admin-products"></div>
      <h3 style="margin-top:25px">Orders (${orders.length})</h3>
      <div id="admin-orders"></div>
    `;

    document.getElementById("admin-products").innerHTML = items.map(item => `
      <div class="admin-product">
        <strong>${escapeHTML(item.name)}</strong>
        <p>₹${item.price} · Stock: ${item.stock}</p>
        <button onclick="editStock('${item._id}',${item.stock})">Edit Stock</button>
        <button onclick="deleteProduct('${item._id}')">Delete</button>
      </div>
    `).join("");

    document.getElementById("admin-orders").innerHTML = orders.map(order => `
      <div class="admin-product">
        <p>${escapeHTML(order._id)}</p>
        <p>${escapeHTML(order.customer.name)} · ₹${order.total}</p>
        <p>Status: ${escapeHTML(order.status)}</p>
        <select id="status-${order._id}">
          ${["Placed","Processing","Shipped","Delivered","Cancelled"].map(status =>
            `<option ${order.status === status ? "selected" : ""}>${status}</option>`
          ).join("")}
        </select>
        <button onclick="updateOrderStatus('${order._id}')">Update Status</button>
      </div>
    `).join("");

    document.getElementById("add-product-form").addEventListener("submit", addProduct);
  } catch (error) {
    area.textContent = error.message;
  }
}

async function addProduct(event) {
  event.preventDefault();
  const form = new FormData(event.target);

  const product = Object.fromEntries(form.entries());
  product.price = Number(product.price);
  product.stock = Number(product.stock);

  try {
    await adminRequest("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(product)
    });

    alert("Product added.");
    loadAdmin();
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
}

async function editStock(id, currentStock) {
  const stock = prompt("Enter new stock quantity:", currentStock);
  if (stock === null) return;

  const quantity = Number(stock);
  if (!Number.isInteger(quantity) || quantity < 0) {
    return alert("Enter a valid stock quantity.");
  }

  try {
    await adminRequest(`/api/admin/products/${id}`, {
      method: "PUT",
      body: JSON.stringify({ stock: quantity })
    });

    alert("Stock updated.");
    loadAdmin();
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
}

async function deleteProduct(id) {
  if (!confirm("Are you sure you want to delete this product?")) return;

  try {
    await adminRequest(`/api/admin/products/${id}`, { method: "DELETE" });
    alert("Product deleted.");
    loadAdmin();
    loadProducts();
  } catch (error) {
    alert(error.message);
  }
}

async function updateOrderStatus(id) {
  const status = document.getElementById(`status-${id}`).value;

  try {
    await adminRequest(`/api/admin/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });

    alert("Order status updated.");
    loadAdmin();
  } catch (error) {
    alert(error.message);
  }
}
