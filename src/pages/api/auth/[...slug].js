import connectDB from '../../../../middleware/db'
import User from '../../../../models/User'
import Lawyer from '../../../../models/Lawyer'
import jwt from 'jsonwebtoken'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '5mb',
    },
  },
}

export default async function handler(req, res) {
  const { slug } = req.query
  const action = slug[slug.length - 1]

  try {
    await connectDB()

    if (req.method === 'POST' && action === 'register') {
      const { name, email, password, role, phone, city, state,
              specializations, experience, barRegistrationNumber,
              consultationFee, bio,
              // New fields
              dateOfBirth, gender, photo, address,
              barCouncilState, yearOfEnrollment, designation, currentFirm,
              courts, languages,
              consultationModes, availableDays, availableTimeFrom, availableTimeTo,
              linkedinUrl, websiteUrl } = req.body

      // Server-side validation for required lawyer fields
      if (role === 'lawyer') {
        const missing = []
        if (!phone || !phone.trim()) missing.push('Phone Number')
        if (!barRegistrationNumber || !barRegistrationNumber.trim()) missing.push('Bar Council Registration Number')
        if (!barCouncilState || !barCouncilState.trim()) missing.push('Bar Council State')
        if (!specializations || specializations.length === 0) missing.push('Practice Areas (at least one)')
        if (!city || !city.trim()) missing.push('City')
        if (!state || !state.trim()) missing.push('State')
        if (missing.length > 0) {
          return res.status(400).json({ error: `Missing required fields: ${missing.join(', ')}` })
        }
      }

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
          bio: bio || '',
          // New fields
          dateOfBirth: dateOfBirth || undefined,
          gender: gender || undefined,
          photo: photo || '',
          address: address || '',
          barCouncilState: barCouncilState || '',
          yearOfEnrollment: yearOfEnrollment ? parseInt(yearOfEnrollment) : undefined,
          designation: designation || '',
          currentFirm: currentFirm || '',
          courts: courts || [],
          languages: languages || [],
          consultationModes: consultationModes || [],
          availableDays: availableDays || [],
          availableTimeFrom: availableTimeFrom || '',
          availableTimeTo: availableTimeTo || '',
          linkedinUrl: linkedinUrl || '',
          websiteUrl: websiteUrl || '',
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
