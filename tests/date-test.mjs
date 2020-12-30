import test from "ava";
import { parseDate } from "../src/date.mjs";

function dt(t, a, b) {
  t.deepEqual(parseDate(a), new Date(b));
}

dt.title = (providedTitle = "parseDate", a, b) =>
  `${providedTitle} ${a}`.trim();

test(dt, "8.9.2019, 19:38:34", "9.8.2019, 19:38:34");
