import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'

const PLANS = [
  {
    id: 'basic', name: 'Basic', price: 999, icon: '🌱',
    tagline: 'Perfect to get started',
    features: ['Up to 20 bookings/month','Basic profile listing','Case update tools','Video consultation links','Email support','Performance analytics'],
    notIncluded: ['Featured listing','Priority placement','Verified badge','Dedicated support'],
    color: 'var(--txt-3)'
  },
  {
    id: 'pro', name: 'Pro', price: 2499, icon: '⚖️',
    tagline: 'Most popular for growing practices',
    features: ['Up to 60 bookings/month','Featured profile badge','Priority search placement','✅ Verified badge','Case update tools','Video consultation links','Priority email support','Advanced analytics dashboard','Client review management'],
    notIncluded: ['Dedicated account manager'],
    popular: true, color: 'var(--bur)'
  },
  {
    id: 'elite', name: 'Elite', price: 4999, icon: '🏆',
    tagline: 'For established senior advocates',
    features: ['Unlimited bookings','Featured + Elite badge','Top search placement','✅ Verified + Elite badge','Case update tools','Video consultation links','Dedicated account manager','Full analytics suite','Client review management','Homepage feature slot','Direct marketing support'],
    notIncluded: [],
    color: 'var(--gold)'
  }
]

const ROI = [
  ['Average bookings/month on Pro','15–30'],
  ['Average consultation fee','₹2,500'],
  ['Estimated monthly revenue','₹37,500–₹75,000'],
  ['Platform subscription cost','₹2,499'],
  ['Your net monthly profit','₹35,000–₹72,500'],
]

export default function LawyerPlans() {
  const [loading, setLoading] = useState(null)
  const [annual, setAnnual] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const handleSubscribe = async (planId, price) => {
    if (!isLoggedIn) { navigate('/register?role=lawyer'); return }
    if (user?.role !== 'lawyer') { showToast('Only lawyers can subscribe to plans', 'error'); return }
    setLoading(planId)
    try {
      const res = await fetch('/api/payments/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jj_token')}` },
        body: JSON.stringify({ plan: planId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Load Razorpay
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'Justice Junction 24/7',
          description: `${PLANS.find(p=>p.id===planId)?.name} Plan — Monthly Subscription`,
          image: '/logo.png',
          prefill: { name: user.name, email: user.email },
          theme: { color: '#7B1D2E' },
          handler: async (response) => {
            try {
              const verify = await fetch('/api/payments/verify-subscription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('jj_token')}` },
                body: JSON.stringify({ ...response, plan: planId })
              })
              const vData = await verify.json()
              if (!verify.ok) throw new Error(vData.error)
              showToast(`🎉 ${PLANS.find(p=>p.id===planId)?.name} plan activated!`)
              navigate('/dashboard')
            } catch (err) { showToast(err.message, 'error') }
          }
        })
        rzp.open()
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(null)
    }
  }

  const displayPrice = (price) => annual ? Math.round(price * 10) : price

  return (
    <div style={{paddingTop:95}}>
      {/* Header */}
      <section style={{padding:'4rem 5vw',background:'linear-gradient(135deg,var(--bur),#9E2D42)',textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(ellipse at 50% 0%,rgba(201,148,58,.15),transparent 70%)',pointerEvents:'none'}}/>
        <div style={{position:'relative'}}>
          <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',borderRadius:50,padding:'.3rem 1rem',fontSize:'.7rem',fontWeight:800,color:'rgba(255,255,255,.85)',textTransform:'uppercase',letterSpacing:'.12em',marginBottom:'1rem'}}>For Advocates</div>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,color:'#fff',marginBottom:'1rem',lineHeight:1.2}}>Grow your practice with<br/><em style={{color:'var(--gold-l)'}}>Justice Junction.</em></h1>
          <p style={{color:'rgba(255,255,255,.75)',maxWidth:520,margin:'0 auto 2rem',fontSize:'.98rem',lineHeight:1.8}}>Join 2,400+ verified advocates. Set your own fee. Get quality clients. All in one dashboard.</p>
          <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:12,marginBottom:'1rem'}}>
            <span style={{fontSize:'.85rem',color:'rgba(255,255,255,.7)',fontWeight:600}}>Monthly</span>
            <div style={{position:'relative',width:44,height:24,background:annual?'var(--gold)':'rgba(255,255,255,.2)',borderRadius:50,cursor:'pointer',transition:'background .2s'}} onClick={()=>setAnnual(a=>!a)}>
              <div style={{position:'absolute',width:18,height:18,background:'#fff',borderRadius:'50%',top:3,left:annual?23:3,transition:'left .2s'}}/>
            </div>
            <span style={{fontSize:'.85rem',color:'rgba(255,255,255,.7)',fontWeight:600}}>Annual <span style={{background:'var(--gold)',color:'#fff',padding:'.1rem .5rem',borderRadius:50,fontSize:'.7rem',fontWeight:800,marginLeft:4}}>2 months free</span></span>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{padding:'5rem 5vw',background:'var(--cream-2)'}}>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1050,margin:'0 auto'}}>
          {PLANS.map(plan => (
            <div key={plan.id} style={{background:'#fff',borderRadius:'var(--r-xl)',padding:'2rem',border:plan.popular?'2px solid var(--bur)':'1px solid var(--border)',position:'relative',transition:'all .25s',boxShadow:plan.popular?'var(--sh-lg)':undefined}}>
              {plan.popular && <div style={{position:'absolute',top:-13,left:'50%',transform:'translateX(-50%)',background:'var(--bur)',color:'#fff',fontSize:'.68rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.08em',padding:'.25rem 1.2rem',borderRadius:50,whiteSpace:'nowrap'}}>⭐ Most Popular</div>}
              <div style={{fontSize:'2rem',marginBottom:8}}>{plan.icon}</div>
              <div style={{fontWeight:800,fontSize:'1.1rem',marginBottom:4}}>{plan.name}</div>
              <div style={{fontSize:'.78rem',color:'var(--txt-3)',marginBottom:'1.2rem'}}>{plan.tagline}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2.2rem',fontWeight:700,color:'var(--bur)',lineHeight:1}}>
                ₹{displayPrice(plan.price).toLocaleString()}
                <span style={{fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'.8rem',color:'var(--txt-3)',fontWeight:400}}>/month</span>
              </div>
              {annual && <div style={{fontSize:'.74rem',color:'var(--green)',fontWeight:700,marginTop:2}}>Save ₹{(plan.price*2).toLocaleString()} annually</div>}
              <div style={{margin:'1.5rem 0',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)',padding:'1.2rem 0',display:'flex',flexDirection:'column',gap:8}}>
                {plan.features.map(f=>(
                  <div key={f} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:'.84rem'}}>
                    <span style={{color:'var(--green)',fontWeight:800,flexShrink:0}}>✓</span><span>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.map(f=>(
                  <div key={f} style={{display:'flex',gap:8,alignItems:'flex-start',fontSize:'.84rem',opacity:.4}}>
                    <span style={{flexShrink:0}}>✗</span><span>{f}</span>
                  </div>
                ))}
              </div>
              <button className={`btn ${plan.popular?'btn-primary':'btn-outline'} btn-lg`} onClick={()=>handleSubscribe(plan.id,displayPrice(plan.price))} disabled={loading===plan.id} style={{width:'100%',justifyContent:'center'}}>
                {loading===plan.id ? 'Processing...' : `Get ${plan.name} Plan`}
              </button>
            </div>
          ))}
        </div>
        <p style={{textAlign:'center',marginTop:'1.5rem',fontSize:'.8rem',color:'var(--txt-3)'}}>🔒 Secure payment via Razorpay · Cancel anytime · 30-day money-back guarantee</p>
      </section>

      {/* ROI Calculator */}
      <section style={{padding:'5rem 5vw',background:'#fff'}}>
        <div style={{maxWidth:700,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Return on Investment</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>The numbers <em>speak clearly.</em></h2>
          </div>
          <div style={{background:'var(--cream)',border:'1px solid var(--border)',borderRadius:'var(--r-xl)',overflow:'hidden'}}>
            {ROI.map(([label,value],i)=>(
              <div key={label} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 1.5rem',background:i%2===0?'#fff':'var(--cream)',borderBottom:i<ROI.length-1?'1px solid var(--border)':undefined}}>
                <span style={{fontSize:'.9rem',color:'var(--txt-2)',fontWeight:600}}>{label}</span>
                <span style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:700,color:label.includes('profit')?'var(--green)':label.includes('cost')?'var(--red)':'var(--bur)'}}>{value}</span>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'2rem'}}>
            <p style={{fontSize:'.82rem',color:'var(--txt-3)',marginBottom:'1.2rem'}}>*Based on average data from our Pro plan lawyers. Individual results vary.</p>
            <button className="btn btn-primary btn-lg" onClick={()=>handleSubscribe('pro',2499)}>Start with Pro — ₹2,499/mo</button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{padding:'5rem 5vw',background:'var(--cream-2)'}}>
        <div style={{maxWidth:720,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'2.5rem'}}>
            <h2 className="sec-title" style={{textAlign:'center'}}>Common <em>questions.</em></h2>
          </div>
          {[
            ['Do clients pay anything extra?','No. Clients pay only your consultation fee. Platform commission (10%) is deducted from your payout automatically — transparent to both sides.'],
            ['Can I cancel my subscription?','Yes. Cancel anytime from your dashboard. Your plan remains active until the end of the billing cycle.'],
            ['When do I receive my payout?','Payouts are processed every Monday for the previous week\'s completed bookings, directly to your registered bank account.'],
            ['What is the 10% platform commission?','For every booking made through Justice Junction, we deduct 10% as a platform fee. This is separate from your monthly subscription — the subscription unlocks higher visibility and booking limits.'],
            ['Is my data secure?','Yes. All data is encrypted at rest and in transit. We are DPDP-compliant and do not sell advocate data.'],
          ].map(([q,a])=><FAQ key={q} q={q} a={a}/>)}
        </div>
      </section>

      {/* CTA */}
      <section style={{padding:'5rem 5vw',background:'var(--bur)',textAlign:'center'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',fontWeight:700,color:'#fff',marginBottom:'1rem'}}>Start growing your practice <em style={{color:'var(--gold-l)'}}>today.</em></h2>
        <p style={{color:'rgba(255,255,255,.7)',marginBottom:'2rem'}}>Register free. Upgrade when you're ready. No lock-in.</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/register?role=lawyer" className="btn btn-gold btn-lg">Register Free as Lawyer</Link>
          <Link to="/search" className="btn btn-outline-white btn-lg">Browse the Platform</Link>
        </div>
      </section>
    </div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{border:'1px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden',marginBottom:8}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',padding:'1rem 1.5rem',background:open?'var(--cream-2)':'#fff',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'.92rem',fontWeight:700,color:'var(--txt)',textAlign:'left',transition:'background .2s'}}>
        <span>{q}</span><span style={{color:'var(--bur)',fontSize:'1.2rem',transition:'transform .3s',transform:open?'rotate(45deg)':'none',flexShrink:0,marginLeft:12}}>+</span>
      </button>
      {open&&<div style={{padding:'.8rem 1.5rem 1.1rem',background:'var(--cream)',borderTop:'1px solid var(--border)',animation:'slideUp .2s ease'}}><p style={{fontSize:'.86rem',color:'var(--txt-3)',lineHeight:1.75}}>{a}</p></div>}
    </div>
  )
}
