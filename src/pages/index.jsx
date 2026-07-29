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
    <span style={{ color: '#F5C4B3', position: 'relative' }}>
      {display}
      <span style={{ animation: 'blink 1s step-end infinite', color: '#F5C4B3', marginLeft: 2 }}>|</span>
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
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, Sessions Court, Anticipatory Bail', grad: 'linear-gradient(160deg,#3D0E16,#7B1D2E)', bgImg: '/images/hero-courtroom.jpg' },
  { emoji: '👨‍👩‍👧', name: 'Family & Divorce', desc: 'Divorce, child custody, alimony, DV cases', grad: 'linear-gradient(160deg,#1A0A0D,#4A1A28)', bgImg: '/images/family-legal.jpg' },
  { emoji: '🏠', name: 'Property & RERA', desc: 'Title disputes, registry, builder fraud', grad: 'linear-gradient(160deg,#2D1B0E,#6B3A1F)', bgImg: '/images/law-books.jpg' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, IP, compliance, M&A, startups', grad: 'linear-gradient(160deg,#0D1B2A,#1E3A5F)', bgImg: '/images/ai-legal.jpg' },
  { emoji: '🛒', name: 'Consumer Rights', desc: 'Consumer forum, e-commerce, RERA, refunds', grad: 'linear-gradient(160deg,#0A2E1A,#1A6B3A)', bgImg: '/images/supreme-court.jpg' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF, ESIC, factory act', grad: 'linear-gradient(160deg,#1E1A0A,#6B5A1A)', bgImg: '/images/hero-scales.jpg' },
  { emoji: '💻', name: 'Cyber Law', desc: 'Online fraud, IT Act, cybercrime FIR, data breach', grad: 'linear-gradient(160deg,#0A0D2E,#1A246B)', bgImg: '/images/ai-legal.jpg' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax notices, appeals', grad: 'linear-gradient(160deg,#1A2E0A,#3A6B1A)', bgImg: '/images/law-books.jpg' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency same-day bail & FIR assistance', grad: 'linear-gradient(160deg,#3D0E16,#7B1D2E)', bgImg: '/images/hero-courtroom.jpg' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright, trade secrets', grad: 'linear-gradient(160deg,#2E1A0A,#6B3A1A)', bgImg: '/images/law-books.jpg' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery suits, injunctions, declaratory relief', grad: 'linear-gradient(160deg,#0A1A2E,#1A3A6B)', bgImg: '/images/supreme-court.jpg' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent, maintenance', grad: 'linear-gradient(160deg,#1A0A0D,#4A1A28)', bgImg: '/images/family-legal.jpg' },
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
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)
  const heroRef = useRef(null)
  const [scrollY, setScrollY] = useState(0)

  // Parallax scroll for hero
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        @keyframes fadeUp { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.08);opacity:0.8} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.8);opacity:0} }
        @keyframes float { 0%,100%{transform:translateY(0px) rotate(0deg)} 33%{transform:translateY(-14px) rotate(1.5deg)} 66%{transform:translateY(-7px) rotate(-1deg)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes marqueeFlow { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes rotateGlow { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes slideInLeft { from{opacity:0;transform:translateX(-40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInRight { from{opacity:0;transform:translateX(40px)} to{opacity:1;transform:translateX(0)} }
        @keyframes countBand { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes particleDrift {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          10% { opacity: 0.6; }
          90% { opacity: 0.2; }
          100% { transform: translateY(-120px) translateX(30px); opacity: 0; }
        }

        .hero-text-in { animation: fadeUp 0.9s cubic-bezier(.23,1,.32,1) both; }
        .hero-text-in:nth-child(1){animation-delay:0.05s}
        .hero-text-in:nth-child(2){animation-delay:0.18s}
        .hero-text-in:nth-child(3){animation-delay:0.32s}
        .hero-text-in:nth-child(4){animation-delay:0.46s}
        .hero-text-in:nth-child(5){animation-delay:0.60s}
        .hero-text-in:nth-child(6){animation-delay:0.74s}

        .area-card { transition: all 0.38s cubic-bezier(.23,1,.32,1); }
        .area-card:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 32px 60px rgba(0,0,0,0.5) !important; }
        .area-card:hover .area-card-bg { transform: scale(1.15) !important; }
        .area-card:hover .area-overlay { opacity: 1 !important; }
        .area-card:hover .area-arrow { opacity: 1 !important; transform: translateX(4px) !important; }

        .tool-card:hover { transform: translateY(-6px) !important; box-shadow: 0 24px 48px rgba(123,29,46,0.16) !important; border-color: var(--bur) !important; }
        .why-card.revealed { animation: fadeUp 0.6s cubic-bezier(.23,1,.32,1) both; }
        .cta-btn:hover { transform: translateY(-2px); }
        .review-dot { transition: all 0.3s ease; }
        .review-dot.active { background: var(--bur) !important; transform: scale(1.3); }

        .news-card:hover { border-color: rgba(123,29,46,0.35) !important; background: rgba(123,29,46,0.03) !important; transform: translateY(-2px); }
        .news-card { transition: all 0.25s ease; }

        .marquee-track { animation: marqueeFlow 35s linear infinite; }

        .step-num {
          font-family: 'Sora', sans-serif;
          font-size: 5rem;
          font-weight: 900;
          color: rgba(123,29,46,0.06);
          position: absolute;
          top: -1rem;
          left: -0.5rem;
          line-height: 1;
          pointer-events: none;
          user-select: none;
        }

        /* Glassy card effect */
        .glass-card {
          background: rgba(255,255,255,0.06);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.12);
        }

        /* Shimmer text */
        .shimmer-text {
          background: linear-gradient(90deg, #F5C4B3 0%, #fff 40%, #F5C4B3 80%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }

        /* Particle dots */
        .particle {
          position: absolute;
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: rgba(245,196,179,0.5);
          animation: particleDrift var(--dur, 6s) var(--delay, 0s) infinite ease-out;
        }

        @media (max-height: 900px) {
          .hero-section { padding-top: 100px !important; min-height: auto !important; }
        }
        @media (max-width: 640px) {
          .hero-dual-cta { flex-direction: column !important; }
          .hero-dual-cta a, .hero-dual-cta button { width: 100% !important; justify-content: center !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .hero-search-row { flex-direction: column !important; }
          .step-grid { grid-template-columns: 1fr !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .hero-img-split { display: none !important; }
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .area-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .news-grid { grid-template-columns: 1fr 1fr !important; }
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
          .marquee-track { animation: none !important; }
          .particle { animation: none !important; }
        }
      `}} />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ══════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="hero-section"
        style={{
          minHeight: '100vh', position: 'relative', overflow: 'hidden',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          paddingTop: 80, background: '#060103'
        }}
      >
        {/* BACKGROUND: Cinematic courtroom image with parallax */}
        <div style={{
          position: 'absolute', inset: '-5%',
          backgroundImage: 'url(/images/hero-courtroom.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          transform: `translateY(${scrollY * 0.25}px)`,
          transition: 'transform 0.1s linear',
          willChange: 'transform',
          zIndex: 0
        }} />

        {/* Dark cinematic overlay — layered for depth */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `
            linear-gradient(180deg,
              rgba(6,1,3,0.82) 0%,
              rgba(26,10,13,0.65) 35%,
              rgba(26,10,13,0.72) 65%,
              rgba(6,1,3,0.95) 100%
            )
          `
        }} />

        {/* Dramatic red vignette lighting from center-left */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `
            radial-gradient(ellipse 75% 60% at 25% 55%,
              rgba(123,29,46,0.35) 0%,
              rgba(61,14,22,0.15) 50%,
              transparent 80%
            )
          `,
          pointerEvents: 'none'
        }} />

        {/* Golden light shaft from top */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: `
            radial-gradient(ellipse 40% 70% at 60% -10%,
              rgba(245,196,179,0.10) 0%,
              transparent 70%
            )
          `,
          pointerEvents: 'none'
        }} />

        {/* Animated floating particles */}
        {[
          { left: '12%', top: '65%', dur: '7s', delay: '0s' },
          { left: '22%', top: '75%', dur: '9s', delay: '1.2s' },
          { left: '38%', top: '80%', dur: '6s', delay: '0.5s' },
          { left: '55%', top: '72%', dur: '8s', delay: '2s' },
          { left: '70%', top: '78%', dur: '10s', delay: '0.8s' },
          { left: '82%', top: '70%', dur: '7.5s', delay: '1.5s' },
          { left: '8%', top: '55%', dur: '11s', delay: '3s' },
          { left: '46%', top: '60%', dur: '8.5s', delay: '2.5s' },
        ].map((p, i) => (
          <div key={i} className="particle" style={{
            left: p.left, top: p.top,
            '--dur': p.dur, '--delay': p.delay,
            zIndex: 2
          }} />
        ))}

        {/* Floating hero image — right side */}
        <div className="hero-img-split" style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          width: '42%', zIndex: 3,
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/lawyer-hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
            opacity: 0.45,
            transform: `translateY(${scrollY * 0.15}px)`,
            transition: 'transform 0.1s linear'
          }} />
          {/* Fade left edge */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, #060103 0%, rgba(6,1,3,0.5) 30%, transparent 65%)'
          }} />
          {/* Fade bottom */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 40%, rgba(6,1,3,0.9) 100%)'
          }} />
        </div>

        {/* Bottom fade to next section */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 200, zIndex: 4,
          background: 'linear-gradient(to bottom, transparent, var(--cream))',
          pointerEvents: 'none'
        }} />

        {/* CONTENT */}
        <div className="container" style={{
          position: 'relative', zIndex: 5,
          padding: '4rem 0 clamp(8rem, 15vh, 10rem)',
          maxWidth: 1280
        }}>

          {/* Live badge */}
          <div className="hero-text-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(245,196,179,0.08)',
            border: '1px solid rgba(245,196,179,0.22)',
            borderRadius: 40, padding: '.42rem 1.2rem',
            marginBottom: '2rem', backdropFilter: 'blur(14px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: 8, height: 8, borderRadius: '50%', background: '#4ADE80'
              }} />
              <div style={{
                position: 'absolute', inset: -3, borderRadius: '50%',
                border: '1.5px solid #4ADE80',
                animation: 'pulseRing 2s ease-out infinite'
              }} />
            </div>
            <span style={{
              fontSize: '.72rem', fontWeight: 800, color: 'rgba(245,196,179,0.90)',
              letterSpacing: '2.5px', textTransform: 'uppercase'
            }}>
              LIVE · India's #1 Legal Marketplace · 24/7 Emergency Access
            </span>
          </div>

          {/* Main headline */}
          <h1 className="hero-text-in" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem, 6vw, 5.4rem)',
            fontWeight: 900, lineHeight: 1.06, letterSpacing: '-0.045em',
            color: '#fff', marginBottom: '1.6rem', maxWidth: 860
          }}>
            Find Your{' '}
            <TypingWord />
            <br />
            <span style={{
              fontStyle: 'italic', fontWeight: 700,
              fontSize: '0.85em',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.75), rgba(245,196,179,0.9))',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              — Anytime. Anywhere in India.
            </span>
          </h1>

          {/* Sub */}
          <p className="hero-text-in" style={{
            fontSize: 'clamp(.95rem, 1.45vw, 1.15rem)',
            color: 'rgba(245,224,200,0.78)', maxWidth: 600, lineHeight: 1.85,
            marginBottom: '2.8rem', fontWeight: 400
          }}>
            India's first 100% price-transparent legal marketplace.{' '}
            <strong style={{ color: '#F5C4B3', fontWeight: 700 }}>1,338+ Bar Council verified advocates</strong> across{' '}
            <strong style={{ color: '#F5C4B3', fontWeight: 700 }}>100+ cities</strong>.
            Instant booking. Encrypted video calls. AI-powered matching.
          </p>

          {/* Hero search */}
          <div className="hero-text-in" style={{
            background: 'rgba(255,255,255,0.97)', borderRadius: 24,
            padding: '10px', marginBottom: '2.2rem', maxWidth: 820,
            boxShadow: '0 30px 90px rgba(0,0,0,0.4), 0 0 0 1px rgba(232,201,168,0.5)'
          }}>
            <div className="hero-search-row" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              <div style={{ flex: '1 1 230px', padding: '14px 22px', minWidth: 0 }}>
                <label htmlFor="hero-issue-sel" style={{
                  display: 'block', fontSize: '.6rem', fontWeight: 900,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '2.5px', marginBottom: 6
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
                width: 1, height: 50, background: 'rgba(232,201,168,0.7)',
                flexShrink: 0, margin: '0 4px'
              }} />
              <div style={{ flex: '1 1 190px', padding: '14px 22px', minWidth: 0 }}>
                <label htmlFor="hero-city-inp" style={{
                  display: 'block', fontSize: '.6rem', fontWeight: 900,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '2.5px', marginBottom: 6
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
                  color: '#fff', border: 'none', borderRadius: 18,
                  padding: '1.15rem 2.2rem', fontWeight: 800, fontSize: '.97rem',
                  cursor: 'pointer', flexShrink: 0, margin: '5px',
                  boxShadow: '0 8px 28px rgba(123,29,46,0.45)',
                  transition: 'all 0.25s ease',
                  display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap'
                }}
              >
                Find My Lawyer <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="hero-text-in hero-dual-cta" style={{
            display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: '2rem'
          }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--bur)', color: '#fff',
              fontWeight: 800, fontSize: '1rem',
              padding: '.95rem 2.2rem', borderRadius: 14, textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(123,29,46,0.45)',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Browse Lawyers <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.10)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(14px)',
                fontWeight: 700, fontSize: '1rem',
                padding: '.95rem 2rem', borderRadius: 14, cursor: 'pointer',
                transition: 'all 0.25s ease'
              }} className="cta-btn">
              <Bot size={16} /> Ask AI Legal Assistant
            </button>
            <Link to="/join-as-lawyer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.12)', color: '#F5C4B3',
              border: '1.5px solid rgba(245,196,179,0.25)',
              backdropFilter: 'blur(14px)',
              fontWeight: 700, fontSize: '1rem',
              padding: '.95rem 2rem', borderRadius: 14, textDecoration: 'none',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Join as Lawyer <ChevronRight size={16} />
            </Link>
          </div>

          {/* Trust pills */}
          <div className="hero-text-in" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {[
              { icon: <BadgeCheck size={13} color="#4ADE80" />, t: '1,338+ Verified Lawyers' },
              { icon: <MapPin size={13} color="#F5C4B3" />, t: '100+ Cities' },
              { icon: <Clock size={13} color="#60A5FA" />, t: '15 min Emergency Response' },
              { icon: <Lock size={13} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
              { icon: <Zap size={13} color="#FCD34D" />, t: 'AI-Powered Matching' },
              { icon: <IndianRupee size={13} color="#4ADE80" />, t: 'Zero Hidden Fees' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
                backdropFilter: 'blur(10px)', borderRadius: 30, padding: '.3rem .9rem'
              }}>
                {b.icon}
                <span style={{ fontSize: '.73rem', color: 'rgba(255,255,255,0.82)', fontWeight: 700 }}>{b.t}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2.5rem', left: '50%',
          transform: 'translateX(-50%)', zIndex: 5,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6
        }}>
          <span style={{
            fontSize: '.62rem', color: 'rgba(245,196,179,0.4)',
            fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase'
          }}>Discover More</span>
          <div style={{
            width: 22, height: 36, border: '1.5px solid rgba(245,196,179,0.18)',
            borderRadius: 12, display: 'flex', alignItems: 'flex-start',
            justifyContent: 'center', padding: 4
          }}>
            <div style={{
              width: 3, height: 7, background: '#F5C4B3', borderRadius: 2,
              animation: 'float 1.6s ease-in-out infinite'
            }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          MARQUEE TRUST STRIP
      ══════════════════════════════════════════════════════ */}
      <div style={{
        background: '#0E0306', padding: '.95rem 0', overflow: 'hidden',
        borderTop: '1px solid rgba(245,196,179,0.08)',
        borderBottom: '1px solid rgba(245,196,179,0.08)',
        display: 'flex', userSelect: 'none'
      }}>
        <div className="marquee-track" style={{
          display: 'flex', whiteSpace: 'nowrap',
          width: 'max-content', flexShrink: 0
        }}>
          {[1, 2].map(track => (
            <div key={track} aria-hidden={track === 2} style={{
              display: 'flex', gap: '3rem', paddingRight: '3rem', flexShrink: 0
            }}>
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
                '🎓 Supreme Court Lawyers',
                '🏆 India\'s #1 Legal Platform',
              ].map((txt, i) => (
                <span key={i} style={{
                  fontSize: '.76rem', fontWeight: 700,
                  color: 'rgba(245,196,179,0.65)',
                  letterSpacing: '1.5px', textTransform: 'uppercase', flexShrink: 0
                }}>
                  {txt}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          SECTION 2 — STATS WITH DRAMATIC BACKGROUND
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '0', position: 'relative', overflow: 'hidden',
        minHeight: 420
      }}>
        {/* Background image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/supreme-court.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center 60%',
          filter: 'brightness(0.25)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(160deg, rgba(26,10,13,0.92) 0%, rgba(10,4,6,0.85) 100%)'
        }} />
        {/* Glowing vignette */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 120%, rgba(123,29,46,0.25) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div className="container" ref={statsRef} style={{ position: 'relative', zIndex: 2, padding: '6rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.08)',
              border: '1px solid rgba(245,196,179,0.2)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.7rem', letterSpacing: '3px',
              textTransform: 'uppercase', padding: '.4rem 1.1rem', borderRadius: 6, marginBottom: '1.2rem'
            }}>By The Numbers</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.03em', marginBottom: '.6rem'
            }}>
              India's most trusted legal platform
            </h2>
            <p style={{ color: 'rgba(245,196,179,0.5)', fontSize: '1rem', maxWidth: 480, margin: '0 auto' }}>
              Real numbers. Real impact. Real justice for everyday Indians.
            </p>
          </div>

          <div className="stats-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '1.5rem', textAlign: 'center'
          }}>
            {[
              { to: 1338, s: '+', label: 'Verified', sub: 'Advocates', icon: <UserCheck size={20} />, color: '#F5C4B3' },
              { to: 100, s: '+', label: 'Cities', sub: 'Covered', icon: <MapPin size={20} />, color: '#E8A990' },
              { to: 10000, s: '+', label: 'Citizens', sub: 'Helped', icon: <Users size={20} />, color: '#F5C4B3' },
              { to: 98, s: '%', label: 'Client', sub: 'Satisfaction', icon: <Heart size={20} />, color: '#E8A990' },
              { to: 15, s: 'min', label: 'Emergency', sub: 'Response Avg.', icon: <AlertCircle size={20} />, color: '#F5C4B3' },
            ].map((st, i) => (
              <div key={i} className="glass-card" style={{
                padding: '2rem 1.2rem', borderRadius: 20,
                position: 'relative', overflow: 'hidden',
                animation: statsVisible ? `countBand 0.6s ${i * 0.1}s both` : 'none'
              }}>
                <div style={{
                  display: 'flex', justifyContent: 'center', marginBottom: 12,
                  color: st.color, opacity: 0.6
                }}>{st.icon}</div>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
                  fontWeight: 900, color: st.color, lineHeight: 1,
                  letterSpacing: '-0.05em', marginBottom: 8
                }}>
                  <Counter to={st.to} suffix={st.s} />
                </div>
                <div style={{
                  fontSize: '.78rem', fontWeight: 800, color: '#fff',
                  textTransform: 'uppercase', letterSpacing: '1.5px'
                }}>{st.label}</div>
                <div style={{
                  fontSize: '.66rem', color: 'rgba(245,196,179,0.4)',
                  marginTop: 4, fontWeight: 600
                }}>{st.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 3 — HOW IT WORKS (cinematic)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Background decorative */}
        <div style={{
          position: 'absolute', top: '-15%', right: '-8%', width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(123,29,46,0.04) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-5%', width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(123,29,46,0.03) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />

        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.7rem',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>How It Works</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.7rem'
            }}>
              Legal help in <span style={{ color: 'var(--bur)' }}>4 simple steps.</span>
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              We've removed every barrier between you and the right lawyer.
            </p>
          </div>

          <div className="step-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem', position: 'relative'
          }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: 36, left: '12.5%', right: '12.5%',
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(123,29,46,0.15) 20%, rgba(123,29,46,0.15) 80%, transparent)',
              zIndex: 0
            }} className="mobile-hide" />

            {[
              { n: '01', icon: <Search size={24} />, title: 'Search', desc: 'Enter your city and legal issue. Our AI instantly matches you with verified advocates — no spam.' },
              { n: '02', icon: <BarChart2 size={24} />, title: 'Compare', desc: 'View full profiles with experience, published fees, ratings, and real availability. 100% transparent.' },
              { n: '03', icon: <Calendar size={24} />, title: 'Book & Meet', desc: 'Pick your slot. Meet via encrypted video or in-person. Pay exactly what was shown.' },
              { n: '04', icon: <Activity size={24} />, title: 'Track Progress', desc: 'Get live case updates from your lawyer on your dashboard. Always know where your case stands.' },
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                <div className="step-num">{step.n}</div>
                <div className="step-icon-wrap" style={{
                  width: 72, height: 72, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(123,29,46,0.09), rgba(61,14,22,0.05))',
                  border: '1.5px solid rgba(123,29,46,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.8rem', position: 'relative',
                  boxShadow: '0 8px 24px rgba(123,29,46,0.08)',
                  transition: 'all 0.35s ease'
                }}>
                  <span style={{ position: 'absolute', top: -9, right: -9, width: 24, height: 24,
                    borderRadius: '50%', background: 'var(--bur)', color: '#fff',
                    fontSize: '.6rem', fontWeight: 900, fontFamily: "'Sora',sans-serif",
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(123,29,46,0.4)',
                    border: '2px solid #fff', zIndex: 2, letterSpacing: '-0.02em'
                  }}>{step.n}</span>
                  <span style={{ color: 'var(--bur)' }}>{step.icon}</span>
                </div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.15rem', fontWeight: 900,
                  color: 'var(--txt)', marginBottom: 10
                }}>{step.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', lineHeight: 1.78, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4.5rem' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, var(--bur), var(--bur-d))',
              color: '#fff', fontWeight: 800, fontSize: '1.05rem',
              padding: '1.1rem 2.8rem', borderRadius: 16, textDecoration: 'none',
              boxShadow: '0 12px 32px rgba(123,29,46,0.35)',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Start Now — It's Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 4 — PRACTICE AREAS (image cards)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.7rem',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>All Legal Matters</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.7rem'
            }}>
              We cover every area of Indian law
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Find a Bar Council verified specialist for your exact legal situation — in under 60 seconds.
            </p>
          </div>

          <div className="area-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
            gap: '1.1rem'
          }}>
            {AREAS.map((a, i) => (
              <Link
                key={i}
                to={`/search?specialization=${encodeURIComponent(a.name)}`}
                style={{ textDecoration: 'none' }}
              >
                <div className="area-card" style={{
                  position: 'relative', height: 230, borderRadius: 20,
                  overflow: 'hidden', cursor: 'pointer',
                  boxShadow: '0 8px 28px rgba(0,0,0,0.22)'
                }}>
                  {/* Card background image */}
                  <div
                    className="area-card-bg"
                    style={{
                      position: 'absolute', inset: 0, zIndex: 0,
                      backgroundImage: `url(${a.bgImg})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.55s ease'
                    }}
                  />
                  {/* Dark gradient overlay */}
                  <div style={{
                    position: 'absolute', inset: 0, zIndex: 1,
                    background: 'linear-gradient(180deg, rgba(6,1,3,0.30) 0%, rgba(6,1,3,0.88) 100%)'
                  }} />
                  {/* Hover color tint */}
                  <div className="area-overlay" style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    background: a.grad.replace('linear-gradient', 'linear-gradient').replace(')', ', rgba(0,0,0,0))'),
                    opacity: 0, transition: 'opacity 0.38s ease'
                  }} />
                  {/* Content */}
                  <div style={{
                    position: 'relative', zIndex: 3, height: '100%',
                    padding: '1.5rem', display: 'flex',
                    flexDirection: 'column', justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      fontSize: '2.1rem', marginBottom: 10,
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))'
                    }}>{a.emoji}</div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans',sans-serif",
                      fontWeight: 800, color: '#fff', fontSize: '.98rem', marginBottom: 5
                    }}>{a.name}</div>
                    <div style={{ fontSize: '.74rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{a.desc}</div>
                    <div className="area-arrow" style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      color: '#F5C4B3', fontSize: '.7rem',
                      fontWeight: 800, marginTop: 12,
                      textTransform: 'uppercase', letterSpacing: '1px',
                      opacity: 0, transition: 'all 0.35s ease'
                    }}>
                      Find Advocate <ChevronRight size={11} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '2px solid var(--bur)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.95rem',
              padding: '.9rem 2.2rem', borderRadius: 14, textDecoration: 'none',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              See All Specializations <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 5 — WHY JUSTICE JUNCTION (dark bg with law books image)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: 600 }}>
        {/* Split layout — left text, right image */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '45%', zIndex: 0
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'url(/images/law-books.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }} />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(90deg, var(--cream) 0%, rgba(249,238,228,0.1) 50%, transparent 100%)'
          }} />
        </div>

        <div className="container" ref={whyRef} style={{ position: 'relative', zIndex: 1, padding: '8rem 0' }}>
          <div style={{ maxWidth: 680 }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.7rem',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1.2rem'
            }}>Why Justice Junction</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '1rem'
            }}>
              Built differently.{' '}
              <span style={{ color: 'var(--bur)' }}>For India.</span>
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', lineHeight: 1.8, marginBottom: '3rem', maxWidth: 560 }}>
              We set out to solve a fundamental problem: most Indians can't access quality legal help. Too expensive, too opaque, too intimidating. We changed that.
            </p>

            <div className="why-grid" style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1.2rem'
            }}>
              {[
                { icon: <BadgeCheck size={20} />, title: 'Bar Council Verified', desc: 'Every advocate passes mandatory verification. No unverified lawyers. Ever.' },
                { icon: <IndianRupee size={20} />, title: 'Zero Hidden Fees', desc: 'All fees published upfront. You pay only what you see. Zero commission.' },
                { icon: <Video size={20} />, title: 'Encrypted Video Calls', desc: 'End-to-end encrypted. Your case stays 100% private.' },
                { icon: <Activity size={20} />, title: 'Live Case Updates', desc: 'Your lawyer posts live progress to your dashboard. No more chasing calls.' },
                { icon: <Globe size={20} />, title: 'Pan-India Network', desc: '1,338+ advocates in 100+ cities. Local expertise or remote consultation.' },
                { icon: <Clock size={20} />, title: '24/7 Emergency Access', desc: 'Bail hearings don\'t wait. Emergency advocates respond in 15 minutes.' },
                { icon: <Bot size={20} />, title: 'Free AI Legal Assistant', desc: 'Trained on Indian Bare Acts. Instant answers, any time of day.' },
                { icon: <FileText size={20} />, title: 'Free Legal Documents', desc: 'RTI, notices, FIR drafts, contracts — India-specific templates, free.' },
              ].map((f, i) => (
                <div
                  key={i}
                  className={`why-card${whyVisible ? ' revealed' : ''}`}
                  style={{
                    background: '#fff', border: '1.5px solid var(--border)',
                    borderRadius: 18, padding: '1.5rem',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.05)',
                    opacity: whyVisible ? 1 : 0,
                    animationDelay: whyVisible ? `${i * 0.07}s` : '0s',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(123,29,46,0.07)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--bur)', marginBottom: '1rem',
                    border: '1.5px solid rgba(123,29,46,0.10)'
                  }}>{f.icon}</div>
                  <h3 style={{
                    fontFamily: "'Plus Jakarta Sans',sans-serif",
                    fontSize: '.95rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 6
                  }}>{f.title}</h3>
                  <p style={{ fontSize: '.83rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 6 — AI LEGAL TOOLS SHOWCASE
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/ai-legal.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.04, zIndex: 0
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.7rem',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Legal Toolkit</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.7rem'
            }}>
              More than a directory.{' '}
              <span style={{ color: 'var(--bur)' }}>A complete legal platform.</span>
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              Tools built for everyday Indians navigating the legal system — free to access.
            </p>
          </div>

          <div className="tools-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.5rem'
          }}>
            {[
              {
                icon: <FileText size={28} />,
                title: 'Document Generator',
                desc: 'RTI applications, demand notices, FIR drafts, contracts — India-specific templates, completely free.',
                link: '/document-generator',
                action: null,
                cta: 'Generate Free',
                accent: 'var(--bur)',
                bg: 'rgba(123,29,46,0.06)'
              },
              {
                icon: <BookOpen size={28} />,
                title: 'Knowledge Hub',
                desc: 'Plain-language guides on your rights under Indian law — bail, property, consumer, divorce and more.',
                link: '/knowledge-hub',
                action: null,
                cta: 'Read Guides',
                accent: '#1A3A6B',
                bg: 'rgba(26,58,107,0.06)'
              },
              {
                icon: <Bot size={28} />,
                title: 'AI Legal Assistant',
                desc: 'Trained on Indian Bare Acts. Ask about your rights, get instant answers, and find the right specialist.',
                link: null,
                action: () => window.dispatchEvent(new CustomEvent('open-ai-chat')),
                cta: 'Ask for Free',
                accent: '#6B2D6B',
                bg: 'rgba(107,45,107,0.06)'
              },
              {
                icon: <Award size={28} />,
                title: 'Subscription Plans',
                desc: 'Premium plans for advocates to grow their practice with featured listings, analytics & priority placement.',
                link: '/subscriptions',
                action: null,
                cta: 'View Plans',
                accent: '#1A6B3A',
                bg: 'rgba(26,107,58,0.06)'
              }
            ].map((tool, i) => (
              <div
                key={i}
                className="tool-card"
                onClick={tool.action || undefined}
                style={{
                  background: '#fff',
                  border: '1.5px solid var(--border)',
                  borderRadius: 22, padding: '2.2rem',
                  transition: 'all 0.3s cubic-bezier(.23,1,.32,1)',
                  cursor: tool.action ? 'pointer' : 'default',
                  display: 'flex', flexDirection: 'column', gap: 0,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}
              >
                <div style={{
                  width: 62, height: 62, borderRadius: 18,
                  background: tool.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: tool.accent, marginBottom: '1.3rem',
                  border: `1.5px solid ${tool.accent}25`
                }}>
                  {tool.icon}
                </div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.1rem', fontWeight: 800,
                  color: 'var(--txt)', marginBottom: '.65rem'
                }}>{tool.title}</h3>
                <p style={{
                  fontSize: '.88rem', color: 'var(--txt-3)',
                  lineHeight: 1.78, flex: 1, marginBottom: '1.5rem'
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
          SECTION 7 — TESTIMONIALS (dark cinematic)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: 600 }}>
        {/* BG Image */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/city-night.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.2)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(160deg, rgba(6,1,3,0.96) 0%, rgba(26,10,13,0.92) 100%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 100%, rgba(123,29,46,0.20) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '8rem 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginBottom: '1rem' }}>
              {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#FCD34D" color="#FCD34D" />)}
              <span style={{
                fontFamily: "'Sora',sans-serif", fontSize: '1rem',
                fontWeight: 700, color: '#FCD34D', marginLeft: 8, alignSelf: 'center'
              }}>4.9 / 5.0</span>
            </div>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.08)',
              border: '1px solid rgba(245,196,179,0.2)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.7rem', letterSpacing: '3px',
              textTransform: 'uppercase', padding: '.4rem 1.1rem', borderRadius: 6, marginBottom: '1.2rem'
            }}>Real Client Stories</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.03em'
            }}>
              Trusted by <span style={{ color: '#F5C4B3' }}>thousands</span> across India.
            </h2>
          </div>

          <div
            ref={carouselRef}
            tabIndex={0}
            onKeyDown={handleCarouselKey}
            onMouseEnter={() => setReviewPaused(true)}
            onMouseLeave={() => setReviewPaused(false)}
            onFocus={() => setReviewPaused(true)}
            onBlur={() => setReviewPaused(false)}
            style={{ position: 'relative', outline: 'none', borderRadius: 28 }}
            aria-label="Client testimonials carousel. Use left and right arrow keys to navigate."
            aria-live="polite"
          >
            <div style={{
              background: 'rgba(255,255,255,0.05)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.10)',
              borderRadius: 28,
              padding: 'clamp(2.5rem, 5vw, 4rem)',
              maxWidth: 860, margin: '0 auto',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
            }}>
              {/* Quote mark */}
              <div style={{
                position: 'absolute', top: 16, right: 28,
                fontFamily: "'Georgia',serif",
                fontSize: '9rem', color: 'rgba(245,196,179,0.06)',
                lineHeight: 1, pointerEvents: 'none', userSelect: 'none'
              }}>"</div>

              {/* Stars */}
              <div style={{ display: 'flex', gap: 4, marginBottom: '1.5rem' }}>
                {[1,2,3,4,5].map(n => <Star key={n} size={16} fill="#FCD34D" color="#FCD34D" />)}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', color: 'rgba(249,238,228,0.88)',
                lineHeight: 1.88, fontStyle: 'italic',
                marginBottom: '2.5rem', position: 'relative', zIndex: 1,
                minHeight: '5rem'
              }}>
                "{REVIEWS[reviewIdx].text}"
              </p>

              {/* Author */}
              <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                <div style={{
                  width: 54, height: 54, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, var(--bur), var(--bur-d))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F5C4B3', fontWeight: 900, fontSize: '.95rem',
                  fontFamily: "'Sora',sans-serif",
                  border: '2px solid rgba(245,196,179,0.2)'
                }}>{REVIEWS[reviewIdx].init}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                    {REVIEWS[reviewIdx].name}
                  </div>
                  <div style={{
                    fontSize: '.76rem', color: 'rgba(245,196,179,0.55)',
                    display: 'flex', gap: 6, alignItems: 'center', marginTop: 3
                  }}>
                    <MapPin size={11} /> {REVIEWS[reviewIdx].city} · {REVIEWS[reviewIdx].role} · Verified Client
                  </div>
                </div>
              </div>
            </div>

            {/* Nav */}
            <div style={{
              display: 'flex', justifyContent: 'center',
              gap: 14, marginTop: '2.5rem', alignItems: 'center'
            }}>
              <button
                onClick={() => setReviewIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length)}
                aria-label="Previous testimonial"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(245,196,179,0.2)',
                  background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(245,196,179,0.6)', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronLeft size={18} />
              </button>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    aria-label={`Go to testimonial ${i + 1}`}
                    className={`review-dot${i === reviewIdx ? ' active' : ''}`}
                    style={{
                      width: i === reviewIdx ? 26 : 8, height: 8,
                      borderRadius: 4,
                      background: i === reviewIdx ? '#F5C4B3' : 'rgba(245,196,179,0.2)',
                      border: 'none', cursor: 'pointer', padding: 0
                    }}
                  />
                ))}
              </div>

              <button
                onClick={() => setReviewIdx(i => (i + 1) % REVIEWS.length)}
                aria-label="Next testimonial"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  border: '1.5px solid rgba(245,196,179,0.2)',
                  background: 'rgba(255,255,255,0.06)', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(245,196,179,0.6)', backdropFilter: 'blur(8px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 8 — LEGAL NEWS & UPDATES
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 0', background: '#fff' }}>
        <div className="container" ref={newsRef}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)',
              color: 'var(--bur)', fontWeight: 800, fontSize: '.7rem',
              letterSpacing: '3px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Legal Updates</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.9rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.7rem'
            }}>
              Stay informed with <span style={{ color: 'var(--bur)' }}>Indian law updates</span>
            </h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
              Landmark judgments, new legislation, and legal developments that affect everyday Indians.
            </p>
          </div>

          <div className="news-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1.2rem'
          }}>
            {NEWS.map((item, i) => (
              <Link
                key={i}
                to="/knowledge-hub"
                className="news-card"
                style={{
                  textDecoration: 'none', display: 'block',
                  border: '1.5px solid var(--border)',
                  borderRadius: 18, padding: '1.8rem',
                  background: 'var(--cream)',
                  animation: newsVisible ? `fadeUp 0.6s ${i * 0.1}s both` : 'none',
                  opacity: newsVisible ? 1 : 0
                }}
              >
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(123,29,46,0.08)',
                  color: 'var(--bur)', fontWeight: 700,
                  fontSize: '.68rem', letterSpacing: '1.5px',
                  textTransform: 'uppercase', padding: '.28rem .75rem',
                  borderRadius: 30, marginBottom: '1rem'
                }}>{item.tag}</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '.95rem', fontWeight: 800,
                  color: 'var(--txt)', lineHeight: 1.55, marginBottom: '1rem'
                }}>{item.title}</h3>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}>
                  <span style={{ fontSize: '.72rem', color: 'var(--txt-3)', fontWeight: 600 }}>{item.date}</span>
                  <ChevronRight size={14} color="var(--bur)" />
                </div>
              </Link>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/knowledge-hub" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              border: '2px solid var(--bur)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.95rem',
              padding: '.9rem 2.2rem', borderRadius: 14, textDecoration: 'none',
              transition: 'all 0.25s ease'
            }} className="cta-btn">
              Browse All Legal Guides <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 9 — FOR LAWYERS (dramatic split)
      ══════════════════════════════════════════════════════ */}
      <section style={{ padding: '0', position: 'relative', overflow: 'hidden', minHeight: 600 }}>
        {/* BG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero-scales.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: 'brightness(0.18)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(6,1,3,0.97) 0%, rgba(26,10,13,0.85) 100%)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse 80% 80% at -10% 50%, rgba(123,29,46,0.30) 0%, transparent 65%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, padding: '8rem 0' }}>
          <div className="lawyer-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 420px',
            gap: '5rem', alignItems: 'center'
          }}>
            <div>
              <div style={{
                display: 'inline-block', background: 'rgba(245,196,179,0.08)',
                border: '1px solid rgba(245,196,179,0.2)', color: '#F5C4B3',
                fontWeight: 800, fontSize: '.7rem', letterSpacing: '3px',
                textTransform: 'uppercase', padding: '.4rem 1.1rem', borderRadius: 6, marginBottom: '1.3rem'
              }}>For Legal Professionals</div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 900,
                color: '#fff', lineHeight: 1.1, letterSpacing: '-0.035em',
                marginBottom: '1.2rem'
              }}>
                Are You a Lawyer?<br />
                <span style={{ color: '#F5C4B3' }}>Grow Your Practice.</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'rgba(245,224,200,0.65)', lineHeight: 1.85, marginBottom: '2.5rem', maxWidth: 500 }}>
                Join 1,338+ verified advocates on Justice Junction. Set your own fees, get quality client bookings 24/7, and manage your entire practice from one powerful dashboard.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2.8rem' }}>
                {[
                  'Free profile listing — zero upfront cost',
                  'You set your own consultation fee',
                  'Receive verified client bookings 24/7',
                  'Razorpay-secured payouts within 48 hours',
                  'Bar Council verified badge on your profile',
                  'Real-time dashboard for all case tracking'
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(245,196,179,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <CheckCircle2 size={14} color="#F5C4B3" />
                    </div>
                    <span style={{ fontSize: '.92rem', color: 'rgba(245,224,200,0.75)', fontWeight: 600 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/join-as-lawyer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--bur)', color: '#fff', fontWeight: 800, fontSize: '1rem',
                  padding: '1.1rem 2.2rem', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 12px 32px rgba(123,29,46,0.45)'
                }} className="cta-btn">
                  Join as Advocate — Free <ArrowRight size={16} />
                </Link>
                <Link to="/lawyer-plans" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  border: '1.5px solid rgba(245,196,179,0.3)', color: '#F5C4B3',
                  fontWeight: 700, fontSize: '1rem',
                  padding: '1.1rem 2rem', borderRadius: 14, textDecoration: 'none',
                  background: 'rgba(245,196,179,0.06)',
                  backdropFilter: 'blur(8px)'
                }} className="cta-btn">
                  View Plans
                </Link>
              </div>
            </div>

            {/* Earnings card */}
            <div style={{
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(245,196,179,0.15)',
              borderRadius: 28, padding: '3rem 2.5rem', color: '#fff',
              boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
              position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.03,
                backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
                backgroundSize: '20px 20px', pointerEvents: 'none'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  fontSize: '.68rem', fontWeight: 800, color: 'rgba(245,196,179,0.6)',
                  textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 10
                }}>Pro Plan — Avg. Monthly Earnings</div>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2rem, 3vw, 2.8rem)',
                  fontWeight: 900, color: '#fff',
                  letterSpacing: '-0.04em', marginBottom: 5
                }}>₹45K – ₹75K</div>
                <div style={{ fontSize: '.76rem', color: 'rgba(245,196,179,0.45)', marginBottom: '2.2rem' }}>
                  Based on 15–30 consultations at ₹2,500 avg
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.8rem' }}>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem', textAlign: 'center', marginBottom: '2rem'
                  }}>
                    {[['48h', 'Verification'], ['₹0', 'Upfront Cost'], ['Free', 'Registration']].map(([v, l], i) => (
                      <div key={i}>
                        <div style={{
                          fontFamily: "'Sora',sans-serif", fontSize: '1.6rem',
                          fontWeight: 900, color: '#F5C4B3', letterSpacing: '-0.03em'
                        }}>{v}</div>
                        <div style={{
                          fontSize: '.66rem', color: 'rgba(245,196,179,0.45)',
                          fontWeight: 700, marginTop: 5, textTransform: 'uppercase', letterSpacing: '1px'
                        }}>{l}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    background: 'rgba(123,29,46,0.35)',
                    border: '1px solid rgba(245,196,179,0.15)',
                    borderRadius: 12, padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    {[
                      { label: 'This Month Bookings', val: '12 clients' },
                      { label: 'Avg. Rating', val: '4.9 ★' },
                      { label: 'Response Rate', val: '97%' },
                    ].map((stat, i) => (
                      <div key={i} style={{
                        display: 'flex', justifyContent: 'space-between',
                        alignItems: 'center', padding: '.5rem 0',
                        borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none'
                      }}>
                        <span style={{ fontSize: '.78rem', color: 'rgba(245,196,179,0.5)', fontWeight: 600 }}>{stat.label}</span>
                        <span style={{ fontSize: '.78rem', color: '#F5C4B3', fontWeight: 800 }}>{stat.val}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/join-as-lawyer" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    background: 'var(--bur)', border: 'none',
                    color: '#fff', fontWeight: 800, fontSize: '.92rem',
                    padding: '1rem', borderRadius: 12, textDecoration: 'none',
                    boxShadow: '0 8px 24px rgba(123,29,46,0.4)'
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
          SECTION 10 — LIVE STATS BAND
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
          width: 900, height: 900,
          background: 'radial-gradient(circle, rgba(255,255,255,0.04) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.2)', color: '#fff',
              fontWeight: 800, fontSize: '.7rem', letterSpacing: '3px',
              textTransform: 'uppercase', padding: '.4rem 1.1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Live Impact</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
              fontWeight: 900, color: '#fff', letterSpacing: '-0.03em'
            }}>
              Real people. Real results.
            </h2>
          </div>

          <div className="stats-band-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2rem', textAlign: 'center'
          }}>
            {[
              { to: 1338, s: '+', label: 'Lawyers Onboarded' },
              { to: 10000, s: '+', label: 'Cases Resolved' },
              { to: 100, s: '+', label: 'Cities Covered' },
              { to: 4.9, s: '★', label: 'Average Rating', fixed: true },
            ].map((st, i) => (
              <div key={i} style={{ padding: '1rem' }}>
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.2rem, 3.5vw, 3.2rem)',
                  fontWeight: 900, color: '#fff', lineHeight: 1,
                  letterSpacing: '-0.05em', marginBottom: 8
                }}>
                  {st.fixed ? <span>4.9{st.s}</span> : <Counter to={st.to} suffix={st.s} />}
                </div>
                <div style={{
                  fontSize: '.82rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)',
                  textTransform: 'uppercase', letterSpacing: '1.5px'
                }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 11 — FINAL CTA (dual, dark)
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        background: '#060103'
      }}>
        {/* BG */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero-scales.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.08, zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(123,29,46,0.18) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.08)', border: '1px solid rgba(245,196,179,0.2)',
              borderRadius: 30, padding: '.42rem 1.2rem', marginBottom: '1.8rem'
            }}>
              <Scale size={13} color="#F5C4B3" />
              <span style={{
                fontSize: '.7rem', fontWeight: 800, color: '#F5C4B3',
                textTransform: 'uppercase', letterSpacing: '2.5px'
              }}>Justice for Every Indian</span>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.04em', lineHeight: 1.1,
              marginBottom: '1rem'
            }}>
              Ready to resolve your{' '}
              <span style={{ color: '#F5C4B3' }}>legal matters?</span>
            </h2>
            <p style={{
              fontSize: '1.05rem', color: 'rgba(245,224,200,0.5)',
              maxWidth: 500, margin: '0 auto', lineHeight: 1.8
            }}>
              Free to sign up. No hidden fees. Legal help in under 15 minutes.
            </p>
          </div>

          <div className="final-cta-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            maxWidth: 940, margin: '0 auto',
            border: '1px solid rgba(245,196,179,0.10)',
            borderRadius: 30, overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.4)'
          }}>
            {/* Client CTA */}
            <div style={{
              padding: '3.5rem 3rem',
              background: 'linear-gradient(160deg, var(--bur) 0%, var(--bur-d) 100%)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/images/hero-courtroom.jpg)',
                backgroundSize: 'cover',
                opacity: 0.08, mixBlendMode: 'luminosity'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(255,255,255,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.8rem', color: '#F5C4B3'
                }}>
                  <Search size={28} />
                </div>
                <div style={{
                  fontSize: '.68rem', fontWeight: 800, color: 'rgba(245,196,179,0.7)',
                  textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 14
                }}>For Clients</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.6rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1.1rem', lineHeight: 1.2
                }}>Find Your Lawyer Today</h3>
                <p style={{
                  fontSize: '.92rem', color: 'rgba(255,255,255,0.65)',
                  lineHeight: 1.78, marginBottom: '2.2rem'
                }}>
                  Search 1,338+ verified advocates by city and specialty. Free to browse. Book in minutes.
                </p>
                <Link to="/search" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#fff', color: 'var(--bur)',
                  fontWeight: 800, fontSize: '1.02rem',
                  padding: '1.1rem 2.2rem', borderRadius: 14, textDecoration: 'none',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.18)',
                  transition: 'all 0.25s ease'
                }} className="cta-btn">
                  Find a Lawyer <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Lawyer CTA */}
            <div className="final-cta-lawyer" style={{
              padding: '3.5rem 3rem',
              background: 'linear-gradient(160deg, #1A0A0D 0%, #2D1018 100%)',
              borderLeft: '1px solid rgba(245,196,179,0.10)',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'url(/images/lawyer-hero.jpg)',
                backgroundSize: 'cover',
                opacity: 0.08, mixBlendMode: 'luminosity'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: 20,
                  background: 'rgba(245,196,179,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.8rem', color: '#F5C4B3'
                }}>
                  <Gavel size={28} />
                </div>
                <div style={{
                  fontSize: '.68rem', fontWeight: 800, color: 'rgba(245,196,179,0.45)',
                  textTransform: 'uppercase', letterSpacing: '2.5px', marginBottom: 14
                }}>For Lawyers</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '1.6rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1.1rem', lineHeight: 1.2
                }}>Grow Your Practice</h3>
                <p style={{
                  fontSize: '.92rem', color: 'rgba(255,255,255,0.45)',
                  lineHeight: 1.78, marginBottom: '2.2rem'
                }}>
                  List free. Set your fees. Receive 24/7 verified bookings and manage cases with ease.
                </p>
                <Link to="/join-as-lawyer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'rgba(245,196,179,0.12)',
                  border: '1.5px solid rgba(245,196,179,0.3)',
                  backdropFilter: 'blur(12px)',
                  color: '#F5C4B3', fontWeight: 800, fontSize: '1.02rem',
                  padding: '1.1rem 2.2rem', borderRadius: 14, textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }} className="cta-btn">
                  Join as Lawyer <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom trust strip */}
          <div style={{
            display: 'flex', gap: 28, justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '3.5rem'
          }}>
            {[
              { icon: <BadgeCheck size={14} color="#4ADE80" />, t: 'Bar Council Verified' },
              { icon: <Lock size={14} color="#A78BFA" />, t: 'Bank-Grade Encryption' },
              { icon: <Clock size={14} color="#60A5FA" />, t: '24/7 Available' },
              { icon: <Phone size={14} color="#F5C4B3" />, t: 'Emergency Line Active' },
              { icon: <IndianRupee size={14} color="#4ADE80" />, t: 'Zero Hidden Fees' },
            ].map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                {b.icon}
                <span style={{ fontSize: '.76rem', color: 'rgba(255,255,255,0.32)', fontWeight: 700 }}>
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
