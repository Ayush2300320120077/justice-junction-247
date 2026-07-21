import connectDB from '../../../../middleware/db'
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
  const action = slug?.[slug.length - 1]

  try {
    await connectDB()

    // GET /api/lawyers
    if (req.method === 'GET' && !slug) {
      const { city, state, specialization, minExp, maxFee, sort, page = 1, limit = 12 } = req.query
      const filter = {
        $or: [
          { verificationStatus: 'verified' },
          { isVerified: true },
          { verificationStatus: { $exists: false } }
        ],
        verificationStatus: { $ne: 'rejected' },
        isBlocked: { $ne: true }
      }
      if (city) filter.city = new RegExp(city, 'i')
      if (state) filter.state = new RegExp(state, 'i')
      if (specialization) filter.specializations = { $in: [new RegExp(specialization, 'i')] }
      if (minExp) filter.experience = { $gte: parseInt(minExp) }
      if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) }

      const sortMap = {
        rating: { averageRating: -1 },
        price_low: { consultationFee: 1 },
        price_high: { consultationFee: -1 },
        experience: { experience: -1 },
        newest: { createdAt: -1 }
      }
      const sortOption = sortMap[sort] || { averageRating: -1 }

      const skip = (parseInt(page) - 1) * parseInt(limit)
      const [lawyers, total] = await Promise.all([
        Lawyer.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit))
          .select('-user -__v'),
        Lawyer.countDocuments(filter)
      ])

      return res.json({ lawyers, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) })
    }

    // PUT /api/lawyers/profile/update
    if (req.method === 'PUT' && slug?.[0] === 'profile' && slug?.[1] === 'update') {
      const user = getUser(req)
      if (!user || user.role !== 'lawyer') return res.status(403).json({ error: 'Access denied' })
      const lawyer = await Lawyer.findOne({ user: user.id })
      if (!lawyer) return res.status(404).json({ error: 'Profile not found' })

      const allowed = ['bio', 'consultationFee', 'specializations', 'languages', 'isAvailable', 'phone', 'city', 'state',
        'photo', 'address', 'dateOfBirth', 'gender', 'barCouncilState', 'yearOfEnrollment', 'designation', 'currentFirm',
        'courts', 'consultationModes', 'availableDays', 'availableTimeFrom', 'availableTimeTo', 'linkedinUrl', 'websiteUrl']
      allowed.forEach(f => { if (req.body[f] !== undefined) lawyer[f] = req.body[f] })
      await lawyer.save()
      return res.json({ message: 'Profile updated', lawyer })
    }

    // POST /api/lawyers/seed/demo
    if (req.method === 'POST' && slug?.[0] === 'seed' && slug?.[1] === 'demo') {
      const count = await Lawyer.countDocuments()
      if (count > 0) return res.json({ message: 'Database already has lawyers', count })
      
      const demoLawyers = [
        {
          name: "Adv. Rajesh Kumar",
          specializations: ["Criminal Defence", "Civil Disputes"],
          experience: 15,
          experienceLevel: "senior",
          city: "Delhi",
          state: "Delhi",
          consultationFee: 2500,
          averageRating: 4.8,
          totalReviews: 124,
          isVerified: true,
          isAvailable: true,
          bio: "Expert in high-profile criminal cases and constitutional matters with 15 years of practice in Supreme Court."
        },
        {
          name: "Adv. Priya Sharma",
          specializations: ["Family Law", "Divorce"],
          experience: 8,
          experienceLevel: "mid",
          city: "Mumbai",
          state: "Maharashtra",
          consultationFee: 1500,
          averageRating: 4.6,
          totalReviews: 89,
          isVerified: true,
          isAvailable: true,
          bio: "Dedicated family law specialist helping clients navigate complex divorce and child custody cases with empathy."
        },
        {
          name: "Adv. Amit Shah",
          specializations: ["Corporate Law", "Taxation"],
          experience: 12,
          experienceLevel: "senior",
          city: "Bangalore",
          state: "Karnataka",
          consultationFee: 5000,
          averageRating: 4.9,
          totalReviews: 56,
          isVerified: true,
          isAvailable: false,
          bio: "Corporate legal advisor for Fortune 500 companies, specializing in mergers, acquisitions and tax litigation."
        },
        {
          name: "Adv. Sneha Gupta",
          specializations: ["Property Law", "Labour Law"],
          experience: 5,
          experienceLevel: "junior",
          city: "Delhi",
          state: "Delhi",
          consultationFee: 1000,
          averageRating: 4.4,
          totalReviews: 32,
          isVerified: true,
          isAvailable: true,
          bio: "Young and dynamic lawyer focused on property verification and labour dispute resolution."
        }
      ]
      
      await Lawyer.insertMany(demoLawyers)
      return res.json({ message: 'Demo lawyers seeded successfully', count: demoLawyers.length })
    }

    // GET /api/lawyers/[id] or POST /api/lawyers/[id]/review
    if (slug?.[0]) {
      const id = slug[0]
      const lawyer = await Lawyer.findById(id).select('-user -__v')
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' })

      if (req.method === 'GET') {
        return res.json({ lawyer })
      }

      if (req.method === 'POST' && slug[1] === 'review') {
        const user = getUser(req)
        if (!user) return res.status(401).json({ error: 'Unauthorized' })
        
        lawyer.reviews.push({
          client: user.id,
          clientName: user.name,
          rating: req.body.rating,
          comment: req.body.comment
        })
        lawyer.updateRating()
        await lawyer.save()
        return res.json({ message: 'Review added', averageRating: lawyer.averageRating })
      }
    }

    return res.status(404).json({ error: 'Not Found' })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: err.message })
  }
}
