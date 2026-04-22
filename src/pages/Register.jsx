import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Scale, User } from 'lucide-react'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Civil Disputes','Divorce']

export default function Register() {
  const [role, setRole] = useState('client')
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', city:'', state:'', barRegistrationNumber:'', experience:'', consultationFee:'', specializations:'', bio:'' })
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const body = { ...form, role }
      if (role === 'lawyer') {
        body.specializations = form.specializations.split(',').map(s => s.trim()).filter(Boolean)
        body.experience = parseInt(form.experience) || 0
        body.consultationFee = parseFloat(form.consultationFee) || 0
      }
      const data = await API.register(body)
      login(data.token, data.user)
      showToast('Account created successfully!')
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
          <div style={s.logoIcon}><Scale size={24}/></div>
          <div style={s.logoText}>Justice Junction</div>
          <div style={s.logoSub}>Create Your Account</div>
        </div>

        {/* Role Selector */}
        <div style={s.roleRow}>
          {['client','lawyer'].map(r => (
            <div key={r} onClick={() => setRole(r)} style={{...s.roleCard, ...(role===r ? s.roleActive : {})}}>
              <div style={{marginBottom:4,display:'flex',justifyContent:'center',color:role===r?'var(--bur)':'var(--txt-3)'}}>{r==='client'?<User size={24}/>:<Scale size={24}/>}</div>
              <div style={{fontWeight:700,fontSize:'0.88rem',textTransform:'capitalize'}}>{r}</div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input type="text" placeholder="Your full name" value={form.name} onChange={set('name')} required /></div>
            <div className="form-group"><label>Phone</label><input type="tel" placeholder="10-digit number" value={form.phone} onChange={set('phone')} /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required /></div>
          <div className="form-row">
            <div className="form-group"><label>City</label><input type="text" placeholder="Your city" value={form.city} onChange={set('city')} /></div>
            <div className="form-group"><label>State</label><input type="text" placeholder="Your state" value={form.state} onChange={set('state')} /></div>
          </div>
          <div className="form-group"><label>Password</label><input type="password" placeholder="Min 6 characters" value={form.password} onChange={set('password')} required /></div>

          {role === 'lawyer' && (
            <div style={s.lawyerSection}>
              <div style={{...s.lawyerTitle,display:'flex',alignItems:'center',gap:6}}><Scale size={16}/> Lawyer Details</div>
              <div className="form-group"><label>Bar Registration Number</label><input type="text" placeholder="e.g. BAR/DL/2024/12345" value={form.barRegistrationNumber} onChange={set('barRegistrationNumber')} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Years of Experience</label><input type="number" placeholder="e.g. 8" min="0" value={form.experience} onChange={set('experience')} /></div>
                <div className="form-group"><label>Consultation Fee (₹)</label><input type="number" placeholder="e.g. 2500" min="0" value={form.consultationFee} onChange={set('consultationFee')} /></div>
              </div>
              <div className="form-group"><label>Specializations (comma-separated)</label><input type="text" placeholder="Criminal, Family Law, Property" value={form.specializations} onChange={set('specializations')} /></div>
              <div className="form-group"><label>Short Bio</label><textarea rows="3" placeholder="Brief description of your practice..." value={form.bio} onChange={set('bio')} style={{width:'100%',padding:'0.7rem 1rem',border:'1.5px solid var(--border)',borderRadius:8,fontSize:'0.92rem',color:'var(--text)',outline:'none',resize:'vertical'}} /></div>
            </div>
          )}

          <button className="btn-primary" type="submit" disabled={loading} style={{width:'100%',padding:'0.85rem',fontSize:'1rem',marginTop:8}}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p style={s.footer}>
          Already have an account?{' '}
          <Link to="/login" style={{color:'var(--burgundy)',fontWeight:700}}>Login</Link>
        </p>
      </div>
    </div>
  )
}

const s = {
  wrap: { minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:`linear-gradient(rgba(42, 22, 32, 0.8), rgba(123, 29, 46, 0.85)), url('/justice-bg.png')`, backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed', paddingTop:90 },
  card: { background:'rgba(255, 255, 255, 0.96)', backdropFilter:'blur(12px)', border:'1px solid rgba(255, 255, 255, 0.3)', borderRadius:20, padding:'2.5rem', width:'100%', maxWidth:500, boxShadow:'0 24px 64px rgba(0,0,0,0.4)' },
  logoWrap: { textAlign:'center', marginBottom:'1.5rem' },
  logoIcon: { width:48, height:48, background:'var(--burgundy)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontSize:'1.3rem', margin:'0 auto 0.5rem' },
  logoText: { fontFamily:"'Playfair Display',serif", fontSize:'1.15rem', fontWeight:700, color:'var(--burgundy)' },
  logoSub: { fontSize:'0.72rem', fontWeight:600, color:'var(--gold)', letterSpacing:'0.1em', textTransform:'uppercase' },
  roleRow: { display:'flex', gap:12, marginBottom:'1.5rem' },
  roleCard: { flex:1, border:'1.5px solid var(--border)', borderRadius:12, padding:'0.9rem', textAlign:'center', cursor:'pointer', transition:'all 0.2s' },
  roleActive: { borderColor:'var(--burgundy)', background:'rgba(123,29,46,0.04)' },
  lawyerSection: { background:'var(--cream)', border:'1px solid var(--border)', borderRadius:12, padding:'1.2rem', marginBottom:'1rem' },
  lawyerTitle: { fontWeight:700, fontSize:'0.9rem', color:'var(--burgundy)', marginBottom:'1rem' },
  footer: { textAlign:'center', marginTop:'1.2rem', fontSize:'0.85rem', color:'var(--text-muted)' }
}
