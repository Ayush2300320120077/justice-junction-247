import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { FileText, Search, Shield, ChevronDown, Check, X, Star, Zap, Lock, Scale, ArrowRight } from 'lucide-react'

// PLACEHOLDER PRICING — confirm real numbers before launch
const PLANS = [
  {
    id: 'free', 
    name: 'Basic Access', 
    price: 0, 
    icon: <Search size={36} color="rgba(255,255,255,0.7)" />,
    tagline: 'Always free to search and explore',
    description: 'Perfect for individuals looking to find and book lawyers on a pay-per-consultation basis.',
    features: ['Search all 500+ verified lawyers', 'View lawyer ratings & detailed reviews', 'Access to the Knowledge Hub', 'Pay-per-consultation access'],
    notIncluded: ['Free document generator', 'Priority consultation matching', 'Dedicated legal assistant'],
    color: 'rgba(255,255,255,0.1)'
  },
  {
    id: 'plus', 
    name: 'Justice Plus', 
    price: 299, 
    icon: <FileText size={36} color="#C9943A" />,
    tagline: 'For individuals needing legal documents',
    description: 'Unlock our AI-powered document generator and create legally binding templates instantly.',
    features: ['Everything in Basic', 'Unlimited legal document generator', 'Download templates in PDF/Word', 'Priority consultation matching', '10% off all consultation fees'],
    notIncluded: ['Dedicated legal assistant', 'Contract review'],
    popular: true, 
    color: '#C9943A' // Gold
  },
  {
    id: 'premium', 
    name: 'Justice Premium', 
    price: 999, 
    icon: <Shield size={36} color="#4ADE80" />,
    tagline: 'For small businesses & frequent needs',
    description: 'The ultimate legal safety net with dedicated support and free monthly consultations.',
    features: ['Everything in Plus', 'Dedicated legal assistant', '24/7 priority email support', 'Free first 15-min consultation/mo', 'Contract review (up to 5 pages)'],
    notIncluded: [],
    color: '#4ADE80' // Green
  }
]

const FEATURES_MATRIX = [
  { feature: 'Lawyer Directory Access', basic: true, plus: true, premium: true },
  { feature: 'Knowledge Hub Articles', basic: true, plus: true, premium: true },
  { feature: 'Pay-per-consultation', basic: true, plus: true, premium: true },
  { feature: 'AI Document Generator', basic: false, plus: true, premium: true },
  { feature: 'PDF & Word Downloads', basic: false, plus: true, premium: true },
  { feature: 'Discount on Consultations', basic: false, plus: '10% Off', premium: '15% Off' },
  { feature: 'Priority Lawyer Matching', basic: false, plus: true, premium: true },
  { feature: 'Free 15-min Consultation/mo', basic: false, plus: false, premium: true },
  { feature: 'Dedicated Legal Assistant', basic: false, plus: false, premium: true },
  { feature: 'Basic Contract Review', basic: false, plus: false, premium: 'Up to 5 pages' },
]

export default function ClientPricing() {
  const [loading, setLoading] = useState(null)
  const [annual, setAnnual] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { isLoggedIn, user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSubscribe = async (planId, price) => {
    if (price === 0) {
      navigate('/register');
      return;
    }
    if (!isLoggedIn) { navigate('/register'); return }
    if (user?.role !== 'client') { showToast('Only clients can subscribe to these plans', 'error'); return }
    
    setLoading(planId)
    try {
      const res = await fetch('/api/payments/subscribe', { credentials: 'include',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planId })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          order_id: data.orderId,
          name: 'Justice Junction 24/7',
          description: `${PLANS.find(p=>p.id===planId)?.name} Plan — Monthly Subscription`,
          image: '/logo.png',
          prefill: { name: user.name, email: user.email },
          theme: { color: '#7B1D2E' },
          handler: async (response) => {
            try {
              const verify = await fetch('/api/payments/verify-subscription', { credentials: 'include',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...response, plan: planId })
              })
              const vData = await verify.json()
              if (!verify.ok) throw new Error(vData.error)
              showToast(`🎉 ${PLANS.find(p=>p.id===planId)?.name} plan activated!`)
              navigate('/dashboard')
            } catch (err) { showToast(err.message, 'error') }
          }
        })
        rzp.open()
      }
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setLoading(null)
    }
  }

  const displayPrice = (price) => annual ? Math.round(price * 10) : price

  return (
    <div style={{ backgroundColor: '#0f0508', color: '#fff', minHeight: '100vh', overflowX: 'hidden', paddingTop: 72 }}>
      <Helmet>
        <title>Pricing — Premium Legal Access | Justice Junction 24/7</title>
        <meta name="description" content="Transparent, affordable pricing for legal services, AI document generation, and premium legal support on Justice Junction 24/7." />
      </Helmet>

      {/* Embedded CSS for unique cinematic effects */}
      <style dangerouslySetInnerHTML={{__html: `
        .pricing-hero {
          position: relative;
          padding: 8rem 5vw 10rem;
          background: url('/pricing-cinematic-bg.jpg') center/cover no-repeat;
          background-attachment: fixed;
          text-align: center;
          border-bottom: 1px solid rgba(201, 148, 58, 0.2);
        }
        .pricing-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(15,5,8,0.4) 0%, rgba(42,22,32,0.85) 60%, rgba(15,5,8,1) 100%);
          z-index: 1;
        }
        .pricing-hero::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 0%, rgba(201, 148, 58, 0.15) 0%, transparent 60%);
          z-index: 1;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          margin: 0 auto;
        }
        .glass-card {
          background: rgba(42, 22, 32, 0.4);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .glass-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4), 0 0 20px rgba(201, 148, 58, 0.1);
          border-color: rgba(201, 148, 58, 0.3);
        }
        .popular-glow {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, var(--gold), transparent);
          box-shadow: 0 0 15px var(--gold);
        }
        .switch-toggle {
          width: 56px;
          height: 30px;
          background: rgba(255,255,255,0.1);
          border-radius: 50px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .switch-toggle.active {
          background: var(--gold);
          border-color: var(--gold);
          box-shadow: 0 0 15px rgba(201, 148, 58, 0.4);
        }
        .switch-knob {
          width: 22px;
          height: 22px;
          background: #fff;
          border-radius: 50%;
          position: absolute;
          top: 3px;
          left: 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        .switch-toggle.active .switch-knob {
          left: 28px;
        }
        .matrix-row:hover {
          background: rgba(255,255,255,0.03);
        }
        .gradient-text {
          background: linear-gradient(135deg, #FFF, #E8C9A8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}} />

      {/* ─────────────────────────────────────────────────────────
          HERO SECTION
      ───────────────────────────────────────────────────────── */}
      <section className="pricing-hero">
        <div className="hero-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '0.4rem 1.2rem', background: 'rgba(201,148,58,0.15)', border: '1px solid rgba(201,148,58,0.3)', borderRadius: 50, color: 'var(--gold-l)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
            <Zap size={14} fill="currentColor" /> Transparent Pricing
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.8rem, 6vw, 4.5rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: '1.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
            Justice is priceless.<br />
            <span className="gradient-text">Access to it shouldn't be.</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'rgba(255,255,255,0.75)', maxWidth: 650, margin: '0 auto 3rem', lineHeight: 1.8 }}>
            Whether you need to instantly generate a legally-binding contract, or consult a Bar-verified advocate, we have a tier designed for your exact needs.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <span style={{ fontSize: '1rem', color: annual ? 'rgba(255,255,255,0.5)' : '#fff', fontWeight: 600, transition: 'color 0.3s' }}>Monthly</span>
            <div className={`switch-toggle ${annual ? 'active' : ''}`} onClick={() => setAnnual(!annual)}>
              <div className="switch-knob" />
            </div>
            <span style={{ fontSize: '1rem', color: annual ? '#fff' : 'rgba(255,255,255,0.5)', fontWeight: 600, transition: 'color 0.3s', display: 'flex', alignItems: 'center', gap: 10 }}>
              Annually 
              <span style={{ background: 'rgba(74, 222, 128, 0.15)', color: '#4ADE80', padding: '0.2rem 0.6rem', borderRadius: 50, fontSize: '0.7rem', fontWeight: 800, border: '1px solid rgba(74,222,128,0.3)' }}>SAVE 16%</span>
            </span>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          PRICING CARDS
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '0 5vw 6rem', marginTop: '-6rem', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {PLANS.map(plan => (
            <div key={plan.id} className="glass-card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              {plan.popular && <div className="popular-glow" />}
              {plan.popular && (
                <div style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(201,148,58,0.15)', color: 'var(--gold)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.4rem 1rem', borderRadius: 50, border: '1px solid rgba(201,148,58,0.3)' }}>
                  Most Popular
                </div>
              )}
              
              <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
                {plan.icon}
              </div>
              
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' }}>{plan.name}</h3>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem', minHeight: 42 }}>{plan.description}</p>
              
              <div style={{ marginBottom: '2rem' }}>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '3rem', fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                  ₹{displayPrice(plan.price).toLocaleString()}
                </span>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>{plan.price > 0 ? '/mo' : ''}</span>
                {annual && plan.price > 0 && (
                  <div style={{ color: '#4ADE80', fontSize: '0.8rem', fontWeight: 600, marginTop: '0.5rem' }}>Billed ₹{(plan.price * 10).toLocaleString()} yearly</div>
                )}
              </div>

              <button 
                onClick={() => handleSubscribe(plan.id, displayPrice(plan.price))}
                disabled={loading === plan.id}
                style={{ 
                  width: '100%', 
                  padding: '1rem', 
                  borderRadius: 12, 
                  background: plan.popular ? 'var(--gold)' : 'rgba(255,255,255,0.1)', 
                  color: plan.popular ? '#000' : '#fff', 
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  fontWeight: 700,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  marginBottom: '2rem',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => { if (!plan.popular) e.currentTarget.style.background = 'rgba(255,255,255,0.2)' }}
                onMouseOut={(e) => { if (!plan.popular) e.currentTarget.style.background = 'rgba(255,255,255,0.1)' }}
              >
                {loading === plan.id ? 'Processing...' : plan.price === 0 ? 'Start for Free' : `Upgrade to ${plan.name}`}
                {!loading && <ArrowRight size={18} />}
              </button>

              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem' }}>What's Included</p>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>
                    <Check size={18} color={plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
                {plan.notIncluded.length > 0 && <div style={{ height: 1, background: 'rgba(255,255,255,0.1)', margin: '1rem 0' }} />}
                {plan.notIncluded.map(f => (
                  <div key={f} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', fontSize: '0.9rem', color: 'rgba(255,255,255,0.4)' }}>
                    <X size={18} color="rgba(255,255,255,0.2)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ lineHeight: 1.4 }}>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FEATURE COMPARISON MATRIX
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 5vw', background: 'rgba(255,255,255,0.02)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Compare Plans side-by-side</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Find the perfect feature set for your legal requirements.</p>
          </div>

          <div className="glass-card" style={{ padding: 0, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.1em' }}>Features</div>
              <div style={{ fontWeight: 700, textAlign: 'center' }}>Basic</div>
              <div style={{ fontWeight: 700, textAlign: 'center', color: 'var(--gold)' }}>Plus</div>
              <div style={{ fontWeight: 700, textAlign: 'center', color: '#4ADE80' }}>Premium</div>
            </div>
            {FEATURES_MATRIX.map((row, i) => (
              <div key={i} className="matrix-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', padding: '1.2rem 1.5rem', borderBottom: i < FEATURES_MATRIX.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', transition: 'background 0.2s' }}>
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)' }}>{row.feature}</div>
                
                {/* Basic */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.85rem' }}>
                  {typeof row.basic === 'boolean' ? (row.basic ? <Check size={18} color="rgba(255,255,255,0.5)" /> : <X size={18} color="rgba(255,255,255,0.1)" />) : <span style={{ color: 'rgba(255,255,255,0.5)' }}>{row.basic}</span>}
                </div>
                
                {/* Plus */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.85rem' }}>
                  {typeof row.plus === 'boolean' ? (row.plus ? <Check size={18} color="var(--gold)" /> : <X size={18} color="rgba(255,255,255,0.1)" />) : <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{row.plus}</span>}
                </div>
                
                {/* Premium */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.85rem' }}>
                  {typeof row.premium === 'boolean' ? (row.premium ? <Check size={18} color="#4ADE80" /> : <X size={18} color="rgba(255,255,255,0.1)" />) : <span style={{ color: '#4ADE80', fontWeight: 600 }}>{row.premium}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          ROI & VALUE SECTION
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 5vw' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          <div style={{ flex: '1 1 400px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '0.3rem 0.8rem', background: 'rgba(255,255,255,0.1)', borderRadius: 50, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem' }}>
              <Scale size={14} /> The Real Value
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem', lineHeight: 1.2 }}>
              Stop paying traditional firm overheads.
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.05rem', lineHeight: 1.8, marginBottom: '2rem' }}>
              When you hire a traditional lawyer to draft a simple agreement, you're paying for their office rent, their staff, and their time. With Justice Junction Plus, our AI handles the paperwork instantly, verified by legal experts, for a fraction of the cost.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Save ₹15,000+ per year on basic legal document drafting',
                'Connect with verified advocates without the middleman markup',
                'Access your legal dashboard securely from any device'
              ].map((item, i) => (
                <li key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', fontSize: '0.95rem' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(201,148,58,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={14} color="var(--gold)" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ flex: '1 1 400px' }}>
            <div className="glass-card" style={{ padding: '2rem', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Traditional Drafting</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹5,000+ / doc</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Initial Consultation</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹2,000 / hr</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>Contract Review</span>
                <span style={{ color: '#fff', fontWeight: 700 }}>₹3,500+</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', padding: '1rem', background: 'rgba(201,148,58,0.1)', borderRadius: 12, border: '1px solid rgba(201,148,58,0.2)' }}>
                <span style={{ color: 'var(--gold)', fontWeight: 700 }}>Justice Plus</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>₹299/mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          TRUST / TESTIMONIAL
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 5vw', background: 'rgba(42, 22, 32, 0.4)', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginBottom: '1.5rem' }}>
            {[1,2,3,4,5].map(i => <Star key={i} size={24} fill="var(--gold)" color="var(--gold)" />)}
          </div>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontStyle: 'italic', lineHeight: 1.4, marginBottom: '2rem' }}>
            "The document generator alone saved my small business over ₹20,000 in legal drafting fees in just two months. When I actually needed a lawyer for a complex matter, finding a verified advocate on the platform was instant."
          </p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#fff', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>R</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 700 }}>Rahul Verma</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Small Business Owner, Delhi</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FAQ
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 5vw' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Frequently Asked Questions</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Everything you need to know about our billing and platform.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              ['Do I have to pay to search for a lawyer?', 'No, searching the Justice Junction directory and reading lawyer profiles and reviews is completely free. You only pay when you book a consultation.'],
              ['How do consultation fees work?', 'Each lawyer sets their own consultation fee, which is clearly displayed on their profile. You pay this fee securely through Razorpay when booking your appointment.'],
              ['What does the Justice Plus plan include?', 'Justice Plus gives you unlimited access to our AI-powered legal document generator, allowing you to create customized rental agreements, NDAs, employment contracts, and more, ready to download instantly in PDF or Word.'],
              ['Is my payment information safe?', 'Absolutely. All transactions are securely processed by Razorpay using bank-level encryption. We do not store your credit card or bank details on our servers.'],
              ['Can I cancel my subscription?', 'Yes, you can cancel your Justice Plus or Premium subscription at any time from your dashboard settings. There are no lock-in periods or cancellation fees.']
            ].map(([q,a]) => <FAQ key={q} q={q} a={a}/>)}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────
          FINAL CTA
      ───────────────────────────────────────────────────────── */}
      <section style={{ padding: '6rem 5vw', background: 'linear-gradient(0deg, rgba(123, 29, 46, 0.4) 0%, transparent 100%)', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, var(--bur), transparent)' }} />
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, marginBottom: '1rem' }}>Ready for better legal access?</h2>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>Join thousands of Indians managing their legal needs smarter.</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" style={{ padding: '1rem 2rem', background: '#fff', color: '#000', borderRadius: 50, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, transition: 'transform 0.2s' }} onMouseOver={(e)=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={(e)=>e.currentTarget.style.transform='translateY(0)'}>
            Get Started Free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}

function FAQ({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="glass-card" style={{ padding: 0, border: '1px solid rgba(255,255,255,0.05)', borderRadius: 12 }}>
      <button 
        onClick={() => setOpen(o=>!o)} 
        style={{ width: '100%', padding: '1.5rem', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#fff', fontSize: '1.05rem', fontWeight: 600, textAlign: 'left' }}
      >
        <span>{q}</span>
        <span style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none', flexShrink: 0, marginLeft: 12, color: 'var(--gold)' }}>
          <ChevronDown size={20}/>
        </span>
      </button>
      <div style={{ overflow: 'hidden', transition: 'max-height 0.4s ease, opacity 0.4s ease', maxHeight: open ? 300 : 0, opacity: open ? 1 : 0 }}>
        <p style={{ padding: '0 1.5rem 1.5rem', margin: 0, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>{a}</p>
      </div>
    </div>
  )
}
