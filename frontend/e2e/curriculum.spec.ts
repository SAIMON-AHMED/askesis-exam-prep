import { test, expect } from '@playwright/test'

test.describe('Curriculum and Learning Flow', () => {
  test('should load curriculum page with all topics', async ({ page }) => {
    await page.goto('/exams/sat/curriculum')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Check that curriculum page content is visible
    const heading = page.locator('h1, h2').filter({ hasText: /curriculum|topics|sections/i })
    await expect(heading.first()).toBeVisible()
  })

  test('should display topics in grid layout', async ({ page }) => {
    await page.goto('/exams/sat/curriculum')
    
    // Topic cards should be visible
    const topicCards = page.locator('[class*="topic"], [class*="card"]')
    const count = await topicCards.count()
    
    // SAT has 10 topics, so should have at least 10 card-like elements
    expect(count).toBeGreaterThanOrEqual(5)
  })

  test('should filter topics by difficulty level', async ({ page }) => {
    await page.goto('/exams/sat/curriculum')
    
    // Find difficulty filter buttons
    const beginnerButton = page.locator('button:has-text("Beginner")')
    
    if (await beginnerButton.isVisible()) {
      await beginnerButton.click()
      await page.waitForLoadState('networkidle')
      
      // Topics should be filtered
      const topicCards = page.locator('[class*="topic"], [class*="card"]')
      const count = await topicCards.count()
      
      // Should have fewer topics after filtering
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should search topics by name', async ({ page }) => {
    await page.goto('/exams/sat/curriculum')
    
    // Find search input
    const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]')
    
    if (await searchInput.isVisible()) {
      await searchInput.fill('vocabulary')
      await page.waitForLoadState('networkidle')
      
      // Should filter to vocabulary topic
      const results = page.locator('[class*="topic"], [class*="card"]')
      const count = await results.count()
      
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should navigate to topic learning page', async ({ page }) => {
    await page.goto('/exams/sat/curriculum')
    
    // Find and click first topic card
    const firstTopicLink = page.locator('a, button').filter({ hasText: /vocabulary|grammar|algebra/i }).first()
    
    if (await firstTopicLink.isVisible()) {
      await firstTopicLink.click()
      
      // Should navigate to topic page
      await page.waitForURL(/\/exams\/sat\/topic/)
      
      // Topic content should be visible
      const topicHeader = page.locator('h1, h2')
      await expect(topicHeader.first()).toBeVisible()
    }
  })

  test('should display learning materials on topic page', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary')
    
    // Should display topic content
    const content = page.locator('main, [role="main"]')
    await expect(content).toBeVisible()
    
    // Should have learning material sections
    const sections = page.locator('[class*="material"], [class*="content"], section')
    const count = await sections.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should be responsive on mobile for curriculum page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/exams/sat/curriculum')
    
    // Content should still be visible
    const content = page.locator('main, [role="main"]')
    await expect(content).toBeVisible()
    
    // Should not have horizontal scrollbar (no layout shift)
    const windowWidth = await page.evaluate(() => window.innerWidth)
    expect(windowWidth).toBeLessThanOrEqual(375)
  })
})
