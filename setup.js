#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Task Management System...\n');

// Function to copy .env.example to .env if .env doesn't exist
function setupEnvFile(dir, name) {
  const envPath = path.join(dir, '.env');
  const examplePath = path.join(dir, '.env.example');
  
  if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log(`✅ Created ${name}/.env from .env.example`);
  } else if (fs.existsSync(envPath)) {
    console.log(`ℹ️  ${name}/.env already exists`);
  }
}

// Function to install dependencies
function installDependencies(dir, name) {
  console.log(`📦 Installing ${name} dependencies...`);
  try {
    execSync('npm install', { cwd: dir, stdio: 'inherit' });
    console.log(`✅ ${name} dependencies installed\n`);
  } catch (error) {
    console.error(`❌ Failed to install ${name} dependencies:`, error.message);
  }
}

// Setup backend
console.log('🔧 Setting up Backend...');
setupEnvFile('./backend', 'backend');
installDependencies('./backend', 'Backend');

// Setup frontend
console.log('🎨 Setting up Frontend...');
setupEnvFile('./frontend', 'frontend');
installDependencies('./frontend', 'Frontend');

console.log('🎉 Setup complete!');
console.log('\n📝 Next steps:');
console.log('1. Configure your .env files with proper values');
console.log('2. Make sure MongoDB is running');
console.log('3. Start the backend: cd backend && npm run dev');
console.log('4. Start the frontend: cd frontend && npm run dev');
console.log('5. Open http://localhost:5175 in your browser');
console.log('\n💡 Check the README.md for detailed instructions!');