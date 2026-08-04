/**
 * join-as-lawyer.jsx — Premium Lawyer Landing Page
 * Route: /join-as-lawyer
 *
 * ─────────────────────────────────────────────────────────────────
 * PLACEHOLDER ASSETS — swap these when real files are ready:
 *   Hero video   → /videos/hero-lawyers.mp4
 *                  Royalty-free source: https://coverr.co/search?q=legal+office
 *   Hero poster  → /images/hero-lawyers-poster.jpg
 *                  Royalty-free source: https://www.pexels.com/search/courtroom/
 *   Proof img 1  → /images/proof-courtroom.jpg
 *                  Royalty-free source: https://pixabay.com/images/search/indian+lawyer/
 *   Proof img 2  → /images/proof-consultation.jpg
 *                  Royalty-free source: https://www.pexels.com/search/lawyer+office/
 * ─────────────────────────────────────────────────────────────────
 *
 * WHAT IS PRESERVED (do NOT touch):
 *   - validate(), handleSubmit(), onChange() — form logic
 *   - /api/lawyer-application  POST call
 *   - useToast() hook usage
 *   - All form fields, SPECS constant, Helmet SEO tags
 *
 * WHAT IS NEW:
 *   - Hero with background video (preload="metadata", mobile fallback)
 *   - Why Join benefit cards with scroll-triggered reveal
 *   - Horizontal "How It Works" timeline (collapses to vertical on mobile)
 *   - Alternating Platform Proof blocks
 *   - Keyboard-navigable testimonial carousel with hover/focus pause
 *   - Animated stats band with IntersectionObserver counters
 *   - Final urgency CTA
 *   - Application form (unchanged logic, new wrapper styling)
 */

import './join-as-lawyer.css'
import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useState, useEffect, useRef, useCallback } from 'react'
import {
  CheckCircle, Users, BarChart, Globe, Shield, Award,
  Send, Phone, Mail, MapPin, Briefcase, Hash,
  BadgeCheck, IndianRupee, Clock, UserCheck, Star,
  ChevronLeft, ChevronRight, Zap, Lock, TrendingUp
} from 'lucide-react'
import { useToast } from '../context/ToastContext'

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */
const SPECS = [
  'Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law',
  'Consumer Rights', 'Labour Law', 'Cyber Law', 'Divorce',
  'Taxation', 'Intellectual Property', 'Civil Disputes', 'RTI'
]

const BENEFITS = [
  {
    icon: <Users size={26} />,
    title: 'Clients Around the Clock',
    desc: 'Your verified profile attracts and converts new clients 24/7 — even while you are in court or asleep.'
  },
  {
    icon: <IndianRupee size={26} />,
    title: 'Instant Secure Payments',
    desc: 'Consultation fees hit your account via Razorpay within minutes. No awkward follow-ups, ever.'
  },
  {
    icon: <BarChart size={26} />,
    title: 'Smart Practice Dashboard',
    desc: 'Manage bookings, post case updates, track earnings, and message clients — from one beautiful dashboard.'
  },
  {
    icon: <Shield size={26} />,
    title: 'Zero Upfront Cost',
    desc: 'Register entirely free. We only earn when you do. No hidden charges, no lock-in contracts.'
  }
]

const HOW_IT_WORKS = [
  {
    num: '01',
    icon: <UserCheck size={22} />,
    time: '5 minutes',
    title: 'Register & Get Verified',
    desc: 'Fill in your Bar Council details, specialization, and city. Our team verifies your enrollment within 24–48 hours.'
  },
  {
    num: '02',
    icon: <Users size={22} />,
    time: 'Immediately after',
    title: 'Get Matched with Clients',
    desc: 'Your profile goes live with a Verified badge. Clients searching in your city and specialization find you instantly.'
  },
  {
    num: '03',
    icon: <IndianRupee size={22} />,
    time: 'After each session',
    title: 'Consult & Get Paid',
    desc: 'Conduct video or in-person consultations. Razorpay releases payment to your account automatically post-session.'
  }
]

const PROOF_BLOCKS = [
  {
    tag: 'Verified Profiles',
    // TODO: replace with /images/proof-courtroom.jpg sourced from pixabay.com/images/search/indian+lawyer/
    img: '/images/proof-courtroom.jpg',
    alt: 'Advocate standing in Indian courtroom — Justice Junction verified lawyer',
    title: (<>Your credentials,<br /><em>front and center.</em></>),
    body: 'Every advocate on Justice Junction carries a government-verified Bar Council badge. Clients choose you because they trust the platform — and the platform trusts you.',
    checks: [
      'Bar Council number verified against official records',
      'Profile reviewed by our in-house legal team',
      'Verified badge displayed on all client-facing listings'
    ],
    reverse: false
  },
  {
    tag: 'Practice Management',
    // TODO: replace with /images/proof-consultation.jpg sourced from pexels.com/search/lawyer+office/
    img: '/images/proof-consultation.jpg',
    alt: 'Lawyer conducting video consultation on laptop — Justice Junction dashboard',
    title: (<>One dashboard for your<br /><em>entire practice.</em></>),
    body: 'Manage appointments, track case milestones, send updates to clients, and monitor your monthly earnings — all from a single, mobile-friendly dashboard.',
    checks: [
      'Real-time appointment calendar with client details',
      'Case-update feed visible to clients — builds trust',
      'Monthly earnings report with Razorpay payout history'
    ],
    reverse: true
  }
]

// TODO: Replace with real testimonials from verified lawyers on the platform
const TESTIMONIALS = [
  {
    initials: 'PN',
    name: 'Adv. Priya Nair',
    role: 'Family Law Specialist · Chennai',
    stars: 5,
    text: 'I was skeptical at first, but Justice Junction brought me 14 quality clients in my second month. The dashboard makes scheduling and case updates effortless.'
  },
  {
    initials: 'RS',
    name: 'Adv. Rohit Sharma',
    role: 'Criminal Defence · Pune',
    stars: 5,
    text: 'As a young advocate in a new city, building a client base was my biggest challenge. Within 6 weeks of joining, I had a steady flow of consultations through the platform.'
  },
  {
    initials: 'MI',
    name: 'Adv. Meenakshi Iyer',
    role: 'Corporate Law · Bangalore',
    stars: 5,
    text: 'The Razorpay integration means I get paid instantly after every consultation — no awkward follow-ups with clients. The Elite plan\'s ROI is excellent.'
  },
  {
    initials: 'AK',
    name: 'Adv. Arjun Kapoor',
    role: 'Property & RERA · Mumbai',
    stars: 5,
    text: 'The verified badge completely changed how potential clients perceive me online. Bookings went up 3x in the first quarter after joining.'
  },
  {
    initials: 'SR',
    name: 'Adv. Sunita Rao',
    role: 'Labour Law · Hyderabad',
    stars: 5,
    text: 'What I love most is the transparency. Clients know exactly what they are paying before they book. No price negotiations, no last-minute awkwardness.'
  }
]

// TODO: Replace with live stats fetched from /api/stats once the endpoint is built
const STATS = [
  { icon: <BadgeCheck size={20} />, value: 500, suffix: '+', label: 'Verified Advocates' },
  { icon: <Users size={20} />,     value: 12000, suffix: '+', label: 'Client Consultations' },
  { icon: <MapPin size={20} />,    value: 80, suffix: '+', label: 'Cities Covered' },
  { icon: <Star size={20} />,      value: 4.8, suffix: '/5', label: 'Average Rating', decimals: 1 }
]

/* ═══════════════════════════════════════════
   ANIMATED COUNTER (IntersectionObserver)
   Pattern adapted from src/pages/index.jsx
   ═══════════════════════════════════════════ */
function Counter({ to, suffix = '', prefix = '', decimals = 0, dur = 2200 }) {
  const [n, setN] = useState(0)
  const elRef = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const t0 = performance.now()
        const run = (now) => {
          const p = Math.min((now - t0) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 4) // ease-out quart
          const current = parseFloat((ease * to).toFixed(decimals))
          setN(current)
          if (p < 1) requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      }
    }, { threshold: 0.4 })
    if (elRef.current) io.observe(elRef.current)
    return () => io.disconnect()
  }, [to, dur, decimals])

  return (
    <span ref={elRef}>
      {prefix}{decimals > 0 ? n.toFixed(decimals) : n.toLocaleString('en-IN')}{suffix}
    </span>
  )
}

/* ═══════════════════════════════════════════
   SCROLL-REVEAL HOOK
   Applies .visible to elements with .jl-reveal*
   ═══════════════════════════════════════════ */
function useScrollReveal(containerRef) {
  useEffect(() => {
    const container = containerRef?.current ?? document
    const targets = container.querySelectorAll(
      '.jl-reveal, .jl-reveal-left, .jl-reveal-right'
    )
    if (!targets.length) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            io.unobserve(entry.target) // fire once
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    )

    targets.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [containerRef])
}

/* ═══════════════════════════════════════════
   TESTIMONIAL CAROUSEL LOGIC
   ═══════════════════════════════════════════ */
function TestimonialCarousel() {
  const trackRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const isPausedRef = useRef(false)
  const totalCards = TESTIMONIALS.length

  // Scroll carousel to a given card index
  const scrollToIdx = useCallback((idx) => {
    const track = trackRef.current
    if (!track) return
    const card = track.children[idx]
    if (!card) return
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
    setActiveIdx(idx)
  }, [])

  const goNext = useCallback(() => {
    setActiveIdx((prev) => {
      const next = (prev + 1) % totalCards
      scrollToIdx(next)
      return next
    })
  }, [totalCards, scrollToIdx])

  const goPrev = useCallback(() => {
    setActiveIdx((prev) => {
      const next = (prev - 1 + totalCards) % totalCards
      scrollToIdx(next)
      return next
    })
  }, [totalCards, scrollToIdx])

  // Auto-advance every 4 s; pause on hover or focus-within
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let interval = null

    const start = () => {
      if (interval) return
      interval = setInterval(() => {
        if (!isPausedRef.current) {
          setActiveIdx((prev) => {
            const next = (prev + 1) % totalCards
            const card = track.children[next]
            if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: 'smooth' })
            return next
          })
        }
      }, 4000)
    }

    const pause = () => { isPausedRef.current = true }
    const resume = () => { isPausedRef.current = false }

    // Pause on pointer/focus events
    track.addEventListener('mouseenter', pause)
    track.addEventListener('mouseleave', resume)
    track.addEventListener('focusin', pause)
    track.addEventListener('focusout', resume)
    // Also pause on touch
    track.addEventListener('touchstart', pause, { passive: true })
    track.addEventListener('touchend', resume)

    start()
    return () => {
      if (interval) clearInterval(interval)
      track.removeEventListener('mouseenter', pause)
      track.removeEventListener('mouseleave', resume)
      track.removeEventListener('focusin', pause)
      track.removeEventListener('focusout', resume)
      track.removeEventListener('touchstart', pause)
      track.removeEventListener('touchend', resume)
    }
  }, [totalCards])

  // Sync activeIdx when user manually scrolls
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const onScroll = () => {
      const scrollLeft = track.scrollLeft
      const cardWidth = track.children[0]?.offsetWidth ?? 0
      if (cardWidth === 0) return
      const idx = Math.round(scrollLeft / (cardWidth + 24)) // 24 = gap
      setActiveIdx(Math.min(idx, totalCards - 1))
    }
    track.addEventListener('scroll', onScroll, { passive: true })
    return () => track.removeEventListener('scroll', onScroll)
  }, [totalCards])

  return (
    <div className="jl-testimonials" aria-label="Lawyer testimonials">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 0 }}>
          <span className="jl-section-label">From Our Advocates</span>
          <h2 className="jl-section-title">
            Hear from lawyers <em>already on board.</em>
          </h2>
          <p className="jl-section-sub" style={{ margin: '0.75rem auto 0' }}>
            {/* TODO: these are placeholder quotes — replace with verified testimonials */}
            Real advocates. Real results. Real growth.
          </p>
        </div>

        <div className="jl-carousel-track-wrap" role="region" aria-label="Testimonial slider">
          {/* Keyboard-accessible prev/next in the header row */}
          <div className="jl-carousel-nav" style={{ marginBottom: '1.2rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button
              className="jl-carousel-btn"
              onClick={goPrev}
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              className="jl-carousel-btn"
              onClick={goNext}
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Scrollable track */}
          <div
            className="jl-carousel-track"
            ref={trackRef}
            role="list"
            aria-live="polite"
          >
            {TESTIMONIALS.map((t, i) => (
              <article
                key={t.name}
                className="jl-testimonial-card"
                role="listitem"
                tabIndex={0}
                aria-label={`Testimonial from ${t.name}`}
              >
                <div className="jl-testimonial-quote-icon" aria-hidden="true">"</div>
                <div className="jl-testimonial-stars" aria-label={`${t.stars} stars`}>
                  {'★'.repeat(t.stars)}
                </div>
                <p className="jl-testimonial-text">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="jl-testimonial-author">
                  <div className="jl-testimonial-avatar" aria-hidden="true">
                    {t.initials}
                  </div>
                  <div>
                    <div className="jl-testimonial-name">{t.name}</div>
                    <div className="jl-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Dot indicators */}
          <div className="jl-carousel-dots" role="tablist" aria-label="Testimonial navigation">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={i}
                className={`jl-dot${activeIdx === i ? ' active' : ''}`}
                onClick={() => scrollToIdx(i)}
                role="tab"
                aria-selected={activeIdx === i}
                aria-label={`Go to testimonial ${i + 1} of ${totalCards}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════ */
export default function JoinAsLawyer() {
  /* ── Existing form state (DO NOT CHANGE) ── */
  const { showToast } = useToast()
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    barCouncilNumber: '', specialization: '', city: '', yearsOfExperience: ''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  /* ── Existing validation (DO NOT CHANGE) ── */
  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Full name is required'
    if (!/^\d{10}$/.test(form.phone)) e.phone = 'Enter a valid 10-digit phone number'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.barCouncilNumber.trim()) e.barCouncilNumber = 'Bar Council number is required'
    if (!form.specialization) e.specialization = 'Please select a specialization'
    if (!form.city.trim()) e.city = 'City is required'
    if (!form.yearsOfExperience || parseInt(form.yearsOfExperience) < 0) e.yearsOfExperience = 'Enter valid years'
    return e
  }

  /* ── Existing onChange (DO NOT CHANGE) ── */
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  /* ── Existing handleSubmit (DO NOT CHANGE) ── */
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setSubmitting(true)
    try {
      const res = await fetch('/api/lawyer-application', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) { showToast(data.error || 'Submission failed', 'error'); return }
      setSubmitted(true)
      showToast('Application submitted successfully!', 'success')
    } catch {
      showToast('Something went wrong. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  /* ── Scroll-reveal: observe entire page ── */
  const pageRef = useRef(null)
  useScrollReveal(pageRef)

  return (
    <div ref={pageRef} style={{ background: '#fff', minHeight: '100vh' }}>

      {/* ── SEO (existing, unchanged) ── */}
      <Helmet>
        <title>Join as Advocate | Justice Junction 24/7</title>
        <meta name="description" content="Register as a verified advocate on India's fastest-growing legal-tech platform. Get quality clients 24/7, manage your cases, and grow your practice online." />
        <meta property="og:title" content="Join as an Advocate — Justice Junction 24/7" />
        <meta property="og:description" content="Get clients 24/7. Build your online reputation. No upfront cost. Instant Razorpay payouts." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/join-as-lawyer" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Join as an Advocate — Justice Junction 24/7" />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />
      </Helmet>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section className="jl-hero" aria-label="Hero — Join as Lawyer">

        {/* Background video — desktop only (hidden on mobile via CSS) */}
        {/* TODO: provide /public/videos/hero-lawyers.mp4 from https://coverr.co/search?q=legal+office */}
        <video
          className="jl-hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/images/hero-lawyers-poster.jpg"
          aria-hidden="true"
        >
          <source src="/videos/hero-lawyers.mp4" type="video/mp4" />
        </video>

        {/* Static image fallback — mobile only (shown via CSS media query) */}
        {/* TODO: provide /public/images/hero-lawyers-poster.jpg from https://www.pexels.com/search/courtroom/ */}
        <img
          className="jl-hero-img-fallback"
          src="/images/hero-lawyers-poster.jpg"
          alt="Legal professional in a courtroom"
          loading="eager"
        />

        {/* Dark gradient overlay */}
        <div className="jl-hero-overlay" aria-hidden="true" />

        <div className="container">
          <div className="jl-hero-content">

            <div className="jl-hero-badge" aria-label="For Legal Professionals">
              <span className="jl-hero-badge-dot" aria-hidden="true" />
              For Legal Professionals · India
            </div>

            <h1 className="jl-hero-h1">
              Grow Your Practice<br />
              with <em>Justice Junction.</em>
            </h1>

            <p className="jl-hero-sub">
              India's fastest-growing legal-tech platform connects verified advocates with
              clients 24/7 — so you can focus on law, not on finding clients.
            </p>

            <div className="jl-hero-cta-row">
              <a href="#apply-form" className="jl-cta-primary">
                <Briefcase size={18} aria-hidden="true" />
                Join as a Lawyer — It's Free
              </a>
              <Link to="/lawyer-plans" className="jl-cta-secondary">
                View Plans
              </Link>
            </div>

            <div className="jl-hero-trust-bar">
              {/* TODO: pull real verified lawyer count from /api/stats */}
              <div className="jl-trust-item">
                <BadgeCheck size={16} color="#4ADE80" aria-hidden="true" />
                500+ Verified Advocates
              </div>
              <div className="jl-trust-divider" aria-hidden="true" />
              <div className="jl-trust-item">
                <Shield size={16} color="#F5C4B3" aria-hidden="true" />
                Bar Council Verified
              </div>
              <div className="jl-trust-divider" aria-hidden="true" />
              <div className="jl-trust-item">
                <Lock size={16} color="#F5C4B3" aria-hidden="true" />
                Razorpay Secure Payouts
              </div>
            </div>
          </div>
        </div>

        {/* Animated scroll cue */}
        <div className="jl-scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <div className="jl-scroll-arrow" />
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — WHY JOIN
      ══════════════════════════════════════════ */}
      <section className="jl-section jl-section--white" aria-labelledby="why-join-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 620, margin: '0 auto 0' }}>
            <span className="jl-section-label jl-reveal">Why Choose Us</span>
            <h2 className="jl-section-title jl-reveal" id="why-join-title">
              Everything you need to<br /><em>build your practice online.</em>
            </h2>
            <p className="jl-section-sub jl-reveal" style={{ margin: '0.75rem auto 0' }}>
              Justice Junction gives you the tools, the reach, and the trust layer
              that traditionally only large law firms could access.
            </p>
          </div>

          <div className="jl-benefits-grid">
            {BENEFITS.map((b, i) => (
              <div
                key={b.title}
                className="jl-benefit-card jl-reveal"
                data-delay={String(i + 1)}
              >
                <div className="jl-benefit-icon" aria-hidden="true">{b.icon}</div>
                <h3 className="jl-benefit-title">{b.title}</h3>
                <p className="jl-benefit-desc">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — HOW IT WORKS
      ══════════════════════════════════════════ */}
      <section className="jl-section jl-section--cream" aria-labelledby="how-it-works-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 580, margin: '0 auto' }}>
            <span className="jl-section-label jl-reveal">Simple 3-Step Process</span>
            <h2 className="jl-section-title jl-reveal" id="how-it-works-title">
              From sign-up to<br /><em>your first client.</em>
            </h2>
          </div>

          {/* Desktop: horizontal timeline; Tablet/Mobile: vertical via CSS */}
          <div className="jl-timeline" role="list">
            {HOW_IT_WORKS.map((step, i) => (
              <>
                <div
                  key={step.num}
                  className="jl-timeline-step jl-reveal"
                  data-delay={String(i + 1)}
                  role="listitem"
                >
                  <div className="jl-timeline-num" aria-hidden="true">{step.num}</div>
                  <div className="jl-timeline-icon" aria-hidden="true">{step.icon}</div>
                  <div
                    style={{
                      display: 'inline-block',
                      background: 'rgba(123,29,46,0.08)',
                      color: 'var(--bur)',
                      padding: '0.25rem 0.8rem',
                      borderRadius: 50,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      marginBottom: '0.8rem',
                      letterSpacing: '0.05em'
                    }}
                  >
                    {step.time}
                  </div>
                  <h3 className="jl-timeline-title">{step.title}</h3>
                  <p className="jl-timeline-desc">{step.desc}</p>
                </div>
                {/* Arrow connector between steps (not after last step) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div key={`conn-${i}`} className="jl-timeline-connector" aria-hidden="true">
                    <div className="jl-timeline-arrow" />
                  </div>
                )}
              </>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — PLATFORM PROOF
      ══════════════════════════════════════════ */}
      <section className="jl-proof-section" aria-labelledby="proof-title">
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto 4rem' }}>
            <span className="jl-section-label jl-reveal">Live Platform</span>
            <h2 className="jl-section-title jl-reveal" id="proof-title">
              Built for serious<br /><em>legal professionals.</em>
            </h2>
          </div>

          {PROOF_BLOCKS.map((block, i) => (
            <div
              key={i}
              className={`jl-proof-block${block.reverse ? ' jl-proof-block--reverse' : ''}`}
            >
              <div className={block.reverse ? 'jl-reveal-right' : 'jl-reveal-left'}>
                <div className="jl-proof-img-wrap">
                  {/* TODO: swap src with real image — see file header for sources */}
                  <img
                    src={block.img}
                    alt={block.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    width="800"
                    height="600"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <div className={block.reverse ? 'jl-reveal-left' : 'jl-reveal-right'}>
                <div className="jl-proof-text">
                  <span className="jl-proof-tag">{block.tag}</span>
                  <h3 className="jl-proof-title">{block.title}</h3>
                  <p className="jl-proof-body">{block.body}</p>
                  <ul className="jl-proof-checklist" aria-label="Key features">
                    {block.checks.map((c) => (
                      <li key={c}>
                        <span className="jl-check-icon" aria-hidden="true">✓</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — TESTIMONIALS
      ══════════════════════════════════════════ */}
      <TestimonialCarousel />

      {/* ══════════════════════════════════════════
          SECTION 6 — STATS BAND
      ══════════════════════════════════════════ */}
      <section className="jl-stats-band" aria-labelledby="stats-title">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="jl-section-label jl-reveal">By the Numbers</span>
            <h2 className="jl-section-title jl-reveal" id="stats-title" style={{ color: '#fff' }}>
              A platform that <em style={{ color: '#F5C4B3' }}>keeps growing.</em>
            </h2>
          </div>
          <div className="jl-stats-grid" role="list">
            {STATS.map((stat, i) => (
              <div key={stat.label} className="jl-stat-item jl-reveal" data-delay={String(i + 1)} role="listitem">
                <div className="jl-stat-icon" aria-hidden="true">{stat.icon}</div>
                <div className="jl-stat-value">
                  <Counter
                    to={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals ?? 0}
                  />
                </div>
                <div className="jl-stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 7 — FINAL CTA
      ══════════════════════════════════════════ */}
      <section className="jl-final-cta" aria-labelledby="final-cta-title">
        <div className="container">
          <div className="jl-final-cta-content">
            <div className="jl-final-urgency jl-reveal">
              <Zap size={12} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />
              Limited early-access spots · Join now
            </div>
            <h2 className="jl-final-h2 jl-reveal" id="final-cta-title">
              Start getting clients<br />
              <em style={{ color: '#F5C4B3' }}>this week.</em>
            </h2>
            <p className="jl-final-sub jl-reveal">
              Your profile goes live within 48 hours of registration. Every day without
              a listing is a potential client lost to a competitor.
            </p>
            <div className="jl-final-cta-row jl-reveal">
              <a href="#apply-form" className="jl-cta-primary">
                <Briefcase size={18} aria-hidden="true" />
                Apply Now — It's Free
              </a>
              <Link to="/lawyer-plans" className="jl-cta-secondary">
                Explore Plans
              </Link>
            </div>
            <p className="jl-final-trust jl-reveal">
              <Shield size={13} aria-hidden="true" />
              No credit card · No upfront fee · Bar Council verified within 48h
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 8 — APPLICATION FORM (existing logic, new styling wrapper)
      ══════════════════════════════════════════ */}
      <section id="apply-form" className="jl-form-section" aria-labelledby="form-title">
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="jl-form-header jl-reveal">
            <span className="jl-section-label" style={{ justifyContent: 'center' }}>
              Join the Platform
            </span>
            <h2 className="jl-section-title" id="form-title">
              Submit Your <em>Application</em>
            </h2>
            <p style={{ color: 'var(--txt-3)', marginTop: '0.5rem' }}>
              Our team reviews every application and contacts you within 24–48 hours.
            </p>
          </div>

          {submitted ? (
            /* ── Success state (existing logic, DO NOT CHANGE) ── */
            <div style={formStyles.successCard} className="jl-reveal">
              <CheckCircle size={52} color="var(--green)" aria-hidden="true" />
              <h3 style={formStyles.successTitle}>Application Received!</h3>
              <p style={{ color: 'var(--txt-3)', marginBottom: '2rem' }}>
                We&rsquo;ll contact you within 24–48 hours at <strong>{form.email}</strong>.
              </p>
              <Link to="/" className="btn btn-primary btn-lg">Back to Home</Link>
            </div>
          ) : (
            /* ── Application form (existing fields, DO NOT CHANGE field logic) ── */
            <form
              onSubmit={handleSubmit}
              style={formStyles.form}
              noValidate
              aria-label="Lawyer application form"
              className="jl-reveal"
            >
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jl-name">
                    Full Name <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrap">
                    <Users size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="jl-name"
                      name="name"
                      value={form.name}
                      onChange={onChange}
                      placeholder="Adv. Rahul Sharma"
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'jl-name-error' : undefined}
                      style={errors.name ? { border: '1px solid #DC2626' } : {}}
                    />
                  </div>
                  {errors.name && <span id="jl-name-error" style={formStyles.err} role="alert">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="jl-phone">
                    Phone Number <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrap">
                    <Phone size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="jl-phone"
                      name="phone"
                      value={form.phone}
                      onChange={onChange}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      inputMode="numeric"
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'jl-phone-error' : undefined}
                      style={errors.phone ? { border: '1px solid #DC2626' } : {}}
                    />
                  </div>
                  {errors.phone && <span id="jl-phone-error" style={formStyles.err} role="alert">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jl-email">
                    Email Address <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrap">
                    <Mail size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="jl-email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={onChange}
                      placeholder="your@email.com"
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'jl-email-error' : undefined}
                      style={errors.email ? { border: '1px solid #DC2626' } : {}}
                    />
                  </div>
                  {errors.email && <span id="jl-email-error" style={formStyles.err} role="alert">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="jl-bar">
                    Bar Council Enrolment No. <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrap">
                    <Hash size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="jl-bar"
                      name="barCouncilNumber"
                      value={form.barCouncilNumber}
                      onChange={onChange}
                      placeholder="e.g. D/1234/2010"
                      aria-required="true"
                      aria-invalid={!!errors.barCouncilNumber}
                      aria-describedby={errors.barCouncilNumber ? 'jl-bar-error' : undefined}
                      style={errors.barCouncilNumber ? { border: '1px solid #DC2626' } : {}}
                    />
                  </div>
                  {errors.barCouncilNumber && <span id="jl-bar-error" style={formStyles.err} role="alert">{errors.barCouncilNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="jl-specialization">
                    Specialization <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <select
                    id="jl-specialization"
                    name="specialization"
                    value={form.specialization}
                    onChange={onChange}
                    aria-required="true"
                    aria-invalid={!!errors.specialization}
                    aria-describedby={errors.specialization ? 'jl-spec-error' : undefined}
                    style={errors.specialization ? { border: '1px solid #DC2626' } : {}}
                  >
                    <option value="">Select...</option>
                    {SPECS.map((sp) => <option key={sp}>{sp}</option>)}
                  </select>
                  {errors.specialization && <span id="jl-spec-error" style={formStyles.err} role="alert">{errors.specialization}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="jl-city">
                    City <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                  </label>
                  <div className="input-wrap">
                    <MapPin size={16} className="input-icon" aria-hidden="true" />
                    <input
                      id="jl-city"
                      name="city"
                      value={form.city}
                      onChange={onChange}
                      placeholder="e.g. New Delhi"
                      aria-required="true"
                      aria-invalid={!!errors.city}
                      aria-describedby={errors.city ? 'jl-city-error' : undefined}
                      style={errors.city ? { border: '1px solid #DC2626' } : {}}
                    />
                  </div>
                  {errors.city && <span id="jl-city-error" style={formStyles.err} role="alert">{errors.city}</span>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="jl-exp">
                  Years of Experience <span style={{ color: '#DC2626' }} aria-hidden="true">*</span>
                </label>
                <div className="input-wrap">
                  <Briefcase size={16} className="input-icon" aria-hidden="true" />
                  <input
                    id="jl-exp"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="60"
                    value={form.yearsOfExperience}
                    onChange={onChange}
                    placeholder="e.g. 8"
                    aria-required="true"
                    aria-invalid={!!errors.yearsOfExperience}
                    aria-describedby={errors.yearsOfExperience ? 'jl-exp-error' : undefined}
                    style={errors.yearsOfExperience ? { border: '1px solid #DC2626' } : {}}
                  />
                </div>
                {errors.yearsOfExperience && <span id="jl-exp-error" style={formStyles.err} role="alert">{errors.yearsOfExperience}</span>}
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '1.5rem', gap: 8 }}
                disabled={submitting}
              >
                <Send size={18} aria-hidden="true" />
                {submitting ? 'Submitting…' : 'Submit Application'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '.75rem', color: 'var(--txt-3)', marginTop: '1rem' }}>
                By submitting you agree to our{' '}
                <Link to="/terms" style={{ color: 'var(--bur)' }}>Terms</Link>{' '}
                and{' '}
                <Link to="/privacy-policy" style={{ color: 'var(--bur)' }}>Privacy Policy</Link>.
              </p>
            </form>
          )}
        </div>
      </section>

    </div>
  )
}

/* ── Form inline styles (existing pattern) ── */
const formStyles = {
  form: {
    background: '#fff',
    padding: '2.5rem',
    borderRadius: '24px',
    border: '1px solid var(--border)',
    boxShadow: '0 8px 32px rgba(123,29,46,0.07)'
  },
  err: { color: '#DC2626', fontSize: '.75rem', marginTop: 4, display: 'block' },
  successCard: {
    background: 'var(--green-l)',
    padding: '4rem 3rem',
    borderRadius: '24px',
    border: '1px solid #86efac',
    textAlign: 'center'
  },
  successTitle: {
    fontSize: '1.5rem',
    fontFamily: "'Plus Jakarta Sans', serif",
    marginTop: '1.5rem',
    marginBottom: 8
  }
}
