import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173/services/konsum";
const CATEGORY = "PW_TEST" + Date.now();

const USERS = {
  user1: { username: "user1", password: "secret" },
};

async function login(page) {
  await page.goto(BASE);
  await page.click('a:has-text("Categories")');
  await page.waitForSelector("#password", { timeout: 5_000 });
  await page.fill("#username", USERS.user1.username);
  await page.fill("#password", USERS.user1.password);
  await page.click('button[type="submit"]');
  await page.waitForSelector("#password", { state: "hidden", timeout: 5_000 });
}

test.describe("Category CRUD", () => {
  test("creates category and shows it in list", async ({ page }) => {
    await login(page);

    // Create category
    await page.click('a:has-text("New Category")');
    await page.fill("#name", CATEGORY);
    await page.fill("#description", "Playwright test");
    await page.fill("#unit", "kWh");
    await page.fill("#fractionalDigits", "2");
    await page.click('button[type="submit"]');

    // Check it appears in list
    await page.click('a:has-text("Categories")');
    await expect(page.locator(`text=${CATEGORY}`)).toBeVisible({ timeout: 3_000 });
  });
});

// Skip all other tests for now
test.describe.skip("1 · Login", () => {});
test.describe.skip("2 · Home & navigation", () => {});
test.describe.skip("3 · Categories list", () => {});
test.describe.skip("4 · Add category", () => {});
test.describe.skip("5 · Category detail", () => {});
test.describe.skip("6 · Insert values", () => {});
test.describe.skip("7 · Category value list", () => {});
test.describe.skip("8 · Category graph", () => {});
test.describe.skip("9 · Admin page", () => {});
test.describe.skip("10 · Cleanup", () => {});
test.describe.skip("11 · Logout", () => {});
