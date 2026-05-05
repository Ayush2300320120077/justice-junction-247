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
          <div className="tag" style={{ background: 'var(--gold)', color: '#000', border: 'none', marginBottom: '1.5rem' }}>Boutique Legal Platform</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Equal Access <br /> to <span style={{ color: 'var(--gold)' }}>Justice</span> for All.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
            "The law is not a mystery, but a tool for empowerment. We bridge the gap between complexity and resolution."
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#000', fontWeight: 800 }}>JJ</div>
            <div style={{ fontSize: '.8rem', fontWeight: 700 }}>VERIFIED LEGAL NETWORK</div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div style={{ width: '100%', maxWidth: 400 }}>
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 className="h1-responsive" style={{ fontSize: '2.5rem', marginBottom: 8 }}>Welcome <span className="gradient-text">Back</span></h1>
            <p style={{ color: 'var(--txt-3)', fontSize: '.9rem' }}>Secure access to your legal consultations.</p>
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

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: 'var(--txt-3)' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--bur)', fontWeight: 800 }}>Register Now</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
