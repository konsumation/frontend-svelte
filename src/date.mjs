export function parseDate(str) {
  //8.9.2019, 19:38:34
  const m = str.match(/(\d+)\.(\d+)\.(\d+)[\s,]+(\d+):(\d+):(\d+)/);
  if (m) {
    const date = new Date();

    date.setDate(parseInt(m[1], 10));
    date.setMonth(parseInt(m[2], 10) - 1);
    date.setFullYear(parseInt(m[3], 10));

    date.setHours(parseInt(m[4], 10));
    date.setMinutes(parseInt(m[5], 10));
    date.setSeconds(parseInt(m[6], 10));
    return date;
  }
}
