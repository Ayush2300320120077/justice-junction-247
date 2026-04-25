import connectDB from '../../../middleware/db'
import Case from '../../../models/Case'
import jwt from 'jsonwebtoken'

function getUser(req) {
  const auth = req.headers.authorization
  if (!auth) return null
  try { return jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET) }
  catch { return null }
}

export default async function handler(req, res) {
  const user = getUser(req)
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in.' })

  await connectDB()

  try {
    if (req.method === 'GET') {
      const cases = await Case.find({ user: user.id }).sort({ createdAt: -1 }).lean()
      return res.status(200).json({ cases: JSON.parse(JSON.stringify(cases)) })
    }

    if (req.method === 'POST') {
      const { title, courtName, caseNumber, nextHearingDate, notes } = req.body
      if (!title) return res.status(400).json({ error: 'Case title is required' })
      const newCase = await Case.create({
        user: user.id, title, courtName, caseNumber,
        nextHearingDate: nextHearingDate ? new Date(nextHearingDate) : null,
        notes
      })
      return res.status(201).json({ case: JSON.parse(JSON.stringify(newCase)) })
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body
      const updated = await Case.findOneAndUpdate(
        { _id: id, user: user.id },
        { ...updates, updatedAt: new Date() },
        { new: true }
      ).lean()
      if (!updated) return res.status(404).json({ error: 'Case not found' })
      return res.status(200).json({ case: JSON.parse(JSON.stringify(updated)) })
    }

    if (req.method === 'DELETE') {
      const { id } = req.query
      await Case.findOneAndDelete({ _id: id, user: user.id })
      return res.status(200).json({ message: 'Case deleted' })
    }

    return res.status(405).json({ error: 'Method not allowed' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
