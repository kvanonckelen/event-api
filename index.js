require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { sendSMS, sendEmail } = require('./notifier');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const authRoutes = require("./auth");

app.use(cors({allowOrigin: true, origin: "*"}));
app.use(express.json());
app.use("/api", authRoutes);

app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const payload = req.body;
    console.log('🔔 Webhook received:', payload);

    const message = `[Webhook Alert] Event received:\n${JSON.stringify(payload, null, 2)}`;

    // Send via SMS and/or Email
    if (process.env.ENABLE_SMS === 'true') await sendSMS(message);
    if (process.env.ENABLE_EMAIL === 'true') await sendEmail(message);

    res.status(200).json({ success: true, message: JSON.stringify(payload) });
  } catch (err) {
    console.error('❌ Error handling webhook:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/api/logout", (req, res) => {
    res.json({ message: "Logged out (client should clear token)" });
  });


  

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at http://localhost:${PORT}`);
});
