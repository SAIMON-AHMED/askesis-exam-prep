import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should load home page successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Askesis/)
  })

  test('should display navigation bar', async ({ page }) => {
    await page.goto('/')
    const navbar = page.locator('nav')
    await expect(navbar).toBeVisible()
  })

  test('should have working links in navigation', async ({ page }) => {
    await page.goto('/')
    const examsLink = page.locator('a[href*="exams"]')
    await expect(examsLink).toBeVisible()
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    const content = page.locator('main, [role="main"]')
    await expect(content).toBeVisible()
  })

  test('should be responsive on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    const content = page.locator('main, [role="main"]')
    await expect(content).toBeVisible()
  })
})
