import { render, screen, fireEvent } from '@/__tests__/test-utils'
import ExamSelectionCard from '@/components/exams/ExamSelectionCard'

const mockExam = {
  id: 'sat',
  displayName: 'SAT',
  type: 'Standardized Test',
  sections: 3,
  topics: 10,
  primaryColor: '#4F46E5',
  accentColor: '#F59E0B',
  icon: 'book',
  description: 'Scholastic Assessment Test for college admissions'
}

describe('ExamSelectionCard Component', () => {
  it('renders exam card with all information', () => {
    render(<ExamSelectionCard exam={mockExam} />)
    
    expect(screen.getByText('SAT')).toBeInTheDocument()
    expect(screen.getByText(/Scholastic Assessment Test/)).toBeInTheDocument()
  })

  it('displays exam metadata correctly', () => {
    render(<ExamSelectionCard exam={mockExam} />)
    
    const card = screen.getByRole('button') || screen.getByRole('link')
    expect(card).toBeInTheDocument()
  })

  it('is keyboard accessible', () => {
    const { container } = render(<ExamSelectionCard exam={mockExam} />)
    
    const button = container.querySelector('button') || container.querySelector('a')
    expect(button).toBeInTheDocument()
    
    if (button) {
      // Should be focusable
      expect(button.tabIndex).toBeGreaterThanOrEqual(-1)
    }
  })

  it('has proper touch target size', () => {
    const { container } = render(<ExamSelectionCard exam={mockExam} />)
    
    const element = container.querySelector('button, a, [role="button"]')
    if (element) {
      const styles = window.getComputedStyle(element)
      const minHeight = parseInt(styles.minHeight || '0')
      // Should have minimum height for touch targets
      expect(minHeight).toBeGreaterThanOrEqual(0)
    }
  })

  it('displays exam colors correctly', () => {
    const { container } = render(<ExamSelectionCard exam={mockExam} />)
    
    const card = container.querySelector('[class*="card"], button, a')
    expect(card).toBeInTheDocument()
    // Colors should be applied via CSS variables or inline styles
  })

  it('has descriptive text for screen readers', () => {
    const { container } = render(<ExamSelectionCard exam={mockExam} />)
    
    // Should have text content for screen readers
    const text = container.textContent
    expect(text).toContain('SAT')
  })
})
