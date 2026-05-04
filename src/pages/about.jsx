import Head from 'next/head'
import { Shield, Clock, Users, Award, MapPin, Scale, Target, Globe, Zap } from 'lucide-react'

export default function About() {
  return (
    <div className="page-wrap" style={{background: 'var(--cream)'}}>
      <Head>
        <title>About Us — Justice Junction 24/7</title>
        <meta name="description" content="Learn about India's first transparent lawyer discovery platform and our mission to democratize legal access." />
        <meta property="og:title" content="About Us — Justice Junction 24/7" />
        <meta property="og:description" content="Learn about India's first transparent lawyer discovery platform." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/about" />
        <meta property="og:type" content="website" />
      </Head>

      {/* Hero */}
      <section style={s.hero}>
        <div className="container" style={{textAlign: 'center'}}>
          <div className="sec-label" style={{justifyContent: 'center'}}>Our Story</div>
          <h1 style={s.h1}>Democratizing Legal Access <br/><em>for every Indian.</em></h1>
          <p style={s.heroSub}>We bridge the gap between people and justice through transparency, technology, and trust.</p>
        </div>
      </section>

      {/* Mission */}
      <section style={{padding: '6rem 0', background: '#fff'}}>
        <div className="container" style={s.grid2} className="mobile-stack container">
          <div>
            <h2 style={s.h2}>The Mission</h2>
            <p style={s.p}>Founded in 2024, Justice Junction was born out of a simple observation: finding a reliable lawyer in India is hard, and pricing is even harder to understand. Our mission is to make legal help as easy as booking a cab — accessible 24/7, with upfront fixed pricing and verified credentials.</p>
            <div style={s.stats} className="mobile-stack">
              <div><div style={s.statNum}>2.4k+</div><div style={s.statLabel}>Verified Lawyers</div></div>
              <div><div style={s.statNum}>150+</div><div style={s.statLabel}>Cities Covered</div></div>
              <div><div style={s.statNum}>50k+</div><div style={s.statLabel}>Happy Clients</div></div>
            </div>
          </div>
          <div style={s.imageBox}>
            <img src="/justice-bg.png" alt="Justice Junction Team" style={s.img} loading="lazy" />
            <div style={s.floatingBadge}>
              <Award size={32} color="var(--gold)"/>
              <div style={{fontWeight: 800}}>Most Trusted <br/>Legal Platform 2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{padding: '6rem 0', background: 'var(--cream-2)'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={s.h2}>Our Core Values</h2>
          </div>
          <div style={s.grid4}>
            {[
              {i: <Shield/>, t: 'Verification', d: 'Every lawyer undergoes a multi-step Bar Council verification process.'},
              {i: <Scale/>, t: 'Transparency', d: 'Fixed consultation fees shown upfront. No hidden costs or surprises.'},
              {i: <Clock/>, t: '24/7 Access', d: 'Legal emergencies don\'t wait. Neither do our advocates.'},
              {i: <Users/>, t: 'Empowerment', d: 'Empowering citizens with legal knowledge through our hub.'},
            ].map((v, i) => (
              <div key={i} className="card card-hover" style={{textAlign: 'center', padding: '3rem 2rem'}}>
                <div style={{color: 'var(--bur)', display: 'flex', justifyContent: 'center', marginBottom: '1.5rem'}}>{v.i}</div>
                <h3 style={{fontFamily: "'Playfair Display', serif", marginBottom: '1rem'}}>{v.t}</h3>
                <p style={{fontSize: '.9rem', color: 'var(--txt-3)'}}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section style={{padding: '6rem 0', background: '#fff'}}>
        <div className="container" style={{maxWidth: 900}}>
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <div className="sec-label" style={{justifyContent: 'center'}}>The Founder</div>
            <h2 style={s.h2}>Built by someone who saw the <em>problem firsthand.</em></h2>
          </div>

          <div style={s.founderCard}>
            <div style={s.founderAvatar}>AK</div>
            <div style={{flex: 1}}>
              <p style={{fontSize: '1.05rem', color: 'var(--txt-2)', lineHeight: 1.8, marginBottom: '1.5rem'}}>
                Justice Junction was founded by <strong>Ayush Kumar</strong>, a young entrepreneur from Ghaziabad who watched his family struggle to find an honest, affordable lawyer during a property dispute. He spent 6 months building a platform so no Indian family ever has to go through that uncertainty again.
              </p>
              <div style={s.founderMeta}>
                <div>
                  <div style={{fontWeight: 800, fontSize: '1.1rem', color: 'var(--txt)'}}>Ayush Kumar</div>
                  <div style={{fontSize: '.85rem', color: 'var(--bur)', fontWeight: 700}}>Founder & CEO</div>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: '.85rem', color: 'var(--txt-3)', fontWeight: 600}}>
                  <MapPin size={14} /> Ghaziabad, UP
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision 2026 */}
      <section style={{padding: '6rem 0', background: 'var(--cream-2)'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <div className="sec-label" style={{justifyContent: 'center'}}>Looking Ahead</div>
            <h2 style={s.h2}>Our Vision for <em>2026</em></h2>
          </div>

          <div style={s.visionGrid}>
            {[
              { icon: <Target size={32} />, num: '10,000+', title: 'Verified Lawyers', desc: 'Across all 28 states and 8 union territories of India' },
              { icon: <Users size={32} />, num: '1 Million', title: 'Indians Served', desc: 'With transparent, affordable legal help' },
              { icon: <Globe size={32} />, num: '12+', title: 'Regional Languages', desc: 'Hindi + major regional language support' },
            ].map(item => (
              <div key={item.title} className="card card-hover magnetic-hover" style={s.visionCard}>
                <div style={s.visionIcon}>{item.icon}</div>
                <div style={s.visionNum}>{item.num}</div>
                <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: 8}}>{item.title}</h3>
                <p style={{fontSize: '.9rem', color: 'var(--txt-3)'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press / As Seen On */}
      <section style={{padding: '4rem 0', background: '#fff', borderTop: '1px solid var(--border)'}}>
        <div className="container" style={{textAlign: 'center'}}>
          <div style={{fontSize: '.75rem', fontWeight: 800, color: 'var(--txt-3)', letterSpacing: '2px', marginBottom: '2rem'}}>AS SEEN ON</div>
          <div style={s.pressLogos}>
            {['The Times of India', 'NDTV', 'LiveLaw', 'Bar & Bench', 'Business Standard'].map(name => (
              <span key={name} style={s.pressLogo}>{name}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '8rem 0 6rem', background: 'linear-gradient(rgba(123,29,46,0.05), rgba(201,148,58,0.05))' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1 },
  heroSub: { fontSize: '1.2rem', color: 'var(--txt-3)', maxWidth: 600, margin: '1.5rem auto 0' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' },
  grid4: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' },
  p: { fontSize: '1.1rem', color: 'var(--txt-2)', lineHeight: 1.8, marginBottom: '2rem' },
  stats: { display: 'flex', gap: '3rem', marginTop: '3rem' },
  statNum: { fontSize: '2.5rem', fontWeight: 800, color: 'var(--bur)' },
  statLabel: { fontSize: '.8rem', color: 'var(--txt-3)', textTransform: 'uppercase', fontWeight: 700 },
  imageBox: { position: 'relative' },
  img: { width: '100%', borderRadius: '32px', boxShadow: 'var(--sh-xl)' },
  floatingBadge: { position: 'absolute', bottom: -30, left: -30, background: '#fff', padding: '1.5rem', borderRadius: '24px', boxShadow: 'var(--sh-lg)', border: '1px solid var(--border)', textAlign: 'center' },
  // Founder
  founderCard: { display: 'flex', gap: '2rem', alignItems: 'flex-start', background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: '24px', padding: '2.5rem', flexWrap: 'wrap' },
  founderAvatar: { width: 80, height: 80, borderRadius: 24, background: 'linear-gradient(135deg, var(--bur), var(--bur-d))', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, fontFamily: "'Playfair Display', serif", flexShrink: 0 },
  founderMeta: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' },
  // Vision
  visionGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: 1000, margin: '0 auto' },
  visionCard: { textAlign: 'center', padding: '3rem 2rem' },
  visionIcon: { color: 'var(--bur)', marginBottom: '1rem', display: 'flex', justifyContent: 'center' },
  visionNum: { fontSize: '2.5rem', fontWeight: 800, color: 'var(--bur)', fontFamily: "'Playfair Display', serif", marginBottom: 4 },
  // Press
  pressLogos: { display: 'flex', gap: '3rem', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap' },
  pressLogo: { fontSize: '1.3rem', fontWeight: 800, fontStyle: 'italic', color: 'var(--border-2)', opacity: 0.5, filter: 'grayscale(100%)' },
}
