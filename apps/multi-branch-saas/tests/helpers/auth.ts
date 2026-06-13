import { Page } from '@playwright/test'

export async function loginAsAdmin(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'admin@repairshop.com')
  await page.fill('input[name="password"]', 'Admin123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

export async function loginAsBranchManager(page: Page) {
  await page.goto('/login')
  await page.fill('input[name="email"]', 'manager@branch.com')
  await page.fill('input[name="password"]', 'Manager123!')
  await page.click('button[type="submit"]')
  await page.waitForURL('/')
}

export async function logout(page: Page) {
  await page.click('button:has-text("Logout")')
  await page.waitForURL('/login')
}
