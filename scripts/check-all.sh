#!/bin/bash

# Exit on error
set -e

echo "Running comprehensive checks..."

echo "Step 1: Running linter and fixing issues"
npm run lint:fix

echo "Step 2: Running unit tests"
npm run test

echo "Step 3: Running end-to-end tests"
npm run test:e2e

echo "Step 4: Building the project"
npm run build

echo "Step 5: Running pre-commit checks"
# Using the same command found in the pre-commit hook
npx lint-staged && npm test -- --passWithNoTests

echo "✅ All checks passed successfully!" 