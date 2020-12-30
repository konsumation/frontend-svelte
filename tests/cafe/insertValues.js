import { Selector } from "testcafe";
import { base, login, clickLink } from "./helpers/util.js";

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

test.skip("insert values to a category", async t => {
  await t.navigateTo(`${base}/insert`);

  await login(t);

  await t.takeScreenshot();

 //const mvalue=Selector('#mains\.value');
 //console.log(mvalue)

  await t
    //.typeText("#mains.time", "22.12.2006, 22:22:22", { replace: true })
    .typeText("#mains\.value", "1.10", { replace: true })
    .click("#submit");

  await clickLink(t, "/category/mains/values/list#last");
  await t.takeScreenshot();
/*
  const targetElement = findElementByTrimmedText("td", "mains");
  await t.expect(targetElement.exists).ok();

  await clickLink(t, "/category/mains");
  await t.takeScreenshot();

  await t.click("#delete");

  await clickLink(t, "/category");
  await t.takeScreenshot();
  */
});
