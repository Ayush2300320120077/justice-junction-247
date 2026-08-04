import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, LogIn, Eye, EyeOff, ShieldCheck, Sparkles, Scale, User, Video, RefreshCw } from 'lucide-react'

const THEMES = [
  {
    id: 'courtroom',
    name: 'Courtroom Ambient',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-scales-of-justice-close-up-42861-large.mp4',
    posterUrl: '/images/hero-courtroom.jpg',
    tagline: 'SCALES OF JUSTICE',
    quote: '"Justice is the first virtue of social institutions, as truth is of systems of thought."',
    author: 'John Rawls'
  },
  {
    id: 'supreme',
    name: 'Supreme Law',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-judge-gaveling-42862-large.mp4',
    posterUrl: '/images/supreme-court.jpg',
    tagline: 'CONSTITUTIONAL INTEGRITY',
    quote: '"The law is not a mystery, but a tool for empowerment. We bridge complexity & resolution."',
    author: 'Justice Junction Motto'
  },
  {
    id: 'counsel',
    name: 'Executive Counsel',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-lawyer-reading-a-book-42860-large.mp4',
    posterUrl: '/images/lawyer-hero.jpg',
    tagline: 'VERIFIED EXPERT NETWORK',
    quote: '"In matters of truth and justice, there is no difference between large and small problems."',
    author: 'Albert Einstein'
  }
]

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [roleTab, setRoleTab] = useState('client') // 'client' | 'lawyer'
  const [rememberMe, setRememberMe] = useState(true)
  const [loading, setLoading] = useState(false)
  const [currentThemeIdx, setCurrentThemeIdx] = useState(0)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const currentTheme = THEMES[currentThemeIdx]

  // Rotate quotes / themes automatically every 12 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentThemeIdx((prev) => (prev + 1) % THEMES.length)
    }, 12000)
    return () => clearInterval(timer)
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await API.login({ email, password })
      login(data.user)
      showToast(`Welcome back, ${data.user?.name || 'User'}!`, 'success')
      navigate(data.user?.role === 'admin' ? '/admin/dashboard' : '/dashboard')
    } catch (err) {
      showToast(err.message || 'Login failed. Please check credentials.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (role) => {
    setRoleTab(role)
    if (role === 'client') {
      setEmail('client@demo.com')
      setPassword('demo123')
      showToast('Client demo credentials loaded!', 'info')
    } else {
      setEmail('lawyer@demo.com')
      setPassword('demo123')
      showToast('Lawyer demo credentials loaded!', 'info')
    }
  }

  const handleForgotPassword = () => {
    if (!email) {
      showToast('Please enter your email address first.', 'error')
      return
    }
    showToast(`Password reset link sent to ${email}`, 'success')
  }

  return (
    <div className="auth-layout page-reveal">
      <Helmet><title>Login — Cinematic Portal | Justice Junction 24/7</title></Helmet>

      {/* Visual Side with Live Video Background */}
      <div className="auth-visual-side">
        {/* Background Video */}
        <video
          key={currentTheme.videoUrl}
          autoPlay
          loop
          muted
          playsInline
          poster={currentTheme.posterUrl}
          onCanPlay={() => setVideoLoaded(true)}
          className="auth-video-bg"
          style={{ opacity: videoLoaded ? 0.75 : 0 }}
        >
          <source src={currentTheme.videoUrl} type="video/mp4" />
        </video>

        {/* Fallback Image Backdrop if video is loading */}
        {!videoLoaded && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `url(${currentTheme.posterUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.65) contrast(1.1)',
              transition: 'background-image 0.8s ease-in-out'
            }}
          />
        )}

        {/* Gradient Overlay */}
        <div className="auth-visual-overlay" />

        {/* Visual Content Layer */}
        <div className="auth-visual-content">
          {/* Top Bar: Network Info & Theme Selector */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7B1D2E, #5C1521)',
                border: '1.5px solid rgba(245, 196, 179, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFF9F2',
                fontWeight: 800,
                fontSize: '1.1rem',
                boxShadow: '0 4px 14px rgba(0,0,0,0.4)'
              }}>
                JJ
              </div>
              <div>
                <div style={{ color: '#F5C4B3', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  Justice Junction 24/7
                </div>
                <div style={{ color: '#FFF9F2', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ShieldCheck size={14} color="#4ADE80" /> VERIFIED LEGAL NETWORK
                </div>
              </div>
            </div>

            {/* Live Theme Pills */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {THEMES.map((theme, idx) => (
                <button
                  key={theme.id}
                  onClick={() => setCurrentThemeIdx(idx)}
                  className={`theme-pill ${currentThemeIdx === idx ? 'active' : ''}`}
                >
                  <Video size={12} style={{ display: 'inline', marginRight: 4 }} />
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Center Showcase Text */}
          <div style={{ maxWidth: 540, marginTop: 'auto', marginBottom: 'auto', paddingTop: '3rem', paddingBottom: '2rem' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 16px',
              borderRadius: 30,
              background: 'rgba(123, 29, 46, 0.4)',
              border: '1px solid rgba(245, 196, 179, 0.3)',
              color: '#F5C4B3',
              fontSize: '0.75rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              backdropFilter: 'blur(8px)'
            }}>
              <Sparkles size={14} /> {currentTheme.tagline}
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', Georgia, serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 900,
              marginBottom: '1.2rem',
              lineHeight: 1.15,
              color: '#FFF9F2',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)'
            }}>
              Cinematic Access to <br />
              <span style={{
                background: 'linear-gradient(135deg, #F5C4B3 0%, #E8C9A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Legal Excellence.</span>
            </h2>

            <p style={{
              fontSize: '1.1rem',
              color: '#F5E6D3',
              lineHeight: 1.7,
              fontStyle: 'italic',
              background: 'rgba(18, 8, 11, 0.45)',
              padding: '1.2rem 1.5rem',
              borderRadius: 16,
              borderLeft: '4px solid #F5C4B3',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
            }}>
              {currentTheme.quote}
              <span style={{ display: 'block', fontSize: '0.85rem', color: '#F5C4B3', fontStyle: 'normal', fontWeight: 700, marginTop: 8 }}>
                — {currentTheme.author}
              </span>
            </p>
          </div>

          {/* Bottom Live Indicators */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(245, 196, 179, 0.15)' }}>
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span>🔒 256-Bit SSL Encryption</span>
              <span>•</span>
              <span>⚡ Live Instant Connect</span>
            </div>
            <button
              onClick={() => setCurrentThemeIdx((prev) => (prev + 1) % THEMES.length)}
              style={{ background: 'transparent', border: 'none', color: '#F5C4B3', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', fontWeight: 700 }}
              title="Next Background"
            >
              <RefreshCw size={14} /> Change Video Backdrop
            </button>
          </div>
        </div>
      </div>

      {/* Form Side with Glassmorphism Card */}
      <div className="auth-form-side">
        <div className="glass-auth-card">
          {/* Header */}
          <div style={{ textAlignment: 'left', marginBottom: '1.8rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <h1 style={{ fontSize: '2rem', color: '#FFF9F2', fontWeight: 900, letterSpacing: '-0.02em', margin: 0 }}>
                Welcome Back
              </h1>
              <span style={{ background: 'rgba(46, 204, 113, 0.15)', color: '#4ADE80', border: '1px solid rgba(74, 222, 128, 0.3)', padding: '2px 10px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800 }}>
                ● SYSTEM LIVE
              </span>
            </div>
            <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.88rem', margin: 0 }}>
              Log in to manage your legal consultations & cases.
            </p>
          </div>

          {/* Role Toggle Tabs */}
          <div style={{ display: 'flex', gap: 8, background: 'rgba(255, 255, 255, 0.05)', padding: 4, borderRadius: 14, border: '1px solid rgba(245, 196, 179, 0.15)', marginBottom: '1.8rem' }}>
            <button
              type="button"
              onClick={() => setRoleTab('client')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                background: roleTab === 'client' ? 'linear-gradient(135deg, #7B1D2E, #9B2D42)' : 'transparent',
                color: roleTab === 'client' ? '#fff' : '#F5E6D3',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <User size={15} /> Client Login
            </button>
            <button
              type="button"
              onClick={() => setRoleTab('lawyer')}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: 10,
                border: 'none',
                background: roleTab === 'lawyer' ? 'linear-gradient(135deg, #7B1D2E, #9B2D42)' : 'transparent',
                color: roleTab === 'lawyer' ? '#fff' : '#F5E6D3',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              <Scale size={15} /> Lawyer Portal
            </button>
          </div>

          {/* 1-Click Quick Demo Login Chips */}
          <div style={{ marginBottom: '1.5rem', background: 'rgba(123, 29, 46, 0.15)', padding: '10px 14px', borderRadius: 12, border: '1px dashed rgba(245, 196, 179, 0.25)' }}>
            <div style={{ fontSize: '0.72rem', color: '#F5C4B3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              ⚡ 1-Click Demo Login (Test Accounts)
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="demo-chip" onClick={() => fillDemoCredentials('client')}>
                <User size={13} /> Client Demo
              </button>
              <button type="button" className="demo-chip" onClick={() => fillDemoCredentials('lawyer')}>
                <Scale size={13} /> Lawyer Demo
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                EMAIL ADDRESS
              </label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder={roleTab === 'client' ? 'you@example.com' : 'advocate@chambers.in'}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.4rem' }}>
                <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em', margin: 0 }}>
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ background: 'transparent', border: 'none', color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? 'Hide Password' : 'Show Password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: '1.5rem' }}>
              <input
                type="checkbox"
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#7B1D2E', width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="remember" style={{ color: '#F5E6D3', fontSize: '0.85rem', cursor: 'pointer', userSelect: 'none' }}>
                Keep me signed in on this device
              </label>
            </div>

            <button
              className="btn btn-primary btn-lg magnetic-hover"
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: 14,
                background: 'linear-gradient(135deg, #7B1D2E 0%, #9B2D42 100%)',
                boxShadow: '0 8px 24px rgba(123, 29, 46, 0.4)',
                border: '1px solid rgba(245, 196, 179, 0.4)',
                fontSize: '1.02rem',
                fontWeight: 800,
                color: '#fff',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
              disabled={loading}
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <LogIn size={18} /> Login to {roleTab === 'client' ? 'Client' : 'Lawyer'} Account
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '.88rem', color: '#F5E6D3', opacity: 0.9 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#F5C4B3', fontWeight: 800, textDecoration: 'underline' }}>
              Register Free Now →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
