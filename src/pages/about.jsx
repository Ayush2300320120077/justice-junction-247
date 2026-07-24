import Head from 'next/head'
import Link from 'next/link'
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
      <section style={{
        padding: '8rem 0 6rem',
        backgroundImage: `linear-gradient(135deg, rgba(91, 21, 33, 0.90) 0%, rgba(123, 29, 46, 0.80) 100%), url('https://images.unsplash.com/photo-1453945619913-79ec89a82c51?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top'
      }}>
        <div className="container" style={{textAlign: 'center'}}>
          <div className="sec-label" style={{justifyContent: 'center', color: '#F5D5C0'}}>Our Story</div>
          <h1 style={{...s.h1, color: '#fff'}}>Democratizing Legal Access <br/><em style={{color: '#F5D5C0'}}>for every Indian.</em></h1>
          <p style={{...s.heroSub, color: '#F5D5C0'}}>We bridge the gap between people and justice through transparency, technology, and trust.</p>
        </div>
      </section>

      {/* Mission */}
      <section style={{padding: '6rem 0', background: '#fff'}}>
        <div className="container" style={s.grid2} className="mobile-stack container">
          <div>
            <h2 style={s.h2}>The Mission</h2>
            <p style={s.p}>Founded in 2024, Justice Junction was born out of a simple observation: finding a reliable lawyer in India is hard, and pricing is even harder to understand. Our mission is to make legal help as easy as booking a cab — accessible 24/7, with upfront fixed pricing and verified credentials.</p>
            <div style={s.stats} className="mobile-stack">
              <div><div style={s.statNum}>500+</div><div style={s.statLabel}>Advocates</div></div>
              <div><div style={s.statNum}>100+</div><div style={s.statLabel}>Cities Covered</div></div>
              <div><div style={s.statNum}>10,000+</div><div style={s.statLabel}>Users</div></div>
            </div>
          </div>
          <div style={s.imageBox}>
            <div style={{ width: '100%', aspectRatio: '4/3', borderRadius: '32px', background: 'linear-gradient(135deg, #7B1D2E 0%, #5C1521 50%, #3D0E16 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', boxShadow: 'var(--sh-xl)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.04) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.04) 2px, transparent 0)`, backgroundSize: '100px 100px' }} />
              <Scale size={64} color="rgba(245,196,179,0.3)" style={{ marginBottom: '1.5rem', position: 'relative', zIndex: 1 }} />
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F5C4B3', fontFamily: "'Cormorant Garamond', serif", position: 'relative', zIndex: 1, letterSpacing: '-0.02em' }}>JJ 24/7</div>
              <div style={{ fontSize: '.85rem', color: 'rgba(245,196,179,0.6)', fontWeight: 600, marginTop: '.5rem', position: 'relative', zIndex: 1, letterSpacing: '2px', textTransform: 'uppercase' }}>Justice for Every Indian</div>
            </div>
            <div style={s.floatingBadge}>
              <Scale size={28} color="var(--bur)"/>
              <div style={{fontWeight: 700, fontSize: '.85rem', color: 'var(--txt-2)', lineHeight: 1.4, fontStyle: 'italic'}}>"We built the platform we wished existed when we needed legal help."<br/><span style={{fontStyle: 'normal', fontSize: '.75rem', color: 'var(--txt-3)'}}>— Founders, Justice Junction</span></div>
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

      {/* Team / Founders Section */}
      <section style={{padding: '6rem 0', background: '#fff'}}>
        <div className="container">
          <div style={{textAlign: 'center', marginBottom: '4rem'}}>
            <h2 style={s.h2}>The people behind <em style={{color: 'var(--bur)'}}>Justice Junction.</em></h2>
          </div>
          <div style={{maxWidth: 500, margin: '0 auto'}}>
            <div className="card card-hover" style={{textAlign: 'center', padding: '3rem 2.5rem'}}>
              <div style={{width: 80, height: 80, borderRadius: '50%', background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 800, fontFamily: "'Playfair Display', serif", margin: '0 auto 1.5rem'}}>AK</div>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: 4}}>Ayush Kumar</h3>
              <div style={{fontSize: '.8rem', fontWeight: 700, color: 'var(--bur)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem'}}>Founder & CEO</div>
              <p style={{fontSize: '.95rem', color: 'var(--txt-2)', lineHeight: 1.7}}>Building India's most trusted legal discovery platform to make quality legal help accessible and affordable for every citizen.</p>
            </div>
          </div>
          <div style={{textAlign: 'center', marginTop: '3rem', padding: '2rem', background: 'var(--cream)', borderRadius: '16px', border: '1px solid var(--border)', maxWidth: 600, margin: '3rem auto 0'}}>
            <div style={{fontSize: '1.1rem', fontWeight: 800, color: 'var(--txt)', marginBottom: 8}}>We're Hiring 🚀</div>
            <p style={{fontSize: '.9rem', color: 'var(--txt-3)', margin: 0}}>We're a small team with a big mission. Interested in legal-tech? Reach out at <a href="mailto:supportjusticejunction@gmail.com" style={{color: 'var(--bur)', fontWeight: 700}}>supportjusticejunction@gmail.com</a></p>
          </div>
        </div>
      </section>

      {/* Founder Quote Section */}
      <section style={{padding: '5rem 0', background: 'var(--cream-2)'}}>
        <div className="container" style={{maxWidth: 1000}}>
          <div style={{display: 'flex', gap: '2rem', alignItems: 'flex-start'}} className="mobile-stack">
            <div style={{fontSize: '6rem', lineHeight: 1, color: '#7B1D2E', fontWeight: 900}}>❝</div>
            <div style={{borderLeft: '4px solid #7B1D2E', paddingLeft: '2rem'}}>
              <p style={{fontStyle: 'italic', fontSize: '1.25rem', color: '#1A0A0D', lineHeight: 1.8, marginBottom: '1.5rem'}}>
                "I started Justice Junction after watching my own family struggle to find a reliable lawyer during a property dispute in Ghaziabad. We spent weeks asking friends for referrals, received wildly inconsistent quotes, and had absolutely no way to verify anyone's credentials. Legal help in India was opaque, expensive, and inaccessible to ordinary people.
                <br/><br/>
                I built Justice Junction to change exactly that — to make finding a verified, fairly-priced lawyer as easy as booking a cab. Every feature on this platform exists to give power back to the citizen."
              </p>
              <div style={{color: '#7B1D2E', fontWeight: 600}}>— Ayush Kumar, Founder & CEO, Justice Junction 24/7</div>
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

      {/* Stats Banner */}
      <section style={{padding:'4rem 0',background:'var(--bur)'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'2rem',textAlign:'center'}}>
            {[['Founded','2024'],['500+','Advocates'],['100+','Cities Covered'],['10,000+','Users Served']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontSize:'2.5rem',fontWeight:800,color:'#fff',fontFamily:"'Sora',sans-serif",lineHeight:1}}>{n}</div>
                <div style={{fontSize:'.78rem',fontWeight:700,color:'#F5E6D3',textTransform:'uppercase',letterSpacing:'1.5px',marginTop:8}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Timeline */}
      <section style={{padding:'5rem 0',background:'#FDF6EE'}}>
        <div className="container" style={{maxWidth:900}}>
          <div style={{textAlign:'center',marginBottom:'4rem'}}>
            <h2 style={{...s.h2, color: '#1A0A0D', fontWeight: 900}}>Our Journey So Far</h2>
          </div>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute',left:'50%',top:0,bottom:0,width:2,background:'#7B1D2E',transform:'translateX(-50%)'}} className="mobile-hide"/>
            <div style={{position:'absolute',left:11,top:0,bottom:0,width:2,background:'#7B1D2E'}} className="show-mobile"/>
            
            {[
              {date:'January 2024',title:'The Idea',desc:'Identified India\'s legal discovery problem. Interviewed 200+ citizens and 50+ advocates across UP, Delhi, and Mumbai.'},
              {date:'June 2024',title:'Platform Launched',desc:'Released first version with Bar Council verification, Razorpay payments, encrypted video consultations, and case tracking dashboard.'},
              {date:'September 2024',title:'First 100 Advocates',desc:'Reached 100 verified advocates across 10 major Indian cities in the first 3 months. Client satisfaction rate: 98%.'},
              {date:'2025',title:'Scaling Across India',desc:'Expanding to Tier-2 and Tier-3 cities. Building full Hindi and regional language support. Target: 5,000 advocates by 2026.'},
            ].map((m,i)=>(
              <div key={m.date} style={{position:'relative',marginBottom:'3rem',width:'50%',padding:i%2===0?'0 3rem 0 0':'0 0 0 3rem',marginLeft:i%2===0?0:'50%',textAlign:i%2===0?'right':'left'}} className="mobile-w-full mobile-text-left mobile-px-4">
                <div style={{position:'absolute',left:i%2===0?'auto':'-8px',right:i%2===0?'-8px':'auto',top:6,width:16,height:16,borderRadius:'50%',background:'#7B1D2E'}} className="mobile-hide"/>
                <div style={{position:'absolute',left:-5,top:6,width:16,height:16,borderRadius:'50%',background:'#7B1D2E'}} className="show-mobile"/>
                
                <div style={{fontSize:'.875rem',fontWeight:700,color:'#7B1D2E',textTransform:'uppercase',letterSpacing:'1px',marginBottom:6}} className="mobile-px-4">{m.date}</div>
                <h3 style={{fontSize:'1.25rem',fontWeight:800,marginBottom:8,color:'#1A0A0D'}} className="mobile-px-4">"{m.title}"</h3>
                <p style={{fontSize:'1rem',color:'#5A3A42',lineHeight:1.7}} className="mobile-px-4">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{padding: '4rem 0', background: '#7B1D2E', textAlign: 'center'}}>
        <div className="container">
          <h2 style={{fontSize: '2rem', fontWeight: 900, color: '#fff', marginBottom: '1rem'}}>Justice for every Indian — not just the privileged.</h2>
          <p style={{fontSize: '1.1rem', color: '#F5C4B3', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem'}}>Join us in making legal help accessible, transparent, and fair for every citizen in India.</p>
          <div style={{display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/search" className="btn btn-white btn-lg" style={{color: '#7B1D2E'}}>Find a Lawyer</Link>
            <Link href="/join-as-lawyer" className="btn btn-outline-white btn-lg">Join as Advocate</Link>
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
