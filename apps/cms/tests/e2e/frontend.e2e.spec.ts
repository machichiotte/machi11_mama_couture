import { test, expect, Page } from '@playwright/test'

test.describe('Frontend', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    const context = await browser.newContext()
    page = await context.newPage()
  })

  test('can navigate and submit contact form', async ({ page }) => {
    // 1. Visit homepage
    await page.goto('/')

    // Check for contact link in header (usually) or footer
    const contactLinks = page.locator('a[href="/contact"]')
    await expect(contactLinks.first()).toBeVisible()

    // 2. Go to contact page
    await page.goto('/contact')

    // 3. Fill the form
    await page.fill('input[type="text"]', 'E2E Tester')
    await page.fill('input[type="email"]', 'e2e@test.com')
    await page.fill('textarea', 'This is an automated E2E test message.')

    // 4. Submit
    await page.click('button[type="submit"]')

    // 5. Check success message
    // Based on ContactForm.tsx, it shows successTitle when success is true
    await expect(page.locator('h3')).toContainText(/envoyé/i)
  })

  test('about page is accessible', async ({ page }) => {
    await page.goto('/about')
    // Use a more specific locator to avoid strict mode violation if logo is also an h1
    const heading = page.locator('main h1')
    await expect(heading.first()).toBeVisible()
  })
})
