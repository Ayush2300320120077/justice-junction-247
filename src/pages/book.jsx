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
          <div style={{background: '#fff', padding: '3rem', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: '0 25px 60px rgba(0,0,0,0.2)'}}>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', marginBottom: '2rem'}}>Confirm Appointment</h1>
            
            <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="form-group">
                <label>Select Date</label>
                <div style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
                  <Calendar size={18} style={{position: 'absolute', left: 14, color: 'var(--txt-2)'}} />
                  <input type="date" style={{width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', border: '1.5px solid var(--border)', borderRadius: 12, outline: 'none', background: 'rgba(255,255,255,0.7)', color: '#1A0A0D', fontSize: '0.95rem'}} value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="form-group">
                <label>Available Slots</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8}}>
                  {['10:00 AM', '11:30 AM', '2:00 PM', '4:30 PM', '6:00 PM'].map(t => (
                    <button 
                      key={t} 
                      style={{padding: '.8rem', borderRadius: 12, border: `2.5px solid ${formData.time === t ? 'var(--bur)' : 'var(--border)'}`, background: formData.time === t ? 'rgba(123,29,46,0.05)' : '#fff', color: formData.time === t ? 'var(--bur)' : '#1A0A0D', fontWeight: 800, fontSize: '.85rem', cursor: 'pointer', transition: 'all 0.2s'}}
                      onClick={() => setFormData({...formData, time: t})}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Nature of Case</label>
                <select style={{width: '100%', padding: '0.8rem 1rem', border: '1.5px solid var(--border)', borderRadius: 12, outline: 'none', background: 'rgba(255,255,255,0.7)', color: '#1A0A0D', fontSize: '0.95rem'}} value={formData.caseType} onChange={e=>setFormData({...formData, caseType: e.target.value})}>
                  {['General Consultation', 'Property Dispute', 'Family/Divorce', 'Criminal Matter', 'Corporate/Startup', 'Labour/Employment'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Brief Description</label>
                <textarea rows="4" style={{width: '100%', padding: '1rem', borderRadius: 12, border: '1.5px solid var(--border)', outline: 'none', background: 'rgba(255,255,255,0.7)', color: '#1A0A0D', fontSize: '0.95rem'}} placeholder="Describe your legal issue briefly..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div style={{position: 'sticky', top: 110, height: 'fit-content'}}>
            <div style={{background: 'var(--bur)', color: '#fff', padding: '2rem', borderRadius: '32px', boxShadow: 'var(--sh-xl)'}}>
              <h3 style={{marginBottom: '1.5rem', fontWeight: 800}}>Booking Summary</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{opacity: 0.7}}>Lawyer</span><span style={{fontWeight: 700}}>{lawyerName}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{opacity: 0.7}}>Duration</span><span style={{fontWeight: 700}}>30 Mins</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{opacity: 0.7}}>Type</span><span style={{fontWeight: 700}}><Video size={14} style={{marginRight: 4}}/> Video Call</span></div>
              </div>
              
              <div style={{padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <span style={{fontSize: '1.1rem', fontWeight: 700}}>Total Fee</span>
                <span style={{fontSize: '2.4rem', fontWeight: 800, color: 'var(--gold)'}}>₹{Number(fee).toLocaleString()}</span>
              </div>

              <button className="btn btn-gold btn-xl" style={{width: '100%', borderRadius: 16}} onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : <><CreditCard size={18}/> Pay & Confirm</>}
              </button>
              
              <div style={{marginTop: '1.5rem', fontSize: '.7rem', textAlign: 'center', opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <ShieldCheck size={14}/> Secure payment powered by Razorpay
              </div>
            </div>

            <div style={{marginTop: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)'}}>
              <div style={{fontWeight: 800, fontSize: '.9rem', marginBottom: 8}}>Rescheduling Policy</div>
              <p style={{fontSize: '.75rem', color: 'var(--txt-3)', lineHeight: 1.5}}>Free rescheduling up to 4 hours before the slot. Full refund for cancellations made 24 hours in advance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
