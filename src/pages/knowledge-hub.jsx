import { useState } from 'react'
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

  const filtered = ARTICLES.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    return matchSearch && matchCat
  })

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) {
      showToast('Please enter a valid email address.', 'error')
      return
    }
    setSubscribed(true)
    showToast("✓ You're subscribed! Legal updates coming your way.", 'success')
    setSubEmail('')
  }

  return (
    <div style={{ paddingTop: 95, background: '#FDF8F4', minHeight: '100vh' }}>
      <Head>
        <title>Know Your Legal Rights | Justice Junction 24/7</title>
        <meta name="description" content="Empower yourself with legal knowledge. Read articles on RTI, FIR, Consumer Rights, and more." />
      </Head>

      {/* Header */}
      <section style={s.hero}>
        <div className="container" style={{textAlign: 'center', position:'relative', zIndex: 2}}>
          <div className="sec-label" style={{justifyContent: 'center', color: 'rgba(255,255,255,0.7)'}}>Legal Literacy</div>
          <h1 style={s.h1}>Empower Yourself with <em>Knowledge.</em></h1>
          <p style={s.heroSub}>Simple, accurate legal guides for every Indian citizen. Know your rights before you take the next step.</p>
          
          <div style={s.searchBox}>
            <Search size={20} color="#6B4050"/>
            <input 
              style={s.input} 
              placeholder="Search for a topic (e.g. RTI, FIR, Property...)" 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div style={s.heroBg} />
      </section>

      <div className="container" style={{ padding: '4rem 5vw' }}>
        {/* Category Filter Pills */}
        <div style={{display:'flex',gap:'.6rem',flexWrap:'wrap',marginBottom:'2.5rem'}}>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding:'.55rem 1.2rem',
                borderRadius:50,
                border: category === cat ? '1.5px solid #8B1A2A' : '1.5px solid #EDD5BE',
                background: category === cat ? '#8B1A2A' : '#fff',
                color: category === cat ? '#fff' : '#4A2030',
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
      <section style={s.ctaSection}>
        <div className="container" style={s.ctaInner}>
          <div style={{flex: 1}}>
            <h2 style={{fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', marginBottom: 8, color:'#1A0A0D'}}>Stay Informed.</h2>
            <p style={{fontSize: '.9rem', color: '#4A2030'}}>Get monthly legal updates and simplified law explainers delivered to your inbox.</p>
          </div>
          {subscribed ? (
            <div style={{display:'flex',alignItems:'center',gap:10,color:'#16a34a',fontWeight:700,fontSize:'.95rem'}}>
              ✓ You're subscribed! Legal updates coming your way.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={s.ctaForm}>
              <input style={s.ctaInput} type="email" placeholder="Enter your email address" value={subEmail} onChange={e => setSubEmail(e.target.value)} required />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '6rem 0', position: 'relative', overflow: 'hidden', background: '#8B1A2A', color: '#fff' },
  heroBg: { position: 'absolute', inset: 0, background: `linear-gradient(rgba(139,26,42,0.92),rgba(107,18,32,0.97))`, zIndex: 1 },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem' },
  heroSub: { fontSize: '1.1rem', color: 'rgba(245,230,211,0.8)', maxWidth: 600, margin: '0 auto 2.5rem' },
  searchBox: { maxWidth: 600, margin: '0 auto', background: '#fff', padding: '1rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1A0A0D' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },
  articleCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid #EDD5BE', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  iconBox: { width: 48, height: 48, borderRadius: '14px', background: '#F5E6D3', color: '#8B1A2A', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  category: { fontSize: '.7rem', fontWeight: 800, color: '#6B4050', textTransform: 'uppercase', letterSpacing: '1px' },
  cardTitle: { fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', marginBottom: 12, fontWeight: 800, color: '#1A0A0D' },
  cardDesc: { fontSize: '.9rem', color: '#4A2030', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' },
  readMore: { fontSize: '.9rem', fontWeight: 700, color: '#8B1A2A', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' },
  
  ctaSection: { padding: '5rem 5vw', background: '#fff', borderTop: '1px solid #EDD5BE' },
  ctaInner: { display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto' },
  ctaForm: { display: 'flex', gap: 10, flex: 1, maxWidth: 400 },
  ctaInput: { flex: 1, padding: '.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid #EDD5BE', outline: 'none', fontSize:'.95rem' },
}
