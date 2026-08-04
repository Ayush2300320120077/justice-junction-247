const fs = require('fs')

let code = fs.readFileSync('src/pages/index.jsx', 'utf8')

// Fix styles object
code = code.replace(
  "  heroBgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundImage: 'url(\"/hero-bg.png\")', backgroundSize: 'cover', backgroundPosition: 'center' },\r\n  heroGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(253,248,242,0.95), rgba(253,248,242,0.4))', zIndex: 1 },\r\n  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(238,243,251,0.8), transparent 70%)', zIndex: 2 },",
  "  heroBgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundImage: 'url(\"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80\")', backgroundSize: 'cover', backgroundPosition: 'center' },\r\n  heroGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,22,40,0.92) 0%, rgba(15,32,64,0.85) 100%)', zIndex: 1 },\r\n  heroOverlay: { display: 'none' },"
)

code = code.replace(
  "  searchBox: { background: '#fff', padding: '8px', borderRadius: '16px', boxShadow: '0 2px 20px rgba(0,0,0,0.08)', border: '1px solid var(--border)', maxWidth: 750 },",
  "  searchBox: { background: 'rgba(255,255,255,0.04)', padding: '8px', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.4)', border: '1px solid rgba(201,168,76,0.15)', maxWidth: 750 },"
)

code = code.replace(
  "  trustBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(123,29,46,.06)', border: '1px solid rgba(123,29,46,.12)', borderRadius: 50, padding: '.4rem 1.2rem', marginBottom: '2rem', backdropFilter:'blur(4px)' },",
  "  trustBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,.06)', border: '1px solid rgba(201,168,76,.12)', borderRadius: 50, padding: '.4rem 1.2rem', marginBottom: '2rem', backdropFilter:'blur(4px)' },"
)

code = code.replace(
  "  statsSection: { background: '#fff', padding: '5rem 0' },\r\n  statsGrid: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },\r\n  statItem: { textAlign: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px 40px', minWidth: 160 },",
  "  statsSection: { background: 'var(--cream-2)', padding: '5rem 0' },\r\n  statsGrid: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },\r\n  statItem: { textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', padding: '20px 40px', minWidth: 160 },"
)

code = code.replace(
  "  finalCta: { padding: '8rem 0', background: 'linear-gradient(rgba(42,22,32,0.95), rgba(123,29,46,0.98)), url(\"/hero-bg.png\")', backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff' },\r\n  ctaTitle: { fontFamily: \"'Playfair Display',serif\", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem' },\r\n  ctaSub: { fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' },",
  "  finalCta: { padding: '8rem 0', background: 'linear-gradient(135deg, rgba(11,22,40,0.95), rgba(15,32,64,0.95)), url(\"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80\")', backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff' },\r\n  ctaTitle: { fontFamily: \"'Playfair Display',serif\", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--txt)' },\r\n  ctaSub: { fontSize: '1.2rem', color: 'var(--txt-2)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' },"
)

// Process Section
code = code.replace(
  "      <section style={{padding:'7rem 5vw',background:'#fff'}} className=\"section-bg-abstract\">",
  "      <section style={{padding:'7rem 5vw',background:'var(--brand-primary)'}}>"
)

code = code.replace(
  "          <h2 className=\"sec-title\" style={{textAlign:'center'}}>Get legal help in <em>4 easy steps.</em></h2>",
  "          <h2 className=\"sec-title\" style={{textAlign:'center', color: 'var(--txt)'}}>Get legal help in <em style={{color:'var(--brand-accent)'}}>4 easy steps.</em></h2>"
)

code = code.replace(
  "            <div key={item.title} className=\"card card-hover magnetic-hover\" style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>\r\n              <div style={{position:'absolute',top:20,left:20,width:28,height:28,background:'var(--brand-primary)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.8rem',fontWeight:800}}>0{i+1}</div>\r\n              <div style={{color:'var(--brand-primary)',marginBottom:16,display:'flex',justifyContent:'center'}}>{item.i}</div>\r\n              <h3 style={{fontFamily:\"'Playfair Display',serif\",fontSize:'1.3rem',marginBottom:12}}>{item.title}</h3>\r\n              <p style={{fontSize:'.9rem',color:'var(--txt-3)',lineHeight:1.7}}>{item.desc}</p>\r\n            </div>",
  "            <div key={item.title} className=\"card card-hover magnetic-hover\" style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>\r\n              <div style={{position:'absolute',top:10,left:20,fontSize:'4rem',fontWeight:800,color:'rgba(201,168,76,0.1)',lineHeight:1}}>0{i+1}</div>\r\n              <div style={{color:'var(--brand-accent)',marginBottom:16,display:'flex',justifyContent:'center', position:'relative'}}>{item.i}</div>\r\n              <h3 style={{fontFamily:\"'Playfair Display',serif\",fontSize:'1.3rem',marginBottom:12, color:'var(--txt)', position:'relative'}}>{item.title}</h3>\r\n              <p style={{fontSize:'.9rem',color:'var(--txt-3)',lineHeight:1.7, position:'relative'}}>{item.desc}</p>\r\n            </div>"
)

// Testimonials Section
code = code.replace(
  "      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>\r\n        <div style={{textAlign:'center',marginBottom:'4rem'}}>\r\n          <div className=\"sec-label\" style={{justifyContent:'center'}}>Testimonials</div>\r\n          <h2 className=\"sec-title\" style={{textAlign:'center'}}>Trusted by <em>thousands across India.</em></h2>",
  "      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>\r\n        <div style={{textAlign:'center',marginBottom:'4rem'}}>\r\n          <div className=\"sec-label\" style={{justifyContent:'center'}}>Testimonials</div>\r\n          <h2 className=\"sec-title\" style={{textAlign:'center', color: 'var(--txt)'}}>Trusted by <em style={{color:'var(--brand-accent)'}}>thousands across India.</em></h2>"
)

code = code.replace(
  "            <div key={t.name} style={{padding:'2.5rem', background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', borderLeft:'4px solid var(--brand-primary)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>\r\n              <div style={{color:'var(--brand-accent)',marginBottom:16,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>\r\n              <p style={{fontFamily:\"'Plus Jakarta Sans',sans-serif\",fontSize:'1.05rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'2rem', color:'var(--txt)'}}>\"{t.text}\"</p>\r\n              <div style={{display:'flex',gap:12,alignItems:'center'}}>\r\n                <div style={{width:44,height:44,borderRadius:'50%',background:'var(--brand-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#fff'}}>{t.init}</div>\r\n                <div><div style={{fontWeight:800,fontSize:'.95rem'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div></div>\r\n              </div>\r\n            </div>",
  "            <div key={t.name} style={{padding:'2.5rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:'16px', borderLeft:'4px solid var(--brand-accent)', boxShadow:'0 4px 24px rgba(0,0,0,0.4)'}}>\r\n              <div style={{color:'var(--brand-accent)',marginBottom:16,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>\r\n              <p style={{fontFamily:\"'Plus Jakarta Sans',sans-serif\",fontSize:'1.05rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'2rem', color:'var(--txt)'}}>\"{t.text}\"</p>\r\n              <div style={{display:'flex',gap:12,alignItems:'center'}}>\r\n                <div style={{width:44,height:44,borderRadius:'50%',background:'var(--brand-accent)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#0B1628'}}>{t.init}</div>\r\n                <div><div style={{fontWeight:800,fontSize:'.95rem', color:'var(--txt)'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div></div>\r\n              </div>\r\n            </div>"
)

// Fallback replacements using \n just in case
code = code.replace(
  "  heroBgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundImage: 'url(\"/hero-bg.png\")', backgroundSize: 'cover', backgroundPosition: 'center' },\n  heroGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(253,248,242,0.95), rgba(253,248,242,0.4))', zIndex: 1 },\n  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(238,243,251,0.8), transparent 70%)', zIndex: 2 },",
  "  heroBgWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, backgroundImage: 'url(\"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80\")', backgroundSize: 'cover', backgroundPosition: 'center' },\n  heroGradient: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(11,22,40,0.92) 0%, rgba(15,32,64,0.85) 100%)', zIndex: 1 },\n  heroOverlay: { display: 'none' },"
)
code = code.replace(
  "  statsSection: { background: '#fff', padding: '5rem 0' },\n  statsGrid: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },\n  statItem: { textAlign: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px 40px', minWidth: 160 },",
  "  statsSection: { background: 'var(--cream-2)', padding: '5rem 0' },\n  statsGrid: { display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' },\n  statItem: { textAlign: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '12px', padding: '20px 40px', minWidth: 160 },"
)
code = code.replace(
  "  finalCta: { padding: '8rem 0', background: 'linear-gradient(rgba(42,22,32,0.95), rgba(123,29,46,0.98)), url(\"/hero-bg.png\")', backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff' },\n  ctaTitle: { fontFamily: \"'Playfair Display',serif\", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem' },\n  ctaSub: { fontSize: '1.2rem', color: 'rgba(255,255,255,0.8)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' },",
  "  finalCta: { padding: '8rem 0', background: 'linear-gradient(135deg, rgba(11,22,40,0.95), rgba(15,32,64,0.95)), url(\"https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1920&q=80\")', backgroundSize: 'cover', backgroundAttachment: 'fixed', color: '#fff' },\n  ctaTitle: { fontFamily: \"'Playfair Display',serif\", fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--txt)' },\n  ctaSub: { fontSize: '1.2rem', color: 'var(--txt-2)', marginBottom: '3rem', maxWidth: 600, margin: '0 auto 3rem' },"
)
code = code.replace(
  "            <div key={item.title} className=\"card card-hover magnetic-hover\" style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>\n              <div style={{position:'absolute',top:20,left:20,width:28,height:28,background:'var(--brand-primary)',borderRadius:8,display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontSize:'.8rem',fontWeight:800}}>0{i+1}</div>\n              <div style={{color:'var(--brand-primary)',marginBottom:16,display:'flex',justifyContent:'center'}}>{item.i}</div>\n              <h3 style={{fontFamily:\"'Playfair Display',serif\",fontSize:'1.3rem',marginBottom:12}}>{item.title}</h3>\n              <p style={{fontSize:'.9rem',color:'var(--txt-3)',lineHeight:1.7}}>{item.desc}</p>\n            </div>",
  "            <div key={item.title} className=\"card card-hover magnetic-hover\" style={{textAlign:'center',padding:'2.5rem 2rem',position:'relative'}}>\n              <div style={{position:'absolute',top:10,left:20,fontSize:'4rem',fontWeight:800,color:'rgba(201,168,76,0.1)',lineHeight:1}}>0{i+1}</div>\n              <div style={{color:'var(--brand-accent)',marginBottom:16,display:'flex',justifyContent:'center', position:'relative'}}>{item.i}</div>\n              <h3 style={{fontFamily:\"'Playfair Display',serif\",fontSize:'1.3rem',marginBottom:12, color:'var(--txt)', position:'relative'}}>{item.title}</h3>\n              <p style={{fontSize:'.9rem',color:'var(--txt-3)',lineHeight:1.7, position:'relative'}}>{item.desc}</p>\n            </div>"
)
code = code.replace(
  "      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>\n        <div style={{textAlign:'center',marginBottom:'4rem'}}>\n          <div className=\"sec-label\" style={{justifyContent:'center'}}>Testimonials</div>\n          <h2 className=\"sec-title\" style={{textAlign:'center'}}>Trusted by <em>thousands across India.</em></h2>",
  "      <section style={{padding:'7rem 5vw',background:'var(--cream-2)'}}>\n        <div style={{textAlign:'center',marginBottom:'4rem'}}>\n          <div className=\"sec-label\" style={{justifyContent:'center'}}>Testimonials</div>\n          <h2 className=\"sec-title\" style={{textAlign:'center', color: 'var(--txt)'}}>Trusted by <em style={{color:'var(--brand-accent)'}}>thousands across India.</em></h2>"
)
code = code.replace(
  "            <div key={t.name} style={{padding:'2.5rem', background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', borderLeft:'4px solid var(--brand-primary)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}>\n              <div style={{color:'var(--brand-accent)',marginBottom:16,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>\n              <p style={{fontFamily:\"'Plus Jakarta Sans',sans-serif\",fontSize:'1.05rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'2rem', color:'var(--txt)'}}>\"{t.text}\"</p>\n              <div style={{display:'flex',gap:12,alignItems:'center'}}>\n                <div style={{width:44,height:44,borderRadius:'50%',background:'var(--brand-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#fff'}}>{t.init}</div>\n                <div><div style={{fontWeight:800,fontSize:'.95rem'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div></div>\n              </div>\n            </div>",
  "            <div key={t.name} style={{padding:'2.5rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(201,168,76,0.15)', borderRadius:'16px', borderLeft:'4px solid var(--brand-accent)', boxShadow:'0 4px 24px rgba(0,0,0,0.4)'}}>\n              <div style={{color:'var(--brand-accent)',marginBottom:16,letterSpacing:2,fontSize:'1rem'}}>★★★★★</div>\n              <p style={{fontFamily:\"'Plus Jakarta Sans',sans-serif\",fontSize:'1.05rem',fontStyle:'italic',lineHeight:1.7,marginBottom:'2rem', color:'var(--txt)'}}>\"{t.text}\"</p>\n              <div style={{display:'flex',gap:12,alignItems:'center'}}>\n                <div style={{width:44,height:44,borderRadius:'50%',background:'var(--brand-accent)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'.9rem',color:'#0B1628'}}>{t.init}</div>\n                <div><div style={{fontWeight:800,fontSize:'.95rem', color:'var(--txt)'}}>{t.name}</div><div style={{fontSize:'.78rem',color:'var(--txt-3)'}}>{t.role}</div></div>\n              </div>\n            </div>"
)

fs.writeFileSync('src/pages/index.jsx', code)
console.log('done')
