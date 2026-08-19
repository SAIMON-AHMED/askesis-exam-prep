import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { ExamProvider } from '@/context/ExamContext'

// Custom render function that includes providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ExamProvider>{children}</ExamProvider>
  )
  return render(ui, { wrapper: Wrapper, ...options })
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
