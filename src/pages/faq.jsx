import { useState } from 'react'
import Head from 'next/head'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'Is Justice Junction 24/7 free to use?', a: 'Yes! Browsing lawyer profiles, reading legal guides, and using our AI assistant are completely free. You only pay the consultation fee set directly by the lawyer when you book a session. There are no hidden platform charges for clients.' },
      { q: 'Are the lawyers on this platform verified?', a: 'Absolutely. Every lawyer on Justice Junction undergoes a manual verification process where we check their Bar Council of India registration number and professional credentials. Look for the blue "Verified" badge on their profile for confirmed advocates.' },
      { q: 'How do I book a consultation?', a: 'It\'s simple: Search for a lawyer by your city or legal issue → View their profile and fees → Click "Book Appointment Now" → Pay securely via Razorpay → Receive a confirmation and meeting link. The entire process takes under 5 minutes.' },
    ]
  },
  {
    category: 'Language & Accessibility',
    items: [
      { q: 'Can I get legal help in Hindi?', a: 'Yes! Many lawyers on our platform speak Hindi and other regional languages including Tamil, Bengali, Marathi, Gujarati, and more. You can filter lawyers by language spoken on our search page. Our AI assistant also responds in Hindi.' },
    ]
  },
  {
    category: 'Scope of Services',
    items: [
      { q: 'What types of legal issues can I get help with?', a: 'Justice Junction covers a wide range of practice areas including Criminal Defence, Family Law, Property Disputes, Consumer Rights, Labour Law, Corporate Law, Cyber Crime, Divorce, Cheque Bounce, RTI, and more. Use our search to find the right specialist.' },
      { q: 'Is my information kept confidential?', a: 'Yes. All communications on our platform are encrypted. We do not share your personal details with third parties without your consent. Your case information is only visible to you and the lawyer you engage. Please read our Privacy Policy for full details.' },
      { q: 'How is this different from hiring a lawyer directly?', a: 'Justice Junction makes finding the right lawyer faster, safer, and more transparent. You can compare fees, read verified reviews, check qualifications, and book consultations online — all before committing. Unlike hiring directly, you have full price visibility upfront with no surprise costs. We also provide a money-back guarantee if a lawyer doesn\'t show up.' },
    ]
  }
]

export default function FAQPage() {
  return (
    <div style={{ paddingTop:95, background:'#F8F9FA', minHeight:'100vh' }}>
      <Head>
        <title>Frequently Asked Questions — Justice Junction 24/7</title>
        <meta name="description" content="Find answers to common questions about finding lawyers, booking consultations, payments, and legal help in Hindi on Justice Junction 24/7." />
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
        {FAQS.map(cat => (
          <div key={cat.category} style={{marginBottom:'3rem'}}>
            <h2 style={s.catTitle}>{cat.category}</h2>
            <div style={s.faqList}>
              {cat.items.map(item => <FAQItem key={item.q} q={item.q} a={item.a} />)}
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

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
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
