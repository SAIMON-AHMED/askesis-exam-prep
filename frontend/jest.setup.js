// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// next/navigation hooks require a real App Router context; provide safe
// no-op defaults so components can render in jsdom tests.
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}))
