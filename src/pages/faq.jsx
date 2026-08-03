import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react'
import { ChevronDown, HelpCircle, MessageSquare, Search } from 'lucide-react'

const FAQS = [
  {
    category: 'For Clients',
    items: [
      { q: 'Is Justice Junction 24/7 free for clients to use?', a: 'Yes. Browsing lawyer profiles, reading reviews, and using the Knowledge Hub are completely free. You pay only the lawyer\'s consultation fee, which is shown upfront before you book. We charge zero platform or booking fee to clients.' },
      { q: 'Are the lawyers on this platform verified?', a: 'Every advocate listed on Justice Junction undergoes verification against Bar Council of India enrollment records before their profile goes live. Look for the "Verified" badge on lawyer profiles. We never list unverified practitioners.' },
      { q: 'How do I book a consultation?', a: 'Search for a lawyer by specialization and city → view their full profile, fees, and availability → select a time slot → pay securely via Razorpay → receive instant email confirmation. The whole process takes under 5 minutes.' },
      { q: 'What if I am not satisfied with my consultation?', a: 'Contact our support team within 24 hours of the consultation via WhatsApp or email. We will review the case and, where valid, facilitate a refund or a complimentary follow-up session. Your satisfaction is our priority.' },
      { q: 'Is my personal information and case details kept confidential?', a: 'Absolutely. All video consultations are end-to-end encrypted. Your case details are visible only to you and the lawyer you engage. We never share personal data with third parties. Read our Privacy Policy for full details.' },
      { q: 'Can I get help in Hindi or my regional language?', a: 'Yes. Use the Language filter on the search page to find lawyers who speak Hindi, Tamil, Bengali, Marathi, Gujarati, Telugu, Kannada, Punjabi, or Urdu. Language availability is shown on every lawyer\'s profile.' },
      { q: 'How is this different from hiring a lawyer directly?', a: 'With Justice Junction, you see upfront pricing before you commit, verified credentials you can trust, real reviews from verified clients, and a case tracking dashboard — none of which exist when you find a lawyer through word of mouth or a directory listing.' },
    ]
  },
  {
    category: 'Payments & Refunds',
    items: [
      { q: 'What payment methods are accepted?', a: 'All payments are processed through Razorpay with 256-bit SSL encryption and PCI DSS compliance. Accepted methods include UPI (GPay, PhonePe, Paytm), all major debit/credit cards, and net banking.' },
      { q: 'When is the payment charged?', a: 'Payment is charged at the time of booking confirmation. The lawyer receives their payout within 48 hours after the consultation is completed.' },
      { q: 'Is there a cancellation or refund policy?', a: 'You can cancel a booking up to 2 hours before the scheduled consultation for a full refund. Cancellations within 2 hours are not eligible for a refund unless the lawyer is unavailable. Emergency situations are reviewed case-by-case.' },
    ]
  },
  {
    category: 'For Lawyers',
    items: [
      { q: 'What does it cost to join as an advocate?', a: 'Registration and a basic profile listing are completely free. We offer paid plans (Basic ₹999/mo, Pro ₹2,499/mo, Elite ₹4,999/mo) for featured placement, priority search ranking, and advanced analytics. You only need to upgrade when you\'re ready to grow.' },
      { q: 'How does Justice Junction make money?', a: 'We charge a 10% platform commission on each consultation completed through the platform, plus optional subscription plans for lawyers who want premium visibility. Clients are never charged a platform fee.' },
      { q: 'How long does lawyer verification take?', a: 'Verification typically takes 24–48 hours after you submit your Bar Council enrollment number and supporting details. Our team verifies against official Bar Council of India records.' },
      { q: 'Can I set my own consultation fee?', a: 'Yes. You set your own consultation fee. Justice Junction does not cap or dictate your pricing. The fee you set is exactly what clients see and pay.' },
    ]
  },
  {
    category: 'Technical & Legal',
    items: [
      { q: 'Is Justice Junction a law firm?', a: 'No. Justice Junction 24/7 is a technology platform that connects clients with independent advocates. We are not a law firm and do not provide legal advice. All legal services are rendered by independent advocates registered with the Bar Council of India.' },
      { q: 'What happens if I need emergency legal help at 3 AM?', a: 'Our platform is live 24/7. Search for lawyers with "Online" availability at any hour and book instantly. For urgent criminal matters (bail, FIR), use the "Bail & FIR" specialization filter — many advocates in this category offer emergency consultations.' },
    ]
  }
]

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredFAQs = searchQuery.trim()
    ? FAQS.map(cat => ({
        ...cat,
        items: cat.items.filter(item =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(cat => cat.items.length > 0)
    : FAQS

  const totalVisible = filteredFAQs.reduce((sum, cat) => sum + cat.items.length, 0)

  return (
    <div style={{ paddingTop:95, background:'#F8F9FA', minHeight:'100vh' }}>
      <Helmet>
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
      </Helmet>

      <section style={s.hero}>
        <div className="container" style={{textAlign:'center'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Support Center</div>
          <h1 style={s.h1}>How can we <em>help you?</em></h1>
          <p style={s.heroSub}>Answers to the most common questions about using Justice Junction 24/7.</p>
          
          {/* Search box */}
          <div style={{ maxWidth: 500, margin: '2rem auto 0', background: '#fff', padding: '0.75rem 1.25rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 10, border: '1.5px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
            <Search size={18} color="#7B1D2E"/>
            <input 
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '.95rem', color: 'var(--txt)', background: 'transparent' }} 
              placeholder="Search questions..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} style={{background:'none',border:'none',cursor:'pointer',color:'var(--txt-3)',fontSize:'1rem'}}>✕</button>
            )}
          </div>
        </div>
      </section>

      <div className="container" style={{ padding:'4rem 5vw', maxWidth:900 }}>
        {filteredFAQs.length === 0 && (
          <div style={{textAlign:'center', padding:'3rem', color:'var(--txt-3)'}}>
            <HelpCircle size={48} color="#D4A882" style={{marginBottom:'1rem'}}/>
            <h3 style={{color:'var(--txt)', marginBottom:8}}>No results found for "{searchQuery}"</h3>
            <p>Try a different keyword or browse the categories below.</p>
            <button className="btn btn-ghost" style={{marginTop:'1rem'}} onClick={() => setSearchQuery('')}>Clear Search</button>
          </div>
        )}

        {filteredFAQs.map((cat, catIndex) => (
          <div key={cat.category} style={{marginBottom:'3rem'}}>
            <h2 style={s.catTitle}>{cat.category}</h2>
            <div style={s.faqList}>
              {cat.items.map((item, itemIndex) => <FAQItem key={item.q} q={item.q} a={item.a} isOpen={catIndex === 0 && itemIndex === 0 && !searchQuery} />)}
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
          <button className="btn btn-white btn-lg" onClick={() => window.open(`https://wa.me/${import.meta.env.VITE_WA_NUMBER || '919188371233'}`, '_blank')}>Chat on WhatsApp</button>
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
