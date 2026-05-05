const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'pages', 'index.jsx');
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="container" style={s.statsGrid}>
            <div key={l} style={s.statItem}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>`;

const replacement = `<div className="container" style={s.statsGrid}>
          {[
            ['50+', 'Verified Lawyers'],
            ['₹0', 'Platform Fee for Clients']
          ].map(([n, l]) => (
            <div key={l} style={s.statItem}>
              <div style={s.statNum}>{n}</div>
              <div style={s.statLabel}>{l}</div>
            </div>
          ))}
        </div>`;

content = content.replace(target, replacement);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed syntax error in index.jsx');
