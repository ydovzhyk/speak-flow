import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';

const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  { ignores: ['node_modules', 'dist', '.next', 'public', 'coverage'] },

  ...compat.config({
    extends: [
      'eslint:recommended',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:@next/next/recommended',
      'prettier',
    ],
    settings: {
      next: {
        rootDir: 'packages/my-app/',
      },
    },
    rules: {
      'react/no-unescaped-entities': 'off',
      '@next/next/no-page-custom-font': 'off',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-typos': 'error',
      '@next/next/no-html-link-for-pages': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'error',
    },
  }),

  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        process: 'readonly',
      },
    },
  },
];
