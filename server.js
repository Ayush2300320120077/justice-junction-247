require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors({ 
  origin: ['http://localhost:3000', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean), 
  credentials: true 
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Mount API sub-apps (each already has /api/xxx path set internally)
app.use(require('./api/_routes/auth'))
app.use(require('./api/_routes/lawyers'))
app.use(require('./api/_routes/bookings'))
app.use(require('./api/_routes/payments'))
app.use(require('./api/_routes/admin'))
app.use(require('./api/_routes/ai'))
app.use(require('./api/_routes/cases'))
app.use(require('./api/_routes/subscriptions'))
app.use(require('./api/_routes/documents'))
app.use(require('./api/_routes/articles'))
app.use(require('./api/_routes/reviews'))
app.use(require('./api/_routes/contact'))


// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// Serve built frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')))
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'))
    }
  })
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Justice Junction API on port ${PORT}`))
