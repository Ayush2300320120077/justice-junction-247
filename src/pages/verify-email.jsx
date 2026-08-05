import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { MailCheck, CheckCircle2, AlertCircle, Loader2, ShieldCheck } from 'lucide-react'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const { isLoggedIn } = useAuth()

  const [status, setStatus] = useState('idle')   // 'idle' | 'loading' | 'success' | 'error' | 'no-token'
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!token) {
      setStatus('no-token')
      return
    }
    // Auto-verify on mount — no button press required.
    // The token in the URL is the user's proof; firing immediately is the correct UX.
    setStatus('loading')
    API.verifyEmail({ token })
      .then(() => setStatus('success'))
      .catch((err) => {
        setErrorMessage(err.message || 'Email verification failed.')
        setStatus('error')
      })
  }, [token]) // token is stable for the lifetime of this page visit

  // ── Shared visual panel ──────────────────────────────────────────────────────
  const VisualPanel = ({ emoji, headline, sub }) => (
    <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #1A0A0D 0%, #3D0E16 100%)' }}>
      <div className="auth-visual-overlay" />
      <div className="auth-visual-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ maxWidth: 480 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(123,29,46,0.4)', border: '1px solid rgba(245,196,179,0.3)', color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
            <ShieldCheck size={14} /> EMAIL VERIFICATION
          </div>
          <div style={{ fontSize: '3.5rem', marginBottom: '1.2rem' }}>{emoji}</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#FFF9F2', marginBottom: '1rem', lineHeight: 1.2 }}>
            {headline}
          </h2>
          <p style={{ color: '#F5E6D3', lineHeight: 1.8, opacity: 0.85, fontSize: '1rem', background: 'rgba(18,8,11,0.45)', padding: '1rem 1.4rem', borderRadius: 14, borderLeft: '4px solid #F5C4B3' }}>
            {sub}
          </p>
        </div>
      </div>
    </div>
  )

  // ── Loading ──────────────────────────────────────────────────────────────────
  if (status === 'idle' || status === 'loading') {
    return (
      <div className="auth-layout page-reveal">
        <Helmet><title>Verifying Email — Justice Junction 24/7</title></Helmet>
        <VisualPanel
          emoji="📧"
          headline="Verifying your email…"
          sub="Hang tight while we confirm your email address. This only takes a moment."
        />
        <div className="auth-form-side">
          <div className="glass-auth-card">
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <Loader2 size={52} color="#F5C4B3" className="animate-spin" style={{ marginBottom: '1.5rem', animation: 'spin 1s linear infinite' }} />
              <h1 style={{ fontSize: '1.6rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
                Verifying…
              </h1>
              <p style={{ color: '#F5E6D3', opacity: 0.75, fontSize: '.95rem' }}>
                Checking your verification link. Please wait.
              </p>
            </div>
          </div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ── Missing token ────────────────────────────────────────────────────────────
  if (status === 'no-token') {
    return (
      <div className="auth-layout page-reveal">
        <Helmet><title>Invalid Verification Link — Justice Junction 24/7</title></Helmet>
        <VisualPanel
          emoji="🔗"
          headline="Broken Link?"
          sub="Verification links are sent to your registered email address and expire after 24 hours."
        />
        <div className="auth-form-side">
          <div className="glass-auth-card">
            <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
              <AlertCircle size={52} color="#F59E0B" style={{ marginBottom: '1.2rem' }} />
              <h1 style={{ fontSize: '1.6rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
                Invalid Verification Link
              </h1>
              <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                This link is missing a verification token. Please click the link directly from your welcome email, or contact us if you need help.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link
                  to="/login"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '.9rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', color: '#fff', textDecoration: 'none', fontWeight: 800, border: '1px solid rgba(245,196,179,0.4)' }}
                >
                  Go to Login
                </Link>
                <Link
                  to="/contact"
                  style={{ color: '#F5C4B3', fontWeight: 700, fontSize: '.88rem', textAlign: 'center', textDecoration: 'underline' }}
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Error (expired / already used / invalid token) ───────────────────────────
  if (status === 'error') {
    return (
      <div className="auth-layout page-reveal">
        <Helmet><title>Verification Failed — Justice Junction 24/7</title></Helmet>
        <VisualPanel
          emoji="⏳"
          headline="Link Expired or Already Used."
          sub="Verification links are valid for 24 hours and can only be used once."
        />
        <div className="auth-form-side">
          <div className="glass-auth-card">
            <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
              <AlertCircle size={52} color="#F87171" style={{ marginBottom: '1.2rem' }} />
              <h1 style={{ fontSize: '1.6rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
                Verification Failed
              </h1>
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                <p style={{ color: '#FCA5A5', fontSize: '.88rem', margin: 0, lineHeight: 1.6 }}>
                  {errorMessage}
                </p>
              </div>
              <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.92rem', lineHeight: 1.7, marginBottom: '1.8rem' }}>
                If your link has expired, please contact our support team to receive a new verification email.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <Link
                  to="/contact"
                  className="btn btn-primary btn-lg"
                  style={{ display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: 8, padding: '.9rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', color: '#fff', textDecoration: 'none', fontWeight: 800, border: '1px solid rgba(245,196,179,0.4)' }}
                >
                  Contact Support →
                </Link>
                <Link
                  to="/login"
                  style={{ color: '#F5C4B3', fontWeight: 700, fontSize: '.88rem', textAlign: 'center', textDecoration: 'underline' }}
                >
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Success ──────────────────────────────────────────────────────────────────
  return (
    <div className="auth-layout page-reveal">
      <Helmet>
        <title>Email Verified — Justice Junction 24/7</title>
        <meta name="description" content="Your Justice Junction email address has been verified." />
      </Helmet>

      <VisualPanel
        emoji="🎉"
        headline="You're verified."
        sub="Your email address is now confirmed. Your account is fully active across Justice Junction."
      />

      <div className="auth-form-side">
        <div className="glass-auth-card">
          <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>

            {/* Success icon */}
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(74,222,128,0.12)', border: '2px solid rgba(74,222,128,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={40} color="#4ADE80" />
            </div>

            <h1 style={{ fontSize: '1.8rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
              Email Verified! 🎊
            </h1>
            <p style={{ color: '#F5E6D3', opacity: 0.85, fontSize: '.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
              Your email address has been successfully confirmed. Welcome to{' '}
              <strong style={{ color: '#F5C4B3' }}>Justice Junction 24/7</strong>.
            </p>

            {/* Trust badge row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: '2rem', flexWrap: 'wrap' }}>
              {['✅ Verified Account', '🔒 Secure Access', '⚡ Full Platform Access'].map(item => (
                <span key={item} style={{ fontSize: '.78rem', color: '#4ADE80', fontWeight: 800, background: 'rgba(74,222,128,0.08)', padding: '.3rem .8rem', borderRadius: 20, border: '1px solid rgba(74,222,128,0.2)' }}>
                  {item}
                </span>
              ))}
            </div>

            {/* CTA — send to dashboard if already logged in, login page if not */}
            <Link
              to={isLoggedIn ? '/dashboard' : '/login'}
              className="btn btn-primary btn-lg magnetic-hover"
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '.95rem 2.2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '1rem', boxShadow: '0 8px 24px rgba(123,29,46,0.4)', border: '1px solid rgba(245,196,179,0.4)', width: '100%' }}
            >
              <MailCheck size={18} />
              {isLoggedIn ? 'Go to Dashboard →' : 'Log in to Your Account →'}
            </Link>

          </div>
        </div>
      </div>
    </div>
  )
}
