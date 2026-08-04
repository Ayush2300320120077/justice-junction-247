const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('c:/Users/Ayush Kumar/Downloads/justice-junction-FIXED/jj-fixed/src');

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let original = content;

  // 1. Remove token declarations
  content = content.replace(/^[ \t]*const\s+token\s*=\s*localStorage\.getItem\([^)]+\)(\s*\|\|\s*localStorage\.getItem\([^)]+\))?(\s*\|\|\s*'')?;\r?\n/gm, '');

  // 2. Replace { Authorization: `Bearer ${...}` } entirely if it's the only key in headers
  content = content.replace(/headers:\s*\{\s*['"]?Authorization['"]?:\s*`Bearer\s*\$\{?[^`}]+\}?`\s*\}/g, "credentials: 'include'");

  // 3. Remove Authorization from mixed headers (e.g., Content-Type, Authorization)
  content = content.replace(/,\s*['"]?Authorization['"]?:\s*`Bearer\s*\$\{?[^`}]+\}?`/g, '');
  content = content.replace(/['"]?Authorization['"]?:\s*`Bearer\s*\$\{?[^`}]+\}?`\s*,?/g, '');

  // 4. Inject credentials: 'include' into fetch options if it doesn't exist
  // We look for fetch('/path', { and insert credentials: 'include',
  content = content.replace(/(fetch\([^,]+,\s*\{)(?!\s*credentials:)/g, "$1 credentials: 'include',");

  if (content !== original) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated', f);
  }
});
