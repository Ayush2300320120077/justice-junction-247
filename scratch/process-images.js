const sharp = require('./node_modules/sharp');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const images = [
  'hero-bg.png', 'office-bg.png', 'justice-bg.png', 'mission-bg.png', 
  'search-bg.png', 'auth-bg.png', 'abstract-bg.png'
];

const results = [];

async function run() {
  console.log('Starting image conversions...');

  for (const img of images) {
    const inPath = path.join('..', 'public', img);
    const outPath = path.join('..', 'public', img.replace('.png', '.webp'));
    
    if (!fs.existsSync(inPath)) {
      console.log(`Missing: ${inPath}`);
      continue;
    }

    const beforeSize = fs.statSync(inPath).size;
    
    try {
      await sharp(inPath)
        .webp({ quality: 80 })
        .toFile(outPath);
        
      const afterSize = fs.statSync(outPath).size;
      results.push({
        file: img,
        before: (beforeSize / 1024).toFixed(1) + ' KB',
        after: (afterSize / 1024).toFixed(1) + ' KB'
      });
      console.log(`Converted ${img}: ${results[results.length-1].before} -> ${results[results.length-1].after}`);
    } catch (err) {
      console.error(`Failed to convert ${img}`, err);
    }
  }

  console.log('\nUpdating references in src/ ...');

  function walkDir(dir) {
    let files = [];
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        files = files.concat(walkDir(fullPath));
      } else if (stat.isFile() && (fullPath.endsWith('.jsx') || fullPath.endsWith('.css') || fullPath.endsWith('.js'))) {
        files.push(fullPath);
      }
    }
    return files;
  }

  const srcDir = path.join('..', 'src');
  const srcFiles = walkDir(srcDir);
  let filesModified = 0;

  for (const file of srcFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
    for (const img of images) {
      const webpImg = img.replace('.png', '.webp');
      const regex = new RegExp(img, 'g');
      content = content.replace(regex, webpImg);
    }
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content, 'utf8');
      filesModified++;
    }
  }

  console.log(`Updated ${filesModified} files in src/`);
  console.log('\nRunning build...');

  try {
    const buildOutput = execSync('npm run build', { cwd: '..', encoding: 'utf8' });
    console.log('Build completed successfully.');
    console.log(buildOutput);
  } catch (err) {
    console.error('Build failed!');
    console.error(err.stdout);
    console.error(err.stderr);
  }

  console.log('\n--- FINAL REPORT ---');
  console.table(results);
}

run();
