import { test, expect } from "@playwright/test"

test.setTimeout(120_000)

test("sitemap uses public, unique URLs and includes fallback products", async ({ request }) => {
  const response = await request.get("/sitemap.xml")
  expect(response.status()).toBe(200)
  const xml = await response.text()
  const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
  expect(urls.length).toBeGreaterThan(50)
  expect(new Set(urls).size).toBe(urls.length)
  expect(urls.every(u => u.startsWith("https://aoplastic.com/"))).toBeTruthy()
  expect(urls).toContain("https://aoplastic.com/products/abs/abs-extrusion/abs-2806-31")
  expect(urls).toContain("https://aoplastic.com/products/dispersion/coatings/finndisp-ac-402")
  expect(urls.some(u => u.includes("/polystyrene/ps-psv"))).toBeFalsy()
})

test("robots route has no static-file collision", async ({ request }) => {
  const response = await request.get("/robots.txt")
  expect(response.status()).toBe(200)
  expect(response.headers()["content-type"]).toContain("text/plain")
})

test("old section address redirects permanently", async ({ request }) => {
  const response = await request.get("/products/polystyrene/ps-psv-s", {
    maxRedirects: 0, headers: { "user-agent": "Googlebot" },
  })
  expect(response.status()).toBe(308)
  expect(response.headers().location).toBe("/products/polystyrene/psv-s")
})

test("product cannot be published under an unrelated category", async ({ request }) => {
  const response = await request.get("/products/dispersion/coatings/abs-1515-31", {
    headers: { "user-agent": "Googlebot" },
  })
  // Next.js loading boundaries may already have streamed HTTP 200.
  // In either case the invalid path must render not-found, never a product.
  expect([200, 404]).toContain(response.status())
  const html = await response.text()
  expect(html).toContain('name="robots" content="noindex"')
  expect(html).not.toContain('"@type":"Product"')
  expect(html).toContain('NEXT_HTTP_ERROR_FALLBACK;404')
})

test("product has factual structured data and a canonical URL", async ({ request }) => {
  const response = await request.get("/products/abs/abs-injection/abs-1515-31")
  expect(response.status()).toBe(200)
  const html = await response.text()
  expect(html).toContain('href="https://aoplastic.com/products/abs/abs-injection/abs-1515-31"')
  const data = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map(m => JSON.parse(m[1]))
  const product = data.find(item => item["@type"] === "Product")
  expect(product.additionalProperty.length).toBeGreaterThan(3)
  expect(product.offers).toBeUndefined()
})

test("homepage has one main heading and works at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/", { waitUntil: "domcontentloaded" })
  await expect(page.locator("h1")).toHaveCount(1)
  await expect(page.locator("h1")).toBeVisible({ timeout: 20_000 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBeTruthy()
})

test("machine-part titles distinguish published product codes", async ({ request }) => {
  const titles: string[] = []
  for (const id of ["ka-555", "ka-589"]) {
    const response = await request.get(`/products/machine-parts/parts-injection/${id}`)
    expect(response.status()).toBe(200)
    const html = await response.text()
    titles.push(html.match(/<title>(.*?)<\/title>/)?.[1] || "")
  }
  expect(titles.every(Boolean)).toBeTruthy()
  expect(titles[0]).not.toBe(titles[1])
})
