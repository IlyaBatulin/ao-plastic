import { test as setup, expect } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"
import dotenv from "dotenv"

dotenv.config({ path: path.join(__dirname, "../.env.local") })

const authFile = path.join(__dirname, ".auth/user.json")

setup("authenticate", async ({ playwright, baseURL }) => {
  const password = process.env.SITE_PASSWORD

  fs.mkdirSync(path.dirname(authFile), { recursive: true })

  if (!password) {
    fs.writeFileSync(authFile, JSON.stringify({ cookies: [], origins: [] }))
    return
  }

  const request = await playwright.request.newContext({ baseURL })
  const response = await request.post("/api/site-auth", {
    data: { password },
  })

  expect(response.ok()).toBeTruthy()

  await request.storageState({ path: authFile })
  await request.dispose()
})
