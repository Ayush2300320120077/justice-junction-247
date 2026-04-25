import connectDB from '../../../middleware/db'
import Lawyer from '../../../models/Lawyer'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    await connectDB()
    const { city, specialization, maxFee, minRating, language, availability, sort = 'rating', page = 1, limit = 12 } = req.query
    
    const filter = { isVerified: true, isBlocked: { $ne: true } }
    if (city) filter.city = new RegExp(city, 'i')
    if (specialization) {
      const specs = Array.isArray(specialization) ? specialization : [specialization]
      filter.specializations = { $in: specs.map(s => new RegExp(s, 'i')) }
    }
    if (maxFee) filter.consultationFee = { $lte: parseFloat(maxFee) }
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) }
    if (language) filter.languages = { $elemMatch: { $regex: new RegExp(language, 'i') } }
    if (availability === 'online') filter.availabilityMode = 'online'
    else if (availability === 'offline') filter.availabilityMode = 'offline'
    else if (availability === 'both') filter.availabilityMode = 'both'
    
    const sortMap = {
      rating: { averageRating: -1, totalReviews: -1 }, 
      price_low: { consultationFee: 1 },
      price_high: { consultationFee: -1 }, 
      experience: { experience: -1 }
    }
    const sortOption = sortMap[sort] || { averageRating: -1 }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const [lawyers, total] = await Promise.all([
      Lawyer.find(filter).sort(sortOption).skip(skip).limit(parseInt(limit)).lean(),
      Lawyer.countDocuments(filter)
    ])

    res.status(200).json({
      lawyers: JSON.parse(JSON.stringify(lawyers)),
      total,
      pages: Math.ceil(total / parseInt(limit)),
      page: parseInt(page)
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
