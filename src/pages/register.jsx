import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { API } from '../api'
import { useToast } from '../context/ToastContext'
import { Helmet } from 'react-helmet-async'
import { Mail, Lock, User, UserPlus, Scale, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react'
import LawyerRegistrationWizard from '../components/LawyerRegistrationWizard'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.register(formData)
      showToast('Account created successfully! Please login.', 'success')
      navigate('/login')
    } catch (err) {
      showToast(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  // If lawyer is selected, show the multi-step wizard
  if (formData.role === 'lawyer') {
    return (
      <div className="page-reveal" style={{ paddingTop: 95, minHeight: '100vh', background: '#0D0709', color: '#FFF9F2' }}>
        <Helmet><title>Lawyer Registration — Justice Junction 24/7</title></Helmet>
        <div className="container" style={{ maxWidth: 800, paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="h1-responsive" style={{ fontSize: '2.4rem', marginBottom: 8, color: '#FFF9F2' }}>
              Lawyer <span style={{ color: '#F5C4B3' }}>Registration</span>
            </h1>
            <p style={{ color: '#F5E6D3', opacity: 0.85, fontSize: '.95rem' }}>
              Join India's premiere verified advocate platform.
            </p>
          </div>

          {/* Role toggle */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: '1px solid rgba(245, 196, 179, 0.3)', background: 'rgba(255,255,255,0.06)', cursor: 'pointer', transition: 'all .2s' }}
              onClick={() => setFormData({...formData, role:'client'})}
            >
              <User size={24} color="#F5C4B3" style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: '#FFF9F2' }}>Client</div>
            </button>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: '1px solid #F5C4B3', background: 'linear-gradient(135deg, #7B1D2E, #9B2D42)', cursor: 'pointer', transition: 'all .2s', boxShadow: '0 4px 14px rgba(123, 29, 46, 0.4)' }}
              onClick={() => setFormData({...formData, role:'lawyer'})}
            >
              <Scale size={24} color="#fff" style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: '#fff' }}>Lawyer</div>
            </button>
          </div>

          <LawyerRegistrationWizard />

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: '#F5E6D3' }}>
            Already have an account? <Link to="/login" style={{ color: '#F5C4B3', fontWeight: 800, textDecoration: 'underline' }}>Login Here</Link>
          </div>
        </div>
      </div>
    )
  }

  // Client registration
  return (
    <div className="auth-layout page-reveal">
      <Helmet><title>Register Free — Cinematic Portal | Justice Junction 24/7</title></Helmet>

      {/* Visual Side with Ambient Video & Backdrop */}
      <div className="auth-visual-side" style={{ backgroundImage: "url('/images/hero-courtroom.jpg')" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/images/hero-courtroom.jpg"
          className="auth-video-bg"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-scales-of-justice-close-up-42861-large.mp4" type="video/mp4" />
        </video>
        
        <div className="auth-visual-overlay" />

        <div className="auth-visual-content">
          {/* Top Bar */}
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
              fontSize: '1.1rem'
            }}>
              JJ
            </div>
            <div>
              <div style={{ color: '#F5C4B3', fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Justice Junction 24/7
              </div>
              <div style={{ color: '#FFF9F2', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ShieldCheck size={14} color="#4ADE80" /> TRUSTED BY 50,000+ CITIZENS
              </div>
            </div>
          </div>

          {/* Main Hero Showcase */}
          <div style={{ maxWidth: 520, marginTop: 'auto', marginBottom: 'auto', paddingTop: '3rem', paddingBottom: '2rem' }}>
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
              <Sparkles size={14} /> JOIN THE LEGAL DISCOVERY REVOLUTION
            </div>

            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', Georgia, serif",
              fontSize: 'clamp(2.2rem, 4.5vw, 3.2rem)',
              fontWeight: 900,
              marginBottom: '1.2rem',
              lineHeight: 1.15,
              color: '#FFF9F2'
            }}>
              Empower Your <br />
              <span style={{
                background: 'linear-gradient(135deg, #F5C4B3 0%, #E8C9A8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Legal Rights Today.</span>
            </h2>

            <p style={{
              fontSize: '1.08rem',
              color: '#F5E6D3',
              lineHeight: 1.7,
              fontStyle: 'italic',
              background: 'rgba(18, 8, 11, 0.45)',
              padding: '1.2rem 1.5rem',
              borderRadius: 16,
              borderLeft: '4px solid #F5C4B3',
              backdropFilter: 'blur(10px)'
            }}>
              "Whether seeking legal guidance, drafting court documents, or connecting with top advocates — your journey begins with a free account."
            </p>
          </div>

          <div style={{ display: 'flex', gap: 20, paddingTop: '1.5rem', borderTop: '1px solid rgba(245, 196, 179, 0.15)', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem' }}>
            <span>✓ Free Account</span>
            <span>•</span>
            <span>✓ Instant Case Matching</span>
            <span>•</span>
            <span>✓ Confidential & Secure</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="glass-auth-card">
          <div style={{ marginBottom: '1.8rem' }}>
            <h1 style={{ fontSize: '2rem', color: '#FFF9F2', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
              Create Account
            </h1>
            <p style={{ color: '#F5E6D3', opacity: 0.8, fontSize: '.88rem', margin: 0 }}>
              Select your account type to get started.
            </p>
          </div>

          {/* Role selector buttons */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '1.8rem' }}>
            <button 
              type="button"
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 14,
                border: `1.5px solid ${formData.role==='client'?'#F5C4B3':'rgba(245,196,179,0.2)'}`,
                background: formData.role==='client'?'linear-gradient(135deg, #7B1D2E, #9B2D42)':'rgba(255,255,255,0.05)',
                color: '#FFF9F2',
                cursor: 'pointer',
                transition: 'all .25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 700
              }}
              onClick={() => setFormData({...formData, role:'client'})}
            >
              <User size={18} color={formData.role==='client'?'#fff':'#F5C4B3'} />
              <span>Client</span>
            </button>
            <button 
              type="button"
              style={{
                flex: 1,
                padding: '0.85rem',
                borderRadius: 14,
                border: `1.5px solid ${formData.role==='lawyer'?'#F5C4B3':'rgba(245,196,179,0.2)'}`,
                background: formData.role==='lawyer'?'linear-gradient(135deg, #7B1D2E, #9B2D42)':'rgba(255,255,255,0.05)',
                color: '#FFF9F2',
                cursor: 'pointer',
                transition: 'all .25s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 700
              }}
              onClick={() => setFormData({...formData, role:'lawyer'})}
            >
              <Scale size={18} color={formData.role==='lawyer'?'#fff':'#F5C4B3'} />
              <span>Lawyer</span>
            </button>
          </div>

          <form onSubmit={handleRegister}>
            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                FULL NAME
              </label>
              <div className="input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={e=>setFormData({...formData, name:e.target.value})}
                  required
                  placeholder="e.g. Adv. Rajesh Sharma or Priya Patel"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.2rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                EMAIL ADDRESS
              </label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={e=>setFormData({...formData, email:e.target.value})}
                  required
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ color: '#F5C4B3', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.08em' }}>
                PASSWORD
              </label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={e=>setFormData({...formData, password:e.target.value})}
                  required
                  placeholder="••••••••"
                  minLength={6}
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
              {loading ? 'Creating account...' : <><UserPlus size={18}/> Register Free Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.8rem', fontSize: '.88rem', color: '#F5E6D3', opacity: 0.9 }}>
            Already have an account? <Link to="/login" style={{ color: '#F5C4B3', fontWeight: 800, textDecoration: 'underline' }}>Login Here →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
