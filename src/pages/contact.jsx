import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Mail, Phone, MapPin, MessageSquare, Send, CheckCircle } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name:'', email:'', subject:'', message:'' })
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setSubmitting(true)
    // Simulate submission
    setTimeout(() => { setSubmitting(false); setSubmitted(true) }, 1000)
  }

  return (
    <div className="page-wrap" style={{background:'var(--cream)'}}>
      <Head>
        <title>Contact Us — Justice Junction 24/7</title>
        <meta name="description" content="Get in touch with the Justice Junction 24/7 team. We're available 24/7 to help you find the right legal support." />
        <meta property="og:title" content="Contact Us — Justice Junction 24/7" />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      <section style={s.hero}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Get in Touch</div>
          <h1 style={s.h1}>We're here to <em>help.</em></h1>
          <p style={s.heroSub}>Have a question about our platform, a lawyer listing, or need support? Reach out and we'll respond within 24 hours.</p>
        </div>
      </section>

      <div className="container" style={{padding:'4rem 5vw', maxWidth:1000}}>
        <div style={s.grid}>
          {/* Info Cards */}
          <div style={{display:'flex', flexDirection:'column', gap:'1.5rem'}}>
            {[
              { icon:<MessageSquare size={22}/>, title:'WhatsApp Support', desc:'Chat with our team directly. Available 24/7.', action:'Chat Now', href:`https://wa.me/919188371233?text=Hi, I need help with Justice Junction 24/7` },
              { icon:<Mail size={22}/>, title:'Email Us', desc:'121ayushkumar121@gmail.com', action:'Send Email', href:'mailto:121ayushkumar121@gmail.com' },
              { icon:<Phone size={22}/>, title:'Helpline', desc:'+91 91883 71233', action:'Call Now', href:'tel:+919188371233' },
            ].map(item => (
              <div key={item.title} style={s.infoCard}>
                <div style={s.infoIcon}>{item.icon}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800, fontSize:'1rem', marginBottom:4}}>{item.title}</div>
                  <div style={{fontSize:'.85rem', color:'var(--txt-3)'}}>{item.desc}</div>
                </div>
                <a href={item.href} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">{item.action}</a>
              </div>
            ))}

            <div style={s.faqCard}>
              <div style={{fontWeight:800, fontSize:'1rem', marginBottom:8}}>Frequently Asked Questions</div>
              <p style={{fontSize:'.85rem', color:'var(--txt-3)', marginBottom:'1rem'}}>Many answers are already in our FAQ section.</p>
              <Link href="/faq" className="btn btn-primary btn-sm" style={{width:'100%', justifyContent:'center'}}>Browse FAQs</Link>
            </div>
          </div>

          {/* Contact Form */}
          <div style={s.formCard}>
            <h2 style={{fontFamily:"'Playfair Display',serif", fontSize:'1.6rem', marginBottom:'2rem'}}>Send us a message</h2>
            {submitted ? (
              <div style={{textAlign:'center', padding:'3rem 1rem'}}>
                <CheckCircle size={48} color="var(--green)" style={{marginBottom:'1rem'}}/>
                <h3 style={{marginBottom:8}}>Message received!</h3>
                <p style={{color:'var(--txt-3)'}}>We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-row">
                  <div className="form-group"><label>Your Name *</label><input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" required/></div>
                  <div className="form-group"><label>Email Address *</label><input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="your@email.com" required/></div>
                </div>
                <div className="form-group"><label>Subject</label><input value={form.subject} onChange={e=>setForm({...form,subject:e.target.value})} placeholder="e.g. Lawyer verification issue"/></div>
                <div className="form-group"><label>Message *</label><textarea rows={5} value={form.message} onChange={e=>setForm({...form,message:e.target.value})} placeholder="Describe your issue or question..." required/></div>
                <button type="submit" className="btn btn-primary btn-lg" style={{width:'100%', gap:8}} disabled={submitting}>
                  <Send size={18}/>{submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
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
}
