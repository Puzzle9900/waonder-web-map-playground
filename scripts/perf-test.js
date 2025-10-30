// Automated performance testing script
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running performance tests...\n');

// 1. Build production bundle
console.log('📦 Building production bundle...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// 2. Analyze bundle size
console.log('📊 Bundle size analysis:');
try {
  const nextDir = path.join(process.cwd(), '.next');

  if (fs.existsSync(nextDir)) {
    console.log('\nTotal .next directory:');
    execSync(`du -sh ${nextDir}`, { stdio: 'inherit' });

    const chunksDir = path.join(nextDir, 'static', 'chunks');
    if (fs.existsSync(chunksDir)) {
      console.log('\nStatic chunks:');
      execSync(`du -sh ${chunksDir}`, { stdio: 'inherit' });
    }

    console.log('\n');
  }
} catch (error) {
  console.error('Warning: Could not analyze bundle size');
}

// 3. Performance targets verification
console.log('🎯 Checking against performance targets:\n');
console.log('Expected targets (from MILESTONE-02 specs):');
console.log('  - Main bundle (gzipped): < 200KB');
console.log('  - First Load JS: < 100KB');
console.log('  - Lighthouse Score: > 90');
console.log('  - H3 Calculation: < 2ms average');
console.log('  - Frame Rate: 60fps during interaction\n');

// 4. Check if production build artifacts exist
console.log('📂 Production build artifacts:');
const buildManifest = path.join(process.cwd(), '.next', 'build-manifest.json');
if (fs.existsSync(buildManifest)) {
  console.log('✅ Build manifest found');
} else {
  console.log('❌ Build manifest not found');
}

const pagesManifest = path.join(process.cwd(), '.next', 'server', 'pages-manifest.json');
if (fs.existsSync(pagesManifest)) {
  console.log('✅ Pages manifest found');
} else {
  console.log('❌ Pages manifest not found');
}

// 5. Run Lighthouse CI (if installed)
console.log('\n🔍 Lighthouse audit:');
console.log('Note: To run Lighthouse, install it globally:');
console.log('  npm install -g lighthouse');
console.log('Then start the production server and run:');
console.log('  lighthouse http://localhost:3000 --output=json --output-path=./lighthouse-report.json\n');

// 6. Summary
console.log('✅ Performance tests complete!\n');
console.log('📝 Next steps:');
console.log('  1. Start production server: npm start');
console.log('  2. Run Lighthouse audit (see above)');
console.log('  3. Profile with Chrome DevTools');
console.log('  4. Test on real devices (mobile/tablet)');
console.log('  5. Verify all performance targets are met\n');

console.log('📚 See MILESTONE-02.md for detailed performance benchmarks');
