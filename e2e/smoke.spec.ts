import { test, expect } from "@playwright/test"

test.setTimeout(60_000)

const publicPages = [
  { path: "/", heading: /технолог|пластик|будущ/i },
  { path: "/products", heading: /каталог|продук/i },
  { path: "/about", heading: /компани|about/i },
  { path: "/contacts", heading: /контакт|contact/i },
  { path: "/cart", heading: /корзин|cart/i },
  { path: "/about/news", heading: /новост|news/i },
  { path: "/certificates", heading: /сертификат|certificate/i },
]

for (const { path, heading } of publicPages) {
  test(`страница ${path} загружается`, async ({ page }) => {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" })
    expect(response?.status()).toBeLessThan(400)

    if (path === "/") {
      await page.waitForFunction(
        () => !document.documentElement.classList.contains("splash-pending"),
        { timeout: 20_000 },
      )
    }

    await expect(page.locator("body")).toBeVisible()
    await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(heading, {
      timeout: 15_000,
    })
  })
}

test("навигация с главной на каталог", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("splash-pending"),
    { timeout: 20_000 },
  )

  await page.locator('footer a[href="/products"]').click()

  await expect(page).toHaveURL(/\/products/)
  await expect(page.getByRole("heading", { level: 1 }).first()).toContainText(/каталог|продук/i)
})

test("главная содержит ключевые секции", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await page.waitForFunction(
    () => !document.documentElement.classList.contains("splash-pending"),
    { timeout: 20_000 },
  )

  await expect(page.locator("footer")).toBeVisible()

  // На главной шапка появляется после прокрутки
  await page.evaluate(() => window.scrollTo(0, 200))
  await expect(page.locator("header")).toBeVisible({ timeout: 10_000 })
})
