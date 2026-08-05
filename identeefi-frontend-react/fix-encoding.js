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
    } else { 
      results.push(file);
    }
  });
  return results;
}
const files = walk(path.join(__dirname, 'src'));
files.forEach(f => {
  if (f.match(/\.(js|jsx|ts|tsx)$/)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes('â€”')) {
      content = content.split('â€”').join('—');
      fs.writeFileSync(f, content, 'utf8');
      console.log('Updated', f);
    }
  }
});
