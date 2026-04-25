import Head from 'next/head'
import { Shield, Clock, Users, Award, MapPin, Scale } from 'lucide-react'

export default function About() {
  return (
    <div className="page-wrap" style={{background: 'var(--cream)'}}>
      <Head>
        <title>About Us — Justice Junction 24/7</title>
        <meta name="description" content="Learn about the mission, values, and team behind India's premier lawyer discovery platform." />
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
        <div className="container" style={s.grid2}>
          <div>
            <h2 style={s.h2}>The Mission</h2>
            <p style={s.p}>Founded in 2024, Justice Junction was born out of a simple observation: finding a reliable lawyer in India is hard, and pricing is even harder to understand. Our mission is to make legal help as easy as booking a cab — accessible 24/7, with upfront fixed pricing and verified credentials.</p>
            <div style={s.stats}>
              <div><div style={s.statNum}>2.4k+</div><div style={s.statLabel}>Verified Lawyers</div></div>
              <div><div style={s.statNum}>150+</div><div style={s.statLabel}>Cities Covered</div></div>
              <div><div style={s.statNum}>50k+</div><div style={s.statLabel}>Happy Clients</div></div>
            </div>
          </div>
          <div style={s.imageBox}>
            <img src="/justice-bg.png" alt="Justice Junction Team" style={s.img} />
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
          <div style={s.grid3}>
            {[
              {i: <Shield/>, t: 'Verification', d: 'Every lawyer undergoes a multi-step Bar Council verification process.'},
              {i: <Scale/>, t: 'Transparency', d: 'Fixed consultation fees shown upfront. No hidden costs or surprises.'},
              {i: <Clock/>, t: '24/7 Access', d: 'Legal emergencies don’t wait. Neither do our advocates.'},
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
    </div>
  )
}

const s = {
  hero: { padding: '8rem 0 6rem', background: 'linear-gradient(rgba(123,29,46,0.05), rgba(201,148,58,0.05))' },
  h1: { fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, lineHeight: 1.1 },
  heroSub: { fontSize: '1.2rem', color: 'var(--txt-3)', maxWidth: 600, margin: '1.5rem auto 0' },
  grid2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' },
  grid3: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
  h2: { fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem' },
  p: { fontSize: '1.1rem', color: 'var(--txt-2)', lineHeight: 1.8, marginBottom: '2rem' },
  stats: { display: 'flex', gap: '3rem', marginTop: '3rem' },
  statNum: { fontSize: '2.5rem', fontWeight: 800, color: 'var(--bur)' },
  statLabel: { fontSize: '.8rem', color: 'var(--txt-3)', textTransform: 'uppercase', fontWeight: 700 },
  imageBox: { position: 'relative' },
  img: { width: '100%', borderRadius: '32px', boxShadow: 'var(--sh-xl)' },
  floatingBadge: { position: 'absolute', bottom: -30, left: -30, background: '#fff', padding: '1.5rem', borderRadius: '24px', boxShadow: 'var(--sh-lg)', border: '1px solid var(--border)', textAlign: 'center' }
}
