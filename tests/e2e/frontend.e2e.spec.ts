import { test, expect } from '@playwright/test'

/**
 * Frontend E2E Tests for Business Website Template
 *
 * Tests cover:
 * - Page rendering
 * - Navigation
 * - Contact form
 * - SEO elements
 * - Mobile responsiveness
 */

test.describe('Frontend - Business Website', () => {
  const baseURL = 'http://localhost:3020'

  // ===========================================================================
  // Homepage Tests
  // ===========================================================================
  test('should load homepage successfully', async ({ page }) => {
    await page.goto(baseURL)

    // Check page loads
    await expect(page).toHaveURL(baseURL + '/')

    // Check for layout elements
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()
  })

  test('should have proper meta tags on homepage', async ({ page }) => {
    await page.goto(baseURL)

    // Check title exists
    await expect(page).toHaveTitle(/.+/)

    // Check meta description
    const metaDescription = page.locator('meta[name="description"]')
    await expect(metaDescription).toHaveAttribute('content', /.+/)

    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]')
    await expect(ogTitle).toHaveAttribute('content', /.+/)

    const ogImage = page.locator('meta[property="og:image"]')
    await expect(ogImage).toHaveAttribute('content', /.+/)
  })

  test('should have JSON-LD structured data', async ({ page }) => {
    await page.goto(baseURL)

    // Check for JSON-LD script tags
    const jsonLdScripts = page.locator('script[type="application/ld+json"]')
    const count = await jsonLdScripts.count()

    expect(count).toBeGreaterThanOrEqual(1)

    // Validate JSON-LD is valid JSON
    const firstScript = await jsonLdScripts.first().textContent()
    expect(firstScript).toBeTruthy()

    const jsonData = JSON.parse(firstScript || '{}')
    expect(jsonData['@context']).toBe('https://schema.org')
    expect(jsonData['@type']).toBeTruthy()
  })

  // ===========================================================================
  // Navigation Tests
  // ===========================================================================
  test('should navigate between pages', async ({ page }) => {
    await page.goto(baseURL)

    // Find first navigation link
    const navLinks = page.locator('nav a[href^="/"]')
    const linkCount = await navLinks.count()

    if (linkCount > 0) {
      const firstLink = navLinks.first()
      const href = await firstLink.getAttribute('href')

      await firstLink.click()

      // Wait for navigation
      await page.waitForURL(baseURL + href)
      await expect(page).toHaveURL(baseURL + href)
    }
  })

  test('should have working logo link to homepage', async ({ page }) => {
    // Go to a subpage first
    await page.goto(baseURL + '/about')

    // Click logo (usually in header)
    const logoLink = page.locator('header a[href="/"]').first()
    await logoLink.click()

    // Should return to homepage
    await page.waitForURL(baseURL + '/')
    await expect(page).toHaveURL(baseURL + '/')
  })

  // ===========================================================================
  // Contact Form Tests
  // ===========================================================================
  test('should display contact form', async ({ page }) => {
    // Try to find contact page
    await page.goto(baseURL + '/contact')

    // Check if contact form exists
    const form = page.locator('form').first()
    const isVisible = await form.isVisible().catch(() => false)

    if (isVisible) {
      // Check for typical form fields
      const nameInput = page.locator('input[name*="name" i]').first()
      const emailInput = page.locator('input[name*="email" i]').first()
      const messageInput = page.locator('textarea[name*="message" i]').first()

      await expect(nameInput).toBeVisible()
      await expect(emailInput).toBeVisible()
      await expect(messageInput).toBeVisible()
    }
  })

  test('should validate contact form fields', async ({ page }) => {
    await page.goto(baseURL + '/contact')

    const form = page.locator('form').first()
    const isVisible = await form.isVisible().catch(() => false)

    if (isVisible) {
      const submitButton = page.locator('button[type="submit"]').first()

      // Try to submit empty form
      await submitButton.click()

      // Should show validation errors (HTML5 or custom)
      // Check for HTML5 validation or custom error messages
      const emailInput = page.locator('input[name*="email" i]').first()
      const isRequired = await emailInput.getAttribute('required')

      expect(isRequired).not.toBeNull()
    }
  })

  // ===========================================================================
  // Mobile Responsiveness Tests
  // ===========================================================================
  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(baseURL)

    // Check header is visible and adapted for mobile
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Check for mobile menu button (hamburger)
    const mobileMenuButton = page.locator('button[aria-label*="menu" i]').first()
    const hasMobileMenu = await mobileMenuButton.isVisible().catch(() => false)

    if (hasMobileMenu) {
      await mobileMenuButton.click()

      // Mobile nav should appear
      const mobileNav = page.locator('nav').first()
      await expect(mobileNav).toBeVisible()
    }
  })

  test('should load images on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })

    await page.goto(baseURL)

    // Wait for images to load
    await page.waitForLoadState('networkidle')

    // Check first image loads
    const firstImage = page.locator('img').first()
    const isVisible = await firstImage.isVisible().catch(() => false)

    if (isVisible) {
      await expect(firstImage).toHaveAttribute('src', /.+/)

      // Check for alt text (accessibility)
      const alt = await firstImage.getAttribute('alt')
      expect(alt).toBeDefined()
    }
  })

  // ===========================================================================
  // Performance Tests
  // ===========================================================================
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto(baseURL)
    await page.waitForLoadState('domcontentloaded')

    const loadTime = Date.now() - startTime

    // Should load within 5 seconds
    expect(loadTime).toBeLessThan(5000)
  })

  test('should not have console errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto(baseURL)

    // Wait for page to fully load
    await page.waitForLoadState('networkidle')

    // Should have no critical console errors
    // Filter out known non-critical errors if needed
    const criticalErrors = errors.filter(
      (err) =>
        !err.includes('favicon') && // Favicon 404s are common and non-critical
        !err.includes('Google Analytics') && // GA might not be loaded in dev
        !err.includes('reCAPTCHA'), // reCAPTCHA might not be configured
    )

    expect(criticalErrors.length).toBe(0)
  })

  // ===========================================================================
  // Accessibility Tests
  // ===========================================================================
  test('should have accessible navigation', async ({ page }) => {
    await page.goto(baseURL)

    // Check for skip link (accessibility best practice)
    const skipLink = page.locator('a[href="#main"]').first()
    const hasSkipLink = await skipLink.isVisible().catch(() => false)

    // Check for semantic nav element
    const nav = page.locator('nav[role="navigation"]').first()
    const semanticNav = await nav.isVisible().catch(() => false)

    // At least one should be present
    expect(hasSkipLink || semanticNav).toBeTruthy()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(baseURL)

    // Check for h1 (should have exactly one)
    const h1Count = await page.locator('h1').count()
    expect(h1Count).toBe(1)

    // h1 should not be empty
    const h1Text = await page.locator('h1').first().textContent()
    expect(h1Text?.trim().length).toBeGreaterThan(0)
  })

  // ===========================================================================
  // Layout Builder Tests
  // ===========================================================================
  test('should render layout builder blocks', async ({ page }) => {
    await page.goto(baseURL)

    // Check if any layout blocks are rendered
    // Common block types: hero, features, testimonials, etc.
    const mainContent = page.locator('main').first()
    await expect(mainContent).toBeVisible()

    // Check main has content
    const mainText = await mainContent.textContent()
    expect(mainText?.trim().length).toBeGreaterThan(0)
  })

  // ===========================================================================
  // 404 Page Test
  // ===========================================================================
  test('should show 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto(baseURL + '/this-page-does-not-exist-12345')

    // Should return 404 status
    expect(response?.status()).toBe(404)

    // Should show some content (not blank page)
    const bodyText = await page.locator('body').textContent()
    expect(bodyText?.trim().length).toBeGreaterThan(0)

    // Should mention "404" or "not found"
    expect(bodyText?.toLowerCase()).toMatch(/404|not found|page not found/)
  })
})
