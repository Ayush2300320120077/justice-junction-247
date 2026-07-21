import connectDB from '../../../middleware/db'
import Subscriber from '../../../models/Subscriber'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required' })
  }

  try {
    await connectDB()

    // Upsert — if already subscribed, just update the date and reactivate
    await Subscriber.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { email: email.toLowerCase().trim(), isActive: true, subscribedAt: new Date() },
      { upsert: true, new: true }
    )

    return res.status(200).json({ message: 'Subscribed successfully' })
  } catch (err) {
    console.error('Subscribe error:', err)
    return res.status(500).json({ error: 'Failed to subscribe' })
  }
}
