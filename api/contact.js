require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const connectDB = require('../middleware/db');
const ContactMessage = require('../models/ContactMessage');

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const router = express.Router();

// POST /api/contact — contact form submission (saves to DB + optional nodemailer)
router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body;

  // Validate required fields
  const missing = [];
  if (!name || !name.trim()) missing.push('Name');
  if (!email || !email.trim()) missing.push('Email');
  if (!message || !message.trim()) missing.push('Message');
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  try {
    await connectDB();
    await ContactMessage.create({ name, email, subject, message });

    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    const supportEmail = process.env.SUPPORT_EMAIL;

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
      });

      await transporter.sendMail({
        from: `"Justice Junction Contact" <${emailUser}>`,
        to: supportEmail,
        replyTo: email,
        subject: `[JJ Contact] ${subject || 'New Message'} — from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #7B1D2E; color: #fff; padding: 20px; border-radius: 8px 8px 0 0;">
              <h2 style="margin: 0;">New Contact Form Submission</h2>
            </div>
            <div style="padding: 24px; border: 1px solid #eee; border-top: none; border-radius: 0 0 8px 8px;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
              <p><strong>Message:</strong></p>
              <p style="background: #f9f9f9; padding: 16px; border-radius: 8px; line-height: 1.7;">${message.replace(/\n/g, '<br/>')}</p>
            </div>
            <p style="font-size: 12px; color: #999; margin-top: 16px; text-align: center;">
              Sent from Justice Junction 24/7 Contact Form
            </p>
          </div>
        `,
      });
    } else {
      // Graceful fallback: log to console (visible in Vercel logs)
      console.log('=== CONTACT FORM SUBMISSION (no email credentials set) ===');
      console.log('Name:', name, '| Email:', email, '| Subject:', subject || 'N/A');
      console.log('Message:', message);
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Contact form error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.use('/api/contact', router);
module.exports = app;
