import Link from 'next/link'
import { Globe, BriefcaseBusiness, Camera } from 'lucide-react'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={s.footer}>
      {/* Sticky Disclaimer Bar */}
      <div style={s.stickyDisclaimer} className="footer-sticky-disclaimer-responsive">
        Justice Junction 24/7 is a lawyer discovery platform and is not a law firm. 
        Use of this platform does not create an attorney-client relationship. 
        Information provided is for general guidance only.
      </div>

      <div className="grid-footer container" style={s.top}>
        <div style={s.brand} className="mobile-text-center">
          <Link href="/" style={{textDecoration:'none', marginBottom:'1.5rem', display:'inline-block'}}>
            <Logo color="#F5E6D3" subColor="#fff" />
          </Link>
          <p style={s.tagline} className="mobile-w-full">India's first legal platform with 100% price transparency. Connecting clients with verified lawyers — affordably, instantly, and 24/7.</p>
          <div style={{display:'flex',gap:12,marginTop:'1.5rem', justifyContent: 'inherit'}} className="show-mobile-flex-center">
            {[{k:'Twitter',i:<Globe size={18}/>},{k:'LinkedIn',i:<BriefcaseBusiness size={18}/>},{k:'Instagram',i:<Camera size={18}/>}].map(item=>(
              <div key={item.k} title={item.k} style={{width:44,height:44,borderRadius:14,background:'rgba(245,230,211,.08)',border:'1px solid rgba(245,230,211,.15)',display:'flex',alignItems:'center',justifyContent:'center',color:'#F5E6D3',cursor:'pointer',transition:'all .2s ease'}}>{item.i}</div>
            ))}
          </div>
        </div>

        {[
          ['Platform', [['/', 'Find a Lawyer'],['/search','Search Lawyers'],['/knowledge-hub','Know Your Rights'],['/knowledge-hub','Legal Guides'],['/document-generator','Document Generator'],['/join-as-lawyer','For Lawyers']]],
          ['Company', [['/about','About Us'],['/how-it-works','How It Works'],['/join-as-lawyer','Join as Advocate'],['/faq','FAQs'],['/contact','Contact Us']]],
          ['Legal', [['/privacy-policy','Privacy Policy'],['/disclaimer','Disclaimer'],['/terms','Terms of Service']]],
        ].map(([title, links]) => (
          <div key={title} className="mobile-text-center">
            <div style={s.colTitle}>{title}</div>
            <ul style={s.list}>
              {links.map(([href, label]) => (
                <li key={label}><Link href={href} style={s.footLink}>{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="container" style={{paddingBottom: '2rem'}}>
        <div style={s.divider}/>

        <div style={s.bottom}>
          <p style={{fontSize:'.78rem',color:'rgba(245,230,211,.5)'}} className="mobile-text-center">© 2025 Justice Junction 24/7. All rights reserved.</p>
          <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap', justifyContent: 'center'}}>
            <Link href="/privacy-policy" style={s.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" style={s.bottomLink}>Terms of Service</Link>
            <Link href="/disclaimer" style={s.bottomLink}>Disclaimer</Link>
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
  footer:{background:'#6B1220',padding:'5rem 5vw 2rem',color:'#F5E6D3', position:'relative'},
  stickyDisclaimer: { position:'fixed', bottom:0, left:0, right:0, background:'rgba(107,18,32,0.97)', color:'#F5E6D3', padding:'.6rem 1.5rem', fontSize:'.72rem', textAlign:'center', zIndex:1000, boxShadow:'0 -2px 10px rgba(0,0,0,0.2)', fontWeight:600, borderTop:'1px solid #8B1A2A' },
  top:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem'},
  brand:{},
  tagline: {fontSize:'.88rem',lineHeight:1.7,maxWidth:320,color:'rgba(245,230,211,.7)', margin: '0 auto'},
  colTitle:{fontSize:'.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:'#fff',marginBottom:'1rem'},
  list:{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'},
  footLink:{fontSize:'.82rem',color:'#F5E6D3',textDecoration:'none',transition:'color .2s'},
  divider:{border:'none',borderTop:'1px solid #8B1A2A',margin:'0 0 1.5rem'},
  bottom:{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem', paddingBottom:'2rem'},
  bottomLink: {fontSize:'.75rem',color:'rgba(245,230,211,.5)',textDecoration:'none'},
}
