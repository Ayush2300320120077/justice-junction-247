import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await API.login({ email, password })
      login(data.token, data.user)
      showToast(`Welcome back, ${data.user.name.split(' ')[0]}!`)
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.wrap}>
      <div style={s.card}>
        <div style={s.logoWrap}>
          <div style={s.logoIcon}>⚖</div>
          <div style={s.logoText}>Justice Junction</div>
          <div style={s.logoSub}>24 / 7</div>
        </div>

        <h2 style={s.title}>Welcome Back</h2>
        <p style={s.sub}>Login to manage your cases and consultations.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button className="btn-primary" type="submit" disabled={loading} style={{width:'100%',padding:'0.85rem',fontSize:'1rem',marginTop:8}}>
            {loading ? 'Logging in...' : 'Login to Account'}
          </button>
        </form>

        <p style={s.footer}>
          Don't have an account?{' '}
          <Link to="/register" style={{color:'var(--burgundy)',fontWeight:700}}>Register free</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:`linear-gradient(rgba(42, 22, 32, 0.8), rgba(123, 29, 46, 0.85)), url('/justice-bg.png')`, backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed', paddingTop:90 },
  card: { background:'rgba(255, 255, 255, 0.96)', backdropFilter:'blur(12px)', border:'1px solid rgba(255, 255, 255, 0.3)', borderRadius:20, padding:'2.5rem', width:'100%', maxWidth:440, boxShadow:'0 24px 64px rgba(0,0,0,0.4)' },
  logoWrap: { textAlign:'center', marginBottom:'1.5rem' },
  logoIcon: { width:52, height:52, background:'var(--burgundy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1.5rem', margin:'0 auto 0.6rem' },
  logoText: { fontFamily:"'Playfair Display',serif", fontSize:'1.2rem', fontWeight:700, color:'var(--burgundy)' },
  logoSub: { fontSize:'0.65rem', fontWeight:600, color:'var(--gold)', letterSpacing:'0.12em', textTransform:'uppercase' },
  title: { fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', fontWeight:700, textAlign:'center', marginBottom:6 },
  sub: { color:'var(--text-muted)', fontSize:'0.88rem', textAlign:'center', marginBottom:'1.8rem' },
  footer: { textAlign:'center', marginTop:'1.2rem', fontSize:'0.85rem', color:'var(--text-muted)' }
}
