import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.aistudio/**',
      'public/**',
      '**/*.d.ts',
      'src/data/tools/*.json'
    ],
    rules: {
      'no-unused-vars': 'off',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'prefer-const': 'warn',
      'no-undef': 'off'
    }
  }
];
