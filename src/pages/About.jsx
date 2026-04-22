import { useState } from 'react'
import { Link } from 'react-router-dom'

const STEPS = [
  { num:'01', icon:'🔍', title:'Search by Location', desc:'Enter your city and type of legal issue. All verified, registered lawyers in your area appear instantly with full profiles and transparent pricing.' },
  { num:'02', icon:'📊', title:'Compare & Choose', desc:'View each lawyer\'s experience, specialization, client ratings, and most importantly — their fixed consultation fee. No hidden costs ever.' },
  { num:'03', icon:'📅', title:'Book a Consultation', desc:'Pick a date and time that works for you. Meet your lawyer via our secure encrypted video call platform — available from anywhere in India.' },
  { num:'04', icon:'📋', title:'Track Your Case', desc:'Your lawyer posts real-time case updates directly on our platform. Know every hearing date, filing, and outcome — without chasing phone calls.' },
]
const WHY = [
  { icon:'💰', title:'Price Transparency', desc:'Every lawyer\'s fee is published before you book. Fees are based on experience level — no negotiation, no surprises.' },
  { icon:'✅', title:'Verified Lawyers', desc:'Every lawyer on our platform has a verified Bar Council registration number and has passed our onboarding review.' },
  { icon:'📹', title:'Virtual Consultations', desc:'Consult from home via encrypted video calls. No travel needed — legal help comes to you 24/7.' },
  { icon:'🔒', title:'100% Confidential', desc:'All communications, case details, and documents shared on our platform are fully encrypted and private.' },
  { icon:'⏰', title:'24/7 Availability', desc:'Legal emergencies don\'t wait for business hours. Find and book lawyers any time — day or night.' },
  { icon:'📡', title:'Live Case Updates', desc:'Unlike traditional lawyers who go silent between hearings, our platform requires lawyers to post regular case updates.' },
]
const FAQS = [
  { q:'How are lawyers verified on Justice Junction?', a:'Every lawyer must provide their Bar Council registration number, identity documents, and professional credentials. Our team manually reviews each application before approving their profile.' },
  { q:'Is the consultation fee the total cost?', a:'Yes! The fee shown on the lawyer\'s profile is exactly what you pay for the consultation — no service charges, no booking fees, no hidden extras.' },
  { q:'What if I\'m not satisfied with the consultation?', a:'We have a dispute resolution process. If you feel a consultation did not meet expectations, contact our support team within 24 hours and we will review your case.' },
  { q:'How does the video consultation work?', a:'After booking is confirmed, you\'ll receive a secure meeting link in your dashboard. Click it at the scheduled time — no app download needed, works in the browser.' },
  { q:'Can I register as a lawyer on the platform?', a:'Yes! Lawyers can register by selecting "Lawyer" during signup and providing their Bar registration number, specialization, experience, and consultation fee. Profiles go live after verification (1–2 business days).' },
  { q:'What is the platform commission?', a:'Justice Junction charges lawyers a 10% commission on each completed booking. This is separate from the optional monthly subscription plans which unlock higher visibility.' },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{border:'1px solid var(--border)',borderRadius:'var(--r)',overflow:'hidden',marginBottom:8}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:'100%',padding:'1rem 1.5rem',background:open?'var(--cream-2)':'#fff',border:'none',cursor:'pointer',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'Plus Jakarta Sans,sans-serif',fontSize:'.92rem',fontWeight:700,color:'var(--txt)',textAlign:'left',transition:'background .2s'}}>
        <span>{q}</span>
        <span style={{color:'var(--bur)',fontSize:'1.2rem',transition:'transform .3s',transform:open?'rotate(45deg)':'rotate(0)',flexShrink:0,marginLeft:12}}>+</span>
      </button>
      {open && (
        <div style={{padding:'.8rem 1.5rem 1.1rem',background:'var(--cream)',borderTop:'1px solid var(--border)',animation:'slideUp .2s ease'}}>
          <p style={{fontSize:'.86rem',color:'var(--txt-3)',lineHeight:1.75}}>{a}</p>
        </div>
      )}
    </div>
  )
}

export default function About() {
  return (
    <div className="page-wrap" style={{paddingTop:100}}>
      <section style={{padding:'4rem 5vw 5rem',background:'linear-gradient(150deg,var(--cream) 0%,var(--cream-2) 60%,var(--cream-3) 100%)',textAlign:'center'}}>
        <div className="sec-label" style={{justifyContent:'center'}}>How It Works</div>
        <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2.2rem,5vw,3.5rem)',fontWeight:700,maxWidth:650,margin:'0 auto 1rem',lineHeight:1.15}}>
          Legal help made <em style={{fontStyle:'italic',color:'var(--bur)'}}>simple, fair,</em> and transparent.
        </h1>
        <p style={{color:'var(--txt-3)',maxWidth:520,margin:'0 auto 2.5rem',fontSize:'1rem'}}>Justice Junction was built because finding a lawyer in India was too opaque, too expensive, and too confusing. We changed that.</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/search" className="btn btn-primary btn-lg">Find a Lawyer</Link>
          <Link to="/register" className="btn btn-outline btn-lg">Register as Lawyer</Link>
        </div>
      </section>

      <section style={{padding:'6rem 5vw',background:'#fff'}}>
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>The Process</div>
          <h2 className="sec-title" style={{textAlign:'center'}}>Get legal help in <em>4 easy steps.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'2rem',maxWidth:1000,margin:'0 auto'}}>
          {STEPS.map(step => (
            <div key={step.num} className="reveal" style={{textAlign:'center',padding:'2rem 1.5rem',background:'var(--cream)',borderRadius:'var(--r-lg)',border:'1px solid var(--border)'}}>
              <div style={{width:52,height:52,background:'var(--bur)',borderRadius:14,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.5rem',margin:'0 auto 1rem',boxShadow:'0 4px 16px rgba(123,29,46,.25)'}}>{step.icon}</div>
              <div style={{fontSize:'.72rem',fontWeight:700,color:'var(--gold)',letterSpacing:'.1em',marginBottom:6}}>STEP {step.num}</div>
              <h3 style={{fontWeight:700,fontSize:'1.05rem',marginBottom:8}}>{step.title}</h3>
              <p style={{fontSize:'.85rem',color:'var(--txt-3)',lineHeight:1.7}}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'6rem 5vw',background:'var(--cream-2)'}}>
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Why Choose Us</div>
          <h2 className="sec-title" style={{textAlign:'center'}}>Built around <em>your rights.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
          {WHY.map(w=>(
            <div key={w.title} className="reveal card card-hover" style={{display:'flex',gap:'1rem',alignItems:'flex-start'}}>
              <div style={{width:46,height:46,borderRadius:12,background:'rgba(123,29,46,.07)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem',flexShrink:0}}>{w.icon}</div>
              <div><h4 style={{fontWeight:700,marginBottom:4}}>{w.title}</h4><p style={{fontSize:'.85rem',color:'var(--txt-3)',lineHeight:1.65}}>{w.desc}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section style={{padding:'6rem 5vw',background:'#fff'}}>
        <div style={{maxWidth:740,margin:'0 auto'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>FAQ</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Frequently asked <em>questions.</em></h2>
          </div>
          {FAQS.map((f,i)=><FAQItem key={i} q={f.q} a={f.a}/>)}
        </div>
      </section>

      <div style={{background:'var(--bur)',padding:'5rem 5vw',textAlign:'center'}}>
        <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2rem,4vw,3rem)',fontWeight:700,color:'#fff',marginBottom:'1rem'}}>
          Ready to get <em style={{fontStyle:'italic',color:'var(--gold-l)'}}>started?</em>
        </h2>
        <p style={{color:'rgba(255,255,255,.7)',maxWidth:400,margin:'0 auto 2rem'}}>Register for free. Find a verified lawyer. Know the price upfront.</p>
        <div style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
          <Link to="/search" className="btn btn-white btn-lg">Find a Lawyer Now</Link>
          <Link to="/register" className="btn btn-outline-white btn-lg">Register Free</Link>
        </div>
      </div>
    </div>
  )
}
