import { render, screen } from '@/__tests__/test-utils'
import { DifficultyBadge } from '@/components/common/DifficultyBadge'

describe('DifficultyBadge Component', () => {
  it('renders Beginner difficulty badge', () => {
    render(<DifficultyBadge difficulty="Beginner" />)
    const badge = screen.getByText('Beginner')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveClass('difficulty-badge')
  })

  it('renders Intermediate difficulty badge', () => {
    render(<DifficultyBadge difficulty="Intermediate" />)
    const badge = screen.getByText('Intermediate')
    expect(badge).toHaveClass('difficulty-badge')
  })

  it('renders Advanced difficulty badge', () => {
    render(<DifficultyBadge difficulty="Advanced" />)
    const badge = screen.getByText('Advanced')
    expect(badge).toHaveClass('difficulty-badge')
  })

  it('displays correct difficulty text', () => {
    const { rerender } = render(<DifficultyBadge difficulty="Beginner" />)
    expect(screen.getByText('Beginner')).toBeInTheDocument()

    rerender(<DifficultyBadge difficulty="Intermediate" />)
    expect(screen.getByText('Intermediate')).toBeInTheDocument()

    rerender(<DifficultyBadge difficulty="Advanced" />)
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    render(<DifficultyBadge difficulty="Beginner" className="custom-class" />)
    const badge = screen.getByText('Beginner')
    expect(badge).toHaveClass('difficulty-badge', 'custom-class')
  })

  it('applies inline styling with color values', () => {
    render(<DifficultyBadge difficulty="Beginner" />)
    const badge = screen.getByText('Beginner')
    
    // Check that inline styles are applied
    const styles = window.getComputedStyle(badge)
    expect(styles.borderRadius).toBe('999px')
    expect(styles.display).toBe('inline-block')
    expect(styles.fontSize).toBe('12px')
    expect(styles.fontWeight).toBe('600')
  })
})

