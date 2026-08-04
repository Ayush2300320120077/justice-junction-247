const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'index.jsx');
let content = fs.readFileSync(file, 'utf8');

// Fix testimonial card styling (UPGRADE 7)
content = content.replace(
  /className="card magnetic-hover" style=\{\{padding:'2\.5rem', background:'#fff'\}\}/g,
  `style={{padding:'2.5rem', background:'#fff', border:'1px solid #E2E8F0', borderRadius:'16px', borderLeft:'4px solid var(--brand-primary)', boxShadow:'0 2px 12px rgba(0,0,0,0.06)'}}`
);

// Fix star color to brand-accent
content = content.replace(
  /color:'var\(--gold\)',marginBottom:16/g,
  `color:'var(--brand-accent)',marginBottom:16`
);

// Fix testimonial font
content = content.replace(
  /fontFamily:"'Playfair Display',serif",fontSize:'1\.1rem'/g,
  `fontFamily:"'Plus Jakarta Sans',sans-serif",fontSize:'1.05rem'`
);

// Fix avatar background to brand-primary
content = content.replace(
  /background:'var\(--bur-l\)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:800/g,
  `background:'var(--brand-primary)',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Testimonials upgraded successfully!');
