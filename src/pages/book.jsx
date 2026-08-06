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
  const [lawyerDetails, setLawyerDetails] = useState(null)
  const [bookedSlots, setBookedSlots] = useState([])

  const lawyerId = searchParams.get('lawyerId')
  const lawyerName = searchParams.get('lawyerName')
  const fee = searchParams.get('fee')

  useEffect(() => {
    if (!isLoggedIn) navigate('/login')
  }, [isLoggedIn])

  // Fetch lawyer details
  useEffect(() => {
    if (lawyerId) {
      API.getLawyer(lawyerId).then(data => setLawyerDetails(data.lawyer)).catch(console.error)
    }
  }, [lawyerId])

  // Fetch booked slots when date changes
  useEffect(() => {
    if (lawyerId && formData.date) {
      API.getBookedSlots(lawyerId, formData.date).then(data => setBookedSlots(data.bookedSlots)).catch(console.error)
    }
  }, [lawyerId, formData.date])

  // Generate available slots based on lawyer's actual availability
  const generateSlots = () => {
    if (!lawyerDetails || !lawyerDetails.availableTimeFrom || !lawyerDetails.availableTimeTo) {
      return ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'] // Fallback
    }

    const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(' ');
      let [hours, minutes] = time.split(':');
      if (hours === '12') hours = '00';
      if (modifier === 'PM') hours = parseInt(hours, 10) + 12;
      return { hours: parseInt(hours, 10), minutes: parseInt(minutes, 10) };
    }
    
    // Assume from/to are like '09:00 AM'
    try {
      const start = parseTime(lawyerDetails.availableTimeFrom);
      const end = parseTime(lawyerDetails.availableTimeTo);
      const slots = [];
      let currentHours = start.hours;
      let currentMins = start.minutes;
      
      while (currentHours < end.hours || (currentHours === end.hours && currentMins < end.minutes)) {
        const ampm = currentHours >= 12 ? 'PM' : 'AM';
        const displayHours = currentHours % 12 || 12;
        const displayMins = currentMins.toString().padStart(2, '0');
        const displayTime = `${displayHours.toString().padStart(2, '0')}:${displayMins} ${ampm}`;
        slots.push(displayTime);
        
        currentMins += 30; // 30 min slots
        if (currentMins >= 60) {
          currentMins = 0;
          currentHours += 1;
        }
      }
      return slots;
    } catch(e) {
      return ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'] // Fallback
    }
  }

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
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(253, 246, 238, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%)', zIndex: 0 }} />
      <Helmet><title>Book Consultation — {lawyerName}</title></Helmet>
      <div className="container" style={{maxWidth: 1000, position: 'relative', zIndex: 1}}>
        <div className="booking-grid" style={{display: 'grid', gap: '2.5rem'}}>
          {/* Form */}
          <div style={{background: '#fff', padding: '3rem', borderRadius: '32px', border: '1px solid rgba(123, 29, 46, 0.1)', boxShadow: '0 25px 60px rgba(123, 29, 46, 0.05)'}}>
            <h1 style={{fontFamily: "'Playfair Display', serif", fontSize: '2.2rem', marginBottom: '2rem', color: '#1A0A0D'}}>Confirm Appointment</h1>
            
            <div style={{marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="form-group">
                <label htmlFor="booking-date" style={{color: '#5A3A42', fontWeight: 700}}>Select Date</label>
                <div style={{position: 'relative', display: 'flex', alignItems: 'center', marginTop: '0.5rem'}}>
                  <Calendar size={18} style={{position: 'absolute', left: 14, color: '#5A3A42', opacity: 0.7}} />
                  <input id="booking-date" type="date" style={{width: '100%', padding: '0.8rem 1rem 0.8rem 2.6rem', border: '1.5px solid rgba(123, 29, 46, 0.1)', borderRadius: 12, outline: 'none', background: '#FDF6EE', color: '#1A0A0D', fontSize: '0.95rem'}} value={formData.date} onChange={e=>setFormData({...formData, date: e.target.value, time: ''})} min={new Date().toISOString().split('T')[0]} />
                </div>
              </div>
              <div className="form-group">
                <label style={{color: '#5A3A42', fontWeight: 700}}>Available Slots</label>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: '0.5rem'}}>
                  {generateSlots().map(t => {
                    const isBooked = bookedSlots.includes(t);
                    return (
                    <button 
                      key={t} 
                      disabled={isBooked || !formData.date}
                      aria-pressed={formData.time === t}
                      style={{padding: '.8rem', borderRadius: 12, border: `1.5px solid ${formData.time === t ? '#7B1D2E' : 'rgba(123, 29, 46, 0.1)'}`, background: isBooked ? '#e0e0e0' : formData.time === t ? 'rgba(123, 29, 46, 0.05)' : '#fff', color: isBooked ? '#999' : formData.time === t ? '#7B1D2E' : '#5A3A42', fontWeight: 800, fontSize: '.85rem', cursor: isBooked || !formData.date ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: formData.time === t ? '0 4px 15px rgba(123, 29, 46, 0.1)' : 'none', opacity: isBooked ? 0.6 : 1}}
                      onClick={() => setFormData({...formData, time: t})}
                    >
                      {t}
                    </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="booking-casetype" style={{color: '#5A3A42', fontWeight: 700}}>Nature of Case</label>
                <select id="booking-casetype" style={{width: '100%', padding: '0.8rem 1rem', border: '1.5px solid rgba(123, 29, 46, 0.1)', borderRadius: 12, outline: 'none', background: '#FDF6EE', color: '#1A0A0D', fontSize: '0.95rem', marginTop: '0.5rem'}} value={formData.caseType} onChange={e=>setFormData({...formData, caseType: e.target.value})}>
                  {['General Consultation', 'Property Dispute', 'Family/Divorce', 'Criminal Matter', 'Corporate/Startup', 'Labour/Employment'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="booking-description" style={{color: '#5A3A42', fontWeight: 700}}>Brief Description</label>
                <textarea id="booking-description" rows="4" style={{width: '100%', padding: '1rem', borderRadius: 12, border: '1.5px solid rgba(123, 29, 46, 0.1)', outline: 'none', background: '#FDF6EE', color: '#1A0A0D', fontSize: '0.95rem', marginTop: '0.5rem'}} placeholder="Describe your legal issue briefly..." value={formData.description} onChange={e=>setFormData({...formData, description: e.target.value})} />
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div style={{position: 'sticky', top: 110, height: 'fit-content'}}>
            <div style={{background: '#FDF6EE', border: '1px solid rgba(123, 29, 46, 0.05)', color: '#1A0A0D', padding: '2.5rem 2rem', borderRadius: '32px', boxShadow: '0 25px 60px rgba(123, 29, 46, 0.05)'}}>
              <h3 style={{marginBottom: '1.5rem', fontWeight: 800, fontSize: '1.5rem'}}>Booking Summary</h3>
              <div style={{display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(123, 29, 46, 0.1)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#5A3A42'}}>Lawyer</span><span style={{fontWeight: 700}}>{lawyerName}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#5A3A42'}}>Duration</span><span style={{fontWeight: 700}}>{lawyerDetails?.consultationDuration || 45} Mins</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{color: '#5A3A42'}}>Type</span><span style={{fontWeight: 700, display: 'flex', alignItems: 'center'}}><Video size={16} style={{marginRight: 6, color: '#7B1D2E'}}/> Video Call</span></div>
              </div>
              
              <div style={{padding: '2rem 0 1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <span style={{fontSize: '1.2rem', fontWeight: 700, color: '#5A3A42'}}>Total Fee</span>
                <span style={{fontSize: '2.8rem', fontWeight: 800, color: '#7B1D2E', lineHeight: 1}}>₹{Number(fee).toLocaleString()}</span>
              </div>

              <button className="btn btn-primary btn-xl" style={{width: '100%', borderRadius: 16, background: '#7B1D2E', color: '#fff', boxShadow: '0 8px 25px rgba(123, 29, 46, 0.25)', border: 'none'}} onClick={handlePay} disabled={loading}>
                {loading ? 'Processing...' : <><CreditCard size={20}/> Pay & Confirm</>}
              </button>
              
              <div style={{marginTop: '1.5rem', fontSize: '.8rem', textAlign: 'center', opacity: 0.8, color: '#5A3A42', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6}}>
                <ShieldCheck size={16} style={{color: '#7B1D2E'}}/> Secure payment powered by Razorpay
              </div>
            </div>

            <div style={{marginTop: '1.5rem', background: '#fff', padding: '1.5rem', borderRadius: '24px', border: '1px solid rgba(123, 29, 46, 0.1)'}}>
              <div style={{fontWeight: 800, fontSize: '.95rem', marginBottom: 8, color: '#1A0A0D'}}>Rescheduling Policy</div>
              <p style={{fontSize: '.85rem', color: '#5A3A42', opacity: 0.9, lineHeight: 1.6}}>Free rescheduling up to 4 hours before the slot. Full refund for cancellations made 24 hours in advance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
