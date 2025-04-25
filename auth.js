const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, Setting } = require("./models");
const authMiddleware = require("./authMiddleware");

const router = express.Router();

// POST /api/login
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    
    const user = await User.findOne({ where: { username } });
  
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
  
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
  
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  });

  // POST /api/settings
// This is a mockup. In a real application, you would save these settings to a database.

router.post("/settings", authMiddleware, async (req, res) => {
  const { smtp, twilio, recipients, enabled } = req.body;
  console.log("Received settings payload:", req.body);

  try {
    await Promise.all([
      Setting.upsert({ key: "smtp", value: JSON.stringify(smtp) }),
      Setting.upsert({ key: "twilio", value: JSON.stringify(twilio) }),
      Setting.upsert({ key: "recipients", value: JSON.stringify(recipients) }),
      Setting.upsert({ key: "enabled", value: JSON.stringify(enabled) }),
    ]);

    res.json({ message: "Settings saved successfully" });
  } catch (err) {
    console.error("Error saving settings:", err);
    res.status(500).json({ message: "Failed to save settings" });
  }
});

// GET /api/settings
// This endpoint retrieves the saved settings from the database.

router.get("/settings/:key", authMiddleware, async (req, res) => {
    const key = req.params.key;
  
    try {
      const setting = await Setting.findOne({ where: { key } });
      const value = setting ? JSON.parse(setting.value) : null;
      res.json({ key, value });
    } catch (err) {
      console.error("Error fetching setting:", err);
      res.status(500).json({ message: "Failed to load setting" });
    }
  });


// POST /test-email
// This endpoint is used to send a test email using the SMTP settings provided in the request body.
// It requires authentication via a Bearer token in the Authorization header.
// The SMTP settings should include host, user, pass, and port.
// If any of these settings are missing, a 400 error is returned.
// If the email is sent successfully, a success message is returned.
// If there is an error sending the email, a 500 error is returned with the error message.

const nodemailer = require("nodemailer");

router.post("/send-test-email", authMiddleware, async (req, res) => {
  const { smtp } = req.body;
  console.log("Auth Header:", req.headers.authorization);
    console.log(req.body)

    if (!smtp || !smtp.host || !smtp.port) {
        return res.status(400).json({ message: "Incomplete SMTP configuration (missing host or port)" });
      }
      
      if (smtp.useAuth && (!smtp.user || !smtp.pass)) {
        return res.status(400).json({ message: "SMTP auth is enabled, but username or password is missing." });
      }
      

  try {
    const transporter = nodemailer.createTransport({
        host: smtp.host,
        port: parseInt(smtp.port),
        secure: false,
        ...(smtp.useAuth ? {
          auth: {
            user: smtp.user,
            pass: smtp.pass
          }
        } : {})
      });
      

    await transporter.sendMail({
      from: "no-reply@kevin.vo",
      to: process.env.MY_EMAIL,
      subject: "✅ SMTP Test Email",
      text: "This is a test email from your Webhook Notifier system.",
    });

    res.json({ message: "Test email sent" });
  } catch (err) {
    console.error("SMTP Test Email Error:", err);
    res.status(500).json({ message: "Error sending email", error: err.message });
  }
});


module.exports = router;
