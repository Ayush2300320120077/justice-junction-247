import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../api'
import { CheckCircle, Video, Lock, Zap, Bell, Search, BarChart2, Calendar, Activity, DollarSign, Smartphone, Scale, TrendingUp, CreditCard, LayoutDashboard, Star, Gift, ClipboardList } from 'lucide-react'

const SPECS = ['Criminal Defence','Family Law','Property Law','Corporate Law','Consumer Rights','Labour Law']
const STATS = [['2,400+','Verified Lawyers'],['50,000+','Cases Handled'],['98%','Satisfaction Rate'],['₹0','Platform Fee for Clients']]
const TESTIMONIALS = [
  { init:'RG', name:'Rohit Gupta', role:'Client, Delhi', text:"Found a criminal lawyer in 8 minutes. Paid exactly ₹3,500 — what was shown. Real-time case updates gave me peace of mind." },
  { init:'AP', name:'Anjali Patel', role:'Client, Mumbai', text:"Going through divorce is hard. Justice Junction made legal help easy. I knew the price before speaking to the lawyer." },
  { init:'SK', name:'Adv. Suresh Kumar', role:'Advocate, Bangalore', text:"This platform brought me 12 quality clients in my first month. Transparent pricing builds client trust before the first call." },
  { init:'VP', name:'Vikash Patel', role:'Business Owner, Ahmedabad', text:"Needed a corporate lawyer fast. Booked within minutes, had a video call same day. Case update feed is a game-changer." },
]

import { useReveal } from '../hooks/useReveal'

export default function Home() {
  const [spec, setSpec] = useState('')
  const [city, setCity] = useState('')
  const navigate = useNavigate()
  useReveal()

  const goSearch = () => {
    const p = new URLSearchParams()
    if (spec) p.set('specialization', spec)
    if (city) p.set('city', city)
    navigate('/search?' + p)
  }

  return (
    <div style={{ paddingTop: 95 }}>

      {/* HERO */}
      <section style={s.hero}>
        <div style={s.heroBgWrapper}>
          <img src="/justice-bg.png" alt="Justice Junction HD Background" style={s.heroImage} />
          <div style={s.heroOverlay}></div>
        </div>
        <div className="grid-hero" style={s.heroGrid}>
          <div>
            <div style={s.trustBadge}><span className="pulse-dot"/><span style={{fontSize:'.78rem',fontWeight:700,color:'var(--bur)'}}>2,400+ Verified Lawyers Online Now</span></div>
            <h1 style={s.h1}>Find the Right Lawyer.<br/><span style={{color:'var(--bur)',fontStyle:'italic'}}>Know the Price First.</span></h1>
            <p style={s.heroSub}>India's first legal platform with 100% price transparency. Search verified lawyers by city, specialisation, and budget — book a video consultation instantly.</p>
            <div style={s.searchCard}>
              <div className="grid-search-home" style={s.searchRow}>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <label style={s.sLabel}>Legal Issue</label>
                  <select style={s.sInput} value={spec} onChange={e=>setSpec(e.target.value)}>
                    <option value="">All Practice Areas</option>
                    {SPECS.map(a=><option key={a}>{a}</option>)}
                  </select>
                </div>
                <div style={{display:'flex',flexDirection:'column',gap:4}}>
                  <label style={s.sLabel}>Your City</label>
                  <input style={s.sInput} placeholder="Delhi, Mumbai, Bangalore..." value={city} onChange={e=>setCity(e.target.value)} onKeyDown={e=>e.key==='Enter'&&goSearch()}/>
                </div>
                <button className="btn btn-primary search-btn-home" onClick={goSearch} style={{padding:'.7rem 1.6rem',alignSelf:'flex-end'}}>Search →</button>
              </div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap',marginTop:10,alignItems:'center'}}>
                <span style={{fontSize:'.7rem',color:'var(--txt-3)',fontWeight:700}}>Quick:</span>
                {SPECS.slice(0,4).map(t=><span key={t} className="tag tag-click" onClick={()=>navigate(`/search?specialization=${t}`)}>{t}</span>)}
              </div>
            </div>
            <div style={{display:'flex',gap:'1.2rem',marginTop:'1.3rem',flexWrap:'wrap'}}>
              {[{i:<CheckCircle size={14}/>, t:'No Hidden Fees'},{i:<Video size={14}/>, t:'Video Calls'},{i:<Lock size={14}/>, t:'Confidential'},{i:<Zap size={14}/>, t:'Instant Booking'}].map(item=>(
                <span key={item.t} style={{fontSize:'.78rem',color:'var(--txt-2)',fontWeight:600,display:'flex',alignItems:'center',gap:4}}>{item.i}{item.t}</span>
              ))}
            </div>
          </div>

          <div style={{position:'relative'}}>
            <div style={s.heroCard}>
              <div style={{display:'flex',gap:12,alignItems:'flex-start',marginBottom:'1rem'}}>
                <div style={s.hcAv}>PS</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:800,fontSize:'.95rem'}}>Adv. Priya Sharma</div>
                  <div style={{fontSize:'.75rem',color:'var(--txt-3)'}}>Criminal Defence · 15 yrs exp</div>
                  <div style={{fontSize:'.75rem',color:'var(--gold)',fontWeight:700}}>★★★★★ 4.9 (124 reviews)</div>
                </div>
                <span className="badge badge-senior">Senior</span>
              </div>
              <div style={{borderTop:'1px solid var(--border)',paddingTop:'1rem',display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                <div>
                  <div style={{fontSize:'.68rem',color:'var(--txt-3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.06em'}}>Consultation Fee</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.8rem',fontWeight:700,color:'var(--bur)',lineHeight:1}}>₹4,500</div>
                  <div style={{fontSize:'.7rem',color:'var(--txt-3)'}}>Fixed · Zero hidden charges</div>
                </div>
                <button className="btn btn-primary" onClick={()=>navigate('/search')}>Book Now</button>
              </div>
              <div style={{background:'var(--green-l)',borderRadius:'var(--r-sm)',padding:'.55rem .9rem',display:'flex',alignItems:'center',gap:8}}>
                <span className="pulse-dot"/><span style={{fontSize:'.76rem',color:'var(--green)',fontWeight:700}}>Available today · Next slot: 3:00 PM</span>
              </div>
            </div>
            <div className="grid-3" style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:10}}>
              {[['50K+','Cases','var(--bur)'],['98%','Satisfaction','var(--green)'],['24/7','Available','var(--gold)']].map(([n,l,c])=>(
                <div key={l} style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'.9rem',textAlign:'center'}}>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.4rem',fontWeight:700,color:c,lineHeight:1}}>{n}</div>
                  <div style={{fontSize:'.7rem',color:'var(--txt-3)',fontWeight:600,marginTop:3}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'.7rem 1rem',display:'flex',gap:10,alignItems:'center',boxShadow:'var(--sh)',animation:'slideUp .5s ease .3s both'}}>
              <Bell size={20} color="var(--gold)" />
              <div><div style={{fontSize:'.78rem',fontWeight:700}}>Rahul just booked Adv. Mehta</div><div style={{fontSize:'.7rem',color:'var(--txt-3)'}}>2 min ago · Mumbai</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <div className="grid-stats" style={s.statsBar}>
        {STATS.map(([n,l])=>(
          <div key={l} className="reveal" style={{textAlign:'center'}}>
            <div style={{fontFamily:"'Playfair Display',serif",fontSize:'2rem',fontWeight:700,color:'#fff',lineHeight:1}}>{n}</div>
            <div style={{fontSize:'.78rem',color:'rgba(255,255,255,.65)',marginTop:3,fontWeight:600}}>{l}</div>
          </div>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <section style={{padding:'7rem 5vw',background:'#fff'}}>
        <div style={{textAlign:'center',marginBottom:'4rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>The Process</div>
          <h2 className="sec-title reveal" style={{textAlign:'center'}}>Get legal help in <em>4 steps.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(230px,1fr))',gap:'1.5rem',maxWidth:1000,margin:'0 auto'}}>
          {[{i:<Search size={28}/>,title:'Search',desc:'Enter your city and issue. All verified lawyers appear instantly with pricing.'},
            {i:<BarChart2 size={28}/>,title:'Compare',desc:'View fees, ratings, experience — all transparent before you decide.'},
            {i:<Calendar size={28}/>,title:'Book',desc:'Pick time. Meet via encrypted video call from anywhere in India.'},
            {i:<Activity size={28}/>,title:'Track',desc:'Your lawyer posts real-time case updates. No more chasing calls.'}].map((item,i)=>(
            <div key={item.title} className="reveal card card-hover" style={{textAlign:'center',padding:'2rem 1.5rem',position:'relative'}}>
              <div style={{position:'absolute',top:14,left:14,width:24,height:24,background:'var(--bur)',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.68rem',fontWeight:800}}>0{i+1}</div>
              <div style={{color:'var(--bur)',marginBottom:12,display:'flex',justifyContent:'center'}}>{item.i}</div>
              <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',marginBottom:8}}>{item.title}</h3>
              <p style={{fontSize:'.84rem',color:'var(--txt-3)',lineHeight:1.7}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* UNIQUE VALUE PROP */}
      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>
        <div className="grid-2" style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'5rem',alignItems:'center',maxWidth:1100,margin:'0 auto'}}>
          <div>
            <div className="sec-label">Our Edge</div>
            <h2 className="sec-title reveal">The <em>only</em> platform with complete price transparency.</h2>
            <p className="reveal" style={{color:'var(--txt-3)',marginBottom:'2rem',lineHeight:1.8,fontSize:'.95rem'}}>Traditional law firms hide fees until after consultation. We changed that — every lawyer's rate is shown before you even click their profile.</p>
            {[{i:<DollarSign size={20}/>,title:'Zero Hidden Charges',desc:'The fee you see is exactly what you pay. No booking fee, no extras.'},
              {i:<CheckCircle size={20}/>,title:'Bar-Verified Lawyers',desc:'Every advocate verified against Bar Council database before listing.'},
              {i:<Zap size={20}/>,title:'Same-Day Booking',desc:'Most consultations available within 24 hours of booking.'},
              {i:<Smartphone size={20}/>,title:'Full Case Visibility',desc:'Track every hearing, filing, milestone — live on your dashboard.'}].map((item)=>(
              <div key={item.title} className="reveal" style={{display:'flex',gap:12,marginBottom:'1.1rem',padding:'.9rem',borderRadius:'var(--r)'}}>
                <div style={{width:40,height:40,borderRadius:10,background:'rgba(123,29,46,.07)',color:'var(--bur)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>{item.i}</div>
                <div><div style={{fontWeight:800,fontSize:'.9rem',marginBottom:2}}>{item.title}</div><div style={{fontSize:'.82rem',color:'var(--txt-3)',lineHeight:1.6}}>{item.desc}</div></div>
              </div>
            ))}
          </div>
          <div className="reveal-r">
            <div style={{background:'#fff',borderRadius:'var(--r-xl)',padding:'2rem',boxShadow:'var(--sh-lg)',border:'1px solid var(--border)'}}>
              <div style={{fontSize:'.7rem',fontWeight:800,color:'var(--txt-3)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'1.2rem'}}>⚡ Live Pricing — Always Transparent</div>
              {[['Adv. Priya Sharma','Criminal · 15 yrs','badge-senior','₹4,500',92,'#C9943A'],['Adv. Rahul Mehta','Family · 7 yrs','badge-mid','₹2,200',75,'#16A34A'],['Adv. Sneha Joshi','Consumer · 2 yrs','badge-junior','₹800',45,'#7B1D2E'],['Adv. Arjun Kapoor','Corporate · 20 yrs','badge-senior','₹8,000',98,'#C9943A']].map(([name,spec,badge,price,pct,color])=>(
                <div key={name} style={{marginBottom:'1rem',paddingBottom:'1rem',borderBottom:'1px solid var(--border)'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <div><div style={{fontWeight:700,fontSize:'.88rem'}}>{name}</div><div style={{fontSize:'.7rem',color:'var(--txt-3)'}}>{spec}</div></div>
                    <div style={{textAlign:'right'}}><div style={{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--bur)'}}>{price}</div><div style={{fontSize:'.66rem',color:'var(--txt-3)'}}>per session</div></div>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{width:`${pct}%`,background:color}}/></div>
                </div>
              ))}
              <Link to="/search" className="btn btn-primary" style={{width:'100%',justifyContent:'center'}}>Browse All Lawyers →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOR LAWYERS */}
      <section style={{padding:'7rem 5vw',background:'linear-gradient(135deg,var(--bur) 0%,#9E2D42 100%)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',right:'-5rem',top:'50%',transform:'translateY(-50%)',opacity:.04,pointerEvents:'none'}}><Scale size={450}/></div>
        <div className="grid-2" style={{maxWidth:1000,margin:'0 auto',display:'grid',gridTemplateColumns:'1fr 1fr',gap:'4rem',alignItems:'center'}}>
          <div>
            <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(255,255,255,.12)',border:'1px solid rgba(255,255,255,.2)',borderRadius:50,padding:'.3rem .9rem',fontSize:'.7rem',fontWeight:800,color:'rgba(255,255,255,.8)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'1rem'}}>For Advocates</div>
            <h2 className="sec-title reveal" style={{color:'#fff',maxWidth:400}}>Grow your practice.<br/><em style={{color:'var(--gold-l)'}}>Get quality clients.</em></h2>
            <p className="reveal" style={{color:'rgba(255,255,255,.75)',marginBottom:'2rem',lineHeight:1.8}}>Register on Justice Junction and get discovered by thousands of clients searching for legal help in your city.</p>
            {[{i:<TrendingUp size={16}/>,t:'Get 10–30 client leads/month'},
              {i:<CreditCard size={16}/>,t:'Set your own consultation fee'},
              {i:<LayoutDashboard size={16}/>,t:'Manage all clients from one dashboard'},
              {i:<Star size={16}/>,t:'Build reputation with verified reviews'},
              {i:<Gift size={16}/>,t:'Free to register — plans from ₹999/mo'}].map(item=>(
              <div key={item.t} className="reveal" style={{display:'flex',gap:10,alignItems:'center',marginBottom:8}}>
                <span style={{color:'var(--gold-l)',display:'flex'}}>{item.i}</span>
                <span style={{fontSize:'.88rem',color:'rgba(255,255,255,.85)',fontWeight:600}}>{item.t}</span>
              </div>
            ))}
            <div style={{display:'flex',gap:12,marginTop:'2rem',flexWrap:'wrap'}}>
              <Link to="/register?role=lawyer" className="btn btn-gold btn-lg">Register as Lawyer Free</Link>
              <Link to="/lawyer-plans" className="btn btn-outline-white">View Subscription Plans</Link>
            </div>
          </div>
          <div className="reveal-r">
            <div style={{background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'var(--r-xl)',padding:'1.8rem',backdropFilter:'blur(8px)'}}>
              <div style={{fontSize:'.68rem',fontWeight:800,color:'rgba(255,255,255,.5)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:'1.2rem'}}>Lawyer Dashboard Preview</div>
              {[{i:<ClipboardList size={18}/>,title:'New Booking',sub:'Riya S. · Family Law',time:'2 min ago',bg:'rgba(201,148,58,.25)',color:'#E8B55A'},
                {i:<CheckCircle size={18}/>,title:'Booking Confirmed',sub:'Mohan V. · Criminal',time:'1 hr ago',bg:'rgba(22,163,74,.25)',color:'#4ADE80'},
                {i:<Activity size={18}/>,title:'Case Update Posted',sub:'Nisha R. · Property',time:'3 hrs ago',bg:'rgba(255,255,255,.15)',color:'rgba(255,255,255,.7)'},
                {i:<Star size={18}/>,title:'New 5-star Review',sub:'"Excellent advice" · Verified',time:'Yesterday',bg:'rgba(201,148,58,.25)',color:'#E8B55A'}].map((item)=>(
                <div key={item.title} style={{display:'flex',gap:10,alignItems:'center',padding:'.75rem',background:'rgba(255,255,255,.06)',borderRadius:'var(--r-sm)',marginBottom:8,border:'1px solid rgba(255,255,255,.08)'}}>
                  <span style={{color:item.color,display:'flex'}}>{item.i}</span>
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:'.84rem',color:'#fff'}}>{item.title}</div><div style={{fontSize:'.71rem',color:'rgba(255,255,255,.5)'}}>{item.sub} · {item.time}</div></div>
                  <span style={{fontSize:'.66rem',padding:'.16rem .55rem',borderRadius:50,fontWeight:700,background:item.bg,color:item.color,whiteSpace:'nowrap'}}>new</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{padding:'7rem 5vw',background:'#fff'}}>
        <div style={{textAlign:'center',marginBottom:'3.5rem'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Real Stories</div>
          <h2 className="sec-title reveal" style={{textAlign:'center'}}>Trusted by <em>thousands.</em></h2>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(270px,1fr))',gap:'1.5rem',maxWidth:1100,margin:'0 auto'}}>
          {TESTIMONIALS.map(t=>(
            <div key={t.name} className="reveal card card-hover">
              <div style={{color:'var(--gold)',marginBottom:12,letterSpacing:2,fontSize:'.88rem'}}>★★★★★</div>
              <blockquote style={{fontFamily:"'Playfair Display',serif",fontSize:'1rem',fontStyle:'italic',lineHeight:1.65,marginBottom:'1.2rem'}}>"{t.text}"</blockquote>
              <div style={{display:'flex',gap:10,alignItems:'center',borderTop:'1px solid var(--border)',paddingTop:'1rem'}}>
                <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(123,29,46,.1)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800,fontSize:'.85rem',color:'var(--bur)'}}>{t.init}</div>
                <div><div style={{fontWeight:800,fontSize:'.85rem'}}>{t.name}</div><div style={{fontSize:'.73rem',color:'var(--txt-3)'}}>{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section style={{padding:'6rem 5vw',background:'linear-gradient(150deg,var(--cream),var(--cream-2),var(--cream-3)',borderTop:'1px solid var(--border)',textAlign:'center'}}>
        <div style={{maxWidth:680,margin:'0 auto'}}>
          <div className="sec-label" style={{justifyContent:'center'}}>Get Started Today</div>
          <h2 className="sec-title reveal" style={{fontSize:'clamp(2rem,4.5vw,3rem)'}}>Your legal problem deserves a <em>real solution.</em></h2>
          <p className="reveal" style={{color:'var(--txt-3)',maxWidth:480,margin:'.5rem auto 2.5rem',lineHeight:1.8}}>Join over 50,000 people who found their lawyer on Justice Junction. Register free. No credit card needed.</p>
          <div className="reveal" style={{display:'flex',gap:'1rem',justifyContent:'center',flexWrap:'wrap'}}>
            <Link to="/search" className="btn btn-primary btn-xl">Find a Lawyer Now →</Link>
            <Link to="/register?role=lawyer" className="btn btn-outline btn-xl">Join as a Lawyer</Link>
          </div>
          <div className="reveal" style={{display:'flex',gap:'1.8rem',justifyContent:'center',marginTop:'2rem',flexWrap:'wrap'}}>
            {['Free for clients','Lawyers from ₹500/session','Video calls included','No hidden charges'].map(f=>(
              <span key={f} style={{fontSize:'.78rem',color:'var(--txt-3)',fontWeight:600,display:'flex',alignItems:'center',gap:5}}><CheckCircle size={14} color="var(--green)"/>{f}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

const s={
  hero:{padding:'4rem 5vw 5rem',position:'relative',overflow:'hidden',minHeight:'85vh',display:'flex',alignItems:'center'},
  heroBgWrapper:{position:'absolute',top:0,left:0,right:0,bottom:0,zIndex:0},
  heroImage:{width:'100%',height:'100%',objectFit:'cover'},
  heroOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,background:'linear-gradient(160deg, rgba(253,248,242,0.85) 0%, rgba(253,248,242,0.75) 100%)',zIndex:1},
  heroGrid:{display:'grid',gridTemplateColumns:'1.1fr .9fr',gap:'4rem',alignItems:'center',maxWidth:1160,margin:'0 auto',position:'relative',zIndex:2},
  trustBadge:{display:'inline-flex',alignItems:'center',gap:8,background:'rgba(123,29,46,.07)',border:'1px solid rgba(123,29,46,.12)',borderRadius:50,padding:'.35rem 1rem',marginBottom:'1.4rem'},
  h1:{fontFamily:"'Playfair Display',serif",fontSize:'clamp(2.6rem,5vw,4rem)',fontWeight:700,lineHeight:1.12,maxWidth:560,marginBottom:'1.2rem'},
  heroSub:{fontSize:'1rem',color:'var(--txt-2)',maxWidth:490,marginBottom:'2rem',lineHeight:1.8,fontWeight:500},
  searchCard:{background:'#fff',borderRadius:'var(--r-lg)',boxShadow:'var(--sh-xl)',padding:'1.3rem',border:'1px solid var(--border)',maxWidth:580},
  searchRow:{display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:10,alignItems:'flex-end'},
  sLabel:{fontSize:'.68rem',fontWeight:800,color:'var(--txt-3)',textTransform:'uppercase',letterSpacing:'.08em'},
  sInput:{width:'100%',padding:'.65rem .9rem',border:'1.5px solid var(--border)',borderRadius:'var(--r-sm)',fontSize:'.9rem',color:'var(--txt)',fontFamily:'Plus Jakarta Sans,sans-serif',outline:'none'},
  statsBar:{background:'var(--bur)',padding:'2.8rem 5vw',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'1rem'},
  heroCard:{background:'#fff',borderRadius:'var(--r-xl)',padding:'1.5rem',boxShadow:'var(--sh-xl)',border:'1px solid var(--border)',marginBottom:'1rem'},
  hcAv:{width:46,height:46,borderRadius:12,background:'rgba(123,29,46,.1)',color:'var(--bur)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontWeight:700,fontSize:'1rem',flexShrink:0},
}
