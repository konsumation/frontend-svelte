export const BASE = "http://localhost:5173/services/konsum";

export const USERS = {
  user1: { username: "user1", password: "secret_1234" },
  user2: { username: "user2", password: "secret_1234" },
  admin1: { username: "admin1", password: "secret_1234" },
};

/**
 * Logs in via the login modal.
 * We first load the base URL, then click the Categories nav link to
 * trigger the redirectGuard, which shows the login modal in the Outlet.
 */
export async function login(page, user = USERS.user1) {
  // Load base URL first — lets the SPA mount properly
  if (!page.url().startsWith(BASE)) {
    await page.goto(BASE);
    await page.waitForLoadState("networkidle");
  }

  // Click the Categories link — the guard will redirect to /login and show the modal
  await page.locator("a", { hasText: "Categories" }).first().click();

  const passwordField = page.locator("#password");
  await passwordField.waitFor({ state: "visible", timeout: 10_000 });

  await page.locator("#username").fill(user.username);
  await page.locator("#password").fill(user.password);
  await page.locator("button[type=submit]").click();

  // Wait until the modal closes (redirect back after successful login)
  await passwordField.waitFor({ state: "hidden", timeout: 10_000 });
}

/**
 * Logs out via the user dropdown menu.
 */
export async function logout(page) {
  await page.locator(".dropdown-trigger").click();
  await page.locator("a", { hasText: /Logout/i }).first().click();
  await page.waitForLoadState("networkidle");
}

/**
 * Waits for navigation to stabilise.
 */
export async function waitForNavigation(page) {
  await page.waitForLoadState("networkidle");
}
