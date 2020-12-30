import test from "ava";
import { parseDate } from "../src/date.mjs";

test("date", t => {
  t.deepEqual(parseDate("8.9.2019, 19:38:34"), new Date("9.8.2019, 19:38:34"));
});
