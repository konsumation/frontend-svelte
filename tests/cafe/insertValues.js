import { base, login, clickLink, findElementByTrimmedText } from "./helpers/util.js";

fixture`Getting Started`.page`${base}/`;

const category = "CAT1";

test("insert values to a category", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);
  await t.takeScreenshot();

  await t
    .typeText("#name", category, { replace: true })
    .typeText("#description", "mains power", { replace: true })
    .typeText("#unit", "kWh", { replace: true })
    .click("#submit");

  await clickLink(t, "/insert");
  await t.takeScreenshot();

  await t
    .typeText(`#${category}_time`, "22.12.2006, 22:22:22", { replace: true })
    .typeText(`#${category}_value`, "1.10", { replace: true });

  await t.click(
    "button"
  );

  await clickLink(t, `/category`);
  await clickLink(t, `/category/${category}`);
  await clickLink(t, `/category/${category}/values/list#last`);
  await t.takeScreenshot();
});
