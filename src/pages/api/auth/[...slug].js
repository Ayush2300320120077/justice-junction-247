import connectDB from '../../../../middleware/db'
import User from '../../../../models/User'
import Lawyer from '../../../../models/Lawyer'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  const { slug } = req.query
  const action = slug[slug.length - 1]

  try {
    await connectDB()

    if (req.method === 'POST' && action === 'register') {
      const { name, email, password, role, phone, city, state,
              specializations, experience, barRegistrationNumber,
              consultationFee, bio } = req.body

      const exists = await User.findOne({ email })
      if (exists) return res.status(400).json({ error: 'Email already registered' })

      const user = await User.create({ name, email, password, role, phone, city, state })

      if (role === 'lawyer') {
        const exp = parseInt(experience) || 0
        const level = exp >= 13 ? 'senior' : exp >= 5 ? 'mid' : 'junior'
        await Lawyer.create({
          user: user._id, name, email, phone, city, state,
          barRegistrationNumber, specializations: specializations || [],
          experience: exp, experienceLevel: level,
          consultationFee: parseFloat(consultationFee) || 0,
          bio: bio || ''
        })
      }

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      return res.status(201).json({ token, user: { id: user._id, name, email, role } })
    }

    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body
      const user = await User.findOne({ email })
      if (!user) return res.status(400).json({ error: 'Invalid email or password' })

      const valid = await user.comparePassword(password)
      if (!valid) return res.status(400).json({ error: 'Invalid email or password' })

      const token = jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      )
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } })
    }

    if (req.method === 'GET' && action === 'me') {
      const authHeader = req.headers.authorization
      if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })
      
      const token = authHeader.split(' ')[1]
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await User.findById(decoded.id).select('-password')
        if (!user) return res.status(404).json({ error: 'User not found' })
        return res.json({ user })
      } catch (err) {
        return res.status(401).json({ error: 'Invalid token' })
      }
    }

    return res.status(404).json({ error: 'Not Found' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
