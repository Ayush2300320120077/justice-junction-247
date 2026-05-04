import { useState } from 'react'
import { useRouter } from 'next/router'
import { API } from '../api'
import { useToast } from '../context/ToastContext'
import Link from 'next/link'
import Head from 'next/head'
import { Mail, Lock, User, UserPlus, Scale } from 'lucide-react'
import LawyerRegistrationWizard from '../components/LawyerRegistrationWizard'

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

  // If lawyer is selected, show the multi-step wizard
  if (formData.role === 'lawyer') {
    return (
      <div className="page-reveal" style={{ paddingTop: 95, minHeight: '100vh', background: 'var(--cream)' }}>
        <Head><title>Lawyer Registration — Justice Junction 24/7</title></Head>
        <div className="container" style={{ maxWidth: 800, paddingTop: '2rem', paddingBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="h1-responsive" style={{ fontSize: '2.2rem', marginBottom: 8 }}>Lawyer <span className="gradient-text">Registration</span></h1>
            <p style={{ color: 'var(--txt-3)', fontSize: '.9rem' }}>Create your professional profile on Justice Junction.</p>
          </div>

          {/* Role toggle — still available */}
          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: '2px solid var(--border)', background: '#fff', cursor: 'pointer', transition: 'all .2s' }}
              onClick={() => setFormData({...formData, role:'client'})}
            >
              <User size={24} color="var(--txt-3)" style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--txt-3)' }}>Client</div>
            </button>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: '2px solid var(--bur)', background: 'var(--cream-2)', cursor: 'pointer', transition: 'all .2s' }}
              onClick={() => setFormData({...formData, role:'lawyer'})}
            >
              <Scale size={24} color="var(--bur)" style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--bur)' }}>Lawyer</div>
            </button>
          </div>

          <LawyerRegistrationWizard />

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: 'var(--txt-3)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--bur)', fontWeight: 800 }}>Login Here</Link>
          </div>
        </div>
      </div>
    )
  }

  // Client registration — original form unchanged
  return (
    <div className="auth-layout page-reveal">
      <Head><title>Register — Justice Junction 24/7</title></Head>

      {/* Visual Side */}
      <div className="auth-visual-side">
        <div className="auth-visual-overlay" />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 450 }}>
          <div className="tag" style={{ background: 'var(--gold)', color: '#000', border: 'none', marginBottom: '1.5rem' }}>Join the Network</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.1 }}>
            Empower Your <span style={{ color: 'var(--gold)' }}>Legal</span> Journey.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, fontStyle: 'italic' }}>
            "Whether you are seeking resolution or providing counsel, we provide the platform for meaningful legal connection."
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#000', fontWeight: 800 }}>JJ</div>
            <div style={{ fontSize: '.8rem', fontWeight: 700 }}>VERIFIED LEGAL NETWORK</div>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div style={{ width: '100%', maxWidth: 450 }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="h1-responsive" style={{ fontSize: '2.5rem', marginBottom: 8 }}>Create <span className="gradient-text">Account</span></h1>
            <p style={{ color: 'var(--txt-3)', fontSize: '.9rem' }}>Choose your role and start your journey.</p>
          </div>

          <div style={{ display: 'flex', gap: 10, marginBottom: '2rem' }}>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: `2px solid ${formData.role==='client'?'var(--bur)':'var(--border)'}`, background: formData.role==='client'?'var(--cream-2)':'#fff', cursor: 'pointer', transition: 'all .2s' }}
              onClick={() => setFormData({...formData, role:'client'})}
            >
              <User size={24} color={formData.role==='client'?'var(--bur)':'var(--txt-3)'} style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: formData.role==='client'?'var(--bur)':'var(--txt-3)' }}>Client</div>
            </button>
            <button 
              className="magnetic-hover"
              style={{ flex: 1, padding: '1rem', borderRadius: 16, border: `2px solid ${formData.role==='lawyer'?'var(--bur)':'var(--border)'}`, background: formData.role==='lawyer'?'var(--cream-2)':'#fff', cursor: 'pointer', transition: 'all .2s' }}
              onClick={() => setFormData({...formData, role:'lawyer'})}
            >
              <Scale size={24} color={formData.role==='lawyer'?'var(--bur)':'var(--txt-3)'} style={{ marginBottom: 8 }}/>
              <div style={{ fontWeight: 800, fontSize: '.9rem', color: formData.role==='lawyer'?'var(--bur)':'var(--txt-3)' }}>Lawyer</div>
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
            <button className="btn btn-primary btn-lg magnetic-hover" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
              {loading ? 'Creating account...' : <><UserPlus size={18}/> Create Account</>}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '.9rem', color: 'var(--txt-3)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--bur)', fontWeight: 800 }}>Login Here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
