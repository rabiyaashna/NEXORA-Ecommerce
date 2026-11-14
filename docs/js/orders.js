
async function trackOrder() {
  const id = document.getElementById("tracking-id").value.trim();
  const result = document.getElementById("tracking-result");

  if (!id) {
    result.textContent = "Please enter your order ID.";
    return;
  }

  result.textContent = "Checking order...";

  try {
    const response = await fetch(`/api/orders/${encodeURIComponent(id)}`);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message || "Order not found.");

    result.innerHTML = `
      <h3>Order Found</h3>
      <p>Order ID: ${escapeHTML(data._id)}</p>
      <p>Status: <strong>${escapeHTML(data.status)}</strong></p>
      <p>Total: ₹${Number(data.total).toLocaleString("en-IN")}</p>
      <p>Payment: ${escapeHTML(data.paymentMethod)}</p>
    `;
  } catch (error) {
    result.textContent = error.message;
  }
}
