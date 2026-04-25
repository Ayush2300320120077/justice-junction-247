import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CheckCircle, Video, Lock, Zap, Bell, Search, BarChart2, Calendar, Activity, DollarSign, Smartphone, Scale, TrendingUp, CreditCard, LayoutDashboard, Star, Gift, ClipboardList, ShieldCheck, Award, Users, Clock } from 'lucide-react'
import Head from 'next/head'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law']
const STATS = [['2,400+','Verified Lawyers'],['50,000+','Cases Handled'],['98%','Satisfaction Rate'],['₹0','Platform Fee for Clients']]
const TESTIMONIALS = [
  { init:'RG', name:'Rohit Gupta', role:'Client, Delhi', text:"Found a criminal lawyer in 8 minutes. Paid exactly ₹3,500 — what was shown. Real-time case updates gave me peace of mind." },
  { init:'AP', name:'Anjali Patel', role:'Client, Mumbai', text:"Going through divorce is hard. Justice Junction made legal help easy. I knew the price before speaking to the lawyer." },
  { init:'SK', name:'Adv. Suresh Kumar', role:'Advocate, Bangalore', text:"This platform brought me 12 quality clients in my first month. Transparent pricing builds client trust before the first call." },
  { init:'VP', name:'Vikash Patel', role:'Business Owner, Ahmedabad', text:"Needed a corporate lawyer fast. Booked within minutes, had a video call same day. Case update feed is a game-changer." },
]

export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
  const [videoError, setVideoError] = useState(false)
  const router = useRouter()

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (query) p.set('query', query)
    router.push('/search?' + p.toString())
  }

  return (
    <div style={{ paddingTop: 95 }}>
      <Head>
        <title>Justice Junction 24/7 — Find Your Lawyer Anytime, Anywhere</title>
        <meta name="description" content="Connect with 2,400+ verified lawyers across India. Instant booking. 24/7 availability. Transparent pricing and secure video consultations." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Justice Junction 24/7",
            "url": "https://justice-junction-app.vercel.app/",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://justice-junction-app.vercel.app/search?query={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }} />
      </Head>

      {/* HERO SECTION UPGRADE */}
      <section style={s.hero}>
        <div style={s.heroBgWrapper}>
          {!videoError ? (
            <video
              style={s.heroVideo}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster="/justice-bg.png"
              onError={() => setVideoError(true)}
            >
              <source src="/justice-bg-video.mp4" type="video/mp4" />
            </video>
          ) : (
            <img src="/justice-bg.png" alt="Justice Junction HD Background" style={s.heroImage} />
          )}
          <div style={s.heroOverlay}></div>
        </div>
        
        <div className="container" style={s.heroContainer}>
          <div style={s.heroContent}>
            <div style={s.trustBadge}>
              <ShieldCheck size={16} color="var(--bur)"/>
              <span style={{fontSize:'.85rem',fontWeight:700,color:'var(--bur)'}}>Bar Council Verified Professionals</span>
            </div>
            
            <h1 style={s.h1}>
              Your Legal Solution, <br/>
              <span style={{color:'var(--bur)'}}>Instantly. Transparently.</span>
            </h1>
            
            <p style={s.heroSub}>
              Find top-rated advocates by specialization, city, or pincode. 
              Book secure video consultations with 100% upfront pricing.
            </p>

            <div style={s.searchBox}>
              <div style={s.searchInner}>
                <div style={s.inputGroup}>
                  <label style={s.label}>Legal Issue</label>
                  <select style={s.select} value={spec} onChange={e=>setSpec(e.target.value)}>
                    <option value="">What do you need help with?</option>
                    {SPECS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div style={s.dividerV} />
                <div style={s.inputGroup}>
                  <label style={s.label}>City or Pincode</label>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Search size={18} color="var(--txt-3)"/>
                    <input 
                      style={s.input} 
                      placeholder="e.g. 110001 or Delhi" 
                      value={query} 
                      onChange={e=>setQuery(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&goSearch()}
                    />
                  </div>
                </div>
                <button className="btn btn-primary btn-lg" onClick={goSearch} style={s.searchBtn}>
                  Find My Lawyer
                </button>
              </div>
            </div>

            <div style={s.heroBadges}>
              {[{i:<Award size={18}/>, t:'Top Rated'}, {i:<Clock size={18}/>, t:'24/7 Support'}, {i:<DollarSign size={18}/>, t:'Fixed Fees'}].map((item, idx) => (
                <div key={idx} style={s.heroBadgeItem}>
                  {item.i} <span>{item.t}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={s.heroVisual} className="hide-mobile">
            <div style={s.floatingCard}>
              <div style={{display:'flex', gap:12, marginBottom:'1rem'}}>
                <div style={s.fcAv}>AK</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800, fontSize:'1rem'}}>Adv. Arjun Kapoor</div>
                  <div style={{fontSize:'.75rem', color:'var(--txt-3)'}}>Corporate Law · 20 yrs exp</div>
                  <div style={{display:'flex', gap:2, color:'var(--gold)', marginTop:4}}><Star size={12} fill="var(--gold)"/><Star size={12} fill="var(--gold)"/><Star size={12} fill="var(--gold)"/><Star size={12} fill="var(--gold)"/><Star size={12} fill="var(--gold)"/></div>
                </div>
              </div>
              <div style={s.fcPrice}>
                <div>
                  <div style={{fontSize:'.7rem', fontWeight:800, color:'var(--txt-3)', textTransform:'uppercase'}}>Consultation Fee</div>
                  <div style={{fontSize:'1.8rem', fontWeight:700, color:'var(--bur)'}}>₹4,500</div>
                </div>
                <button className="btn btn-primary btn-sm">Book</button>
              </div>
              <div style={s.fcStatus}>
                <span className="pulse-dot" /> Available Now
              </div>
            </div>
            
            <div style={{...s.floatingCard, bottom: -40, right: 20, transform:'scale(0.9)', zIndex: 1}}>
              <div style={{display:'flex', gap:10, alignItems:'center'}}>
                <Users size={20} color="var(--bur)"/>
                <div>
                  <div style={{fontWeight:800, fontSize:'.9rem'}}>2,400+ Lawyers</div>
                  <div style={{fontSize:'.7rem', color:'var(--txt-3)'}}>Active on platform</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST LOGOS / BADGES */}
      <div style={s.trustBar}>
        <div className="container" style={s.trustInner}>
          <span style={s.trustLabel}>AS SEEN ON</span>
          <div style={s.trustLogos}>
            {['The Times of India', 'NDTV', 'LiveLaw', 'Bar & Bench', 'Business Standard'].map(l=>(
              <span key={l} style={s.trustLogoText}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* STATS SECTION */}
      <section style={s.statsSection}>
        <div className="container" style={s.statsGrid}>
          {STATS.map(([n,l])=>(
            <div key={l} style={s.statItem}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{padding:'7rem 5vw',background:'#fff'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>The Process</div>
          <h2 className="sec-title" style={{textAlign:'center'}}>Get legal help in <em>4 easy steps.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'2rem',maxWidth:1000,margin:'0 auto'}}>
          {[{i:<Search size={28}/>,title:'Search',desc:'Enter your city and issue. All verified lawyers appear instantly with pricing.'},
            {i:<BarChart2 size={28}/>,title:'Compare',desc:'View fees, ratings, experience — all transparent before you decide.'},
            {i:<Calendar size={28}/>,title:'Book',desc:'Pick time. Meet via encrypted video call from anywhere in India.'},
            {i:<Activity size={28}/>,title:'Track',desc:'Your lawyer posts real-time case updates. No more chasing calls.'}].map((item,i)=>(
            <div key={item.title} className="card card-hover" style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>
              <div style={{position:'absolute',top:20,left:20,width:28,height:28,background:'var(--bur)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.8rem',fontWeight:800}}>0{i+1}</div>
              <div style={{color:'var(--bur)',marginBottom:16,display:'flex',justifyContent:'center'}}>{item.i}</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.3rem',marginBottom:12}}>{item.title}</h3>
              <p style={{fontSize:'.9rem',color:'var(--txt-3)',lineHeight:1.7}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS CAROUSEL (Simplified as grid for now as requested) */}
      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Testimonials</div>
          <h2 className="sec-title" style={{textAlign:'center'}}>Trusted by <em>thousands across India.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'2rem',maxWidth:1100,margin:'0 auto'}}>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} className="card" style={{padding:'2.5rem', background:'#fff'}}>
              <div style={{color:'var(--gold)',marginBottom:16,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'2rem', color:'var(--txt)'}}>"{t.text}"</p>
              <div style={{display:'flex',gap:12,alignItems:'center'}}>
                <div style={{width:44,height:44,borderRadius:'50%',background:'var(--bur-l)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.9rem',color:'#fff'}}>{t.init}</div>
                <div><div style={{fontWeight:800,fontSize:'.95rem'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={s.finalCta}>
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={s.ctaTitle}>Ready to resolve your <em style={{color:'var(--gold-l)'}}>legal matters?</em></h2>
          <p style={s.ctaSub}>Join 50,000+ Indians who found their trusted legal advocate on Justice Junction.</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}}>
            <Link href="/search" className="btn btn-gold btn-xl">Find Your Lawyer Now</Link>
            <Link href="/register?role=lawyer" className="btn btn-outline-white btn-xl">Join as Advocate</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '6rem 0 8rem', position: 'relative', overflow: 'hidden', minHeight: '90vh', display: 'flex', alignItems: 'center' },
  heroBgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0 },
  heroVideo: { width: '100%', height: '100%', objectFit: 'cover' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(135deg, rgba(253,248,242,0.94) 0%, rgba(253,248,242,0.85) 100%)', zIndex: 1 },
  heroContainer: { position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '4rem', alignItems: 'center' },
  heroContent: { maxWidth: 650 },
  trustBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(123,29,46,.08)', border: '1px solid rgba(123,29,46,.15)', borderRadius: 50, padding: '.4rem 1.2rem', marginBottom: '2rem' },
  h1: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(3rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: 'var(--txt)' },
  heroSub: { fontSize: '1.2rem', color: 'var(--txt-2)', marginBottom: '3rem', lineHeight: 1.6, fontWeight: 500 },
  searchBox: { background: '#fff', padding: '8px', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', border: '1px solid var(--border)', maxWidth: 750 },
  searchInner: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px' },
  inputGroup: { flex: 1, padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '.7rem', fontWeight: 800, color: 'var(--txt-3)', textTransform: 'uppercase', letterSpacing: '1px' },
  select: { border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: 'var(--txt)', outline: 'none', width: '100%', cursor: 'pointer' },
  input: { border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: 'var(--txt)', outline: 'none', width: '100%' },
  dividerV: { width: 1, height: 40, background: 'var(--border)' },
  searchBtn: { padding: '1rem 2rem', borderRadius: '16px' },
  heroBadges: { display: 'flex', gap: '1.5rem', marginTop: '2.5rem', color: 'var(--txt-3)' },
  heroBadgeItem: { display: 'flex', alignItems: 'center', gap: 8, fontSize: '.9rem', fontWeight: 700 },
  heroVisual: { position: 'relative', height: 400 },
  floatingCard: { position: 'absolute', top: 40, left: 40, background: '#fff', padding: '1.5rem', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', border: '1px solid var(--border)', width: 320, zIndex: 2 },
  fcAv: { width: 48, height: 48, borderRadius: 14, background: 'var(--bur)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 },
  fcPrice: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '1rem', marginTop: '1rem' },
  fcStatus: { marginTop: '1rem', background: 'var(--green-l)', color: 'var(--green)', fontSize: '.8rem', fontWeight: 700, padding: '.5rem 1rem', borderRadius: 12, display: 'inline-flex', alignItems: 'center', gap: 6 },
  trustBar: { background: '#fff', padding: '3rem 0', borderBottom: '1px solid var(--border)' },
  trustInner: { display: 'flex', alignItems: 'center', gap: '3rem', flexWrap: 'wrap' },
  trustLabel: { fontSize: '.75rem', fontWeight: 800, color: 'var(--txt-3)', letterSpacing: '2px', whiteSpace: 'nowrap' },
  trustLogos: { display: 'flex', gap: '3rem', alignItems: 'center', flex: 1, justifyContent: 'space-between', flexWrap: 'wrap' },
  trustLogoText: { fontSize: '1.2rem', fontWeight: 800, color: 'var(--border-d)', fontStyle: 'italic', opacity: 0.6 },
  statsSection: { background: 'var(--bur)', padding: '5rem 0' },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' },
  statItem: { textAlign: 'center' },
  statNum: { fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: 8, fontFamily: 'Sora, sans-serif' },
  statLabel: { fontSize: '.9rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' },
  finalCta: { padding: '8rem 0', background: 'linear-gradient(rgba(42,22,32,0.95), rgba(123,29,46,0.98)), url("/justice-bg.png")', backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff' },
  ctaTitle: { fontFamily: "'Playfair Display',serif", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem' },
  ctaSub: { fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' },
}
