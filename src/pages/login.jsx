import { useState } from 'react'
import { useRouter } from 'next/router'
import { API, setAuth } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Link from 'next/link'
import Head from 'next/head'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await API.login({ email, password })
      login(data.token, data.user)
      showToast('Welcome back!', 'success')
      router.push('/dashboard')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-layout page-reveal">
      <Head><title>Login | Justice Junction 24/7</title></Head>
      
      {/* Visual Side */}
      <div className="auth-visual-side">
        <div className="auth-visual-overlay" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 450 }}>
          <div style={{ color: '#F5C4B3', textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '0.1em', marginBottom: '1.5rem', fontWeight: 700 }}>India's Legal Discovery Platform</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1, color: '#F9EEE4' }}>
            Equal Access <br /> to <span style={{ color: '#F5C4B3' }}>Justice</span> for All.
          </h2>
          <p style={{ fontSize: '1.125rem', color: '#F9EEE4', lineHeight: 1.625, fontStyle: 'italic' }}>
            "The law is not a mystery, but a tool for empowerment. We bridge the gap between complexity and resolution."
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.5rem' }}>JJ</div>
            <div style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '0.75rem', padding: '4px 12px', borderRadius: '9999px', fontWeight: 600 }}>VERIFIED LEGAL NETWORK</div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: '1rem', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', border: '1px solid #E8C9A8' }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="h1-responsive" style={{ fontSize: '2.5rem', marginBottom: 8, color: '#1A0D10', fontWeight: 900 }}>Welcome Back</h1>
            <p style={{ color: '#5A3A42', fontSize: '.9rem' }}>Secure access to your legal consultations.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrap">
                <Mail size={18} className="input-icon" />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com" />
              </div>
            </div>
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrap">
                <Lock size={18} className="input-icon" />
                <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="••••••••" />
              </div>
            </div>
            <button className="btn btn-primary btn-lg magnetic-hover" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Logging in...' : <><LogIn size={18} /> Login to Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: '#5A3A42' }}>
            Don't have an account? <Link href="/register" style={{ color: '#7B1D2E', fontWeight: 600, textDecoration: 'underline' }}>Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
