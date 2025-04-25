const nodemailer = require('nodemailer');
const twilio = require('twilio');
const { Setting } = require('./models'); // adjust path if needed

async function getSetting(key) {
  const setting = await Setting.findOne({ where: { key } });
  return setting ? JSON.parse(setting.value) : null;
}

const sendSMS = async (text) => {
  var twilioConfig = await getSetting('twilio')
  const to = (await getSetting('recipients'))?.sms || process.env.MY_PHONE_NUMBER;
 // (await getSetting('recipients'))?.sms ||
  if (!twilioConfig?.sid || !twilioConfig?.token || !twilioConfig?.from || !to) {
    twilioConfig = {
        sid: process.env.TWILIO_SID,
        token: process.env.TWILIO_AUTH_TOKEN,
        from: process.env.TWILIO_PHONE_NUMBER,
      };
  }

  const client = twilio(twilioConfig.sid, twilioConfig.token);

  return await client.messages.create({
    body: text,
    from: twilioConfig.from,
    to,
  });
};

const sendEmail = async (text) => {
  const smtp = await getSetting('smtp');
  const to = (await getSetting('recipients'))?.email || process.env.MY_EMAIL; // replace with your email

  if (!smtp?.host || !smtp?.port || !to) {
    throw new Error('SMTP config or recipient is incomplete');
  }

  const transporterOptions = {
    host: smtp.host,
    port: parseInt(smtp.port),
    secure: false,
  };

  if (smtp.useAuth) {
    transporterOptions.auth = {
      user: smtp.user,
      pass: smtp.pass,
    };
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  return await transporter.sendMail({
    from: '"Webhook Notifier" <no-reply@kevin.vo>',
    to,
    subject: '🚨 Webhook Notification',
    text,
  });
};

module.exports = { sendSMS, sendEmail };
