import { test, expect } from "@playwright/test";

test("unauthenticated user is redirected to login", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByText("Sign in with Google")).toBeVisible();
});

test("login page has app branding", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByText("My Family Genius")).toBeVisible();
  await expect(page.getByText("Welcome home")).toBeVisible();
});

test("protected routes redirect to login", async ({ page }) => {
  for (const path of ["/calendar", "/supermarket", "/chores", "/home-projects"]) {
    await page.goto(path);
    await expect(page).toHaveURL(/\/login/);
  }
});
