const fs = require('fs');
const path = require('path');

function walkDir(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walkDir(file));
        } else if (file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}

const apiAdminDir = path.join(process.cwd(), 'src', 'pages', 'api', 'admin');
const allFiles = walkDir(apiAdminDir);

allFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Calculate the depth from root to the file's directory
    const relativeToRoot = path.relative(process.cwd(), path.dirname(file));
    const depth = relativeToRoot.split(path.sep).length;
    
    // Create the correct prefix
    let prefix = '';
    for(let i=0; i<depth; i++) {
        prefix += '../';
    }
    
    // Regex to replace all import variants
    content = content.replace(/from\s+['"]\.\.\/.*?models\/(.*?)['"]/g, `from '${prefix}models/$1'`);
    content = content.replace(/from\s+['"]\.\.\/.*?middleware\/(.*?)['"]/g, `from '${prefix}middleware/$1'`);
    
    fs.writeFileSync(file, content);
});

console.log('Fixed imports in', allFiles.length, 'files');
