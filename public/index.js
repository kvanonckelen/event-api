const statusEl = document.getElementById("webhookStatus");
const apiKey = process.env.API_KEY

async function checkWebhookHealth() {
    console.log("Checking webhook health...", apiKey);
  try {
    const res = await fetch("/health/webhook", { method: "POST" , headers: { "X-API-Key": apiKey} });

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
