import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { API } from '../api'
import { useToast } from '../context/ToastContext'
import { useAuth } from '../context/AuthContext'

const TIMES=['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM','08:00 PM']
const CASE_TYPES=['Criminal Defence','Family Law / Divorce','Property Dispute','Corporate / Business','Consumer Rights','Labour / Employment','Civil Dispute','Other']

export default function Book() {
  const [sp]=useSearchParams()
  const lawyerId=sp.get('lawyerId'),lawyerName=sp.get('lawyerName'),fee=parseInt(sp.get('fee'))||0
  const [caseType,setCaseType]=useState('')
  const [desc,setDesc]=useState('')
  const [date,setDate]=useState(new Date().toISOString().split('T')[0])
  const [time,setTime]=useState('')
  const [step,setStep]=useState(1)
  const [bookingId,setBookingId]=useState(null)
  const [loading,setLoading]=useState(false)
  const {showToast}=useToast()
  const {user}=useAuth()
  const navigate=useNavigate()

  const loadRazorpay=()=>new Promise(resolve=>{
    if(window.Razorpay)return resolve(true)
    const s=document.createElement('script')
    s.src='https://checkout.razorpay.com/v1/checkout.js'
    s.onload=()=>resolve(true);s.onerror=()=>resolve(false)
    document.body.appendChild(s)
  })

  const proceedToPayment=async()=>{
    if(!caseType){showToast('Please select a case type','error');return}
    if(!time){showToast('Please select a time slot','error');return}
    setLoading(true)
    try{
      const data=await API.createBooking({lawyerId,caseType,description:desc,scheduledDate:date,scheduledTime:time})
      setBookingId(data.booking._id);setStep(2)
    }catch(err){showToast(err.message,'error')}
    finally{setLoading(false)}
  }

  const handlePayment=async()=>{
    setLoading(true)
    try{
      const ok=await loadRazorpay()
      if(!ok)throw new Error('Could not load payment gateway.')
      const res=await fetch('/api/payments/create-order',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('jj_token')}`},body:JSON.stringify({lawyerId,amount:fee})})
      const order=await res.json()
      if(!res.ok)throw new Error(order.error)
      const rzp=new window.Razorpay({
        key:order.keyId,amount:order.amount,currency:order.currency,order_id:order.orderId,
        name:'Justice Junction 24/7',description:`Consultation with ${lawyerName}`,
        prefill:{name:user?.name,email:user?.email},theme:{color:'#7B1D2E'},
        handler:async(response)=>{
          try{
            const v=await fetch('/api/payments/verify',{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${localStorage.getItem('jj_token')}`},body:JSON.stringify({...response,bookingData:{bookingId}})})
            const vd=await v.json()
            if(!v.ok)throw new Error(vd.error)
            showToast('🎉 Payment successful! Booking confirmed.')
            setTimeout(()=>navigate('/dashboard'),2000)
          }catch(err){showToast(err.message,'error')}
        },
        modal:{ondismiss:()=>showToast('Payment cancelled. Booking saved — complete payment from dashboard.','info')}
      })
      rzp.open()
    }catch(err){showToast(err.message,'error')}
    finally{setLoading(false)}
  }

  if(!lawyerId)return<div style={{textAlign:'center',padding:'6rem'}}><p>No lawyer selected. <Link to="/search">Go back to search.</Link></p></div>

  return(
    <div style={{paddingTop:95,background:'var(--cream-2)',minHeight:'100vh'}}>
      <div style={{maxWidth:660,margin:'0 auto',padding:'2rem 5vw 4rem'}}>
        {/* Progress steps */}
        <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:'2rem'}}>
          {[['1','Case Details'],['2','Payment']].map(([n,l],i)=>(
            <div key={n} style={{display:'flex',alignItems:'center',gap:8,flex:i===0?1:undefined}}>
              <div style={{width:28,height:28,borderRadius:'50%',background:step>=+n?'var(--bur)':'var(--border)',color:step>=+n?'#fff':'var(--txt-3)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.78rem',fontWeight:800,flexShrink:0}}>{step>+n?'✓':n}</div>
              <span style={{fontSize:'.8rem',fontWeight:700,color:step>=+n?'var(--bur)':'var(--txt-3)'}}>{l}</span>
              {i===0&&<div style={{flex:1,height:2,background:step>=2?'var(--bur)':'var(--border)',marginLeft:8}}/>}
            </div>
          ))}
        </div>

        <Link to="/search" style={{fontSize:'.84rem',color:'var(--txt-3)',display:'inline-flex',alignItems:'center',gap:4,marginBottom:12}}>← Back to Search</Link>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',fontWeight:700,marginBottom:4}}>Book Your Consultation</h1>
        <p style={{color:'var(--txt-3)',fontSize:'.88rem',marginBottom:'1.5rem'}}>All prices are final — no hidden charges, ever.</p>

        {/* Lawyer card */}
        <div style={{background:'#fff',borderRadius:'var(--r-lg)',padding:'1.2rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',border:'1px solid var(--border)'}}>
          <div><div style={{fontWeight:800,fontSize:'.98rem'}}>{lawyerName}</div><div style={{fontSize:'.76rem',color:'var(--green)',fontWeight:700,marginTop:2}}>✅ Bar Council Verified</div></div>
          <div style={{textAlign:'right'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.5rem',fontWeight:700,color:'var(--bur)',lineHeight:1}}>₹{fee.toLocaleString()}</div><div style={{fontSize:'.7rem',color:'var(--txt-3)'}}>per session</div></div>
        </div>

        {step===1&&(
          <div className="card">
            <div className="form-group">
              <label>Type of Legal Issue</label>
              <select value={caseType} onChange={e=>setCaseType(e.target.value)}>
                <option value="">Select your issue...</option>
                {CASE_TYPES.map(c=><option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Brief Description (stays confidential)</label>
              <textarea rows="3" placeholder="Describe your situation briefly..." value={desc} onChange={e=>setDesc(e.target.value)} style={{width:'100%',padding:'.75rem 1rem',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:'.9rem',resize:'vertical',outline:'none',fontFamily:'Plus Jakarta Sans,sans-serif'}}/>
            </div>
            <div className="form-group">
              <label>Preferred Date</label>
              <input type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e=>setDate(e.target.value)}/>
            </div>
            <div className="form-group">
              <label>Preferred Time Slot</label>
              <div className="grid-times" style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginTop:6}}>
                {TIMES.map(t=>(
                  <div key={t} onClick={()=>setTime(t)} style={{padding:'.5rem',border:`1.5px solid ${time===t?'var(--bur)':'var(--border)'}`,borderRadius:'var(--r-sm)',textAlign:'center',cursor:'pointer',fontSize:'.78rem',fontWeight:700,background:time===t?'var(--bur)':'#fff',color:time===t?'#fff':'var(--txt)',transition:'all .2s'}}>{t}</div>
                ))}
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={proceedToPayment} disabled={loading} style={{width:'100%',justifyContent:'center',marginTop:8}}>
              {loading?'Saving...':'Continue to Payment →'}
            </button>
          </div>
        )}

        {step===2&&(
          <div className="card">
            <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',marginBottom:'1.2rem'}}>Payment Summary</h3>
            <div style={{background:'var(--cream-2)',borderRadius:'var(--r)',padding:'1.2rem',marginBottom:'1.2rem'}}>
              {[[`Consultation — ${caseType}`,`₹${fee.toLocaleString()}`],['Platform Fee (clients pay ₹0)','Free'],['GST','Included']].map(([l,v])=>(
                <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'.45rem 0',borderBottom:'1px solid var(--border)',fontSize:'.86rem'}}>
                  <span style={{color:'var(--txt-2)'}}>{l}</span><span style={{fontWeight:700}}>{v}</span>
                </div>
              ))}
              <div style={{display:'flex',justifyContent:'space-between',padding:'.6rem 0',fontSize:'1rem',fontWeight:800}}>
                <span>Total Payable</span><span style={{color:'var(--bur)',fontFamily:"'Playfair Display',serif",fontSize:'1.3rem'}}>₹{fee.toLocaleString()}</span>
              </div>
            </div>
            <div style={{background:'var(--green-l)',border:'1px solid rgba(22,163,74,.15)',borderRadius:'var(--r-sm)',padding:'.9rem',marginBottom:'1.5rem',fontSize:'.82rem',color:'var(--green)'}}>
              ✅ Session booked for <strong>{date}</strong> at <strong>{time}</strong>
            </div>
            <button className="btn btn-primary btn-lg" onClick={handlePayment} disabled={loading} style={{width:'100%',justifyContent:'center',background:'linear-gradient(135deg,#7B1D2E,#9E2D42)',boxShadow:'0 4px 20px rgba(123,29,46,.3)'}}>
              {loading?'Opening Payment...': `Pay ₹${fee.toLocaleString()} Securely →`}
            </button>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center',marginTop:'1rem',flexWrap:'wrap'}}>
              {['🔒 SSL Encrypted','💳 UPI / Card / NetBanking','🛡 Razorpay Secure'].map(t=>(
                <span key={t} style={{fontSize:'.7rem',color:'var(--txt-3)',fontWeight:600}}>{t}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
