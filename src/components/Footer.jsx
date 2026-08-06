import { Link } from 'react-router-dom'
import { Globe, BriefcaseBusiness, Camera } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={s.footer}>
      <style>{`.foot-link:hover { color: #fff !important; }`}</style>

      <div className="grid-footer container" style={s.top}>
        <div style={s.brand} className="mobile-text-center">
          <Link to="/" style={{textDecoration:'none', marginBottom:'1.5rem', display:'inline-block'}}>
            <Logo color="#F5E6D3" subColor="#fff" />
          </Link>
          <p style={s.tagline} className="mobile-w-full">India's first legal platform with 100% price transparency. Connecting clients with verified lawyers — affordably, instantly, and 24/7.</p>
          <div style={{display:'flex',gap:12,marginTop:'1.5rem', justifyContent: 'inherit'}}>
            {[{k:'Twitter',i:<Globe size={18}/>},{k:'LinkedIn',i:<BriefcaseBusiness size={18}/>},{k:'Instagram',i:<Camera size={18}/>}].map(item=>(
              <div key={item.k} title={item.k} style={{width:44,height:44,borderRadius:14,background:'rgba(245,230,211,.08)',border:'1px solid rgba(245,230,211,.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#F5E6D3',cursor:'pointer',transition:'all .2s ease'}}>{item.i}</div>
            ))}
          </div>
        </div>

        {[
          ['Platform', [['/', 'Find a Lawyer'],['/search','Search Lawyers'],['/knowledge-hub','Know Your Rights'],['/knowledge-hub','Legal Guides'],['/document-generator','Document Generator'],['/join-as-lawyer','For Lawyers']]],
          ['Company', [['/about','About Us'],['/join-as-lawyer','Join as Advocate'],['/contact','Contact Us']]],
          ['Legal', [['/privacy-policy','Privacy Policy'],['/disclaimer','Disclaimer'],['/terms','Terms of Service']]],
        ].map(([title, links]) => (
          <div key={title} className="mobile-text-center">
            <div style={s.colTitle}>{title}</div>
            <ul style={s.list}>
              {links.map(([to, label]) => (
                <li key={label}><Link to={to} style={s.footLink} className="foot-link">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container" style={{paddingBottom: '2rem'}}>
        <div style={s.divider}/>

        <div style={s.bottom}>
          <p style={{fontSize:'.78rem',color:'rgba(245,230,211,.5)'}} className="mobile-text-center">
            © 2025 Justice Junction 24/7. All rights reserved.
          </p>
          <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap', justifyContent: 'center'}} className="footer-bottom-links">
            <Link to="/privacy-policy" style={s.bottomLink}>Privacy Policy</Link>
            <Link to="/terms" style={s.bottomLink}>Terms of Service</Link>
            <Link to="/disclaimer" style={s.bottomLink}>Disclaimer</Link>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8, justifyContent: 'center'}}>
            <span style={{fontSize:'.72rem',color:'rgba(245,230,211,.5)'}}>Payments secured by</span>
            <span style={{fontSize:'.78rem',fontWeight:800,color:'#8B1A2A',background:'#fff',padding:'3px 10px',borderRadius:'50px'}}>Razorpay</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer:{background:'#1A0D10',padding:'4rem 0 2rem',color:'#F5C4B3', position:'relative'},
  top:{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))',gap:'2.5rem',marginBottom:'3rem'},
  brand:{},
  tagline: {fontSize:'.88rem',lineHeight:1.7,maxWidth:320,color:'#F5C4B3', margin: '0 auto'},
  colTitle:{fontSize:'.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:'#F9EEE4',marginBottom:'1rem'},
  list:{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'},
  footLink:{fontSize:'.82rem',color:'#F5C4B3',textDecoration:'none',transition:'color .2s'},
  divider:{border:'none',borderTop:'1px solid rgba(245,196,179,0.2)',margin:'0 0 1.5rem'},
  bottom:{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem', paddingBottom:'2rem'},
  bottomLink: {fontSize:'.75rem',color:'rgba(245,196,179,.7)',textDecoration:'none'},
}
