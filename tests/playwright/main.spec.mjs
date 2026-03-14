import { test, expect } from "@playwright/test";
import { login, BASE, USERS } from "./helpers.mjs";

// Unique category name per test run to avoid conflicts
const CATEGORY_NAME = `PW_CAT_${Date.now()}`;

// API base (derived from how the dev proxy maps requests)
const API_BASE = "http://localhost:5173/api";

test.describe("Create Category", () => {
  test("login and navigate to create category form", async ({ page }) => {
    await login(page);

    // Navigate to Categories (should show list)
    await page.locator("a", { hasText: "Categories" }).first().click();
    await expect(page.locator("table")).toBeVisible({ timeout: 8_000 });
    await expect(page.locator("a", { hasText: "New Category" })).toBeVisible();

    // Click New Category and verify form appears
    await page.locator("a", { hasText: "New Category" }).click();
    await expect(page.locator("h1", { hasText: "New Category" })).toBeVisible({
      timeout: 5_000,
    });
    await expect(page.locator("#name")).toBeVisible();
    await expect(page.locator("#description")).toBeVisible();
    await expect(page.locator("#unit")).toBeVisible();
    await expect(page.locator("#fractionalDigits")).toBeVisible();
    await expect(page.locator("button", { hasText: "Save" })).toBeVisible();
  });

  test("creates a new category via the form", async ({ page }) => {
    await login(page);

    // Navigate to Categories
    await page.locator("a", { hasText: "Categories" }).first().click();
    await expect(page.locator("table")).toBeVisible({ timeout: 8_000 });

    // Click New Category
    await page.locator("a", { hasText: "New Category" }).click();
    await expect(page.locator("h1", { hasText: "New Category" })).toBeVisible({
      timeout: 5_000,
    });

    // Fill in the form
    await page.locator("#name").fill(CATEGORY_NAME);
    await page.locator("#description").fill("Playwright test category");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("2");

    // Save button should now be enabled (was the bug: it stayed disabled)
    const saveBtn = page.locator("button", { hasText: "Save" });
    await expect(saveBtn).toBeEnabled({ timeout: 3_000 });

    // Submit the form and wait for the PUT API to succeed
    const [saveResponse] = await Promise.all([
      page.waitForResponse(
        (resp) => resp.request().method() === "PUT" && resp.status() === 200,
        { timeout: 10_000 }
      ),
      saveBtn.click(),
    ]);
    expect(saveResponse.status()).toBe(200);

    // Navigate to Categories and verify the new category appears in the list
    await page.locator("a", { hasText: "Categories" }).first().click();
    await expect(page.locator("table")).toBeVisible({ timeout: 8_000 });
    await expect(
      page.locator("td, a", { hasText: CATEGORY_NAME }).first()
    ).toBeVisible({ timeout: 8_000 });
  });

  /**
   * Cleanup: delete the test category.
   * Uses direct API calls (no browser UI) to avoid SPA routing issues.
   * Each Playwright test gets a fresh browser context, so we authenticate first.
   */
  test("cleanup: delete the test category via API", async ({ page }) => {
    // Authenticate directly via the API
    const authResp = await page.request.post(`${API_BASE}/authenticate`, {
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify({ username: USERS.user1.username, password: USERS.user1.password }),
    });
    expect(authResp.ok()).toBeTruthy();
    const { access_token } = await authResp.json();

    // Delete the test category — 200 = deleted, 404 = already gone
    const deleteResp = await page.request.delete(
      `${API_BASE}/category/${CATEGORY_NAME}`,
      { headers: { Authorization: `Bearer ${access_token}` } }
    );
    console.log(`DELETE ${CATEGORY_NAME}: HTTP ${deleteResp.status()}`);
    expect([200, 404]).toContain(deleteResp.status());
  });
});
