const fs = require('fs');
const path = require('path');

// Create build directory if it doesn't exist
if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

// Copy our static HTML to the public directory
const htmlContent = fs.readFileSync('index.html', 'utf8');
fs.writeFileSync(path.join('public', 'index.html'), htmlContent);

console.log('Static site generated in public directory!');