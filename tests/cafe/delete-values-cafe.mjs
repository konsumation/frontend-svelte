import { Selector } from "testcafe";
import { base, login, clickLink, setDateTimeLocal } from "./helpers/util.mjs";

fixture`Delete Values`.page`${base}`;

const category = "CAT7";

const entries = [
  { time: "2006-12-22T22:22:22", value: "1.1" },
  { time: "2006-12-23T22:22:22", value: "1.2" },
  { time: "2006-12-24T22:22:22", value: "1.3" },
  { time: "2006-12-25T22:22:22", value: "1.4" },
  { time: "2006-12-26T22:22:22", value: "1.9" }
];

test("delete values from a category", async t => {
  await t.navigateTo(`${base}/category/add`);

  await login(t);

  await t
    .typeText("#name", category, { replace: true })
    .typeText("#description", "mains power 1", { replace: true })
    .typeText("#unit", "kWh", { replace: true })
    .click("button");
  await clickLink(t, "/insert");

  for (const entry of entries) {
    await setDateTimeLocal(`#${category}_time`, entry.time);
    await t.typeText(`#${category}_value`, entry.value, { replace: true });
    await t.click(Selector("button").withText(`Insert ${category}`));
  }

  await clickLink(t, `/category`);
  await clickLink(t, `/category/${category}`);
  await clickLink(t, `/category/${category}/values/list#last`);
  await t.takeScreenshot({
    path: "category_delete_value_before_delete.png"
  });

  await t.expect(Selector("td").withText("1.9").exists).ok();

  await t.setNativeDialogHandler(() => true).click(Selector("#last > td:nth-child(3) > button"));

  await t.takeScreenshot({
    path: "category_delete_value_after_delete.png"
  });

  await t.expect(Selector("td").withText("1.9").exists).notOk({ timeout: 5000 });
});
