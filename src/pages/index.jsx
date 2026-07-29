import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ShieldCheck, Search, Star, Bot, BadgeCheck, Video,
  Lock, Clock, ArrowRight, ChevronRight, IndianRupee,
  CheckCircle2, MapPin, Activity, BarChart2, Calendar,
  Scale, FileText, Globe, Zap, Users, Phone
} from 'lucide-react'

/* ═══════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════ */
function Counter({ to, suffix = '', prefix = '', dur = 2400 }) {
  const [n, setN] = useState(0)
  const el = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const run = (now) => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 4)
          setN(Math.round(ease * to))
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }
    }, { threshold: 0.4 })
    if (el.current) io.observe(el.current)
    return () => io.disconnect()
  }, [to, dur])
  return <span ref={el}>{prefix}{n.toLocaleString('en-IN')}{suffix}</span>
}

/* ═══════════════════════════════════════════
   TYPING HEADLINE
═══════════════════════════════════════════ */
const ROTATING_WORDS = ['Lawyer', 'Advocate', 'Criminal Lawyer', 'Family Lawyer', 'Property Lawyer']
function TypingWord() {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = ROTATING_WORDS[idx]
    let timeout
    if (!deleting && display.length < word.length) {
      timeout = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 80)
    } else if (!deleting && display.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2000)
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 40)
    } else if (deleting && display.length === 0) {
      setDeleting(false)
      setIdx((idx + 1) % ROTATING_WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [display, deleting, idx])
  return (
    <span style={{ color: '#F5C4B3', position: 'relative' }}>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', color: '#F5C4B3', marginLeft: 2 }}>|</span>
    </span>
  )
}

const SPECS = ['Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law', 'Cyber Law', 'Taxation']

const AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, Sessions Court, Anticipatory Bail', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80' },
  { emoji: '👨‍👩‍👧', name: 'Family & Divorce', desc: 'Divorce, child custody, alimony, DV cases', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { emoji: '🏠', name: 'Property & RERA', desc: 'Title disputes, registry, builder fraud', img: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600&q=80' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, IP, compliance, M&A, startups', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&q=80' },
  { emoji: '🛒', name: 'Consumer Rights', desc: 'Consumer forum, e-commerce, RERA, refunds', img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF, ESIC, factory act', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80' },
  { emoji: '💻', name: 'Cyber Law', desc: 'Online fraud, IT Act, cybercrime FIR, data breach', img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax notices, appeals', img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&q=80' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency same-day bail & FIR assistance', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright, trade secrets', img: 'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=600&q=80' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery suits, injunctions, declaratory relief', img: 'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=600&q=80' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent, maintenance', img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
]

const REVIEWS = [
  { init: 'RG', name: 'Rohit Gupta', city: 'Delhi', stars: 5, text: 'Found a criminal lawyer in 8 minutes at 11 PM. Paid exactly what was shown — ₹3,500. The real-time case update dashboard is genuinely brilliant.' },
  { init: 'AP', name: 'Anjali Patel', city: 'Mumbai', stars: 5, text: 'Divorce is already painful. Justice Junction made the legal side manageable. I knew every rupee before I spoke to anyone. Completely transparent.' },
  { init: 'SK', name: 'Adv. Suresh Kumar', city: 'Bangalore', stars: 5, text: "As an advocate, I got 12 quality client bookings in my first month. The platform's pricing transparency builds trust before the first call." },
  { init: 'KM', name: 'Karan Mehta', city: 'Hyderabad', stars: 5, text: 'After cyber fraud worth ₹2.4L, their specialist guided me step-by-step — FIR, bank freeze, recovery. Got 80% back in 6 weeks. Life-changing.' },
  { init: 'MS', name: 'Meena Sharma', city: 'Jaipur', stars: 5, text: 'My property dispute was stuck for years. Found the right specialist in 10 minutes, consultation same evening, resolution in 4 months. Incredible.' },
  { init: 'VP', name: 'Vikash Patel', city: 'Ahmedabad', stars: 5, text: 'Needed a corporate lawyer urgently for a contract dispute. Booked in 3 minutes, video call within an hour. Case update feed is a game-changer.' },
]

export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [vidReady, setVidReady] = useState(false)

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (query) p.set('query', query)
    navigate('/search?' + p.toString())
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: '#FDF6EE' }}>
      <Helmet>
        <title>Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help</title>
        <meta name="description" content="India's #1 price-transparent legal marketplace. 1,338+ Bar Council verified advocates. AI matching, encrypted video calls, 24/7 emergency access." />
        <meta property="og:title" content="Justice Junction 24/7 — Find Verified Lawyers in India" />
        <meta property="og:description" content="India's first price-transparent legal platform. Bar Council verified, AI-powered, 24/7 emergency legal access." />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context":"https://schema.org","@type":"LegalService",
          "name":"Justice Junction 24/7","url":"https://justice-junction-app.vercel.app/",
          "areaServed":"India","priceRange":"₹500–₹10,000",
          "provider":{"@type":"Organization","name":"Justice Junction 24/7"}
        })}} />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes kenBurns {
          0%   { transform: scale(1.0) translateX(0) translateY(0); }
          33%  { transform: scale(1.08) translateX(-1%) translateY(-1%); }
          66%  { transform: scale(1.05) translateX(1%) translateY(0.5%); }
          100% { transform: scale(1.0) translateX(0) translateY(0); }
        }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes marqee { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(245,196,179,0)} 50%{box-shadow:0 0 0 8px rgba(245,196,179,0.08)} }
        @keyframes shimmer { 0%{background-position:0% 50%} 100%{background-position:200% 50%} }
        .hero-text-in { animation: floatUp 0.9s cubic-bezier(.23,1,.32,1) both; }
        .hero-text-in:nth-child(1){animation-delay:0.1s}
        .hero-text-in:nth-child(2){animation-delay:0.25s}
        .hero-text-in:nth-child(3){animation-delay:0.4s}
        .hero-text-in:nth-child(4){animation-delay:0.55s}
        .hero-text-in:nth-child(5){animation-delay:0.7s}
        .area-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.25) !important; }
        .area-card:hover .area-overlay { opacity: 1 !important; }
        .area-card:hover .area-emoji { transform: scale(1.15); }
        .feature-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(123,29,46,0.1) !important; border-color: rgba(123,29,46,0.2) !important; }
        .review-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(123,29,46,0.12) !important; }
        .search-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(123,29,46,0.45) !important; }
        .cta-btn:hover { transform: translateY(-2px); }
        @media (max-width:768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .step-grid { grid-template-columns: 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; }
          .search-row { flex-direction:column !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .area-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
      `}} />

      {/* ══════════════════════════════════════════════════════
          HERO — Cinematic video + Ken Burns fallback
      ══════════════════════════════════════════════════════ */}
      <section style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: 80 }}>

        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVidReady(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: vidReady ? 1 : 0, transition: 'opacity 2s ease'
          }}
          poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90"
        >
          <source src="https://cdn.pixabay.com/video/2020/07/02/44336-436792100_large.mp4" type="video/mp4" />
        </video>

        {/* Ken Burns image fallback */}
        {!vidReady && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            animation: 'kenBurns 20s ease-in-out infinite'
          }} />
        )}

        {/* Layered gradient overlays */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(170deg, rgba(10,4,6,0.88) 0%, rgba(75,16,28,0.78) 55%, rgba(10,4,6,0.92) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'radial-gradient(ellipse at 60% 50%, rgba(123,29,46,0.18) 0%, transparent 65%)' }} />
        {/* Bottom cream fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 220, zIndex: 2, background: 'linear-gradient(to bottom, transparent, #FDF6EE)' }} />

        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '5%', right: '-10%', width: 800, height: 800, border: '1px solid rgba(245,196,179,0.06)', borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '12%', right: '-5%', width: 580, height: 580, border: '1px solid rgba(245,196,179,0.05)', borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, padding: '5rem 0 8rem' }}>

          {/* Top label */}
          <div className="hero-text-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.25)',
            borderRadius: 40, padding: '.38rem 1.1rem', marginBottom: '2rem',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ADE80', animation: 'pulseGlow 2s infinite' }} />
            <span style={{ fontSize: '.72rem', fontWeight: 800, color: '#F5C4B3', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
              Live · India's #1 Legal Marketplace · 24/7 Legal Access
            </span>
          </div>

          {/* Main headline with typing */}
          <h1 className="hero-text-in" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.045em',
            color: '#fff', marginBottom: '1.5rem', maxWidth: 880
          }}>
            Find Your <TypingWord /><br />
            <span style={{ fontStyle: 'italic', fontWeight: 700, fontSize: '0.88em', color: 'rgba(255,255,255,0.85)' }}>
              — Anytime. Anywhere in India.
            </span>
          </h1>

          <p className="hero-text-in" style={{
            fontSize: 'clamp(.95rem, 1.5vw, 1.18rem)',
            color: 'rgba(249,238,228,0.82)', maxWidth: 620, lineHeight: 1.85,
            marginBottom: '2.5rem', fontWeight: 400
          }}>
            India's first 100% price-transparent legal marketplace.
            <strong style={{ color: '#F5C4B3', fontWeight: 700 }}> 1,338+ Bar Council verified advocates</strong> across
            <strong style={{ color: '#F5C4B3', fontWeight: 700 }}> 100+ cities</strong>. Instant booking.
            Encrypted video calls. AI-powered matching. Available 24/7.
          </p>

          {/* ── Glass Search Box ─── */}
          <div className="hero-text-in" style={{
            background: 'rgba(255,255,255,0.96)', borderRadius: 22, padding: '10px 10px 10px 10px',
            boxShadow: '0 24px 80px rgba(0,0,0,0.3), 0 0 0 1px rgba(232,201,168,0.5)',
            maxWidth: 780, marginBottom: '2rem'
          }}>
            <div className="search-row" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ flex: '1 1 220px', padding: '12px 20px', minWidth: 0 }}>
                <label htmlFor="issue-sel" style={{ display: 'block', fontSize: '.62rem', fontWeight: 900, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 5 }}>Legal Issue</label>
                <select id="issue-sel"
                  style={{ border: 'none', background: 'none', fontSize: '.97rem', fontWeight: 700, color: '#1A0A0D', outline: 'none', cursor: 'pointer', width: '100%', padding: 0 }}
                  value={spec} onChange={e => setSpec(e.target.value)}>
                  <option value="">What do you need help with?</option>
                  {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{ width: 1, height: 48, background: 'rgba(232,201,168,0.7)', flexShrink: 0, margin: '0 4px' }} className="mobile-hide" />
              <div style={{ flex: '1 1 180px', padding: '12px 20px', minWidth: 0 }}>
                <label htmlFor="city-inp" style={{ display: 'block', fontSize: '.62rem', fontWeight: 900, color: '#7B1D2E', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 5 }}>City / Pincode</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={15} color="#9B2D42" style={{ flexShrink: 0 }} />
                  <input id="city-inp"
                    style={{ border: 'none', background: 'none', fontSize: '.97rem', fontWeight: 700, color: '#1A0A0D', outline: 'none', width: '100%', padding: 0 }}
                    placeholder="Delhi, 110001, Mumbai…"
                    value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goSearch()} />
                </div>
              </div>
              <button className="search-btn" onClick={goSearch} style={{
                background: 'linear-gradient(135deg, #7B1D2E 0%, #5C1521 100%)',
                color: '#fff', border: 'none', borderRadius: 16,
                padding: '1.1rem 2rem', fontWeight: 800, fontSize: '.97rem',
                cursor: 'pointer', flexShrink: 0, margin: '4px',
                boxShadow: '0 8px 24px rgba(123,29,46,0.4)',
                transition: 'all 0.25s ease',
                display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
              }}>
                Find My Lawyer <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Trust pills row */}
          <div className="hero-text-in" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { icon: <BadgeCheck size={14} color="#4ADE80" />, t: 'Bar Council Verified' },
              { icon: <IndianRupee size={14} color="#F5C4B3" />, t: 'No Hidden Fees' },
              { icon: <Lock size={14} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
              { icon: <Clock size={14} color="#60A5FA" />, t: '24/7 Emergency Access' },
              { icon: <Zap size={14} color="#FCD34D" />, t: 'AI-Powered Matching' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)', borderRadius: 30, padding: '.32rem .85rem'
              }}>
                {b.icon}
                <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{b.t}</span>
              </div>
            ))}
          </div>

          {/* AI chip */}
          <div className="hero-text-in">
            <button onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(90deg, rgba(123,29,46,0.5), rgba(92,21,33,0.5))',
              border: '1px solid rgba(245,196,179,0.3)',
              borderRadius: 30, padding: '.45rem 1.2rem', color: '#F5C4B3',
              fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
              backdropFilter: 'blur(12px)', transition: 'all 0.2s'
            }}>
              <Bot size={15} />
              <span>Ask AI Legal Assistant — Free · Powered by Indian Bare Acts</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)',
          zIndex: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
        }}>
          <span style={{ fontSize: '.65rem', color: 'rgba(245,196,179,0.5)', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 24, height: 38, border: '1.5px solid rgba(245,196,179,0.25)', borderRadius: 14, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 5 }}>
            <div style={{ width: 4, height: 8, background: '#F5C4B3', borderRadius: 2, animation: 'floatUp 1.5s ease-in-out infinite alternate' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <div style={{ background: '#1A0A0D', padding: '1rem 0', overflow: 'hidden', borderTop: '1px solid rgba(245,196,179,0.08)', borderBottom: '1px solid rgba(245,196,179,0.08)' }}>
        <div style={{ display: 'flex', animation: 'marqee 30s linear infinite', whiteSpace: 'nowrap', gap: '3rem', width: 'max-content' }}>
          {[...Array(3)].flatMap(() => [
            '⚖️ 1,338+ Verified Advocates',
            '🏛️ Bar Council Certified',
            '🔒 End-to-End Encrypted',
            '🤖 AI Legal Assistant',
            '📍 100+ Cities',
            '⏰ 24/7 Emergency Access',
            '💰 Zero Hidden Fees',
            '⭐ 4.9★ Client Rating',
            '🇮🇳 Pan-India Network',
            '📱 Instant Booking',
          ]).map((txt, i) => (
            <span key={i} style={{ fontSize: '.78rem', fontWeight: 700, color: 'rgba(245,196,179,0.6)', letterSpacing: '1.5px', textTransform: 'uppercase', flexShrink: 0 }}>
              {txt}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          STATS — Dramatic dark with Sora giant numbers
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', background: '#0E0508', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,4,6,0.94)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(123,29,46,0.12) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none', zIndex: 1 }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.08)',
              border: '1px solid rgba(245,196,179,0.2)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>By The Numbers</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
              India's most trusted legal platform
            </h2>
          </div>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '2rem', textAlign: 'center' }}>
            {[
              { to: 1338, s: '+', label: 'Verified', sub: 'Advocates', color: '#F5C4B3' },
              { to: 100,  s: '+', label: 'Cities',   sub: 'Covered',   color: '#E8A990' },
              { to: 10000,s: '+', label: 'Citizens', sub: 'Helped',     color: '#F5C4B3' },
              { to: 98,   s: '%', label: 'Client',   sub: 'Satisfaction', color: '#E8A990' },
              { to: 15,   s: 'min', label: 'Avg.', sub: 'Emergency Response', color: '#F5C4B3' },
            ].map((st, i) => (
              <div key={i} style={{
                padding: '2rem 1rem',
                borderRight: i < 4 ? '1px solid rgba(245,196,179,0.08)' : 'none',
                position: 'relative'
              }}>
                {/* Ghost big number */}
                <div style={{
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-55%)',
                  fontFamily: "'Sora',sans-serif", fontSize: '7rem', fontWeight: 900,
                  color: 'rgba(245,196,179,0.03)', lineHeight: 1, letterSpacing: '-0.05em',
                  pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap'
                }}>
                  <Counter to={st.to} suffix={st.s} />
                </div>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                  fontWeight: 900, color: st.color, lineHeight: 1,
                  letterSpacing: '-0.05em', marginBottom: 8
                }}>
                  <Counter to={st.to} suffix={st.s} />
                </div>
                <div style={{ fontSize: '.8rem', fontWeight: 800, color: '#fff', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{st.label}</div>
                <div style={{ fontSize: '.68rem', color: 'rgba(245,196,179,0.45)', marginTop: 4, fontWeight: 600 }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRACTICE AREAS — Photo cards with hover overlay
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>All Legal Matters</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.8rem' }}>
              We cover every area of Indian law
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Find a Bar Council verified specialist for your exact legal situation — in under 60 seconds.
            </p>
          </div>
          <div className="area-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {AREAS.map((a, i) => (
              <Link key={i} to={`/search?specialization=${encodeURIComponent(a.name)}`} style={{ textDecoration: 'none' }}>
                <div className="area-card" style={{
                  position: 'relative', height: 200, borderRadius: 18, overflow: 'hidden',
                  cursor: 'pointer', transition: 'all 0.35s cubic-bezier(.23,1,.32,1)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}>
                  {/* Photo bg */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url('${a.img}')`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    transition: 'transform 0.5s ease'
                  }} />
                  {/* Base dark overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,10,13,0.55) 0%, rgba(92,21,33,0.75) 100%)' }} />
                  {/* Hover overlay */}
                  <div className="area-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(92,21,33,0.85)', opacity: 0, transition: 'opacity 0.35s ease' }} />
                  {/* Content */}
                  <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '1.4rem', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                    <div className="area-emoji" style={{ fontSize: '1.8rem', marginBottom: 8, display: 'block', transition: 'transform 0.3s ease' }}>{a.emoji}</div>
                    <div style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 800, color: '#fff', fontSize: '.95rem', marginBottom: 4 }}>{a.name}</div>
                    <div style={{ fontSize: '.75rem', color: 'rgba(245,224,200,0.75)', lineHeight: 1.5 }}>{a.desc}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#F5C4B3', fontSize: '.72rem', fontWeight: 800, marginTop: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Find Advocate <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          HOW IT WORKS — Light section, big numbered steps
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600, background: 'radial-gradient(circle, rgba(123,29,46,0.04) 0%, transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>How It Works</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em' }}>
              Legal help in <span style={{ color: 'var(--bur)' }}>4 steps.</span> Seriously.
            </h2>
          </div>
          <div className="step-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem', position: 'relative' }}>
            {/* Connecting line */}
            <div style={{ position: 'absolute', top: '3rem', left: '12.5%', right: '12.5%', height: 1, background: 'linear-gradient(90deg, transparent, var(--border), var(--border), var(--border), transparent)', zIndex: 0 }} className="mobile-hide" />
            {[
              { n: '01', icon: <Search size={22} />, title: 'Search', desc: 'Enter your city and legal issue. Our AI instantly shows matched, verified advocates — no spam.' },
              { n: '02', icon: <BarChart2 size={22} />, title: 'Compare', desc: 'View full profiles with experience, published fees, ratings, and availability. 100% transparent.' },
              { n: '03', icon: <Calendar size={22} />, title: 'Book', desc: 'Pick your slot. Meet via encrypted video or in-person. Pay exactly what was shown — zero extra.' },
              { n: '04', icon: <Activity size={22} />, title: 'Track', desc: 'Get live case updates from your lawyer on your dashboard. Always know where your case stands.' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                {/* Number circle */}
                <div style={{
                  width: 68, height: 68, borderRadius: '50%',
                  background: '#fff', border: '2px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', position: 'relative',
                  boxShadow: '0 8px 24px rgba(123,29,46,0.1)'
                }}>
                  {/* Big ghost number behind */}
                  <span style={{
                    position: 'absolute', fontFamily: "'Sora',sans-serif",
                    fontSize: '3.5rem', fontWeight: 900, color: 'rgba(123,29,46,0.06)',
                    top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                    lineHeight: 1, pointerEvents: 'none'
                  }}>{step.n}</span>
                  <span style={{ color: 'var(--bur)', position: 'relative', zIndex: 1 }}>{step.icon}</span>
                </div>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: '3rem', fontWeight: 900, color: 'rgba(123,29,46,0.06)',
                  letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '-1.5rem'
                }}>{step.n}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.15rem', fontWeight: 900, color: 'var(--txt)', marginBottom: 8, marginTop: '1.8rem' }}>{step.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', lineHeight: 1.75 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bur)', color: '#fff', fontWeight: 800, fontSize: '1rem',
              padding: '1rem 2.5rem', borderRadius: 14, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(123,29,46,0.3)', transition: 'all 0.25s ease'
            }} className="cta-btn">
              Find My Lawyer Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          WHY CHOOSE US — Dark photo bg, glassmorphism tiles
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,4,6,0.88)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.22)',
              color: '#F5C4B3', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Why Justice Junction</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
              Built differently. <span style={{ color: '#F5C4B3' }}>For India.</span>
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: '1.2rem' }}>
            {[
              { icon: <BadgeCheck size={22} />, title: 'Bar Council Verified', desc: 'Every advocate passes mandatory Bar Council enrollment verification. No unverified lawyers. Ever.' },
              { icon: <IndianRupee size={22} />, title: 'Zero Hidden Fees', desc: 'All fees published upfront on every profile. You pay only what you see. Zero platform commission.' },
              { icon: <Video size={22} />, title: 'Encrypted Video Calls', desc: 'End-to-end encrypted consultations. Your case details stay 100% private between you and your advocate.' },
              { icon: <Activity size={22} />, title: 'Live Case Updates', desc: 'Your lawyer posts live progress to your dashboard. No more chasing calls or WhatsApp messages.' },
              { icon: <Globe size={22} />, title: 'Pan-India Network', desc: '1,338+ advocates in 100+ cities. Find local expertise or consult remotely from anywhere in India.' },
              { icon: <Clock size={22} />, title: '24/7 Emergency Access', desc: 'Police summons, bail hearings don\'t wait. Emergency advocates respond within 15 minutes, any hour.' },
              { icon: <Bot size={22} />, title: 'Free AI Legal Assistant', desc: 'Our AI — trained on Indian Bare Acts — answers your legal questions and identifies the right specialist.' },
              { icon: <FileText size={22} />, title: 'Free Legal Documents', desc: 'RTI applications, demand notices, FIR drafts, contracts — India-specific templates, completely free.' },
            ].map((f, i) => (
              <div key={i} className="feature-card" style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,196,179,0.1)',
                borderRadius: 20, padding: '1.8rem', backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease', cursor: 'default'
              }}>
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'rgba(245,196,179,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C4B3', marginBottom: '1.2rem' }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: '1.05rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '.86rem', color: 'rgba(245,224,200,0.62)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          TESTIMONIALS — Clean white masonry
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#FCD34D" color="#FCD34D" />)}
              <span style={{ fontFamily: "'Sora',sans-serif", fontSize: '1rem', fontWeight: 700, color: '#1A0A0D', marginLeft: 8, alignSelf: 'center' }}>4.9 / 5.0</span>
            </div>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Real Client Stories</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em' }}>
              Trusted by <span style={{ color: 'var(--bur)' }}>thousands</span> across India.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '1.5rem' }}>
            {REVIEWS.map((r, i) => (
              <div key={i} className="review-card" style={{
                background: 'var(--cream)', borderRadius: 22, padding: '2rem',
                border: '1px solid var(--border)', transition: 'all 0.3s ease',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '-10px', right: '-5px',
                  fontFamily: "'Georgia',serif",
                  fontSize: '6rem', color: 'rgba(123,29,46,0.05)', lineHeight: 1,
                  pointerEvents: 'none', userSelect: 'none'
                }}>"</div>
                <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#FCD34D" color="#FCD34D" />)}
                </div>
                <p style={{ fontSize: '.92rem', color: 'var(--txt-2)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.4rem', position: 'relative', zIndex: 1 }}>
                  "{r.text}"
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, var(--bur), var(--bur-d))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C4B3', fontWeight: 900, fontSize: '.85rem', flexShrink: 0, fontFamily: "'Sora',sans-serif" }}>{r.init}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--txt)' }}>{r.name}</div>
                    <div style={{ fontSize: '.73rem', color: 'var(--txt-3)', display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                      <MapPin size={10} /> {r.city} · Verified Client
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOR LAWYERS — Split with earnings card
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,246,238,0.96)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="lawyer-split" style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px', textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1.2rem' }}>For Legal Professionals</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900, color: 'var(--txt)', lineHeight: 1.1, letterSpacing: '-0.03em', marginBottom: '1.2rem' }}>
                Are You a Lawyer?<br /><span style={{ color: 'var(--bur)' }}>Grow Your Practice.</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '2rem' }}>
                Join 1,338+ verified advocates on Justice Junction. Set your own fees, get quality client bookings 24/7, and manage your entire practice from one powerful dashboard.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2.5rem' }}>
                {['Free profile listing — zero upfront cost', 'You set your own consultation fee', 'Receive verified client bookings 24/7', 'Razorpay-secured payouts within 48 hours', 'Bar Council verified badge on your profile', 'Real-time dashboard for all case tracking'].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(123,29,46,0.09)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={13} color="var(--bur)" />
                    </div>
                    <span style={{ fontSize: '.92rem', color: 'var(--txt-2)', fontWeight: 600 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/join-as-lawyer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--bur)', color: '#fff', fontWeight: 800, fontSize: '1rem', padding: '1rem 2rem', borderRadius: 14, textDecoration: 'none', boxShadow: '0 8px 24px rgba(123,29,46,0.3)' }} className="cta-btn">
                  Join as Advocate — Free <ArrowRight size={16} />
                </Link>
                <Link to="/lawyer-plans" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '2px solid var(--bur)', color: 'var(--bur)', fontWeight: 700, fontSize: '1rem', padding: '1rem 2rem', borderRadius: 14, textDecoration: 'none', background: 'transparent' }} className="cta-btn">
                  View Plans
                </Link>
              </div>
            </div>
            {/* Earnings card */}
            <div style={{
              background: 'linear-gradient(160deg, #7B1D2E 0%, #3D0E16 100%)',
              borderRadius: 28, padding: '2.8rem 2.5rem', color: '#fff',
              boxShadow: '0 30px 80px rgba(123,29,46,0.25)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.04, backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)', backgroundSize: '20px 20px' }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Pro Plan — Avg. Monthly Earnings</div>
                <div style={{ fontFamily: "'Sora',sans-serif", fontSize: 'clamp(2rem,3vw,2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 4 }}>₹45K – ₹75K</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(245,196,179,0.6)', marginBottom: '2rem' }}>Based on 15–30 consultations at ₹2,500 avg</div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', textAlign: 'center', marginBottom: '2rem' }}>
                    {[['48h', 'Verification'], ['₹0', 'Upfront Cost'], ['Free', 'Registration']].map(([v, l], i) => (
                      <div key={i}>
                        <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '1.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>{v}</div>
                        <div style={{ fontSize: '.68rem', color: 'rgba(245,196,179,0.6)', fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px' }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/join-as-lawyer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(245,196,179,0.15)', border: '1px solid rgba(245,196,179,0.3)', color: '#F5C4B3', fontWeight: 800, fontSize: '.9rem', padding: '.9rem', borderRadius: 12, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
                    Apply Now — Takes 2 Minutes <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FINAL CTA — Cinematic dark
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden', textAlign: 'center',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
        backgroundSize: 'cover', backgroundPosition: 'center 60%',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(8,3,5,0.97) 0%, rgba(80,18,29,0.96) 100%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 1000, height: 1000, background: 'radial-gradient(circle, rgba(123,29,46,0.08) 0%, transparent 55%)', borderRadius: '50%', zIndex: 1, pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div style={{ fontFamily: "'Sora',sans-serif", fontSize: '4rem', fontWeight: 900, color: 'rgba(245,196,179,0.06)', letterSpacing: '-0.05em', lineHeight: 1, marginBottom: '-1.5rem' }}>24/7</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.08)', border: '1px solid rgba(245,196,179,0.2)',
              borderRadius: 30, padding: '.38rem 1.1rem', marginBottom: '1.5rem'
            }}>
              <Scale size={13} color="#F5C4B3" />
              <span style={{ fontSize: '.72rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px' }}>Justice for Every Indian</span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1.2rem' }}>
              Ready to resolve your<br />
              <span style={{ color: '#F5C4B3' }}>legal matters today?</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,224,200,0.72)', marginBottom: '3rem', lineHeight: 1.85, maxWidth: 600, margin: '0 auto 3rem' }}>
              Join thousands of Indians who found their trusted legal advocate on Justice Junction 24/7. Free to sign up. No hidden fees. Legal help in under 15 minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #F5C4B3, #E09278)',
                color: '#1A0A0D', fontWeight: 800, padding: '1.2rem 2.8rem',
                borderRadius: 16, textDecoration: 'none', fontSize: '1.05rem',
                boxShadow: '0 15px 40px rgba(245,196,179,0.3)', transition: 'all 0.25s ease'
              }} className="cta-btn">
                Find My Lawyer Now <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=lawyer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)',
                backdropFilter: 'blur(12px)', color: '#fff', fontWeight: 700,
                padding: '1.2rem 2.8rem', borderRadius: 16, textDecoration: 'none', fontSize: '1.05rem',
                transition: 'all 0.25s ease'
              }} className="cta-btn">
                Join as Advocate <ChevronRight size={18} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <BadgeCheck size={14} color="#4ADE80" />, t: 'Bar Council Verified' },
                { icon: <Lock size={14} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
                { icon: <Clock size={14} color="#60A5FA" />, t: '24/7 Available' },
                { icon: <Phone size={14} color="#F5C4B3" />, t: 'Emergency Line Active' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {b.icon}
                  <span style={{ fontSize: '.76rem', color: 'rgba(255,255,255,0.45)', fontWeight: 700 }}>{b.t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
