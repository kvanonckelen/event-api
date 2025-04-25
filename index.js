require('dotenv').config();
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const authRoutes = require("./auth");
const webhookRouter = require('./webhook');
const eventRoutes = require('./events');

// Catch-all route (for React Router)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Health check route
app.get('/health/webhook', (req, res) => {
    res.status(200).json({ status: 'OK' });
  });
  
// Middleware
app.use(cors({ origin: "*", credentials: true }));

// API routes
app.use("/api",bodyParser.json(), authRoutes);
app.use("/api/events", eventRoutes);
app.use("/webhook", webhookRouter);

// Static frontend (React build)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Webhook server running at ${BASE_URL}:${PORT}`);
});
