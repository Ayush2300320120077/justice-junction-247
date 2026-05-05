import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { CheckCircle, Users, BarChart, Globe, Shield, Award, Send, Phone, Mail, MapPin, Briefcase, Hash } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law','Cyber Law','Divorce','Taxation','Intellectual Property','Civil Disputes','RTI']
const BENEFITS = [
  { title:'Get Clients 24/7', desc:"Your profile stays live around the clock, attracting clients even when you're in court.", icon:<Globe size={24}/> },
  { title:'Build Your Reputation', desc:'Get a verified badge, collect reviews, and rank higher for your specialization.', icon:<Award size={24}/> },
  { title:'Smart Dashboard', desc:'Manage appointments, post case updates, and track your earnings in one place.', icon:<BarChart size={24}/> },
  { title:'No Upfront Cost', desc:'Register for free. We only succeed when you get quality clients.', icon:<CheckCircle size={24}/> },
]

export default function JoinAsLawyer() {
  const { showToast } = useToast()
  const [form, setForm] = useState({ name:'', phone:'', email:'', barCouncilNumber:'', specialization:'', city:'', yearsOfExperience:'' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.barCouncilNumber.trim()) e.barCouncilNumber = 'Bar Council number is required'
    if (!form.specialization) e.specialization = 'Please select a specialization'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.yearsOfExperience || parseInt(form.yearsOfExperience) < 0) e.yearsOfExperience = 'Enter valid years'
    return e
  }

  const onChange = e => { setForm({...form, [e.target.name]:e.target.value}); if (errors[e.target.name]) setErrors({...errors, [e.target.name]:''}) }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/lawyer-application', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Submission failed', 'error'); return }
      setSubmitted(true)
      showToast('Application submitted successfully!', 'success')
    } catch { showToast('Something went wrong. Please try again.', 'error') }
    finally { setSubmitting(false) }
  }

  return (
    <div style={{ paddingTop:95, background:'#fff', minHeight:'100vh' }}>
      <Head>
        <title>Join as Advocate | Justice Junction 24/7</title>
        <meta name="description" content="Register as a verified advocate. Get quality clients, manage your cases, and grow your legal practice online." />
        <meta property="og:title" content="Join as an Advocate — Justice Junction 24/7" />
        <meta property="og:description" content="Get clients 24/7. Build your online reputation. No upfront cost." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/join-as-lawyer" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join as an Advocate — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      <section style={s.hero} className="section-bg-office parallax page-reveal">
        <div className="container" style={s.heroGrid}>
          <div>
            <div style={s.badge}>For Legal Professionals</div>
            <h1 style={s.h1} className="h1-responsive">
              <span className="boutique-heading">Grow Your</span> <span className="gradient-text">Practice</span> with <em>Justice Junction.</em>
            </h1>
            <p style={s.sub}>Join India's fastest-growing legal-tech platform. Get clients 24/7, build your online reputation, and manage your entire practice from one smart dashboard.</p>
            <div style={{display:'flex', gap:12, flexWrap:'wrap', marginBottom:'1.5rem'}}>
              <a href="#apply-form" className="btn btn-primary btn-xl">Apply Now — It's Free</a>
              <Link href="/lawyer-plans" className="btn btn-outline btn-xl">View Plans</Link>
            </div>
            <div style={{fontSize:'.85rem', color:'var(--txt-3)', display:'flex', alignItems:'center', gap:8, fontWeight:600}}><Users size={16}/> 50+ advocates already with us.</div>
          </div>
          <div style={s.statsPanel} className="hide-mobile">
            {[['50+','Verified Advocates'],['24/7','Client Bookings'],['48h','Verification Time']].map(([v,l]) => (
              <div key={l} style={s.statBox}><div style={s.statVal}>{v}</div><div style={s.statLbl}>{l}</div></div>
            ))}
          </div>
        </div>
      </section>

      <section style={{padding:'5rem 5vw', background:'var(--cream-2)'}}>
        <div className="container">
          <h2 className="sec-title" style={{textAlign:'center', marginBottom:'3rem'}}>Why join <em>Justice Junction?</em></h2>
          <div style={s.benefitsGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} style={s.benefitCard} className="card-hover magnetic-hover">
                <div style={s.iconBox}>{b.icon}</div>
                <h3 style={{fontSize:'1.1rem', fontWeight:800, marginBottom:8}}>{b.title}</h3>
                <p style={{fontSize:'.9rem', color:'var(--txt-2)', lineHeight:1.6}}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verification Steps */}
      <section style={{padding:'5rem 5vw',background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>What Happens Next</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Our Simple <em>3-Step Verification</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'1.5rem',maxWidth:900,margin:'0 auto'}}>
            {[
              {step:'01',time:'5 min',title:'Submit Your Application',desc:'Fill out the form below with your Bar Council details and practice information. Takes less than 5 minutes.'},
              {step:'02',time:'24–48h',title:'Verification',desc:'Our team verifies your Bar Council enrollment number with official records. We may call for document confirmation.'},
              {step:'03',time:'Go Live',title:'Start Getting Clients',desc:'Your profile goes live with a Verified badge. Clients can now find and book you 24/7 from anywhere in India.'},
            ].map(s=>(
              <div key={s.step} style={{textAlign:'center',padding:'2.5rem 2rem',background:'var(--cream-2)',borderRadius:20,border:'1px solid var(--border)',position:'relative'}}>
                <div style={{position:'absolute',top:12,right:16,fontSize:'.7rem',fontWeight:800,color:'var(--bur)',background:'rgba(139,26,42,0.08)',padding:'.2rem .7rem',borderRadius:50}}>{s.time}</div>
                <div style={{fontSize:'2.5rem',fontWeight:800,color:'var(--bur)',fontFamily:"'Sora',sans-serif",marginBottom:12}}>{s.step}</div>
                <h3 style={{fontSize:'1.1rem',fontWeight:800,marginBottom:8}}>{s.title}</h3>
                <p style={{fontSize:'.88rem',color:'var(--txt-2)',lineHeight:1.7}}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lawyer Testimonials */}
      <section style={{padding:'5rem 5vw',background:'var(--cream-2)'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>From Our Advocates</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Hear from lawyers <em>already on board.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1050,margin:'0 auto'}}>
            {[
              {text:"I was skeptical at first, but Justice Junction brought me 14 quality clients in my second month. The dashboard makes scheduling and case updates effortless.",name:'Adv. Priya Nair',role:'Family Law Specialist, Chennai'},
              {text:"As a young advocate in a new city, building a client base was my biggest challenge. Within 6 weeks of joining, I had a steady flow of consultations through the platform.",name:'Adv. Rohit Sharma',role:'Criminal Defence, Pune'},
              {text:"The Razorpay integration means I get paid instantly after every consultation — no awkward follow-ups with clients. The Elite plan's ROI is excellent.",name:'Adv. Meenakshi Iyer',role:'Corporate Law, Bangalore'},
            ].map(t=>(
              <div key={t.name} style={{background:'#fff',padding:'2rem',borderRadius:20,border:'1px solid var(--border)',borderLeft:'4px solid var(--bur)'}}>
                <div style={{color:'var(--bur)',marginBottom:12,letterSpacing:2}}>★★★★★</div>
                <p style={{fontSize:'.95rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'1.5rem',color:'var(--txt)'}}>&ldquo;{t.text}&rdquo;</p>
                <div style={{fontWeight:800,fontSize:'.9rem'}}>{t.name}</div>
                <div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply-form" style={{padding:'6rem 5vw', background:'#fff'}}>
        <div className="container" style={{maxWidth:700}}>
          <div style={{textAlign:'center', marginBottom:'3rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Join the Platform</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Submit Your <em>Application</em></h2>
            <p style={{color:'var(--txt-3)'}}>Our team will review and contact you within 24–48 hours.</p>
          </div>

          {submitted ? (
            <div style={s.successCard}>
              <CheckCircle size={52} color="var(--green)"/>
              <h3 style={{fontSize:'1.5rem', fontFamily:"'Playfair Display',serif", marginTop:'1.5rem', marginBottom:8}}>Application Received!</h3>
              <p style={{color:'var(--txt-3)', marginBottom:'2rem'}}>We'll contact you within 24–48 hours at <strong>{form.email}</strong>.</p>
              <Link href="/" className="btn btn-primary btn-lg">Back to Home</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={s.form} noValidate>
              <div className="form-row">
                <div className="form-group"><label>Full Name <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><Users size={16} className="input-icon"/><input name="name" value={form.name} onChange={onChange} placeholder="Adv. Rahul Sharma" style={errors.name ? {border:'1px solid #DC2626'} : {}}/></div>{errors.name && <span style={s.err}>{errors.name}</span>}</div>
                <div className="form-group"><label>Phone Number <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><Phone size={16} className="input-icon"/><input name="phone" value={form.phone} onChange={onChange} placeholder="10-digit mobile" maxLength={10} style={errors.phone ? {border:'1px solid #DC2626'} : {}}/></div>{errors.phone && <span style={s.err}>{errors.phone}</span>}</div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Email Address <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><Mail size={16} className="input-icon"/><input name="email" type="email" value={form.email} onChange={onChange} placeholder="your@email.com" style={errors.email ? {border:'1px solid #DC2626'} : {}}/></div>{errors.email && <span style={s.err}>{errors.email}</span>}</div>
                <div className="form-group"><label>Bar Council Enrolment No. <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><Hash size={16} className="input-icon"/><input name="barCouncilNumber" value={form.barCouncilNumber} onChange={onChange} placeholder="e.g. D/1234/2010" style={errors.barCouncilNumber ? {border:'1px solid #DC2626'} : {}}/></div>{errors.barCouncilNumber && <span style={s.err}>{errors.barCouncilNumber}</span>}</div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Specialization <span style={{color:'#DC2626'}}>*</span></label><select name="specialization" value={form.specialization} onChange={onChange} style={errors.specialization ? {border:'1px solid #DC2626'} : {}}><option value="">Select...</option>{SPECS.map(sp => <option key={sp}>{sp}</option>)}</select>{errors.specialization && <span style={s.err}>{errors.specialization}</span>}</div>
                <div className="form-group"><label>City <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><MapPin size={16} className="input-icon"/><input name="city" value={form.city} onChange={onChange} placeholder="e.g. New Delhi" style={errors.city ? {border:'1px solid #DC2626'} : {}}/></div>{errors.city && <span style={s.err}>{errors.city}</span>}</div>
              </div>
              <div className="form-group"><label>Years of Experience <span style={{color:'#DC2626'}}>*</span></label><div className="input-wrap"><Briefcase size={16} className="input-icon"/><input name="yearsOfExperience" type="number" min="0" max="60" value={form.yearsOfExperience} onChange={onChange} placeholder="e.g. 8" style={errors.yearsOfExperience ? {border:'1px solid #DC2626'} : {}}/></div>{errors.yearsOfExperience && <span style={s.err}>{errors.yearsOfExperience}</span>}</div>
              <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%', marginTop:'1.5rem', gap:8}} disabled={submitting}>
                <Send size={18}/>{submitting ? 'Submitting...' : 'Submit Application'}
              </button>
              <p style={{textAlign:'center', fontSize:'.75rem', color:'var(--txt-3)', marginTop:'1rem'}}>
                By submitting you agree to our <Link href="/terms" style={{color:'var(--bur)'}}>Terms</Link> and <Link href="/privacy-policy" style={{color:'var(--bur)'}}>Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding:'8rem 0', color:'#fff' },
  heroGrid: { display:'grid', gridTemplateColumns:'1.3fr 0.7fr', gap:'4rem', alignItems:'center' },
  badge: { display:'inline-block', background:'var(--bur)', color:'#fff', padding:'.4rem 1.2rem', borderRadius:50, fontSize:'.75rem', fontWeight:800, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'1.5rem' },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(2.2rem,5vw,3.5rem)', fontWeight:800, lineHeight:1.1, marginBottom:'1.5rem' },
  sub: { fontSize:'1.1rem', color:'var(--txt-2)', marginBottom:'2rem', lineHeight:1.7 },
  statsPanel: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' },
  statBox: { background:'#fff', padding:'1.5rem', borderRadius:'20px', border:'1px solid var(--border)', textAlign:'center' },
  statVal: { fontSize:'1.8rem', fontWeight:800, color:'var(--bur)', fontFamily:"'Sora',sans-serif" },
  statLbl: { fontSize:'.72rem', color:'var(--txt-3)', fontWeight:700, textTransform:'uppercase', marginTop:4 },
  benefitsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'1.5rem' },
  benefitCard: { background:'#fff', padding:'2rem', borderRadius:'20px', border:'1px solid var(--border)' },
  iconBox: { width:52, height:52, borderRadius:'14px', background:'var(--bur)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.2rem' },
  form: { background:'var(--cream)', padding:'2.5rem', borderRadius:'24px', border:'1px solid var(--border)' },
  err: { color:'var(--red)', fontSize:'.75rem', marginTop:4, display:'block' },
  successCard: { background:'var(--green-l)', padding:'4rem 3rem', borderRadius:'24px', border:'1px solid #86efac', textAlign:'center' },
}
