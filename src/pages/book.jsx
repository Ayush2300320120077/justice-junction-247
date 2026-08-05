import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API } from '../api'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Helmet } from 'react-helmet-async'
import { Calendar, Clock, ShieldCheck, Video, CreditCard, ChevronRight } from 'lucide-react'

export default function Book() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user, isLoggedIn } = useAuth()
  const { showToast } = useToast()
  
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ date: '', time: '', caseType: 'General Consultation', description: '' })

  const lawyerId = searchParams.get('lawyerId')
  const lawyerName = searchParams.get('lawyerName')
  const fee = searchParams.get('fee')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  const handlePay = async () => {
    if (!formData.date || !formData.time) { showToast('Please select date and time', 'error'); return }
    setLoading(true)
    try {
      await API.createBooking({
        lawyerId,
        caseType: formData.caseType,
        description: formData.description,
        scheduledDate: formData.date,
        scheduledTime: formData.time
      })
      showToast('Payment Successful! Appointment Booked.', 'success')
      navigate('/dashboard')
    } catch (err) {
      showToast(err.message || 'Failed to create booking. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) return null

  return (
    <div className="page-wrap" style={{ 
      background: 'url(https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=2000&auto=format&fit=crop) center/cover no-repeat fixed', 
      minHeight: '100vh', 
      padding: '7rem 1rem 4rem 1rem',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(13, 7, 9, 0.95) 0%, rgba(61, 14, 22, 0.9) 100%)', zIndex: 0 }} />
      <Helmet><title>Book Consultation — {lawyerName}</title></Helmet>
      <div className="container" style={{maxWidth: 1000, position: 'relative', zIndex: 1}}>
        <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem'}}>
          {/* Form */}
          <div style={{background: 'rgba(255, 255, 255, 0.05)', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'}}>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', marginBottom: '2rem', color: '#fff'}}>Confirm Appointment</h1>
            
            <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="form-group">
                <label style={{color: '#F5E6D3', fontWeight: 700}}>Select Date</label>
                <div style={{position: 'relative', display: 'flex', alignItems: 'center', marginTop: '0.5rem'}}>
                  <Calendar size={18} style={{position: 'absolute', left: 14, color: '#F5E6D3', opacity: 0.7}} />
                  <input type="date" style={{width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem'}} value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="form-group">
                <label style={{color: '#F5E6D3', fontWeight: 700}}>Available Slots</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: '0.5rem'}}>
                  {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM'].map(t => (
                    <button 
                      key={t} 
                      style={{padding: '.8rem', borderRadius: 12, border: `1.5px solid ${formData.time === t ? 'var(--gold)' : 'rgba(255,255,255,0.1)'}`, background: formData.time === t ? 'rgba(201,148,58,0.15)' : 'rgba(255,255,255,0.03)', color: formData.time === t ? 'var(--gold)' : '#F5E6D3', fontWeight: 800, fontSize: '.85rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: formData.time === t ? '0 4px 15px rgba(201,148,58,0.2)' : 'none'}}
                      onClick={() => setFormData({...formData, time: t})}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label style={{color: '#F5E6D3', fontWeight: 700}}>Nature of Case</label>
                <select style={{width: '100%', padding: '0.8rem 1rem', border: '1.5px solid rgba(255,255,255,0.1)', borderRadius: 12, outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#000', fontSize: '0.95rem', marginTop: '0.5rem'}} value={formData.caseType} onChange={e=>setFormData({...formData, caseType: e.target.value})}>
                  {['General Consultation', 'Property Dispute', 'Family/Divorce', 'Criminal Matter', 'Corporate/Startup', 'Labour/Employment'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{color: '#F5E6D3', fontWeight: 700}}>Brief Description</label>
                <textarea rows="4" style={{width: '100%', padding: '1rem', borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.1)', outline: 'none', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '0.95rem', marginTop: '0.5rem'}} placeholder="Describe your legal issue briefly..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div style={{position: 'sticky', top: 110, height: 'fit-content'}}>
            <div style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', color: '#fff', padding: '2.5rem 2rem', borderRadius: '32px', boxShadow: '0 25px 60px rgba(0,0,0,0.5)'}}>
              <h3 style={{marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.5rem'}}>Booking Summary</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#F5E6D3', opacity: 0.8}}>Lawyer</span><span style={{fontWeight: 700}}>{lawyerName}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#F5E6D3', opacity: 0.8}}>Duration</span><span style={{fontWeight: 700}}>30 Mins</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#F5E6D3', opacity: 0.8}}>Type</span><span style={{fontWeight: 700, display: 'flex', alignItems: 'center'}}><Video size={16} style={{marginRight: 6, color: 'var(--gold)'}}/> Video Call</span></div>
              </div>
              
              <div style={{padding: '2rem 0 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '1.2rem', fontWeight: 700, color: '#F5E6D3'}}>Total Fee</span>
                <span style={{fontSize: '2.8rem', fontWeight: 800, color: 'var(--gold)', lineHeight: 1}}>₹{Number(fee).toLocaleString()}</span>
              </div>

              <button className="btn btn-primary btn-xl" style={{width: '100%', borderRadius: 16, background: 'var(--gold)', color: '#1A0A0D', boxShadow: '0 8px 25px rgba(201,148,58,0.3)', border: 'none'}} onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : <><CreditCard size={20}/> Pay & Confirm</>}
              </button>
              
              <div style={{marginTop: '1.5rem', fontSize: '.8rem', textAlign: 'center', opacity: 0.8, color: '#F5E6D3', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <ShieldCheck size={16} style={{color: 'var(--gold)'}}/> Secure payment powered by Razorpay
              </div>
            </div>

            <div style={{marginTop: '1.5rem', background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)'}}>
              <div style={{fontWeight: 800, fontSize: '.95rem', marginBottom: 8, color: '#fff'}}>Rescheduling Policy</div>
              <p style={{fontSize: '.85rem', color: '#F5E6D3', opacity: 0.8, lineHeight: 1.6}}>Free rescheduling up to 4 hours before the slot. Full refund for cancellations made 24 hours in advance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
