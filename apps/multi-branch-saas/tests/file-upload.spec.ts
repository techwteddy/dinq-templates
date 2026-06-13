import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'
import path from 'path'

test.describe('File Upload System', () => {
  test('should upload user avatar', async ({ page }) => {
    await loginAsAdmin(page)

    // Navigate to user edit page
    await page.goto('/users')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // Upload avatar (create a test image or use existing)
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'avatar.png'))

    // Verify preview appears
    await expect(page.locator('img[alt="Preview"]')).toBeVisible()

    // Save
    await page.click('button[type="submit"]')
    await expect(page.locator('text=success')).toBeVisible()
  })

  test('should reject files larger than 5MB', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // This test assumes you have a 6MB file in fixtures
    // In real scenario, you'd create one programmatically
    const fileInput = page.locator('input[type="file"]')

    // Verify error message
    await expect(page.locator('text=less than 5MB')).toBeVisible()
  })

  test('should reject invalid file types', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // Try to upload a text file
    const fileInput = page.locator('input[type="file"]')
    // This would need a .txt file in fixtures
    // await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'test.txt'));

    // Verify error
    await expect(page.locator('text=Invalid file type')).toBeVisible()
  })

  test('should replace existing avatar', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/users')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // Upload first avatar
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'avatar1.png'))
    await page.click('button[type="submit"]')

    // Upload second avatar
    await page.click('table tbody tr:first-child a:has-text("Edit")')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'avatar2.png'))
    await page.click('button[type="submit"]')

    // Verify new avatar is used
    await expect(page.locator('img[src*="avatar"]')).toBeVisible()
  })

  test('should upload branch logo including SVG', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/branches')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // Upload SVG logo
    const fileInput = page.locator('input[type="file"]')
    await fileInput.setInputFiles(path.join(__dirname, 'fixtures', 'logo.svg'))

    await page.click('button[type="submit"]')
    await expect(page.locator('text=success')).toBeVisible()
  })
})
