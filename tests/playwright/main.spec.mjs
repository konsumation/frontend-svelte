import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173/services/konsum";

const USERS = {
  user1: { username: "user1", password: "secret" },
  user2: { username: "user2", password: "secret" },
  admin1: { username: "admin1", password: "secret" },
};

// Category names — unique per run
const CATEGORY = "PW_CAT1";
const CATEGORY_ADMIN = "PW_CAT_ADMIN";
const CATEGORY_FORBIDDEN = "PW_CAT_FORBIDDEN";

/**
 * Helper: Navigate via SPA (click link) rather than direct goto
 * This ensures the svelte-guard-history-router processes the navigation
 */
async function navigateTo(page, linkText) {
  await page.locator("a", { hasText: linkText }).first().click();
  await page.waitForLoadState("networkidle");
}

/**
 * Login helper — loads BASE, clicks Categories to trigger guard redirect
 */
async function login(page, user = USERS.user1) {
  // Ensure we're on BASE with a fresh page state
  await page.goto(BASE);
  await page.waitForLoadState("networkidle");

  // Click Categories link — this triggers the redirectGuard if not logged in
  await navigateTo(page, "Categories");

  // Wait for login modal
  const passwordField = page.locator("#password");
  const isVisible = await passwordField.isVisible().catch(() => false);

  if (isVisible) {
    // Not logged in — do login
    await page.locator("#username").fill(user.username);
    await page.locator("#password").fill(user.password);
    await page.locator("button[type=submit]").click();
    await passwordField.waitFor({ state: "hidden", timeout: 10_000 });
  }
  // If password field not visible, we're already logged in (session persisted)
}

/**
 * Logout helper
 */
async function logout(page) {
  await page.locator(".dropdown-trigger").click();
  await page.locator("a", { hasText: /Logout/i }).first().click();
  await page.waitForLoadState("networkidle");
}

/**
 * Clear session storage
 */
async function clearSession(page) {
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}

// ─────────────────────────────────────────────────────────────
// 1. LOGIN
// ─────────────────────────────────────────────────────────────
test.describe("1 · Login", () => {
  test.beforeEach(async ({ page }) => {
    await clearSession(page);
  });

  test("guard redirects unauthenticated user to login modal", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await navigateTo(page, "Categories");
    await expect(page.locator("#password")).toBeVisible({ timeout: 10_000 });
    await expect(page.locator("#username")).toBeVisible();
    await page.screenshot({ path: "build/test/login_modal_guard_redirect.png" });
  });

  test("rejects wrong password", async ({ page }) => {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
    await navigateTo(page, "Categories");
    await page.locator("#password").waitFor({ state: "visible", timeout: 10_000 });
    await page.locator("#username").fill("user1");
    await page.locator("#password").fill("wrong");
    await page.locator("button[type=submit]").click();
    await expect(page.locator("#message, .error")).toBeVisible({ timeout: 5_000 });
    await expect(page.locator("#password")).toBeVisible();
    await page.screenshot({ path: "build/test/login_wrong_password.png" });
  });

  test("logs in successfully as user1", async ({ page }) => {
    await login(page, USERS.user1);
    await expect(page.locator("#password")).toBeHidden();
    await expect(page).toHaveURL(/category/);
    await page.screenshot({ path: "build/test/login_success.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 2. HOME & NAVIGATION
// ─────────────────────────────────────────────────────────────
test.describe("2 · Home & navigation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  test("shows top navigation links", async ({ page }) => {
    await navigateTo(page, "Konsum"); // Click logo to go home
    await expect(page.locator("a", { hasText: "Categories" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Insert" })).toBeVisible();
    await expect(page.locator("a", { hasText: "About" })).toBeVisible();
    await page.screenshot({ path: "build/test/home_nav.png" });
  });

  test("navigates to About page", async ({ page }) => {
    await navigateTo(page, "About");
    await expect(page).toHaveURL(`${BASE}/about`);
    await page.screenshot({ path: "build/test/about_page.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 3. CATEGORIES LIST
// ─────────────────────────────────────────────────────────────
test.describe("3 · Categories list", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
    await navigateTo(page, "Categories");
  });

  test("redirects to login when not authenticated", async ({ page }) => {
    await clearSession(page);
    await page.reload();
    await page.waitForLoadState("networkidle");
    await navigateTo(page, "Categories");
    await expect(page.locator("#password")).toBeVisible({ timeout: 8_000 });
  });

  test("shows categories table with sortable headers", async ({ page }) => {
    await expect(page.locator("table")).toBeVisible({ timeout: 8_000 });
    await expect(page.locator("th#name")).toBeVisible();
    await expect(page.locator("th#description")).toBeVisible();
    await expect(page.locator("th#unit")).toBeVisible();
    await page.screenshot({ path: "build/test/categories_list.png" });
  });

  test("shows 'New Category' link", async ({ page }) => {
    await expect(page.locator("a", { hasText: "New Category" })).toBeVisible({ timeout: 8_000 });
  });

  test("sorts by column on header click", async ({ page }) => {
    await page.locator("th#name").click();
    await expect(page).toHaveURL(/sort\.name/);
    await page.screenshot({ path: "build/test/categories_sorted.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 4. ADD CATEGORY
// ─────────────────────────────────────────────────────────────
test.describe("4 · Add category", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  test("creates a new category successfully", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("a", { hasText: "New Category" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("#name")).toBeVisible({ timeout: 8_000 });
    await page.locator("#name").fill(CATEGORY);
    await page.locator("#description").fill("Playwright test category");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("2");

    await page.screenshot({ path: "build/test/add_category_filled.png" });
    await page.locator("button[type=submit]").click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "build/test/add_category_saved.png" });
  });

  test("new category appears in the list", async ({ page }) => {
    await navigateTo(page, "Categories");
    await expect(page.locator("td, a", { hasText: CATEGORY })).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/categories_list_after_add.png" });
  });

  test("user2 cannot submit add-category form (button disabled)", async ({ page }) => {
    await logout(page);
    await clearSession(page);
    await login(page, USERS.user2);
    
    await navigateTo(page, "Categories");
    await page.locator("a", { hasText: "New Category" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("#name")).toBeVisible({ timeout: 8_000 });
    await page.locator("#name").fill(CATEGORY_FORBIDDEN);
    await page.locator("#description").fill("Should be blocked");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("2");

    await expect(page.locator("button[type=submit]")).toBeDisabled({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/add_category_forbidden.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 5. CATEGORY DETAIL & EDIT
// ─────────────────────────────────────────────────────────────
test.describe("5 · Category detail", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  test("opens category detail page", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("td, a", { hasText: CATEGORY }).first().click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("h1", { hasText: `Category ${CATEGORY}` })).toBeVisible({ timeout: 8_000 });
    await expect(page.locator("a", { hasText: "List" })).toBeVisible();
    await expect(page.locator("a", { hasText: "Graph" })).toBeVisible();
    await page.screenshot({ path: "build/test/category_detail.png" });
  });

  test("shows Save and Delete buttons", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("td, a", { hasText: CATEGORY }).first().click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("button", { hasText: "Save" })).toBeVisible({ timeout: 5_000 });
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
    await login(page, USERS.user1);
  });

  test("insert page shows category fieldsets", async ({ page }) => {
    await navigateTo(page, "Insert");
    await expect(page.locator("form fieldset").first()).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/insert_page.png" });
  });

  test("inserts multiple values into category", async ({ page }) => {
    await navigateTo(page, "Insert");
    await expect(page.locator(`#${CATEGORY}_time`)).toBeVisible({ timeout: 8_000 });

    for (const entry of entries) {
      await page.locator(`#${CATEGORY}_time`).fill(entry.time);
      await page.locator(`#${CATEGORY}_value`).fill(entry.value);
      await page.locator("button", { hasText: `Insert ${CATEGORY}` }).click();
      await page.waitForTimeout(400);
    }

    await page.screenshot({ path: "build/test/insert_values_done.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 7. CATEGORY VALUE LIST
// ─────────────────────────────────────────────────────────────
test.describe("7 · Category value list", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  test("shows inserted values in the list", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("td, a", { hasText: CATEGORY }).first().click();
    await page.waitForLoadState("networkidle");
    await page.locator("a", { hasText: "List" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("td", { hasText: "1.90" })).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/value_list_before_delete.png" });
  });

  test("deletes the last value via #last row", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("td, a", { hasText: CATEGORY }).first().click();
    await page.waitForLoadState("networkidle");
    await page.locator("a", { hasText: "List" }).click();
    await page.waitForLoadState("networkidle");

    page.on("dialog", dialog => dialog.accept());

    const deleteBtn = page.locator("#last td button, #last button").first();
    await expect(deleteBtn).toBeVisible({ timeout: 5_000 });
    await deleteBtn.click();

    await page.waitForLoadState("networkidle");
    await expect(page.locator("td", { hasText: "1.90" })).toBeHidden({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/value_list_after_delete.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 8. CATEGORY GRAPH
// ─────────────────────────────────────────────────────────────
test.describe("8 · Category graph", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  test("renders the graph SVG without errors", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("td, a", { hasText: CATEGORY }).first().click();
    await page.waitForLoadState("networkidle");
    await page.locator("a", { hasText: "Graph" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("svg")).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/category_graph.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 9. ADMIN PAGE
// ─────────────────────────────────────────────────────────────
test.describe("9 · Admin page", () => {
  test.beforeEach(async ({ page }) => {
    await logout(page);
    await clearSession(page);
    await login(page, USERS.admin1);
  });

  test("admin can create a category", async ({ page }) => {
    await navigateTo(page, "Categories");
    await page.locator("a", { hasText: "New Category" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page.locator("#name")).toBeVisible({ timeout: 8_000 });
    await page.locator("#name").fill(CATEGORY_ADMIN);
    await page.locator("#description").fill("Admin test category");
    await page.locator("#unit").fill("kWh");
    await page.locator("#fractionalDigits").fill("1");
    await page.locator("button[type=submit]").click();
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: "build/test/admin_category_added.png" });
  });

  test("admin can access /admin route", async ({ page }) => {
    // Admin link is in the user dropdown
    await page.locator(".dropdown-trigger").click();
    await page.locator("a", { hasText: "Admin" }).click();
    await page.waitForLoadState("networkidle");
    
    await expect(page).toHaveURL(`${BASE}/admin`);
    await page.screenshot({ path: "build/test/admin_page.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 10. CLEANUP — DELETE TEST CATEGORIES
// ─────────────────────────────────────────────────────────────
test.describe("10 · Cleanup", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, USERS.user1);
  });

  for (const cat of [CATEGORY, CATEGORY_ADMIN]) {
    test(`deletes category ${cat}`, async ({ page }) => {
      await navigateTo(page, "Categories");
      const catLink = page.locator("td, a", { hasText: cat }).first();
      if (!(await catLink.isVisible({ timeout: 3_000 }).catch(() => false))) {
        return; // category doesn't exist — skip
      }
      await catLink.click();
      await page.waitForLoadState("networkidle");

      page.on("dialog", dialog => dialog.accept());
      await page.locator("button", { hasText: "Delete" }).click();
      await page.waitForLoadState("networkidle");
      await page.screenshot({ path: `build/test/cleanup_deleted_${cat}.png` });
    });
  }

  test("test categories no longer in list", async ({ page }) => {
    await navigateTo(page, "Categories");
    await expect(page.locator("td, a", { hasText: CATEGORY })).toBeHidden({ timeout: 5_000 });
    await page.screenshot({ path: "build/test/categories_after_cleanup.png" });
  });
});

// ─────────────────────────────────────────────────────────────
// 11. LOGOUT
// ─────────────────────────────────────────────────────────────
test.describe("11 · Logout", () => {
  test("logout shows login modal on next guarded route access", async ({ page }) => {
    await login(page, USERS.user1);
    await navigateTo(page, "Konsum"); // Go home first

    await logout(page);

    // Clear session and try to access guarded route
    await clearSession(page);
    await navigateTo(page, "Categories");
    await expect(page.locator("#password")).toBeVisible({ timeout: 8_000 });
    await page.screenshot({ path: "build/test/after_logout.png" });
  });
});
