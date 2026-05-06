import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { Scale, Heart, Home, Search, Shield, LayoutDashboard, Briefcase, Info, LogOut, BookOpen, FileText } from 'lucide-react'
import Logo from './Logo'

export default function Navbar() {
  const { user, isLoggedIn, logout } = useAuth()
  const router = useRouter()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [favCount, setFavCount] = useState(0)
  
  useEffect(() => {
    const count = JSON.parse(localStorage.getItem('jj_favorites') || '[]').length
    setFavCount(count)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => setMobileOpen(false), [router.pathname])

  const handleLogout = () => { logout(); router.push('/') }
  const isActive = (p) => router.pathname === p

  return (
    <>
      {/* Emergency top bar */}
      <div style={{...s.emergency, zIndex: 9999}} className="mobile-px-4">
        <span style={s.eDot}></span>
        <span className="hide-mobile" style={{fontSize:'.75rem',fontWeight:700,color:'#F5E6D3'}}>Emergency Legal Help Available 24/7 - </span>
        <span className="show-mobile-inline" style={{fontSize:'.7rem',fontWeight:700,color:'#F5E6D3'}}>Legal Help 24/7 - </span>
        <Link href="/search" style={{fontSize:'.7rem',color:'#F5C4B3',fontWeight:700,marginLeft:4,textDecoration:'underline'}}>Find a Lawyer →</Link>
      </div>

      {/* Main nav */}
      <nav style={{...s.nav,...(scrolled?s.navScrolled:{})}} className="mobile-px-4">
        <div style={s.inner}>
          <Link href="/" style={{textDecoration:'none'}}>
            <Logo color="#fff" subColor="#F5E6D3" />
          </Link>

          <ul style={s.links} className="hide-mobile">
            {[
              ['/', 'Home'],
              ['/search','Find Lawyers'],
              ['/knowledge-hub','Knowledge Hub'],
              ['/document-generator','Legal Tools'],
              ['/join-as-lawyer','For Lawyers']
            ].map(([p,l])=>(
              <li key={p}><Link href={p} style={{...s.link,...(isActive(p)?s.linkActive:{})}}>{l}</Link></li>
            ))}
          </ul>

          <div style={{display:'flex', alignItems:'center', gap:'1rem'}}>
            <div style={s.actions} className="hide-mobile">
              <Link href="/favorites" style={s.iconBtn} title="Saved Lawyers">
                <span style={{display:'flex',color:'#8B1A2A'}}><Heart size={18}/></span>
                {favCount > 0 && <span style={s.badge}>{favCount}</span>}
              </Link>

              {isLoggedIn ? (
                <>
                  <div style={s.userChip}>
                    <div style={s.userAv}>{(user?.name || 'U')[0].toUpperCase()}</div>
                    <span style={{fontSize:'.85rem',fontWeight:700,color:'#1A0A0D'}}>{user?.name?.split(' ')[0]}</span>
                  </div>
                  {user?.role === 'admin' ? (
                    <Link href="/admin" className="btn btn-sm" style={{background:'#fff',color:'#8B1A2A',border:'none',fontWeight:700,borderRadius:6}}>Admin Panel</Link>
                  ) : (
                    <Link href="/dashboard" className="btn btn-sm" style={{border:'1.5px solid #fff',color:'#fff',background:'transparent',borderRadius:6}}>Dashboard</Link>
                  )}
                  <button className="btn btn-sm" onClick={handleLogout} style={{border:'1.5px solid rgba(255,255,255,0.4)',color:'#F5E6D3',background:'transparent',borderRadius:6}}>Logout</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="btn btn-sm" style={{border:'1.5px solid #fff',color:'#fff',background:'transparent',borderRadius:6}}>Login</Link>
                  <Link href="/register" className="btn btn-sm" style={{background:'#fff',color:'#8B1A2A',border:'none',fontWeight:700,borderRadius:6}}>Register Free</Link>
                </>
              )}
            </div>

            <div className="show-mobile" style={{display:'flex', alignItems:'center', gap:'0.5rem'}}>
              <Link href="/favorites" style={{...s.iconBtn, width:36, height:36}} title="Saved Lawyers">
                <span style={{display:'flex',color:'#8B1A2A'}}><Heart size={16}/></span>
                {favCount > 0 && <span style={{...s.badge, width:16, height:16, fontSize:'.6rem', top:-4, right:-4}}>{favCount}</span>}
              </Link>
              <button style={s.burger} onClick={() => setMobileOpen(o => !o)}>
                {mobileOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div style={{
          ...s.mobileMenu,
          display: 'flex',
          opacity: 1,
          visibility: 'visible',
          transform: 'translateY(0)'
        }} className="backdrop-blur">
          <div className="container" style={{display:'flex', flexDirection:'column', gap: 8, paddingTop: '1rem', position: 'relative'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom: '1rem'}}>
              <h3 style={{color: '#1A0A0D', margin: 0}}>Menu</h3>
              <button onClick={() => setMobileOpen(false)} style={{background: 'transparent', border: 'none', fontSize: '1.5rem', color: '#1A0A0D', cursor: 'pointer'}}>✕</button>
            </div>
            {[
              ['/', <Home size={18}/>, 'Home'],
              ['/search', <Search size={18}/>, 'Find Lawyers'],
              ['/knowledge-hub', <BookOpen size={18}/>, 'Knowledge Hub'],
              ['/document-generator', <FileText size={18}/>, 'Legal Tools'],
              ['/join-as-lawyer', <Briefcase size={18}/>, 'Join as Lawyer'],
              ...(isLoggedIn ? [
                user?.role === 'admin' ? ['/admin', <Shield size={18}/>, 'Admin Panel'] : ['/dashboard', <LayoutDashboard size={18}/>, 'Dashboard'],
                ['/favorites', <Heart size={18}/>, 'Saved Lawyers'],
              ] : []),
            ].map(([p, i, l], idx) => (
              <Link 
                key={p} 
                href={p} 
                style={{...s.mLink, animationDelay: `${idx * 0.05}s`}} 
                onClick={() => setMobileOpen(false)}
                className="page-reveal"
              >
                <span style={{color:'#7B1D2E',display:'flex',background:'rgba(123,29,46,0.08)',padding:8,borderRadius:10}}>{i}</span>
                {l}
              </Link>
            ))}
            <div style={{margin: '1rem 0', height: 1, background: '#E8C9A8', opacity: 0.5}} />
            {isLoggedIn
              ? (
                <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                  <div style={{...s.userChip, width:'fit-content'}}>
                    <div style={s.userAv}>{(user?.name || 'U')[0].toUpperCase()}</div>
                    <span style={{fontSize:'.9rem',fontWeight:700,color:'#1A0A0D'}}>{user?.name}</span>
                  </div>
                  <button onClick={handleLogout} style={{...s.mLink,background:'rgba(220,38,38,0.05)',border:'none',cursor:'pointer',textAlign:'left',color:'var(--red)',width:'100%',borderRadius:12}}>
                    <span style={{display:'flex', background:'rgba(220,38,38,0.1)', padding:8, borderRadius:10}}><LogOut size={18}/></span>
                    Logout Account
                  </button>
                </div>
              )
              : (
                <div style={{display:'flex', flexDirection:'column', gap: 10}}>
                  <Link href="/login" onClick={()=>setMobileOpen(false)} className="btn btn-outline btn-lg" style={{width:'100%', borderRadius: 14}}>Login</Link>
                  <Link href="/register" onClick={()=>setMobileOpen(false)} className="btn btn-primary btn-lg" style={{width:'100%', borderRadius: 14}}>Register Free</Link>
                </div>
              )
            }
          </div>
        </div>
      )}
    </>
  )
}

const s = {
  emergency:{position:'fixed',top:0,left:0,right:0,zIndex:9999,background:'#5C1521',padding:'.35rem 0',display:'flex',alignItems:'center',justifyContent:'center',gap:8},
  eDot:{width:7,height:7,background:'#4ADE80',borderRadius:'50%',animation:'pulseDot 2s infinite',display:'inline-block'},
  nav:{position:'fixed',top:28,left:0,right:0,zIndex:9998,background:'#7B1D2E',borderBottom:'1px solid rgba(255,255,255,.12)',transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'},
  navScrolled:{top: 0, boxShadow:'0 4px 20px rgba(139,26,42,0.3)', background: '#7B1D2E'},
  inner:{display:'flex',alignItems:'center',justifyContent:'space-between',height:72},
  links:{display:'flex',alignItems:'center',gap:'2rem',listStyle:'none'},
  link:{fontSize:'.9rem',fontWeight:700,color:'#F5E6D3',textDecoration:'none',padding:'.5rem 0',borderBottom:'2.5px solid transparent',transition:'all 0.2s'},
  linkActive:{color:'#fff',borderBottomColor:'#fff'},
  actions:{display:'flex',gap:10,alignItems:'center'},
  iconBtn:{width:40,height:40,borderRadius:'50%',border:'1px solid #EDD5BE',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.1rem',position:'relative',textDecoration:'none',cursor:'pointer',transition:'all 0.2s'},
  badge:{position:'absolute',top:-2,right:-2,width:18,height:18,background:'#8B1A2A',color:'#fff',borderRadius:'50%',fontSize:'.65rem',fontWeight:800,display:'flex',alignItems:'center',justifyContent:'center',border: '2px solid #fff'},
  userChip:{display:'flex',alignItems:'center',gap:8,padding:'.4rem .8rem',background:'#fff',borderRadius:50,border:'1px solid #E8C9A8', boxShadow: 'var(--sh-sm)'},
  userAv:{width:28,height:28,borderRadius:'50%',background:'#7B1D2E',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.8rem',fontWeight:700},
  burger:{width:40,height:40,background:'rgba(255,255,255,0.15)',border:'1px solid rgba(255,255,255,0.25)',borderRadius:12,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:10, transition: 'all 0.2s', color: '#fff', fontSize: '1.2rem'},
  bl:{width:20,height:2,background:'#fff',borderRadius:2,display:'block',transition:'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'},
  mobileMenu:{position:'fixed',top:104,left:0,right:0,bottom:0,zIndex:199,background:'rgba(253,248,244,0.98)',padding:'1.5rem 0',display:'flex',flexDirection:'column',transition:'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)', overflowY: 'auto'},
  mLink:{padding:'1rem',borderRadius:16,fontSize:'1.05rem',fontWeight:700,color:'#1A0A0D',textDecoration:'none',display:'flex',gap:15,alignItems:'center', background: '#fff', border: '1px solid #EDD5BE', transition: 'all 0.2s'},
}
