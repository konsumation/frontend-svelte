export const BASE = "http://localhost:5173/services/konsum";

export const USERS = {
  user1: { username: "user1", password: "secret" },
  user2: { username: "user2", password: "secret" },
  admin1: { username: "admin1", password: "secret" },
};

/**
 * Logs in via the login modal.
 * Navigates to /login first if the modal isn't already open.
 */
export async function login(page, user = USERS.user1) {
  const passwordField = page.locator("#password");

  if (!(await passwordField.isVisible())) {
    await page.goto(`${BASE}/login`);
  }

  await page.locator("#username").fill(user.username);
  await page.locator("#password").fill(user.password);
  await page.locator("button[type=submit], form button").first().click();

  // Wait until the modal closes (login modal disappears after success)
  await passwordField.waitFor({ state: "hidden", timeout: 10_000 });
}

/**
 * Logs out via the user dropdown menu.
 */
export async function logout(page) {
  // Open user dropdown
  await page.locator(".dropdown-trigger").click();
  await page.locator("text=Logout").first().click();
}

/**
 * Waits for navigation to stabilise.
 */
export async function waitForNavigation(page) {
  await page.waitForLoadState("networkidle");
}
