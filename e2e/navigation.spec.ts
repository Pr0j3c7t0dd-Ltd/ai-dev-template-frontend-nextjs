import { test, expect } from '@playwright/test'

test('should navigate to the home page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/AI Dev Template/)
  
  // Example: Check if main content is visible
  const main = page.getByRole('main')
  await expect(main).toBeVisible()
})

test('should have correct viewport on mobile', async ({ page }) => {
  await page.goto('/')
  
  // Verify responsive design
  const viewport = page.viewportSize()
  expect(viewport?.width).toBeDefined()
  expect(viewport?.height).toBeDefined()
  
  // Example: Check if mobile menu is present
  const nav = page.getByRole('navigation')
  await expect(nav).toBeVisible()
}) 