import { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { BookOpen, Scale, Shield, Landmark, Search, ChevronRight, FileText, AlertCircle } from 'lucide-react'

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

export default function KnowledgeHub() {
  const [search, setSearch] = useState('')
  const filtered = ARTICLES.filter(a => a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()))

  return (
    <div style={{ paddingTop: 95, background: '#F8F9FA', minHeight: '100vh' }}>
      <Head>
        <title>Know Your Rights Hub — Justice Junction 24/7</title>
        <meta name="description" content="Empower yourself with legal knowledge. Read articles on RTI, FIR, Consumer Rights, and more." />
      </Head>

      {/* Header */}
      <section style={s.hero}>
        <div className="container" style={{textAlign: 'center', position:'relative', zIndex: 2}}>
          <div className="sec-label" style={{justifyContent: 'center', color: 'rgba(255,255,255,0.7)'}}>Legal Literacy</div>
          <h1 style={s.h1}>Empower Yourself with <em>Knowledge.</em></h1>
          <p style={s.heroSub}>Simple, accurate legal guides for every Indian citizen. Know your rights before you take the next step.</p>
          
          <div style={s.searchBox}>
            <Search size={20} color="var(--txt-3)"/>
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
            <SearchX size={48} color="var(--txt-3)" style={{marginBottom: '1rem'}}/>
            <h3>No guides found for "{search}"</h3>
            <p>Try searching for broader terms or browse the categories above.</p>
          </div>
        )}
      </div>

      {/* Newsletter / CTA */}
      <section style={s.ctaSection}>
        <div className="container" style={s.ctaInner}>
          <div style={{flex: 1}}>
            <h2 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', marginBottom: 8}}>Stay Informed.</h2>
            <p style={{fontSize: '.9rem', color: 'var(--txt-2)'}}>Get monthly legal updates and simplified law explainers delivered to your inbox.</p>
          </div>
          <div style={s.ctaForm}>
            <input style={s.ctaInput} placeholder="your@email.com" />
            <button className="btn btn-primary">Subscribe</button>
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '6rem 0', position: 'relative', overflow: 'hidden', background: 'var(--bur)', color: '#fff' },
  heroBg: { position: 'absolute', inset: 0, background: `linear-gradient(rgba(123,29,46,0.9), rgba(123,29,46,0.95)), url('/justice-bg.png')`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 1 },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem' },
  heroSub: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', maxWidth: 600, margin: '0 auto 2.5rem' },
  searchBox: { maxWidth: 600, margin: '0 auto', background: '#fff', padding: '1rem 1.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: 12, boxShadow: '0 10px 40px rgba(0,0,0,0.2)' },
  input: { flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: 'var(--txt)' },
  
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' },
  articleCard: { background: '#fff', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  iconBox: { width: 48, height: 48, borderRadius: '14px', background: 'var(--cream-2)', color: 'var(--bur)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  category: { fontSize: '.7rem', fontWeight: 800, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px' },
  cardTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: 12, fontWeight: 800 },
  cardDesc: { fontSize: '.9rem', color: 'var(--txt-2)', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' },
  readMore: { fontSize: '.9rem', fontWeight: 700, color: 'var(--bur)', display: 'flex', alignItems: 'center', gap: 4, textDecoration: 'none' },
  
  ctaSection: { padding: '5rem 5vw', background: '#fff', borderTop: '1px solid var(--border)' },
  ctaInner: { display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto' },
  ctaForm: { display: 'flex', gap: 10, flex: 1, maxWidth: 400 },
  ctaInput: { flex: 1, padding: '.8rem 1.2rem', borderRadius: '12px', border: '1.5px solid var(--border)', outline: 'none' },
}

import { SearchX } from 'lucide-react'
