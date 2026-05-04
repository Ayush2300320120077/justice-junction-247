import Head from 'next/head'
import Link from 'next/link'
import { Search, BarChart2, Calendar, Activity, UserPlus, ShieldCheck, Settings, Users, Lock, CreditCard, Eye, Phone } from 'lucide-react'

export default function HowItWorks() {
  return (
    <div className="page-wrap" style={{ background: 'var(--cream)' }}>
      <Head>
        <title>How It Works — Justice Junction 24/7</title>
        <meta name="description" content="Learn how Justice Junction connects clients with verified lawyers in 4 easy steps. For clients and lawyers alike." />
        <meta property="og:title" content="How It Works — Justice Junction 24/7" />
        <meta property="og:description" content="Find and book verified lawyers in 4 easy steps." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/how-it-works" />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero */}
      <section style={s.hero}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="sec-label" style={{ justifyContent: 'center' }}>The Process</div>
          <h1 style={s.h1}>How Justice Junction <em>Works</em></h1>
          <p style={s.heroSub}>
            Whether you're seeking legal help or offering it — our platform makes the process
            transparent, fast, and secure.
          </p>
        </div>
      </section>

      {/* Section 1: For Clients */}
      <section style={{ padding: '6rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}>For Clients</div>
            <h2 style={s.h2}>Get legal help in <em>4 easy steps.</em></h2>
          </div>

          <div style={s.stepsGrid}>
            {[
              { icon: <Search size={32} />, step: '01', title: 'Search', desc: 'Enter your city and legal issue. Browse verified lawyers with upfront pricing, ratings, and reviews.' },
              { icon: <BarChart2 size={32} />, step: '02', title: 'Compare', desc: 'Compare fees, experience, languages, and specializations side by side. No hidden costs — ever.' },
              { icon: <Calendar size={32} />, step: '03', title: 'Book', desc: 'Pick a convenient time slot. Pay securely via Razorpay. Get instant confirmation on your email.' },
              { icon: <Activity size={32} />, step: '04', title: 'Track', desc: 'Your lawyer posts real-time case updates to your dashboard. No more chasing phone calls.' },
            ].map((item, i) => (
              <div key={item.title} className="card card-hover magnetic-hover" style={s.stepCard}>
                <div style={s.stepNum}>{item.step}</div>
                <div style={s.stepIcon}>{item.icon}</div>
                <h3 style={s.stepTitle}>{item.title}</h3>
                <p style={s.stepDesc}>{item.desc}</p>
                {i < 3 && <div style={s.stepArrow} className="hide-mobile">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: For Lawyers */}
      <section style={{ padding: '6rem 0', background: 'var(--cream-2)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}>For Lawyers</div>
            <h2 style={s.h2}>Grow your practice <em>digitally.</em></h2>
          </div>

          <div style={s.stepsGrid}>
            {[
              { icon: <UserPlus size={32} />, step: '01', title: 'Register', desc: 'Sign up with your Bar Council details, practice areas, fees, and availability in our multi-step wizard.' },
              { icon: <ShieldCheck size={32} />, step: '02', title: 'Get Verified', desc: 'We verify your Bar Council registration. Your profile goes live within 48 hours with a verified badge.' },
              { icon: <Settings size={32} />, step: '03', title: 'Set Your Profile', desc: 'Customize your bio, consultation fee, available days, and preferred consultation modes (video/in-person/phone).' },
              { icon: <Users size={32} />, step: '04', title: 'Get Clients', desc: 'Clients discover your profile, read your reviews, and book directly. Payments credited securely to your account.' },
            ].map((item, i) => (
              <div key={item.title} className="card card-hover magnetic-hover" style={s.stepCard}>
                <div style={{ ...s.stepNum, background: 'var(--gold)', color: '#000' }}>{item.step}</div>
                <div style={{ ...s.stepIcon, color: 'var(--gold)' }}>{item.icon}</div>
                <h3 style={s.stepTitle}>{item.title}</h3>
                <p style={s.stepDesc}>{item.desc}</p>
                {i < 3 && <div style={s.stepArrow} className="hide-mobile">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Security & Trust */}
      <section style={{ padding: '6rem 0', background: '#fff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div className="sec-label" style={{ justifyContent: 'center' }}>Trust & Security</div>
            <h2 style={s.h2}>Built on <em>trust.</em></h2>
          </div>

          <div style={s.trustGrid}>
            {[
              { icon: <CreditCard size={28} />, title: 'Secure Payments', desc: 'All payments are processed through Razorpay with 256-bit encryption and PCI DSS compliance. Your money is safe.' },
              { icon: <ShieldCheck size={28} />, title: 'Verified Credentials', desc: 'Every lawyer undergoes Bar Council of India registration verification. Look for the verified badge on profiles.' },
              { icon: <Lock size={28} />, title: 'Complete Privacy', desc: 'All communications are encrypted. We never share your personal data with third parties. Your case details are visible only to you and your lawyer.' },
              { icon: <Eye size={28} />, title: 'Full Transparency', desc: 'Consultation fees are shown upfront. No hidden charges. Read real reviews from verified clients before booking.' },
              { icon: <Phone size={28} />, title: '24/7 Support', desc: 'Our support team is available round the clock via WhatsApp, email, and phone. We\'re here whenever you need us.' },
              { icon: <Activity size={28} />, title: 'Real-Time Updates', desc: 'Track your case progress through your dashboard. Your lawyer posts updates so you\'re never left in the dark.' },
            ].map(item => (
              <div key={item.title} style={s.trustCard}>
                <div style={s.trustIcon}>{item.icon}</div>
                <h3 style={s.trustTitle}>{item.title}</h3>
                <p style={s.trustDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: CTA */}
      <section style={s.cta}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={s.ctaTitle}>Ready to get started?</h2>
          <p style={s.ctaSub}>
            Whether you need legal help or want to grow your practice — Justice Junction is here for you.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/search" className="btn btn-gold btn-xl">Find a Lawyer</Link>
            <Link href="/join-as-lawyer" className="btn btn-outline-white btn-xl">Join as Advocate</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '8rem 0 6rem', background: 'linear-gradient(135deg, rgba(123,29,46,0.05), rgba(201,148,58,0.08))' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' },
  heroSub: { fontSize: '1.2rem', color: 'var(--txt-3)', maxWidth: 600, margin: '1.5rem auto 0', lineHeight: 1.7 },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800 },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' },
  stepCard: { textAlign: 'center', padding: '2.5rem 2rem', position: 'relative', background: '#fff' },
  stepNum: { position: 'absolute', top: 20, left: 20, width: 32, height: 32, background: 'var(--bur)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.8rem', fontWeight: 800 },
  stepIcon: { color: 'var(--bur)', marginBottom: 16, display: 'flex', justifyContent: 'center' },
  stepTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', marginBottom: 12 },
  stepDesc: { fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.7 },
  stepArrow: { position: 'absolute', right: -22, top: '50%', transform: 'translateY(-50%)', fontSize: '1.5rem', color: 'var(--border-2)', fontWeight: 300 },
  trustGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', maxWidth: 1100, margin: '0 auto' },
  trustCard: { background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', transition: 'all .3s ease' },
  trustIcon: { width: 52, height: 52, borderRadius: 14, background: 'rgba(123,29,46,0.06)', color: 'var(--bur)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' },
  trustTitle: { fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', marginBottom: 8 },
  trustDesc: { fontSize: '.9rem', color: 'var(--txt-3)', lineHeight: 1.7 },
  cta: { padding: '8rem 0', background: 'linear-gradient(rgba(42,22,32,0.95), rgba(123,29,46,0.98))', color: '#fff' },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem' },
  ctaSub: { fontSize: '1.1rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: 550, margin: '0 auto 3rem' },
}
