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
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Sora:wght@400;700;900&display=swap');

        /* ── Core Keyframes ── */
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes pulseRing { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(2.2);opacity:0} }
        @keyframes marqueeFlow { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
        @keyframes countBand { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }

        /* ── Hero Animations ── */
        @keyframes lightRay1 {
          0%,100% { opacity: 0.12; transform: rotate(-15deg) scaleY(1); }
          50%     { opacity: 0.22; transform: rotate(-15deg) scaleY(1.04); }
        }
        @keyframes lightRay2 {
          0%,100% { opacity: 0.08; transform: rotate(10deg) scaleY(1); }
          50%     { opacity: 0.16; transform: rotate(10deg) scaleY(1.05); }
        }
        @keyframes floatScales {
          0%,100% { transform: translateY(0px) rotate(-2deg); }
          50%     { transform: translateY(-22px) rotate(2deg); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.25; }
          50%     { opacity: 0.5; }
        }
        @keyframes particleDrift {
          0%   { transform: translateY(0) translateX(0); opacity: 0; }
          15%  { opacity: var(--po, 0.7); }
          85%  { opacity: calc(var(--po, 0.7) * 0.3); }
          100% { transform: translateY(-160px) translateX(var(--px, 20px)); opacity: 0; }
        }
        @keyframes scanLine {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes heroTextGlow {
          0%,100% { text-shadow: 0 0 40px rgba(245,196,179,0); }
          50%     { text-shadow: 0 0 40px rgba(245,196,179,0.18); }
        }

        /* ── Staggered Hero Text ── */
        .hero-text-in { animation: fadeUp 1s cubic-bezier(.16,1,.3,1) both; }
        .hero-text-in:nth-child(1){animation-delay:0.1s}
        .hero-text-in:nth-child(2){animation-delay:0.25s}
        .hero-text-in:nth-child(3){animation-delay:0.40s}
        .hero-text-in:nth-child(4){animation-delay:0.55s}
        .hero-text-in:nth-child(5){animation-delay:0.70s}
        .hero-text-in:nth-child(6){animation-delay:0.85s}

        /* ── Practice Area Cards ── */
        .area-card { transition: transform 0.4s cubic-bezier(.23,1,.32,1), box-shadow 0.4s ease; }
        .area-card:hover { transform: translateY(-10px) scale(1.03) !important; box-shadow: 0 40px 70px rgba(0,0,0,0.55) !important; }
        .area-card:hover .area-card-bg { transform: scale(1.18) !important; }
        .area-card:hover .area-overlay { opacity: 1 !important; }
        .area-card:hover .area-arrow { opacity: 1 !important; transform: translateX(5px) !important; }
        .area-card-bg { transition: transform 0.6s ease; }

        /* ── Tool Cards ── */
        .tool-card { transition: all 0.3s cubic-bezier(.23,1,.32,1); }
        .tool-card:hover { transform: translateY(-7px) !important; box-shadow: 0 28px 56px rgba(123,29,46,0.18) !important; border-color: var(--bur) !important; }

        /* ── Why Cards ── */
        .why-card { transition: box-shadow 0.3s ease, border-color 0.3s ease; }
        .why-card:hover { border-color: rgba(123,29,46,0.3) !important; box-shadow: 0 12px 30px rgba(123,29,46,0.10) !important; }
        .why-card.revealed { animation: fadeUp 0.65s cubic-bezier(.16,1,.3,1) both; }

        /* ── Misc UI ── */
        .cta-btn { transition: all 0.25s ease; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 16px 40px rgba(0,0,0,0.25) !important; }
        .review-dot { transition: all 0.3s ease; }
        .review-dot.active { transform: scale(1.3); }
        .news-card { transition: all 0.28s ease; }
        .news-card:hover { border-color: rgba(123,29,46,0.35) !important; transform: translateY(-3px); box-shadow: 0 12px 30px rgba(123,29,46,0.10) !important; }
        .step-icon-wrap { transition: all 0.35s ease; }
        .step-icon-wrap:hover { transform: translateY(-4px) scale(1.08); box-shadow: 0 16px 36px rgba(123,29,46,0.18) !important; }

        /* ── Scrolling Marquee ── */
        .marquee-track { animation: marqueeFlow 38s linear infinite; }

        /* ── Glass effect ── */
        .glass-card {
          background: rgba(255,255,255,0.05);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.10);
        }

        /* ── Particles ── */
        .particle {
          position: absolute;
          width: 4px; height: 4px;
          border-radius: 50%;
          background: rgba(245,196,179,0.65);
          animation: particleDrift var(--dur,7s) var(--delay,0s) infinite ease-out;
        }

        /* ── Hero BG (static, no zoom) ── */
        .hero-bg-img {
          /* no animation — keeps image steady */
        }

        /* ── Light Rays ── */
        .hero-ray-1 { animation: lightRay1 8s ease-in-out infinite; }
        .hero-ray-2 { animation: lightRay2 11s ease-in-out infinite; }

        /* ── Floating scales ── */
        .hero-scales { animation: floatScales 9s ease-in-out infinite; }

        /* ── Cinematic scan line ── */
        .hero-scanline {
          position: absolute; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, rgba(245,196,179,0.12), transparent);
          animation: scanLine 8s linear infinite;
          pointer-events: none; z-index: 4;
        }

        /* ── Step number watermark ── */
        .step-num {
          font-family: 'Sora',sans-serif; font-size: 5.5rem;
          font-weight: 900; color: rgba(123,29,46,0.05);
          position: absolute; top: -1.2rem; left: -0.5rem;
          line-height: 1; pointer-events: none; user-select: none;
        }

        /* ════════════════════════════════════════
           RESPONSIVE — mobile-first, full coverage
           320px → 480px → 640px → 768px → 1024px → 1280px+
        ════════════════════════════════════════ */

        /* Base: container padding */
        .container { padding-left: 1rem !important; padding-right: 1rem !important; }
        @media (min-width: 640px)  { .container { padding-left: 1.5rem !important; padding-right: 1.5rem !important; } }
        @media (min-width: 1024px) { .container { padding-left: 2rem !important; padding-right: 2rem !important; } }
        @media (min-width: 1280px) { .container { padding-left: 3rem !important; padding-right: 3rem !important; } }

        /* ── 320px (tiny phones) ── */
        @media (max-width: 359px) {
          .hero-section { padding-top: 70px !important; min-height: 100svh !important; }
          .hero-dual-cta { flex-direction: column !important; }
          .hero-dual-cta > * { width: 100% !important; justify-content: center !important; text-align: center !important; }
          .hero-search-row { flex-direction: column !important; }
          .hero-search-divider { display: none !important; }
          .hero-scales { display: none !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .stats-band-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .step-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .area-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
        }

        /* ── 360–480px (standard mobile) ── */
        @media (max-width: 480px) {
          .hero-section { min-height: 100svh !important; padding-top: 72px !important; }
          .hero-dual-cta { flex-direction: column !important; gap: 10px !important; }
          .hero-dual-cta > * { width: 100% !important; justify-content: center !important; }
          .hero-search-row { flex-direction: column !important; gap: 0 !important; }
          .hero-search-divider { display: none !important; }
          .hero-scales { display: none !important; }
          .hero-ray-1, .hero-ray-2 { display: none !important; }
          .particle { display: none !important; }
          .stats-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .stats-band-grid { grid-template-columns: 1fr 1fr !important; gap: 1rem !important; }
          .step-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .step-num { display: none !important; }
          .area-grid { grid-template-columns: 1fr !important; }
          .why-grid { grid-template-columns: 1fr !important; gap: 0.9rem !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
          .why-section-img { display: none !important; }
        }

        /* ── 481–640px (large mobile / small phablet) ── */
        @media (min-width: 481px) and (max-width: 640px) {
          .hero-section { min-height: 100svh !important; }
          .hero-dual-cta { flex-direction: column !important; }
          .hero-dual-cta > * { width: 100% !important; justify-content: center !important; }
          .hero-search-row { flex-direction: column !important; }
          .hero-search-divider { display: none !important; }
          .hero-scales { width: 180px !important; height: 180px !important; opacity: 0.06 !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; gap: 0.75rem !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .step-grid { grid-template-columns: 1fr 1fr !important; gap: 2rem !important; }
          .area-grid { grid-template-columns: 1fr 1fr !important; gap: 0.75rem !important; }
          .why-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .tools-grid { grid-template-columns: 1fr !important; }
          .news-grid { grid-template-columns: 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
        }

        /* ── 641–768px (tablets portrait) ── */
        @media (min-width: 641px) and (max-width: 768px) {
          .hero-dual-cta { flex-wrap: wrap !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .step-grid { grid-template-columns: 1fr 1fr !important; }
          .area-grid { grid-template-columns: repeat(2,1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .tools-grid { grid-template-columns: 1fr 1fr !important; }
          .news-grid { grid-template-columns: 1fr 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
          .why-section-img { display: none !important; }
        }

        /* ── 769–1024px (tablets landscape / small laptop) ── */
        @media (min-width: 769px) and (max-width: 1024px) {
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .stats-band-grid { grid-template-columns: repeat(2,1fr) !important; }
          .step-grid { grid-template-columns: repeat(4,1fr) !important; }
          .area-grid { grid-template-columns: repeat(3,1fr) !important; }
          .why-grid { grid-template-columns: 1fr 1fr !important; }
          .tools-grid { grid-template-columns: 1fr 1fr !important; }
          .news-grid { grid-template-columns: 1fr 1fr !important; }
          .lawyer-split { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .final-cta-split { grid-template-columns: 1fr !important; }
          .final-cta-lawyer { border-top: 1px solid rgba(255,255,255,0.08) !important; border-left: none !important; }
        }

        /* ── 1025–1280px (laptop) ── */
        @media (min-width: 1025px) and (max-width: 1280px) {
          .stats-grid { grid-template-columns: repeat(5,1fr) !important; }
          .area-grid { grid-template-columns: repeat(4,1fr) !important; }
          .tools-grid { grid-template-columns: repeat(4,1fr) !important; }
          .news-grid { grid-template-columns: repeat(4,1fr) !important; }
          .lawyer-split { grid-template-columns: 1fr 380px !important; }
        }

        /* ── 1281px+ (desktop / large screens) ── */
        @media (min-width: 1281px) {
          .stats-grid { grid-template-columns: repeat(5,1fr) !important; }
          .area-grid { grid-template-columns: repeat(auto-fill,minmax(210px,1fr)) !important; }
          .tools-grid { grid-template-columns: repeat(4,1fr) !important; }
          .news-grid { grid-template-columns: repeat(4,1fr) !important; }
          .lawyer-split { grid-template-columns: 1fr 420px !important; }
          .final-cta-split { grid-template-columns: 1fr 1fr !important; }
        }

        /* ── Section padding scale ── */
        @media (max-width: 640px) {
          section { padding-top: 4rem !important; padding-bottom: 4rem !important; }
          .hero-section { padding-bottom: 0 !important; }
          .marquee-band { padding: 0.75rem 0 !important; }
        }
        @media (min-width: 641px) and (max-width: 1024px) {
          section { padding-top: 5rem !important; padding-bottom: 5rem !important; }
        }

        /* ── Hero search bar: stack neatly on mobile ── */
        @media (max-width: 640px) {
          .hero-search-box { border-radius: 14px !important; padding: 6px !important; }
          .hero-search-row { flex-direction: column !important; gap: 0 !important; }
          .hero-search-field { width: 100% !important; padding: 12px 14px !important; border-bottom: 1px solid #F3F4F6 !important; }
          .hero-search-btn { width: 100% !important; margin: 8px 0 0 0 !important; justify-content: center !important; height: 48px !important; border-radius: 10px !important; }
          .hero-search-divider { display: none !important; }
        }

        /* ── Trust pills: wrap + smaller on mobile ── */
        @media (max-width: 480px) {
          .trust-pills { gap: 6px !important; }
          .trust-pill { padding: 0.24rem 0.7rem !important; font-size: 0.65rem !important; }
        }

        /* ── Step connector line: hide on mobile ── */
        @media (max-width: 768px) {
          .step-connector { display: none !important; }
        }

        /* ── Testimonial: full-width on mobile ── */
        @media (max-width: 640px) {
          .review-nav-btn { width: 36px !important; height: 36px !important; }
          .review-text { font-size: 0.92rem !important; }
        }

        /* ── Why section: hide right background image on small screens ── */
        @media (max-width: 1024px) {
          .why-section-img { display: none !important; }
        }

        /* ── Lawyer earnings card: full width on tablet ── */
        @media (max-width: 1024px) {
          .lawyer-earnings-card { max-width: 460px !important; margin: 0 auto !important; }
        }

        /* ── Final CTA panels: equal height on mobile ── */
        @media (max-width: 640px) {
          .final-cta-panel { padding: 2.5rem 1.5rem !important; }
        }

        /* ── Stats numbers: don't overflow ── */
        @media (max-width: 480px) {
          .stat-num { font-size: clamp(1.8rem, 6.0vw, 1.9rem) !important; }
        }

        /* ── Marquee: slow down slightly on mobile ── */
        @media (max-width: 640px) {
          .marquee-track { animation-duration: 25s !important; }
        }

        /* ── max-height short screens (landscape phones) ── */
        @media (max-height: 600px) and (max-width: 900px) {
          .hero-section { min-height: auto !important; padding-top: 60px !important; padding-bottom: 2rem !important; }
          .hero-scales { display: none !important; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation: none !important; transition-duration: 0.01ms !important; }
          .hero-text-in { opacity: 1 !important; }
          .why-card.revealed { opacity: 1 !important; }
        }
      `}} />

      {/* ══════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO (Fixed: no overlaps, full-width BG)
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
        {/* ── Layer 0: Slow Ken Burns BG Image ── */}
        <div
          className="hero-bg-img"
          style={{
            position: 'absolute',
            inset: '-8%',
            backgroundImage: 'url(/images/hero-wide-v2.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            zIndex: 0
          }}
        />

        {/* ── Layer 1: Maroon-toned cinematic gradient — matches navbar #7B1D2E at top ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background:
            'linear-gradient(180deg,' +
            'rgba(123,29,46,0.45) 0%,' +
            'rgba(80,18,30,0.40) 30%,' +
            'rgba(50,11,19,0.50) 65%,' +
            'rgba(20,5,10,0.85) 100%)'
        }} />

        {/* ── Layer 2: Warm burgundy glow emanating from left-center ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 65% 70% at 18% 58%,' +
            'rgba(123,29,46,0.40) 0%,' +
            'rgba(61,14,22,0.18) 45%,' +
            'transparent 78%)'
        }} />

        {/* ── Layer 3: Gold-tinted top-right directional light (like a courtroom skylight) ── */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 55% 80% at 80% -5%,' +
            'rgba(232,182,120,0.13) 0%,' +
            'transparent 65%)'
        }} />

        {/* ── Layer 4: Animated CSS light rays (no separate image) ── */}
        <div className="hero-ray-1" style={{
          position: 'absolute', zIndex: 3, pointerEvents: 'none',
          top: '-20%', left: '55%', width: '18%', height: '130%',
          background: 'linear-gradient(180deg, rgba(232,182,120,0.18) 0%, transparent 100%)',
          transform: 'rotate(-15deg)', transformOrigin: 'top center',
          filter: 'blur(28px)'
        }} />
        <div className="hero-ray-2" style={{
          position: 'absolute', zIndex: 3, pointerEvents: 'none',
          top: '-20%', left: '70%', width: '10%', height: '110%',
          background: 'linear-gradient(180deg, rgba(245,196,179,0.12) 0%, transparent 100%)',
          transform: 'rotate(10deg)', transformOrigin: 'top center',
          filter: 'blur(18px)'
        }} />

        {/* ── Layer 5: Cinematic scan-line ── */}
        <div className="hero-scanline" style={{ zIndex: 4 }} />

        {/* ── Layer 6: Animated floating Scales of Justice (SVG — right side, low opacity) ── */}
        <div className="hero-scales" style={{
          display: 'none',
          position: 'absolute', right: '5%', top: '50%',
          width: 'clamp(260px,28vw,420px)', height: 'clamp(260px,28vw,420px)',
          zIndex: 4, opacity: 0.10, pointerEvents: 'none',
          transform: 'translateY(-50%)'
        }}>
          <svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
            {/* Pillar */}
            <line x1="210" y1="390" x2="210" y2="65" stroke="#F5C4B3" strokeWidth="4" strokeLinecap="round"/>
            <rect x="155" y="383" width="110" height="14" rx="7" stroke="#F5C4B3" strokeWidth="3" fill="none"/>
            {/* Crown */}
            <polygon points="210,38 220,62 200,62" stroke="#F5C4B3" strokeWidth="3" fill="none"/>
            <circle cx="210" cy="32" r="7" stroke="#F5C4B3" strokeWidth="2.5" fill="none"/>
            {/* Main beam */}
            <path d="M55 130 Q210 110 365 130" stroke="#F5C4B3" strokeWidth="4" strokeLinecap="round" fill="none"/>
            <circle cx="210" cy="118" r="9" stroke="#F5C4B3" strokeWidth="3" fill="none"/>
            {/* Left chain */}
            <line x1="55" y1="130" x2="30" y2="230" stroke="#F5C4B3" strokeWidth="2.5" strokeDasharray="6 4"/>
            <line x1="55" y1="130" x2="80" y2="230" stroke="#F5C4B3" strokeWidth="2.5" strokeDasharray="6 4"/>
            {/* Left pan */}
            <path d="M18 230 Q55 258 92 230" stroke="#F5C4B3" strokeWidth="3" fill="none"/>
            <line x1="18" y1="230" x2="92" y2="230" stroke="#F5C4B3" strokeWidth="2"/>
            {/* Right chain */}
            <line x1="365" y1="130" x2="340" y2="215" stroke="#F5C4B3" strokeWidth="2.5" strokeDasharray="6 4"/>
            <line x1="365" y1="130" x2="390" y2="215" stroke="#F5C4B3" strokeWidth="2.5" strokeDasharray="6 4"/>
            {/* Right pan (slightly tipped) */}
            <path d="M328 222 Q365 248 402 222" stroke="#F5C4B3" strokeWidth="3" fill="none"/>
            <line x1="328" y1="222" x2="402" y2="222" stroke="#F5C4B3" strokeWidth="2"/>
            {/* Decorative column lines */}
            <line x1="195" y1="150" x2="195" y2="360" stroke="#F5C4B3" strokeWidth="1" strokeDasharray="5 6" opacity="0.5"/>
            <line x1="225" y1="150" x2="225" y2="360" stroke="#F5C4B3" strokeWidth="1" strokeDasharray="5 6" opacity="0.5"/>
          </svg>
        </div>

        {/* ── Layer 7: Floating particles ── */}
        {[
          { left: '8%',  top: '70%', dur: '7s',   delay: '0s',    px: '20px', po: '0.7' },
          { left: '18%', top: '78%', dur: '9.5s',  delay: '1.3s',  px: '-15px', po: '0.5' },
          { left: '32%', top: '82%', dur: '6.5s',  delay: '0.6s',  px: '25px', po: '0.6' },
          { left: '48%', top: '75%', dur: '8s',    delay: '2.1s',  px: '-10px', po: '0.4' },
          { left: '63%', top: '80%', dur: '10s',   delay: '0.9s',  px: '30px', po: '0.5' },
          { left: '76%', top: '72%', dur: '7.8s',  delay: '1.6s',  px: '-20px', po: '0.3' },
          { left: '88%', top: '76%', dur: '9s',    delay: '3.2s',  px: '15px', po: '0.4' },
          { left: '26%', top: '65%', dur: '11s',   delay: '2.8s',  px: '-25px', po: '0.3' },
        ].map((p, i) => (
          <div key={i} className="particle" style={{
            left: p.left, top: p.top, zIndex: 4,
            '--dur': p.dur, '--delay': p.delay,
            '--px': p.px, '--po': p.po
          }} />
        ))}

        {/* ── Layer 8: Bottom fade to cream ── */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 220, zIndex: 5, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent, var(--cream))'
        }} />

        {/* ══ HERO CONTENT ══ */}
        <div className="container" style={{
          position: 'relative', zIndex: 6,
          padding: '3rem 0 clamp(9rem, 16vh, 11rem)',
          maxWidth: 1280
        }}>

          {/* Live badge */}
          <div className="hero-text-in" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'rgba(245,196,179,0.07)',
            border: '1px solid rgba(245,196,179,0.22)',
            borderRadius: 40, padding: '.42rem 1.25rem',
            marginBottom: '2.2rem',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06)'
          }}>
            <div style={{ position: 'relative', width: 8, height: 8, flexShrink: 0 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ADE80' }} />
              <div style={{
                position: 'absolute', inset: -4, borderRadius: '50%',
                border: '1.5px solid #4ADE80',
                animation: 'pulseRing 2s ease-out infinite'
              }} />
            </div>
            <span style={{
              fontSize: '.7rem', fontWeight: 800,
              color: 'rgba(245,196,179,0.88)',
              letterSpacing: '2.5px', textTransform: 'uppercase'
            }}>
              LIVE · India's #1 Legal Marketplace · 24/7 Emergency Access
            </span>
          </div>

          {/* Main headline — maxWidth 640 keeps it clear of SVG on right */}
          <h1 className="hero-text-in" style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.2rem, 3.0vw, 2.8rem)',
            fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em',
            color: '#fff', marginBottom: '1.5rem',
            maxWidth: 640
          }}>
            Find Your <TypingWord />
            <br />
            <span style={{
              fontStyle: 'italic', fontWeight: 600,
              fontSize: '0.82em',
              background: 'linear-gradient(90deg, rgba(255,255,255,0.72) 0%, rgba(245,196,179,0.88) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Anytime. Anywhere in India.
            </span>
          </h1>

          {/* Sub — constrained to 560px */}
          <p className="hero-text-in" style={{
            fontSize: 'clamp(0.9rem, 1.2vw, 1.05rem)',
            color: 'rgba(245,218,196,0.76)', maxWidth: 560, lineHeight: 1.88,
            marginBottom: '2.8rem', fontWeight: 400
          }}>
            India's first 100% price-transparent legal marketplace.{' '}
            <strong style={{ color: '#F5C4B3', fontWeight: 700 }}>1,338+ Bar Council verified advocates</strong>{' '}
            across <strong style={{ color: '#F5C4B3', fontWeight: 700 }}>100+ cities</strong>.
            Instant booking. Encrypted video calls. AI-powered matching.
          </p>

          {/* Hero search bar - Crisp, Sharp, High-Contrast & Ultra-Usable */}
          <div className="hero-text-in hero-search-box" style={{
            background: '#FFFFFF',
            borderRadius: 16,
            padding: '8px',
            marginBottom: '2.5rem',
            maxWidth: 840,
            border: '1px solid rgba(255, 255, 255, 0.9)',
            boxShadow: '0 24px 60px -12px rgba(0, 0, 0, 0.45), 0 4px 16px rgba(0, 0, 0, 0.1)'
          }}>
            <div className="hero-search-row" style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
              
              {/* Field 1: Legal Issue */}
              <div className="hero-search-field" style={{ flex: '1 1 240px', padding: '10px 18px', minWidth: 0 }}>
                <label htmlFor="hero-issue-sel" style={{
                  display: 'block', fontSize: '.64rem', fontWeight: 800,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '1.8px', marginBottom: 4
                }}>Legal Issue</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Scale size={18} color="var(--bur)" style={{ flexShrink: 0, opacity: 0.9 }} />
                  <select
                    id="hero-issue-sel"
                    style={{
                      border: 'none', background: 'none', fontSize: '.95rem',
                      fontWeight: 700, color: '#111827', outline: 'none',
                      cursor: 'pointer', width: '100%', padding: '2px 0'
                    }}
                    value={spec} onChange={e => setSpec(e.target.value)}
                  >
                    <option value="">What do you need help with?</option>
                    {SPECS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Crisp Divider */}
              <div className="hero-search-divider" style={{
                width: 1, height: 42, background: '#E5E7EB',
                flexShrink: 0, margin: '0 4px'
              }} />

              {/* Field 2: City / Pincode */}
              <div className="hero-search-field" style={{ flex: '1 1 210px', padding: '10px 18px', minWidth: 0 }}>
                <label htmlFor="hero-city-inp" style={{
                  display: 'block', fontSize: '.64rem', fontWeight: 800,
                  color: 'var(--bur)', textTransform: 'uppercase',
                  letterSpacing: '1.8px', marginBottom: 4
                }}>City / Pincode</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <MapPin size={18} color="var(--bur)" style={{ flexShrink: 0, opacity: 0.9 }} />
                  <input
                    id="hero-city-inp"
                    style={{
                      border: 'none', background: 'none', fontSize: '.95rem',
                      fontWeight: 700, color: '#111827', outline: 'none',
                      width: '100%', padding: '2px 0'
                    }}
                    placeholder="Delhi, 110001, Mumbai…"
                    value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goSearch()}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={goSearch}
                className="hero-search-btn cta-btn"
                style={{
                  background: 'linear-gradient(135deg, var(--bur) 0%, var(--bur-d) 100%)',
                  color: '#FFFFFF', border: 'none', borderRadius: 12,
                  padding: '0.95rem 2.2rem', fontWeight: 800, fontSize: '.95rem',
                  cursor: 'pointer', flexShrink: 0, margin: '2px',
                  boxShadow: '0 6px 20px rgba(123, 29, 46, 0.4)',
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
              padding: 'clamp(2.5rem, 3.8vw, 3.0rem)',
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
          SECTION 10 — LIVE STATS BAND (Cinematic Upgrade)
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {/* Cinematic Background Image with Parallax */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/supreme-court.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          zIndex: 0
        }} />
        {/* Deep maroon/black cinematic overlay */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(135deg, rgba(10,3,5,0.95) 0%, rgba(90,15,30,0.85) 100%)',
          backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2,
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0,0,0,0.6) 100%)'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.1)',
              border: '1px solid rgba(245,196,179,0.3)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.75rem', letterSpacing: '4px',
              textTransform: 'uppercase', padding: '.5rem 1.4rem', borderRadius: 50, marginBottom: '1.5rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
            }}>
              <Activity size={14} /> Live Impact
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              fontWeight: 900, color: '#fff', letterSpacing: '-0.03em',
              textShadow: '0 10px 30px rgba(0,0,0,0.5)'
            }}>
              Real people. <span style={{ color: '#F5C4B3', fontStyle: 'italic' }}>Real results.</span>
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
              <div key={i} style={{ 
                padding: '2.5rem 1rem', 
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }} className="tool-card">
                <div style={{
                  fontFamily: "'Sora',sans-serif",
                  fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                  fontWeight: 900, color: '#fff', lineHeight: 1,
                  letterSpacing: '-0.04em', marginBottom: 12,
                  textShadow: '0 0 20px rgba(255,255,255,0.3)'
                }}>
                  {st.fixed ? <span>4.9{st.s}</span> : <Counter to={st.to} suffix={st.s} />}
                </div>
                <div style={{
                  fontSize: '.85rem', fontWeight: 700, color: '#F5C4B3',
                  textTransform: 'uppercase', letterSpacing: '2px'
                }}>{st.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          SECTION 11 — FINAL CTA (Cinematic Upgrade)
      ══════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden',
        background: '#060103'
      }}>
        {/* Deep Cinematic Background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/images/hero-courtroom.jpg)',
          backgroundSize: 'cover', backgroundPosition: 'center',
          opacity: 0.35, zIndex: 0, filter: 'grayscale(100%) contrast(1.2)'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'linear-gradient(to bottom, #060103 0%, transparent 25%, transparent 75%, #060103 100%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: 'radial-gradient(circle at 50% 100%, rgba(123,29,46,0.3) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 40, padding: '.5rem 1.5rem', marginBottom: '2rem',
              backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)'
            }}>
              <Scale size={16} color="#F5C4B3" />
              <span style={{
                fontSize: '.75rem', fontWeight: 800, color: '#fff',
                textTransform: 'uppercase', letterSpacing: '3px'
              }}>Justice for Every Indian</span>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans',sans-serif",
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: 900, color: '#fff',
              letterSpacing: '-0.04em', lineHeight: 1.1,
              marginBottom: '1.2rem',
              textShadow: '0 10px 40px rgba(0,0,0,0.6)'
            }}>
              Ready to resolve your <br className="hide-mobile" />
              <span style={{ 
                background: 'linear-gradient(90deg, #F5C4B3 0%, #D4A882 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>legal matters?</span>
            </h2>
            <p style={{
              fontSize: '1.15rem', color: 'rgba(255,255,255,0.7)',
              maxWidth: 580, margin: '0 auto', lineHeight: 1.8
            }}>
              Free to sign up. No hidden fees. Connect with a verified legal expert in under 15 minutes.
            </p>
          </div>

          <div className="final-cta-split" style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem',
            maxWidth: 1000, margin: '0 auto'
          }}>
            {/* Client CTA Panel */}
            <div className="tool-card" style={{
              padding: '4.5rem 3rem',
              background: 'rgba(255,255,255,0.04)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 32,
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.4)'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at top left, rgba(123,29,46,0.4) 0%, transparent 60%)',
                zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 24,
                  background: 'rgba(245,196,179,0.1)',
                  border: '1px solid rgba(245,196,179,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 2rem', color: '#F5C4B3'
                }}>
                  <Search size={32} />
                </div>
                <div style={{
                  fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3',
                  textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16
                }}>For Clients</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '2rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1.2rem', lineHeight: 1.2
                }}>Find Your Lawyer</h3>
                <p style={{
                  fontSize: '1rem', color: 'rgba(255,255,255,0.7)',
                  lineHeight: 1.7, marginBottom: '2.5rem'
                }}>
                  Search 1,338+ verified advocates by city and specialty. Free to browse. Book in minutes.
                </p>
                <Link to="/search" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: '#F5C4B3', color: '#1A0A0D',
                  fontWeight: 800, fontSize: '1.05rem',
                  padding: '1.2rem 2.5rem', borderRadius: 16, textDecoration: 'none',
                  boxShadow: '0 15px 35px rgba(245,196,179,0.25)',
                  transition: 'all 0.3s ease'
                }} className="cta-btn">
                  Search Lawyers <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Lawyer CTA Panel */}
            <div className="tool-card" style={{
              padding: '4.5rem 3rem',
              background: 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 32,
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              boxShadow: '0 30px 60px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                background: 'radial-gradient(circle at top right, rgba(255,255,255,0.08) 0%, transparent 60%)',
                zIndex: 0
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 24,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 2rem', color: '#fff'
                }}>
                  <Gavel size={32} />
                </div>
                <div style={{
                  fontSize: '.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.6)',
                  textTransform: 'uppercase', letterSpacing: '3px', marginBottom: 16
                }}>For Lawyers</div>
                <h3 style={{
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  fontSize: '2rem', fontWeight: 900, color: '#fff',
                  marginBottom: '1.2rem', lineHeight: 1.2
                }}>Grow Your Practice</h3>
                <p style={{
                  fontSize: '1rem', color: 'rgba(255,255,255,0.6)',
                  lineHeight: 1.7, marginBottom: '2.5rem'
                }}>
                  List for free. Set your own fees. Receive 24/7 verified bookings and manage cases.
                </p>
                <Link to="/join-as-lawyer" style={{
                  display: 'inline-flex', alignItems: 'center', gap: 10,
                  background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff', fontWeight: 800, fontSize: '1.05rem',
                  padding: '1.2rem 2.5rem', borderRadius: 16, textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }} className="cta-btn">
                  Join as Lawyer <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>

          {/* Bottom trust strip */}
          <div style={{
            display: 'flex', gap: 28, justifyContent: 'center',
            flexWrap: 'wrap', marginTop: '4.5rem'
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
