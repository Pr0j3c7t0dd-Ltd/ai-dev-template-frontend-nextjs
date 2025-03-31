import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import js from '@eslint/js';
import * as typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const eslintConfig = [
  {
    ignores: [
      // Build outputs
      ".next/**/*",
      "out/**/*",
      "node_modules/**/*",
      "dist/**/*",
      "build/**/*",
      "coverage/**/*",
      "public/**/*",
      // Config files
      "*.config.js",
      "*.config.ts",
      "next.config.*",
      "jest.config.*",
      "tailwind.config.*",
      "postcss.config.*",
      // Type definitions
      "**/*.d.ts",
      "**/*.js.map",
      // Generated files
      "**/*.generated.*",
      "**/*.min.*",
      "**/*.bundle.*",
      "**/*.chunk.*",
      "**/*.transformed.*", 
      "**/*.compiled.*",
      "**/*.turbopack.*",
      "**/*.development.*",
      "**/*.production.*",
      // Turbopack specific
      "**/node_modules_*",
      "**/__turbopack__/**",
      "**/_next/**",
      // SWC
      ".swc/**/*",
      // Playwright
      "playwright-report/**/*",
      "test-results/**/*",
    ]
  },
  ...compat.config({
    extends: [
      'next/core-web-vitals',
      'plugin:@typescript-eslint/recommended',
      'prettier'
    ],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
    },
  },
];

export default eslintConfig;
