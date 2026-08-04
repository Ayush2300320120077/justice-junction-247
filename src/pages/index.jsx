import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ShieldCheck, Search, Star, Bot, BadgeCheck, Video,
  Lock, Clock, ArrowRight, ChevronRight, IndianRupee,
  CheckCircle2, MapPin, Activity, BarChart2, Calendar,
  Scale, FileText, Globe, Zap, Users, Phone,
  ChevronLeft, BookOpen, Diamond, ScrollText, Award,
  Building2, Gavel, Heart, MessageSquare, TrendingUp,
  UserCheck, AlertCircle
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER
═══════════════════════════════════════════════════════════ */
function Counter({ to, suffix = '', prefix = '', dur = 2400 }) {
  const [n, setN] = useState(0)
  const el = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        if (prefersReduced) { setN(to); return }
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

/* ═══════════════════════════════════════════════════════════
   TYPING HEADLINE
═══════════════════════════════════════════════════════════ */
const ROTATING_WORDS = ['Lawyer', 'Advocate', 'Criminal Lawyer', 'Family Lawyer', 'Property Lawyer', 'Corporate Lawyer']
function TypingWord() {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (prefersReduced.current) { setDisplay(ROTATING_WORDS[0]); return }
    const word = ROTATING_WORDS[idx]
    let timeout
    if (!deleting && display.length < word.length) {
      timeout = setTimeout(() => setDisplay(word.slice(0, display.length + 1)), 80)
    } else if (!deleting && display.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200)
    } else if (deleting && display.length > 0) {
      timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 40)
    } else if (deleting && display.length === 0) {
      setDeleting(false)
      setIdx((idx + 1) % ROTATING_WORDS.length)
    }
    return () => clearTimeout(timeout)
  }, [display, deleting, idx])

  return (
    <span style={{ color: 'var(--bur)', position: 'relative' }}>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', color: 'var(--bur)', marginLeft: 2 }}>|</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   REVEAL HOOK
═══════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.12) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    if (prefersReduced.current) { setVisible(true); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); io.disconnect() }
    }, { threshold })
    if (ref.current) io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, visible]
}

/* ═══════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════ */
const SPECS = ['Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law', 'Cyber Law', 'Taxation']

const AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, Sessions Court, Anticipatory Bail', bgImg: '/images/hero-courtroom.jpg' },
  { emoji: '👨‍👩‍👧', name: 'Family & Divorce', desc: 'Divorce, child custody, alimony, DV cases', bgImg: '/images/family-legal.jpg' },
  { emoji: '🏠', name: 'Property & RERA', desc: 'Title disputes, registry, builder fraud', bgImg: '/images/law-books.jpg' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, IP, compliance, M&A, startups', bgImg: '/images/ai-legal.jpg' },
  { emoji: '🛒', name: 'Consumer Rights', desc: 'Consumer forum, e-commerce, RERA, refunds', bgImg: '/images/supreme-court.jpg' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF, ESIC, factory act', bgImg: '/images/hero-scales.jpg' },
  { emoji: '💻', name: 'Cyber Law', desc: 'Online fraud, IT Act, cybercrime FIR, data breach', bgImg: '/images/ai-legal.jpg' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax notices, appeals', bgImg: '/images/law-books.jpg' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency same-day bail & FIR assistance', bgImg: '/images/hero-courtroom.jpg' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright, trade secrets', bgImg: '/images/law-books.jpg' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery suits, injunctions, declaratory relief', bgImg: '/images/supreme-court.jpg' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent, maintenance', bgImg: '/images/family-legal.jpg' },
]

const REVIEWS = [
  { init: 'RG', name: 'Rohit Gupta', city: 'Delhi', stars: 5, text: 'Found a criminal lawyer in 8 minutes at 11 PM. Paid exactly what was shown — ₹3,500. The real-time case update dashboard is genuinely brilliant.', role: 'Business Owner' },
  { init: 'AP', name: 'Anjali Patel', city: 'Mumbai', stars: 5, text: 'Divorce is already painful. Justice Junction made the legal side manageable. I knew every rupee before I spoke to anyone. Completely transparent.', role: 'Teacher' },
  { init: 'SK', name: 'Adv. Suresh Kumar', city: 'Bangalore', stars: 5, text: "As an advocate, I got 12 quality client bookings in my first month. The platform's pricing transparency builds trust before the first call.", role: 'Senior Advocate' },
  { init: 'KM', name: 'Karan Mehta', city: 'Hyderabad', stars: 5, text: 'After cyber fraud worth ₹2.4L, their specialist guided me step-by-step — FIR, bank freeze, recovery. Got 80% back in 6 weeks. Life-changing.', role: 'Software Engineer' },
  { init: 'MS', name: 'Meena Sharma', city: 'Jaipur', stars: 5, text: 'My property dispute was stuck for years. Found the right specialist in 10 minutes, consultation same evening, resolution in 4 months. Incredible.', role: 'Homemaker' },
  { init: 'VP', name: 'Vikash Patel', city: 'Ahmedabad', stars: 5, text: 'Needed a corporate lawyer urgently for a contract dispute. Booked in 3 minutes, video call within an hour. Case update feed is a game-changer.', role: 'Startup Founder' },
]

const NEWS = [
  { tag: 'Supreme Court', title: 'New guidelines on bail hearings to be heard within 24 hours in cognizable offences', date: 'July 2025' },
  { tag: 'Consumer Rights', title: 'NCDRC rules: E-commerce platforms liable for faulty product delivery compensation', date: 'June 2025' },
  { tag: 'Property Law', title: 'RERA amendments strengthen buyer rights against builder delays — new penalties', date: 'May 2025' },
  { tag: 'Cyber Law', title: 'IT Ministry updates data protection rules — new compliance requirements for businesses', date: 'April 2025' },
]

/* ═══════════════════════════════════════════════════════════
   HOME COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [reviewIdx, setReviewIdx] = useState(0)
  const [reviewPaused, setReviewPaused] = useState(false)
  const intervalRef = useRef(null)

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (query) p.set('query', query)
    navigate('/search?' + p.toString())
  }

  // Auto-advance carousel
  const startCarousel = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setReviewIdx(i => (i + 1) % REVIEWS.length)
    }, 5000)
  }, [])
  const stopCarousel = useCallback(() => { clearInterval(intervalRef.current) }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    if (!reviewPaused) startCarousel()
    else stopCarousel()
    return () => stopCarousel()
  }, [reviewPaused, startCarousel, stopCarousel])

  const handleCarouselKey = (e) => {
    if (e.key === 'ArrowLeft') { e.preventDefault(); setReviewIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length) }
    else if (e.key === 'ArrowRight') { e.preventDefault(); setReviewIdx(i => (i + 1) % REVIEWS.length) }
  }

  const [whyRef, whyVisible] = useReveal(0.08)
  const [newsRef, newsVisible] = useReveal(0.1)
  const [statsRef, statsVisible] = useReveal(0.1)

  return (
    <div style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: '#FDFBF7', color: '#1A1A1A' }}>
      <Helmet>
        <title>Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help</title>
        <meta name="description" content="India's #1 price-transparent legal marketplace. 1,338+ Bar Council verified advocates. AI matching, encrypted video calls, 24/7 emergency access." />
        <meta property="og:title" content="Justice Junction 24/7 — Find Verified Lawyers in India" />
        <meta property="og:description" content="India's first price-transparent legal platform. Bar Council verified, AI-powered, 24/7 emergency legal access." />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "LegalService",
          "name": "Justice Junction 24/7", "url": "https://justice-junction-app.vercel.app/",
          "areaServed": "India", "priceRange": "₹500–₹10,000",
          "provider": { "@type": "Organization", "name": "Justice Junction 24/7" }
        })}} />
      </Helmet>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Sora:wght@400;600;700;800;900&display=swap');

        :root {
          --bur: #7B1D2E;
          --bur-dark: #5C1521;
          --bur-light: #9B2D42;
          --bg-light: #FDFBF7;
          --bg-white: #FFFFFF;
          --text-main: #1A1A1A;
          --text-muted: #4A4A4A;
        }

        /* ── Core Keyframes ── */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes marqueeFlow { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        /* ── Staggered Hero Text ── */
        .hero-text-in { animation: fadeUp 0.8s cubic-bezier(.16,1,.3,1) both; }
        .hero-text-in:nth-child(1){animation-delay:0.1s}
        .hero-text-in:nth-child(2){animation-delay:0.25s}
        .hero-text-in:nth-child(3){animation-delay:0.40s}
        .hero-text-in:nth-child(4){animation-delay:0.55s}
        .hero-text-in:nth-child(5){animation-delay:0.70s}
        .hero-text-in:nth-child(6){animation-delay:0.85s}

        /* ── Practice Area Cards ── */
        .area-card { 
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; 
          border: 1px solid rgba(123,29,46,0.1);
          background: var(--bg-white);
        }
        .area-card:hover { 
          transform: translateY(-8px); 
          box-shadow: 0 20px 40px rgba(123,29,46,0.08); 
          border-color: rgba(123,29,46,0.3);
        }
        .area-card-icon {
          transition: transform 0.3s ease, background 0.3s ease;
          background: rgba(123,29,46,0.05);
        }
        .area-card:hover .area-card-icon {
          transform: scale(1.1);
          background: rgba(123,29,46,0.1);
        }

        /* ── Tool Cards ── */
        .tool-card { 
          transition: all 0.3s cubic-bezier(.23,1,.32,1); 
          border: 1px solid rgba(0,0,0,0.05);
          background: var(--bg-white);
        }
        .tool-card:hover { 
          transform: translateY(-6px); 
          box-shadow: 0 16px 32px rgba(123,29,46,0.08); 
          border-color: var(--bur); 
        }

        /* ── Why Cards ── */
        .why-card { 
          transition: box-shadow 0.3s ease, border-color 0.3s ease, transform 0.3s ease; 
          border: 1px solid rgba(0,0,0,0.05);
          background: var(--bg-white);
        }
        .why-card:hover { 
          border-color: rgba(123,29,46,0.2); 
          box-shadow: 0 12px 30px rgba(123,29,46,0.06); 
          transform: translateY(-4px);
        }
        .why-card.revealed { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both; }

        /* ── Misc UI ── */
        .cta-btn { transition: all 0.25s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px rgba(123,29,46,0.25); }
        .review-dot { transition: all 0.3s ease; }
        .review-dot.active { transform: scale(1.3); background: var(--bur) !important; }
        .news-card { transition: all 0.28s ease; background: var(--bg-white); border: 1px solid rgba(0,0,0,0.05); }
        .news-card:hover { border-color: rgba(123,29,46,0.3); transform: translateY(-3px); box-shadow: 0 12px 30px rgba(123,29,46,0.08); }

        /* ── Scrolling Marquee ── */
        .marquee-track { animation: marqueeFlow 40s linear infinite; }

        /* ── Responsive Container ── */
        .container { padding-left: 1.5rem; padding-right: 1.5rem; max-width: 1280px; margin: 0 auto; width: 100%; }
        @media (min-width: 640px)  { .container { padding-left: 2rem; padding-right: 2rem; } }
        @media (min-width: 1024px) { .container { padding-left: 2.5rem; padding-right: 2.5rem; } }

        /* ── Responsive Grid Classes ── */
        .grid-areas { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .grid-areas { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid-areas { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }

        .grid-tools { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .grid-tools { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid-tools { grid-template-columns: repeat(4, 1fr); gap: 1.5rem; } }

        .grid-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        @media (min-width: 768px) { .grid-stats { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .grid-stats { grid-template-columns: repeat(5, 1fr); } }

        .grid-why { display: grid; grid-template-columns: 1fr; gap: 1.5rem; }
        @media (min-width: 768px) { .grid-why { grid-template-columns: repeat(2, 1fr); } }

        .grid-news { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        @media (min-width: 640px) { .grid-news { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .grid-news { grid-template-columns: repeat(4, 1fr); } }

        /* Mobile tweaks */
        @media (max-width: 640px) {
          .hero-search-box { flex-direction: column !important; padding: 12px !important; border-radius: 16px !important; }
          .hero-search-divider { display: none !important; }
          .hero-title { font-size: 2.8rem !important; }
          section { padding-top: 4rem !important; padding-bottom: 4rem !important; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
          .hero-text-in, .why-card.revealed { opacity: 1 !important; transform: none !important; }
        }
      `}} />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — PREMIUM LIGHT HERO
      ══════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '92vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 100, background: 'var(--bg-light)', borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        {/* Subtle background abstract shapes for depth */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(123,29,46,0.04) 0%, transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-15%', left: '-10%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,182,120,0.08) 0%, transparent 70%)', zIndex: 0 }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, maxWidth: 1280 }}>
          
          <div className="hero-text-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-white)',
            border: '1px solid rgba(123,29,46,0.15)',
            borderRadius: 40, padding: '6px 16px',
            marginBottom: '2rem',
            boxShadow: '0 4px 12px rgba(123,29,46,0.05)'
          }}>
            <div style={{ position: 'relative', width: 8, height: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
              <div style={{ position: 'absolute', inset: -4, borderRadius: '50%', border: '1.5px solid #10B981', animation: 'pulseRing 2s ease-out infinite' }} />
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--bur)', letterSpacing: '1px', textTransform: 'uppercase' }}>
              India's #1 Transparent Legal Platform
            </span>
          </div>

          <h1 className="hero-text-in hero-title" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(3rem, 5vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
            color: 'var(--text-main)', marginBottom: '1.5rem',
            maxWidth: 700
          }}>
            Find Your <TypingWord />
            <br />
            <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>Anytime. Anywhere.</span>
          </h1>

          <p className="hero-text-in" style={{
            fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, lineHeight: 1.6,
            marginBottom: '3rem', fontWeight: 500
          }}>
            Book top-rated, Bar Council verified advocates across India. 
            <strong style={{ color: 'var(--text-main)' }}> 100% transparent pricing. </strong> 
            No hidden fees. Encrypted video consultations within minutes.
          </p>

          {/* Clean, high-contrast Search Bar */}
          <div className="hero-text-in hero-search-box" style={{
            background: 'var(--bg-white)',
            borderRadius: 60,
            padding: '8px 8px 8px 24px',
            marginBottom: '3rem',
            maxWidth: 800,
            display: 'flex', alignItems: 'center', gap: 16,
            border: '1px solid rgba(0,0,0,0.08)',
            boxShadow: '0 16px 40px -12px rgba(123,29,46,0.12)'
          }}>
            
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <Scale size={20} color="var(--bur)" />
              <div style={{ width: '100%' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Legal Issue</label>
                <select 
                  value={spec} onChange={e => setSpec(e.target.value)}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', outline: 'none', cursor: 'pointer' }}
                >
                  <option value="">What do you need help with?</option>
                  {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="hero-search-divider" style={{ width: 1, height: 40, background: 'rgba(0,0,0,0.1)' }} />

            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
              <MapPin size={20} color="var(--bur)" />
              <div style={{ width: '100%' }}>
                <label style={{ display: 'block', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>Location</label>
                <input 
                  type="text" placeholder="Delhi, Mumbai, 110001..." 
                  value={query} onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && goSearch()}
                  style={{ width: '100%', border: 'none', background: 'transparent', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', outline: 'none' }}
                />
              </div>
            </div>

            <button onClick={goSearch} className="cta-btn" style={{
              background: 'var(--bur)', color: '#fff', border: 'none', borderRadius: 50,
              padding: '0 32px', height: 56, fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
            }}>
              <Search size={18} /> Search
            </button>
          </div>

          <div className="hero-text-in" style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: -10 }}>
              <img src="https://i.pravatar.cc/100?img=1" alt="User" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #fff', zIndex: 3, objectFit: 'cover' }} />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #fff', zIndex: 2, objectFit: 'cover', marginLeft: '-12px' }} />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" style={{ width: 40, height: 40, borderRadius: '50%', border: '2px solid #fff', zIndex: 1, objectFit: 'cover', marginLeft: '-12px' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', gap: 4, color: '#F59E0B' }}>
                <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)' }}>4.9/5 from 10,000+ clients</span>
            </div>
          </div>
          
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — STATS BAND
      ══════════════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: 'var(--bg-white)', padding: '4rem 0', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <div className="grid-stats">
            {[
              { num: 1338, suf: '+', label: 'Verified Advocates', icon: ShieldCheck },
              { num: 100, suf: '+', label: 'Cities Covered', icon: MapPin },
              { num: 15, suf: 'M', label: 'Minutes to Consult', icon: Clock },
              { num: 50, suf: 'K+', label: 'Cases Handled', icon: FileText },
              { num: 100, suf: '%', label: 'Transparent Pricing', icon: IndianRupee },
            ].map((s, i) => (
              <div key={i} style={{ 
                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                padding: '1.5rem', background: 'var(--bg-light)', borderRadius: 16, border: '1px solid rgba(0,0,0,0.03)',
                animation: statsVisible ? `fadeUp 0.5s ease forwards ${i * 0.1}s` : 'none', opacity: 0, transform: 'translateY(20px)'
              }}>
                <s.icon size={28} color="var(--bur)" style={{ marginBottom: 12, opacity: 0.9 }} />
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-number)', lineHeight: 1 }}>
                  {statsVisible ? <Counter to={s.num} suffix={s.suf} /> : '0'}
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — PRACTICE AREAS
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Specialized Legal Expertise</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600, margin: '0 auto' }}>Find experienced advocates tailored to your exact legal situation.</p>
          </div>
          
          <div className="grid-areas">
            {AREAS.map((a, i) => (
              <Link to={`/search?specialization=${encodeURIComponent(a.name)}`} key={i} className="area-card" style={{
                display: 'flex', flexDirection: 'column', padding: '2rem', borderRadius: 20, textDecoration: 'none'
              }}>
                <div className="area-card-icon" style={{ 
                  width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: 20
                }}>
                  {a.emoji}
                </div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{a.name}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>{a.desc}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--bur)', fontWeight: 600, fontSize: '0.85rem' }}>
                  Find Lawyers <ArrowRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — LEGAL TOOLS & AI
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-white)', borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(123,29,46,0.08)', color: 'var(--bur)', padding: '6px 12px', borderRadius: 20, fontSize: '0.8rem', fontWeight: 700, marginBottom: 16 }}>
              <Zap size={14} fill="currentColor" /> SUPERCHARGE YOUR CASE
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Smart Legal Tools</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600 }}>Empowering you with AI and automation before you even speak to a lawyer.</p>
          </div>

          <div className="grid-tools">
            {[
              { icon: Bot, title: 'AI Legal Assistant', desc: 'Ask complex legal queries and get instant, citations-backed answers 24/7.', link: '/ai-assistant', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)' },
              { icon: Scale, title: 'AI Case Classifier', desc: 'Not sure what kind of lawyer you need? Our AI analyzes your situation instantly.', link: '/ai-classifier', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)' },
              { icon: FileText, title: 'Document Generator', desc: 'Draft NDAs, rental agreements, and notices instantly with our smart templates.', link: '/documents', color: '#10B981', bg: 'rgba(16,185,129,0.1)' },
              { icon: BookOpen, title: 'Knowledge Hub', desc: 'Read comprehensive guides on your rights, court procedures, and legal terms.', link: '/knowledge-hub', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)' }
            ].map((t, i) => (
              <Link key={i} to={t.link} className="tool-card" style={{
                padding: '2rem', borderRadius: 24, textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'flex-start'
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 16, background: t.bg, color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <t.icon size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 10 }}>{t.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{t.desc}</p>
                <div style={{ color: t.color, fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
                  Try Now <ArrowRight size={16} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — WHY CHOOSE US (Trust features)
      ══════════════════════════════════════════════════════ */}
      <section ref={whyRef} style={{ padding: '6rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>The Justice Junction Advantage</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: 600 }}>We built this platform to fix everything that's broken about finding legal help in India.</p>
          </div>

          <div className="grid-why">
            {[
              { icon: IndianRupee, title: '100% Transparent Pricing', desc: 'No hidden retainer fees. Every lawyer lists their exact consultation and hearing fees upfront. You pay exactly what you see.' },
              { icon: BadgeCheck, title: 'Bar Council Verified', desc: 'Every advocate undergoes strict KYC and Bar Council registration verification. We only list practicing, legitimate lawyers.' },
              { icon: Video, title: 'Secure Virtual Consultations', desc: 'Consult top lawyers from any city via end-to-end encrypted video calls. Built-in document sharing and recording options.' },
              { icon: Activity, title: 'Live Case Tracking Dashboard', desc: 'Once hired, track your case progress, upcoming hearings, and uploaded documents in your personal dashboard.' }
            ].map((f, i) => (
              <div key={i} className={`why-card ${whyVisible ? 'revealed' : ''}`} style={{
                display: 'flex', gap: '1.5rem', padding: '2rem', borderRadius: 20, animationDelay: `${i * 0.15}s`
              }}>
                <div style={{ 
                  width: 64, height: 64, borderRadius: 16, background: 'rgba(123,29,46,0.06)', color: 'var(--bur)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                }}>
                  <f.icon size={30} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS (Marquee & Carousel)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-white)', overflow: 'hidden' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '0 1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 16 }}>Trusted by Thousands</h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Real stories from clients who found justice through our platform.</p>
        </div>

        {/* Marquee row */}
        <div style={{ display: 'flex', width: '200%', transform: 'translate3d(0,0,0)' }} className="marquee-track"
             onMouseEnter={() => setReviewPaused(true)} onMouseLeave={() => setReviewPaused(false)}>
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <div key={i} style={{
              width: '400px', flexShrink: 0, padding: '2rem', margin: '0 1rem',
              background: 'var(--bg-light)', borderRadius: 20, border: '1px solid rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', gap: '1rem'
            }}>
              <div style={{ display: 'flex', gap: 4, color: '#F59E0B' }}>
                {[...Array(r.stars)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
              </div>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: 1.6, flex: 1 }}>"{r.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: '1rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.1rem' }}>
                  {r.init}
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)' }}>{r.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{r.role}, {r.city}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — LEGAL NEWS
      ══════════════════════════════════════════════════════ */}
      <section ref={newsRef} style={{ padding: '6rem 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 800, color: 'var(--text-main)', marginBottom: 8 }}>Legal Updates</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Stay informed with the latest legal rulings and news.</p>
            </div>
            <Link to="/knowledge-hub" className="cta-btn" style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 20px', 
              background: 'transparent', border: '1px solid rgba(123,29,46,0.3)', color: 'var(--bur)', 
              borderRadius: 8, fontWeight: 600, textDecoration: 'none' 
            }}>
              View All News <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid-news">
            {NEWS.map((n, i) => (
              <div key={i} className="news-card" style={{
                padding: '2rem', borderRadius: 20, display: 'flex', flexDirection: 'column'
              }}>
                <span style={{ 
                  display: 'inline-block', padding: '4px 10px', background: 'rgba(123,29,46,0.08)', 
                  color: 'var(--bur)', fontSize: '0.75rem', fontWeight: 700, borderRadius: 6, marginBottom: 16, width: 'fit-content' 
                }}>
                  {n.tag}
                </span>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-main)', lineHeight: 1.5, marginBottom: 'auto' }}>
                  {n.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: 24, fontWeight: 500 }}>
                  <Calendar size={14} /> {n.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — FINAL CALL TO ACTION (DUAL)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '6rem 0', background: 'var(--bg-white)', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
        <div className="container">
          <div style={{ 
            background: 'var(--bur)', borderRadius: 32, overflow: 'hidden', 
            display: 'flex', flexWrap: 'wrap', position: 'relative'
          }}>
            {/* Soft decorative background circles */}
            <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(0,0,0,0.1)', pointerEvents: 'none' }} />

            {/* Client Side */}
            <div style={{ flex: '1 1 400px', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: 16, marginBottom: 24, color: '#fff' }}>
                <Search size={32} />
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Need Legal Help?</h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>Find the right advocate, compare transparent pricing, and book an instant secure consultation.</p>
              <Link to="/search" className="cta-btn" style={{ 
                background: '#fff', color: 'var(--bur)', padding: '16px 32px', borderRadius: 12, 
                fontWeight: 700, fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' 
              }}>
                Find a Lawyer <ArrowRight size={18} />
              </Link>
            </div>

            {/* Divider */}
            <div style={{ width: 1, background: 'rgba(255,255,255,0.15)' }} />

            {/* Lawyer Side */}
            <div style={{ flex: '1 1 400px', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
              <div style={{ background: 'rgba(255,255,255,0.15)', padding: '12px', borderRadius: 16, marginBottom: 24, color: '#fff' }}>
                <Gavel size={32} />
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', marginBottom: 16, lineHeight: 1.1 }}>Are You an Advocate?</h2>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: 32, lineHeight: 1.6 }}>Join India's fastest-growing legal network. Digitize your practice, gain verified clients, and guarantee payments.</p>
              <Link to="/join-as-lawyer" className="cta-btn" style={{ 
                background: 'transparent', color: '#fff', border: '2px solid rgba(255,255,255,0.4)', padding: '14px 32px', borderRadius: 12, 
                fontWeight: 700, fontSize: '1.1rem', display: 'inline-flex', alignItems: 'center', gap: 8, textDecoration: 'none' 
              }}>
                Join the Network <ChevronRight size={18} />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
