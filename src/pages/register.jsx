import { useState } from 'react'
import { useRouter } from 'next/router'
import { API } from '../api'
import { useToast } from '../context/ToastContext'
import Link from 'next/link'
import Head from 'next/head'
import { Mail, Lock, User, UserPlus, Scale } from 'lucide-react'

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'client' })
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await API.register(formData)
      showToast('Account created! Please login.', 'success')
      router.push('/login')
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-wrap" style={{display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream-2)', padding: '4rem 1rem'}}>
      <Head><title>Register — Justice Junction 24/7</title></Head>
      <div style={{background:'#fff', padding:'3rem', borderRadius:'32px', boxShadow:'var(--sh-xl)', width:'100%', maxWidth:500, border:'1px solid var(--border)'}}>
        <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
          <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:'2.2rem', marginBottom:8}}>Join the Platform</h1>
          <p style={{color:'var(--txt-3)', fontSize:'.9rem'}}>Choose your role and start your journey.</p>
        </div>

        <div style={{display:'flex', gap:10, marginBottom:'2rem'}}>
          <button 
            style={{flex:1, padding:'1rem', borderRadius:16, border:`2px solid ${formData.role==='client'?'var(--bur)':'var(--border)'}`, background:formData.role==='client'?'var(--cream-2)':'#fff', cursor:'pointer', transition:'all .2s'}}
            onClick={() => setFormData({...formData, role:'client'})}
          >
            <User size={24} color={formData.role==='client'?'var(--bur)':'var(--txt-3)'} style={{marginBottom:8}}/>
            <div style={{fontWeight:800, fontSize:'.9rem', color:formData.role==='client'?'var(--bur)':'var(--txt-3)'}}>Client</div>
          </button>
          <button 
            style={{flex:1, padding:'1rem', borderRadius:16, border:`2px solid ${formData.role==='lawyer'?'var(--bur)':'var(--border)'}`, background:formData.role==='lawyer'?'var(--cream-2)':'#fff', cursor:'pointer', transition:'all .2s'}}
            onClick={() => setFormData({...formData, role:'lawyer'})}
          >
            <Scale size={24} color={formData.role==='lawyer'?'var(--bur)':'var(--txt-3)'} style={{marginBottom:8}}/>
            <div style={{fontWeight:800, fontSize:'.9rem', color:formData.role==='lawyer'?'var(--bur)':'var(--txt-3)'}}>Lawyer</div>
          </button>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrap">
              <User size={18} className="input-icon" />
              <input type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} required placeholder="John Doe" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrap">
              <Mail size={18} className="input-icon" />
              <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required placeholder="john@example.com" />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-wrap">
              <Lock size={18} className="input-icon" />
              <input type="password" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required placeholder="••••••••" minLength={6} />
            </div>
          </div>
          <button className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'1rem'}} disabled={loading}>
            {loading ? 'Creating account...' : <><UserPlus size={18}/> Create Account</>}
          </button>
        </form>

        <div style={{textAlign:'center', marginTop:'2rem', fontSize:'.9rem', color:'var(--txt-3)'}}>
          Already have an account? <Link href="/login" style={{color:'var(--bur)', fontWeight:800}}>Login Here</Link>
        </div>
      </div>
    </div>
  )
}
