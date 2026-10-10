import { test, expect } from "@playwright/test"

test.use({ channel: "chrome" })

test("mobile hero fills changing viewport height without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 })
  await page.goto("/")
  const hero = page.locator(".home-hero")
  await expect(hero).toBeVisible()
  for (const height of [700, 844, 568]) {
    await page.setViewportSize({ width: 390, height })
    await expect.poll(() => hero.evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(height)
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390)
  }
})

test("only one hero video plays and videos pause offscreen", async ({ page }) => {
  await page.goto("/")
  const hero = page.locator(".home-hero")
  for (let index = 0; index < 5; index++) {
    await hero.getByRole("tab").nth(index).click()
    await expect.poll(() => hero.locator("video").evaluateAll(videos =>
      videos.filter(video => video instanceof HTMLVideoElement && !video.paused && video.readyState >= 2).length)).toBe(1)
    expect(await hero.locator("video").count()).toBeLessThanOrEqual(2)
  }
  await page.locator("#stats").evaluate(element => element.scrollIntoView({ behavior: "instant" }))
  await expect.poll(() => hero.locator("video").evaluateAll(videos => videos.every(video => video instanceof HTMLVideoElement && video.paused))).toBe(true)
})

test("laptop history uses normal flow and the first photo fills its frame", async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 })
  await page.goto("/about/mission")
  const period = page.locator(".history-flow").first()
  await expect(period).toBeVisible()
  await expect(page.locator(".history-immersive").first()).toBeHidden()
  await expect(period.locator("img")).toHaveCSS("object-fit", "cover")
})
