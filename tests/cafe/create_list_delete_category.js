import { Selector } from "testcafe";
import { base, login } from "./helpers/util.js";

const findElementByTrimmedText = Selector((baseCSSSelector, text) => {
  const el = document.querySelector(baseCSSSelector);
  const trimmedText = el && el.innerText && el.innerText.trim();
  return trimmedText === text ? el : null;
});

fixture`Getting Started`.page`${base}/`;

/*
test("About", async t => {
  await t.navigateTo(`${base}/about`);

  await t.takeScreenshot({
    fullPage: true
  });

  const targetElement = findElementByTrimmedText("td", "Konsum");
  await t.expect(targetElement.exists).ok();
});
*/

test("Category Add", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);

  await t.takeScreenshot();

  await t
    .typeText("#name", "mains", { replace: true })
    .typeText("#description", "mains power", { replace: true })
    .typeText("#unit", "kWh", { replace: true })
    .click("#submit");

  await t.navigateTo(`${base}/category`);

  await login(t);

  await t.takeScreenshot();

  const targetElement = findElementByTrimmedText("td", "mains");
  await t.expect(targetElement.exists).ok();
});
