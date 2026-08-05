import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect } from 'react'
import {
  BookOpen, Scale, Shield, Landmark, Search, ChevronRight, FileText,
  AlertCircle, SearchX, Users, Briefcase, Globe, Home, CreditCard,
  Phone, ExternalLink, TrendingUp, Clock, Star, ArrowRight
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

import { KNOWLEDGE_ARTICLES as ARTICLES } from '../data/knowledgeHubData'

const CATEGORIES = ['All', 'Citizens Rights', 'Criminal Law', 'Family Law', 'Property Law', 'Consumer Rights', 'Digital Law', 'Labour Law', 'Tax & Finance']

const CAT_ICONS = {
  'Citizens Rights': '⚖️', 'Criminal Law': '🚨', 'Family Law': '👨‍👩‍👧',
  'Property Law': '🏠', 'Consumer Rights': '🛒', 'Digital Law': '💻',
  'Labour Law': '👷', 'Tax & Finance': '💼'
}

const DIFF_COLOR = { 'Beginner': '#16A34A', 'Intermediate': '#D97706', 'Advanced': '#DC2626' }
const DIFF_BG = { 'Beginner': '#F0FDF4', 'Intermediate': '#FFFBEB', 'Advanced': '#FEF2F2' }

export default function KnowledgeHub() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [subEmail, setSubEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [featured] = useState(ARTICLES[0])
  const { showToast } = useToast()

  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('jj_newsletter_email')
    if (saved) setSubscribed(true)
  }, [])

  const filtered = ARTICLES.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.desc.toLowerCase().includes(search.toLowerCase()) || a.category.toLowerCase().includes(search.toLowerCase())
    const matchCat = category === 'All' || a.category === category
    return matchSearch && matchCat
  })

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(subEmail)) { showToast('Please enter a valid email address.', 'error'); return }
    try {
      await fetch('/api/subscribe', { credentials: 'include', method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: subEmail }) })
    } catch (_) { }
    setSubscribed(true)
    if (typeof window !== 'undefined') localStorage.setItem('jj_newsletter_email', subEmail)
    showToast("Thanks! We'll keep you updated.", 'success')
    setSubEmail('')
  }

  return (
    <div style={{ background: '#F5F0EC', minHeight: '100vh' }}>
      <Helmet>
        <title>Legal Knowledge Hub — Know Your Rights | Justice Junction 24/7</title>
        <meta name="description" content="Free legal guides on RTI, FIR, Consumer Rights, Divorce, Cyber Crime, Labour Law and more. Backed by Indian government sources." />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fadeInUp { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        .kh-card { animation: fadeInUp 0.4s ease both; transition: transform 0.2s, box-shadow 0.2s; }
        .kh-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(123,29,46,0.12) !important; }
        .kh-card:nth-child(1){animation-delay:.05s} .kh-card:nth-child(2){animation-delay:.1s}
        .kh-card:nth-child(3){animation-delay:.15s} .kh-card:nth-child(4){animation-delay:.2s}
        .kh-card:nth-child(5){animation-delay:.25s} .kh-card:nth-child(6){animation-delay:.3s}
        .cat-chip:hover { background: #7B1D2E !important; color: #fff !important; border-color: #7B1D2E !important; }
        .gov-link:hover { text-decoration: underline !important; }
      `}} />

      {/* ── Cinematic Hero ── */}
      <section style={{
        position: 'relative', overflow: 'hidden', paddingTop: '9rem', paddingBottom: '5rem',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=85')`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,3,5,0.95) 0%, rgba(78,18,28,0.9) 50%, rgba(8,3,5,0.96) 100%)' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to bottom, transparent, #F5F0EC)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.2)', borderRadius: 30, padding: '.35rem 1.1rem', marginBottom: '1.5rem' }}>
            <BookOpen size={12} color="#F5C4B3" />
            <span style={{ fontSize: '.7rem', color: '#F5C4B3', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2.5px' }}>Free Legal Knowledge</span>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2.4rem, 3.8vw, 3.0rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
            Know Your <span style={{ color: '#F5C4B3' }}>Legal Rights</span>
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(245,224,200,0.75)', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
            {ARTICLES.length} expert guides backed by <strong style={{ color: '#F5C4B3' }}>official Indian government sources</strong> — RTI, FIR, Consumer Court, Cyber Crime, Labour Law, and more.
          </p>
          {/* Search bar */}
          <div style={{ maxWidth: 580, margin: '0 auto', background: '#fff', borderRadius: 60, display: 'flex', alignItems: 'center', gap: 12, padding: '.85rem 1.4rem', boxShadow: '0 20px 60px rgba(0,0,0,0.35)' }}>
            <Search size={20} color="#7B1D2E" style={{ flexShrink: 0 }} />
            <input
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: '1rem', color: '#1A0A0D', background: 'transparent', fontWeight: 600 }}
              placeholder="Search topics — RTI, FIR, divorce, cyber fraud…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9A7A84', fontWeight: 700, fontSize: '.85rem' }}>Clear</button>}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid #EDD5BE' }}>
        <div className="container" style={{ display: 'flex', gap: '3rem', padding: '1.2rem 0', justifyContent: 'center', flexWrap: 'wrap' }}>
          {[['📚', `${ARTICLES.length} Free Guides`], ['🏛️', '8 Legal Categories'], ['✅', 'Govt-Backed Sources'], ['🔄', 'Updated July 2024']].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.88rem', fontWeight: 700, color: '#4A2030' }}>
              <span>{icon}</span> {label}
            </div>
          ))}
        </div>
      </div>

      {/* ── Category filter ── */}
      <div style={{ background: '#F5F0EC', borderBottom: '1px solid #EDD5BE', padding: '1rem 0', overflowX: 'auto' }}>
        <div className="container" style={{ display: 'flex', gap: 8, flexWrap: 'nowrap', minWidth: 'max-content', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className="cat-chip"
              onClick={() => setCategory(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: category === cat ? '#7B1D2E' : '#fff',
                border: `1.5px solid ${category === cat ? '#7B1D2E' : '#E8C9A8'}`,
                color: category === cat ? '#fff' : '#4A2030',
                borderRadius: 30, padding: '.45rem 1.1rem',
                fontSize: '.82rem', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.18s', whiteSpace: 'nowrap', flexShrink: 0
              }}
            >
              {cat !== 'All' && <span>{CAT_ICONS[cat]}</span>} {cat}
              {cat !== 'All' && <span style={{ background: category === cat ? 'rgba(255,255,255,0.2)' : 'rgba(123,29,46,0.1)', borderRadius: 10, padding: '0 5px', fontSize: '.7rem' }}>
                {ARTICLES.filter(a => a.category === cat).length}
              </span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 0 5rem' }}>

        {/* ── Featured article ── */}
        {category === 'All' && !search && (
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Star size={13} fill="#7B1D2E" color="#7B1D2E" /> Featured Guide
            </div>
            <div style={{ background: 'linear-gradient(135deg, #1A0A0D, #4A1020)', borderRadius: 24, padding: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap', boxShadow: '0 12px 40px rgba(123,29,46,0.2)' }}>
              <div style={{ fontSize: '4rem', flexShrink: 0 }}>{featured.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: '0.8rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '.7rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1.5px', background: 'rgba(245,196,179,0.1)', borderRadius: 20, padding: '.25rem .7rem', border: '1px solid rgba(245,196,179,0.2)' }}>{featured.category}</span>
                  <span style={{ fontSize: '.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={11} />{featured.readTime} read</span>
                </div>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>{featured.title}</h2>
                <p style={{ color: 'rgba(245,224,200,0.7)', lineHeight: 1.7, fontSize: '.95rem', marginBottom: '1.5rem', maxWidth: 560 }}>{featured.desc}</p>
                <Link to={`/knowledge/${featured.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#F5C4B3', color: '#1A0A0D', borderRadius: 12, padding: '.8rem 1.8rem', fontWeight: 800, fontSize: '.9rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                  Read Full Guide <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ flexShrink: 0, background: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: '1.5rem', minWidth: 220 }}>
                <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '1rem' }}>Key Points</div>
                {featured.keyPoints.slice(0, 3).map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5C4B3', flexShrink: 0, marginTop: 7 }} />
                    <span style={{ fontSize: '.82rem', color: 'rgba(245,224,200,0.8)', lineHeight: 1.5 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Result count */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontWeight: 800, color: '#1A0A0D', fontSize: '1rem' }}>
            {filtered.length === ARTICLES.length ? `All ${ARTICLES.length} Guides` : `${filtered.length} Guide${filtered.length !== 1 ? 's' : ''} Found`}
            {category !== 'All' && <span style={{ color: '#7B1D2E', marginLeft: 6 }}>in {category}</span>}
          </div>
          {(search || category !== 'All') && (
            <button onClick={() => { setSearch(''); setCategory('All') }} style={{ background: 'none', border: '1.5px solid #E8C9A8', borderRadius: 10, padding: '.4rem .9rem', color: '#7B1D2E', fontWeight: 700, fontSize: '.82rem', cursor: 'pointer' }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Article grid ── */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((a, idx) => (
              <div key={a.id} className="kh-card" style={{ background: '#fff', borderRadius: 22, border: '1px solid #E8C9A8', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 16px rgba(123,29,46,0.05)', animationDelay: `${idx * 0.05}s` }}>
                {/* Card top accent */}
                <div style={{ height: 4, background: 'linear-gradient(90deg, #7B1D2E, #C44B6B)' }} />
                <div style={{ padding: '1.6rem 1.8rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '2.2rem', lineHeight: 1 }}>{a.emoji}</span>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: '.65rem', fontWeight: 800, color: DIFF_COLOR[a.difficulty], background: DIFF_BG[a.difficulty], borderRadius: 20, padding: '.2rem .6rem' }}>{a.difficulty}</span>
                      <span style={{ fontSize: '.68rem', color: '#9A7A84', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}><Clock size={10} />{a.readTime}</span>
                    </div>
                  </div>
                  {/* Category tag */}
                  <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '0.6rem' }}>
                    {CAT_ICONS[a.category]} {a.category}
                  </div>
                  {/* Title */}
                  <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#1A0A0D', marginBottom: '0.7rem', lineHeight: 1.3 }}>{a.title}</h3>
                  {/* Desc */}
                  <p style={{ fontSize: '.86rem', color: '#5A3A42', lineHeight: 1.65, marginBottom: '1.2rem', flex: 1 }}>{a.desc}</p>
                  {/* Key points preview */}
                  <div style={{ background: '#FDF6EE', borderRadius: 12, padding: '1rem', marginBottom: '1.2rem' }}>
                    <div style={{ fontSize: '.68rem', fontWeight: 800, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.6rem' }}>Key Points</div>
                    {a.keyPoints.slice(0, 2).map((pt, i) => (
                      <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', marginBottom: i < 1 ? 5 : 0 }}>
                        <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#7B1D2E', flexShrink: 0, marginTop: 6 }} />
                        <span style={{ fontSize: '.79rem', color: '#4A2030', lineHeight: 1.45 }}>{pt}</span>
                      </div>
                    ))}
                    {a.keyPoints.length > 2 && <div style={{ fontSize: '.72rem', color: '#9A7A84', marginTop: 5, fontWeight: 600 }}>+{a.keyPoints.length - 2} more points →</div>}
                  </div>
                  {/* Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to={`/knowledge/${a.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #7B1D2E, #5C1521)', color: '#fff', borderRadius: 10, padding: '.6rem 1.2rem', fontSize: '.82rem', fontWeight: 800, textDecoration: 'none', transition: 'all 0.2s' }}>
                      Read Full Guide <ChevronRight size={14} />
                    </Link>
                    <a href={a.govLink} target="_blank" rel="noopener noreferrer" className="gov-link" style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '.7rem', color: '#9A7A84', fontWeight: 600, textDecoration: 'none' }}>
                      <Globe size={11} /> {a.govSource} <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: '#fff', borderRadius: 24, border: '1px solid #E8C9A8' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🔍</div>
            <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, color: '#1A0A0D', marginBottom: 8 }}>No guides found for "{search}"</h3>
            <p style={{ color: '#5A3A42', marginBottom: '1.5rem' }}>Try broader terms or browse a category above.</p>
            <button onClick={() => { setSearch(''); setCategory('All') }} style={{ background: 'linear-gradient(135deg, #7B1D2E, #5C1521)', color: '#fff', border: 'none', borderRadius: 12, padding: '.9rem 2rem', fontWeight: 800, cursor: 'pointer' }}>Browse All Guides</button>
          </div>
        )}

        {/* ── Govt portals quick-links ── */}
        <div style={{ marginTop: '4rem', background: '#fff', borderRadius: 24, border: '1px solid #E8C9A8', padding: '2rem', boxShadow: '0 4px 20px rgba(123,29,46,0.05)' }}>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 900, fontSize: '1.2rem', color: '#1A0A0D', marginBottom: '0.5rem' }}>🏛️ Official Government Portals</div>
          <p style={{ color: '#5A3A42', fontSize: '.88rem', marginBottom: '1.5rem' }}>All legal guides on Justice Junction are sourced from or verified against these official Indian government resources.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.8rem' }}>
            {[
              ['RTI Online', 'rtionline.gov.in', 'https://rtionline.gov.in'],
              ['NALSA (Free Legal Aid)', 'nalsa.gov.in', 'https://nalsa.gov.in'],
              ['Cyber Crime', 'cybercrime.gov.in', 'https://cybercrime.gov.in'],
              ['Consumer Helpline', 'consumerhelpline.gov.in', 'https://consumerhelpline.gov.in'],
              ['CPGRAMS Grievance', 'pgportal.gov.in', 'https://pgportal.gov.in'],
              ['Income Tax India', 'incometax.gov.in', 'https://incometax.gov.in'],
              ['RERA Maharashtra', 'maharera.mahaonline.gov.in', 'https://maharera.mahaonline.gov.in'],
              ['e-Daakhil Consumer', 'edaakhil.nic.in', 'https://edaakhil.nic.in'],
              ['Model Tenancy Act', 'mohua.gov.in', 'https://mohua.gov.in'],
              ['Women Helpline', '181 Helpline', 'https://wcd.nic.in'],
              ['Labour Law Portal', 'labour.gov.in', 'https://labour.gov.in'],
              ['Passport Seva', 'passportindia.gov.in', 'https://passportindia.gov.in'],
            ].map(([name, domain, url]) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#FDF6EE', border: '1px solid #E8C9A8', borderRadius: 12, padding: '.75rem 1rem', textDecoration: 'none', transition: 'all 0.2s' }}>
                <Globe size={14} color="#7B1D2E" style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#1A0A0D' }}>{name}</div>
                  <div style={{ fontSize: '.68rem', color: '#7B1D2E' }}>{domain}</div>
                </div>
                <ExternalLink size={12} color="#9A7A84" style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Newsletter CTA ── */}
      <section style={{ background: 'linear-gradient(135deg, #1A0A0D, #4A1020)', padding: '5rem 0' }}>
        <div className="container" style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📬</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, color: '#fff', marginBottom: '0.8rem', letterSpacing: '-0.03em' }}>
            Stay Legally Informed
          </h2>
          <p style={{ color: 'rgba(245,224,200,0.7)', fontSize: '1rem', marginBottom: '2rem', lineHeight: 1.7 }}>
            Monthly plain-language legal updates — new laws, court verdicts, and your rights explained simply.
          </p>
          {subscribed ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#4ADE80', fontWeight: 800, fontSize: '1rem', background: 'rgba(74,222,128,0.1)', borderRadius: 14, padding: '1rem 2rem', border: '1px solid rgba(74,222,128,0.2)' }}>
              ✓ You're subscribed! Legal updates coming your way.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} style={{ display: 'flex', gap: 10, maxWidth: 500, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
              <input
                style={{ flex: 1, minWidth: 240, padding: '1rem 1.4rem', borderRadius: 14, border: '1px solid rgba(255,255,255,0.15)', outline: 'none', fontSize: '.95rem', background: 'rgba(255,255,255,0.07)', color: '#fff', fontWeight: 600 }}
                type="email" placeholder="your@email.com" value={subEmail} onChange={e => setSubEmail(e.target.value)} required
              />
              <button type="submit" style={{ padding: '1rem 2rem', borderRadius: 14, background: '#F5C4B3', color: '#1A0A0D', border: 'none', fontWeight: 800, fontSize: '.95rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                Subscribe Free
              </button>
            </form>
          )}
          <p style={{ fontSize: '.75rem', color: 'rgba(245,224,200,0.4)', marginTop: '1rem' }}>No spam · Unsubscribe anytime</p>
        </div>
      </section>
    </div>
  )
}
