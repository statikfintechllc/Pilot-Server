import globals from 'globals';

export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    }
  },
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.config.js',
      '*.config.mjs',
      'scripts/**'
    ]
  }
];
