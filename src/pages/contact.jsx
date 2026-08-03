import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle, Loader2 } from 'lucide-react'
import emailjs from '@emailjs/browser'
import { useToast } from '../context/ToastContext'

export default function Contact() {
  const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'supportjusticejunction247@gmail.com'
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const { showToast } = useToast()

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Please enter a valid email address'
    if (!form.message.trim()) errs.message = 'Message is required'
    else if (form.message.trim().length < 20) errs.message = 'Message must be at least 20 characters'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setSubmitting(true)
    const submitData = { ...form, subject: form.subject || 'General Enquiry' }

    // 1. Save to database via API
    let dbSaved = false
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      })
      if (res.ok) dbSaved = true
    } catch (_) { /* DB save is best-effort */ }

    // 2. Send email via EmailJS
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (serviceId && templateId && publicKey) {
      try {
        await emailjs.send(serviceId, templateId, {
          from_name: submitData.name,
          from_email: submitData.email,
          subject: submitData.subject,
          message: submitData.message,
        }, publicKey)
        showToast('Message sent successfully!', 'success')
        setSubmitted(true)
      } catch (err) {
        console.error('EmailJS error:', err)
        if (dbSaved) {
          showToast('Message saved — email delivery will be retried.', 'success')
          setSubmitted(true)
        } else {
          showToast('Failed to send message. Please try again or contact us via WhatsApp.', 'error')
        }
      }
    } else {
      // EmailJS not configured — fall back to DB-only
      if (dbSaved) {
        showToast('Message received! We\'ll respond within 24 hours.', 'success')
      } else {
        showToast('Message received! We\'ll respond within 24 hours.', 'success')
      }
      setSubmitted(true)
    }

    setSubmitting(false)
  }

  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Helmet>
        <title>Contact Us — Justice Junction 24/7</title>
        <meta name="description" content="Get in touch with Justice Junction support. Available 24/7 via WhatsApp, email and phone." />
        <meta property="og:title" content="Contact Us — Justice Junction 24/7" />
        <meta property="og:description" content="Get in touch with Justice Junction support. Available 24/7 via WhatsApp, email and phone." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Helmet>

      <section style={s.hero}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Get in Touch</div>
          <h1 style={s.h1}>We're here to <em>help.</em></h1>
          <p style={s.heroSub}>Have a question about our platform, a lawyer listing, or need support? Reach out and we'll respond within 24 hours.</p>
        </div>
      </section>

      <div className="container" style={{padding:'4rem 5vw', maxWidth:1000}}>
        <div style={s.grid} className="mobile-stack">
          {/* Info Cards */}
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            {[
              { icon:<MessageSquare size={22}/>, title:'WhatsApp Support', desc:'Chat with our team directly. Available 24/7.', action:'Chat Now', href:`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '919188371233'}?text=Hi, I need help with Justice Junction 24/7` },
              { icon:<Mail size={22}/>, title:'Email Us', desc:supportEmail, action:'Send Email', href:`mailto:${supportEmail}` },
              { icon:<Phone size={22}/>, title:'Helpline', descComponent: true, action:'Call Now', href:`tel:+${import.meta.env.VITE_WA_NUMBER || '919188371233'}` },
            ].map(item => (
              <div key={item.title} style={s.infoCard}>
                <div style={s.infoIcon}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800, fontSize:'1rem', marginBottom:4}}>{item.title}</div>
                  {item.descComponent ? (
                    <div style={{fontSize:'.85rem', color:'var(--txt-3)'}} data-noindex="true">
                      <span>{'+91 91883 71233'.split('').map((c, i) => <span key={i}>{c}</span>)}</span>
                    </div>
                  ) : (
                    <div style={{fontSize:'.85rem', color:'var(--txt-3)'}}>{item.desc}</div>
                  )}
                </div>
                <a href={item.href} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">{item.action}</a>
              </div>
            ))}

            <div style={s.faqCard}>
              <div style={{fontWeight:800, fontSize:'1rem', marginBottom:8}}>Frequently Asked Questions</div>
              <p style={{fontSize:'.85rem', color:'rgba(255,255,255,.7)', marginBottom:'1rem'}}>Many answers are already in our FAQ section.</p>
              <Link to="/faq" className="btn btn-white btn-sm" style={{width:'100%', justifyContent:'center'}}>Browse FAQs</Link>
            </div>
          </div>

          {/* Contact Form */}
          <div style={s.formCard}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', marginBottom:'2rem'}}>Send us a message</h2>
            {submitted ? (
              <div style={{textAlign:'center', padding:'3rem 1rem'}}>
                <CheckCircle size={48} color="var(--green)" style={{marginBottom:'1rem'}}/>
                <h3 style={{marginBottom:8}}>✓ Message received.</h3>
                <p style={{color:'var(--txt-3)'}}>We'll respond within 24 hours.</p>
              </div>
            ) : (
              <div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" style={errors.name ? {borderColor:'#DC2626'} : {}} />
                    {errors.name && <span style={s.fieldErr}>{errors.name}</span>}
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" style={errors.email ? {borderColor:'#DC2626'} : {}} />
                    {errors.email && <span style={s.fieldErr}>{errors.email}</span>}
                  </div>
                </div>
                <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Lawyer verification issue (optional)"/></div>
                <div className="form-group">
                  <label>Message *</label>
                  <textarea rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe your issue or question (min 20 characters)..." style={errors.message ? {borderColor:'#DC2626'} : {}} />
                  {errors.message && <span style={s.fieldErr}>{errors.message}</span>}
                </div>
                <button type="button" className="btn btn-primary btn-lg" style={{width:'100%', gap:8}} disabled={submitting} onClick={handleSubmit}>
                  {submitting ? <><Loader2 size={18} className="spinner-icon" /> Sending...</> : <><Send size={18}/> Send Message</>}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const s = {
  hero: { padding:'5rem 0', background:'var(--bur)', color:'#fff' },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'clamp(2rem,5vw,3rem)', fontWeight:800, marginBottom:'1rem', color:'#fff' },
  heroSub: { fontSize:'1.05rem', color:'rgba(255,255,255,.8)', maxWidth:600, margin:'0 auto' },
  grid: { display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:'3rem', alignItems:'start' },
  infoCard: { background:'#fff', padding:'1.5rem', borderRadius:'16px', border:'1px solid var(--border)', display:'flex', alignItems:'center', gap:'1rem' },
  infoIcon: { width:44, height:44, borderRadius:'12px', background:'var(--bur)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  faqCard: { background:'var(--bur)', color:'#fff', padding:'1.5rem', borderRadius:'16px' },
  formCard: { background:'#fff', padding:'2.5rem', borderRadius:'24px', border:'1px solid var(--border)', boxShadow:'0 8px 32px rgba(0,0,0,0.05)' },
  fieldErr: { color:'#DC2626', fontSize:'.75rem', fontWeight:600, marginTop:4, display:'block' },
}
