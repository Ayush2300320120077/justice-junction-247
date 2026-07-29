import { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ShieldCheck, Search, Star, Bot, BadgeCheck, Video,
  Lock, Clock, ArrowRight, ChevronRight, IndianRupee,
  CheckCircle2, MapPin, Activity, BarChart2, Calendar,
  Scale, FileText, Globe, Zap, Users, Phone,
  ChevronLeft, BookOpen, Diamond, ScrollText
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════
   ANIMATED COUNTER — counts up when scrolled into view
═══════════════════════════════════════════════════════════ */
function Counter({ to, suffix = '', prefix = '', dur = 2200 }) {
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
   TYPING HEADLINE — cycles through lawyer types
═══════════════════════════════════════════════════════════ */
const ROTATING_WORDS = ['Lawyer', 'Advocate', 'Criminal Lawyer', 'Family Lawyer', 'Property Lawyer']
function TypingWord() {
  const [idx, setIdx] = useState(0)
  const [display, setDisplay] = useState('')
  const [deleting, setDeleting] = useState(false)
  const prefersReduced = useRef(
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )

  useEffect(() => {
    if (prefersReduced.current) {
      setDisplay(ROTATING_WORDS[0])
      return
    }
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
    <span style={{ color: '#F5C4B3', position: 'relative' }}>
      {display}
      <span style={{
        animation: 'blink 1s step-end infinite',
        color: '#F5C4B3', marginLeft: 2
      }}>|</span>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   SEARCH DEMO — animated cycling placeholder text
═══════════════════════════════════════════════════════════ */
const SEARCH_EXAMPLES = [
  'Property dispute in Mumbai',
  'Divorce lawyer in Delhi',
  'Contract review in Bangalore',
  'Bail matter in Chennai',
  'Cyber fraud in Pune',
  'Labour dispute in Hyderabad',
]
function SearchDemo() {
  const [idx, setIdx] = useState(0)
  const [visible, setVisible] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % SEARCH_EXAMPLES.length)
        setVisible(true)
      }, 400)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      background: 'var(--cream)',
      padding: '5rem 0',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{
            display: 'inline-block',
            background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
            fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
            textTransform: 'uppercase', padding: '.38rem .9rem',
            borderRadius: 6, marginBottom: '1rem'
          }}>Search Lawyers Instantly</div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans',sans-serif",
            fontSize: 'clamp(1.6rem,3.2vw,2.4rem)',
            fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em',
            marginBottom: '.75rem'
          }}>
            Tell us your legal situation —<br />
            <span style={{ color: 'var(--bur)' }}>we'll find the right advocate.</span>
          </h2>
          <p style={{
            color: 'var(--txt-3)', fontSize: '1rem',
            maxWidth: 500, margin: '0 auto', lineHeight: 1.7
          }}>
            Searched by 10,000+ Indians. Results in under 10 seconds.
          </p>
        </div>

        {/* Interactive demo search bar */}
        <div style={{
          maxWidth: 720, margin: '0 auto',
          background: '#fff',
          borderRadius: 18, padding: '8px',
          boxShadow: '0 8px 40px rgba(123,29,46,0.10), 0 0 0 1px var(--border)',
          display: 'flex', alignItems: 'center', gap: 0
        }}>
          <div style={{
            flex: 1, padding: '14px 20px', display: 'flex',
            alignItems: 'center', gap: 12, minWidth: 0
          }}>
            <Search size={18} color="var(--bur)" style={{ flexShrink: 0 }} />
            <span style={{
              fontSize: '1rem', fontWeight: 600,
              color: visible ? 'var(--txt-3)' : 'transparent',
              transition: 'color 0.35s ease',
              whiteSpace: 'nowrap', overflow: 'hidden',
              textOverflow: 'ellipsis', display: 'block'
            }}>
              {SEARCH_EXAMPLES[idx]}
            </span>
          </div>
          <Link
            to="/search"
            style={{
              background: 'linear-gradient(135deg, var(--bur) 0%, var(--bur-d) 100%)',
              color: '#fff', border: 'none', borderRadius: 12,
              padding: '.9rem 1.8rem', fontWeight: 800, fontSize: '.95rem',
              cursor: 'pointer', flexShrink: 0,
              boxShadow: '0 4px 16px rgba(123,29,46,0.35)',
              display: 'flex', alignItems: 'center', gap: 8,
              whiteSpace: 'nowrap', textDecoration: 'none',
              transition: 'all 0.25s ease'
            }}
          >
            Search Lawyers <ArrowRight size={16} />
          </Link>
        </div>

        {/* Quick topic chips */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap',
          justifyContent: 'center', marginTop: '1.5rem'
        }}>
          {['Criminal Defence', 'Family Law', 'Property', 'Corporate', 'Consumer Rights', 'Cyber Law'].map(t => (
            <Link
              key={t}
              to={`/search?specialization=${encodeURIComponent(t)}`}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                background: 'rgba(123,29,46,0.06)', color: 'var(--bur)',
                border: '1px solid rgba(123,29,46,0.15)',
                borderRadius: 30, padding: '.32rem .9rem',
                fontSize: '.78rem', fontWeight: 700, textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              {t}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   REVEAL HOOK — IntersectionObserver for scroll animations
═══════════════════════════════════════════════════════════ */
function useReveal(threshold = 0.15) {
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
   PRACTICE AREA DATA — CSS gradient cards, no hotlinks
═══════════════════════════════════════════════════════════ */
const AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, Sessions Court, Anticipatory Bail', grad: 'linear-gradient(135deg,#3D0E16,#7B1D2E)', bgImg: '/images/proof-courtroom.jpg' },
  { emoji: '👨‍👩‍👧', name: 'Family & Divorce', desc: 'Divorce, child custody, alimony, DV cases', grad: 'linear-gradient(135deg,#1A0A0D,#4A1A28)', bgImg: '/images/proof-consultation.jpg' },
  { emoji: '🏠', name: 'Property & RERA', desc: 'Title disputes, registry, builder fraud', grad: 'linear-gradient(135deg,#2D1B0E,#6B3A1F)', bgImg: '/office-bg.png' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, IP, compliance, M&A, startups', grad: 'linear-gradient(135deg,#0D1B2A,#1E3A5F)', bgImg: '/abstract-bg.png' },
  { emoji: '🛒', name: 'Consumer Rights', desc: 'Consumer forum, e-commerce, RERA, refunds', grad: 'linear-gradient(135deg,#0A2E1A,#1A6B3A)', bgImg: '/search-bg.png' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF, ESIC, factory act', grad: 'linear-gradient(135deg,#1E1A0A,#6B5A1A)', bgImg: '/mission-bg.png' },
  { emoji: '💻', name: 'Cyber Law', desc: 'Online fraud, IT Act, cybercrime FIR, data breach', grad: 'linear-gradient(135deg,#0A0D2E,#1A246B)', bgImg: '/auth-bg.png' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax notices, appeals', grad: 'linear-gradient(135deg,#1A2E0A,#3A6B1A)', bgImg: '/justice-bg.png' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency same-day bail & FIR assistance', grad: 'linear-gradient(135deg,#3D0E16,#7B1D2E)', bgImg: '/images/proof-courtroom.jpg' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright, trade secrets', grad: 'linear-gradient(135deg,#2E1A0A,#6B3A1A)', bgImg: '/abstract-bg.png' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery suits, injunctions, declaratory relief', grad: 'linear-gradient(135deg,#0A1A2E,#1A3A6B)', bgImg: '/office-bg.png' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent, maintenance', grad: 'linear-gradient(135deg,#1A0A0D,#4A1A28)', bgImg: '/images/proof-consultation.jpg' },
]

/* ═══════════════════════════════════════════════════════════
   REVIEWS DATA — // TODO: replace with real testimonials
═══════════════════════════════════════════════════════════ */
const REVIEWS = [
  { init: 'RG', name: 'Rohit Gupta', city: 'Delhi', stars: 5, text: 'Found a criminal lawyer in 8 minutes at 11 PM. Paid exactly what was shown — ₹3,500. The real-time case update dashboard is genuinely brilliant.' },
  { init: 'AP', name: 'Anjali Patel', city: 'Mumbai', stars: 5, text: 'Divorce is already painful. Justice Junction made the legal side manageable. I knew every rupee before I spoke to anyone. Completely transparent.' },
  { init: 'SK', name: 'Adv. Suresh Kumar', city: 'Bangalore', stars: 5, text: "As an advocate, I got 12 quality client bookings in my first month. The platform's pricing transparency builds trust before the first call." },
  { init: 'KM', name: 'Karan Mehta', city: 'Hyderabad', stars: 5, text: 'After cyber fraud worth ₹2.4L, their specialist guided me step-by-step — FIR, bank freeze, recovery. Got 80% back in 6 weeks. Life-changing.' },
  { init: 'MS', name: 'Meena Sharma', city: 'Jaipur', stars: 5, text: 'My property dispute was stuck for years. Found the right specialist in 10 minutes, consultation same evening, resolution in 4 months. Incredible.' },
  { init: 'VP', name: 'Vikash Patel', city: 'Ahmedabad', stars: 5, text: 'Needed a corporate lawyer urgently for a contract dispute. Booked in 3 minutes, video call within an hour. Case update feed is a game-changer.' },
]

const SPECS = ['Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law', 'Cyber Law', 'Taxation']

/* ═══════════════════════════════════════════════════════════
   HOME COMPONENT
═══════════════════════════════════════════════════════════ */
export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const [vidReady, setVidReady] = useState(false)

  /* Testimonials carousel state */
  const [reviewIdx, setReviewIdx] = useState(0)
  const [reviewPaused, setReviewPaused] = useState(false)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (query) p.set('query', query)
    navigate('/search?' + p.toString())
  }

  /* Auto-advance carousel */
  const startCarousel = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setReviewIdx(i => (i + 1) % REVIEWS.length)
    }, 5000)
  }, [])

  const stopCarousel = useCallback(() => {
    clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return
    if (!reviewPaused) startCarousel()
    else stopCarousel()
    return () => stopCarousel()
  }, [reviewPaused, startCarousel, stopCarousel])

  /* Carousel keyboard nav — scoped to container (tabIndex={0}) */
  const handleCarouselKey = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      setReviewIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length)
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      setReviewIdx(i => (i + 1) % REVIEWS.length)
    }
  }

  /* Why JJ reveal */
  const [whyRef, whyVisible] = useReveal(0.1)

  return (
    <div style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden', background: 'var(--cream)' }}>
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
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes floatUp { 0%{opacity:0;transform:translateY(30px)} 100%{opacity:1;transform:translateY(0)} }
        @keyframes pulseGlow { 0%,100%{box-shadow:0 0 0 0 rgba(245,196,179,0)} 50%{box-shadow:0 0 0 8px rgba(245,196,179,0.08)} }
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes countBand { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }

        /* Background & Hero Animations */
        @keyframes meshDrift {
          0%   { transform: scale(1.0) translate(0px, 0px) rotate(0deg); }
          33%  { transform: scale(1.08) translate(-25px, 18px) rotate(2deg); }
          66%  { transform: scale(1.04) translate(20px, -22px) rotate(-1.5deg); }
          100% { transform: scale(1.0) translate(0px, 0px) rotate(0deg); }
        }
        @keyframes gridDrift {
          0%   { background-position: 0px 0px; }
          100% { background-position: 48px 48px; }
        }
        @keyframes heroFloatRotate {
          0%, 100% { transform: translateY(-50%) translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-50%) translateY(-20px) rotate(2.5deg); }
        }
        @keyframes marqueeSeamless {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        .hero-text-in { animation: floatUp 0.9s cubic-bezier(.23,1,.32,1) both; }
        .hero-text-in:nth-child(1){animation-delay:0.1s}
        .hero-text-in:nth-child(2){animation-delay:0.25s}
        .hero-text-in:nth-child(3){animation-delay:0.4s}
        .hero-text-in:nth-child(4){animation-delay:0.55s}
        .hero-text-in:nth-child(5){animation-delay:0.7s}
        .area-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 50px rgba(0,0,0,0.4) !important; }
        .area-card:hover .area-card-bg { transform: scale(1.12); }
        .area-card:hover .area-overlay { opacity: 1 !important; }
        .area-card:hover .area-emoji { transform: scale(1.2) !important; }
        .tool-card:hover { transform: translateY(-5px) !important; box-shadow: 0 20px 50px rgba(123,29,46,0.14) !important; border-color: var(--bur) !important; }
        .why-card.revealed { animation: revealUp 0.55s cubic-bezier(.23,1,.32,1) both; }
        .search-demo-link:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(123,29,46,0.45) !important; }
        .area-chip:hover { background: rgba(123,29,46,0.12) !important; }
        .step-icon-wrap:hover { transform: scale(1.06); }
        .cta-btn:hover { transform: translateY(-2px); }
        .review-dot { transition: all 0.3s ease; }
        .review-dot.active { background: var(--bur) !important; transform: scale(1.3); }
        .carousel-card { transition: opacity 0.45s ease, transform 0.45s ease; }

        @media (max-height: 900px) {
          .hero-section {
            padding-top: 100px !important;
            padding-bottom: 120px !important;
            justify-content: flex-start !important;
          }
        }
        @media (max-height: 800px) {
          .hero-section {
            padding-top: 90px !important;
            padding-bottom: 130px !important;
          }
        }

        @media (max-width: 640px) {
          .hero-dual-cta { flex-direction: column !important; }
          .hero-dual-cta a, .hero-dual-cta button { width: 100% !important; justify-content: center !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .search-row { flex-direction: column !important; }
        }
        @media (max-width: 768px) {
          .step-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .area-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 480px) {
          .area-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          .tools-grid { grid-template-columns: repeat(2,1fr) !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
          .lawyer-split { grid-template-columns: 1fr !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
          .hero-text-in { animation: none !important; opacity: 1 !important; }
          .why-card.revealed { animation: none !important; opacity: 1 !important; }
          .hero-bg-mesh { animation: none !important; }
          .hero-bg-grid { animation: none !important; }
          .hero-accent-svg { animation: none !important; }
          .marquee-track { animation: none !important; }
        }
      `}} />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — HERO: Layered Animated Code-Based Background
      ══════════════════════════════════════════════════════ */}
      <section className="hero-section" style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        paddingTop: 80, background: 'var(--bur-darker)'
      }}>
        {/* Layer 1: Base mesh/blob gradient background */}
        <div
          className="hero-bg-mesh"
          style={{
            position: 'absolute', inset: '-10%', zIndex: 0,
            background: `
              radial-gradient(circle at 15% 25%, rgba(123,29,46,0.70) 0%, rgba(61,14,22,0.40) 50%, transparent 80%),
              radial-gradient(circle at 85% 20%, rgba(158,42,63,0.55) 0%, rgba(92,21,33,0.25) 55%, transparent 75%),
              radial-gradient(circle at 50% 85%, rgba(61,14,22,0.80) 0%, rgba(26,10,13,0.50) 60%, transparent 85%),
              radial-gradient(circle at 70% 65%, rgba(245,196,179,0.14) 0%, rgba(123,29,46,0.25) 45%, transparent 70%)
            `,
            animation: 'meshDrift 22s ease-in-out infinite',
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />

        {/* Layer 2: Faint animated dot-grid pattern overlay */}
        <div
          className="hero-bg-grid"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            backgroundImage: `radial-gradient(var(--blush-light) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.05,
            animation: 'gridDrift 25s linear infinite',
            pointerEvents: 'none'
          }}
        />

        {/* Layer 3: Accent Scales of Justice Line-Art Illustration */}
        <div
          className="hero-accent-svg"
          style={{
            position: 'absolute', right: '3%', top: '48%',
            width: 'clamp(320px, 42vw, 560px)', height: 'clamp(320px, 42vw, 560px)',
            zIndex: 2, opacity: 0.10, pointerEvents: 'none',
            animation: 'heroFloatRotate 10s ease-in-out infinite'
          }}
        >
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* Base Stand & Pillar */}
            <path d="M160 370 H240 M200 370 V70 M130 370 H270" stroke="var(--blush-light)" strokeWidth="3" strokeLinecap="round" />
            <path d="M190 80 H210 M185 70 L200 40 L215 70 Z" stroke="var(--blush-light)" strokeWidth="2.5" fill="none" />

            {/* Main Beam */}
            <path d="M60 120 C130 110, 270 110, 340 120" stroke="var(--blush-light)" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="200" cy="115" r="8" stroke="var(--blush-light)" strokeWidth="2.5" />
            <circle cx="60" cy="120" r="5" stroke="var(--blush-light)" strokeWidth="2" />
            <circle cx="340" cy="120" r="5" stroke="var(--blush-light)" strokeWidth="2" />

            {/* Left Scale Strings & Pan */}
            <path d="M60 120 L25 210 M60 120 L95 210" stroke="var(--blush-light)" strokeWidth="2" />
            <path d="M15 210 C15 245, 105 245, 105 210 Z" stroke="var(--blush-light)" strokeWidth="2.5" fill="none" />
            <path d="M15 210 H105" stroke="var(--blush-light)" strokeWidth="2" />

            {/* Right Scale Strings & Pan */}
            <path d="M340 120 L305 210 M340 120 L375 210" stroke="var(--blush-light)" strokeWidth="2" />
            <path d="M295 210 C295 245, 385 245, 385 210 Z" stroke="var(--blush-light)" strokeWidth="2.5" fill="none" />
            <path d="M295 210 H385" stroke="var(--blush-light)" strokeWidth="2" />

            {/* Fine Courthouse Column Lines Background Motif */}
            <path d="M180 130 V350 M220 130 V350 M170 350 H230 M170 130 H230" stroke="var(--blush-light)" strokeWidth="1" strokeDasharray="4 4" />
          </svg>
        </div>

        {/* Depth gradients & bottom fade transition */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'radial-gradient(ellipse at 60% 50%, rgba(123,29,46,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 220, zIndex: 2,
          background: 'linear-gradient(to bottom, transparent, var(--cream))',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{
          position: 'relative', zIndex: 3,
          padding: '5rem 0 clamp(7rem, 14vh, 10rem)',
          maxWidth: 1280
        }}>

          {/* Live badge */}
          <div className="hero-text-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,196,179,0.10)',
            border: '1px solid rgba(245,196,179,0.25)',
            borderRadius: 40, padding: '.38rem 1.1rem',
            marginBottom: '1.8rem', backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
              animation: 'pulseGlow 2s infinite'
            }} />
            <span style={{
              fontSize: '.72rem', fontWeight: 800, color: 'var(--blush-light)',
              letterSpacing: '2.5px', textTransform: 'uppercase'
            }}>
              Live · India's #1 Legal Marketplace · 24/7 Legal Access
            </span>
          </div>

          {/* Headline */}
          <h1 className="hero-text-in" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)',
            fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.045em',
            color: '#fff', marginBottom: '1.5rem', maxWidth: 900
          }}>
            Find Your <TypingWord /><br />
            <span style={{
              fontStyle: 'italic', fontWeight: 700,
              fontSize: '0.88em', color: 'rgba(255,255,255,0.82)'
            }}>
              — Anytime. Anywhere in India.
            </span>
          </h1>

          {/* Sub-headline */}
          <p className="hero-text-in" style={{
            fontSize: 'clamp(.95rem, 1.5vw, 1.18rem)',
            color: 'rgba(249,238,228,0.85)', maxWidth: 620, lineHeight: 1.85,
            marginBottom: '2.5rem', fontWeight: 400
          }}>
            India's first 100% price-transparent legal marketplace.{' '}
            <strong style={{ color: 'var(--blush-light)', fontWeight: 700 }}>1,338+ Bar Council verified advocates</strong> across{' '}
            <strong style={{ color: 'var(--blush-light)', fontWeight: 700 }}>100+ cities</strong>. Instant booking.
            Encrypted video calls. AI-powered matching. Available 24/7.
          </p>

          {/* Hero search box */}
          <div className="hero-text-in" style={{
            background: 'rgba(255,255,255,0.97)', borderRadius: 22,
            padding: '10px', marginBottom: '2rem', maxWidth: 780,
            boxShadow: '0 24px 80px rgba(0,0,0,0.28), 0 0 0 1px rgba(232,201,168,0.5)'
          }}>
            <div className="search-row" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ flex: '1 1 220px', padding: '12px 20px', minWidth: 0 }}>
                <label htmlFor="hero-issue-sel" style={{
                  display: 'block', fontSize: '.62rem', fontWeight: 900,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '2px', marginBottom: 5
                }}>Legal Issue</label>
                <select
                  id="hero-issue-sel"
                  style={{
                    border: 'none', background: 'none', fontSize: '.97rem',
                    fontWeight: 700, color: 'var(--txt)', outline: 'none',
                    cursor: 'pointer', width: '100%', padding: 0
                  }}
                  value={spec} onChange={e => setSpec(e.target.value)}
                >
                  <option value="">What do you need help with?</option>
                  {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div style={{
                width: 1, height: 48, background: 'rgba(232,201,168,0.7)',
                flexShrink: 0, margin: '0 4px'
              }} className="mobile-hide" />
              <div style={{ flex: '1 1 180px', padding: '12px 20px', minWidth: 0 }}>
                <label htmlFor="hero-city-inp" style={{
                  display: 'block', fontSize: '.62rem', fontWeight: 900,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '2px', marginBottom: 5
                }}>City / Pincode</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={15} color="var(--bur-l)" style={{ flexShrink: 0 }} />
                  <input
                    id="hero-city-inp"
                    style={{
                      border: 'none', background: 'none', fontSize: '.97rem',
                      fontWeight: 700, color: 'var(--txt)', outline: 'none',
                      width: '100%', padding: 0
                    }}
                    placeholder="Delhi, 110001, Mumbai…"
                    value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goSearch()}
                  />
                </div>
              </div>
              <button
                onClick={goSearch}
                style={{
                  background: 'linear-gradient(135deg, var(--bur) 0%, var(--bur-d) 100%)',
                  color: '#fff', border: 'none', borderRadius: 16,
                  padding: '1.1rem 2rem', fontWeight: 800, fontSize: '.97rem',
                  cursor: 'pointer', flexShrink: 0, margin: '4px',
                  boxShadow: '0 8px 24px rgba(123,29,46,0.4)',
                  transition: 'all 0.25s ease',
                  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
                }}
              >
                Find My Lawyer <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* Dual CTA buttons */}
          <div className="hero-text-in hero-dual-cta" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '1.8rem' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bur)', color: '#fff',
              fontWeight: 800, fontSize: '1rem',
              padding: '.9rem 2rem', borderRadius: 12, textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(123,29,46,0.35)',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Find a Lawyer <ArrowRight size={16} />
            </Link>
            <Link to="/join-as-lawyer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.1)', color: '#fff',
              border: '1.5px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(12px)',
              fontWeight: 700, fontSize: '1rem',
              padding: '.9rem 2rem', borderRadius: 12, textDecoration: 'none',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Join as a Lawyer <ChevronRight size={16} />
            </Link>
          </div>

          {/* Trust pills */}
          <div className="hero-text-in" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { icon: <BadgeCheck size={13} color="#4ADE80" />, t: '1,338+ Verified Lawyers' },
              { icon: <MapPin size={13} color="var(--blush-light)" />, t: '100+ Cities' },
              { icon: <Clock size={13} color="#60A5FA" />, t: '~15 min Emergency Response' },
              { icon: <Lock size={13} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
              { icon: <Zap size={13} color="#FCD34D" />, t: 'AI-Powered Matching' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(8px)', borderRadius: 30, padding: '.3rem .85rem'
              }}>
                {b.icon}
                <span style={{ fontSize: '.73rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{b.t}</span>
              </div>
            ))}
          </div>

          {/* AI chip */}
          <div className="hero-text-in">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(90deg, rgba(123,29,46,0.5), rgba(92,21,33,0.5))',
                border: '1px solid rgba(245,196,179,0.3)',
                borderRadius: 30, padding: '.45rem 1.2rem', color: 'var(--blush-light)',
                fontWeight: 700, fontSize: '.8rem', cursor: 'pointer',
                backdropFilter: 'blur(12px)', transition: 'all 0.2s'
              }}
            >
              <Bot size={15} />
              <span>Ask AI Legal Assistant — Free · Powered by Indian Bare Acts</span>
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '1.5rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 3,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
        }}>
          <span style={{
            fontSize: '.65rem', color: 'rgba(245,196,179,0.45)',
            fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase'
          }}>Scroll</span>
          <div style={{
            width: 24, height: 38, border: '1.5px solid rgba(245,196,179,0.2)',
            borderRadius: 14, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: 5
          }}>
            <div style={{
              width: 4, height: 8, background: 'var(--blush-light)', borderRadius: 2,
              animation: 'floatUp 1.5s ease-in-out infinite alternate'
            }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <div style={{
        background: 'var(--bur-darker)', padding: '.9rem 0', overflow: 'hidden',
        borderTop: '1px solid rgba(245,196,179,0.10)',
        borderBottom: '1px solid rgba(245,196,179,0.10)',
        display: 'flex', userSelect: 'none'
      }}>
        <div
          className="marquee-track"
          style={{
            display: 'flex', animation: 'marqueeSeamless 30s linear infinite',
            whiteSpace: 'nowrap', width: 'max-content', flexShrink: 0
          }}
        >
          {/* Track 1 */}
          <div style={{ display: 'flex', gap: '3rem', paddingRight: '3rem', flexShrink: 0 }}>
            {[
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
            ].map((txt, i) => (
              <span key={i} style={{
                fontSize: '.76rem', fontWeight: 700,
                color: 'rgba(245,196,179,0.70)',
                letterSpacing: '1.5px', textTransform: 'uppercase', flexShrink: 0
              }}>
                {txt}
              </span>
            ))}
          </div>

          {/* Track 2 - Exact duplicate for seamless -50% loop */}
          <div style={{ display: 'flex', gap: '3rem', paddingRight: '3rem', flexShrink: 0 }} aria-hidden="true">
            {[
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
            ].map((txt, i) => (
              <span key={`dup-${i}`} style={{
                fontSize: '.76rem', fontWeight: 700,
                color: 'rgba(245,196,179,0.70)',
                letterSpacing: '1.5px', textTransform: 'uppercase', flexShrink: 0
              }}>
                {txt}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — LIVE SEARCH DEMO
      ══════════════════════════════════════════════════════ */}
      <SearchDemo />

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — LEGAL TOOLS SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Legal Toolkit</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.8rem'
            }}>
              More than a directory.{' '}
              <span style={{ color: 'var(--bur)' }}>A complete legal platform.</span>
            </h2>
            <p style={{
              color: 'var(--txt-3)', fontSize: '1rem',
              maxWidth: 520, margin: '0 auto', lineHeight: 1.7
            }}>
              Tools built for everyday Indians navigating the legal system — free to access.
            </p>
          </div>

          <div className="tools-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <rect x="4" y="2" width="20" height="24" rx="3" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                    <path d="M9 9h10M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'Document Generator',
                desc: 'RTI applications, demand notices, FIR drafts, contracts — India-specific templates, free.',
                link: '/document-generator',
                action: null,
                cta: 'Generate Document',
                accent: 'var(--bur)',
                bg: 'rgba(123,29,46,0.05)'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M5 4h18v2H5zM5 8h12v2H5zM14 21H5V12h9v9zM19 12v9M19 16l3-3M19 16l-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Knowledge Hub',
                desc: 'Plain-language guides on your rights under Indian law — bail, property, consumer, and more.',
                link: '/knowledge-hub',
                action: null,
                cta: 'Read Guides',
                accent: '#1A3A6B',
                bg: 'rgba(26,58,107,0.05)'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M10 14c0-2.21 1.79-4 4-4s4 1.79 4 4-1.79 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    <circle cx="14" cy="18" r="1.2" fill="currentColor"/>
                    <path d="M14 10v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                ),
                title: 'AI Legal Assistant',
                desc: 'Trained on Indian Bare Acts. Ask about your rights, get instant answers, and find the right specialist.',
                link: null,
                action: () => window.dispatchEvent(new CustomEvent('open-ai-chat')),
                cta: 'Ask for Free',
                accent: '#6B2D6B',
                bg: 'rgba(107,45,107,0.05)'
              },
              {
                icon: (
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
                    <path d="M14 4l2.5 7h7.5l-6 4.5 2.5 7L14 18l-6.5 4.5 2.5-7L4 11h7.5z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                  </svg>
                ),
                title: 'Subscription Plans',
                desc: 'Premium plans for advocates to grow their practice with featured listings and analytics.',
                link: '/subscriptions',
                action: null,
                cta: 'View Plans',
                accent: '#1A6B3A',
                bg: 'rgba(26,107,58,0.05)'
              }
            ].map((tool, i) => (
              <div
                key={i}
                className="tool-card"
                onClick={tool.action || undefined}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--border)',
                  borderRadius: 20, padding: '2rem',
                  transition: 'all 0.3s cubic-bezier(.23,1,.32,1)',
                  cursor: tool.action ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column', gap: 0,
                  boxShadow: 'var(--sh-sm)'
                }}
              >
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: tool.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tool.accent, marginBottom: '1.2rem',
                  border: `1.5px solid ${tool.accent}22`
                }}>
                  {tool.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.1rem', fontWeight: 800,
                  color: 'var(--txt)', marginBottom: '.6rem'
                }}>{tool.title}</h3>
                <p style={{
                  fontSize: '.88rem', color: 'var(--txt-3)',
                  lineHeight: 1.75, flex: 1, marginBottom: '1.4rem'
                }}>{tool.desc}</p>
                {tool.link ? (
                  <Link to={tool.link} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: tool.accent, fontWeight: 700, fontSize: '.85rem',
                    textDecoration: 'none', transition: 'gap 0.2s ease'
                  }}>
                    {tool.cta} <ArrowRight size={14} />
                  </Link>
                ) : (
                  <button onClick={tool.action} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: tool.accent, fontWeight: 700, fontSize: '.85rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                    padding: 0, transition: 'gap 0.2s ease'
                  }}>
                    {tool.cta} <ArrowRight size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          STATS — Dramatic dark band
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', background: '#0E0508', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 50%, rgba(123,29,46,0.18) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.08)',
              border: '1px solid rgba(245,196,179,0.2)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>By The Numbers</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.8rem,3.5vw,2.5rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.03em'
            }}>
              India's most trusted legal platform
            </h2>
          </div>
          <div className="stats-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(5,1fr)',
            gap: '2rem', textAlign: 'center'
          }}>
            {[
              { to: 1338, s: '+', label: 'Verified', sub: 'Advocates', color: '#F5C4B3' },
              { to: 100,  s: '+', label: 'Cities',   sub: 'Covered',   color: '#E8A990' },
              { to: 10000,s: '+', label: 'Citizens', sub: 'Helped',     color: '#F5C4B3' },
              { to: 98,   s: '%', label: 'Client',   sub: 'Satisfaction', color: '#E8A990' },
              { to: 15,   s: 'min', label: 'Avg.',   sub: 'Emergency Response', color: '#F5C4B3' },
            ].map((st, i) => (
              <div key={i} style={{
                padding: '2rem 1rem',
                borderRight: i < 4 ? '1px solid rgba(245,196,179,0.08)' : 'none',
                position: 'relative'
              }}>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                  fontWeight: 900, color: st.color, lineHeight: 1,
                  letterSpacing: '-0.05em', marginBottom: 8
                }}>
                  <Counter to={st.to} suffix={st.s} />
                </div>
                <div style={{
                  fontSize: '.8rem', fontWeight: 800, color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '1.5px'
                }}>{st.label}</div>
                <div style={{
                  fontSize: '.68rem', color: 'rgba(245,196,179,0.45)',
                  marginTop: 4, fontWeight: 600
                }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          PRACTICE AREAS — CSS gradient cards (copyright-safe)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>All Legal Matters</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.8rem'
            }}>
              We cover every area of Indian law
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Find a Bar Council verified specialist for your exact legal situation — in under 60 seconds.
            </p>
          </div>
          <div className="area-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))',
            gap: '1rem'
          }}>
            {AREAS.map((a, i) => (
              <Link
                key={i}
                to={`/search?specialization=${encodeURIComponent(a.name)}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="area-card" style={{
                  position: 'relative', height: 210, borderRadius: 18,
                  overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  transition: 'all 0.35s cubic-bezier(.23,1,.32,1)'
                }}>
                  {/* Card Background Image with dark gradient overlay */}
                  <div
                    className="area-card-bg"
                    style={{
                      position: 'absolute', inset: 0, zIndex: 0,
                      background: `linear-gradient(180deg, rgba(26,10,13,0.45) 0%, rgba(26,10,13,0.92) 100%), url(${a.bgImg}) center/cover no-repeat`,
                      transition: 'transform 0.5s ease'
                    }}
                  />
                  {/* Pattern overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, opacity: 0.08, zIndex: 1,
                    backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
                    backgroundSize: '20px 20px', pointerEvents: 'none'
                  }} />
                  {/* Hover overlay */}
                  <div className="area-overlay" style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'rgba(123,29,46,0.18)',
                    opacity: 0, transition: 'opacity 0.35s ease', pointerEvents: 'none'
                  }} />
                  {/* Content */}
                  <div style={{
                    position: 'relative', zIndex: 1, height: '100%',
                    padding: '1.4rem', display: 'flex',
                    flexDirection: 'column', justifyContent: 'flex-end'
                  }}>
                    <div className="area-emoji" style={{
                      fontSize: '2rem', marginBottom: 10, display: 'block',
                      transition: 'transform 0.3s ease', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
                    }}>{a.emoji}</div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 800, color: '#fff', fontSize: '.95rem', marginBottom: 4
                    }}>{a.name}</div>
                    <div style={{ fontSize: '.74rem', color: 'rgba(255,255,255,0.68)', lineHeight: 1.5 }}>{a.desc}</div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: 'rgba(255,255,255,0.7)', fontSize: '.7rem',
                      fontWeight: 800, marginTop: 10,
                      textTransform: 'uppercase', letterSpacing: '1px'
                    }}>
                      Find Advocate <ChevronRight size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — WHY JUSTICE JUNCTION (scroll reveal)
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0',
        background: 'var(--cream)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-15%', left: '-8%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(123,29,46,0.04) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Why Justice Junction</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em'
            }}>
              Built differently.{' '}
              <span style={{ color: 'var(--bur)' }}>For India.</span>
            </h2>
          </div>

          <div
            ref={whyRef}
            className="why-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1.4rem'
            }}
          >
            {[
              { icon: <BadgeCheck size={22} />, title: 'Bar Council Verified', desc: 'Every advocate passes mandatory Bar Council enrollment verification. No unverified lawyers. Ever.', delay: 0 },
              { icon: <IndianRupee size={22} />, title: 'Zero Hidden Fees', desc: 'All fees published upfront on every profile. You pay only what you see. Zero platform commission.', delay: 0.08 },
              { icon: <Video size={22} />, title: 'Encrypted Video Calls', desc: 'End-to-end encrypted consultations. Your case details stay 100% private between you and your advocate.', delay: 0.16 },
              { icon: <Activity size={22} />, title: 'Live Case Updates', desc: 'Your lawyer posts live progress to your dashboard. No more chasing calls or WhatsApp messages.', delay: 0.24 },
              { icon: <Globe size={22} />, title: 'Pan-India Network', desc: '1,338+ advocates in 100+ cities. Find local expertise or consult remotely from anywhere in India.', delay: 0.1 },
              { icon: <Clock size={22} />, title: '24/7 Emergency Access', desc: "Police summons, bail hearings don't wait. Emergency advocates respond within 15 minutes, any hour.", delay: 0.18 },
              { icon: <Bot size={22} />, title: 'Free AI Legal Assistant', desc: 'Our AI — trained on Indian Bare Acts — answers your legal questions and identifies the right specialist.', delay: 0.26 },
              { icon: <FileText size={22} />, title: 'Free Legal Documents', desc: 'RTI applications, demand notices, FIR drafts, contracts — India-specific templates, completely free.', delay: 0.34 },
            ].map((f, i) => (
              <div
                key={i}
                className={`why-card${whyVisible ? ' revealed' : ''}`}
                style={{
                  background: '#fff', border: '1.5px solid var(--border)',
                  borderRadius: 20, padding: '1.8rem',
                  boxShadow: 'var(--sh-sm)',
                  opacity: whyVisible ? 1 : 0,
                  animationDelay: whyVisible ? `${f.delay}s` : '0s',
                  transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                }}
              >
                <div style={{
                  width: 50, height: 50, borderRadius: 14,
                  background: 'rgba(123,29,46,0.07)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bur)', marginBottom: '1.2rem',
                  border: '1.5px solid rgba(123,29,46,0.12)'
                }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 8
                }}>{f.title}</h3>
                <p style={{ fontSize: '.86rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — HOW IT WORKS (bugs fixed)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: 600, height: 600,
          background: 'radial-gradient(circle, rgba(123,29,46,0.04) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>How It Works</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em'
            }}>
              Legal help in <span style={{ color: 'var(--bur)' }}>4 steps.</span> Seriously.
            </h2>
          </div>

          <div className="step-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '2rem', position: 'relative'
          }}>
            {/* Connecting line — positioned to bisect icon circles (circle is 68px tall, 
                top offset from container = 0, so line at top: 34px = half circle height) */}
            <div style={{
              position: 'absolute', top: 34, left: '12.5%', right: '12.5%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, var(--border), var(--border), var(--border), transparent)',
              zIndex: 0, pointerEvents: 'none'
            }} className="mobile-hide" />

            {[
              { n: '01', icon: <Search size={22} />, title: 'Search', desc: 'Enter your city and legal issue. Our AI instantly shows matched, verified advocates — no spam.' },
              { n: '02', icon: <BarChart2 size={22} />, title: 'Compare', desc: 'View full profiles with experience, published fees, ratings, and availability. 100% transparent.' },
              { n: '03', icon: <Calendar size={22} />, title: 'Book', desc: 'Pick your slot. Meet via encrypted video or in-person. Pay exactly what was shown — zero extra.' },
              { n: '04', icon: <Activity size={22} />, title: 'Track', desc: 'Get live case updates from your lawyer on your dashboard. Always know where your case stands.' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

                {/*
                  FIX — ISSUE 1: Single step number as a small solid-fill badge (top-right corner).
                  NO overflow:hidden on parent div, so badge renders fully outside circle edge.
                  FIX — ISSUE 2: Icon circle uses rgba tint (var(--gold-p)) + border instead of flat white.
                */}
                <div
                  className="step-icon-wrap"
                  style={{
                    width: 68, height: 68, borderRadius: '50%',
                    /* ISSUE 2 FIX: soft tinted bg matching section family, not flat white */
                    background: 'var(--gold-p)',          /* rgba(123,29,46,0.08) */
                    border: '1.5px solid var(--border)',  /* cream-3 stroke for depth */
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    boxShadow: 'var(--sh)',
                    /* NOTE: NO overflow:hidden here — badge must sit outside circle edge */
                    position: 'relative',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  {/* ISSUE 1 FIX: small crimson badge, top-right, outside overflow */}
                  <span style={{
                    position: 'absolute',
                    top: -8,       /* sits visibly above circle edge */
                    right: -8,     /* sits visibly right of circle edge */
                    width: 22, height: 22,
                    borderRadius: '50%',
                    background: 'var(--bur)',      /* solid crimson */
                    color: '#fff',
                    fontSize: '.62rem',
                    fontWeight: 900,
                    fontFamily: "'Sora',sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    lineHeight: 1,
                    boxShadow: '0 2px 6px rgba(123,29,46,0.35)',
                    zIndex: 2,
                    letterSpacing: '-0.02em',
                    border: '1.5px solid #fff'   /* white ring to pop against circle */
                  }}>{step.n}</span>

                  {/* Icon — single, clean, centered */}
                  <span style={{ color: 'var(--bur)', position: 'relative', zIndex: 1 }}>
                    {step.icon}
                  </span>
                </div>

                {/* NO second ghost number rendered here — that was the collision bug */}
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.15rem', fontWeight: 900,
                  color: 'var(--txt)', marginBottom: 8
                }}>{step.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
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
          SECTION 6 — LIVE STATS BAND (brand-accent crimson)
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '5rem 0',
        background: 'var(--bur)',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.05,
          backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
          backgroundSize: '24px 24px', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 800, height: 800,
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#fff', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Live Impact</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.6rem,3vw,2.2rem)',
              fontWeight: 900, color: '#fff', letterSpacing: '-0.03em'
            }}>
              Real people. Real results.
            </h2>
          </div>

          <div className="stats-band-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4,1fr)',
            gap: '2rem', textAlign: 'center'
          }}>
            {[
              { to: 1338, s: '+', label: 'Lawyers Onboarded' },
              { to: 10000, s: '+', label: 'Cases Resolved' },
              { to: 100, s: '+', label: 'Cities Covered' },
              { to: 4.9, s: '★', prefix: '', label: 'Average Rating' },
            ].map((st, i) => (
              <div key={i} style={{ padding: '1rem' }}>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.2rem,3.5vw,3.2rem)',
                  fontWeight: 900, color: '#fff', lineHeight: 1,
                  letterSpacing: '-0.05em', marginBottom: 8
                }}>
                  {st.prefix !== undefined && st.to === 4.9
                    ? <span>4.9{st.s}</span>
                    : <Counter to={st.to} suffix={st.s} />
                  }
                </div>
                <div style={{
                  fontSize: '.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.75)',
                  textTransform: 'uppercase', letterSpacing: '1.5px'
                }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 7 — TESTIMONIALS CAROUSEL
          - Auto-advances every 5s
          - Pauses on hover AND keyboard focus (:focus-within / onFocus/onBlur)
          - Arrow key nav scoped to container (tabIndex={0} + onKeyDown)
          - Dot indicators, clickable
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#FCD34D" color="#FCD34D" />)}
              <span style={{
                fontFamily: "'Sora',sans-serif", fontSize: '1rem',
                fontWeight: 700, color: 'var(--txt)', marginLeft: 8, alignSelf: 'center'
              }}>4.9 / 5.0</span>
            </div>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
              letterSpacing: '2.5px', textTransform: 'uppercase',
              padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Real Client Stories</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem,3.5vw,2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em'
            }}>
              Trusted by <span style={{ color: 'var(--bur)' }}>thousands</span> across India.
            </h2>
          </div>

          {/*
            Carousel container:
            - tabIndex={0} makes it focusable for keyboard nav
            - onKeyDown scoped here, does NOT attach to window
            - onMouseEnter / onMouseLeave pauses/resumes auto-advance
            - onFocus / onBlur pauses/resumes on keyboard focus (per spec)
          */}
          <div
            ref={carouselRef}
            tabIndex={0}
            onKeyDown={handleCarouselKey}
            onMouseEnter={() => setReviewPaused(true)}
            onMouseLeave={() => setReviewPaused(false)}
            onFocus={() => setReviewPaused(true)}
            onBlur={() => setReviewPaused(false)}
            style={{
              position: 'relative',
              outline: 'none',  /* custom focus style below */
              borderRadius: 24
            }}
            aria-label="Client testimonials carousel. Use left and right arrow keys to navigate."
            aria-live="polite"
          >
            {/* Review card */}
            <div className="carousel-card" style={{
              background: 'var(--cream)', borderRadius: 24,
              padding: 'clamp(2rem,4vw,3rem)',
              border: '1.5px solid var(--border)',
              maxWidth: 780, margin: '0 auto',
              position: 'relative', overflow: 'hidden',
              boxShadow: 'var(--sh-lg)'
            }}>
              {/* Decorative quote mark */}
              <div style={{
                position: 'absolute', top: 12, right: 20,
                fontFamily: "'Georgia',serif",
                fontSize: '8rem', color: 'rgba(123,29,46,0.05)',
                lineHeight: 1, pointerEvents: 'none', userSelect: 'none'
              }}>"</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: '1.2rem' }}>
                {[1,2,3,4,5].map(n => <Star key={n} size={15} fill="#FCD34D" color="#FCD34D" />)}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 'clamp(.95rem,1.5vw,1.1rem)', color: 'var(--txt-2)',
                lineHeight: 1.85, fontStyle: 'italic',
                marginBottom: '2rem', position: 'relative', zIndex: 1,
                minHeight: '4.5rem'  /* prevent height jump between reviews */
              }}>
                "{REVIEWS[reviewIdx].text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--bur), var(--bur-d))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F5C4B3', fontWeight: 900, fontSize: '.9rem',
                  fontFamily: "'Sora',sans-serif"
                }}>{REVIEWS[reviewIdx].init}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '.95rem', color: 'var(--txt)' }}>
                    {REVIEWS[reviewIdx].name}
                  </div>
                  <div style={{
                    fontSize: '.75rem', color: 'var(--txt-3)',
                    display: 'flex', gap: 4, alignItems: 'center', marginTop: 2
                  }}>
                    <MapPin size={11} /> {REVIEWS[reviewIdx].city} · Verified Client
                  </div>
                </div>
              </div>
            </div>

            {/* Prev / Next buttons */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: 12, marginTop: '2rem', alignItems: 'center'
            }}>
              <button
                onClick={() => setReviewIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length)}
                aria-label="Previous testimonial"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1.5px solid var(--border)',
                  background: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--txt-3)', transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              {/* Dot indicators */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`review-dot${i === reviewIdx ? ' active' : ''}`}
                    style={{
                      width: i === reviewIdx ? 24 : 8, height: 8,
                      borderRadius: 4,
                      background: i === reviewIdx ? 'var(--bur)' : 'var(--cream-3)',
                      border: 'none', cursor: 'pointer', padding: 0
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setReviewIdx(i => (i + 1) % REVIEWS.length)}
                aria-label="Next testimonial"
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '1.5px solid var(--border)',
                  background: '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--txt-3)', transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          FOR LAWYERS — Split section with earnings card
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        background: 'var(--cream)'
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'repeating-linear-gradient(-45deg,var(--bur) 0,var(--bur) 1px,transparent 0,transparent 50%)',
          backgroundSize: '32px 32px', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="lawyer-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 420px',
            gap: '5rem', alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-block', background: 'rgba(123,29,46,0.08)',
                color: 'var(--bur)', fontWeight: 800, fontSize: '.72rem',
                letterSpacing: '2.5px', textTransform: 'uppercase',
                padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1.2rem'
              }}>For Legal Professionals</div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 900,
                color: 'var(--txt)', lineHeight: 1.1, letterSpacing: '-0.03em',
                marginBottom: '1.2rem'
              }}>
                Are You a Lawyer?<br />
                <span style={{ color: 'var(--bur)' }}>Grow Your Practice.</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '2rem' }}>
                Join 1,338+ verified advocates on Justice Junction. Set your own fees, get quality client bookings 24/7, and manage your entire practice from one powerful dashboard.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2.5rem' }}>
                {[
                  'Free profile listing — zero upfront cost',
                  'You set your own consultation fee',
                  'Receive verified client bookings 24/7',
                  'Razorpay-secured payouts within 48 hours',
                  'Bar Council verified badge on your profile',
                  'Real-time dashboard for all case tracking'
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(123,29,46,0.09)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <CheckCircle2 size={14} color="var(--bur)" />
                    </div>
                    <span style={{ fontSize: '.92rem', color: 'var(--txt-2)', fontWeight: 600 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/join-as-lawyer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--bur)', color: '#fff', fontWeight: 800, fontSize: '1rem',
                  padding: '1rem 2rem', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(123,29,46,0.3)'
                }} className="cta-btn">
                  Join as Advocate — Free <ArrowRight size={16} />
                </Link>
                <Link to="/lawyer-plans" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '2px solid var(--bur)', color: 'var(--bur)', fontWeight: 700, fontSize: '1rem',
                  padding: '1rem 2rem', borderRadius: 14, textDecoration: 'none', background: 'transparent'
                }} className="cta-btn">
                  View Plans
                </Link>
              </div>
            </div>

            {/* Earnings card */}
            <div style={{
              background: 'linear-gradient(160deg, var(--bur) 0%, var(--bur-d) 100%)',
              borderRadius: 28, padding: '2.8rem 2.5rem', color: '#fff',
              boxShadow: '0 30px 80px rgba(123,29,46,0.22)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.04,
                backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
                backgroundSize: '20px 20px', pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '.7rem', fontWeight: 800, color: '#F5C4B3',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8
                }}>Pro Plan — Avg. Monthly Earnings</div>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2rem,3vw,2.8rem)',
                  fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 4
                }}>₹45K – ₹75K</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(245,196,179,0.6)', marginBottom: '2rem' }}>
                  Based on 15–30 consultations at ₹2,500 avg
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.8rem' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                    gap: '1rem', textAlign: 'center', marginBottom: '2rem'
                  }}>
                    {[['48h', 'Verification'], ['₹0', 'Upfront Cost'], ['Free', 'Registration']].map(([v, l], i) => (
                      <div key={i}>
                        <div style={{
                          fontFamily: "'Sora',sans-serif", fontSize: '1.5rem',
                          fontWeight: 900, color: '#fff', letterSpacing: '-0.03em'
                        }}>{v}</div>
                        <div style={{
                          fontSize: '.68rem', color: 'rgba(245,196,179,0.6)',
                          fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: '1px'
                        }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/join-as-lawyer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'rgba(245,196,179,0.15)', border: '1px solid rgba(245,196,179,0.3)',
                    color: '#F5C4B3', fontWeight: 800, fontSize: '.9rem',
                    padding: '.9rem', borderRadius: 12, textDecoration: 'none',
                    backdropFilter: 'blur(8px)'
                  }}>
                    Apply Now — Takes 2 Minutes <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA: Dual-path, visually distinct
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '6rem 0', position: 'relative', overflow: 'hidden',
        background: '#0E0508'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,29,46,0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.08)', border: '1px solid rgba(245,196,179,0.2)',
              borderRadius: 30, padding: '.38rem 1.1rem', marginBottom: '1.5rem'
            }}>
              <Scale size={13} color="#F5C4B3" />
              <span style={{
                fontSize: '.72rem', fontWeight: 800, color: '#F5C4B3',
                textTransform: 'uppercase', letterSpacing: '2px'
              }}>Justice for Every Indian</span>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(2rem,4.5vw,3.5rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.04em', lineHeight: 1.1,
              marginBottom: '.75rem'
            }}>
              Ready to resolve your <span style={{ color: '#F5C4B3' }}>legal matters?</span>
            </h2>
            <p style={{
              fontSize: '1.05rem', color: 'rgba(245,224,200,0.6)',
              maxWidth: 520, margin: '0 auto', lineHeight: 1.8
            }}>
              Free to sign up. No hidden fees. Legal help in under 15 minutes.
            </p>
          </div>

          {/* Dual CTA split cards */}
          <div className="final-cta-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            maxWidth: 900, margin: '0 auto',
            border: '1px solid rgba(245,196,179,0.12)',
            borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.3)'
          }}>
            {/* Client CTA */}
            <div style={{
              padding: '3rem 2.5rem',
              background: 'linear-gradient(160deg, var(--bur) 0%, var(--bur-d) 100%)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: '-30%', left: '-20%', width: 300, height: 300,
                background: 'radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', color: '#F5C4B3'
                }}>
                  <Search size={26} />
                </div>
                <div style={{
                  fontSize: '.7rem', fontWeight: 800, color: 'rgba(245,196,179,0.7)',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12
                }}>For Clients</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.5rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1rem', lineHeight: 1.2
                }}>Find Your Lawyer Today</h3>
                <p style={{
                  fontSize: '.9rem', color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.75, marginBottom: '2rem'
                }}>
                  Search 1,338+ verified advocates by city and specialty. Free to browse. Book in minutes.
                </p>
                <Link to="/search" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#fff', color: 'var(--bur)',
                  fontWeight: 800, fontSize: '1rem',
                  padding: '1rem 2rem', borderRadius: 12, textDecoration: 'none',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  transition: 'all 0.25s ease'
                }} className="cta-btn">
                  Find a Lawyer <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Lawyer CTA */}
            <div className="final-cta-lawyer" style={{
              padding: '3rem 2.5rem',
              background: 'linear-gradient(160deg, #1A0A0D 0%, #2D1018 100%)',
              borderLeft: '1px solid rgba(245,196,179,0.10)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', bottom: '-20%', right: '-15%', width: 280, height: 280,
                background: 'radial-gradient(circle, rgba(123,29,46,0.15) 0%, transparent 65%)',
                borderRadius: '50%', pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18,
                  background: 'rgba(245,196,179,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem', color: '#F5C4B3'
                }}>
                  <Zap size={26} />
                </div>
                <div style={{
                  fontSize: '.7rem', fontWeight: 800, color: 'rgba(245,196,179,0.5)',
                  textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12
                }}>For Lawyers</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.5rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1rem', lineHeight: 1.2
                }}>Grow Your Practice</h3>
                <p style={{
                  fontSize: '.9rem', color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.75, marginBottom: '2rem'
                }}>
                  List free. Set your fees. Receive 24/7 verified bookings and manage cases with ease.
                </p>
                <Link to="/join-as-lawyer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(245,196,179,0.12)',
                  border: '1.5px solid rgba(245,196,179,0.3)',
                  backdropFilter: 'blur(12px)',
                  color: '#F5C4B3', fontWeight: 800, fontSize: '1rem',
                  padding: '1rem 2rem', borderRadius: 12, textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }} className="cta-btn">
                  Join as Lawyer <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom trust strip */}
          <div style={{
            display: 'flex', gap: 24, justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '3rem'
          }}>
            {[
              { icon: <BadgeCheck size={14} color="#4ADE80" />, t: 'Bar Council Verified' },
              { icon: <Lock size={14} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
              { icon: <Clock size={14} color="#60A5FA" />, t: '24/7 Available' },
              { icon: <Phone size={14} color="#F5C4B3" />, t: 'Emergency Line Active' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                {b.icon}
                <span style={{ fontSize: '.76rem', color: 'rgba(255,255,255,0.38)', fontWeight: 700 }}>
                  {b.t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
