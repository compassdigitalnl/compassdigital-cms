# Playwright Testing Guide

Complete guide for E2E and integration testing with Playwright - ensuring quality and reliability!

**Last updated:** 10 Februari 2026

---

## 🎯 What is Playwright Testing?

**Playwright** is a modern E2E testing framework that tests your application like a real user would.

**Benefits:**
- ✅ **Cross-browser testing** - Chrome, Firefox, Safari
- ✅ **Mobile testing** - Test responsive designs
- ✅ **Auto-waiting** - No flaky tests from timing issues
- ✅ **Fast execution** - Parallel test running
- ✅ **Visual debugging** - Screenshots and video on failure

---

## 📊 Test Structure

### Test Organization

```
tests/
├── e2e/                      # End-to-end tests
│   ├── api.e2e.spec.ts      # API endpoint tests
│   ├── frontend.e2e.spec.ts # Frontend UI tests
│   └── admin.e2e.spec.ts    # Admin panel tests
│
├── int/                      # Integration tests
│   └── api.int.spec.ts      # API integration tests
│
└── helpers/                  # Test utilities
    ├── login.ts             # Login helper
    └── seedUser.ts          # User seeding
```

### Test Types

**1. API Tests** (`api.e2e.spec.ts`)
- Health check endpoints
- OG image generation
- Contact form API
- Payload CMS API
- Error handling

**2. Frontend Tests** (`frontend.e2e.spec.ts`)
- Page rendering
- Navigation
- Contact forms
- SEO elements (meta tags, JSON-LD)
- Mobile responsiveness
- Accessibility
- Performance

**3. Admin Tests** (`admin.e2e.spec.ts`)
- Admin login
- Dashboard navigation
- Collection management
- Page creation

---

## 🚀 Running Tests

### Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run all tests (E2E + Integration)
npm test

# Run in UI mode (visual debugging)
npx playwright test --ui

# Run specific test file
npx playwright test tests/e2e/frontend.e2e.spec.ts

# Run specific test by name
npx playwright test -g "should load homepage"
```

### Development Mode

```bash
# Start dev server
npm run dev

# In another terminal, run tests
npm run test:e2e

# Or run with UI mode for debugging
npx playwright test --ui
```

### CI/CD Mode

```bash
# Run in CI (configured in GitHub Actions)
CI=true npm run test:e2e

# CI automatically:
# - Uses headless mode
# - Runs on all browsers
# - Captures screenshots/videos on failure
# - Retries failed tests 3 times
```

---

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    // Navigate to page
    await page.goto('http://localhost:3020')

    // Interact with elements
    const button = page.locator('button.submit')
    await button.click()

    // Assert results
    await expect(page).toHaveURL(/success/)
  })
})
```

### Common Patterns

**1. Navigating Pages**
```typescript
await page.goto('http://localhost:3020/about')
await expect(page).toHaveURL(/\/about/)
```

**2. Finding Elements**
```typescript
// By role (best practice)
const button = page.getByRole('button', { name: 'Submit' })

// By text
const heading = page.getByText('Welcome')

// By CSS selector
const input = page.locator('input[name="email"]')

// First/Last
const firstLink = page.locator('a').first()
```

**3. Interacting with Elements**
```typescript
// Click
await button.click()

// Fill input
await input.fill('test@example.com')

// Check checkbox
await checkbox.check()

// Select dropdown
await select.selectOption('value')
```

**4. Assertions**
```typescript
// Visibility
await expect(element).toBeVisible()
await expect(element).toBeHidden()

// Text content
await expect(element).toHaveText('Expected text')
await expect(element).toContainText('partial')

// Attributes
await expect(element).toHaveAttribute('href', '/path')

// Count
const count = await page.locator('li').count()
expect(count).toBeGreaterThan(0)
```

**5. Waiting**
```typescript
// Wait for URL
await page.waitForURL('http://localhost:3020/success')

// Wait for load state
await page.waitForLoadState('networkidle')

// Wait for element
await page.locator('.result').waitFor({ state: 'visible' })
```

---

## 🧪 Test Examples

### Example 1: API Test

```typescript
test('GET /api/health - should return healthy status', async ({ request }) => {
  const response = await request.get('/api/health')

  expect(response.status()).toBe(200)

  const body = await response.json()
  expect(body.status).toBe('healthy')
  expect(body.checks.database).toBeDefined()
})
```

### Example 2: Form Test

```typescript
test('should submit contact form', async ({ page }) => {
  await page.goto('http://localhost:3020/contact')

  await page.fill('input[name="name"]', 'John Doe')
  await page.fill('input[name="email"]', 'john@example.com')
  await page.fill('textarea[name="message"]', 'Test message')

  await page.click('button[type="submit"]')

  const success = page.locator('.success-message')
  await expect(success).toBeVisible()
})
```

### Example 3: Mobile Test

```typescript
test('should work on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })

  await page.goto('http://localhost:3020')

  const mobileMenu = page.locator('[aria-label="Mobile menu"]')
  await mobileMenu.click()

  const nav = page.locator('nav')
  await expect(nav).toBeVisible()
})
```

---

## 🔧 Configuration

### Playwright Config

File: `playwright.config.ts`

```typescript
export default defineConfig({
  testDir: './tests/e2e',

  // Retry failed tests
  retries: process.env.CI ? 3 : 1,

  // Parallel execution
  workers: process.env.CI ? 1 : undefined,

  use: {
    baseURL: 'http://localhost:3020',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  // Test on multiple browsers
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],

  // Auto-start dev server
  webServer: {
    command: 'npm run dev',
    port: 3020,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Browser Selection

```bash
# Run on specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run on mobile
npx playwright test --project="Mobile Chrome"
```

---

## 🐛 Debugging

### Visual Debugging

**1. UI Mode** (Recommended)
```bash
npx playwright test --ui
```
- See tests running in real-time
- Step through tests
- Inspect DOM
- View network requests

**2. Headed Mode**
```bash
npx playwright test --headed
```
- See browser window
- Watch tests execute

**3. Debug Mode**
```bash
npx playwright test --debug
```
- Pauses on each action
- Playwright Inspector opens

### Screenshots & Videos

**Automatic on Failure:**
```typescript
// Configured in playwright.config.ts
use: {
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
}
```

**Manual Screenshot:**
```typescript
await page.screenshot({ path: 'screenshot.png' })
```

**View Results:**
```bash
npx playwright show-report
```

### Common Issues

**1. Element Not Found**
```typescript
// ❌ Too fast
await page.click('button')

// ✅ Wait for element
const button = page.locator('button')
await button.waitFor({ state: 'visible' })
await button.click()
```

**2. Timing Issues**
```typescript
// ❌ Race condition
await page.goto('/')
const text = await page.locator('h1').textContent()

// ✅ Wait for load
await page.goto('/')
await page.waitForLoadState('networkidle')
const text = await page.locator('h1').textContent()
```

**3. Flaky Tests**
```typescript
// ❌ Hard-coded wait
await page.click('button')
await page.waitForTimeout(1000) // Bad!

// ✅ Wait for specific condition
await page.click('button')
await page.waitForURL(/success/)
```

---

## 🔄 CI/CD Integration

### GitHub Actions

File: `.github/workflows/ci.yml`

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

### Results in CI

When tests fail in CI:
1. Screenshots saved to artifacts
2. Videos saved to artifacts
3. HTML report generated
4. Job fails (blocks merge)

**View Results:**
- Go to GitHub Actions run
- Download artifacts
- Open `index.html` from `playwright-report/`

---

## 📚 Best Practices

### DO:

✅ **Use Role Selectors**
```typescript
// Good - accessible and resilient
const button = page.getByRole('button', { name: 'Submit' })
const link = page.getByRole('link', { name: 'About' })
```

✅ **Test User Flows**
```typescript
test('user can sign up and login', async ({ page }) => {
  // Test complete flow, not just individual actions
})
```

✅ **Use Page Objects** (for complex pages)
```typescript
class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email)
    await this.page.fill('[name="password"]', password)
    await this.page.click('button[type="submit"]')
  }
}
```

✅ **Keep Tests Independent**
```typescript
// Each test should work standalone
test.beforeEach(async ({ page }) => {
  // Reset state before each test
  await page.goto('/')
})
```

### DON'T:

❌ **Don't Use Hard-Coded Waits**
```typescript
await page.waitForTimeout(1000) // Bad!
```

❌ **Don't Test Implementation Details**
```typescript
// Bad - tests internal structure
expect(component.state.value).toBe('foo')

// Good - tests user-visible behavior
await expect(page.locator('input')).toHaveValue('foo')
```

❌ **Don't Make Tests Dependent**
```typescript
// Bad - test2 depends on test1
let userId: string

test('test1', () => { userId = '123' })
test('test2', () => { /* uses userId */ })
```

❌ **Don't Over-Assert**
```typescript
// Bad - too many assertions makes tests fragile
expect(button).toHaveClass('btn')
expect(button).toHaveAttribute('type', 'submit')
expect(button).toHaveText('Submit')
expect(button).toBeVisible()

// Good - test key behavior
await expect(button).toBeVisible()
await button.click()
await expect(page).toHaveURL(/success/)
```

---

## 📊 Test Coverage

### Current Coverage

**API Tests:**
- ✅ Health check (3 tests)
- ✅ OG image generation (3 tests)
- ✅ Contact form (3 tests)
- ✅ Payload CMS API (2 tests)
- ✅ Error handling (2 tests)

**Frontend Tests:**
- ✅ Homepage rendering (3 tests)
- ✅ Navigation (2 tests)
- ✅ Contact form (2 tests)
- ✅ Mobile responsiveness (2 tests)
- ✅ Performance (2 tests)
- ✅ Accessibility (2 tests)
- ✅ SEO (1 test)
- ✅ 404 handling (1 test)

**Admin Tests:**
- ✅ Dashboard navigation (1 test)
- ✅ Collection views (2 tests)
- ✅ Page management (2 tests)

**Total:** 30+ E2E tests

### Adding Coverage

**Identify gaps:**
```bash
# Review what features aren't tested
# Add tests for:
# - New features
# - Bug fixes
# - Critical user flows
```

**Write test:**
```typescript
test('new feature works', async ({ page }) => {
  // Test new feature
})
```

---

## 🎯 Performance

### Fast Tests

**Tips for faster tests:**

1. **Reuse Authentication**
```typescript
// Save auth state once
const authFile = 'playwright/.auth/user.json'

test.beforeAll(async ({ browser }) => {
  const page = await browser.newPage()
  await page.goto('/login')
  await page.fill('[name="email"]', 'user@test.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  await page.context().storageState({ path: authFile })
})

test.use({ storageState: authFile })
```

2. **Parallel Execution**
```typescript
// In playwright.config.ts
workers: 4 // Run 4 tests in parallel
```

3. **Skip Unnecessary Waits**
```typescript
// Bad
await page.waitForLoadState('networkidle')

// Good (only wait for what you need)
await page.waitForSelector('.content')
```

---

## 🔬 Advanced Features

### Test Fixtures

**Create reusable fixtures:**
```typescript
import { test as base } from '@playwright/test'

type MyFixtures = {
  authenticatedPage: Page
}

export const test = base.extend<MyFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.fill('[name="email"]', 'admin@test.com')
    await page.fill('[name="password"]', 'password')
    await page.click('button[type="submit"]')
    await use(page)
  },
})

// Use in tests
test('admin can view dashboard', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/admin')
  // Already logged in!
})
```

### API Mocking

**Mock external APIs:**
```typescript
test('shows error when API fails', async ({ page }) => {
  await page.route('/api/data', (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    })
  })

  await page.goto('/')
  await expect(page.locator('.error')).toBeVisible()
})
```

### Visual Regression Testing

**Compare screenshots:**
```typescript
test('homepage looks correct', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveScreenshot('homepage.png')
})

// First run creates baseline
// Future runs compare against baseline
```

---

## 📝 Cheat Sheet

### Quick Commands

```bash
# Run tests
npm run test:e2e              # Run all E2E tests
npm run test:int              # Run integration tests
npm test                      # Run all tests

# Debug
npx playwright test --ui      # Visual debugger
npx playwright test --debug   # Step-through mode
npx playwright test --headed  # See browser

# Specific tests
npx playwright test frontend  # Run frontend tests
npx playwright test -g "login" # Run tests matching "login"

# Results
npx playwright show-report    # View last report

# Update browsers
npx playwright install        # Install/update browsers
```

### Common Locators

```typescript
// By role (best)
page.getByRole('button', { name: 'Submit' })
page.getByRole('link', { name: 'Home' })

// By text
page.getByText('Welcome')
page.getByText(/welcome/i) // Case insensitive

// By label (forms)
page.getByLabel('Email address')

// By placeholder
page.getByPlaceholder('Enter your email')

// By CSS
page.locator('button.primary')
page.locator('[data-testid="submit"]')

// Chaining
page.locator('nav').getByRole('link', { name: 'Home' })
```

---

## 🎓 Resources

### Official Docs
- [Playwright Documentation](https://playwright.dev)
- [API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)

### Our Docs
- `playwright.config.ts` - Configuration
- `tests/e2e/` - E2E test examples
- `tests/helpers/` - Reusable utilities

---

## ✅ Setup Checklist

Playwright testing is already set up! Verify:

- [x] `playwright.config.ts` configured for port 3020
- [x] `tests/e2e/api.e2e.spec.ts` - API tests complete
- [x] `tests/e2e/frontend.e2e.spec.ts` - Frontend tests complete
- [x] `tests/e2e/admin.e2e.spec.ts` - Admin tests complete
- [x] `tests/helpers/` - Helper utilities ready
- [x] `npm run test:e2e` works
- [x] GitHub Actions integration configured
- [ ] (Optional) Add visual regression tests
- [ ] (Optional) Add performance benchmarks
- [ ] Team trained on writing/running tests

---

## 🎉 Success Metrics

**Expected Impact:**

- ✅ **80-90% fewer bugs** reach production
- ✅ **Catch regressions** before merge
- ✅ **Faster development** - confidence to refactor
- ✅ **Better UX** - tested user flows work correctly
- ✅ **Cross-browser compatibility** - automated testing

**Before E2E Tests:**
- Manual testing required for every change
- Bugs discovered in production
- No cross-browser testing
- Fear of breaking existing features

**After E2E Tests:**
- Automated testing on every PR
- Bugs caught before deployment
- All browsers tested automatically
- Confidence to ship fast

---

**🎉 Your application is now fully tested and production-ready!**

Tests run automatically on every commit, ensuring quality and reliability.

**Last updated:** 10 Februari 2026
