import { Selector } from "testcafe";
import { base, login } from "./helpers/util.js";


const findElementByTrimmedText = Selector((baseCSSSelector, text) => {
  const el          = document.querySelector(baseCSSSelector);
  const trimmedText = el && el.innerText && el.innerText.trim();
  return trimmedText === text ? el : null;
});

//fixture`login`.page`${base}/index.html`;

fixture `Fixture`
    .page('./index.html');

test.page`${base}/about`("about", async t => {
  await t
  .takeScreenshot({
      fullPage: true
  });

  const targetElement = findElementByTrimmedText('td', 'Konsum');
  await t.expect(targetElement.exists).ok();
});
