import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const accepted = localStorage.getItem('jj_cookie_accepted')
    if (!accepted) {
      // Small delay so it doesn't flash on page load
      const timer = setTimeout(() => setShow(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('jj_cookie_accepted', 'true')
    setShow(false)
  }

  if (!show) return null

  return (
    <div style={s.overlay}>
      <div style={s.banner} className="cookie-consent-animate">
        <div style={s.text}>
          We use cookies to improve your experience. By continuing, you agree to our{' '}
          <Link href="/privacy-policy" style={s.link}>Privacy Policy</Link> and Cookie Policy.
        </div>
        <div style={s.actions}>
          <Link href="/privacy-policy" className="btn btn-ghost btn-sm" style={{ fontSize: '.8rem' }}>
            Learn More
          </Link>
          <button className="btn btn-primary btn-sm" onClick={handleAccept} style={{ fontSize: '.8rem' }}>
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}

const s = {
  overlay: {
    position: 'fixed', bottom: 40, left: 0, right: 0,
    zIndex: 9998, display: 'flex', justifyContent: 'center',
    padding: '0 1rem', pointerEvents: 'none',
  },
  banner: {
    background: '#fff', border: '1px solid var(--border)',
    borderRadius: '20px', padding: '1.2rem 1.5rem',
    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
    display: 'flex', alignItems: 'center', gap: '1.5rem',
    maxWidth: 800, width: '100%', flexWrap: 'wrap',
    animation: 'cookieSlideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    pointerEvents: 'auto',
  },
  text: {
    flex: 1, fontSize: '.85rem', color: 'var(--txt-2)',
    lineHeight: 1.5, minWidth: 240,
  },
  link: { color: 'var(--bur)', fontWeight: 700, textDecoration: 'underline' },
  actions: { display: 'flex', gap: 8, flexShrink: 0 },
}
