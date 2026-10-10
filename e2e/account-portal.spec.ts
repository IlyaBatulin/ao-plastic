import { test, expect } from "@playwright/test";

test.use({ channel: process.env.PW_CHANNEL });

test("local demo entry uses the existing account endpoint", async ({ page }) => {
  const response = await page.request.post("/api/customer/demo-auth");
  test.skip(response.status() === 404, "Demo entry is development-only");
  expect(response.ok()).toBeTruthy();
  await page.goto("/account");
  await expect(page.getByRole("heading", { name: "Ваш кабинет" })).toBeVisible();
  await expect(page.getByLabel("Тестовый профиль")).toBeVisible();
});

const sample = {
  demoMode: true,
  profile: {
    id: "qa-customer",
    company_name: "Тестовая компания",
    contact_name: "Анна Крылова",
  },
  manager: { name: "Отдел продаж", email: "info@td-plastic.ru" },
  orders: [
    {
      id: 1012,
      created_at: new Date().toISOString(),
      items: [
        { id: 1, quantity: 10, products: { name: "АБС-пластик 2020-31" } },
      ],
    },
  ],
  reservations: [],
  reservationsAvailable: true,
};
async function open(page: import("@playwright/test").Page, demoMode = true) {
  await page.route("**/api/customer/account", (route) =>
    route.fulfill({ json: { ...sample, demoMode } }),
  );
  await page.goto("/account");
  await expect(
    page.getByRole("heading", { name: "Ваш кабинет" }),
  ).toBeVisible();
  const consent = page.getByRole("button", { name: "Принять", exact: true });
  await consent.waitFor({ state: "visible", timeout: 7000 }).catch(() => {});
  if (await consent.isVisible()) await consent.click();
}
async function selectProduct(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: "Новая заявка", exact: true }).click();
  await page
    .getByRole("button", { name: /Полистирол вспенивающийся/ })
    .first()
    .click();
  await page.getByLabel("Количество", { exact: true }).fill("12.5");
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
}
async function fillDelivery(page: import("@playwright/test").Page) {
  const date = new Date();
  date.setDate(date.getDate() + 10);
  const value = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
  await page.getByLabel("Желаемая дата", { exact: true }).fill(value);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
}
test("demo order, draft, levels and responsive layout", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let sent = 0;
  await page.route("**/api/customer/reservations", (route) => {
    sent++;
    return route.fulfill({ status: 500, json: {} });
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await open(page);
  await page.screenshot({
    path: testInfo.outputPath("portal-overview.png"),
    fullPage: true,
  });
  await selectProduct(page);
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page.locator(".cp-error")).toContainText("Выберите");
  await page.getByLabel("Доставка", { exact: true }).check();
  const date = new Date();
  date.setDate(date.getDate() + 10);
  await page
    .getByLabel("Желаемая дата", { exact: true })
    .fill(
      [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-"),
    );
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page.locator(".cp-error")).toContainText("адрес");
  await page.getByLabel("Адрес доставки").fill("Тула, Промышленная, 12");
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Проверьте заявку" }),
  ).toBeVisible();
  await page.screenshot({
    path: testInfo.outputPath("portal-review.png"),
    fullPage: true,
  });
  await page.reload();
  await page.getByRole("button", { name: "Новая заявка", exact: true }).click();
  await expect(page.getByLabel("Количество", { exact: true })).toHaveValue(
    "12.5",
  );
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await expect(page.getByLabel("Адрес доставки")).toHaveValue(
    "Тула, Промышленная, 12",
  );
  await page.getByRole("button", { name: "Продолжить", exact: true }).click();
  await page.getByRole("button", { name: "Сохранить тестовую заявку" }).click();
  await expect(
    page.getByRole("heading", { name: "Тестовая заявка сохранена" }),
  ).toBeVisible();
  expect(sent).toBe(0);
  await page.getByRole("button", { name: "Перейти к заявкам" }).click();
  await expect(page.getByRole("cell", { name: "12.5 т" })).toBeVisible();
  await page.reload();
  await expect(page.getByRole("cell", { name: "12.5 т" })).toBeVisible();
  await page.getByLabel("Тестовый профиль").selectOption("partner");
  await expect(
    page.getByRole("heading", { name: "История сотрудничества" }),
  ).toBeVisible();
  await expect(page.getByRole("cell", { name: "12.5 т" })).toHaveCount(0);
  await page.screenshot({
    path: testInfo.outputPath("portal-partner.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Поставки", exact: true }).click();
  await page.getByRole("button", { name: "Следующий месяц" }).click();
  await page.getByRole("button", { name: "Предыдущий месяц" }).click();
  await page.getByRole("button", { name: "Документы", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Документы по вашим заказам" }),
  ).toBeVisible();
  await page.getByLabel("Тестовый профиль").selectOption("gold");
  await expect(
    page.getByRole("button", { name: "Аналитика", exact: true }),
  ).toBeVisible();
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    await expect(
      page.getByRole("heading", { name: "Ваш кабинет" }),
    ).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    expect(await page.locator(".cp-panel").evaluateAll(elements =>
      elements.every(element => element.getBoundingClientRect().right <= window.innerWidth)
    )).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath("portal-mobile-" + width + ".png"),
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Новая заявка", exact: true })
      .click();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width);
    await page.getByRole("button", { name: "Обзор", exact: true }).click();
  }
  expect(errors).toEqual([]);
});
test("failed submission stays on review and supports retry", async ({
  page,
}) => {
  await open(page, false);
  await page.route("**/api/customer/reservations", (route) =>
    route.fulfill({
      status: 503,
      json: { error: "Сервис временно недоступен" },
    }),
  );
  await selectProduct(page);
  await fillDelivery(page);
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click();
  await expect(page.locator(".cp-error")).toHaveText(
    "Сервис временно недоступен",
  );
  await expect(
    page.getByRole("heading", { name: "Проверьте заявку" }),
  ).toBeVisible();
  await page.route("**/api/customer/reservations", (route) => {
    const body = route.request().postDataJSON();
    return route.fulfill({
      status: 201,
      json: {
        reservation: {
          id: 2026,
          product_name: body.productName,
          quantity: body.quantity,
          unit: body.unit,
          requested_delivery_date: body.requestedDeliveryDate,
          status: "requested",
        },
      },
    });
  });
  await page
    .getByRole("button", { name: "Отправить заявку", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Заявка сохранена", exact: true }),
  ).toBeVisible();
});

test("mobile order stays within the screen at every step", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 320, height: 844 });
  await open(page);
  await selectProduct(page);
  await fillDelivery(page);
  await expect(page.getByRole("heading", { name: "Проверьте заявку" })).toBeVisible();
  expect(await page.locator(".cp-panel, .cp-form-footer button").evaluateAll(elements =>
    elements.every(element => { const box = element.getBoundingClientRect(); return box.left >= 0 && box.right <= window.innerWidth })
  )).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("portal-mobile-review.png"), fullPage: true });
  await page.getByRole("button", { name: "Сохранить тестовую заявку" }).click();
  await expect(page.getByRole("heading", { name: "Тестовая заявка сохранена" })).toBeVisible();
});
