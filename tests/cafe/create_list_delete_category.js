import { Selector } from "testcafe";
import { base, login, clickLink, findElementByTrimmedText } from "./helpers/util.js";

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

test("category add list remove", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);

  await t.takeScreenshot();

  await t
    .typeText("#name", "mains", { replace: true })
    .typeText("#description", "mains power", { replace: true })
    .typeText("#unit", "kWh", { replace: true })
    .click("#submit");

  await clickLink(t, "/category");
  await t.takeScreenshot();

  const targetElement = findElementByTrimmedText("td", "mains");
  await t.expect(targetElement.exists).ok();

  await clickLink(t, "/category/mains");
  await t.takeScreenshot();

  await t.click("#delete");

  await clickLink(t, "/category");
  await t.takeScreenshot();
});
