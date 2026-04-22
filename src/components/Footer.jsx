import { Link } from 'react-router-dom'
import { Scale } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <div className="grid-footer" style={s.top}>
        <div style={s.brand}>
          <Link to="/" style={s.logo}>
            <div style={s.logoIcon}><Scale size={20}/></div>
            <div>
              <div style={s.logoText}>Justice Junction</div>
              <div style={s.logoSub}>Available 24 / 7</div>
            </div>
          </Link>
          <p style={s.tagline}>India's first legal platform with 100% price transparency. Connecting clients with verified lawyers — affordably, instantly, and 24/7.</p>
          <div style={{display:'flex',gap:10,marginTop:'1.2rem'}}>
            {['Twitter','LinkedIn','Instagram'].map(s=>(
              <div key={s} style={{width:34,height:34,borderRadius:'50%',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'.75rem',color:'rgba(255,255,255,.5)',cursor:'pointer'}}>{s[0]}</div>
            ))}
          </div>
        </div>

        {[
          ['Platform', [['/', 'Find a Lawyer'],['/search','Search Lawyers'],['/lawyer-plans','For Lawyers'],['/about','How It Works'],['/pricing','Pricing']]],
          ['Practice Areas', [['/search?specialization=Criminal Defence','Criminal Defence'],['/search?specialization=Family Law','Family Law'],['/search?specialization=Property Law','Property Law'],['/search?specialization=Corporate Law','Corporate Law'],['/search?specialization=Consumer Rights','Consumer Rights']]],
          ['Company', [['#','About Us'],['#','Blog'],['#','Careers'],['#','Press'],['#','Privacy Policy'],['#','Terms of Service'],['#','Contact Us']]],
        ].map(([title, links]) => (
          <div key={title}>
            <div style={s.colTitle}>{title}</div>
            <ul style={s.list}>
              {links.map(([href, label]) => (
                <li key={label}><Link to={href} style={s.footLink}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={s.divider}/>

      <div style={s.bottom}>
        <p style={{fontSize:'.78rem',color:'rgba(255,255,255,.4)'}}>© 2025 Justice Junction 24/7. All rights reserved. CIN: U74999XX2025PTC000000</p>
        <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap'}}>
          {['Privacy Policy','Terms of Service','Cookie Policy','Disclaimer'].map(l=>(
            <a key={l} href="#" style={{fontSize:'.75rem',color:'rgba(255,255,255,.4)',textDecoration:'none'}}>{l}</a>
          ))}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8}}>
          <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.35)'}}>Payments secured by</span>
          <span style={{fontSize:'.78rem',fontWeight:800,color:'#528FF0'}}>Razorpay</span>
        </div>
      </div>

      <div style={s.disclaimer}>
        <strong>Disclaimer:</strong> Justice Junction is a technology platform that connects clients with independent advocates. We do not provide legal advice. All legal services are provided by independent advocates registered with the Bar Council of India. Please verify your lawyer's credentials independently before engaging their services.
      </div>
    </footer>
  )
}

const s = {
  footer:{background:'#1A0F0A',padding:'5rem 5vw 2rem',color:'rgba(255,255,255,.6)'},
  top:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem'},
  brand:{},
  logo:{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginBottom:'1rem'},
  logoIcon:{width:36,height:36,background:'var(--bur)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.1rem'},
  logoText:{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:700,color:'#fff',lineHeight:1.1},
  logoSub:{fontSize:'.56rem',fontWeight:700,color:'var(--gold)',letterSpacing:'.12em',textTransform:'uppercase'},
  tagline:{fontSize:'.82rem',lineHeight:1.75,maxWidth:250,color:'rgba(255,255,255,.45)'},
  colTitle:{fontSize:'.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:'rgba(255,255,255,.8)',marginBottom:'1rem'},
  list:{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'},
  footLink:{fontSize:'.82rem',color:'rgba(255,255,255,.4)',textDecoration:'none',transition:'color .2s'},
  divider:{border:'none',borderTop:'1px solid rgba(255,255,255,.07)',margin:'0 0 1.5rem'},
  bottom:{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem'},
  disclaimer:{marginTop:'1.5rem',padding:'1rem 1.2rem',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:8,fontSize:'.73rem',color:'rgba(255,255,255,.3)',lineHeight:1.7},
}
