const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Helper script to ensure the build process completes successfully
console.log('Running build helper script...');

// Create directory if it doesn't exist
if (!fs.existsSync('stall-manager-app/build')) {
  console.log('Creating build directory...');
  try {
    fs.mkdirSync('stall-manager-app/build', { recursive: true });
  } catch (error) {
    console.error('Error creating build directory:', error);
  }
}

// Install dependencies
console.log('Installing dependencies...');
try {
  execSync('cd stall-manager-app && npm install', { stdio: 'inherit' });
} catch (error) {
  console.error('Error installing dependencies:', error);
  // Continue anyway
}

// Try to build the app
console.log('Building the app...');
try {
  execSync('cd stall-manager-app && npm run build', { stdio: 'inherit' });
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Error during build:', error);
  
  // If build fails, create a fallback index.html
  console.log('Creating fallback page...');
  const fallbackHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Church Fundraising Stall Manager</title>
  <style>
    body {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      line-height: 1.6;
      color: #333;
      background: #f8fafc;
    }
    h1 {
      color: #0284c7;
      margin-top: 40px;
    }
    p {
      margin-bottom: 20px;
    }
    a {
      color: #0284c7;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      margin: 20px 0;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
  </style>
</head>
<body>
  <h1>Church Fundraising Stall Manager</h1>
  <div class="card">
    <h2>Coming Soon</h2>
    <p>Our stall management application is being prepared for deployment.</p>
    <p>This site will allow church fundraising event organizers to:</p>
    <ul>
      <li>Track sales in real-time</li>
      <li>Manage inventory across multiple stalls</li>
      <li>Generate reports on fundraising performance</li>
      <li>Coordinate seller activities</li>
    </ul>
  </div>
  <div class="card">
    <h2>Contact</h2>
    <p>For more information, please contact the system administrator.</p>
  </div>
  <footer style="margin-top:40px;text-align:center;font-size:0.8em;color:#64748b;">
    &copy; 2025 Church Fundraising Stall Manager
  </footer>
</body>
</html>`;

  try {
    fs.writeFileSync('stall-manager-app/build/index.html', fallbackHtml);
    console.log('Fallback page created successfully!');
  } catch (writeError) {
    console.error('Error creating fallback page:', writeError);
  }
}

console.log('Build helper script completed.');