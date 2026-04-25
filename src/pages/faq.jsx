import { useState } from 'react'
import Head from 'next/head'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

const FAQS = [
  {
    category: 'General',
    items: [
      { q: 'What is Justice Junction 24/7?', a: 'Justice Junction is a technology platform that connects citizens with verified legal professionals. We provide transparent pricing, secure consultations, and real-time case tracking.' },
      { q: 'Is it free to use?', a: 'Browsing lawyers and legal guides is completely free. You only pay the consultation fee set by the lawyer when you book an appointment. We do not charge any hidden service fees to clients.' },
      { q: 'How do I know if a lawyer is verified?', a: 'Every lawyer on our platform goes through a manual verification process where we check their Bar Council registration number and professional credentials. Look for the "Verified" badge on their profile.' }
    ]
  },
  {
    category: 'Consultations',
    items: [
      { q: 'How does the video consultation work?', a: 'Once you book a slot, you will receive a secure meeting link in your dashboard and via email. At the scheduled time, simply click the link to join the call from your browser or mobile.' },
      { q: 'What if the lawyer doesn\'t show up?', a: 'In the rare event that a lawyer is unavailable at the scheduled time, you can request a full refund or reschedule the appointment through your dashboard.' },
      { q: 'Can I chat with the lawyer before booking?', a: 'We provide a WhatsApp button on every profile for quick queries. However, for detailed legal advice, we recommend booking a formal consultation.' }
    ]
  },
  {
    category: 'Payments',
    items: [
      { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI (Google Pay, PhonePe, etc.), and Net Banking via our secure payment partner, Razorpay.' },
      { q: 'Is my payment secure?', a: 'Yes. Justice Junction uses industry-standard encryption. Your payment is held securely and only released to the lawyer after the consultation is confirmed as completed.' }
    ]
  }
]

export default function FAQPage() {
  return (
    <div style={{ paddingTop: 95, background: '#F8F9FA', minHeight: '100vh' }}>
      <Head>
        <title>Frequently Asked Questions — Justice Junction 24/7</title>
        <meta name="description" content="Find answers to common questions about booking lawyers, payments, and consultations on Justice Junction 24/7." />
      </Head>

      <section style={s.hero}>
        <div className="container" style={{textAlign: 'center'}}>
          <div className="sec-label" style={{justifyContent: 'center'}}>Support Center</div>
          <h1 style={s.h1}>How can we <em>help you?</em></h1>
          <p style={s.heroSub}>Search our most common questions or reach out to our legal support team.</p>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 5vw', maxWidth: 900 }}>
        {FAQS.map(cat => (
          <div key={cat.category} style={{marginBottom: '3rem'}}>
            <h2 style={s.catTitle}>{cat.category}</h2>
            <div style={s.faqList}>
              {cat.items.map(item => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        <div style={s.contactCard}>
          <div style={{display:'flex', alignItems:'center', gap:15}}>
            <div style={s.iconBox}><MessageSquare size={24}/></div>
            <div>
              <h3 style={{margin:0, fontSize: '1.2rem'}}>Still have questions?</h3>
              <p style={{margin:0, fontSize: '.9rem', color: 'var(--txt-3)'}}>Our support team is available 24/7 via WhatsApp.</p>
            </div>
          </div>
          <button className="btn btn-primary" onClick={() => window.open('https://wa.me/91XXXXXXXXXX', '_blank')}>Chat with Support</button>
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
        <ChevronDown size={20} style={{transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .3s', color: open ? 'var(--bur)' : 'var(--txt-3)'}}/>
      </button>
      {open && (
        <div style={s.faqBody}>
          <p style={{margin:0, color: 'var(--txt-2)', lineHeight: 1.7, fontSize: '.95rem'}}>{a}</p>
        </div>
      )}
    </div>
  )
}

const s = {
  hero: { padding: '5rem 0', background: 'var(--cream-2)', borderBottom: '1px solid var(--border)' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' },
  heroSub: { fontSize: '1.1rem', color: 'var(--txt-3)', maxWidth: 600, margin: '0 auto' },
  catTitle: { fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', fontFamily: "'Playfair Display', serif" },
  faqList: { display: 'flex', flexDirection: 'column', gap: 12 },
  faqItem: { background: '#fff', border: '1.5px solid var(--border)', borderRadius: '16px', overflow: 'hidden', transition: 'all .2s' },
  faqHead: { width: '100%', padding: '1.5rem', background: 'none', border: 'none', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', fontSize: '1.05rem', fontWeight: 700, color: 'var(--txt)', fontFamily: 'inherit' },
  faqBody: { padding: '0 1.5rem 1.5rem', animation: 'slideUp .3s ease' },
  contactCard: { marginTop: '5rem', background: 'var(--bur)', color: '#fff', padding: '2.5rem', borderRadius: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' },
  iconBox: { width: 56, height: 56, borderRadius: '16px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }
}
