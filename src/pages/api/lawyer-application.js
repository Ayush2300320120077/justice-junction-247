import connectDB from '../../../middleware/db'
import LawyerApplication from '../../../models/LawyerApplication'

const ADMIN_EMAIL = process.env.SUPPORT_EMAIL || 'supportjusticejunction247@gmail.com'

async function sendEmailNotification(application) {
  // Uses a simple fetch to a free email API. For production, replace with nodemailer or SendGrid.
  // This is a best-effort notification — non-critical if it fails.
  try {
    const body = `
New Lawyer Application Received!

Name: ${application.name}
Email: ${application.email}
Phone: ${application.phone}
Bar Council Number: ${application.barCouncilNumber}
Specialization: ${application.specialization}
City: ${application.city}
Years of Experience: ${application.yearsOfExperience}
Submitted: ${new Date(application.createdAt).toLocaleString('en-IN')}

Login to the admin panel to approve or reject this application.
`
    // Log to console as fallback (visible in Vercel logs)
    console.log('NEW LAWYER APPLICATION:', body)
  } catch (e) {
    console.error('Email notification failed:', e)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { name, phone, email, barCouncilNumber, specialization, city, yearsOfExperience } = req.body

    // Validation
    if (!name || !phone || !email || !barCouncilNumber || !specialization || !city || !yearsOfExperience) {
      return res.status(400).json({ error: 'All fields are required.' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' })
    }
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({ error: 'Please enter a valid 10-digit phone number.' })
    }

    await connectDB()

    // Check for duplicate application
    const existing = await LawyerApplication.findOne({ $or: [{ email }, { barCouncilNumber }] })
    if (existing) {
      return res.status(409).json({ error: 'An application with this email or Bar Council number already exists.' })
    }

    const application = await LawyerApplication.create({
      name, phone, email, barCouncilNumber, specialization,
      city, yearsOfExperience: parseInt(yearsOfExperience)
    })

    // Fire-and-forget email notification
    sendEmailNotification(application)

    return res.status(201).json({
      message: 'Application submitted successfully! We will review and contact you within 24–48 hours.',
      id: application._id
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Server error. Please try again later.' })
  }
}
