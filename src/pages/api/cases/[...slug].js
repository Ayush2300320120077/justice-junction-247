import connectDB from '../../../../middleware/db'
import CaseUpdate from '../../../../models/CaseUpdate'
import Booking from '../../../../models/Booking'
import Lawyer from '../../../../models/Lawyer'
import jwt from 'jsonwebtoken'

function getUser(req) {
  const authHeader = req.headers.authorization
  if (!authHeader) return null
  try { return jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET) }
  catch { return null }
}

export default async function handler(req, res) {
  const { slug } = req.query
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized' })

  try {
    await connectDB()

    // POST /api/cases
    if (req.method === 'POST' && !slug) {
      if (user.role !== 'lawyer') return res.status(403).json({ error: 'Lawyers only' })
      const lawyer = await Lawyer.findOne({ user: user.id })
      if (!lawyer) return res.status(404).json({ error: 'Lawyer profile not found' })

      const booking = await Booking.findById(req.body.bookingId)
      if (!booking) return res.status(404).json({ error: 'Booking not found' })

      const update = await CaseUpdate.create({
        booking: booking._id,
        lawyer: lawyer._id,
        client: booking.client,
        caseNumber: booking.caseNumber,
        title: req.body.title,
        description: req.body.description,
        stage: req.body.stage || 'consultation',
        status: req.body.status || 'active',
        nextHearing: req.body.nextHearing || null
      })

      return res.status(201).json({ update, message: 'Case update posted' })
    }

    // GET /api/cases/my
    if (req.method === 'GET' && slug?.[0] === 'my') {
      const updates = await CaseUpdate.find({ client: user.id })
        .sort({ createdAt: -1 }).limit(20)
      return res.json({ updates })
    }

    // GET /api/cases/booking/[bookingId]
    if (req.method === 'GET' && slug?.[0] === 'booking' && slug?.[1]) {
      const updates = await CaseUpdate.find({ booking: slug[1] })
        .sort({ createdAt: 1 })
      return res.json({ updates })
    }

    return res.status(404).json({ error: 'Not Found' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
