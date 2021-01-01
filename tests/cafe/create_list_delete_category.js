import { Selector } from "testcafe";
import {
  base,
  login,
  clickLink,
  findElementByTrimmedText
} from "./helpers/util.js";

fixture`Getting Started`.page`${base}/`;

const category = "CAT2";

test("category add list remove", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);

  await t.takeScreenshot();

  await t
    .typeText("#name", category, { replace: true })
    .typeText("#description", "mains power", { replace: true })
    .typeText("#unit", "kWh", { replace: true })
    .click("button");

  await clickLink(t, "/category");
  await t.takeScreenshot();

  const targetElement = findElementByTrimmedText("td", category);
  await t.expect(targetElement.exists).ok();

  await clickLink(t, `/category/${category}`);
  await t.takeScreenshot();

  await t.click(Selector("button").withText("Delete"));

  await clickLink(t, "/category");
  await t.takeScreenshot();
});
