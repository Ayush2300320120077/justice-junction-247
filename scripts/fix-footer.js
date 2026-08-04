const fs = require('fs')

let code = fs.readFileSync('src/components/Footer.jsx', 'utf8')

code = code.replace(
  "  footer:{background:'#0F2444',padding:'5rem 5vw 2rem',color:'#CBD5E1', position:'relative'},",
  "  footer:{background:'#060E1A',padding:'5rem 5vw 2rem',color:'#A0A8B8', position:'relative'},"
)

code = code.replace(
  "  footLink:{fontSize:'.82rem',color:'#94A3B8',textDecoration:'none',transition:'color .2s'},",
  "  footLink:{fontSize:'.82rem',color:'#A0A8B8',textDecoration:'none',transition:'color .2s'},"
)

code = code.replace(
  "            <Logo color=\"#fff\" />",
  "            <Logo color=\"#C9A84C\" />"
)

code = code.replace(
  "  stickyDisclaimer: { position:'fixed', bottom:0, left:0, right:0, background:'var(--brand-primary)', color:'#fff', padding:'.6rem 1.5rem', fontSize:'.72rem', textAlign:'center', zIndex:1000, boxShadow:'0 -2px 10px rgba(0,0,0,0.3)', fontWeight:600 },",
  "  stickyDisclaimer: { position:'fixed', bottom:0, left:0, right:0, background:'rgba(11,22,40,0.95)', color:'#F5F0E8', padding:'.6rem 1.5rem', fontSize:'.72rem', textAlign:'center', zIndex:1000, boxShadow:'0 -2px 10px rgba(0,0,0,0.3)', fontWeight:600, borderTop:'1px solid rgba(201,168,76,0.2)' },"
)

fs.writeFileSync('src/components/Footer.jsx', code)
console.log('footer done')
