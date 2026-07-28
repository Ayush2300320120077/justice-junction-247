import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import {
  ShieldCheck, Search, BarChart2, Calendar, Activity,
  Star, Bot, BadgeCheck, Video, Lock, Clock, Globe,
  ArrowRight, ChevronRight, IndianRupee, Phone,
  CheckCircle2, MapPin, Zap, Users, TrendingUp,
  Scale, Landmark, Award, BookOpen, FileText, MessageSquare
} from 'lucide-react'

/* ─── Animated counter ─────────────────────────────── */
function CountUp({ end, suffix = '', duration = 2000 }) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const num = parseInt(String(end).replace(/\D/g, ''))
        const tick = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          const ease = 1 - Math.pow(1 - p, 4)
          setVal(Math.floor(ease * num))
          if (p < 1) requestAnimationFrame(tick)
          else setVal(num)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [end, duration])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

const SPECS = ['Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law', 'Cyber Law', 'Taxation']

const PRACTICE_AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, Sessions Court trial representation', color: '#7B1D2E' },
  { emoji: '👨‍👩‍👧', name: 'Family & Divorce', desc: 'Divorce, child custody, alimony, maintenance', color: '#8B2535' },
  { emoji: '🏠', name: 'Property Law', desc: 'Title disputes, registry, builder fraud, RERA', color: '#7B1D2E' },
  { emoji: '🏢', name: 'Corporate & Business', desc: 'Contracts, compliance, IP, M&A advisory', color: '#8B2535' },
  { emoji: '🛒', name: 'Consumer Rights', desc: 'Consumer forum, e-commerce fraud, refunds', color: '#7B1D2E' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF, ESIC disputes', color: '#8B2535' },
  { emoji: '💻', name: 'Cyber Law', desc: 'Online fraud, IT Act, cybercrime FIR', color: '#7B1D2E' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax notices, appeals', color: '#8B2535' },
  { emoji: '📋', name: 'Bail & FIR Help', desc: 'Emergency same-day bail & FIR assistance', color: '#7B1D2E' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent divorce', color: '#8B2535' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright protection', color: '#7B1D2E' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery suits, injunctions, damages', color: '#8B2535' },
]

const TESTIMONIALS = [
  { init: 'RG', name: 'Rohit Gupta', city: 'Delhi', stars: 5, text: 'Found a criminal lawyer in 8 minutes. Paid exactly ₹3,500 — no surprises. Real-time case updates gave me peace of mind throughout.' },
  { init: 'AP', name: 'Anjali Patel', city: 'Mumbai', stars: 5, text: 'Going through a divorce is already painful. Justice Junction made the legal side easy. I knew the exact fee before speaking to anyone.' },
  { init: 'SK', name: 'Adv. Suresh Kumar', city: 'Bangalore', stars: 5, text: 'This platform brought me 12 quality clients in my first month as an advocate. Transparent pricing builds trust before the first call.' },
  { init: 'VP', name: 'Vikash Patel', city: 'Ahmedabad', stars: 5, text: 'Needed a corporate lawyer urgently. Booked in minutes, video call the same day. The case update feed is a genuine game-changer.' },
  { init: 'MS', name: 'Meena Sharma', city: 'Jaipur', stars: 5, text: 'My property dispute was stuck for years. Found the right specialist in 10 minutes, had my first consultation the same evening. Incredible.' },
  { init: 'KM', name: 'Karan Mehta', city: 'Hyderabad', stars: 5, text: 'After a cyber fraud incident their specialist guided me step-by-step — FIR filing, bank freeze, recovery. Completely trustworthy service.' },
]

const HOW_STEPS = [
  { n: '01', icon: <Search size={26} />, title: 'Search', desc: 'Enter your city and legal issue. Our AI instantly shows verified specialists matched to your exact situation — no spam, no cold calls.' },
  { n: '02', icon: <BarChart2 size={26} />, title: 'Compare', desc: 'View full profiles with experience, published fees, ratings, languages, and availability. 100% transparent before you decide.' },
  { n: '03', icon: <Calendar size={26} />, title: 'Book', desc: 'Pick your time slot and consult via encrypted video call or in-person. Pay only what was shown upfront — zero surprises.' },
  { n: '04', icon: <Activity size={26} />, title: 'Track', desc: 'Receive live case updates from your lawyer directly on your dashboard. Always know exactly where your case stands.' },
]

export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const [videoLoaded, setVideoLoaded] = useState(false)
  const videoRef = useRef(null)

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (query) p.set('query', query)
    navigate('/search?' + p.toString())
  }

  return (
    <div style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      <Helmet>
        <title>Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help</title>
        <meta name="description" content="Find and book Bar Council verified lawyers across India. Upfront pricing, instant booking, AI-powered matching, encrypted video consultations. Available 24/7." />
        <meta name="keywords" content="lawyer in India, find advocate online, legal help 24/7, book lawyer India, verified advocates, online lawyer consultation" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/" />
        <meta property="og:title" content="Justice Junction 24/7 — Find Verified Lawyers in India" />
        <meta property="og:description" content="India's first price-transparent legal platform. Bar Council verified advocates, AI matching, 24/7 emergency access." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org", "@type": "LegalService",
          "name": "Justice Junction 24/7",
          "url": "https://justice-junction-app.vercel.app/",
          "description": "India's leading verified lawyer discovery platform. Connect with Bar Council verified advocates 24/7.",
          "areaServed": "India", "priceRange": "₹500–₹10,000",
          "founder": { "@type": "Person", "name": "Ayush Kumar" }
        }) }} />
      </Helmet>

      {/* ════════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC VIDEO HERO
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center', paddingTop: 80
      }}>
        {/* Autoplay video background */}
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          onCanPlay={() => setVideoLoaded(true)}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', zIndex: 0,
            opacity: videoLoaded ? 1 : 0, transition: 'opacity 1.5s ease'
          }}
          poster="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90"
        >
          <source src="https://cdn.pixabay.com/video/2020/07/02/44336-436792100_large.mp4" type="video/mp4" />
        </video>

        {/* Fallback image if video fails */}
        {!videoLoaded && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
            backgroundSize: 'cover', backgroundPosition: 'center'
          }} />
        )}

        {/* Multi-layer gradient overlays — prevents ANY text overlap */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(20,8,11,0.92) 0%, rgba(92,21,33,0.82) 55%, rgba(20,8,11,0.90) 100%)' }} />
        {/* Bottom fade to cream */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, zIndex: 2, background: 'linear-gradient(to bottom, transparent 0%, #FDF6EE 100%)' }} />

        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: '8%', right: '-8%', width: 700, height: 700, border: '1px solid rgba(245,196,179,0.08)', borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '13%', right: '-3%', width: 500, height: 500, border: '1px solid rgba(245,196,179,0.06)', borderRadius: '50%', zIndex: 2, pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, padding: '4rem 0 6rem' }}>
          {/* Trust label */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,196,179,0.12)', border: '1px solid rgba(245,196,179,0.3)',
            borderRadius: 40, padding: '.4rem 1.3rem', marginBottom: '2rem', backdropFilter: 'blur(10px)'
          }}>
            <ShieldCheck size={15} color="#F5C4B3" />
            <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3', letterSpacing: '2px', textTransform: 'uppercase' }}>
              India's #1 Bar Council Verified Legal Platform
            </span>
          </div>

          {/* Main headline */}
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.6rem, 6vw, 5.2rem)',
            fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em',
            color: '#fff', maxWidth: 820, marginBottom: '1.5rem'
          }}>
            Find Your Trusted Lawyer —
            <br />
            <span style={{
              background: 'linear-gradient(100deg, #F5C4B3 0%, #E09278 60%, #F5C4B3 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
            }}>
              Anytime. Anywhere in India.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(.95rem, 1.5vw, 1.18rem)', color: 'rgba(249,238,228,0.85)',
            maxWidth: 640, lineHeight: 1.8, marginBottom: '2.5rem', fontWeight: 500
          }}>
            India's first 100% price-transparent legal marketplace. 1,338+ Bar Council verified advocates across 100+ cities. Instant booking, encrypted video calls, AI-powered matching — available 24/7.
          </p>

          {/* Search box */}
          <div style={{
            background: 'rgba(255,255,255,0.97)', borderRadius: 20,
            padding: 10, boxShadow: '0 20px 60px rgba(0,0,0,0.25)',
            border: '1px solid rgba(232,201,168,0.8)', maxWidth: 760,
            marginBottom: '2rem', backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 0, flexWrap: 'wrap'
            }}>
              <div style={{ flex: '1 1 200px', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <label htmlFor="issue-select" style={{ fontSize: '.65rem', fontWeight: 800, color: '#6B4050', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Legal Issue
                </label>
                <select
                  id="issue-select"
                  style={{ border: 'none', background: 'none', fontSize: '1rem', fontWeight: 700, color: '#1A0A0D', outline: 'none', cursor: 'pointer', padding: 0, width: '100%' }}
                  value={spec} onChange={e => setSpec(e.target.value)}
                >
                  <option value="">What do you need help with?</option>
                  {SPECS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div style={{ width: 1, height: 44, background: '#E8C9A8', flexShrink: 0 }} className="mobile-hide" />
              <div style={{ flex: '1 1 180px', padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
                <label htmlFor="city-input" style={{ fontSize: '.65rem', fontWeight: 800, color: '#6B4050', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  City or Pincode
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Search size={16} color="#7B1D2E" style={{ flexShrink: 0 }} />
                  <input
                    id="city-input"
                    style={{ border: 'none', background: 'none', fontSize: '1rem', fontWeight: 700, color: '#1A0A0D', outline: 'none', width: '100%', padding: 0 }}
                    placeholder="Delhi, Mumbai, Bangalore…"
                    value={query} onChange={e => setQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && goSearch()}
                  />
                </div>
              </div>
              <button
                onClick={goSearch}
                style={{
                  background: 'linear-gradient(135deg, #7B1D2E, #5C1521)',
                  color: '#fff', border: 'none', borderRadius: 14,
                  padding: '1rem 2rem', fontWeight: 800, fontSize: '1rem',
                  cursor: 'pointer', flexShrink: 0,
                  boxShadow: '0 8px 20px rgba(123,29,46,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  display: 'flex', alignItems: 'center', gap: 8, margin: 4
                }}
              >
                Find My Lawyer <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Quick trust row */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {[
              { icon: <BadgeCheck size={15} color="#22C55E" />, text: 'Bar Council Verified' },
              { icon: <IndianRupee size={15} color="#F5C4B3" />, text: 'No Hidden Fees' },
              { icon: <Lock size={15} color="#A78BFA" />, text: 'End-to-End Encrypted' },
              { icon: <Clock size={15} color="#60A5FA" />, text: '24/7 Emergency Access' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(8px)', borderRadius: 30, padding: '.35rem .9rem'
              }}>
                {b.icon}
                <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.88)', fontWeight: 700 }}>{b.text}</span>
              </div>
            ))}
          </div>

          {/* AI Assistant chip */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.3)',
              borderRadius: 30, padding: '.45rem 1.2rem', color: '#F5C4B3',
              fontWeight: 700, fontSize: '.82rem', cursor: 'pointer',
              backdropFilter: 'blur(10px)', transition: 'all 0.2s'
            }}
          >
            <Bot size={15} /> Ask AI Legal Assistant — Free
          </button>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 2 — ANIMATED STATS (dark band)
      ════════════════════════════════════════════════════════════ */}
      <section style={{ background: '#1A0A0D', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            {[
              { n: 1338, s: '+', label: 'Verified Advocates' },
              { n: 100,  s: '+', label: 'Cities Covered' },
              { n: 10000,s: '+', label: 'Citizens Helped' },
              { n: 98,   s: '%', label: 'Satisfaction Rate' },
              { n: 15,   s: 'min', label: 'Avg. Emergency Response' },
            ].map((st, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '1rem',
                borderRight: i < 4 ? '1px solid rgba(245,196,179,0.08)' : 'none'
              }}>
                <div style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  fontWeight: 900, color: '#F5C4B3', lineHeight: 1, letterSpacing: '-0.04em'
                }}>
                  <CountUp end={st.n} suffix={st.s} />
                </div>
                <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: 6, fontWeight: 700 }}>
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 3 — PRACTICE AREAS with real bg image
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,246,238,0.96)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Legal Specializations</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.8rem'
            }}>We Cover Every Legal Matter</h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 520, margin: '0 auto' }}>
              Find the right expert — whatever your legal situation. All advocates are Bar Council verified.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {PRACTICE_AREAS.map(area => (
              <Link
                to={`/search?specialization=${encodeURIComponent(area.name)}`}
                key={area.name}
                style={{ textDecoration: 'none' }}
              >
                <div style={{
                  background: '#fff', borderRadius: 16, border: '1px solid var(--border)',
                  padding: '1.4rem', transition: 'all 0.25s ease', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', gap: 8, height: '100%'
                }} className="card-hover">
                  <div style={{
                    background: 'rgba(123,29,46,0.07)', borderRadius: 10,
                    padding: '10px', display: 'inline-flex', alignSelf: 'flex-start'
                  }}>
                    <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{area.emoji}</span>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--txt)' }}>{area.name}</div>
                  <div style={{ fontSize: '.85rem', color: 'var(--txt-3)', lineHeight: 1.5 }}>{area.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--bur)', fontSize: '.78rem', fontWeight: 700, marginTop: 'auto' }}>
                    Find Advocate <ChevronRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 4 — HOW IT WORKS (dark bg with photo)
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,10,13,0.95) 0%, rgba(92,21,33,0.93) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.12)',
              border: '1px solid rgba(245,196,179,0.25)', color: '#F5C4B3',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>The Process</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.03em'
            }}>
              Legal help in <span style={{ color: '#F5C4B3' }}>4 simple steps.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {HOW_STEPS.map((step, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(245,196,179,0.12)',
                borderRadius: 22, padding: '2.5rem 2rem', backdropFilter: 'blur(10px)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', top: '1.2rem', right: '1.5rem',
                  fontFamily: "'Sora', sans-serif",
                  fontSize: '4rem', fontWeight: 900, color: 'rgba(245,196,179,0.07)',
                  lineHeight: 1, letterSpacing: '-0.05em'
                }}>{step.n}</div>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'rgba(245,196,179,0.1)',
                  border: '1px solid rgba(245,196,179,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#F5C4B3', marginBottom: '1.5rem'
                }}>{step.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginBottom: 10 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '.88rem', color: 'rgba(245,224,200,0.7)', lineHeight: 1.75, margin: 0 }}>{step.desc}</p>
                {i < 3 && (
                  <div style={{ position: 'absolute', top: '50%', right: '-14px', transform: 'translateY(-50%)', color: 'rgba(245,196,179,0.25)', fontSize: '1.5rem', zIndex: 2 }} className="mobile-hide">›</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 5 — WHY CHOOSE US
      ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Why Justice Junction</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em', marginBottom: '.8rem'
            }}>Built differently. For India.</h2>
            <p style={{ color: 'var(--txt-3)', fontSize: '1rem', maxWidth: 540, margin: '0 auto' }}>
              We built the platform we wished existed when our own families faced legal crises.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <BadgeCheck size={24} color="var(--bur)" />, title: 'Bar Council Verified', desc: 'Every advocate passes mandatory Bar Council enrollment verification. No unverified listings, ever. Your safety is our non-negotiable.' },
              { icon: <IndianRupee size={24} color="var(--bur)" />, title: 'Zero Hidden Fees', desc: 'Published upfront pricing on every profile. You pay only what you see. Zero platform commission from clients. Zero surprise retainers.' },
              { icon: <Video size={24} color="var(--bur)" />, title: 'Encrypted Video Calls', desc: 'All consultations happen over end-to-end encrypted video. Your case details remain 100% private between you and your advocate.' },
              { icon: <Activity size={24} color="var(--bur)" />, title: 'Real-Time Case Updates', desc: 'Your lawyer posts case progress directly to your dashboard. No more chasing calls or WhatsApp messages for a status update.' },
              { icon: <Globe size={24} color="var(--bur)" />, title: 'Pan-India Network', desc: '1,338+ verified advocates across 100+ cities. Find local expertise in your district or consult remotely from anywhere in India.' },
              { icon: <Clock size={24} color="var(--bur)" />, title: '24/7 Emergency Access', desc: 'Police summons, bail hearings, and criminal matters don\'t follow office hours. Book an emergency advocate at midnight if needed.' },
              { icon: <Bot size={24} color="var(--bur)" />, title: 'AI Legal Assistant', desc: 'Our free AI assistant powered by Indian Bare Acts answers your legal questions instantly and helps you identify the right specialist.' },
              { icon: <FileText size={24} color="var(--bur)" />, title: 'Free Legal Documents', desc: 'Download India-specific legal templates — demand notices, RTI applications, FIR drafts, and contracts. Completely free.' },
            ].map((f, i) => (
              <div key={i} style={{
                background: 'var(--cream)', borderRadius: 20, padding: '2rem 1.8rem',
                border: '1px solid var(--border)', transition: 'all 0.25s ease'
              }} className="card-hover">
                <div style={{
                  width: 52, height: 52, borderRadius: 14, background: 'rgba(123,29,46,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem'
                }}>{f.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 6 — TESTIMONIALS (photo bg)
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,246,238,0.97)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Client Stories</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em'
            }}>
              Trusted by <span style={{ color: 'var(--bur)' }}>thousands</span> across India.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 20, padding: '1.8rem',
                border: '1px solid var(--border)', boxShadow: 'var(--sh)'
              }} className="card-hover">
                <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#FCD34D" color="#FCD34D" />)}
                </div>
                <p style={{ fontSize: '.92rem', color: 'var(--txt-2)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.2rem' }}>
                  "{t.text}"
                </p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: 'var(--bur)', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: '#F5C4B3', fontWeight: 900, fontSize: '.9rem', flexShrink: 0
                  }}>{t.init}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--txt)' }}>{t.name}</div>
                    <div style={{ fontSize: '.75rem', color: 'var(--txt-3)', display: 'flex', gap: 3, alignItems: 'center' }}>
                      <MapPin size={11} /> {t.city} · Verified Client
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ textAlign: 'center', color: '#9CA3AF', fontSize: '.75rem', marginTop: '2rem', fontStyle: 'italic' }}>
            * These are illustrative examples. Verified live reviews appear after consultation completion.
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 7 — FOR LAWYERS (split with photo)
      ════════════════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: 0, right: 0, width: 500, height: 500,
          background: 'radial-gradient(circle at top right, rgba(123,29,46,0.05), transparent 60%)', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }} className="mobile-stack">
            <div>
              <div style={{
                display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
                fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
                textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1.2rem'
              }}>For Legal Professionals</div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 900,
                color: 'var(--txt)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.2rem'
              }}>
                Are You a Lawyer?<br />
                <span style={{ color: 'var(--bur)' }}>Grow Your Practice.</span>
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--txt-3)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Join 1,338+ verified advocates on Justice Junction. Get quality client bookings 24/7, set your own fees, and manage your entire practice from one powerful dashboard.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: '2.5rem' }}>
                {[
                  'Free profile listing — zero upfront cost',
                  'You set your own consultation fee',
                  'Receive verified client bookings 24/7',
                  'Razorpay-secured payouts within 48 hours',
                  'Bar Council verified badge on your profile',
                  'Real-time dashboard for case tracking',
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(123,29,46,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <CheckCircle2 size={13} color="var(--bur)" />
                    </div>
                    <span style={{ fontSize: '.92rem', color: 'var(--txt-2)', fontWeight: 600 }}>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link to="/join-as-lawyer" className="btn btn-primary" style={{ padding: '1rem 2rem', borderRadius: 14, fontWeight: 800, fontSize: '1rem' }}>
                  Join as Advocate — Free <ArrowRight size={16} />
                </Link>
                <Link to="/lawyer-plans" className="btn btn-secondary" style={{ padding: '1rem 2rem', borderRadius: 14, fontWeight: 700, fontSize: '1rem' }}>
                  View Pricing Plans
                </Link>
              </div>
            </div>

            {/* Earning card */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{
                background: 'linear-gradient(160deg, #7B1D2E 0%, #3D0E16 100%)',
                borderRadius: 28, padding: '2.5rem', color: '#fff',
                boxShadow: '0 24px 60px rgba(123,29,46,0.25)',
                position: 'relative', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute', inset: 0, opacity: 0.05,
                  backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                  backgroundSize: '20px 20px'
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.8rem' }}>
                    Pro Plan — Avg. Monthly Earnings
                  </div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em', marginBottom: '0.5rem' }}>
                    ₹45,000 – ₹75,000
                  </div>
                  <div style={{ fontSize: '.78rem', color: 'rgba(245,196,179,0.7)', marginBottom: '2rem' }}>Based on 15–30 consultations at ₹2,500 avg</div>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.12)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', textAlign: 'center' }}>
                      {[['48h', 'Verification'], ['0%', 'Upfront Fee'], ['Free', 'To Register']].map(([v, l], i) => (
                        <div key={i}>
                          <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.4rem', fontWeight: 900, color: '#fff' }}>{v}</div>
                          <div style={{ fontSize: '.72rem', color: 'rgba(245,196,179,0.7)', fontWeight: 700, marginTop: 4 }}>{l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Real photo of courtroom */}
              <div style={{
                borderRadius: 20, overflow: 'hidden', height: 200,
                backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=800&q=80')`,
                backgroundSize: 'cover', backgroundPosition: 'center top',
                boxShadow: 'var(--sh-lg)'
              }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
          SECTION 8 — FINAL CTA (cinematic dark)
      ════════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden', textAlign: 'center',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
        backgroundSize: 'cover', backgroundPosition: 'center 60%'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(20,8,11,0.97) 0%, rgba(92,21,33,0.96) 100%)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
          width: 900, height: 900,
          background: 'radial-gradient(circle, rgba(245,196,179,0.05) 0%, transparent 60%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 750, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.25)',
              borderRadius: 30, padding: '.4rem 1.2rem', marginBottom: '1.5rem'
            }}>
              <Scale size={14} color="#F5C4B3" />
              <span style={{ fontSize: '.74rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Justice for Every Indian
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1.2rem'
            }}>
              Ready to resolve your<br />
              <span style={{ color: '#F5C4B3' }}>legal matters today?</span>
            </h2>
            <p style={{
              fontSize: '1.05rem', color: 'rgba(245,224,200,0.78)',
              marginBottom: '2.5rem', lineHeight: 1.8, maxWidth: 600, margin: '0 auto 2.5rem'
            }}>
              Join thousands of Indians who found their trusted legal advocate on Justice Junction 24/7. Free to sign up. No hidden fees. Legal help in under 15 minutes.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #F5C4B3, #E09278)',
                color: '#1A0A0D', fontWeight: 800, padding: '1.1rem 2.5rem',
                borderRadius: 14, textDecoration: 'none', fontSize: '1.05rem',
                boxShadow: '0 12px 30px rgba(245,196,179,0.3)'
              }}>
                Find My Lawyer Now <ArrowRight size={18} />
              </Link>
              <Link to="/register?role=lawyer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)', color: '#fff', fontWeight: 700,
                padding: '1.1rem 2.5rem', borderRadius: 14, textDecoration: 'none', fontSize: '1.05rem'
              }}>
                Join as Advocate <ChevronRight size={18} />
              </Link>
            </div>
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <BadgeCheck size={14} color="#22C55E" />, text: 'Bar Council Verified' },
                { icon: <Lock size={14} color="#A78BFA" />, text: 'Bank-Grade Encryption' },
                { icon: <Clock size={14} color="#60A5FA" />, text: '24/7 Available' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {b.icon}
                  <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
