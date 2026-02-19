import { test, expect } from "@playwright/test";
import { BASE, USERS, login, logout, waitForNavigation } from "./helpers.mjs";

// Category names used across tests — must be unique per run
const CATEGORY = "PW_CAT1";
const CATEGORY_ADMIN = "PW_CAT_ADMIN";
const CATEGORY_FORBIDDEN = "PW_CAT_FORBIDDEN";

// ─────────────────────────────────────────────────────────────
// 1. LOGIN
// ─────────────────────────────────────────────────────────────
test.describe("1 · Login", () => {
  test("shows login modal at /login", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await expect(page.locator("#username")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.locator("button[type=submit], form button").first()).toBeVisible();
  });

  test("rejects wrong password", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.locator("#username").fill("user1");
    await page.locator("#password").fill("wrong");
    await page.locator("button[type=submit], form button").first().click();
    // Modal stays open and shows an error (or password field still visible)
    await expect(page.locator("#password")).toBeVisible({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/login_wrong_password.png" });
  });

  test("logs in successfully as user1", async ({ page }) => {
    await login(page, USERS.user1);
    // After login the URL should go back to /
    await expect(page).toHaveURL(`${BASE}/`);
    await page.screenshot({ path: "build/test/login_success.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 2. HOME & NAVIGATION
// ─────────────────────────────────────────────────────────────
test.describe("2 · Home & navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("shows top navigation links", async ({ page }) => {
    await expect(page.locator("a", { hasText: "Categories" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Insert" })).toBeVisible();
    await expect(page.locator("a", { hasText: "About" })).toBeVisible();
    await page.screenshot({ path: "build/test/home_nav.png" });
  });

  test("navigates to About page", async ({ page }) => {
    await page.locator("a", { hasText: "About" }).click();
    await waitForNavigation(page);
    await expect(page).toHaveURL(`${BASE}/about`);
    await page.screenshot({ path: "build/test/about_page.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 3. CATEGORIES LIST
// ─────────────────────────────────────────────────────────────
test.describe("3 · Categories list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("redirects to /login when not logged in", async ({ page }) => {
    // Fresh page — no session
    const freshPage = page;
    await freshPage.context().clearCookies();
    await freshPage.goto(`${BASE}/category`);
    await expect(freshPage.locator("#password")).toBeVisible({ timeout: 5_000 });
  });

  test("shows categories table with sortable headers", async ({ page }) => {
    await page.goto(`${BASE}/category`);
    await waitForNavigation(page);
    await expect(page.locator("table")).toBeVisible();
    await expect(page.locator("th#name")).toBeVisible();
    await expect(page.locator("th#description")).toBeVisible();
    await expect(page.locator("th#unit")).toBeVisible();
    await page.screenshot({ path: "build/test/categories_list.png" });
  });

  test("shows 'New Category' link", async ({ page }) => {
    await page.goto(`${BASE}/category`);
    await expect(page.locator("a", { hasText: "New Category" })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
// 4. ADD CATEGORY
// ─────────────────────────────────────────────────────────────
test.describe("4 · Add category", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("creates a new category successfully", async ({ page }) => {
    await page.goto(`${BASE}/category/add`);
    await expect(page.locator("#name")).toBeVisible();

    await page.locator("#name").fill(CATEGORY);
    await page.locator("#description").fill("Playwright test category");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("2");

    await page.screenshot({ path: "build/test/add_category_filled.png" });
    await page.locator("button[type=submit], form button").first().click();

    // After save, should navigate to the category detail or categories list
    await waitForNavigation(page);
    await page.screenshot({ path: "build/test/add_category_saved.png" });
  });

  test("new category appears in the list", async ({ page }) => {
    await page.goto(`${BASE}/category`);
    await waitForNavigation(page);
    await expect(page.locator(`td, a`, { hasText: CATEGORY })).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/categories_list_after_add.png" });
  });

  test("user2 cannot submit add-category form (button disabled)", async ({ page }) => {
    // log out first
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user2);
    await page.goto(`${BASE}/category/add`);

    await page.locator("#name").fill(CATEGORY_FORBIDDEN);
    await page.locator("#description").fill("Should be blocked");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("2");

    const submitBtn = page.locator("button[type=submit], form button").first();
    await expect(submitBtn).toBeDisabled({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/add_category_forbidden.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. CATEGORY DETAIL & EDIT
// ─────────────────────────────────────────────────────────────
test.describe("5 · Category detail", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("opens category detail page", async ({ page }) => {
    await page.goto(`${BASE}/category/${CATEGORY}`);
    await waitForNavigation(page);
    await expect(page.locator("h1", { hasText: `Category ${CATEGORY}` })).toBeVisible();
    await expect(page.locator("a", { hasText: "List" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Graph" })).toBeVisible();
    await page.screenshot({ path: "build/test/category_detail.png" });
  });

  test("shows Save and Delete buttons", async ({ page }) => {
    await page.goto(`${BASE}/category/${CATEGORY}`);
    await waitForNavigation(page);
    await expect(page.locator("button", { hasText: "Save" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Delete" })).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────
// 6. INSERT VALUES
// ─────────────────────────────────────────────────────────────
test.describe("6 · Insert values", () => {
  const entries = [
    { time: "2006-12-22T22:22", value: "1.10" },
    { time: "2006-12-23T22:22", value: "1.20" },
    { time: "2006-12-24T22:22", value: "1.30" },
    { time: "2006-12-25T22:22", value: "1.40" },
    { time: "2006-12-26T22:22", value: "1.90" },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("insert page shows category fieldsets", async ({ page }) => {
    await page.goto(`${BASE}/insert`);
    await waitForNavigation(page);
    // Should have at least one fieldset for our category
    await expect(page.locator("form fieldset")).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/insert_page.png" });
  });

  test("inserts multiple values into category", async ({ page }) => {
    await page.goto(`${BASE}/insert`);
    await waitForNavigation(page);

    for (const entry of entries) {
      const timeInput = page.locator(`#${CATEGORY}_time`);
      const valueInput = page.locator(`#${CATEGORY}_value`);
      const insertBtn = page.locator("button", { hasText: `Insert ${CATEGORY}` });

      await timeInput.fill(entry.time);
      await valueInput.fill(entry.value);
      await insertBtn.click();
      // Short pause between inserts
      await page.waitForTimeout(300);
    }

    await page.screenshot({ path: "build/test/insert_values_done.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 7. CATEGORY VALUE LIST
// ─────────────────────────────────────────────────────────────
test.describe("7 · Category value list", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("shows inserted values in the list", async ({ page }) => {
    await page.goto(`${BASE}/category/${CATEGORY}/values/list`);
    await waitForNavigation(page);
    await expect(page.locator("td", { hasText: "1.90" })).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/value_list_before_delete.png" });
  });

  test("deletes the last value via #last row", async ({ page }) => {
    await page.goto(`${BASE}/category/${CATEGORY}/values/list#last`);
    await waitForNavigation(page);

    // Accept confirmation dialog
    page.on("dialog", dialog => dialog.accept());

    // Delete button in the last row (#last)
    const deleteBtn = page.locator("#last td:last-child button, #last button").first();
    await expect(deleteBtn).toBeVisible({ timeout: 5_000 });
    await deleteBtn.click();

    await waitForNavigation(page);

    // The deleted value (1.90) should be gone
    await expect(page.locator("td", { hasText: "1.90" })).toBeHidden({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/value_list_after_delete.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 8. CATEGORY GRAPH
// ─────────────────────────────────────────────────────────────
test.describe("8 · Category graph", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  test("renders the graph page without errors", async ({ page }) => {
    await page.goto(`${BASE}/category/${CATEGORY}/values/graph`);
    await waitForNavigation(page);
    // SVG from LayerCake should appear
    await expect(page.locator("svg")).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/category_graph.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 9. ADMIN PAGE
// ─────────────────────────────────────────────────────────────
test.describe("9 · Admin page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.admin1);
  });

  test("admin can add a category and access /admin", async ({ page }) => {
    // Create a category as admin
    await page.goto(`${BASE}/category/add`);
    await page.locator("#name").fill(CATEGORY_ADMIN);
    await page.locator("#description").fill("Admin test category");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("1");
    await page.locator("button[type=submit], form button").first().click();
    await waitForNavigation(page);

    // Navigate to admin page
    await page.goto(`${BASE}/admin`);
    await waitForNavigation(page);
    await expect(page).toHaveURL(`${BASE}/admin`);
    await page.screenshot({ path: "build/test/admin_page.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 10. CLEANUP — DELETE TEST CATEGORIES
// ─────────────────────────────────────────────────────────────
test.describe("10 · Cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);
  });

  for (const cat of [CATEGORY, CATEGORY_ADMIN]) {
    test(`deletes category ${cat}`, async ({ page }) => {
      await page.goto(`${BASE}/category/${cat}`);
      await waitForNavigation(page);

      const heading = page.locator("h1", { hasText: `Category ${cat}` });
      if (!(await heading.isVisible())) {
        // category might not exist — skip gracefully
        return;
      }

      page.on("dialog", dialog => dialog.accept());
      await page.locator("button", { hasText: "Delete" }).click();
      await waitForNavigation(page);
      await page.screenshot({ path: `build/test/cleanup_deleted_${cat}.png` });
    });
  }

  test("categories list no longer contains test entries", async ({ page }) => {
    await page.goto(`${BASE}/category`);
    await waitForNavigation(page);
    await expect(page.locator("td", { hasText: CATEGORY })).toBeHidden({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/categories_after_cleanup.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 11. LOGOUT
// ─────────────────────────────────────────────────────────────
test.describe("11 · Logout", () => {
  test("logs out and redirects to login on protected route", async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await login(page, USERS.user1);

    // Logout via dropdown
    await page.locator(".dropdown-trigger").click();
    await page.locator("a", { hasText: /Logout/i }).first().click();
    await waitForNavigation(page);

    // Accessing a protected route should now show login
    await page.goto(`${BASE}/category`);
    await expect(page.locator("#password")).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/after_logout.png" });
  });
});
