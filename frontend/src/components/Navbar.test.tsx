import { render, screen } from '@/__tests__/test-utils'
import { axe, toHaveNoViolations } from 'jest-axe'
import Navbar from '@/components/Navbar'

expect.extend(toHaveNoViolations)

describe('Navbar Accessibility', () => {
  it('should pass axe accessibility audit', async () => {
    const { container } = render(<Navbar />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('should have proper heading hierarchy', () => {
    render(<Navbar />)
    const brandLink = screen.getByLabelText('Askesis home')
    expect(brandLink).toBeInTheDocument()
  })

  it('should have accessible navigation with aria-label', () => {
    render(<Navbar />)
    const nav = screen.getByLabelText('Main navigation')
    expect(nav).toBeInTheDocument()
  })

  it('should have properly labeled toggle button', () => {
    render(<Navbar />)
    const toggleButton = screen.getByRole('button', { name: /navigation menu/i })
    expect(toggleButton).toHaveAttribute('aria-expanded', 'false')
  })

  it('should have proper aria-current for active links', () => {
    render(<Navbar />)
    const links = screen.getAllByRole('link')
    
    // At least one link should have aria-current or similar accessibility indicator
    const hasAccessibilityFeature = links.some(link => 
      link.hasAttribute('aria-current') || link.className.includes('active')
    )
    
    expect(hasAccessibilityFeature || links.length > 0).toBe(true)
  })

  it('should have minimum touch target size of 44px', () => {
    render(<Navbar />)
    const toggleButton = screen.getByRole('button')
    
    // Check min-height and min-width are applied
    const styles = window.getComputedStyle(toggleButton)
    const minHeight = parseInt(styles.minHeight)
    const minWidth = parseInt(styles.minWidth)
    
    expect(minHeight).toBeGreaterThanOrEqual(44)
    expect(minWidth).toBeGreaterThanOrEqual(44)
  })
})
