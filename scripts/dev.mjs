#!/usr/bin/env node

import * as esbuild from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync, cpSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import { extname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, '..');

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject',
};

// Create dist directories
mkdirSync(resolve(projectRoot, 'dist'), { recursive: true });
mkdirSync(resolve(projectRoot, 'dist/assets'), { recursive: true });

console.log('Starting development server...\n');

// Create esbuild context for watch mode
let ctx;

async function startEsbuild() {
  try {
    ctx = await esbuild.context({
      entryPoints: [resolve(projectRoot, 'src/main.ts')],
      bundle: true,
      sourcemap: true,
      target: ['es2020'],
      format: 'esm',
      outfile: resolve(projectRoot, 'dist/assets/main.js'),
      define: {
        'process.env.NODE_ENV': '"development"'
      },
      loader: {
        '.ts': 'ts',
        '.js': 'js'
      },
      logLevel: 'info',
      platform: 'browser',
    });

    await ctx.watch();
    console.log('✓ esbuild watching for changes...\n');
  } catch (error) {
    console.error('esbuild error:', error);
    process.exit(1);
  }
}

// Copy static assets
function copyAssets() {
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
      // File might not exist
    }
  });

  // Copy icons
  try {
    cpSync(resolve(publicDir, 'icons'), resolve(projectRoot, 'dist/icons'), { recursive: true });
  } catch (err) {
    // Icons might not exist
  }

  // Process index.html
  let html = readFileSync(resolve(projectRoot, 'index.html'), 'utf-8');
  html = html.replace(/\/src\/main\.tsx/g, './assets/main.js');
  
  if (!html.includes('assets/main.css')) {
    html = html.replace(
      '</head>',
      '  <link rel="stylesheet" href="./assets/main.css">\n  </head>'
    );
  }
  
  writeFileSync(resolve(projectRoot, 'dist/index.html'), html);
}

// Simple static file server
function startServer() {
  const port = 4173;
  const distDir = resolve(projectRoot, 'dist');

  const server = createServer(async (req, res) => {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query strings
    filePath = filePath.split('?')[0];
    
    // Security: prevent directory traversal
    filePath = filePath.replace(/\.\./g, '');
    
    const fullPath = resolve(distDir, '.' + filePath);
    const ext = extname(fullPath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = await readFile(fullPath);
      res.writeHead(200, { 
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(content);
    } catch (err) {
      // Try index.html for SPA routing
      try {
        const indexContent = await readFile(resolve(distDir, 'index.html'));
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(indexContent);
      } catch (indexErr) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    }
  });

  server.listen(port, '0.0.0.0', () => {
    console.log(`✓ Development server running at http://localhost:${port}`);
    console.log(`  Network: http://0.0.0.0:${port}`);
    console.log('\nWatching for changes...\n');
  });

  return server;
}

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  if (ctx) {
    await ctx.dispose();
  }
  process.exit(0);
});

// Start everything
async function start() {
  copyAssets();
  await startEsbuild();
  startServer();
}

start().catch(err => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
