const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules' && file !== 'dist') {
        getAllFiles(filePath, arrayOfFiles);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
      arrayOfFiles.push(filePath);
    }
  });
  return arrayOfFiles;
}

const srcFiles = getAllFiles(path.join(__dirname, 'src'));
const apiFiles = getAllFiles(path.join(__dirname, 'api'));

console.log('====================================================');
console.log('     JUSTICE JUNCTION 24/7 — CODEBASE BUG SCANNER   ');
console.log('====================================================\n');

let issuesFound = 0;

// Scan 1: Check for undefined `router` references in JSX/JS
srcFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(__dirname, file);

  // Check if file uses `router.` without const router = ...
  const matches = content.match(/\brouter\.(push|query|pathname|asPath|replace|reload|back)\b/g);
  if (matches) {
    const hasRouterDecl = content.includes('const router =') || content.includes('let router =') || content.includes('var router =');
    if (!hasRouterDecl) {
      issuesFound++;
      console.log(`❌ [CRASH BUG] Undefined 'router' reference in ${relPath}`);
      console.log(`   Matches: ${Array.from(new Set(matches)).join(', ')}\n`);
    }
  }

  // Check for Next.js imports
  if (content.includes("from 'next/router'") || content.includes('from "next/router"') || content.includes("from 'next/link'")) {
    issuesFound++;
    console.log(`⚠️ [NEXTJS IMPORT] Deprecated Next.js import in ${relPath}`);
  }
});

console.log(`Found ${issuesFound} critical frontend router issues.\n`);
