import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Shield, Clock, Users, Award, Scale, Target, Globe, Zap,
  CheckCircle2, Quote, ArrowRight, Star, Phone, Mail,
  TrendingUp, Building2, Briefcase, BookOpen, Heart,
  GraduationCap, Landmark, BadgeCheck, ChevronRight
} from 'lucide-react'

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const endNum = parseInt(end.replace(/[^0-9]/g, ''))
        const step = (now) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.floor(eased * endNum))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  const display = end.includes('+') ? count.toLocaleString() + '+' : count.toLocaleString()
  return <span ref={ref}>{display}{suffix}</span>
}

const TIMELINE = [
  {
    year: 'Jan 2024',
    title: 'The Spark',
    desc: 'Ayush Kumar witnessed firsthand how difficult it was for ordinary families to find trustworthy legal help. After interviewing 200+ citizens across Delhi, UP, and Mumbai, the vision was born.',
    icon: '💡'
  },
  {
    year: 'Apr 2024',
    title: 'Platform Built',
    desc: 'The first version of Justice Junction 24/7 went live with Bar Council verification, encrypted video consultations, Razorpay secure payments, and a 24/7 case tracking dashboard.',
    icon: '🚀'
  },
  {
    year: 'Sep 2024',
    title: '100 Advocates Milestone',
    desc: 'Reached 100 verified advocates across 10 major Indian cities. Client satisfaction rate hit 98%. Average response time under 15 minutes for emergency legal matters.',
    icon: '🏆'
  },
  {
    year: '2025',
    title: 'AI & National Scale',
    desc: 'Integrated RAG-powered AI Legal Assistant and intelligent legal issue classifier. Expanded to 100+ cities. 1,300+ verified advocates. Target: 10,000 advocates by 2026.',
    icon: '🤖'
  }
]

const PRESS = [
  { name: 'Legal India', tagline: '"India\'s most trusted legal marketplace"' },
  { name: 'Startup India', tagline: '"Bridging the justice gap"' },
  { name: 'YourStory', tagline: '"Legal-tech innovator to watch"' },
  { name: 'Bar Council', tagline: '"Verified & fully compliant"' },
]

const TEAM = [
  {
    initials: 'AK',
    name: 'Ayush Kumar',
    role: 'Founder & CEO',
    bio: 'Visionary entrepreneur and legal-tech pioneer. Founded Justice Junction 24/7 to eliminate opacity in India\'s legal market, making verified legal counsel accessible, affordable, and transparent for every Indian citizen.',
    tags: ['Legal Strategy', 'Product Vision', 'Fundraising'],
    linkedin: '#'
  },
]

export default function About() {
  return (
    <div style={{ background: 'var(--cream)', color: 'var(--txt)', fontFamily: 'var(--font-body)' }}>
      <Helmet>
        <title>About Us | Ayush Kumar — Founder & CEO | Justice Junction 24/7</title>
        <meta name="description" content="Justice Junction 24/7 was founded by Ayush Kumar to democratize legal access across India. Bar Council verified advocates, transparent pricing, AI-powered legal assistance." />
        <meta property="og:title" content="About Us | Justice Junction 24/7 — Founded by Ayush Kumar" />
        <meta property="og:description" content="Ayush Kumar, Founder & CEO, built India's leading legal marketplace. Discover our mission, values, and team." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/about" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ═══════════════════════════════════════════════════
          HERO — Parallax Judicial Courtroom Background
      ═══════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '92vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 30%',
        backgroundAttachment: 'fixed'
      }}>
        {/* Multi-layer overlay for depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(26,10,13,0.95) 0%, rgba(123,29,46,0.88) 50%, rgba(92,21,33,0.95) 100%)',
          zIndex: 1
        }} />
        {/* Subtle grain texture */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px'
        }} />
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '20%', right: '15%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(245,196,179,0.12) 0%, transparent 65%)',
          zIndex: 2, borderRadius: '50%'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, padding: '6rem 0' }}>
          <div style={{ maxWidth: 850 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.1)',
              border: '1px solid rgba(245,196,179,0.3)',
              borderRadius: 30, padding: '.4rem 1.1rem',
              marginBottom: '1.8rem', backdropFilter: 'blur(8px)'
            }}>
              <Landmark size={14} color="#F5C4B3" />
              <span style={{ fontSize: '.78rem', fontWeight: 800, letterSpacing: '2px', color: '#F5C4B3', textTransform: 'uppercase' }}>
                India's Most Trusted Legal Marketplace
              </span>
            </div>

            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2.6rem, 5.5vw, 4.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#fff',
              marginBottom: '1.5rem'
            }}>
              Democratizing Legal Access<br />
              <span style={{
                background: 'linear-gradient(90deg, #F5C4B3, #E8A990)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>for Every Indian Citizen.</span>
            </h1>

            <p style={{
              fontSize: '1.2rem', color: 'rgba(245,224,200,0.85)',
              maxWidth: 680, lineHeight: 1.75, marginBottom: '2.5rem'
            }}>
              Founded in 2024 by <strong style={{ color: '#F5C4B3' }}>Ayush Kumar</strong>, Justice Junction 24/7 bridges the gap between ordinary citizens and quality legal help — with verified advocates, transparent pricing, and 24/7 emergency support.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #F5C4B3, #E8A990)',
                color: '#1A0A0D', fontWeight: 800, fontSize: '1rem',
                padding: '1rem 2rem', borderRadius: 12, border: 'none',
                boxShadow: '0 8px 24px rgba(245,196,179,0.3)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                textDecoration: 'none'
              }}>
                Find a Verified Lawyer <ArrowRight size={18} />
              </Link>
              <a href="#founder" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(10px)',
                color: '#fff', fontWeight: 700, fontSize: '1rem',
                padding: '1rem 2rem', borderRadius: 12,
                textDecoration: 'none'
              }}>
                Our Story <ChevronRight size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Floating trust badges */}
        <div style={{
          position: 'absolute', bottom: '3rem', right: '2rem',
          display: 'flex', flexDirection: 'column', gap: 12, zIndex: 3
        }} className="mobile-hide">
          {[
            { icon: <BadgeCheck size={16} color="#22C55E" />, text: 'Bar Council Verified' },
            { icon: <Shield size={16} color="#F5C4B3" />, text: 'Govt. Compliant Platform' },
            { icon: <Star size={16} color="#FCD34D" />, text: '4.9★ Rated by Clients' },
          ].map((b, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.09)',
              border: '1px solid rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: 30, padding: '.45rem 1rem'
            }}>
              {b.icon}
              <span style={{ fontSize: '.78rem', color: '#F5E0C8', fontWeight: 700 }}>{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STATS STRIP
      ═══════════════════════════════════════════════════ */}
      <section style={{ background: '#1A0A0D', padding: '3.5rem 0' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '2rem', textAlign: 'center'
          }}>
            {[
              { num: '1300+', label: 'Verified Advocates' },
              { num: '100+',  label: 'Cities Covered' },
              { num: '10000+', label: 'Citizens Helped' },
              { num: '98',   label: '% Client Satisfaction', suffix: '%' },
              { num: '24',   label: '/ 7 Legal Support', suffix: '/7' },
            ].map((s, i) => (
              <div key={i} style={{ borderRight: i < 4 ? '1px solid rgba(245,196,179,0.1)' : 'none', padding: '0 1rem' }}>
                <div style={{
                  fontFamily: 'var(--font-number)',
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  fontWeight: 900, color: '#F5C4B3',
                  letterSpacing: '-0.03em', lineHeight: 1
                }}>
                  <CountUp end={s.num} suffix={s.suffix || ''} />
                </div>
                <div style={{
                  fontSize: '.72rem', fontWeight: 800,
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  color: 'rgba(255,255,255,0.5)', marginTop: 6
                }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MISSION — with court/law book background
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative corner element */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 400, height: 400,
          background: 'radial-gradient(circle at top right, rgba(123,29,46,0.05), transparent 70%)',
          pointerEvents: 'none'
        }} />
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            gap: '5rem', alignItems: 'center'
          }} className="mobile-stack">
            {/* Left: Text */}
            <div>
              <div style={{
                display: 'inline-block',
                background: 'rgba(123,29,46,0.07)',
                color: 'var(--bur)', fontWeight: 800, fontSize: '.78rem',
                letterSpacing: '2px', textTransform: 'uppercase',
                padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1.2rem'
              }}>Our Mission</div>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 900,
                color: 'var(--txt)', lineHeight: 1.15, marginBottom: '1.5rem',
                letterSpacing: '-0.02em'
              }}>
                Legal help should be a right, <em style={{ color: 'var(--bur)', fontStyle: 'normal' }}>not a privilege.</em>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                In India today, finding a trustworthy lawyer is plagued by opacity — inconsistent fees, unverified credentials, and no clear way to compare practitioners. Most citizens feel completely lost when they face a legal crisis.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                Justice Junction 24/7 changes that entirely. We use cutting-edge technology — AI issue classification, RAG-powered legal guidance, encrypted video consultations — to put citizens on equal footing with India's legal system.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  'Multi-step Bar Council license verification',
                  'Upfront fixed fees — no hidden charges',
                  'AI-matched specialists for your legal issue',
                  'Emergency response within 15 minutes',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: 'rgba(123,29,46,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      <CheckCircle2 size={14} color="var(--bur)" />
                    </div>
                    <span style={{ fontSize: '.95rem', color: 'var(--txt-2)', fontWeight: 600 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Photo + overlay card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 24,
                overflow: 'hidden',
                boxShadow: 'var(--sh-xl)',
                height: 500,
                backgroundImage: `url('https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=900&q=85')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }} />
              {/* Overlay quote card */}
              <div style={{
                position: 'absolute', bottom: -24, left: -24,
                background: '#fff', borderRadius: 18,
                padding: '1.4rem 1.6rem',
                boxShadow: '0 20px 50px rgba(123,29,46,0.15)',
                border: '1px solid var(--border)',
                maxWidth: 280
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={14} fill="#FCD34D" color="#FCD34D" />)}
                </div>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-2)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                  "Found a verified criminal lawyer in under 10 minutes. Justice Junction is a lifesaver."
                </p>
                <div style={{ fontSize: '.75rem', color: 'var(--txt-3)', fontWeight: 700, marginTop: 8 }}>
                  — Verified Client, Delhi
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOUNDER & CEO — Ayush Kumar Deep Spotlight
      ═══════════════════════════════════════════════════ */}
      <section id="founder" style={{
        padding: '7rem 0',
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(253,246,238,0.97) 0%, rgba(248,234,218,0.98) 100%)',
          zIndex: 1
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.75rem', letterSpacing: '2px',
              textTransform: 'uppercase', padding: '.4rem 1rem', borderRadius: 6,
              marginBottom: '1rem'
            }}>
              <Award size={14} /> Leadership
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.02em'
            }}>
              Meet the <span style={{ color: 'var(--bur)' }}>Founder & CEO</span>
            </h2>
          </div>

          <div style={{
            background: '#fff',
            borderRadius: 28,
            boxShadow: '0 25px 60px rgba(123,29,46,0.1)',
            border: '1px solid var(--border)',
            overflow: 'hidden',
            display: 'grid',
            gridTemplateColumns: '360px 1fr'
          }} className="mobile-stack">
            {/* Left burgundy panel */}
            <div style={{
              background: 'linear-gradient(160deg, #7B1D2E 0%, #3D0E16 100%)',
              padding: '3.5rem 2.5rem',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              textAlign: 'center', position: 'relative', overflow: 'hidden'
            }}>
              {/* Subtle pattern */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.06,
                backgroundImage: 'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
                backgroundSize: '20px 20px'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Avatar */}
                <div style={{
                  width: 140, height: 140, borderRadius: 24,
                  background: 'rgba(245,196,179,0.15)',
                  border: '3px solid rgba(245,196,179,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '3.5rem', fontWeight: 900,
                    color: '#F5C4B3', letterSpacing: '-2px'
                  }}>AK</span>
                </div>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.7rem', fontWeight: 900,
                  color: '#fff', marginBottom: 6, letterSpacing: '-0.01em'
                }}>Ayush Kumar</h3>

                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,196,179,0.15)',
                  border: '1px solid rgba(245,196,179,0.3)',
                  borderRadius: 20, padding: '.35rem .9rem',
                  marginBottom: '2rem'
                }}>
                  <Award size={14} color="#F5C4B3" />
                  <span style={{ fontSize: '.78rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                    Founder & CEO
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { icon: <Building2 size={14} />, text: 'Justice Junction 24/7' },
                    { icon: <Globe size={14} />, text: 'Pan-India Operations' },
                    { icon: <Briefcase size={14} />, text: 'Legal-Tech Entrepreneur' },
                    { icon: <GraduationCap size={14} />, text: 'Advocate for Equal Justice' },
                  ].map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      color: 'rgba(245,224,200,0.75)', fontSize: '.82rem', fontWeight: 600
                    }}>
                      <span style={{ color: '#F5C4B3' }}>{item.icon}</span>
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right content panel */}
            <div style={{ padding: '3.5rem 3rem' }}>
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                marginBottom: '1.8rem'
              }}>
                <Quote size={32} color="var(--bur)" style={{ flexShrink: 0, opacity: 0.6, marginTop: 4 }} />
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem', color: 'var(--txt)',
                  lineHeight: 1.8, fontStyle: 'italic', fontWeight: 600
                }}>
                  "I started Justice Junction after watching my own family struggle to find a reliable lawyer during a property dispute in Ghaziabad. We spent weeks asking friends for referrals, received wildly inconsistent quotes, and had absolutely no way to verify anyone's credentials. Legal help in India was opaque, expensive, and inaccessible to ordinary people.
                  <br /><br />
                  I built Justice Junction to change exactly that — to make finding a verified, fairly-priced lawyer as easy as booking a cab. Every feature on this platform exists to give power back to the citizen."
                </p>
              </div>

              <div style={{
                borderLeft: '3px solid var(--bur)',
                paddingLeft: '1.2rem', marginBottom: '2rem'
              }}>
                <div style={{ fontSize: '.85rem', fontWeight: 800, color: 'var(--bur)' }}>
                  Ayush Kumar
                </div>
                <div style={{ fontSize: '.8rem', color: 'var(--txt-3)', fontWeight: 600 }}>
                  Founder & CEO, Justice Junction 24/7
                </div>
              </div>

              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem'
              }}>
                {[
                  { num: '2024', label: 'Founded' },
                  { num: '1,300+', label: 'Advocates Onboarded' },
                  { num: '10K+', label: 'Citizens Helped' },
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--cream)', borderRadius: 14,
                    padding: '1.2rem', textAlign: 'center',
                    border: '1px solid var(--border)'
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-number)',
                      fontSize: '1.5rem', fontWeight: 900,
                      color: 'var(--bur)', letterSpacing: '-0.03em'
                    }}>{stat.num}</div>
                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          WHAT MAKES US DIFFERENT — Platform Pillars
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.78rem', letterSpacing: '2px',
              textTransform: 'uppercase', padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Why Justice Junction</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.02em'
            }}>
              Built differently. For India.
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', maxWidth: 580, margin: '1rem auto 0', lineHeight: 1.75 }}>
              Every feature is designed around the specific challenges Indian citizens face when seeking legal help.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.5rem'
          }}>
            {[
              { icon: <BadgeCheck size={26} color="var(--bur)" />, title: 'Bar Council Verified', desc: 'Every advocate passes multi-step Bar Council license verification before appearing on our platform. No unverified listings.' },
              { icon: <Scale size={26} color="var(--bur)" />, title: 'Transparent Fixed Fees', desc: 'Consultation fees are published upfront on every advocate profile. No surprises, no hidden retainers.' },
              { icon: <Clock size={26} color="var(--bur)" />, title: '24/7 Emergency Access', desc: 'Criminal matters, bail hearings, and police summons don\'t respect business hours. Our advocates are available around the clock.' },
              { icon: <Zap size={26} color="var(--bur)" />, title: 'AI Legal Matching', desc: 'Our proprietary AI classifier instantly matches your legal issue to the right specialist across 12 practice areas.' },
              { icon: <BookOpen size={26} color="var(--bur)" />, title: 'Legal Knowledge Hub', desc: 'Access plain-language guides on Indian laws, your rights, case templates, and legal documents — completely free.' },
              { icon: <Heart size={26} color="var(--bur)" />, title: 'Citizen-First Design', desc: 'No legal jargon, no intimidating forms. Every part of our product is designed for the ordinary Indian citizen.' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'var(--cream)',
                borderRadius: 20, padding: '2.2rem 2rem',
                border: '1px solid var(--border)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                cursor: 'default'
              }} className="card-hover">
                <div style={{
                  width: 54, height: 54, borderRadius: 14,
                  background: 'rgba(123,29,46,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: '1.3rem'
                }}>
                  {item.icon}
                </div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.2rem', fontWeight: 800,
                  color: 'var(--txt)', marginBottom: '.6rem', letterSpacing: '-0.01em'
                }}>{item.title}</h3>
                <p style={{ fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          JOURNEY TIMELINE — with background
      ═══════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0',
        position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(26,10,13,0.94) 0%, rgba(92,21,33,0.96) 100%)',
          zIndex: 1
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(245,196,179,0.12)',
              border: '1px solid rgba(245,196,179,0.3)',
              color: '#F5C4B3', fontWeight: 800, fontSize: '.78rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Our Journey</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)',
              fontWeight: 900, color: '#fff', letterSpacing: '-0.02em'
            }}>Building India's Legal Future</h2>
          </div>

          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            {TIMELINE.map((item, i) => (
              <div key={i} style={{
                display: 'flex', gap: '2rem',
                marginBottom: i < TIMELINE.length - 1 ? '3rem' : 0,
                alignItems: 'flex-start'
              }}>
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: 'rgba(245,196,179,0.12)',
                    border: '1px solid rgba(245,196,179,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem'
                  }}>{item.icon}</div>
                  {i < TIMELINE.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: 'rgba(245,196,179,0.15)', minHeight: '2.5rem', marginTop: 8 }} />
                  )}
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(245,196,179,0.12)',
                  borderRadius: 16, padding: '1.5rem 1.8rem',
                  backdropFilter: 'blur(10px)', flex: 1
                }}>
                  <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 4 }}>
                    {item.year}
                  </div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '.92rem', color: 'rgba(245,224,200,0.75)', lineHeight: 1.75, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          VISION 2026
      ═══════════════════════════════════════════════════ */}
      <section style={{ padding: '7rem 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block',
              background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.78rem', letterSpacing: '2px',
              textTransform: 'uppercase', padding: '.4rem 1rem', borderRadius: 6, marginBottom: '1rem'
            }}>Looking Ahead</div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.02em'
            }}>
              Our Vision for <span style={{ color: 'var(--bur)' }}>2026</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
            {[
              { icon: <Target size={28} />, num: '10,000+', title: 'Verified Advocates', desc: 'Across all 28 states and 8 union territories' },
              { icon: <Users size={28} />,  num: '1 Million', title: 'Indians Served', desc: 'With transparent, affordable legal help' },
              { icon: <Globe size={28} />,  num: '12+', title: 'Regional Languages', desc: 'Hindi + major regional language support' },
              { icon: <TrendingUp size={28} />, num: '₹200Cr+', title: 'Legal Fees Saved', desc: 'Through transparent pricing and competition' },
            ].map((item, i) => (
              <div key={i} style={{
                background: '#fff',
                borderRadius: 20, padding: '2.5rem 2rem',
                border: '1px solid var(--border)',
                textAlign: 'center',
                boxShadow: 'var(--sh)'
              }} className="card-hover">
                <div style={{
                  width: 60, height: 60, borderRadius: '50%',
                  background: 'rgba(123,29,46,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bur)', margin: '0 auto 1.2rem'
                }}>{item.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-number)',
                  fontSize: '2rem', fontWeight: 900,
                  color: 'var(--bur)', letterSpacing: '-0.03em', marginBottom: 4
                }}>{item.num}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          HIRING / CTA — Dark rich section
      ═══════════════════════════════════════════════════ */}
      <section style={{
        padding: '6rem 0',
        backgroundImage: `linear-gradient(135deg, rgba(26,10,13,0.97) 0%, rgba(92,21,33,0.97) 100%), url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center',
        color: '#fff', textAlign: 'center', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-50%', left: '50%', transform: 'translateX(-50%)',
          width: 700, height: 700,
          background: 'radial-gradient(circle, rgba(245,196,179,0.07) 0%, transparent 65%)',
          borderRadius: '50%', pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.25)',
              borderRadius: 30, padding: '.4rem 1.1rem', marginBottom: '1.5rem'
            }}>
              <Heart size={14} color="#F5C4B3" />
              <span style={{ fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3', textTransform: 'uppercase', letterSpacing: '2px' }}>
                Justice for Every Indian
              </span>
            </div>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900,
              color: '#fff', letterSpacing: '-0.02em', marginBottom: '1rem'
            }}>
              Join us in making legal help <span style={{ color: '#F5C4B3' }}>accessible, transparent & fair.</span>
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'rgba(245,224,200,0.8)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
              We're growing rapidly across India. Whether you're a citizen seeking help, an advocate who wants to reach more clients, or a legal-tech enthusiast — come build with us.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/search" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'linear-gradient(135deg, #F5C4B3, #E8A990)',
                color: '#1A0A0D', fontWeight: 800, padding: '1rem 2rem',
                borderRadius: 12, textDecoration: 'none', border: 'none',
                boxShadow: '0 8px 20px rgba(245,196,179,0.25)'
              }}>
                Find a Lawyer Now <ArrowRight size={18} />
              </Link>
              <Link to="/join-as-lawyer" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'transparent',
                border: '1px solid rgba(245,196,179,0.4)',
                color: '#F5C4B3', fontWeight: 700, padding: '1rem 2rem',
                borderRadius: 12, textDecoration: 'none'
              }}>
                Join as Advocate <ChevronRight size={18} />
              </Link>
              <a href="mailto:supportjusticejunction@gmail.com" style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.8)', fontWeight: 700, padding: '1rem 2rem',
                borderRadius: 12, textDecoration: 'none'
              }}>
                <Mail size={16} /> Contact Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
