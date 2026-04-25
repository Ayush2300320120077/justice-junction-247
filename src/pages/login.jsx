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
    <div className="page-wrap" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream-2)'}}>
      <Head><title>Login — Justice Junction 24/7</title></Head>
      <div style={{background:'#fff', padding:'3rem', borderRadius:'32px', boxShadow:'var(--sh-xl)', width:'100%', maxWidth:450, border:'1px solid var(--border)'}}>
        <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', marginBottom:8}}>Welcome Back</h1>
          <p style={{color:'var(--txt-3)', fontSize:'.9rem'}}>Access your legal dashboard and consultations.</p>
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
          <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'1rem'}} disabled={loading}>
            {loading ? 'Logging in...' : <><LogIn size={18}/> Login to Account</>}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'2rem', fontSize:'.9rem', color:'var(--txt-3)'}}>
          Don't have an account? <Link href="/register" style={{color:'var(--bur)', fontWeight:800}}>Register Now</Link>
        </div>
      </div>
    </div>
  )
}
