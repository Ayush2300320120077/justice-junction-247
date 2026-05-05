const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'index.jsx');
let content = fs.readFileSync(file, 'utf8');

// Use regex to replace the entire statsSection block
const newBlock = `<section style={s.statsSection}>
        <div className="container" style={s.statsGrid}>
          {[
            ['50+', 'Verified Lawyers'],
            ['₹0', 'Platform Fee for Clients']
          ].map(([n, l]) => (
            <div key={l} style={s.statItem}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>
      </section>`;

content = content.replace(/<section style=\{s\.statsSection\}>[\s\S]*?<\/section>/g, newBlock);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed syntax error in index.jsx completely');
