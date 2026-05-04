import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, subject, message } = req.body

  // Validate required fields
  const missing = []
  if (!name || !name.trim()) missing.push('Name')
  if (!email || !email.trim()) missing.push('Email')
  if (!message || !message.trim()) missing.push('Message')
  if (missing.length > 0) {
    return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` })
  }

  // Basic email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' })
  }

  try {
    const emailUser = process.env.EMAIL_USER
    const emailPass = process.env.EMAIL_PASS

    if (emailUser && emailPass) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: emailUser, pass: emailPass },
      })

      await transporter.sendMail({
        from: `"Justice Junction Contact" <${emailUser}>`,
        to: 'support@justicejunction.in',
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
      })
    } else {
      // Graceful fallback: log to console if email credentials not set
      console.log('=== CONTACT FORM SUBMISSION ===')
      console.log('Name:', name)
      console.log('Email:', email)
      console.log('Subject:', subject || 'N/A')
      console.log('Message:', message)
      console.log('=== END ===')
    }

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Contact form error:', err)
    return res.status(500).json({ error: 'Failed to send message. Please try again later.' })
  }
}
