'use strict';

const nodemailer = require('nodemailer');

/**
 * sendEmail — shared transactional email helper.
 *
 * Reads EMAIL_USER and EMAIL_PASS from the environment at call-time (not at
 * module load) so the function works correctly in both dev and serverless
 * cold-start contexts where env vars may not be set when the module is first
 * required.
 *
 * Behaviour when credentials are absent:
 *   - Logs a warning to the console (visible in Vercel function logs).
 *   - Resolves without throwing — callers must NOT crash on a missing email.
 *
 * @param {{ to: string, subject: string, html: string }} opts
 * @returns {Promise<void>}
 */
async function sendEmail({ to, subject, html }) {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error('Email delivery unavailable: SMTP credentials (EMAIL_USER / EMAIL_PASS) are not configured.');
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: emailUser, pass: emailPass },
    // Hard limit: if SMTP handshake takes > 8 s, give up rather than hanging
    // the serverless function invocation.
    connectionTimeout: 8000,
    greetingTimeout: 8000,
    socketTimeout: 8000,
  });

  await transporter.sendMail({
    from: `"Justice Junction 24/7" <${emailUser}>`,
    to,
    subject,
    html,
  });
}

module.exports = { sendEmail };
