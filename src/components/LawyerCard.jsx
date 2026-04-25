import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Heart, Scale, MapPin, Landmark, CircleCheck } from 'lucide-react'

const COLORS=['#7B1D2E','#2D7A4F','#C9943A','#1D4ED8','#991B1B','#5B21B6','#0F766E','#9D174D']
const avatarColor=n=>{let h=0;for(let c of n)h+=c.charCodeAt(0);return COLORS[h%COLORS.length]}
const initials=n=>(n||'?').split(' ').slice(0,2).map(p=>p[0]).join('').toUpperCase()
const stars=r=>{const n=Math.round(r);return'★'.repeat(n)+'☆'.repeat(5-n)}
const levelMap={senior:'badge-senior',mid:'badge-mid',junior:'badge-junior'}

export default function LawyerCard({ lawyer, onCompare, compareList=[] }) {
  const { isLoggedIn } = useAuth()
  const router = useRouter()
  const { showToast } = useToast()
  const [hovered, setHovered] = useState(false)
  const color = avatarColor(lawyer.name)

  const [isFav, setIsFav] = useState(false)

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('jj_favorites')||'[]')
    setIsFav(favs.includes(lawyer._id))
  }, [lawyer._id])

  const toggleFav = (e) => {
    e.stopPropagation()
    const favs = JSON.parse(localStorage.getItem('jj_favorites')||'[]')
    const updated = isFav ? favs.filter(id=>id!==lawyer._id) : [...favs, lawyer._id]
    localStorage.setItem('jj_favorites', JSON.stringify(updated))
    setIsFav(!isFav)
    showToast(isFav ? 'Removed from saved lawyers' : 'Saved to favorites!', isFav?'info':'success')
    window.dispatchEvent(new Event('favoritesUpdated'))
  }

  const handleBook = (e) => {
    e.stopPropagation()
    if (!isLoggedIn) { router.push('/login'); return }
    router.push(`/book?lawyerId=${lawyer._id}&lawyerName=${encodeURIComponent(lawyer.name)}&fee=${lawyer.consultationFee}`)
  }

  const inCompare = compareList.includes(lawyer._id)

  return (
    <div
      style={{...s.card,...(hovered?s.cardHovered:{})}}
      onMouseEnter={()=>setHovered(true)}
      onMouseLeave={()=>setHovered(false)}
      onClick={() => router.push(`/lawyer/${lawyer._id}`)}
    >
      {/* Avatar + Info */}
      <div style={s.top}>
        <div style={{position:'relative'}}>
          <div style={{...s.avatar,background:color+'22',color}}>
            {initials(lawyer.name)}
          </div>
          {lawyer.isAvailable && <div style={s.onlineDot} title="Available now"/>}
        </div>
        <div style={{flex:1,minWidth:0}}>
          <div style={s.name}>{lawyer.name}</div>
          <div style={s.spec}>{(lawyer.specializations||[]).slice(0,2).join(' · ')}</div>
          <div style={s.ratingRow}>
            <span style={{color:'var(--gold)',fontSize:'0.75rem'}}>{stars(lawyer.averageRating||0)}</span>
            <span style={{fontWeight:700,fontSize:'0.78rem'}}>{(lawyer.averageRating||0).toFixed(1)}</span>
            <span style={{fontSize:'0.72rem',color:'var(--text-light)'}}>({lawyer.totalReviews||0})</span>
          </div>
        </div>
        
        <div style={{display:'flex', flexDirection:'row', alignItems:'center', gap:'6px', flexShrink:0}}>
          <span className={`badge ${levelMap[lawyer.experienceLevel||'junior']}`}>
            {lawyer.experienceLevel}
          </span>
          <div style={s.topActions}>
            <button onClick={toggleFav} style={{...s.actionBtn,...(isFav?s.favActive:{})}} title={isFav?'Remove from saved':'Save lawyer'}>
              <Heart size={15} fill={isFav ? 'currentColor' : 'none'} />
            </button>
            {onCompare && (
              <button onClick={(e)=>{e.stopPropagation();onCompare(lawyer._id)}} style={{...s.actionBtn,...(inCompare?s.compareActive:{})}} title="Compare">
                <Scale size={15} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Location + Exp */}
      <div style={s.meta}>
        <span style={s.metaItem}><MapPin size={13} /> {lawyer.city}, {lawyer.state}</span>
        <span style={s.metaItem}><Landmark size={13} /> {lawyer.experience} yrs exp</span>
      </div>

      {/* Tags */}
      <div style={s.tags}>
        {(lawyer.specializations||[]).slice(0,3).map(t=>(
          <span key={t} className="tag">{t}</span>
        ))}
      </div>

      {/* Rating bar */}
      <div style={{padding:'0 1.2rem 0.8rem'}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.72rem',color:'var(--text-muted)',marginBottom:4}}>
          <span>Client Satisfaction</span>
          <span>{Math.round((lawyer.averageRating||0)/5*100)}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{width:`${Math.round((lawyer.averageRating||0)/5*100)}%`}}/>
        </div>
      </div>

      {/* Footer */}
      <div style={s.footer}>
        <div>
          <div className="num-display" style={s.price}>₹{(lawyer.consultationFee||0).toLocaleString()}</div>
          <div style={s.priceUnit}>per consultation</div>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          {lawyer.isAvailable
            ? <span style={s.available}><CircleCheck size={12}/> Available</span>
            : <span style={s.unavailable}>Busy</span>
          }
          <button className="btn btn-primary btn-sm" onClick={handleBook}>Book Now</button>
        </div>
      </div>

      {/* Hover detail strip */}
      {hovered && lawyer.bio && (
        <div style={s.bioStrip}>
          <span style={{fontSize:'0.78rem',color:'var(--text-muted)',fontStyle:'italic'}}>"{lawyer.bio.slice(0,90)}{lawyer.bio.length>90?'...':''}"</span>
        </div>
      )}
    </div>
  )
}

const s={
  card:{background:'#fff',border:'1px solid var(--border)',borderRadius:'var(--radius-lg)',overflow:'hidden',transition:'all 0.3s cubic-bezier(0.4,0,0.2,1)',position:'relative'},
  cardHovered:{transform:'translateY(-5px)',boxShadow:'var(--shadow-lg)',borderColor:'var(--border-strong)'},
  topActions:{display:'flex',gap:6},
  actionBtn:{width:30,height:30,borderRadius:'50%',border:'1px solid var(--border)',background:'#fff',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.85rem',transition:'all 0.2s',color:'var(--txt-3)'},
  favActive:{background:'var(--red-l)',borderColor:'#FECACA',color:'var(--red)'},
  compareActive:{background:'rgba(123,29,46,0.08)',borderColor:'var(--burgundy)',color:'var(--burgundy)'},
  top:{padding:'1.2rem 1.2rem 0.6rem',display:'flex',gap:10,alignItems:'flex-start'},
  avatar:{width:50,height:50,borderRadius:12,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Playfair Display',serif",fontSize:'1.15rem',fontWeight:700,flexShrink:0},
  onlineDot:{position:'absolute',bottom:0,right:0,width:10,height:10,background:'var(--green)',borderRadius:'50%',border:'2px solid #fff'},
  name:{fontWeight:700,fontSize:'0.93rem',marginBottom:1,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'},
  spec:{fontSize:'0.76rem',color:'var(--text-muted)',marginBottom:3},
  ratingRow:{display:'flex',alignItems:'center',gap:4},
  meta:{display:'flex',gap:12,padding:'0 1.2rem 0.6rem',flexWrap:'wrap'},
  metaItem:{fontSize:'0.74rem',color:'var(--text-light)',display:'flex',alignItems:'center',gap:3},
  tags:{display:'flex',gap:4,flexWrap:'wrap',padding:'0 1.2rem 0.8rem'},
  footer:{padding:'0.9rem 1.2rem',borderTop:'1px solid var(--border)',display:'flex',justifyContent:'space-between',alignItems:'center'},
  price:{fontFamily:"'Playfair Display',serif",fontSize:'1.2rem',fontWeight:700,color:'var(--burgundy)',lineHeight:1},
  priceUnit:{fontSize:'0.7rem',color:'var(--text-muted)'},
  available:{fontSize:'0.72rem',color:'var(--green)',fontWeight:700,display:'inline-flex',alignItems:'center',gap:3},
  unavailable:{fontSize:'0.72rem',color:'var(--text-light)',fontWeight:600},
  bioStrip:{padding:'0.7rem 1.2rem',background:'var(--gold-pale)',borderTop:'1px solid rgba(201,148,58,0.15)',animation:'slideUp 0.2s ease'},
}
