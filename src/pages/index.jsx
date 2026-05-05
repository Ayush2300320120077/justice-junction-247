import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CheckCircle, Video, Lock, Zap, Bell, Search, BarChart2, Calendar, Activity, DollarSign, Smartphone, Scale, TrendingUp, CreditCard, LayoutDashboard, Star, Gift, ClipboardList, ShieldCheck, Award, Users, Clock, Globe, MapPin } from 'lucide-react'
import Head from 'next/head'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law']

const PRACTICE_AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'Bail, FIR, trial representation' },
  { emoji: '👨‍👩‍👧', name: 'Family Law', desc: 'Divorce, custody, maintenance' },
  { emoji: '🏠', name: 'Property Law', desc: 'Disputes, registry, possession' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, compliance, startups' },
  { emoji: '🛡️', name: 'Consumer Rights', desc: 'Fraud, refunds, RERA complaints' },
  { emoji: '👷', name: 'Labour Law', desc: 'Wrongful termination, PF disputes' },
  { emoji: '⚡', name: 'Cyber Law', desc: 'Online fraud, data privacy, IT Act' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax, assessments' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery, injunctions, damages' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested, mutual consent, alimony' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency legal help, same-day bail' },
]

const TESTIMONIALS = [
  { init:'RG', name:'Rohit Gupta', role:'Client, Delhi', text:"Found a criminal lawyer in 8 minutes. Paid exactly ₹3,500 — what was shown. Real-time case updates gave me peace of mind." },
  { init:'AP', name:'Anjali Patel', role:'Client, Mumbai', text:"Going through divorce is hard. Justice Junction made legal help easy. I knew the price before speaking to the lawyer." },
  { init:'SK', name:'Adv. Suresh Kumar', role:'Advocate, Bangalore', text:"This platform brought me 12 quality clients in my first month. Transparent pricing builds client trust before the first call." },
  { init:'VP', name:'Vikash Patel', role:'Business Owner, Ahmedabad', text:"Needed a corporate lawyer fast. Booked within minutes, had a video call same day. Case update feed is a game-changer." },
  { init:'MS', name:'Meena Sharma', role:'Client, Jaipur', text:"My property dispute was stuck for years. Found the right lawyer in 10 minutes, had my first consultation same evening. Incredible service." },
  { init:'PN', name:'Adv. Priya Nair', role:'Advocate, Chennai', text:"Joined Justice Junction as an advocate last year. My client base doubled in 3 months. The platform handles discovery, booking, and payments seamlessly." },
]

const WHY_FEATURES = [
  { emoji: '🔒', title: 'Bar Council Verified', desc: 'Every advocate is verified with their Bar Council registration number before listing.' },
  { emoji: '💰', title: 'Zero Platform Fee', desc: 'Clients pay nothing extra. The consultation price shown is the final price paid.' },
  { emoji: '📹', title: 'Encrypted Video Calls', desc: 'All consultations happen over end-to-end encrypted video — your privacy guaranteed.' },
  { emoji: '📊', title: 'Real-Time Case Updates', desc: 'Your lawyer updates your case file in real time. No more chasing phone calls.' },
  { emoji: '🌐', title: 'Pan-India Network', desc: 'Advocates across 500+ cities. Find local expertise wherever you are in India.' },
  { emoji: '⏱️', title: '24/7 Availability', desc: 'Legal emergencies don\'t follow office hours. Get help at midnight if needed.' },
]

export default function Home() {
  const [spec, setSpec] = useState('')
  const [query, setQuery] = useState('')
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
        <title>Justice Junction 24/7 — Find Verified Lawyers in India Instantly</title>
        <meta name="description" content="Find and book verified lawyers across India. Upfront pricing, Bar Council verified, available 24/7. Criminal, Family, Property, Corporate law and more." />
        <meta name="keywords" content="lawyer in India, find advocate online, legal help 24/7, book lawyer India, verified advocates, online lawyer consultation, legal services India" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/" />
        <meta property="og:title" content="Justice Junction 24/7 — Find Your Lawyer Anytime, Anywhere" />
        <meta property="og:description" content="Connect with verified lawyers across India. Instant booking. 24/7 availability." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Justice Junction 24/7" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Justice Junction 24/7 — Find Your Lawyer Anytime, Anywhere" />
        <meta name="twitter:description" content="Connect with verified lawyers across India. Instant booking. 24/7 availability." />
        <meta name="twitter:image" content="https://justice-junction-app.vercel.app/og-image.png" />

        {/* JSON-LD: LocalBusiness + LegalService */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "LegalService",
              "name": "Justice Junction 24/7",
              "description": "India's leading lawyer discovery platform. Connect with verified lawyers 24/7.",
              "url": "https://justice-junction-app.vercel.app/",
              "image": "https://justice-junction-app.vercel.app/og-image.png",
              "telephone": "+919188371233",
              "address": { "@type": "PostalAddress", "addressCountry": "IN" },
              "areaServed": "India",
              "priceRange": "₹500–₹10,000"
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Justice Junction 24/7",
              "url": "https://justice-junction-app.vercel.app/",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://justice-junction-app.vercel.app/search?query={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            }
          ])
        }} />
      </Head>

      {/* ══════ HERO SECTION ══════ */}
      <section style={s.hero} className="hero-responsive">
        <div style={s.heroOverlay} />
        <div className="container hero-container-responsive" style={s.heroContainer}>
          <div style={s.heroContent} className="reveal-l visible mobile-text-center">
            <div style={s.trustBadge} className="mobile-mb-4">
              <ShieldCheck size={16} color="#8B1A2A"/>
              <span style={{fontSize:'.85rem',fontWeight:700,color:'#8B1A2A'}}>Bar Council Verified Professionals</span>
            </div>
            
            <h1 style={s.h1} className="h1-responsive text-balance">
              Find Your <span className="gradient-text">Lawyer</span> —<br className="mobile-hide"/>
              <span style={{color:'#8B1A2A'}}>Anytime, Anywhere.</span>
            </h1>
            
            <p style={s.heroSub} className="hero-sub-responsive text-balance">
              India's first 100% price-transparent legal platform. Bar Council verified advocates. Instant booking. 24/7 support.
            </p>

            {/* Trust badges row */}
            <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap',marginBottom:'2rem'}} className="mobile-stack mobile-gap-4">
              {['✓ Bar Council Verified','✓ 100% Price Transparency','✓ Encrypted Video Calls','✓ No Hidden Fees'].map(b => (
                <span key={b} style={{fontSize:'.85rem',fontWeight:600,color:'#4A2030',display:'flex',alignItems:'center',gap:4}}>{b}</span>
              ))}
            </div>

            <div style={s.searchBox} className="hover-glow search-box-responsive">
              <div style={s.searchInner} className="mobile-stack">
                <div style={s.inputGroup} className="mobile-text-left">
                  <label style={s.label} htmlFor="issue-select">Legal Issue</label>
                  <select id="issue-select" style={s.select} value={spec} onChange={e=>setSpec(e.target.value)}>
                    <option value="">What do you need help with?</option>
                    {SPECS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div style={s.dividerV} className="mobile-hide" />
                <div style={s.inputGroup} className="mobile-text-left">
                  <label style={s.label} htmlFor="city-input">City or Pincode</label>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Search size={18} color="#6B4050"/>
                    <input 
                      id="city-input"
                      style={s.input} 
                      placeholder="e.g. 110001 or Delhi" 
                      value={query} 
                      onChange={e=>setQuery(e.target.value)}
                      onKeyDown={e=>e.key==='Enter'&&goSearch()}
                    />
                  </div>
                </div>
                <button className="btn btn-primary btn-lg hover-lift search-btn-home" onClick={goSearch} style={s.searchBtn}>
                  Find My Lawyer
                </button>
              </div>
            </div>

            {/* Stat strip below form */}
            <div style={{display:'flex',gap:'2rem',marginTop:'2rem',flexWrap:'wrap'}} className="mobile-stack mobile-gap-4">
              {[['50+','Verified Lawyers'],['₹0','Platform Fee'],['24/7','Available'],['4.8★','Average Rating']].map(([n,l])=>(
                <div key={l} style={{display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontSize:'1.2rem',fontWeight:800,color:'#8B1A2A',fontFamily:'Sora,sans-serif'}}>{n}</span>
                  <span style={{fontSize:'.8rem',fontWeight:600,color:'#4A2030'}}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PRACTICE AREAS ══════ */}
      <section style={{padding:'5rem 0',background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Practice Areas</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>We Cover <em>Every Legal Need</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.2rem',maxWidth:1100,margin:'0 auto'}}>
            {PRACTICE_AREAS.map(area => (
              <Link href={`/search?specialization=${encodeURIComponent(area.name)}`} key={area.name} style={{textDecoration:'none'}}>
                <div className="card card-hover" style={{display:'flex',alignItems:'center',gap:16,padding:'1.4rem 1.6rem',cursor:'pointer'}}>
                  <span style={{fontSize:'2rem',flexShrink:0}}>{area.emoji}</span>
                  <div>
                    <div style={{fontWeight:700,fontSize:'.95rem',color:'#1A0A0D',marginBottom:2}}>{area.name}</div>
                    <div style={{fontSize:'.82rem',color:'#4A2030',lineHeight:1.5}}>{area.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section style={{padding:'5rem 0',background:'#8B1A2A'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center',color:'#F5E6D3'}}>The Process</div>
            <h2 className="sec-title" style={{textAlign:'center',color:'#F5E6D3'}}>Get legal help in <em style={{color:'#F5E6D3'}}>4 easy steps.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
            {[
              {i:<Search size={28}/>,title:'Search',desc:'Enter your city and legal issue. Our smart filter instantly shows verified advocates matching your exact need — no spam, no cold calls.'},
              {i:<BarChart2 size={28}/>,title:'Compare',desc:'See full profiles: experience, fees, ratings, past case types, spoken languages, availability. 100% transparent before you decide.'},
              {i:<Calendar size={28}/>,title:'Book',desc:'Pick your preferred time slot. Meet via secure, encrypted video call or in-person. Pay only what was shown — no surprise charges.'},
              {i:<Activity size={28}/>,title:'Track',desc:'Get real-time case updates from your lawyer via your dashboard. Know exactly where your case stands — always.'}
            ].map((item,i)=>(
              <div key={item.title} style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative',background:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:16}}>
                <div style={{position:'absolute',top:10,left:20,fontSize:'4rem',fontWeight:800,color:'rgba(255,255,255,0.08)',lineHeight:1}}>0{i+1}</div>
                <div style={{color:'#F5E6D3',marginBottom:16,display:'flex',justifyContent:'center',position:'relative'}}>{item.i}</div>
                <h3 style={{fontSize:'1.3rem',marginBottom:12,color:'#fff',position:'relative'}}>{item.title}</h3>
                <p style={{fontSize:'.9rem',color:'rgba(245,230,211,0.8)',lineHeight:1.7,position:'relative'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY CHOOSE US ══════ */}
      <section style={{padding:'5rem 0',background:'#F5E6D3'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Why Us</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Why 10,000+ Indians Choose <em>Justice Junction</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1100,margin:'0 auto'}}>
            {WHY_FEATURES.map(f => (
              <div key={f.title} className="card card-hover" style={{textAlign:'center',padding:'2.5rem 2rem'}}>
                <span style={{fontSize:'2.5rem',display:'block',marginBottom:12}}>{f.emoji}</span>
                <h3 style={{fontSize:'1.1rem',fontWeight:700,color:'#1A0A0D',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'.88rem',color:'#4A2030',lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{padding:'5rem 0',background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Testimonials</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Trusted by <em>thousands across India.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1100,margin:'0 auto'}}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} className="card card-hover" style={{padding:'2rem',borderLeft:'4px solid #8B1A2A'}}>
                <div style={{color:'#8B1A2A',marginBottom:12,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>
                <p style={{fontSize:'.95rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'1.5rem',color:'#1A0A0D'}}>"{t.text}"</p>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'#8B1A2A',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#fff'}}>{t.init}</div>
                  <div><div style={{fontWeight:800,fontSize:'.95rem',color:'#1A0A0D'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'#6B4050'}}>{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ STATS BANNER ══════ */}
      <section style={{padding:'4rem 0',background:'#8B1A2A'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'2rem',textAlign:'center'}} className="grid-stats">
            {[['10,000+','Clients Served'],['500+','Cities Covered'],['50+','Verified Advocates'],['4.8★','Average Rating']].map(([n,l])=>(
              <div key={l}>
                <div style={{fontSize:'2.8rem',fontWeight:800,color:'#fff',fontFamily:'Sora,sans-serif',lineHeight:1}} className="stat-num-mobile">{n}</div>
                <div style={{fontSize:'.8rem',fontWeight:700,color:'#F5E6D3',textTransform:'uppercase',letterSpacing:'1.5px',marginTop:8}} className="stat-label-mobile">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FOR LAWYERS ══════ */}
      <section style={{padding:'5rem 0',background:'#F5E6D3'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>For Advocates</div>
            <h2 className="sec-title" style={{textAlign:'center'}}>Are You a Lawyer? <em>Grow Your Practice With Us</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center',maxWidth:1000,margin:'0 auto'}} className="grid-2">
            <div>
              <p style={{fontSize:'1.1rem',fontWeight:600,color:'#1A0A0D',marginBottom:'1.5rem',lineHeight:1.7}}>
                Join 50+ verified advocates already on Justice Junction. Build your digital presence, receive qualified client bookings, and manage your practice — all from one platform.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {[
                  'Free profile listing — no monthly fee',
                  'Receive qualified client bookings directly',
                  'You set your own consultation fee',
                  'Razorpay-secured instant payouts',
                  'Dedicated dashboard for case management',
                  'Bar Council badge on your public profile'
                ].map(b => (
                  <div key={b} style={{display:'flex',alignItems:'center',gap:10,fontSize:'.92rem',fontWeight:600,color:'#1A0A0D'}}>
                    <CheckCircle size={18} color="#2ECC71" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{marginTop:'2rem'}}>
                <Link href="/join-as-lawyer" className="btn btn-primary btn-lg hover-lift">Join as Advocate</Link>
              </div>
            </div>
            <div style={{background:'#fff',borderRadius:24,padding:'3rem',border:'1px solid #EDD5BE',textAlign:'center',boxShadow:'0 8px 32px rgba(139,26,42,0.08)'}}>
              <Scale size={64} color="#8B1A2A" strokeWidth={1.2} />
              <h3 style={{fontSize:'1.4rem',fontWeight:700,color:'#8B1A2A',margin:'1.5rem 0 .8rem'}}>Justice Junction 24/7</h3>
              <p style={{fontSize:'.9rem',color:'#4A2030',lineHeight:1.7}}>Your digital law practice — simplified. From client discovery to payments, everything in one dashboard.</p>
              <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'center',gap:'1rem',flexWrap:'wrap'}}>
                <span style={{background:'rgba(139,26,42,0.08)',color:'#8B1A2A',padding:'.4rem 1rem',borderRadius:50,fontSize:'.78rem',fontWeight:700}}>Free Forever</span>
                <span style={{background:'rgba(46,204,113,0.1)',color:'#2ECC71',padding:'.4rem 1rem',borderRadius:50,fontSize:'.78rem',fontWeight:700}}>Instant Payouts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section style={s.finalCta} className="mobile-py-10">
        <div className="container" style={{textAlign:'center'}}>
          <h2 style={s.ctaTitle} className="text-balance">Ready to resolve your <em style={{color:'#F5E6D3'}}>legal matters?</em></h2>
          <p style={s.ctaSub} className="text-balance">Join thousands of Indians who found their trusted legal advocate on Justice Junction 24/7. Free to sign up. No hidden fees. Legal help in minutes.</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}} className="mobile-stack">
            <Link href="/search" className="btn btn-white btn-xl mobile-w-full" style={{color:'#8B1A2A',background:'#fff'}}>Find Your Lawyer Now</Link>
            <Link href="/register?role=lawyer" className="btn btn-outline-white btn-xl mobile-w-full">Join as Advocate</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: { padding: '6rem 0 5rem', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', alignItems: 'center', background: '#8B1A2A' },
  heroOverlay: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(139,26,42,0.97) 0%, rgba(107,18,32,0.95) 100%)', zIndex: 1 },
  heroContainer: { position: 'relative', zIndex: 2, maxWidth: 750 },
  heroContent: { maxWidth: 700, width: '100%' },
  trustBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.95)', border: '1px solid #EDD5BE', borderRadius: 50, padding: '.4rem 1.2rem', marginBottom: '2rem' },
  h1: { fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2.2rem, 6vw, 4.2rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', color: '#fff', letterSpacing: '-0.02em', wordBreak: 'break-word', overflowWrap: 'break-word' },
  heroSub: { fontSize: '1.15rem', color: '#F5E6D3', marginBottom: '1.5rem', lineHeight: 1.7, fontWeight: 500 },
  searchBox: { background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #EDD5BE', maxWidth: 750 },
  searchInner: { display: 'flex', alignItems: 'center', gap: 12, padding: '8px' },
  inputGroup: { flex: 1.5, minWidth: '180px', padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 4 },
  label: { fontSize: '.7rem', fontWeight: 800, color: '#6B4050', textTransform: 'uppercase', letterSpacing: '1px' },
  select: { border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A0A0D', outline: 'none', width: '100%', cursor: 'pointer' },
  input: { border: 'none', background: 'none', fontSize: '1rem', fontWeight: 600, color: '#1A0A0D', outline: 'none', width: '100%' },
  dividerV: { width: 1, height: 40, background: '#EDD5BE' },
  searchBtn: { padding: '1rem 2rem', borderRadius: '16px' },
  finalCta: { padding: '6rem 0', background: '#8B1A2A', color: '#fff' },
  ctaTitle: { fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' },
  ctaSub: { fontSize: '1.1rem', color: '#F5E6D3', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 },
}
