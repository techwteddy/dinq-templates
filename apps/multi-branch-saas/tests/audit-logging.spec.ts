import { test, expect } from '@playwright/test'
import { loginAsAdmin, loginAsBranchManager } from './helpers/auth'

test.describe('Audit Logging System', () => {
  test('should show audit logs page only to admins', async ({ page }) => {
    await loginAsAdmin(page)

    // Navigate to audit logs
    await page.click('a:has-text("Audit Logs")')
    await expect(page).toHaveURL('/audit-logs')
    await expect(page.locator('h1')).toContainText('Audit Logs')
  })

  test('should deny access to non-admin users', async ({ page }) => {
    await loginAsBranchManager(page)

    // Try to access audit logs directly
    await page.goto('/audit-logs')
    await expect(page.locator('text=Unauthorized')).toBeVisible()
  })

  test('should log user creation', async ({ page }) => {
    await loginAsAdmin(page)

    // Get initial audit log count
    await page.goto('/audit-logs')
    const initialLogs = await page.locator('table tbody tr').count()

    // Create a new user
    await page.goto('/users')
    await page.click('a:has-text("Add User")')
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'Test123!')
    await page.fill('input[name="fullName"]', 'Test User')
    await page.click('button[type="submit"]')

    // Check audit logs
    await page.goto('/audit-logs')
    const newLogs = await page.locator('table tbody tr').count()
    expect(newLogs).toBeGreaterThan(initialLogs)

    // Verify log entry details
    const firstLog = page.locator('table tbody tr').first()
    await expect(firstLog.locator('text=CREATE')).toBeVisible()
    await expect(firstLog.locator('text=users')).toBeVisible()
  })

  test('should log user updates with before/after values', async ({ page }) => {
    await loginAsAdmin(page)

    // Navigate to users and edit first user
    await page.goto('/users')
    await page.click('table tbody tr:first-child a:has-text("Edit")')

    // Change the name
    const newName = `Updated User ${Date.now()}`
    await page.fill('input[name="fullName"]', newName)
    await page.click('button[type="submit"]')

    // Check audit logs
    await page.goto('/audit-logs')
    const updateLog = page.locator('table tbody tr:has-text("UPDATE")').first()
    await expect(updateLog).toBeVisible()

    // Check changes are captured
    await updateLog.locator('summary:has-text("View changes")').click()
    await expect(updateLog.locator('pre')).toBeVisible()
  })

  test('should filter audit logs by resource', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/audit-logs')

    // Filter by users
    await page.selectOption('select:has-text("All Resources")', 'users')
    await page.waitForTimeout(1000) // Wait for filter to apply

    // All visible logs should be for users
    const resourceCells = page.locator('table tbody tr td:nth-child(3)')
    const count = await resourceCells.count()
    for (let i = 0; i < count; i++) {
      await expect(resourceCells.nth(i)).toContainText('users')
    }
  })

  test('should filter audit logs by action', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/audit-logs')

    // Filter by CREATE
    await page.selectOption('select:has-text("All Actions")', 'CREATE')
    await page.waitForTimeout(1000)

    // All visible logs should be CREATE
    const actionBadges = page.locator('table tbody tr td:nth-child(2) .badge')
    const count = await actionBadges.count()
    for (let i = 0; i < count; i++) {
      await expect(actionBadges.nth(i)).toContainText('CREATE')
    }
  })

  test('should search audit logs', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/audit-logs')

    // Search for admin email
    await page.fill('input[placeholder*="Search"]', 'admin@repairshop.com')
    await page.waitForTimeout(1000)

    // Verify results contain search term
    const userCells = page.locator('table tbody tr td:first-child')
    const count = await userCells.count()
    if (count > 0) {
      await expect(userCells.first()).toContainText('admin@repairshop.com')
    }
  })

  test('should paginate audit logs', async ({ page }) => {
    await loginAsAdmin(page)
    await page.goto('/audit-logs')

    // Check if pagination exists (only if > 20 logs)
    const nextButton = page.locator('button:has-text("Next")')
    if (await nextButton.isEnabled()) {
      await nextButton.click()
      await page.waitForTimeout(1000)

      // Verify page changed
      const prevButton = page.locator('button:has-text("Previous")')
      await expect(prevButton).toBeEnabled()
    }
  })
})
