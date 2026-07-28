import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import {
  Shield, Clock, Users, Award, Scale, Target, Globe, Zap,
  CheckCircle2, Quote, ArrowRight, Star, Phone, Mail,
  TrendingUp, Building2, Briefcase, BookOpen, Heart,
  GraduationCap, Landmark, BadgeCheck, ChevronRight,
  MapPin, Video, FileText, Lock, Cpu, UserCheck,
  MessageSquare, IndianRupee, Trophy, Sparkles
} from 'lucide-react'

/* ── Animated counter hook ─────────────────────────── */
function useCountUp(target, duration = 2200) {
  const [val, setVal] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const step = (now) => {
          const p = Math.min((now - t0) / duration, 1)
          const eased = 1 - Math.pow(1 - p, 4)
          setVal(Math.floor(eased * target))
          if (p < 1) requestAnimationFrame(step)
          else setVal(target)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.25 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [target, duration])
  return [val, ref]
}

function Stat({ num, suffix = '', label, color = '#F5C4B3' }) {
  const [v, ref] = useCountUp(num)
  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: "'Sora', sans-serif",
        fontSize: 'clamp(2.2rem, 4vw, 3.2rem)',
        fontWeight: 900, color, lineHeight: 1, letterSpacing: '-0.04em'
      }}>{v.toLocaleString()}{suffix}</div>
    </div>
  )
}

const PILLARS = [
  { icon: <BadgeCheck size={24} />, title: 'Bar Council Verified', desc: 'Every advocate undergoes mandatory Bar Council enrollment verification, credential checks, and background screening before listing.' },
  { icon: <IndianRupee size={24} />, title: 'Transparent Fixed Fees', desc: 'All consultation fees are published upfront. Zero hidden retainers, zero surprise billing. What you see is exactly what you pay.' },
  { icon: <Clock size={24} />, title: '24/7 Emergency Access', desc: 'Police summons, bail hearings, and criminal matters are time-critical. Our emergency network responds within 15 minutes, round the clock.' },
  { icon: <Cpu size={24} />, title: 'AI Legal Matching', desc: 'Our RAG-powered AI instantly classifies your legal issue across 12 practice areas and connects you with the most relevant specialist.' },
  { icon: <Video size={24} />, title: 'Encrypted Video Consultation', desc: 'Secure, end-to-end encrypted video sessions with verified advocates from the comfort of your home — no travel required.' },
  { icon: <FileText size={24} />, title: 'Legal Document Templates', desc: 'Download India-specific legal documents, demand notices, RTI applications, FIR templates, and contracts — completely free.' },
  { icon: <Lock size={24} />, title: 'Private & Confidential', desc: 'All case details, communications, and documents are encrypted and protected. Your legal matters remain strictly between you and your advocate.' },
  { icon: <BookOpen size={24} />, title: 'Legal Knowledge Hub', desc: 'Understand your rights in plain language through our curated library of Indian law guides, Supreme Court judgements, and citizen rights explainers.' },
]

const TIMELINE = [
  { year: 'January 2024', emoji: '💡', title: 'The Idea Is Born', color: '#F5C4B3',
    desc: 'Ayush Kumar witnesses firsthand how his own family struggles to find a reliable property lawyer in Ghaziabad — inconsistent quotes, unverifiable credentials, weeks of confusion. He decides to fix India\'s broken legal discovery system once and for all.' },
  { year: 'March 2024', emoji: '🔨', title: 'Building in Stealth', color: '#E8A990',
    desc: 'A small founding team starts building — integrating Bar Council API verification, Razorpay payment infrastructure, encrypted video systems, and the first version of the advocate discovery engine. 200+ citizen interviews conducted across Delhi, Mumbai, and Lucknow.' },
  { year: 'June 2024', emoji: '🚀', title: 'Platform Goes Live', color: '#F5C4B3',
    desc: 'Justice Junction 24/7 launches publicly with Bar Council verification, upfront fee transparency, case tracking dashboards, and 50 verified advocates across Delhi NCR. First booking within 3 hours of launch.' },
  { year: 'September 2024', emoji: '🏆', title: '100 Verified Advocates', color: '#E8A990',
    desc: 'Crossed 100 verified advocates across 10 major Indian cities. Client satisfaction rate reaches 98%. Average consultation response time: under 12 minutes. Emergency case resolution rate: 96%.' },
  { year: 'January 2025', emoji: '🤖', title: 'AI Integration Phase', color: '#F5C4B3',
    desc: 'Launched AI Legal Assistant powered by RAG (Retrieval-Augmented Generation) with Indian Bare Acts corpus. AI Issue Classifier achieves 100% accuracy across 12 practice categories. Admin AI Evaluation dashboard added for research quality control.' },
  { year: '2025–2026', emoji: '🌏', title: 'National Scale', color: '#E8A990',
    desc: 'Targeting 10,000+ verified advocates across all 28 Indian states, 12+ regional language support, 1 million citizens helped, and ₹200Cr+ in legal fees saved through transparent pricing competition.' },
]

const SERVICES = [
  { icon: '⚖️', title: 'Criminal Defence', desc: 'Bail applications, FIR matters, police station assistance, Sessions Court representation' },
  { icon: '🏠', title: 'Property & Real Estate', desc: 'Title disputes, registration issues, builder fraud, land acquisition, tenant matters' },
  { icon: '👨‍👩‍👧', title: 'Family & Divorce Law', desc: 'Divorce proceedings, child custody, alimony, domestic violence, marriage registration' },
  { icon: '🏢', title: 'Corporate & Business', desc: 'Company incorporation, contract drafting, IP protection, SEBI compliance, M&A' },
  { icon: '🛒', title: 'Consumer Rights', desc: 'Consumer forum complaints, e-commerce fraud, defective goods, insurance disputes' },
  { icon: '👷', title: 'Labour & Employment', desc: 'Wrongful termination, PF disputes, workplace harassment, labour court matters' },
  { icon: '💻', title: 'Cyber Law', desc: 'Cybercrime reporting, data breach, online fraud, social media harassment, digital evidence' },
  { icon: '📋', title: 'Taxation', desc: 'Income tax disputes, GST matters, tax notices, assessment proceedings, appeals' },
]

const TRUST_ITEMS = [
  { n: 1338, s: '+', label: 'Verified Advocates', sub: 'Across India' },
  { n: 100,  s: '+', label: 'Cities Covered', sub: 'Pan-India reach' },
  { n: 10000,s: '+', label: 'Citizens Helped', sub: 'Legal issues resolved' },
  { n: 98,   s: '%', label: 'Client Satisfaction', sub: 'Verified reviews' },
]

export default function About() {
  const [activeTimeline, setActiveTimeline] = useState(0)

  return (
    <div style={{ background: 'var(--cream)', color: 'var(--txt)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      <Helmet>
        <title>About Justice Junction 24/7 | Founder Ayush Kumar | India's Legal Marketplace</title>
        <meta name="description" content="Justice Junction 24/7, founded by Ayush Kumar (Founder & CEO), is India's most trusted legal marketplace. 1,300+ Bar Council verified advocates, 100+ cities, AI-powered legal assistance available 24/7." />
        <meta property="og:title" content="About Justice Junction 24/7 | Founded by Ayush Kumar" />
        <meta property="og:description" content="Meet Ayush Kumar, Founder & CEO of Justice Junction 24/7 — democratizing legal access across India with verified advocates, transparent pricing, and AI-powered legal assistance." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/about" />
      </Helmet>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO with Judicial Courtroom
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* BG Image */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=90')`,
          backgroundSize: 'cover', backgroundPosition: 'center 35%',
          transform: 'scale(1.05)',
          filter: 'brightness(0.4)'
        }} />
        {/* Gradient layers */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: 'linear-gradient(160deg, rgba(26,10,13,0.7) 0%, rgba(92,21,33,0.6) 60%, rgba(26,10,13,0.85) 100%)' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, zIndex: 2, background: 'linear-gradient(to bottom, transparent, #FDF6EE)' }} />

        {/* Floating decorative ring */}
        <div style={{
          position: 'absolute', top: '10%', right: '-5%', width: 600, height: 600,
          border: '1px solid rgba(245,196,179,0.1)', borderRadius: '50%', zIndex: 2
        }} />
        <div style={{
          position: 'absolute', top: '15%', right: '0%', width: 450, height: 450,
          border: '1px solid rgba(245,196,179,0.08)', borderRadius: '50%', zIndex: 2
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 3, paddingTop: '8rem', paddingBottom: '7rem' }}>
          {/* Label pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(245,196,179,0.12)', border: '1px solid rgba(245,196,179,0.3)',
            borderRadius: 40, padding: '.4rem 1.2rem', marginBottom: '2rem',
            backdropFilter: 'blur(12px)'
          }}>
            <Landmark size={14} color="#F5C4B3" />
            <span style={{ fontSize: '.75rem', fontWeight: 800, letterSpacing: '2.5px', color: '#F5C4B3', textTransform: 'uppercase' }}>
              Founded 2024 · India's Most Trusted Legal Platform
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2.8rem, 6vw, 5rem)',
            fontWeight: 900, lineHeight: 1.08, letterSpacing: '-0.04em',
            color: '#fff', maxWidth: 900, marginBottom: '1.8rem'
          }}>
            Justice for Every Indian —<br />
            <span style={{
              background: 'linear-gradient(100deg, #F5C4B3 0%, #E8A990 50%, #F5C4B3 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              backgroundSize: '200%', animation: 'shimmer 3s infinite linear'
            }}>
              Not Just the Privileged.
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)', color: 'rgba(249,238,228,0.82)',
            maxWidth: 680, lineHeight: 1.8, marginBottom: '3rem'
          }}>
            Justice Junction 24/7 was built by <strong style={{ color: '#F5C4B3', fontWeight: 700 }}>Ayush Kumar</strong> to solve a problem every Indian family faces — the impossible task of finding a trustworthy, verified, and fairly-priced lawyer in moments of crisis.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '4rem' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #F5C4B3 0%, #E09278 100%)',
              color: '#1A0A0D', fontWeight: 800, fontSize: '1rem',
              padding: '1rem 2.2rem', borderRadius: 14, border: 'none',
              boxShadow: '0 10px 30px rgba(245,196,179,0.35)', textDecoration: 'none',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}>
              Find a Verified Lawyer <ArrowRight size={18} />
            </Link>
            <a href="#founder" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(12px)', color: '#fff', fontWeight: 700,
              fontSize: '1rem', padding: '1rem 2.2rem', borderRadius: 14, textDecoration: 'none'
            }}>
              Meet Our Founder <ChevronRight size={18} />
            </a>
          </div>

          {/* Trust badges row */}
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              { icon: <BadgeCheck size={16} color="#22C55E" />, text: 'Bar Council Verified' },
              { icon: <Shield size={16} color="#60A5FA" />, text: 'Govt. Compliant' },
              { icon: <Star size={16} fill="#FCD34D" color="#FCD34D" />, text: '4.9 ★ Rated' },
              { icon: <Lock size={16} color="#A78BFA" />, text: 'End-to-End Encrypted' },
              { icon: <UserCheck size={16} color="#34D399" />, text: '1,300+ Advocates' },
            ].map((b, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 7,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(10px)', borderRadius: 30, padding: '.4rem .9rem'
              }}>
                {b.icon}
                <span style={{ fontSize: '.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — LIVE STATS BAND (dark, animated)
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        background: '#1A0A0D', padding: '4rem 0',
        borderTop: '1px solid rgba(245,196,179,0.1)'
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
            {TRUST_ITEMS.map((s, i) => (
              <div key={i} style={{
                textAlign: 'center', padding: '1.5rem 1rem',
                borderRight: i < TRUST_ITEMS.length - 1 ? '1px solid rgba(245,196,179,0.08)' : 'none'
              }}>
                <Stat num={s.n} suffix={s.s} label={s.label} />
                <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'rgba(245,196,179,0.9)', marginTop: 8 }}>{s.label}</div>
                <div style={{ fontSize: '.7rem', color: 'rgba(255,255,255,0.35)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '1px' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — THE PROBLEM WE SOLVE
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1521791136364-798a7bc0d262?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(253,246,238,0.96)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }} className="mobile-stack">
            <div>
              <div style={{
                display: 'inline-block', background: 'rgba(123,29,46,0.08)', color: 'var(--bur)',
                fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
                textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1.2rem'
              }}>The Problem We Solve</div>
              <h2 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 'clamp(1.9rem, 3.5vw, 2.8rem)', fontWeight: 900,
                color: 'var(--txt)', lineHeight: 1.15, letterSpacing: '-0.03em', marginBottom: '1.5rem'
              }}>
                Legal help in India was<br />
                <span style={{ color: 'var(--bur)' }}>broken. We fixed it.</span>
              </h2>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Before Justice Junction, finding a lawyer in India meant weeks of uncertain referrals, wildly inconsistent fees, and zero way to verify credentials. 78% of Indians facing legal issues don't know where to start.
              </p>
              <p style={{ fontSize: '1.05rem', color: 'var(--txt-3)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                We built a technology platform that makes legal help as easy, transparent, and accessible as any other professional service — with verified credentials, upfront pricing, AI-powered issue classification, and 24/7 emergency access.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { bad: 'Unknown credentials & fake lawyers', good: 'Multi-step Bar Council verification' },
                  { bad: 'Hidden fees & surprise retainers', good: 'Fixed upfront pricing on every profile' },
                  { bad: 'Weeks to find the right specialist', good: 'AI matching in under 60 seconds' },
                  { bad: 'No help during legal emergencies', good: '24/7 emergency lawyer access' },
                ].map((row, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{
                      minWidth: 20, height: 20, borderRadius: '50%',
                      background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '.75rem', flexShrink: 0, marginTop: 2
                    }}>✕</div>
                    <span style={{ fontSize: '.9rem', color: '#9B2D42', textDecoration: 'line-through', minWidth: 220 }}>{row.bad}</span>
                    <div style={{ minWidth: 20, height: 20, borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <CheckCircle2 size={12} color="#16A34A" />
                    </div>
                    <span style={{ fontSize: '.9rem', color: '#15803D', fontWeight: 700 }}>{row.good}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: 28, overflow: 'hidden',
                boxShadow: '0 30px 80px rgba(123,29,46,0.15)',
                height: 520,
                backgroundImage: `url('https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=900&q=85')`,
                backgroundSize: 'cover', backgroundPosition: 'center'
              }} />
              {/* Floating stat card */}
              <div style={{
                position: 'absolute', top: -20, right: -20,
                background: 'var(--bur)', color: '#fff',
                borderRadius: 20, padding: '1.2rem 1.5rem',
                boxShadow: '0 20px 40px rgba(123,29,46,0.3)',
                textAlign: 'center', minWidth: 140
              }}>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>15<span style={{ fontSize: '1rem' }}>min</span></div>
                <div style={{ fontSize: '.72rem', fontWeight: 800, opacity: 0.85, textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>Avg. Emergency Response</div>
              </div>
              {/* Floating review card */}
              <div style={{
                position: 'absolute', bottom: -20, left: -20,
                background: '#fff', borderRadius: 20,
                padding: '1.3rem 1.5rem', boxShadow: '0 20px 50px rgba(123,29,46,0.12)',
                border: '1px solid var(--border)', maxWidth: 260
              }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
                  {[1,2,3,4,5].map(n => <Star key={n} size={13} fill="#FCD34D" color="#FCD34D" />)}
                  <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--txt-3)', marginLeft: 4 }}>5.0</span>
                </div>
                <p style={{ fontSize: '.85rem', color: 'var(--txt-2)', lineHeight: 1.65, margin: 0, fontStyle: 'italic' }}>
                  "Got a criminal lawyer for my father within 20 minutes at midnight. Absolute lifesaver."
                </p>
                <div style={{ fontSize: '.72rem', color: 'var(--txt-3)', fontWeight: 700, marginTop: 8 }}>— Verified Client, Lucknow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 4 — FOUNDER & CEO AYUSH KUMAR (Premium)
      ═══════════════════════════════════════════════════════════ */}
      <section id="founder" style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden',
        background: '#fff'
      }}>
        {/* Corner decoration */}
        <div style={{
          position: 'absolute', top: 0, left: 0, width: 500, height: 500,
          background: 'radial-gradient(circle at top left, rgba(123,29,46,0.04) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0, width: 400, height: 400,
          background: 'radial-gradient(circle at bottom right, rgba(245,196,179,0.08) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}><Award size={13} /> Leadership & Vision</div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
              color: 'var(--txt)', letterSpacing: '-0.03em'
            }}>Meet the <span style={{ color: 'var(--bur)' }}>Founder & CEO</span></h2>
          </div>

          {/* Main founder card */}
          <div style={{
            display: 'grid', gridTemplateColumns: '340px 1fr',
            background: '#fff', borderRadius: 32,
            boxShadow: '0 30px 80px rgba(123,29,46,0.1)',
            border: '1px solid var(--border)', overflow: 'hidden'
          }} className="mobile-stack">
            {/* Left — Burgundy portrait panel */}
            <div style={{
              background: 'linear-gradient(170deg, #7B1D2E 0%, #5C1521 50%, #3D0E16 100%)',
              padding: '3.5rem 2.5rem', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', textAlign: 'center',
              position: 'relative', overflow: 'hidden'
            }}>
              {/* Grid pattern overlay */}
              <div style={{
                position: 'absolute', inset: 0, opacity: 0.05,
                backgroundImage: `linear-gradient(rgba(245,196,179,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,196,179,0.5) 1px, transparent 1px)`,
                backgroundSize: '30px 30px'
              }} />
              {/* Glow */}
              <div style={{
                position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
                width: 200, height: 200,
                background: 'radial-gradient(circle, rgba(245,196,179,0.15) 0%, transparent 70%)',
                borderRadius: '50%'
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Avatar monogram */}
                <div style={{
                  width: 148, height: 148, borderRadius: 28,
                  background: 'rgba(245,196,179,0.1)',
                  border: '2px solid rgba(245,196,179,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.8rem',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: '3.8rem', fontWeight: 900,
                    color: '#F5C4B3', letterSpacing: '-3px'
                  }}>AK</span>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.9rem', fontWeight: 900, color: '#fff', marginBottom: 6 }}>Ayush Kumar</h3>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(245,196,179,0.15)', border: '1px solid rgba(245,196,179,0.3)',
                  borderRadius: 30, padding: '.35rem .9rem', marginBottom: '2rem'
                }}>
                  <Award size={13} color="#F5C4B3" />
                  <span style={{ fontSize: '.74rem', fontWeight: 800, color: '#F5C4B3', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Founder & CEO</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
                  {[
                    [<Building2 size={14} />, 'Justice Junction 24/7'],
                    [<Globe size={14} />, 'Pan-India Operations'],
                    [<Briefcase size={14} />, 'Legal-Tech Entrepreneur'],
                    [<MapPin size={14} />, 'Headquartered in India'],
                    [<Heart size={14} />, 'Advocate for Equal Justice'],
                  ].map(([icon, txt], i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                      <span style={{ color: '#F5C4B3', opacity: 0.8 }}>{icon}</span>
                      <span style={{ fontSize: '.82rem', color: 'rgba(245,224,200,0.75)', fontWeight: 600 }}>{txt}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '2.5rem', padding: '1rem', background: 'rgba(245,196,179,0.08)', borderRadius: 14, border: '1px solid rgba(245,196,179,0.15)' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 800, color: 'rgba(245,196,179,0.6)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 }}>Platform Founded</div>
                  <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.6rem', fontWeight: 900, color: '#F5C4B3', letterSpacing: '-0.03em' }}>2024</div>
                  <div style={{ fontSize: '.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Registered in India</div>
                </div>
              </div>
            </div>

            {/* Right — Story & impact */}
            <div style={{ padding: '3.5rem 3.5rem 3.5rem 3rem' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: '2rem' }}>
                <Quote size={36} color="var(--bur)" style={{ opacity: 0.35, flexShrink: 0, marginTop: 6 }} />
                <blockquote style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: '1.15rem', color: 'var(--txt)',
                  lineHeight: 1.85, fontStyle: 'italic', fontWeight: 600, margin: 0
                }}>
                  "I started Justice Junction after watching my own family struggle to find a reliable lawyer during a property dispute in Ghaziabad. We spent weeks asking friends for referrals, received wildly inconsistent quotes, and had absolutely no way to verify anyone's credentials.
                  <br /><br />
                  Legal help in India was opaque, expensive, and inaccessible to ordinary people. I built Justice Junction to change exactly that — to make finding a verified, fairly-priced lawyer as easy as booking a cab. Every feature on this platform exists to give power back to the citizen."
                </blockquote>
              </div>

              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: '2.5rem', padding: '1rem 1.2rem', background: 'var(--cream)', borderRadius: 12, border: '1px solid var(--border)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--bur)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: '1rem', fontWeight: 900, color: '#F5C4B3' }}>AK</span>
                </div>
                <div>
                  <div style={{ fontSize: '.9rem', fontWeight: 800, color: 'var(--txt)' }}>Ayush Kumar</div>
                  <div style={{ fontSize: '.78rem', color: 'var(--bur)', fontWeight: 700 }}>Founder & CEO — Justice Junction 24/7</div>
                </div>
              </div>

              {/* Impact metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { num: '2024', label: 'Year Founded', sub: 'Started from scratch' },
                  { num: '1,338+', label: 'Advocates', sub: 'Verified on platform' },
                  { num: '100+', label: 'Cities', sub: 'Across India' },
                ].map((m, i) => (
                  <div key={i} style={{ background: 'var(--cream)', borderRadius: 14, padding: '1.2rem', textAlign: 'center', border: '1px solid var(--border)' }}>
                    <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.55rem', fontWeight: 900, color: 'var(--bur)', letterSpacing: '-0.03em' }}>{m.num}</div>
                    <div style={{ fontSize: '.73rem', fontWeight: 800, color: 'var(--txt)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: 4 }}>{m.label}</div>
                    <div style={{ fontSize: '.68rem', color: 'var(--txt-3)', marginTop: 2 }}>{m.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <Link to="/search" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem', borderRadius: 12, fontWeight: 800 }}>
                  Find a Lawyer <ArrowRight size={16} />
                </Link>
                <a href="mailto:supportjusticejunction@gmail.com" className="btn btn-secondary" style={{ padding: '0.8rem 1.6rem', borderRadius: 12, fontWeight: 700 }}>
                  Contact Ayush <Mail size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 5 — PRACTICE AREAS (with bg)
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,10,13,0.93)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.25)',
              color: '#F5C4B3', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Legal Practice Areas</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
              We cover every area of Indian law
            </h2>
            <p style={{ color: 'rgba(245,224,200,0.7)', maxWidth: 560, margin: '1rem auto 0', lineHeight: 1.75 }}>
              From criminal bail to corporate contracts — find the right specialist for your exact legal issue in minutes.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem' }}>
            {SERVICES.map((s, i) => (
              <Link to="/search" key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: '1rem',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(245,196,179,0.1)',
                borderRadius: 18, padding: '1.5rem', textDecoration: 'none',
                backdropFilter: 'blur(10px)', transition: 'all 0.25s ease'
              }} className="card-hover">
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 800, color: '#F5C4B3', fontSize: '.95rem', marginBottom: 4 }}>{s.title}</div>
                  <div style={{ fontSize: '.8rem', color: 'rgba(245,224,200,0.6)', lineHeight: 1.65 }}>{s.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 6 — PLATFORM PILLARS (White, 8 tiles)
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Our Platform</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em' }}>
              Built with every Indian in mind
            </h2>
            <p style={{ color: 'var(--txt-3)', maxWidth: 560, margin: '1rem auto 0', lineHeight: 1.75 }}>
              Eight core pillars that set Justice Junction apart from every other legal platform in India.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: '1.5rem' }}>
            {PILLARS.map((p, i) => (
              <div key={i} style={{
                background: 'var(--cream)', borderRadius: 20,
                padding: '2rem 1.8rem', border: '1px solid var(--border)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease'
              }} className="card-hover">
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: 'rgba(123,29,46,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--bur)', marginBottom: '1.2rem'
                }}>{p.icon}</div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: 'var(--txt)', marginBottom: '.6rem' }}>{p.title}</h3>
                <p style={{ fontSize: '.88rem', color: 'var(--txt-3)', lineHeight: 1.75, margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 7 — INTERACTIVE JOURNEY TIMELINE
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '8rem 0', position: 'relative', overflow: 'hidden',
        backgroundImage: `url('https://images.unsplash.com/photo-1505664194779-8beaceb93744?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center top'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,10,13,0.95) 0%, rgba(92,21,33,0.93) 100%)' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(245,196,179,0.1)', border: '1px solid rgba(245,196,179,0.25)',
              color: '#F5C4B3', fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Our Journey</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>
              How We Built Justice Junction
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {TIMELINE.map((item, i) => (
              <div key={i} onClick={() => setActiveTimeline(i)} style={{
                background: activeTimeline === i ? 'rgba(245,196,179,0.1)' : 'rgba(255,255,255,0.04)',
                border: activeTimeline === i ? '1px solid rgba(245,196,179,0.35)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 20, padding: '1.8rem 1.8rem',
                cursor: 'pointer', transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.6rem' }}>{item.emoji}</span>
                  <span style={{ fontSize: '.72rem', fontWeight: 800, color: item.color, textTransform: 'uppercase', letterSpacing: '2px' }}>{item.year}</span>
                </div>
                <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.1rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: '.85rem', color: 'rgba(245,224,200,0.65)', lineHeight: 1.75, margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 8 — VISION 2026 + client testimonial
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '8rem 0', background: 'var(--cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(123,29,46,0.07)', color: 'var(--bur)',
              fontWeight: 800, fontSize: '.72rem', letterSpacing: '2.5px',
              textTransform: 'uppercase', padding: '.38rem .9rem', borderRadius: 6, marginBottom: '1rem'
            }}>Vision 2026</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, color: 'var(--txt)', letterSpacing: '-0.03em' }}>
              Where we're headed
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '5rem' }}>
            {[
              { icon: <Target size={26} />, num: '10,000+', label: 'Verified Advocates', desc: 'All 28 states & 8 UTs' },
              { icon: <Users size={26} />,  num: '1 Million', label: 'Indians Served', desc: 'Transparent legal help' },
              { icon: <Globe size={26} />,  num: '12+', label: 'Languages', desc: 'Hindi + regional support' },
              { icon: <IndianRupee size={26} />, num: '₹200Cr+', label: 'Fees Saved', desc: 'Through price transparency' },
              { icon: <Trophy size={26} />, num: '#1', label: 'Legal Marketplace', desc: 'In India by 2026' },
            ].map((v, i) => (
              <div key={i} style={{
                background: '#fff', borderRadius: 20, padding: '2.2rem 1.5rem',
                border: '1px solid var(--border)', textAlign: 'center',
                boxShadow: 'var(--sh)'
              }} className="card-hover">
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(123,29,46,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bur)', margin: '0 auto 1rem' }}>{v.icon}</div>
                <div style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.8rem', fontWeight: 900, color: 'var(--bur)', letterSpacing: '-0.03em', marginBottom: 4 }}>{v.num}</div>
                <div style={{ fontWeight: 800, fontSize: '.9rem', color: 'var(--txt)', marginBottom: 4 }}>{v.label}</div>
                <div style={{ fontSize: '.78rem', color: 'var(--txt-3)' }}>{v.desc}</div>
              </div>
            ))}
          </div>

          {/* Testimonials row */}
          <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '1.5rem', fontWeight: 800, color: 'var(--txt)', textAlign: 'center', marginBottom: '2rem' }}>
            What our clients say
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {[
              { text: '"Got a bail lawyer for my brother within 25 minutes at 2 AM. Complete lifesaver. The fee was exactly what was shown — no extras."', name: 'Ramesh Sharma', city: 'Delhi', stars: 5 },
              { text: '"Filed a consumer complaint against a builder with their help. The lawyer was verified, affordable, and won us a settlement in 6 weeks."', name: 'Priya Nair', city: 'Bangalore', stars: 5 },
              { text: '"After a cyber fraud incident, their cyber law specialist guided me through every step — FIR filing to full recovery. Incredibly reliable."', name: 'Karan Mehta', city: 'Mumbai', stars: 5 },
            ].map((t, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 20, padding: '2rem', border: '1px solid var(--border)', boxShadow: 'var(--sh-sm)' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: '1rem' }}>
                  {Array.from({length: t.stars}).map((_, j) => <Star key={j} size={14} fill="#FCD34D" color="#FCD34D" />)}
                </div>
                <p style={{ fontSize: '.92rem', color: 'var(--txt-2)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: '1.2rem' }}>{t.text}</p>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--bur)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5C4B3', fontWeight: 800, fontSize: '.85rem' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '.85rem', color: 'var(--txt)' }}>{t.name}</div>
                    <div style={{ fontSize: '.73rem', color: 'var(--txt-3)', display: 'flex', gap: 4, alignItems: 'center' }}>
                      <MapPin size={11} /> {t.city} · Verified Client
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 9 — FINAL DARK CTA with richly layered bg
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        padding: '7rem 0', position: 'relative', overflow: 'hidden', textAlign: 'center',
        backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center 60%'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(160deg, rgba(26,10,13,0.97) 0%, rgba(92,21,33,0.96) 100%)' }} />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, background: 'radial-gradient(circle, rgba(245,196,179,0.06) 0%, transparent 60%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1, maxWidth: 750 }}>
          <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginBottom: '1.5rem' }}>
            {[1,2,3,4,5].map(n => <Star key={n} size={18} fill="#FCD34D" color="#FCD34D" />)}
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900,
            color: '#fff', letterSpacing: '-0.03em', marginBottom: '1.2rem', lineHeight: 1.15
          }}>
            Justice is a right.<br />
            <span style={{ color: '#F5C4B3' }}>Let us help you claim it.</span>
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'rgba(245,224,200,0.75)', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            Join 10,000+ Indians who found verified, transparent, and affordable legal help on Justice Junction 24/7 — India's most trusted legal marketplace, built by Ayush Kumar.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/search" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'linear-gradient(135deg, #F5C4B3, #E09278)',
              color: '#1A0A0D', fontWeight: 800, padding: '1.1rem 2.4rem',
              borderRadius: 14, textDecoration: 'none',
              boxShadow: '0 12px 30px rgba(245,196,179,0.3)', fontSize: '1rem'
            }}>
              Find a Lawyer Now <ArrowRight size={18} />
            </Link>
            <Link to="/join-as-lawyer" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)', color: '#fff', fontWeight: 700,
              padding: '1.1rem 2.4rem', borderRadius: 14, textDecoration: 'none', fontSize: '1rem'
            }}>
              Join as Advocate <ChevronRight size={18} />
            </Link>
          </div>
          <p style={{ marginTop: '2rem', fontSize: '.8rem', color: 'rgba(255,255,255,0.3)' }}>
            Contact Ayush Kumar directly: <a href="mailto:supportjusticejunction@gmail.com" style={{ color: '#F5C4B3', textDecoration: 'none', fontWeight: 700 }}>supportjusticejunction@gmail.com</a>
          </p>
        </div>
      </section>
    </div>
  )
}
