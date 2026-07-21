import { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { BookOpen, Scale, Shield, Landmark, Search, ChevronRight, FileText, AlertCircle, SearchX } from 'lucide-react'
import { useToast } from '../context/ToastContext'

const ARTICLES = [
  { id: 'rti', title: 'Right to Information (RTI)', category: 'Citizens Rights', desc: 'Learn how to file an RTI and your rights to access government information.', icon: <BookOpen size={24}/> },
  { id: 'fir', title: 'How to file an FIR?', category: 'Criminal Law', desc: 'Step-by-step guide on filing a First Information Report at a police station.', icon: <FileText size={24}/> },
  { id: 'consumer', title: 'Consumer Protection Rights', category: 'Civil Rights', desc: 'Your rights against unfair trade practices and how to approach consumer court.', icon: <Shield size={24}/> },
  { id: 'divorce', title: 'Divorce Laws in India', category: 'Family Law', desc: 'Understanding mutual consent vs contested divorce and alimony rights.', icon: <Scale size={24}/> },
  { id: 'arrest', title: 'Rights during Arrest', category: 'Citizens Rights', desc: 'What are your legal rights if you are being arrested by the police?', icon: <AlertCircle size={24}/> },
  { id: 'tenant', title: 'Tenant & Landlord Rights', category: 'Property Law', desc: 'Understanding the Rent Control Act and your rights as a tenant.', icon: <Landmark size={24}/> },
  { id: 'cyber', title: 'Cyber Crime Protection', category: 'Digital Law', desc: 'How to report online fraud, harassment, and data theft in India.', icon: <Shield size={24}/> },
  { id: 'wills', title: 'Basics of Will & Inheritance', category: 'Family Law', desc: 'How to draft a legal will and the laws of succession in India.', icon: <FileText size={24}/> },
]

const CATEGORIES = ['All', 'Citizens Rights', 'Criminal Law', 'Family Law', 'Property Law', 'Civil Rights', 'Digital Law']

export default function KnowledgeHub() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subEmail, setSubEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('jj_newsletter_email')
    if (saved) setSubscribed(true)
  }, [])

  const filtered = ARTICLES.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    return matchSearch && matchCat
  })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail }),
      })
      if (!res.ok) throw new Error('API error')
    } catch (_) { /* DB save is best-effort */ }
    setSubscribed(true)
    if (typeof window !== 'undefined') localStorage.setItem('jj_newsletter_email', subEmail)
    showToast("Thanks! We'll keep you updated.", 'success')
    setSubEmail('')
  }

  return (
    <div style={{ paddingTop: 95, background: '#FDF8F4', minHeight: '100vh' }}>
      <Head>
        <title>Know Your Legal Rights | Justice Junction 24/7</title>
        <meta name="description" content="Empower yourself with legal knowledge. Read articles on RTI, FIR, Consumer Rights, and more." />
      </Head>

      {/* Header */}
      <section style={{ padding: '6rem 0', position: 'relative', overflow: 'hidden', background: '#7B1D2E', color: '#fff' }}>
        <div className="container" style={{textAlign: 'center', position:'relative', zIndex: 2}}>
          <div className="sec-label" style={{justifyContent: 'center', color: '#F5C4B3'}}>Legal Literacy</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem' }}>Empower Yourself with <em>Knowledge.</em></h1>
          <p style={{ fontSize: '1.1rem', color: '#F9EEE4', maxWidth: 600, margin: '0 auto 2.5rem' }}>Simple, accurate legal guides for every Indian citizen. Know your rights before you take the next step.</p>
          
          <div style={{ maxWidth: 600, margin: '0 auto', background: '#fff', padding: '1rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' }}>
            <Search size={20} color="#7B1D2E"/>
            <input 
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1A0A0D' }} 
              placeholder="Search for a topic (e.g. RTI, FIR, Property...)" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter Pills in Hero */}
          <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',justifyContent: 'center', marginTop:'2.5rem'}}>
            {CATEGORIES.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding:'.55rem 1.2rem',
                  borderRadius:50,
                  border: category === cat ? '1px solid rgba(255,255,255,0.5)' : '1px solid rgba(255,255,255,0.2)',
                  background: category === cat ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
                  color: '#F9EEE4',
                  fontSize:'.82rem',
                  fontWeight:700,
                  cursor:'pointer',
                  transition:'all .2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container" style={{ padding: '4rem 5vw' }}>

        <div style={s.grid}>
          {filtered.map(a => (
            <div key={a.id} style={s.articleCard} className="card-hover">
              <div style={s.cardHeader}>
                <div style={s.iconBox}>{a.icon}</div>
                <span style={s.category}>{a.category}</span>
              </div>
              <h3 style={s.cardTitle}>{a.title}</h3>
              <p style={s.cardDesc}>{a.desc}</p>
              <Link href={`/knowledge/${a.id}`} style={s.readMore}>
                Read Full Guide <ChevronRight size={16}/>
              </Link>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{textAlign: 'center', padding: '4rem'}}>
            <SearchX size={48} color="#D4A882" style={{marginBottom: '1rem'}}/>
            <h3 style={{color:'#1A0A0D'}}>No guides found for "{search}"</h3>
            <p style={{color:'#4A2030'}}>Try searching for broader terms or browse the categories above.</p>
          </div>
        )}
      </div>

      {/* Newsletter / CTA */}
      <section style={{ padding: '5rem 5vw', background: '#FDF6EE', borderTop: '1px solid #E8C9A8' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto' }}>
          <div style={{flex: 1}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', marginBottom: 8, color:'#1A0A0D', fontWeight: 800}}>Stay Informed.</h2>
            <p style={{fontSize: '1rem', color: '#5A3A42'}}>Get monthly legal updates and simplified law explainers delivered to your inbox.</p>
          </div>
          {subscribed ? (
            <div style={{display:'flex',alignItems:'center',gap:10,color:'#16a34a',fontWeight:700,fontSize:'.95rem'}}>
              ✓ You're subscribed! Legal updates coming your way.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, flex: 1, maxWidth: 450 }}>
              <input style={{ flex: 1, padding: '1rem 1.2rem', borderRadius: '12px', border: '1px solid #E8C9A8', outline: 'none', fontSize:'1rem' }} type="email" placeholder="Enter your email address" value={subEmail} onChange={e => setSubEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: '12px', background: '#7B1D2E', color: '#fff', border: 'none', fontWeight: 600, cursor: 'pointer' }}>Subscribe</button>
            </form>
          )}
          {!subscribed && <p style={{fontSize:'.75rem',color:'#9CA3AF',marginTop:8}}>No spam. Unsubscribe anytime.</p>}
        </div>
      </section>
    </div>
  )
}

const s = {
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },
  articleCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #E8C9A8', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  iconBox: { width: 48, height: 48, borderRadius: '14px', background: '#FDF6EE', color: '#7B1D2E', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  category: { fontSize: '.7rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1px' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', marginBottom: 12, fontWeight: 800, color: '#1A0A0D' },
  cardDesc: { fontSize: '.9rem', color: '#5A3A42', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' },
  readMore: { fontSize: '.9rem', fontWeight: 700, color: '#7B1D2E', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' },
}
