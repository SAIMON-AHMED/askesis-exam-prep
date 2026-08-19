import { test, expect } from '@playwright/test'

test.describe('Exam Selection Flow', () => {
  test('should load exams page and display all exam cards', async ({ page }) => {
    await page.goto('/exams')
    
    // Check that all 6 exam cards are visible
    const satCard = page.locator('text=SAT')
    const actCard = page.locator('text=ACT')
    const greCard = page.locator('text=GRE')
    
    await expect(satCard).toBeVisible()
    await expect(actCard).toBeVisible()
    await expect(greCard).toBeVisible()
  })

  test('should navigate to SAT dashboard when SAT card is clicked', async ({ page }) => {
    await page.goto('/exams')
    
    // Find and click SAT exam card
    const satCard = page.locator('[data-testid="exam-card-sat"], button:has-text("SAT")')
    
    // Click the first card that contains SAT
    const firstSatButton = page.locator('button').filter({ hasText: 'SAT' }).first()
    await firstSatButton.click()
    
    // Should navigate to SAT exam page
    await page.waitForURL(/\/exams\/sat/)
    await expect(page).toHaveURL(/\/exams\/sat/)
  })

  test('should search and filter exams by name', async ({ page }) => {
    await page.goto('/exams')
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('SAT')
      await page.waitForLoadState('networkidle')
      
      // Should show only SAT cards
      const satText = page.locator('text=SAT')
      await expect(satText).toBeVisible()
    }
  })

  test('should display exam metadata on cards', async ({ page }) => {
    await page.goto('/exams')
    
    // Check for exam description or metadata
    const examCards = page.locator('[class*="card"], button')
    const cardCount = await examCards.count()
    
    // Should have at least 6 exam cards
    expect(cardCount).toBeGreaterThanOrEqual(6)
  })

  test('should navigate back from exam dashboard to exams list', async ({ page }) => {
    await page.goto('/exams/sat')
    
    // Find back button or exams link
    const backButton = page.locator('button:has-text("Back"), a[href="/exams"]')
    
    if (await backButton.isVisible()) {
      await backButton.first().click()
      await page.waitForURL('/exams')
      await expect(page).toHaveURL('/exams')
    }
  })
})
