import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Lock, Eye, EyeOff, KeyRound, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react'
import { API } from '../api'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''

  const [newPassword, setNewPassword]     = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNew, setShowNew]             = useState(false)
  const [showConfirm, setShowConfirm]     = useState(false)
  const [loading, setLoading]             = useState(false)
  const [success, setSuccess]             = useState(false)
  const [error, setError]                 = useState('')
  const [validationError, setValidationError] = useState('')

  // ── Missing / clearly-invalid token ─────────────────────────────────────────
  if (!token) {
    return (
      <div className="auth-layout page-reveal">
        <Helmet>
          <title>Invalid Reset Link — Justice Junction 24/7</title>
        </Helmet>

        {/* Visual side — static version matching login.jsx */}
        <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #1A0A0D 0%, #3D0E16 100%)' }}>
          <div className="auth-visual-overlay" />
          <div className="auth-visual-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: 480 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>🔐</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#FFF9F2', marginBottom: '1rem', lineHeight: 1.2 }}>
                Secure Password Reset
              </h2>
              <p style={{ color: '#F5E6D3', lineHeight: 1.8, opacity: 0.85, fontSize: '1rem' }}>
                Reset links are single-use and expire in 15 minutes to keep your account protected.
              </p>
            </div>
          </div>
        </div>

        {/* Form side */}
        <div className="auth-form-side">
          <div className="glass-auth-card">
            <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
              <AlertCircle size={52} color="#F59E0B" style={{ marginBottom: '1.2rem' }} />
              <h1 style={{ fontSize: '1.6rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
                Invalid Reset Link
              </h1>
              <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                This password reset link is missing, invalid, or has already been used.
                Please request a new one from the login page.
              </p>
              <Link
                to="/login"
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '.9rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', color: '#fff', textDecoration: 'none', fontWeight: 800, border: '1px solid rgba(245,196,179,0.4)' }}
              >
                Back to Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Client-side validation ───────────────────────────────────────────────────
  const validate = () => {
    if (newPassword.length < 8) {
      setValidationError('Password must be at least 8 characters.')
      return false
    }
    if (newPassword !== confirmPassword) {
      setValidationError('Passwords do not match.')
      return false
    }
    setValidationError('')
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setError('')
    try {
      await API.resetPassword({ token, newPassword })
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Password reset failed. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  // ── Success state ────────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="auth-layout page-reveal">
        <Helmet>
          <title>Password Reset Successful — Justice Junction 24/7</title>
        </Helmet>
        <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #1A0A0D 0%, #3D0E16 100%)' }}>
          <div className="auth-visual-overlay" />
          <div className="auth-visual-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ maxWidth: 480 }}>
              <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>✅</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#FFF9F2', marginBottom: '1rem', lineHeight: 1.2 }}>
                Password Updated.
              </h2>
              <p style={{ color: '#F5E6D3', lineHeight: 1.8, opacity: 0.85 }}>
                Your new password is active. All previous sessions have been signed out for your security.
              </p>
            </div>
          </div>
        </div>
        <div className="auth-form-side">
          <div className="glass-auth-card">
            <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
              <CheckCircle2 size={52} color="#4ADE80" style={{ marginBottom: '1.2rem' }} />
              <h1 style={{ fontSize: '1.6rem', color: '#FFF9F2', fontWeight: 900, marginBottom: '.6rem' }}>
                Password Reset!
              </h1>
              <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="btn btn-primary btn-lg"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '.9rem 2rem', borderRadius: 14, background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', color: '#fff', textDecoration: 'none', fontWeight: 800, border: '1px solid rgba(245,196,179,0.4)' }}
              >
                Log in Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Reset form ───────────────────────────────────────────────────────────────
  return (
    <div className="auth-layout page-reveal">
      <Helmet>
        <title>Reset Password — Justice Junction 24/7</title>
        <meta name="description" content="Set a new password for your Justice Junction account." />
      </Helmet>

      {/* Visual side */}
      <div className="auth-visual-side" style={{ background: 'linear-gradient(135deg, #1A0A0D 0%, #3D0E16 100%)' }}>
        <div className="auth-visual-overlay" />
        <div className="auth-visual-content" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ maxWidth: 480 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 30, background: 'rgba(123,29,46,0.4)', border: '1px solid rgba(245,196,179,0.3)', color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              <ShieldCheck size={14} /> SECURE RESET
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 900, color: '#FFF9F2', marginBottom: '1rem', lineHeight: 1.2 }}>
              Choose a<br />
              <span style={{ background: 'linear-gradient(135deg, #F5C4B3 0%, #E8C9A8 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Strong Password.
              </span>
            </h2>
            <p style={{ color: '#F5E6D3', lineHeight: 1.8, opacity: 0.85, fontSize: '1rem', background: 'rgba(18,8,11,0.45)', padding: '1rem 1.4rem', borderRadius: 14, borderLeft: '4px solid #F5C4B3' }}>
              Use at least 8 characters. Mix letters, numbers, and symbols for the strongest protection.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.55)', fontSize: '.8rem' }}>
              <Lock size={14} /> Reset link expires in 15 minutes
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="glass-auth-card">

          {/* Header */}
          <div style={{ marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <KeyRound size={28} color="#F5C4B3" />
              <h1 style={{ fontSize: '2rem', color: '#FFF9F2', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                Reset Password
              </h1>
            </div>
            <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.88rem', margin: 0 }}>
              Enter and confirm your new password below.
            </p>
          </div>

          {/* API error banner */}
          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 12, padding: '1rem 1.2rem', marginBottom: '1.4rem', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <AlertCircle size={18} color="#F87171" style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ color: '#F87171', fontWeight: 800, fontSize: '.88rem', marginBottom: 4 }}>Reset failed</div>
                <div style={{ color: '#FCA5A5', fontSize: '.83rem', lineHeight: 1.6 }}>
                  {error} — <Link to="/login" style={{ color: '#FCA5A5', fontWeight: 700 }}>Return to login to try again</Link>.
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* New password */}
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                NEW PASSWORD
              </label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="reset-new-password"
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => { setNewPassword(e.target.value); setValidationError('') }}
                  required
                  minLength={8}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowNew(v => !v)}
                  title={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div className="form-group" style={{ marginBottom: '1.4rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                CONFIRM PASSWORD
              </label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  id="reset-confirm-password"
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setValidationError('') }}
                  required
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirm(v => !v)}
                  title={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* Inline validation error */}
              {validationError && (
                <p style={{ color: '#F87171', fontSize: '.8rem', marginTop: 6, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <AlertCircle size={14} /> {validationError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              id="reset-password-submit"
              type="submit"
              className="btn btn-primary btn-lg magnetic-hover"
              disabled={loading}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #7B1D2E 0%, #9B2D42 100%)',
                boxShadow: '0 8px 24px rgba(123,29,46,0.4)',
                border: '1px solid rgba(245,196,179,0.4)',
                fontSize: '1.02rem',
                fontWeight: 800,
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Setting new password…' : 'Set New Password'}
            </button>
          </form>

          {/* Footer */}
          <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '.88rem', color: '#F5E6D3', opacity: 0.9 }}>
            Remembered it?{' '}
            <Link to="/login" style={{ color: '#F5C4B3', fontWeight: 800, textDecoration: 'underline' }}>
              Back to Login →
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}
