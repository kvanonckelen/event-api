const statusEl = document.getElementById("webhookStatus");

async function checkWebhookHealth() {
  try {
    const res = await fetch("/webhook", { method: "POST" });

    if (res.ok) {
      statusEl.textContent = "/webhook endpoint is active";
      statusEl.classList.remove("error");
    } else {
      throw new Error("Non-OK response");
    }
  } catch (err) {
    statusEl.textContent = "⚠️ /webhook endpoint is unavailable";
    statusEl.classList.add("error");
  }
}

checkWebhookHealth();
setInterval(checkWebhookHealth, 10000);
