#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// Clean dist directory
try {
  rmSync(resolve(projectRoot, 'dist'), { recursive: true, force: true });
} catch (err) {
  // Directory might not exist
}

// Create dist directories
mkdirSync(resolve(projectRoot, 'dist'), { recursive: true });
mkdirSync(resolve(projectRoot, 'dist/assets'), { recursive: true });

console.log('Building JavaScript with esbuild...');

try {
  // Build main JS bundle
  await esbuild.build({
    entryPoints: [resolve(projectRoot, 'src/main.ts')],
    bundle: true,
    minify: true,
    sourcemap: true,
    target: ['es2020'],
    format: 'esm',
    outfile: resolve(projectRoot, 'dist/assets/main.js'),
    define: {
      'process.env.NODE_ENV': '"production"'
    },
    loader: {
      '.ts': 'ts',
      '.js': 'js',
      '.css': 'empty' // Ignore CSS imports in JS
    },
    logLevel: 'info',
    platform: 'browser',
  });

  console.log('✓ JavaScript bundle created');

  // Copy public assets
  console.log('Copying public assets...');
  const publicDir = resolve(projectRoot, 'public');
  const publicFiles = [
    'manifest.json',
    'service-worker.js',
    'env.example.js',
    'env.js',
    'robots.txt',
    'vite.svg'
  ];

  publicFiles.forEach(file => {
    try {
      cpSync(resolve(publicDir, file), resolve(projectRoot, 'dist', file));
    } catch (err) {
      console.warn(`Warning: Could not copy ${file}`);
    }
  });

  // Copy icons directory if it exists
  try {
    cpSync(resolve(publicDir, 'icons'), resolve(projectRoot, 'dist/icons'), { recursive: true });
  } catch (err) {
    console.warn('Warning: Could not copy icons directory');
  }

  // Process and copy index.html
  console.log('Processing index.html...');
  let html = readFileSync(resolve(projectRoot, 'index.html'), 'utf-8');
  
  // Update script reference
  html = html.replace(
    /\/src\/main\.ts/g,
    './assets/main.js'
  );
  
  // Add CSS link
  if (!html.includes('assets/main.css')) {
    html = html.replace(
      '</head>',
      '  <link rel="stylesheet" href="./assets/main.css">\n  </head>'
    );
  }
  
  writeFileSync(resolve(projectRoot, 'dist/index.html'), html);
  console.log('✓ index.html processed');

  console.log('\n✓ Build completed successfully!');
  console.log('\nNext steps:');
  console.log('  1. Run: npm run build:css');
  console.log('  2. Run: npm run preview');

} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
