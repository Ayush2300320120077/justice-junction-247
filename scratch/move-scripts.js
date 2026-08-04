const fs = require('fs');
const path = require('path');

const files = [
  'fix-footer.js', 'fix-imports.js', 'fix-index.js', 'fix-index2.js', 'fix-index3.js', 
  'fix-testimonials.js', 'migrate-auth.js', 'migrate-verification-status.js', 'migrate-vite-frontend.js', 
  'enforce-admins.js', 'make-admin.js', 'check-bugs.js', 'audit-website.js', 'seed-1000-lawyers.js', 
  'seed-bulk-data.js', 'seed-document-templates.js', 'seed-lawyers.js', 'seed-test-lawyers.js', 
  'test-admin-ai-eval.js', 'test-admin-data.js', 'test-assistant.js', 'test-e2e.js', 
  'test-live-admin-data.js', 'test-live-endpoint-real.js', 'test-rag-chat.js', 'test-retrieval.js'
];

if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

const moved = [];
const fixed = [];

for (const file of files) {
  if (fs.existsSync(file)) {
    const dest = path.join('scripts', file);
    fs.renameSync(file, dest);
    moved.push(file);

    let content = fs.readFileSync(dest, 'utf8');
    let modified = false;

    const newContent = content.replace(/(require\(\s*|from\s+)(['"])\.\/([^'"]+)\2/g, (match, prefix, quote, p3) => {
      modified = true;
      const replaced = `${prefix}${quote}../${p3}${quote}`;
      fixed.push({ file, old: match, new: replaced });
      return replaced;
    });

    if (modified) {
      fs.writeFileSync(dest, newContent, 'utf8');
    }
  } else {
    console.log('File not found: ' + file);
  }
}

console.log('MOVED=' + JSON.stringify(moved));
console.log('FIXED=' + JSON.stringify(fixed, null, 2));
