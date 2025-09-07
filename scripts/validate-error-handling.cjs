#!/usr/bin/env node

/**
 * Simple error handling validation script for Copilot integration
 * Validates proper error handling patterns in the codebase
 */

const fs = require('fs');
const path = require('path');

class SimpleErrorValidator {
  constructor() {
    this.patterns = [
      {
        pattern: /try\s*{[^}]*}\s*catch\s*\([^)]*\)\s*{\s*}/g,
        name: 'Empty catch block',
        severity: 'error',
        suggestion: 'Add proper error handling in catch block'
      },
      {
        pattern: /catch\s*\([^)]*\)\s*{\s*console\.log/g,
        name: 'Console.log in catch',
        severity: 'warning', 
        suggestion: 'Use console.error instead of console.log for errors'
      },
      {
        pattern: /throw\s+new\s+Error\s*\(\s*['"]\s*['"]\s*\)/g,
        name: 'Empty error message',
        severity: 'error',
        suggestion: 'Provide descriptive error messages'
      },
      {
        pattern: /\.catch\s*\(\s*\)/g,
        name: 'Empty promise catch',
        severity: 'error',
        suggestion: 'Add error handler to promise catch'
      }
    ];
  }

  validateProject(srcPath) {
    console.log('🚨 Validating error handling patterns...');
    
    let hasErrors = false;
    this.scanDirectory(srcPath, (errorFound) => {
      if (errorFound) hasErrors = true;
    });
    
    if (!hasErrors) {
      console.log('✅ Error handling validation passed');
    }
    
    return !hasErrors;
  }

  scanDirectory(directory, onError) {
    if (!fs.existsSync(directory)) {
      return;
    }

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file of files) {
      const filePath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        this.scanDirectory(filePath, onError);
      } else if (file.name.endsWith('.ts') || file.name.endsWith('.tsx')) {
        const fileHasErrors = this.validateFile(filePath);
        if (fileHasErrors) onError(true);
      }
    }
  }

  validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    let hasErrors = false;
    
    for (const pattern of this.patterns) {
      const matches = content.match(pattern.pattern);
      if (matches) {
        if (pattern.severity === 'error') {
          hasErrors = true;
          console.error(`❌ ${path.basename(filePath)}: ${pattern.name}`);
        } else {
          console.warn(`⚠️  ${path.basename(filePath)}: ${pattern.name}`);
        }
        console.log(`   💡 ${pattern.suggestion}`);
        
        // Show first few matches with line numbers
        matches.slice(0, 2).forEach((match, index) => {
          const lines = content.split('\n');
          const lineIndex = lines.findIndex(l => l.includes(match.trim()));
          const lineNumber = lineIndex >= 0 ? lineIndex + 1 : '?';
          console.log(`   📍 Line ${lineNumber}: ${match.trim()}`);
        });
        console.log('');
      }
    }
    
    return hasErrors;
  }
}

// CLI usage
if (require.main === module) {
  const validator = new SimpleErrorValidator();
  const srcPath = path.join(process.cwd(), 'src');
  const isValid = validator.validateProject(srcPath);
  process.exit(isValid ? 0 : 1);
}

module.exports = { SimpleErrorValidator };