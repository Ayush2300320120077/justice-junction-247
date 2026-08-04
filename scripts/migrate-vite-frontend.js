const fs = require('fs');
const path = require('path');

function walk(dir) {
  let files = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      files = files.concat(walk(fullPath));
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      files.push(fullPath);
    }
  });
  return files;
}

const srcDir = path.join(__dirname, 'src');
const files = walk(srcDir);

let count = 0;

files.forEach(filePath => {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  if (!content.includes('next/')) {
    return;
  }

  console.log('Migrating:', path.relative(__dirname, filePath));

  // Check what next components are used
  const usesLink = content.includes("from 'next/link'") || content.includes('from "next/link"');
  const usesRouter = content.includes("from 'next/router'") || content.includes('from "next/router"');
  const usesHead = content.includes("from 'next/head'") || content.includes('from "next/head"');
  const usesDynamic = content.includes("from 'next/dynamic'") || content.includes('from "next/dynamic"');

  // Remove next imports
  content = content.replace(/import\s+Link\s+from\s+['"]next\/link['"];?\r?\n?/g, '');
  content = content.replace(/import\s+\{\s*useRouter\s*\}\s+from\s+['"]next\/router['"];?\r?\n?/g, '');
  content = content.replace(/import\s+Head\s+from\s+['"]next\/head['"];?\r?\n?/g, '');
  content = content.replace(/import\s+dynamic\s+from\s+['"]next\/dynamic['"];?\r?\n?/g, '');

  // Add react-router-dom and react-helmet-async imports
  let rrdImports = [];
  if (usesLink || content.includes('<Link ')) rrdImports.push('Link');
  if (usesRouter || content.includes('useRouter') || content.includes('router.')) {
    rrdImports.push('useNavigate', 'useLocation', 'useSearchParams', 'useParams');
  }

  let newImports = '';
  if (rrdImports.length > 0) {
    const unique = Array.from(new Set(rrdImports));
    newImports += `import { ${unique.join(', ')} } from 'react-router-dom';\n`;
  }
  if (usesHead || content.includes('<Head>')) {
    newImports += `import { Helmet } from 'react-helmet-async';\n`;
  }

  content = newImports + content;

  // Replace router instantiation
  content = content.replace(/const\s+router\s*=\s*useRouter\(\)/g, 'const navigate = useNavigate(); const location = useLocation(); const [searchParams] = useSearchParams(); const params = useParams();');
  content = content.replace(/router\.push\(/g, 'navigate(');
  content = content.replace(/router\.replace\(/g, 'navigate(');
  content = content.replace(/router\.pathname/g, 'location.pathname');

  // Replace tags
  content = content.replace(/<Head>/g, '<Helmet>');
  content = content.replace(/<\/Head>/g, '</Helmet>');
  content = content.replace(/<Link\s+href=/g, '<Link to=');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
  }
});

console.log(`Successfully migrated ${count} files.`);
