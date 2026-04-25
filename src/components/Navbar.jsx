import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { Scale, Heart, Home, Search, Shield, LayoutDashboard, Briefcase, Info, LogOut, BookOpen, FileText } from 'lucide-react'

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
      <div style={s.emergency}>
        <span style={s.eDot}></span>
        <span className="hide-mobile" style={{fontSize:'.75rem',fontWeight:700,color:'#fff'}}>Emergency Legal Help Available 24/7 - </span>
        <span className="show-mobile-inline" style={{fontSize:'.75rem',fontWeight:700,color:'#fff'}}>Legal Help 24/7 - </span>
        <Link href="/search" style={{fontSize:'.75rem',color:'#E8B55A',fontWeight:700,marginLeft:4}}>Find a Lawyer Now →</Link>
      </div>

      {/* Main nav */}
      <nav style={{...s.nav,...(scrolled?s.navScrolled:{})}}>
        <div style={s.inner}>
          <Link href="/" style={s.logo}>
            <div style={s.logoIcon}><Scale size={20}/></div>
            <div>
              <div style={s.logoText}>Justice Junction</div>
              <div style={s.logoSub}>Available 24 / 7</div>
            </div>
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

          <div style={s.actions}>
            <Link href="/favorites" style={s.iconBtn} title="Saved Lawyers">
              <span style={{display:'flex',color:'var(--txt-3)'}}><Heart size={18}/></span>
              {favCount > 0 && <span style={s.badge}>{favCount}</span>}
            </Link>

            {isLoggedIn ? (
              <>
                <div style={s.userChip} className="hide-mobile">
                  <div style={s.userAv}>{(user?.name || 'U')[0].toUpperCase()}</div>
                  <span style={{fontSize:'.85rem',fontWeight:700}}>{user?.name?.split(' ')[0]}</span>
                </div>
                {user?.role === 'admin' ? (
                  <Link href="/admin" className="btn btn-outline btn-sm hide-mobile" style={{borderColor:'#ca8a04',color:'#ca8a04'}}>Admin Panel</Link>
                ) : (
                  <Link href="/dashboard" className="btn btn-outline btn-sm hide-mobile">Dashboard</Link>
                )}
                <button className="btn btn-ghost btn-sm hide-mobile" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link href="/login"    className="btn btn-ghost btn-sm hide-mobile">Login</Link>
                <Link href="/register" className="btn btn-primary btn-sm">Register Free</Link>
              </>
            )}

            <button style={s.burger} onClick={() => setMobileOpen(o => !o)}>
              <span style={{...s.bl,...(mobileOpen?{transform:'rotate(45deg) translate(5px,5px)'}:{})}}/>
              <span style={{...s.bl,...(mobileOpen?{opacity:0}:{}),margin:'4px 0'}}/>
              <span style={{...s.bl,...(mobileOpen?{transform:'rotate(-45deg) translate(5px,-5px)'}:{})}}/>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={s.mobileMenu}>
          {[
            ['/', <Home size={18}/>, 'Home'],
            ['/search', <Search size={18}/>, 'Find Lawyers'],
            ['/knowledge-hub', <BookOpen size={18}/>, 'Knowledge Hub'],
            ['/document-generator', <FileText size={18}/>, 'Legal Tools'],
            user?.role === 'admin' ? ['/admin', <Shield size={18}/>, 'Admin Panel'] : ['/dashboard', <LayoutDashboard size={18}/>, 'Dashboard'],
            ['/join-as-lawyer', <Briefcase size={18}/>, 'Join as Lawyer'],
            ['/favorites', <Heart size={18}/>, 'Saved'],
          ].map(([p, i, l]) => (
            <Link key={p} href={p} style={s.mLink} onClick={() => setMobileOpen(false)}><span style={{color:'var(--bur)',display:'flex'}}>{i}</span>{l}</Link>
          ))}
          <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'4px 0'}}/>
          {isLoggedIn
            ? <button onClick={handleLogout} style={{...s.mLink,background:'none',border:'none',cursor:'pointer',textAlign:'left',color:'var(--red)',fontFamily:'Plus Jakarta Sans,sans-serif',width:'100%',fontSize:'.9rem',fontWeight:700}}><span style={{display:'flex'}}><LogOut size={18}/></span>Logout</button>
            : <Link href="/register" className="btn btn-primary" style={{margin:'4px 0',width:'100%',justifyContent:'center'}}>Register Free</Link>
          }
        </div>
      )}
    </>
  )
}

const s = {
  emergency:{position:'fixed',top:0,left:0,right:0,zIndex:201,background:'var(--bur)',padding:'.28rem 5vw',display:'flex',alignItems:'center',justifyContent:'center',gap:8},
  eDot:{width:7,height:7,background:'#4ADE80',borderRadius:'50%',animation:'pulseDot 2s infinite',display:'inline-block'},
  nav:{position:'fixed',top:28,left:0,right:0,zIndex:200,background:'rgba(253,248,242,.96)',backdropFilter:'blur(16px)',borderBottom:'1px solid rgba(232,216,200,.6)',padding:'0 5vw',transition:'all .3s'},
  navScrolled:{boxShadow:'0 4px 24px rgba(123,29,46,.10)'},
  inner:{display:'flex',alignItems:'center',justifyContent:'space-between',height:64},
  logo:{display:'flex',alignItems:'center',gap:10,textDecoration:'none'},
  logoIcon:{width:36,height:36,background:'var(--bur)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.1rem',boxShadow:'0 2px 8px rgba(123,29,46,.3)'},
  logoText:{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:700,color:'var(--bur)',lineHeight:1.1},
  logoSub:{fontSize:'.56rem',fontWeight:700,color:'var(--gold)',letterSpacing:'.12em',textTransform:'uppercase'},
  links:{display:'flex',alignItems:'center',gap:'1.8rem',listStyle:'none'},
  link:{fontSize:'.88rem',fontWeight:700,color:'var(--txt-2)',textDecoration:'none',padding:'.2rem 0',borderBottom:'2px solid transparent',transition:'all .2s'},
  linkActive:{color:'var(--bur)',borderBottomColor:'var(--bur)'},
  actions:{display:'flex',gap:8,alignItems:'center'},
  iconBtn:{width:36,height:36,borderRadius:'50%',border:'1px solid var(--border)',background:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',position:'relative',textDecoration:'none',cursor:'pointer'},
  badge:{position:'absolute',top:-4,right:-4,width:16,height:16,background:'var(--bur)',color:'#fff',borderRadius:'50%',fontSize:'.6rem',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center'},
  userChip:{display:'flex',alignItems:'center',gap:6,padding:'.3rem .7rem',background:'var(--cream-2)',borderRadius:50,border:'1px solid var(--border)'},
  userAv:{width:26,height:26,borderRadius:'50%',background:'var(--bur)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',fontWeight:700},
  burger:{width:36,height:36,background:'var(--cream-2)',border:'1px solid var(--border)',borderRadius:8,cursor:'pointer',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:8},
  bl:{width:18,height:2,background:'var(--txt)',borderRadius:2,display:'block',transition:'all .3s ease'},
  mobileMenu:{position:'fixed',top:92,left:0,right:0,zIndex:199,background:'#fff',borderBottom:'1px solid var(--border)',padding:'1rem 5vw',display:'flex',flexDirection:'column',gap:4,boxShadow:'var(--sh-lg)',animation:'slideUp .2s ease'},
  mLink:{padding:'.75rem 1rem',borderRadius:10,fontSize:'.9rem',fontWeight:700,color:'var(--txt)',textDecoration:'none',display:'flex',gap:10,alignItems:'center'},
}
