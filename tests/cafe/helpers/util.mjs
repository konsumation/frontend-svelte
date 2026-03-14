import { Selector, ClientFunction } from "testcafe";

// TestCafe tests use the root path — the Vite dev server proxies /api to konsum backend.
// Playwright tests use /services/konsum since they test the full production-like path.
export const base = "http://localhost:5173";

export async function login(t, data = { user: "user1", password: "secret_1234" }) {
  if (await Selector("#password").exists) {
    await t
      .typeText("#username", data.user, { replace: true })
      .typeText("#password", data.password, { replace: true })
      .click("button");
  }
}

export async function clickLink(t, href) {
  const a = Selector("a").withAttribute("href", href);
  await t.click(a);
}

/**
 * Sets a datetime-local input value via JS — typeText() fails in Chrome
 * because it interprets the value through locale formatting.
 * value must be in ISO format: "yyyy-MM-ddThh:mm:ss"
 */
export const setDateTimeLocal = ClientFunction((selector, value) => {
  const input = document.querySelector(selector);
  if (!input) return;
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  ).set;
  nativeInputValueSetter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
});

export const findElementByTrimmedText = Selector((baseCSSSelector, text) => {
  const el = document.querySelector(baseCSSSelector);
  const trimmedText = el && el.innerText && el.innerText.trim();
  return trimmedText === text ? el : null;
});
