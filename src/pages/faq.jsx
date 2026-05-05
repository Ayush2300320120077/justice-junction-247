import { useState } from 'react'
import Head from 'next/head'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'Is Justice Junction 24/7 free to use?', a: 'Yes, completely free for clients. You only pay the lawyer\'s consultation fee which is shown upfront before you book. Justice Junction charges zero platform fee to clients.' },
      { q: 'Are the lawyers on this platform verified?', a: 'Yes. Every lawyer on our platform goes through a Bar Council registration verification before their profile goes live. You can also see their Bar Council number on their profile.' },
      { q: 'How do I book a consultation?', a: 'Search for a lawyer by practice area or city, view their profile and fee, then click Book. You\'ll be prompted to pay the consultation fee via Razorpay and confirm a time slot. You\'ll receive a confirmation on your registered email.' },
    ]
  },
  {
    category: 'Language & Accessibility',
    items: [
      { q: 'Can I get legal help in Hindi?', a: 'Yes. You can filter lawyers by language spoken. Many of our advocates are fluent in Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, and other regional languages.' },
    ]
  },
  {
    category: 'Scope of Services',
    items: [
      { q: 'What types of legal issues can I get help with?', a: 'We cover Criminal Defence, Family Law, Property Law, Corporate Law, Consumer Rights, Labour Law, Civil Disputes, Divorce, Taxation, Intellectual Property, Cyber Law, Immigration, and Constitutional Law — across all courts.' },
      { q: 'Is my information kept confidential?', a: 'Absolutely. All communications between you and your lawyer are private. We do not share your personal data with third parties. Payments are secured by Razorpay with 256-bit encryption.' },
      { q: 'How is this different from hiring a lawyer directly?', a: 'Direct hiring often involves opaque pricing, no reviews, and no easy way to verify credentials. Justice Junction gives you upfront fixed fees, verified Bar Council credentials, ratings from real clients, and the ability to compare multiple lawyers before deciding.' },
      { q: 'Are the consultation fees negotiable?', a: 'No, all consultation fees on Justice Junction are fixed and shown upfront to ensure complete transparency. This eliminates bargaining and hidden costs.' },
    ]
  },
  {
    category: 'Bookings & More',
    items: [
      { q: 'Can I cancel or reschedule a booking?', a: 'Yes. Cancellations made 24 hours before the appointment are eligible for a full refund. Reschedules can be done up to 12 hours before the appointment from your dashboard.' },
      { q: 'What happens if a lawyer doesn\'t join the call?', a: 'We offer a 100% money-back guarantee or an immediate reschedule if a lawyer misses a scheduled consultation.' },
      { q: 'How do lawyers join the platform?', a: 'Lawyers can register at /join-as-lawyer, complete their professional profile, and choose a subscription plan. After Bar Council verification, their profile goes live within 48 hours.' },
      { q: 'Is there a mobile app?', a: 'Our web platform is fully mobile-optimised and works perfectly on all devices. A dedicated Android and iOS app is coming soon.' },
    ]
  }
]

export default function FAQPage() {
  return (
    <div style={{ paddingTop:95, background:'#F8F9FA', minHeight:'100vh' }}>
      <Head>
        <title>FAQ — Justice Junction 24/7</title>
        <meta name="description" content="Frequently asked questions about booking lawyers, payments, cancellations and platform features." />
        <meta property="og:title" content="FAQ — Justice Junction 24/7" />
        <meta property="og:description" content="Everything you need to know about finding lawyers and booking consultations on Justice Junction 24/7." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/faq" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Head>

      <section style={s.hero}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Support Center</div>
          <h1 style={s.h1}>How can we <em>help you?</em></h1>
          <p style={s.heroSub}>Answers to the most common questions about using Justice Junction 24/7.</p>
        </div>
      </section>

      <div className="container" style={{ padding:'4rem 5vw', maxWidth:900 }}>
        {FAQS.map((cat, catIndex) => (
          <div key={cat.category} style={{marginBottom:'3rem'}}>
            <h2 style={s.catTitle}>{cat.category}</h2>
            <div style={s.faqList}>
              {cat.items.map((item, itemIndex) => <FAQItem key={item.q} q={item.q} a={item.a} isOpen={catIndex === 0 && itemIndex === 0} />)}
            </div>
          </div>
        ))}

        <div style={s.contactCard}>
          <div style={{display:'flex', alignItems:'center', gap:15}}>
            <div style={s.iconBox}><MessageSquare size={24}/></div>
            <div>
              <h3 style={{margin:0, fontSize:'1.2rem', color:'#fff'}}>Still have questions?</h3>
              <p style={{margin:0, fontSize:'.9rem', color:'rgba(255,255,255,.7)'}}>Our support team is available 24/7 via WhatsApp.</p>
            </div>
          </div>
          <button className="btn btn-white btn-lg" onClick={() => window.open('https://wa.me/919188371233', '_blank')}>Chat on WhatsApp</button>
        </div>
      </div>
    </div>
  )
}

function FAQItem({ q, a, isOpen = false }) {
  const [open, setOpen] = useState(isOpen)
  return (
    <div style={{...s.faqItem, borderColor: open ? 'var(--bur)' : 'var(--border)'}}>
      <button style={s.faqHead} onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <ChevronDown size={20} style={{transform: open ? 'rotate(180deg)' : 'none', transition:'transform .3s', color: open ? 'var(--bur)' : 'var(--txt-3)', flexShrink:0}}/>
      </button>
      {open && <div style={s.faqBody}><p style={{margin:0, color:'var(--txt-2)', lineHeight:1.75, fontSize:'.95rem'}}>{a}</p></div>}
    </div>
  )
}

const s = {
  hero: { padding:'5rem 0', background:'var(--cream-2)', borderBottom:'1px solid var(--border)' },
  h1: { fontFamily:"'Playfair Display',serif", fontSize:'3rem', fontWeight:800, marginBottom:'1rem' },
  heroSub: { fontSize:'1.1rem', color:'var(--txt-3)', maxWidth:600, margin:'0 auto' },
  catTitle: { fontSize:'1.4rem', fontWeight:800, marginBottom:'1.5rem', fontFamily:"'Playfair Display',serif", color:'var(--bur)' },
  faqList: { display:'flex', flexDirection:'column', gap:12 },
  faqItem: { background:'#fff', border:'1.5px solid var(--border)', borderRadius:'16px', overflow:'hidden', transition:'all .2s' },
  faqHead: { width:'100%', padding:'1.4rem 1.5rem', background:'none', border:'none', textAlign:'left', display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', fontSize:'1rem', fontWeight:700, color:'var(--txt)', fontFamily:'inherit', gap:12 },
  faqBody: { padding:'0 1.5rem 1.5rem' },
  contactCard: { marginTop:'4rem', background:'var(--bur)', color:'#fff', padding:'2.5rem', borderRadius:'24px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'2rem' },
  iconBox: { width:52, height:52, borderRadius:'14px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' },
}
