import { Selector } from "testcafe";
import { base, login, clickLink } from "./helpers/util.js";

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

  await clickLink(t, `/category/${category}`);
  await t.takeScreenshot();

  await t.setNativeDialogHandler(() => true);

  await t.click(Selector("button").withText("Delete"));

  await clickLink(t, "/category");
  await t.takeScreenshot({
    path: "category_add_list_remove"
  });
});

test("category add forbidden", async t => {
  const category = "CAT3";

  await t.navigateTo(`${base}/category/add`);
  await login(t, { user: "user2", password: "secret" });

  await t
  .typeText("#name", category, { replace: true })
  .typeText("#description", "mains power", { replace: true })
  .typeText("#unit", "kWh", { replace: true });

  await t.expect(Selector("button").withAttribute('disabled').exists).ok();

  await t.takeScreenshot({
    path: "category_add_forbidden"
  });
});

