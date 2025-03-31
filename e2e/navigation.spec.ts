import { test, expect } from '@playwright/test';

test('should navigate to the home page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AI Dev Template/);

  // Check if main content is visible
  const main = page.locator('main');
  await expect(main).toBeVisible();
});

test('should have correct viewport on mobile', async ({ page }) => {
  await page.goto('/');

  // Verify responsive design
  const viewport = page.viewportSize();
  expect(viewport?.width).toBeDefined();
  expect(viewport?.height).toBeDefined();

  // Update to check for the header element which contains navigation
  const nav = page.locator('header');
  await expect(nav).toBeVisible();
});
