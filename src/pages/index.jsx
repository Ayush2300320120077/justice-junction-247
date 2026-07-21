import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CheckCircle, Video, Lock, Zap, Bell, Search, BarChart2, Calendar, Activity, DollarSign, Smartphone, Scale, TrendingUp, CreditCard, LayoutDashboard, Star, Gift, ClipboardList, ShieldCheck, Award, Users, Clock, Globe, MapPin } from 'lucide-react'
import Head from 'next/head'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law']

const PRACTICE_AREAS = [
  { emoji: '⚖️', name: 'Criminal Defence', desc: 'FIR, bail, trial representation' },
  { emoji: '👨‍👩‍👧', name: 'Family Law', desc: 'Divorce, custody, maintenance' },
  { emoji: '🏠', name: 'Property Law', desc: 'Disputes, registry, possession' },
  { emoji: '🏢', name: 'Corporate Law', desc: 'Contracts, compliance, startups' },
  { emoji: '🛡️', name: 'Consumer Rights', desc: 'Fraud, refunds, RERA complaints' },
  { emoji: '👷', name: 'Labour Law', desc: 'Termination, PF, ESIC disputes' },
  { emoji: '⚡', name: 'Cyber Law', desc: 'Online fraud, IT Act, privacy' },
  { emoji: '💡', name: 'Intellectual Property', desc: 'Patents, trademarks, copyright' },
  { emoji: '💰', name: 'Taxation', desc: 'GST disputes, income tax' },
  { emoji: '🤝', name: 'Civil Disputes', desc: 'Recovery, injunctions, damages' },
  { emoji: '💍', name: 'Divorce', desc: 'Contested & mutual consent' },
  { emoji: '📋', name: 'Bail & FIR', desc: 'Emergency same-day help' },
]

const TESTIMONIALS = [
  { init:'RG', name:'Rohit Gupta', role:'Client, Delhi', stars:5, badge:'Illustrative Example', text:"Found a criminal lawyer in 8 minutes. Paid exactly ₹3,500 — what was shown. Real-time case updates gave me peace of mind." },
  { init:'AP', name:'Anjali Patel', role:'Client, Mumbai', stars:5, badge:'Illustrative Example', text:"Going through divorce is hard. Justice Junction made legal help easy. I knew the price before speaking to the lawyer." },
  { init:'SK', name:'Adv. Suresh Kumar', role:'Advocate, Bangalore', stars:5, badge:'Illustrative Example', text:"This platform brought me 12 quality clients in my first month. Transparent pricing builds client trust before the first call." },
  { init:'VP', name:'Vikash Patel', role:'Business Owner, Ahmedabad', stars:4, badge:'Illustrative Example', text:"Needed a corporate lawyer fast. Booked within minutes, had a video call same day. Case update feed is a game-changer." },
  { init:'MS', name:'Meena Sharma', role:'Client, Jaipur', stars:5, badge:'Illustrative Example', text:"My property dispute was stuck for years. Found the right lawyer in 10 minutes, had my first consultation same evening. Incredible service." },
  { init:'PN', name:'Adv. Priya Nair', role:'Advocate, Chennai', stars:4, badge:'Illustrative Example', text:"Joined Justice Junction as an advocate last year. My client base doubled in 3 months. The platform handles discovery, booking, and payments seamlessly." },
]

const WHY_FEATURES = [
  { emoji: '🔒', title: 'Bar Council Verified', desc: 'Every advocate is verified against Bar Council of India enrollment records. No unverified lawyers, ever.' },
  { emoji: '💰', title: 'Zero Platform Fee', desc: 'Clients pay only the lawyer\'s consultation fee. We charge no booking fee or hidden commission to clients.' },
  { emoji: '📹', title: 'Encrypted Video Calls', desc: 'All consultations happen over end-to-end encrypted video. Your case details stay completely private.' },
  { emoji: '📊', title: 'Real-Time Case Updates', desc: 'Your lawyer posts case progress live to your dashboard. No more chasing phone calls or WhatsApp messages.' },
  { emoji: '🌐', title: 'Pan-India Network', desc: 'Advocates across 100+ cities. Find local expertise in your district, or consult remotely from anywhere.' },
  { emoji: '⏱️', title: 'Available 24/7', desc: 'Legal emergencies don\'t follow office hours. Book at midnight if needed — our advocates are always available.' },
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
        <title>Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help</title>
        <meta name="description" content="Find and book Bar Council verified lawyers across India. Upfront pricing, instant booking, encrypted video consultations. Available 24/7." />
        <meta name="keywords" content="lawyer in India, find advocate online, legal help 24/7, book lawyer India, verified advocates, online lawyer consultation, legal services India" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://justice-junction-app.vercel.app/" />
        <meta property="og:title" content="Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help" />
        <meta property="og:description" content="Find and book Bar Council verified lawyers across India. Upfront pricing, instant booking, encrypted video consultations. Available 24/7." />
        <meta property="og:image" content="https://justice-junction-app.vercel.app/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Justice Junction 24/7" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Justice Junction 24/7 — Find Verified Lawyers in India | 24/7 Legal Help" />
        <meta name="twitter:description" content="Find and book Bar Council verified lawyers across India. Upfront pricing, instant booking, encrypted video consultations. Available 24/7." />
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
      <section style={{
        padding: '6rem 0 5rem', position: 'relative', overflow: 'hidden', minHeight: '85vh', display: 'flex', alignItems: 'center',
        backgroundImage: `linear-gradient(135deg, rgba(91, 21, 33, 0.92) 0%, rgba(123, 29, 46, 0.85) 50%, rgba(91, 21, 33, 0.95) 100%), url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80')`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'
      }} className="hero-responsive">
        <div className="container hero-container-responsive" style={{ position: 'relative', zIndex: 2, maxWidth: 750 }}>
          <div style={{ maxWidth: 700, width: '100%' }} className="reveal-l visible mobile-text-center">
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '2rem', flexWrap: 'wrap' }} className="mobile-mb-4">
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7B1D2E', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 50, padding: '.4rem 1.2rem' }}>
                <ShieldCheck size={16} color="#fff"/>
                <span style={{fontSize:'.85rem',fontWeight:700,color:'#fff'}}>Bar Council Verified Professionals</span>
              </div>
              <span style={{ background: 'rgba(245,196,179,0.2)', border: '1px solid rgba(245,196,179,0.5)', borderRadius: 50, padding: '.3rem .9rem', fontSize: '.75rem', fontWeight: 800, color: '#F5C4B3', letterSpacing: '1.5px', textTransform: 'uppercase' }}>BETA</span>
            </div>
            
            <h1 style={{...s.h1, textShadow: '0 4px 20px rgba(0,0,0,0.5)'}} className="h1-responsive text-balance">
              Find Your <span className="gradient-text" style={{color: '#fff', background: 'none', WebkitTextFillColor: 'initial'}}>Lawyer</span> —<br className="mobile-hide"/>
              <span style={{color:'#F5C4B3', fontStyle:'italic'}}>Anytime, Anywhere.</span>
            </h1>
            
            <p style={{ fontSize: '1.15rem', color: '#F9EEE4', marginBottom: '1.5rem', lineHeight: 1.7, fontWeight: 500, textShadow: '0 2px 10px rgba(0,0,0,0.4)' }} className="hero-sub-responsive text-balance">
              India's first 100% price-transparent legal platform. Bar Council verified advocates. Instant booking. 24/7 support.
            </p>

            <div style={{ background: 'rgba(255,255,255,0.95)', padding: '8px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.15)', border: '1px solid #E8C9A8', maxWidth: 750, color: '#1A0A0D' }} className="hover-glow search-box-responsive">
              <div style={s.searchInner} className="mobile-stack">
                <div style={s.inputGroup} className="mobile-text-left">
                  <label style={s.label} htmlFor="issue-select">Legal Issue</label>
                  <select id="issue-select" style={s.select} value={spec} onChange={e=>setSpec(e.target.value)}>
                    <option value="" style={{color: '#9A7A84'}}>What do you need help with?</option>
                    {SPECS.map(a=><option key={a} value={a} style={{color: '#1A0A0D'}}>{a}</option>)}
                  </select>
                </div>
                <div style={s.dividerV} className="mobile-hide" />
                <div style={s.inputGroup} className="mobile-text-left">
                  <label style={s.label} htmlFor="city-input">City or Pincode</label>
                  <div style={{display:'flex', alignItems:'center', gap:8}}>
                    <Search size={18} color="#7B1D2E"/>
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
                <button className="btn btn-primary btn-lg hover-lift search-btn-home" onClick={goSearch} style={{ padding: '1rem 2rem', borderRadius: '16px' }}>
                  Find My Lawyer
                </button>
              </div>
            </div>

            <div style={{display:'flex',gap:'2rem',marginTop:'2rem',flexWrap:'wrap', background:'rgba(255,255,255,0.2)', backdropFilter:'blur(4px)', padding:'1rem 1.5rem', borderRadius: '12px', width: 'fit-content'}} className="mobile-stack mobile-gap-4">
              <div style={{display:'flex', alignItems:'center', gap:8, color: '#fff', fontSize: '0.9rem', fontWeight: 600}}>✓ Bar Council Verified</div>
              <div style={{display:'flex', alignItems:'center', gap:8, color: '#fff', fontSize: '0.9rem', fontWeight: 600}}>✓ No Hidden Fees</div>
              <div style={{display:'flex', alignItems:'center', gap:8, color: '#fff', fontSize: '0.9rem', fontWeight: 600}}>✓ Secure Video Calls</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ PRACTICE AREAS ══════ */}
      <section style={{padding:'5rem 0',background:'#fff'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center', color: '#7B1D2E', fontSize: '0.75rem'}}>LEGAL SPECIALIZATIONS</div>
            <h2 className="sec-title" style={{textAlign:'center', color: '#1A0A0D', fontWeight: 700, fontSize: '2.25rem'}}>We Cover Every Legal Matter</h2>
            <p style={{color: '#5A3A42', fontSize: '1rem', marginTop: '0.5rem'}}>Find the right expert — whatever your legal situation.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:'1.2rem',maxWidth:1100,margin:'0 auto'}}>
            {PRACTICE_AREAS.map(area => (
              <Link href={`/search?specialization=${encodeURIComponent(area.name)}`} key={area.name} style={{textDecoration:'none'}}>
                <div style={{background: '#fff', borderRadius: '12px', border: '1px solid #E8C9A8', padding: '1.25rem', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%'}} className="hover-lift">
                  <div style={{background: '#FDF6EE', borderRadius: '8px', padding: '8px', display: 'inline-flex', alignSelf: 'flex-start', marginBottom: '0.75rem'}}>
                    <span style={{fontSize:'1.5rem', lineHeight: 1}}>{area.emoji}</span>
                  </div>
                  <div style={{fontWeight:600,fontSize:'1rem',color:'#1A0A0D',marginBottom:4}}>{area.name}</div>
                  <div style={{fontSize:'.875rem',color:'#5A3A42',lineHeight:1.4}}>{area.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ WHY CHOOSE US ══════ */}
      <section style={{padding:'5rem 0',background:'#FDF6EE'}}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center', color: '#7B1D2E', fontSize: '0.75rem'}}>OUR PROMISE</div>
            <h2 className="sec-title" style={{textAlign:'center', color: '#1A0A0D', fontWeight: 700, fontSize: '2.25rem'}}>Why Indians Choose Justice Junction</h2>
            <p style={{color: '#5A3A42', fontSize: '1rem', marginTop: '0.5rem'}}>We built the platform we wished existed when we needed legal help.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1100,margin:'0 auto'}}>
            {WHY_FEATURES.map(f => (
              <div key={f.title} style={{background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E8C9A8', transition: 'all 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}} className="hover-lift">
                <div style={{background: '#7B1D2E', color: '#fff', width: '48px', height: '48px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1rem'}}>
                  {f.emoji}
                </div>
                <h3 style={{fontSize:'1.1rem',fontWeight:700,color:'#1A0A0D',marginBottom:8}}>{f.title}</h3>
                <p style={{fontSize:'.88rem',color:'#5A3A42',lineHeight:1.7}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ HOW IT WORKS ══════ */}
      <section style={{
        padding:'5rem 0',
        backgroundColor: '#7B1D2E',
        backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255,255,255,0.05) 2px, transparent 0), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2px, transparent 0)`,
        backgroundSize: '100px 100px'
      }}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center',color:'#F5D5C0'}}>The Process</div>
            <h2 className="sec-title" style={{textAlign:'center',color:'#fff'}}>Get legal help in <em style={{color:'#F5D5C0'}}>4 easy steps.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
            {[
              {i:<Search size={28}/>,title:'Search',desc:'Enter your city and legal issue. Our smart filter instantly shows verified advocates matching your exact need — no spam, no cold calls.'},
              {i:<BarChart2 size={28}/>,title:'Compare',desc:'See full profiles: experience, fees, ratings, past case types, spoken languages, availability. 100% transparent before you decide.'},
              {i:<Calendar size={28}/>,title:'Book',desc:'Pick your preferred time slot. Meet via secure, encrypted video call or in-person. Pay only what was shown — no surprise charges.'},
              {i:<Activity size={28}/>,title:'Track',desc:'Get real-time case updates from your lawyer via your dashboard. Know exactly where your case stands — always.'}
            ].map((item,i)=>(
              <div key={item.title} style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 'bold', border: '1px solid rgba(255,255,255,0.3)', margin: '0 auto 1.5rem'}}>
                  {i+1}
                </div>
                <h3 style={{fontSize:'1.3rem',marginBottom:12,color:'#fff',fontWeight: 'bold'}}>{item.title}</h3>
                <p style={{fontSize:'.9rem',color:'#F5D5C0',lineHeight:1.7}}>{item.desc}</p>
                {i < 3 && <div style={{position: 'absolute', top: '50px', right: '-10px', color: 'rgba(255,255,255,0.4)'}} className="hide-mobile">➔</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ TESTIMONIALS ══════ */}
      <section style={{
        padding:'5rem 0',
        backgroundImage: `linear-gradient(rgba(253, 246, 238, 0.96), rgba(245, 224, 200, 0.97)), url('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container">
          <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
            <div className="sec-label" style={{justifyContent:'center'}}>Testimonials</div>
            <h2 className="sec-title" style={{textAlign:'center', color: '#7B1D2E'}}>Trusted by <em>thousands across India.</em></h2>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'1.5rem',maxWidth:1100,margin:'0 auto'}}>
            {TESTIMONIALS.map(t=>(
              <div key={t.name} style={{background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #E8C9A8', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}} className="hover-lift">
                <div style={{color:'#7B1D2E',marginBottom:12,letterSpacing:2,fontSize:'1rem',display:'flex',gap:2}}>
                  {[1,2,3,4,5].map(i => (
                    <span key={i} style={{color: i <= t.stars ? '#7B1D2E' : '#E8C9A8'}}>★</span>
                  ))}
                </div>
                <p style={{fontSize:'.95rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'1.5rem',color:'#1A0A0D'}}>"{t.text}"</p>
                <div style={{display:'flex',gap:12,alignItems:'center'}}>
                  <div style={{width:44,height:44,borderRadius:'50%',background:'#7B1D2E',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#fff'}}>{t.init}</div>
                  <div>
                    <div style={{fontWeight:800,fontSize:'.95rem',color:'#1A0A0D'}}>{t.name}</div>
                    <div style={{fontSize:'.78rem',color:'#5A3A42'}}>{t.role}</div>
                    <div style={{fontSize:'.65rem',fontWeight:600,color:'#9CA3AF',marginTop:2}}>{t.badge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{textAlign:'center',color:'#9CA3AF',fontSize:'.78rem',marginTop:'2rem',fontWeight:500,fontStyle:'italic'}}>* Testimonials shown are illustrative examples. Real reviews will appear after public launch.</p>
        </div>
      </section>

      {/* ══════ STATS BANNER ══════ */}
      <section style={{
        padding:'4rem 0',
        background: 'linear-gradient(135deg, #5C1521, #7B1D2E)'
      }}>
        <style dangerouslySetInnerHTML={{__html: `
          .cta-section-bg::before {
            content: '';
            position: absolute;
            inset: 0;
            background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
            pointer-events: none;
          }
        `}} />
        <div className="container cta-section-bg" style={{position: 'relative'}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',gap:'2rem',textAlign:'center'}} className="grid-stats">
            {[['500+','Advocates'],['10,000+','Users Served'],['100+','Cities Covered'],['4.8 ★','Client Rating']].map(([n,l], idx)=>(
              <div key={l} style={{borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.2)' : 'none'}} className="mobile-border-none">
                <div style={{fontSize:'3rem',fontWeight:900,color:'#F5C4B3',lineHeight:1}}>{n}</div>
                <div style={{fontSize:'.875rem',color:'#F9EEE4',textTransform:'uppercase',letterSpacing:'1px',marginTop:8}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════ FOR LAWYERS TEASER ══════ */}
      <section style={{padding:'5rem 0',background:'#FDF6EE'}}>
        <div className="container">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'3rem',alignItems:'center',maxWidth:1100,margin:'0 auto'}} className="grid-2">
            <div>
              <div style={{color: '#7B1D2E', textTransform: 'uppercase', fontSize: '0.875rem', fontWeight: 700, marginBottom: '0.5rem'}}>FOR LEGAL PROFESSIONALS</div>
              <h2 style={{fontSize: '3rem', fontWeight: 900, color: '#1A0A0D', lineHeight: 1.1, marginBottom: '1.5rem'}}>Are You a Lawyer? Grow Your Practice.</h2>
              <p style={{fontSize:'1rem',color:'#5A3A42',marginBottom:'2rem',lineHeight:1.7}}>
                Join 500+ verified advocates on Justice Junction. Get quality client bookings 24/7, set your own consultation fee, and manage your entire practice from one smart dashboard.
              </p>
              <div style={{display:'flex',flexDirection:'column',gap:12, marginBottom: '2.5rem'}}>
                {[
                  'Free profile listing — no upfront cost',
                  'You set your own consultation fee',
                  'Receive direct client bookings 24/7',
                  'Razorpay-secured payouts within 48 hours',
                  'Bar Council verified badge on your profile',
                  'Real-time dashboard for case management'
                ].map(b => (
                  <div key={b} style={{display:'flex',alignItems:'center',gap:10,fontSize:'1rem',color:'#1A0A0D'}}>
                    <span style={{color: '#7B1D2E', fontWeight: 'bold'}}>✓</span>
                    <span>{b}</span>
                  </div>
                ))}
              </div>
              <div style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
                <Link href="/join-as-lawyer" className="btn btn-primary btn-lg hover-lift">Join as Advocate — Free</Link>
                <Link href="/lawyer-plans" className="btn btn-outline btn-lg hover-lift">View Pricing Plans</Link>
              </div>
            </div>
            
            <div style={{background:'#7B1D2E',borderRadius:'24px',padding:'3rem',textAlign:'center'}}>
              <div style={{color: '#F5C4B3', fontSize: '0.875rem', textTransform: 'uppercase', fontWeight: 600, marginBottom: '1rem'}}>Pro Plan — Avg. Monthly Earnings</div>
              <div style={{fontSize: '2.5rem', fontWeight: 900, color: '#F9EEE4', marginBottom: '0.5rem'}}>₹45,000 – ₹75,000</div>
              <div style={{color: '#F5C4B3', fontSize: '0.75rem', marginBottom: '1.5rem'}}>Based on 15–30 consultations at ₹2,500 avg</div>
              
              <div style={{borderTop: '1px solid rgba(255,255,255,0.2)', margin: '1.5rem 0'}}></div>
              
              <div style={{display: 'flex', justifyContent: 'space-between', padding: '0 1rem'}}>
                <div>
                  <div style={{color: '#fff', fontWeight: 'bold', fontSize: '1.25rem'}}>48h</div>
                  <div style={{color: '#F5C4B3', fontSize: '0.875rem'}}>Verification</div>
                </div>
                <div>
                  <div style={{color: '#fff', fontWeight: 'bold', fontSize: '1.25rem'}}>0%</div>
                  <div style={{color: '#F5C4B3', fontSize: '0.875rem'}}>Upfront fee</div>
                </div>
                <div>
                  <div style={{color: '#fff', fontWeight: 'bold', fontSize: '1.25rem'}}>Free</div>
                  <div style={{color: '#F5C4B3', fontSize: '0.875rem'}}>To register</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════ FINAL CTA ══════ */}
      <section className="mobile-py-10 cta-section-bg" style={{ padding: '6rem 0', background: 'linear-gradient(135deg, #5C1521 0%, #7B1D2E 50%, #5C1521 100%)', color: '#fff', position: 'relative' }}>
        <div className="container" style={{textAlign:'center', position: 'relative', zIndex: 2}}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }} className="text-balance">Ready to resolve your <em style={{color:'#F9EEE4'}}>legal matters?</em></h2>
          <p style={{ fontSize: '1.1rem', color: '#F9EEE4', marginBottom: '2.5rem', maxWidth: 600, margin: '0 auto 2.5rem', lineHeight: 1.7 }} className="text-balance">Join thousands of Indians who found their trusted legal advocate on Justice Junction 24/7. Free to sign up. No hidden fees. Legal help in minutes.</p>
          <div style={{display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap'}} className="mobile-stack">
            <Link href="/search" className="btn btn-white btn-xl mobile-w-full" style={{color:'#7B1D2E',background:'#fff'}}>Find Your Lawyer Now</Link>
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
