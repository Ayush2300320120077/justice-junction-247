import connectDB from '../../../../middleware/db'
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

    // POST /api/bookings
    if (req.method === 'POST' && !slug) {
      const { lawyerId, caseType, description, scheduledDate, scheduledTime } = req.body
      const lawyer = await Lawyer.findById(lawyerId)
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' })
      if (!lawyer.isAvailable) return res.status(400).json({ error: 'Lawyer not available' })

      const booking = await Booking.create({
        client: user.id, clientName: user.name,
        lawyer: lawyer._id, lawyerName: lawyer.name,
        caseType, description, scheduledDate, scheduledTime,
        fee: lawyer.consultationFee,
        meetingLink: `https://meet.jit.si/JJ-${Math.random().toString(36).substr(2,8)}`
      })

      return res.status(201).json({ booking, message: 'Booking confirmed!' })
    }

    // GET /api/bookings/my
    if (req.method === 'GET' && slug?.[0] === 'my') {
      let bookings
      if (user.role === 'client') {
        bookings = await Booking.find({ client: user.id }).sort({ createdAt: -1 })
      } else {
        const lawyer = await Lawyer.findOne({ user: user.id })
        if (!lawyer) return res.json({ bookings: [] })
        bookings = await Booking.find({ lawyer: lawyer._id }).sort({ createdAt: -1 })
      }
      return res.json({ bookings })
    }

    // GET /api/bookings/[id] or PUT /api/bookings/[id]/status
    if (slug?.[0]) {
      const id = slug[0]
      const booking = await Booking.findById(id)
      if (!booking) return res.status(404).json({ error: 'Booking not found' })

      if (req.method === 'GET') {
        return res.json({ booking })
      }

      if (req.method === 'PUT' && slug[1] === 'status') {
        booking.status = req.body.status
        await booking.save()
        return res.json({ booking, message: 'Status updated' })
      }
    }

    return res.status(404).json({ error: 'Not Found' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
