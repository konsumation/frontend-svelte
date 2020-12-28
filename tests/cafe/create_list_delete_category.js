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

test("Categories", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);

  await t.takeScreenshot({
    fullPage: true
  });

  const targetElement = findElementByTrimmedText("td", "Konsum");
  await t.expect(targetElement.exists).ok();
});
