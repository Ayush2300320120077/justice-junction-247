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
            <Logo color="#fff" />
          </Link>
          <p style={s.tagline} className="mobile-w-full">India's first legal platform with 100% price transparency. Connecting clients with verified lawyers — affordably, instantly, and 24/7.</p>
          <div style={{display:'flex',gap:12,marginTop:'1.5rem', justifyContent: 'inherit'}} className="show-mobile-flex-center">
            {[{k:'Twitter',i:<Globe size={18}/>},{k:'LinkedIn',i:<BriefcaseBusiness size={18}/>},{k:'Instagram',i:<Camera size={18}/>}].map(item=>(
              <div key={item.k} title={item.k} style={{width:44,height:44,borderRadius:14,background:'rgba(255,255,255,.05)',border:'1px solid rgba(255,255,255,.1)',display:'flex',alignItems:'center',justifyContent:'center',color:'rgba(255,255,255,.8)',cursor:'pointer',transition:'all .2s ease'}}>
                {item.i}
              </div>
            ))}
          </div>
        </div>

        {[
          ['Platform', [['/', 'Find a Lawyer'],['/search','Search Lawyers'],['/knowledge-hub','Know Your Rights'],['/rights','Legal Guides'],['/document-generator','Document Generator'],['/lawyer-plans','For Lawyers']]],
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
          <p style={{fontSize:'.78rem',color:'rgba(255,255,255,.4)'}} className="mobile-text-center">© 2025 Justice Junction 24/7. All rights reserved. CIN: U74999XX2025PTC000000</p>
          <div style={{display:'flex',gap:'1.5rem',flexWrap:'wrap', justifyContent: 'center'}}>
            <Link href="/privacy-policy" style={s.bottomLink}>Privacy Policy</Link>
            <Link href="/terms" style={s.bottomLink}>Terms of Service</Link>
            <Link href="/disclaimer" style={s.bottomLink}>Disclaimer</Link>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8, justifyContent: 'center'}}>
            <span style={{fontSize:'.72rem',color:'rgba(255,255,255,.35)'}}>Payments secured by</span>
            <span style={{fontSize:'.78rem',fontWeight:800,color:'#528FF0'}}>Razorpay</span>
          </div>
        </div>

        <div style={s.footerDisclaimer} className="text-balance mobile-text-center">
          <strong>Disclaimer:</strong> Justice Junction is a technology platform that connects clients with independent advocates. We do not provide legal advice. All legal services are provided by independent advocates registered with the Bar Council of India. Please verify your lawyer's credentials independently before engaging their services.
        </div>
      </div>
    </footer>
  )
}

const s = {
  footer:{background:'#1A0F0A',padding:'5rem 5vw 2rem',color:'rgba(255,255,255,.6)', position:'relative'},
  stickyDisclaimer: { position:'fixed', bottom:0, left:0, right:0, background:'var(--bur)', color:'#fff', padding:'.6rem 1.5rem', fontSize:'.72rem', textAlign:'center', zIndex:1000, boxShadow:'0 -2px 10px rgba(0,0,0,0.3)', fontWeight:600 },
  top:{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'3rem',marginBottom:'3rem'},
  brand:{},
  logo:{display:'flex',alignItems:'center',gap:10,textDecoration:'none',marginBottom:'1rem'},
  logoIcon:{width:36,height:36,background:'var(--bur)',borderRadius:9,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'1.1rem'},
  logoText:{fontFamily:"'Playfair Display',serif",fontSize:'1.1rem',fontWeight:700,color:'#fff',lineHeight:1.1},
  logoSub: {fontSize:'.56rem',fontWeight:700,color:'var(--gold)',letterSpacing:'.12em',textTransform:'uppercase'},
  tagline: {fontSize:'.88rem',lineHeight:1.7,maxWidth:320,color:'rgba(255,255,255,.5)', margin: '0 auto'},
  colTitle:{fontSize:'.72rem',fontWeight:800,textTransform:'uppercase',letterSpacing:'.1em',color:'rgba(255,255,255,.8)',marginBottom:'1rem'},
  list:{listStyle:'none',display:'flex',flexDirection:'column',gap:'.55rem'},
  footLink:{fontSize:'.82rem',color:'rgba(255,255,255,.4)',textDecoration:'none',transition:'color .2s'},
  divider:{border:'none',borderTop:'1px solid rgba(255,255,255,.07)',margin:'0 0 1.5rem'},
  bottom:{display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:'1rem', paddingBottom:'2rem'},
  bottomLink: {fontSize:'.75rem',color:'rgba(255,255,255,.4)',textDecoration:'none'},
  footerDisclaimer:{marginTop:'1.5rem',padding:'1rem 1.2rem',background:'rgba(255,255,255,.04)',border:'1px solid rgba(255,255,255,.07)',borderRadius:8,fontSize:'.73rem',color:'rgba(255,255,255,.3)',lineHeight:1.7},
}
