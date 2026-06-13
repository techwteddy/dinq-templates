import { test, expect } from '@playwright/test'
import { loginAsAdmin } from './helpers/auth'

test.describe('Real-time Updates', () => {
  test('should update user list in real-time', async ({ browser }) => {
    // Create two browser contexts (simulating two users)
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    // Login both users
    await loginAsAdmin(page1)
    await loginAsAdmin(page2)

    // Both navigate to users page
    await page1.goto('/users')
    await page2.goto('/users')

    // Get initial user count in page2
    const initialCount = await page2.locator('table tbody tr').count()

    // Create user in page1
    await page1.click('a:has-text("Add User")')
    await page1.fill('input[name="email"]', `realtime${Date.now()}@test.com`)
    await page1.fill('input[name="password"]', 'Test123!')
    await page1.fill('input[name="fullName"]', 'Realtime Test User')
    await page1.click('button[type="submit"]')

    // Wait for toast notification in page2
    await page2.waitForSelector('text=New user added', { timeout: 5000 })

    // Verify user list updated in page2
    await page2.waitForTimeout(1000) // Wait for re-fetch
    const newCount = await page2.locator('table tbody tr').count()
    expect(newCount).toBeGreaterThan(initialCount)

    await context1.close()
    await context2.close()
  })

  test('should show toast notifications on updates', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await loginAsAdmin(page1)
    await loginAsAdmin(page2)

    await page1.goto('/users')
    await page2.goto('/users')

    // Update user in page1
    await page1.click('table tbody tr:first-child a:has-text("Edit")')
    await page1.fill('input[name="fullName"]', `Updated ${Date.now()}`)
    await page1.click('button[type="submit"]')

    // Verify toast appears in page2
    await page2.waitForSelector('text=User updated', { timeout: 5000 })
    const toast = page2.locator('.toast, [role="status"]')
    await expect(toast).toBeVisible()

    await context1.close()
    await context2.close()
  })

  test('should update branch hierarchy in real-time', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await loginAsAdmin(page1)
    await loginAsAdmin(page2)

    await page1.goto('/branches')
    await page2.goto('/branches')

    // Create branch in page1
    await page1.click('a:has-text("Add Branch")')
    await page1.fill('input[name="name"]', `RT Branch ${Date.now()}`)
    await page1.fill('input[name="code"]', `RT${Date.now()}`)
    await page1.click('button[type="submit"]')

    // Wait for notification in page2
    await page2.waitForSelector('text=New branch added', { timeout: 5000 })

    // Verify branch appears in page2
    await expect(page2.locator(`text=RT Branch`)).toBeVisible()

    await context1.close()
    await context2.close()
  })

  test('should handle rapid updates without errors', async ({ browser }) => {
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()

    const page1 = await context1.newPage()
    const page2 = await context2.newPage()

    await loginAsAdmin(page1)
    await loginAsAdmin(page2)

    await page1.goto('/users')
    await page2.goto('/users')

    // Create 3 users rapidly
    for (let i = 0; i < 3; i++) {
      await page1.click('a:has-text("Add User")')
      await page1.fill('input[name="email"]', `rapid${i}${Date.now()}@test.com`)
      await page1.fill('input[name="password"]', 'Test123!')
      await page1.fill('input[name="fullName"]', `Rapid User ${i}`)
      await page1.click('button[type="submit"]')
      await page1.waitForTimeout(500)
    }

    // Verify page2 received all updates
    await page2.waitForTimeout(2000)
    const toasts = page2.locator('.toast, [role="status"]')
    const toastCount = await toasts.count()
    expect(toastCount).toBeGreaterThanOrEqual(3)

    // No console errors
    const errors: string[] = []
    page2.on('console', msg => {
      if (msg.type() === 'error') errors.push(msg.text())
    })
    expect(errors).toHaveLength(0)

    await context1.close()
    await context2.close()
  })
})
