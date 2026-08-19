# Phase 7: Testing & Performance Guide

## Overview
This document provides a complete guide for running tests and monitoring performance in Askesis.

---

## Part 1: Unit & Component Testing

### Setup
```bash
cd frontend
npm install
```

### Running Tests

#### Run all tests once
```bash
npm run test
```

#### Watch mode (re-run on file changes)
```bash
npm run test:watch
```

#### Coverage report
```bash
npm run test:coverage
```

### Test Structure
```
frontend/src/
├── __tests__/
│   └── test-utils.tsx          # Custom render with ExamProvider
├── components/
│   ├── DifficultyBadge.test.tsx
│   ├── Navbar.test.tsx
│   ├── common/
│   │   ├── DifficultyBadge.test.tsx
│   │   └── ProgressBar.test.tsx
│   └── exams/
│       └── ExamSelectionCard.test.tsx
```

### Writing New Tests

**Template:**
```typescript
import { render, screen } from '@/__tests__/test-utils'

describe('ComponentName', () => {
  it('should do something', () => {
    render(<Component />)
    expect(screen.getByText('expected text')).toBeInTheDocument()
  })
})
```

### Testing Best Practices

1. **Use `render` from test-utils** - Includes ExamProvider wrapper
2. **Query by accessible role** - `getByRole('button')` instead of `getByTestId`
3. **Use semantic queries** - `getByLabelText`, `getByPlaceholderText`
4. **Test user behavior** - Not implementation details
5. **Accessibility first** - Write tests for a11y features

### Coverage Targets
- Statements: > 70%
- Branches: > 65%
- Functions: > 70%
- Lines: > 70%

---

## Part 2: E2E Testing with Playwright

### Setup
```bash
cd frontend
npm install
npx playwright install  # Install browsers
```

### Running E2E Tests

#### Run all tests
```bash
npm run test:e2e
```

#### Interactive UI (recommended for debugging)
```bash
npm run test:e2e:ui
```

#### Run specific test file
```bash
npx playwright test e2e/practice.spec.ts
```

#### Run in specific browser
```bash
npx playwright test --project=firefox
```

#### Run single test
```bash
npx playwright test -g "should load home page"
```

### E2E Test Files
```
frontend/e2e/
├── home.spec.ts              # Homepage tests
├── exam-selection.spec.ts    # Exam selection flow
├── curriculum.spec.ts        # Curriculum and topic navigation
└── practice.spec.ts          # Practice quiz flow
```

### Debugging E2E Tests

```bash
# Debug mode - shows browser interactions
npx playwright test --debug

# Generate trace file
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

### Browsers Tested
- ✅ Desktop Chrome (Chromium)
- ✅ Desktop Firefox
- ✅ Desktop Safari (WebKit)
- ✅ Mobile Chrome (Pixel 5)
- ✅ Mobile Safari (iPhone 12)

---

## Part 3: Accessibility Testing

### Manual Accessibility Audit

#### Using Browser Extensions
1. **axe DevTools** (Chrome/Firefox)
   - Install from store
   - Click icon to scan page
   - Review violations

2. **WAVE** (WebAIM)
   - Install extension
   - Run on each page
   - Check for contrast, structure, labels

#### Using Command Line
```bash
# Run jest-axe tests
npm run test -- --testPathPattern="Navbar"  # Runs Navbar.test.tsx with axe
```

### Screen Reader Testing

#### Windows - NVDA (free)
1. Download: https://www.nvaccess.org/download/
2. Open page in browser
3. Start NVDA (Ctrl + Alt + N)
4. Test navigation and content reading

#### macOS - VoiceOver (built-in)
1. Enable: System Preferences > Accessibility > VoiceOver
2. Hotkey: Cmd + F5
3. Test navigation (Ctrl + Option + arrow keys)

### Keyboard Navigation Testing

**Test checklist:**
- [ ] Tab through all interactive elements
- [ ] Focus indicators visible on all elements
- [ ] Enter activates buttons
- [ ] Space activates checkboxes
- [ ] No focus traps
- [ ] Escape closes modals (future feature)

### Color Contrast Testing

1. **Chrome DevTools**
   - Right-click element → Inspect
   - Check contrast ratio in styles

2. **Contrast Checker**
   - Tool: https://webaim.org/resources/contrastchecker/
   - Minimum: 4.5:1 for text (AA)
   - Minimum: 3:1 for UI components (AA)

---

## Part 4: Performance Monitoring

### Core Web Vitals

Key metrics to monitor:
- **FCP** (First Contentful Paint): < 1.8s
- **LCP** (Largest Contentful Paint): < 2.5s
- **CLS** (Cumulative Layout Shift): < 0.1
- **FID** (First Input Delay): < 100ms
- **INP** (Interaction to Next Paint): < 200ms

### Tools

#### Chrome DevTools
1. Open DevTools (F12)
2. Performance tab → Record → Interact → Stop
3. Analyze flame chart and metrics

#### Lighthouse
1. DevTools → Lighthouse tab
2. Select: Performance, Accessibility, Best Practices, SEO
3. Generate report
4. Check scores and recommendations

#### Web Vitals Library
```bash
npm install web-vitals
```

```typescript
// In app/layout.tsx or _app.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

export function reportWebVitals(metric) {
  console.log(metric)
  // Send to analytics service
}
```

### Performance Budget
```
JavaScript: < 200KB (gzipped)
CSS: < 50KB (gzipped)
Images: < 300KB (per page)
Total: < 550KB
```

### Optimization Checklist
- [x] CSS containment on major components
- [x] Font-display: swap for custom fonts
- [ ] Lazy load images with Next.js Image
- [ ] Code split routes
- [ ] Memoize expensive computations
- [ ] Minify JavaScript/CSS

---

## Part 5: Responsive Design Testing

### Viewport Sizes to Test

**Mobile**
- 375×667 (iPhone SE)
- 390×844 (iPhone 12/13)

**Tablet**
- 768×1024 (iPad)
- 820×1180 (iPad Pro)

**Desktop**
- 1366×768 (Common laptop)
- 1920×1080 (Full HD)

### Testing in DevTools
1. Press F12 → Click device icon
2. Select device or custom size
3. Test at each breakpoint

### Testing via Playwright
```bash
# Mobile Chrome
npx playwright test --project="Mobile Chrome"

# Mobile Safari
npx playwright test --project="Mobile Safari"
```

### Checklist
- [ ] No horizontal scrollbar at any width
- [ ] Text readable without zoom
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Buttons full-width on mobile
- [ ] Hamburger menu appears at 860px
- [ ] Images responsive
- [ ] Forms usable on mobile

---

## Part 6: Browser Compatibility

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile Chrome/Safari (latest 2 versions)

### Testing Compatibility

```bash
# Browser Stack (paid service)
# Test live or automated

# BrowserStack Local
# Test local dev server
```

### Known Limitations
- IE11: Not supported
- Older Safari versions: Some CSS Grid features may not work
- Fallback: Responsive CSS Grid layout

---

## Part 7: Continuous Integration

### GitHub Actions Setup
```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test -- --coverage
      - run: npm run test:e2e
```

---

## Part 8: Issue Tracking

### Common Issues & Solutions

#### Issue: Tests fail locally but pass in CI
**Solution:**
- Clear node_modules: `rm -rf node_modules && npm install`
- Update snapshots: `npm run test -- -u`
- Check env variables: `.env.local` vs `.env.example`

#### Issue: E2E tests timeout
**Solution:**
- Increase timeout in playwright.config.ts
- Check if dev server is running on port 3002
- Verify network connectivity to backend

#### Issue: Accessibility violations in jest-axe
**Solution:**
- Add `aria-label` to unlabeled buttons
- Ensure form fields have associated labels
- Check color contrast with WCAG calculator

#### Issue: Performance regression
**Solution:**
- Run Lighthouse before and after changes
- Check bundle size with `npm run build`
- Profile with Chrome DevTools Performance tab

---

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development
npm run dev                # Start dev server

# Testing
npm run test              # Unit tests
npm run test:watch       # Unit tests (watch)
npm run test:coverage    # Coverage report
npm run test:e2e         # E2E tests
npm run test:e2e:ui      # E2E UI mode

# Linting
npm run lint             # Check code style

# Building
npm run build            # Production build
npm start                # Run production build
```

---

## Resources

- **Jest**: https://jestjs.io/docs/getting-started
- **React Testing Library**: https://testing-library.com/docs/react-testing-library/intro/
- **Playwright**: https://playwright.dev/docs/intro
- **WCAG 2.1**: https://www.w3.org/WAI/WCAG21/quickref/
- **Web Vitals**: https://web.dev/vitals/
- **Lighthouse**: https://developers.google.com/web/tools/lighthouse

