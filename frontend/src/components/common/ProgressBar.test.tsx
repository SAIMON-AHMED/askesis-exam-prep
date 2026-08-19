import { render, screen } from '@/__tests__/test-utils'
import { ProgressBar } from '@/components/common/ProgressBar'

describe('ProgressBar Component', () => {
  it('renders progress bar correctly', () => {
    const { container } = render(<ProgressBar percent={50} />)
    const progressTrack = container.querySelector('.progress-track')
    expect(progressTrack).toBeInTheDocument()
  })

  it('renders 0% progress correctly', () => {
    const { container } = render(<ProgressBar percent={0} />)
    const progressFill = container.querySelector('.progress-fill') as HTMLElement
    expect(progressFill).toHaveStyle({ width: '0%' })
  })

  it('renders 100% progress correctly', () => {
    const { container } = render(<ProgressBar percent={100} />)
    const progressFill = container.querySelector('.progress-fill') as HTMLElement
    expect(progressFill).toHaveStyle({ width: '100%' })
  })

  it('renders partial progress correctly', () => {
    const { container } = render(<ProgressBar percent={75} />)
    const progressFill = container.querySelector('.progress-fill') as HTMLElement
    expect(progressFill).toHaveStyle({ width: '75%' })
  })

  it('shows percentage label when showLabel is true', () => {
    render(<ProgressBar percent={60} showLabel={true} />)
    expect(screen.getByText('60%')).toBeInTheDocument()
  })

  it('hides percentage label when showLabel is false', () => {
    render(<ProgressBar percent={60} showLabel={false} />)
    expect(screen.queryByText('60%')).not.toBeInTheDocument()
  })

  it('applies custom className', () => {
    const { container } = render(<ProgressBar percent={50} className="custom-class" />)
    const progressContainer = container.querySelector('.progress-container')
    expect(progressContainer).toHaveClass('custom-class')
  })

  it('clamps percentage between 0 and 100', () => {
    const { container: container1 } = render(<ProgressBar percent={-50} />)
    const progressFill1 = container1.querySelector('.progress-fill') as HTMLElement
    expect(progressFill1).toHaveStyle({ width: '0%' })

    const { container: container2 } = render(<ProgressBar percent={150} />)
    const progressFill2 = container2.querySelector('.progress-fill') as HTMLElement
    expect(progressFill2).toHaveStyle({ width: '100%' })
  })
})
