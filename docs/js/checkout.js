
function openCheckout() {
  if (!cart.length) return alert("Your cart is empty.");

  closeCart();
  document.getElementById("checkout-modal").classList.add("show");
}

function closeCheckout() {
  document.getElementById("checkout-modal").classList.remove("show");
}

document.getElementById("checkout-form").addEventListener("submit", async function(event) {
  event.preventDefault();

  if (!cart.length) return alert("Your cart is empty.");

  const form = new FormData(this);
  const customer = {
    name: form.get("name").trim(),
    email: form.get("email").trim(),
    phone: form.get("phone").trim(),
    address: form.get("address").trim()
  };

  const message = document.getElementById("checkout-message");
  message.textContent = "Placing your order...";

  try {
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer,
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        paymentMethod: form.get("paymentMethod")
      })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || "Order failed.");

    cart = [];
    saveCart();
    this.reset();

    message.innerHTML = `
      <p>Order placed successfully!</p>
      <p>Your Order ID:</p>
      <strong>${escapeHTML(data.orderId)}</strong>
      <p>Save this ID to track your order.</p>
    `;

    loadProducts();
  } catch (error) {
    message.textContent = error.message;
  }
});
