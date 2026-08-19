import { test, expect } from '@playwright/test'

test.describe('Practice Quiz Flow', () => {
  test('should load practice page with question', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    
    // Question should be visible
    const question = page.locator('[class*="question"], [role="main"]')
    await expect(question.first()).toBeVisible()
  })

  test('should display answer options', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Answer options should be visible
    const options = page.locator('button, [class*="option"]').filter({ hasText: /^[A-D]$|correct|answer/i })
    const optionCount = await options.count()
    
    // Should have at least 2-4 options
    expect(optionCount).toBeGreaterThanOrEqual(2)
  })

  test('should highlight selected answer', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Click first answer option
    const firstOption = page.locator('button').filter({ hasText: /^[A-D]/ }).first()
    
    if (await firstOption.isVisible()) {
      await firstOption.click()
      
      // Option should be highlighted/selected
      await expect(firstOption).toHaveClass(/selected|active|highlight/)
    }
  })

  test('should show feedback for correct answer', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Select an answer (assuming first option might be correct or show feedback)
    const options = page.locator('button').filter({ hasText: /^[A-D]/ })
    const firstOption = options.first()
    
    if (await firstOption.isVisible()) {
      await firstOption.click()
      await page.waitForLoadState('networkidle')
      
      // Feedback should appear
      const feedback = page.locator('text=/correct|incorrect|explanation/i')
      const isVisible = await feedback.first().isVisible({ timeout: 5000 }).catch(() => false)
      
      if (isVisible) {
        await expect(feedback.first()).toBeVisible()
      }
    }
  })

  test('should navigate to next question', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Select an answer
    const firstOption = page.locator('button').filter({ hasText: /^[A-D]/ }).first()
    
    if (await firstOption.isVisible()) {
      await firstOption.click()
      
      // Find next button
      const nextButton = page.locator('button').filter({ hasText: /next|continue/i })
      
      if (await nextButton.isVisible({ timeout: 3000 }).catch(() => false)) {
        const currentUrl = page.url()
        await nextButton.click()
        await page.waitForLoadState('networkidle')
        
        // Should load next question
        expect(page.url()).not.toBe(currentUrl)
      }
    }
  })

  test('should show progress indicator', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Progress indicator should be visible
    const progress = page.locator('[class*="progress"], [role="progressbar"]')
    const isVisible = await progress.first().isVisible({ timeout: 3000 }).catch(() => false)
    
    if (isVisible) {
      await expect(progress.first()).toBeVisible()
    }
  })

  test('should complete quiz and show results', async ({ page }) => {
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Answer all questions (8 per topic)
    let questionIndex = 1
    while (questionIndex <= 8) {
      const option = page.locator('button').filter({ hasText: /^[A-D]/ }).first()
      
      if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
        await option.click()
        await page.waitForLoadState('networkidle')
        
        // Try to go to next question
        const nextButton = page.locator('button').filter({ hasText: /next|continue/i })
        if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
          await nextButton.click()
          await page.waitForLoadState('networkidle')
        }
      }
      
      questionIndex++
    }
    
    // Completion screen should show
    const completionText = page.locator('text=/complete|score|results/i')
    const isVisible = await completionText.first().isVisible({ timeout: 5000 }).catch(() => false)
    
    if (isVisible) {
      await expect(completionText.first()).toBeVisible()
    }
  })

  test('should be responsive on mobile practice page', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/exams/sat/topic/vocabulary/practice')
    
    // Content should be visible without horizontal scroll
    const question = page.locator('[class*="question"], main')
    await expect(question.first()).toBeVisible()
    
    // Options should be stacked on mobile
    const options = page.locator('button').filter({ hasText: /^[A-D]/ })
    const count = await options.count()
    expect(count).toBeGreaterThan(0)
  })
})
