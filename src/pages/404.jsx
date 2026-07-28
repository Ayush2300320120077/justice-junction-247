import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Search, AlertTriangle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="page-wrap page-reveal" style={{ background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <Helmet>
        <title>404 — Page Not Found | Justice Junction 24/7</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div style={s.container}>
        <div style={s.iconWrap}>
          <AlertTriangle size={48} color="var(--gold)" />
        </div>

        <h1 style={s.code}>404</h1>
        <h2 style={s.title}>Page Not Found</h2>
        <p style={s.desc}>
          The page you're looking for doesn't exist or has been moved.
          Don't worry — you can still find what you need.
        </p>

        <div style={s.actions}>
          <Link to="/" className="btn btn-primary btn-lg" style={{ gap: 8 }}>
            <Home size={18} /> Go Home
          </Link>
          <Link to="/search" className="btn btn-outline btn-lg" style={{ gap: 8 }}>
            <Search size={18} /> Find a Lawyer
          </Link>
        </div>

        <div style={s.helpText}>
          Need assistance? <Link to="/contact" style={{ color: 'var(--bur)', fontWeight: 700 }}>Contact our support team</Link>
        </div>
      </div>
    </div>
  )
}

const s = {
  container: { textAlign: 'center', maxWidth: 500, padding: '2rem' },
  iconWrap: { width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,148,58,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' },
  code: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(5rem, 15vw, 8rem)', fontWeight: 800, background: 'linear-gradient(135deg, var(--bur), var(--gold))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, margin: 0 },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--txt)' },
  desc: { fontSize: '1rem', color: 'var(--txt-3)', lineHeight: 1.7, marginBottom: '2.5rem', maxWidth: 400, margin: '0 auto 2.5rem' },
  actions: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' },
  helpText: { fontSize: '.85rem', color: 'var(--txt-3)' },
}
