require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require('path');
const app = express();
const PORT = process.env.PORT
const BASE_URL = process.env.BASE_URL;
const authRoutes = require("./auth");
const webhookRouter = require('./webhook');

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({allowOrigin: true, origin: "*"}));
app.use("/api", authRoutes);

app.use('/webhook', webhookRouter);

app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at ${BASE_URL}:${PORT}`);
});
