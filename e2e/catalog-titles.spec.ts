import { test, expect } from "@playwright/test"

test.use({ channel: "chrome" })

for (const category of ["hoztovary", "machine-parts", "dispersion", "polystyrene", "abs", "styrene"]) {
  test(`${category}: title text stays inside its container`, async ({ page }) => {
    await page.goto(`/products/${category}`)
    const title = page.locator("h1")
    await expect(title).toBeVisible()
    await page.evaluate(() => document.fonts.ready)
    for (const width of [320, 390, 768, 1024, 1366]) {
      await page.setViewportSize({ width, height: 844 })
      await expect.poll(() => title.evaluate(element => {
        const box = element.getBoundingClientRect()
        const range = document.createRange()
        range.selectNodeContents(element)
        return [...range.getClientRects()].every(rect => rect.left >= box.left - 1 && rect.right <= box.right + 1)
          && element.scrollWidth <= element.clientWidth + 1
      })).toBe(true)
    }
  })
}
