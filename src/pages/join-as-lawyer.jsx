import Head from 'next/head'
import Link from 'next/link'
import { CheckCircle, Users, BarChart, Globe, Shield, Star, Play } from 'lucide-react'

const BENEFITS = [
  { title: 'Global Reach', desc: 'Connect with clients from across India and the globe without leaving your chamber.', icon: <Globe size={24}/> },
  { title: 'Fixed Pricing', desc: 'Set your own consultation fees and get paid upfront. No more chasing payments.', icon: <CheckCircle size={24}/> },
  { title: 'Smart Dashboard', desc: 'Manage appointments, post case updates, and track your practice performance.', icon: <BarChart size={24}/> },
  { title: 'Verified Status', desc: 'Get a verified badge on your profile to build instant trust with potential clients.', icon: <Shield size={24}/> },
]

export default function JoinAsLawyer() {
  return (
    <div style={{ paddingTop: 95, background: '#fff', minHeight: '100vh' }}>
      <Head>
        <title>Join as an Advocate — Grow Your Legal Practice — Justice Junction 24/7</title>
        <meta name="description" content="Register as a verified advocate on Justice Junction 24/7. Get quality clients, manage your cases, and grow your legal practice online." />
      </Head>

      {/* Hero */}
      <section style={s.hero}>
        <div className="container" style={s.heroGrid}>
          <div style={s.heroContent}>
            <div style={s.badge}>For Legal Professionals</div>
            <h1 style={s.h1}>Digitize and <em>Scale</em> Your Practice.</h1>
            <p style={s.heroSub}>Join India's fastest-growing legal-tech platform. Connect with thousands of verified clients and manage your entire practice from one smart dashboard.</p>
            <div style={{display: 'flex', gap: 15, flexWrap: 'wrap'}}>
              <Link href="/register?role=lawyer" className="btn btn-primary btn-xl">Register Now — It's Free</Link>
              <Link href="/lawyer-plans" className="btn btn-outline btn-xl">View Subscription Plans</Link>
            </div>
            <div style={s.trustNote}>
              <Users size={16}/> 2,400+ advocates are already growing with us.
            </div>
          </div>
          <div style={s.heroImageWrap} className="hide-mobile">
             <div style={s.imagePlaceholder}>
               <div style={s.playBtn}><Play size={32} fill="currentColor"/></div>
               <div style={s.imageLabel}>Watch how it works</div>
             </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section style={{padding: '7rem 5vw', background: 'var(--cream-2)'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 className="sec-title" style={{textAlign: 'center'}}>Why join <em>Justice Junction?</em></h2>
            <p style={{color: 'var(--txt-3)', maxWidth: 600, margin: '0 auto'}}>We handle the technology and marketing, so you can focus on what you do best — practicing law.</p>
          </div>
          <div style={s.benefitsGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} style={s.benefitCard}>
                <div style={s.iconBox}>{b.icon}</div>
                <h3 style={s.benefitTitle}>{b.title}</h3>
                <p style={s.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{padding: '7rem 5vw'}}>
        <div className="container" style={s.stepsContainer}>
          <div style={s.stepsInfo}>
            <h2 className="sec-title">Simple <em>Onboarding.</em></h2>
            <div style={s.stepsList}>
              {[
                ['01', 'Register', 'Fill in your basic professional details and bar registration number.'],
                ['02', 'Verification', 'Our team verifies your credentials within 24-48 hours.'],
                ['03', 'Go Live', 'Set your consultation fees, availability, and start receiving bookings.']
              ].map(([num, title, desc]) => (
                <div key={num} style={s.stepItem}>
                  <div style={s.stepNum}>{num}</div>
                  <div>
                    <h4 style={{margin: '0 0 5px', fontSize: '1.2rem'}}>{title}</h4>
                    <p style={{margin: 0, fontSize: '.9rem', color: 'var(--txt-3)'}}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link href="/register?role=lawyer" className="btn btn-primary" style={{marginTop: '2rem'}}>Get Started Today</Link>
          </div>
          <div style={s.stepsVisual} className="hide-mobile">
            {/* Visual element or image */}
            <div style={s.dashboardPreview}>
              <div style={s.dbHead}>Lawyer Dashboard Preview</div>
              <div style={s.dbBody}>
                <div style={s.dbStat}><span>₹45,200</span> Total Earnings</div>
                <div style={s.dbStat}><span>12</span> Active Clients</div>
                <div style={s.dbLine} />
                <div style={s.dbLine} />
                <div style={s.dbLine} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section style={s.testimonial}>
        <div className="container" style={{textAlign: 'center', maxWidth: 800}}>
          <div style={{color: 'var(--gold)', marginBottom: '1.5rem'}}><Star size={24} fill="currentColor"/><Star size={24} fill="currentColor"/><Star size={24} fill="currentColor"/><Star size={24} fill="currentColor"/><Star size={24} fill="currentColor"/></div>
          <p style={s.testiText}>"Justice Junction has transformed my solo practice into a digital law firm. I get high-quality leads and the automated billing saves me hours every week."</p>
          <div style={{fontWeight: 800, fontSize: '1.1rem'}}>Advocate Rahul Sharma</div>
          <div style={{fontSize: '.9rem', color: 'var(--txt-3)'}}>Criminal Defence, Delhi High Court</div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={s.finalCta}>
        <div className="container" style={{textAlign: 'center'}}>
          <h2 style={s.ctaTitle}>Ready to take your practice <em style={{color: 'var(--gold-l)'}}>online?</em></h2>
          <Link href="/register?role=lawyer" className="btn btn-gold btn-xl">Join the Future of Law</Link>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '6rem 0', overflow: 'hidden' },
  heroGrid: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' },
  heroContent: { maxWidth: 650 },
  badge: { display: 'inline-block', background: 'var(--bur-l)', color: '#fff', padding: '.4rem 1rem', borderRadius: 50, fontSize: '.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.5rem' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' },
  heroSub: { fontSize: '1.15rem', color: 'var(--txt-2)', marginBottom: '2.5rem', lineHeight: 1.6 },
  trustNote: { marginTop: '2rem', fontSize: '.85rem', color: 'var(--txt-3)', display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 },
  heroImageWrap: { position: 'relative' },
  imagePlaceholder: { width: '100%', aspectRatio: '4/3', background: 'var(--cream)', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' },
  playBtn: { width: 80, height: 80, borderRadius: '50%', background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingLeft: 6, marginBottom: 15, boxShadow: '0 10px 30px rgba(123,29,46,0.3)' },
  imageLabel: { fontWeight: 700, color: 'var(--bur)', fontSize: '.9rem' },
  
  benefitsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
  benefitCard: { background: '#fff', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' },
  iconBox: { width: 56, height: 56, borderRadius: '16px', background: 'var(--bur-l)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' },
  benefitTitle: { fontSize: '1.25rem', fontWeight: 800, marginBottom: 10 },
  benefitDesc: { fontSize: '.9rem', color: 'var(--txt-2)', lineHeight: 1.6 },
  
  stepsContainer: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' },
  stepsList: { marginTop: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem' },
  stepItem: { display: 'flex', gap: 20, alignItems: 'flex-start' },
  stepNum: { width: 36, height: 36, borderRadius: '10px', background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '.9rem', flexShrink: 0 },
  
  dashboardPreview: { background: '#fff', borderRadius: '24px', border: '1px solid var(--border)', padding: '2rem', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', transform: 'rotate(-2deg)' },
  dbHead: { fontWeight: 800, fontSize: '.9rem', marginBottom: '1.5rem', color: 'var(--bur)', borderBottom: '1px solid var(--border)', paddingBottom: 10 },
  dbStat: { padding: '1rem', background: 'var(--cream-2)', borderRadius: '12px', marginBottom: 10, fontSize: '.85rem', fontWeight: 600 },
  dbLine: { height: 8, background: 'var(--border)', borderRadius: 10, marginBottom: 10, width: '80%' },
  
  testimonial: { padding: '7rem 5vw', background: 'var(--cream-2)' },
  testiText: { fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontStyle: 'italic', marginBottom: '2rem', lineHeight: 1.5 },
  
  finalCta: { padding: '7rem 0', background: 'var(--bur)', color: '#fff' },
  ctaTitle: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, marginBottom: '2.5rem' }
}
