<script>
  import { onDestroy } from "svelte";
  import { ActionButton } from "svelte-common";

  import { now } from "../main.mjs";

  export let category;
  export let value;
  export let time;

  const formatter = new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  //$: time = formatter.format($now);

  function parseDate(str)
  {
    //8.9.2019, 19:38:34
    const m = str.match(/(\d+)\.(\d+)\.(\d+)[\s,]+(\d+):(\d+):(\d+)/);
    if(m) {
      const date = new Date();

      date.setDate(parseInt(m[1],10));
      date.setMonth(parseInt(m[2],10) - 1);
      date.setFullYear(parseInt(m[3],10));

      date.setHours(parseInt(m[4],10));
      date.setMinutes(parseInt(m[5],10));
      date.setSeconds(parseInt(m[6],10));
      return date;
    }
  }

  const unsubscribe = category.latest.subscribe(v => {
    if (v === undefined) {
      return;
    }
    const d = new Date();
    d.setTime(v.time * 1000);
    value = v.value;
    time = formatter.format(d);
  });
  onDestroy(() => unsubscribe());

  async function insert() {
    await category.insert(parseFloat(value), parseDate(time));
  }
</script>

<fieldset>
  <label for="{category.name}.time">
    Time
    <input
      id="{category.name}.time"
      type="text"
      placeholder="31.12.2000, 23:59:59"
      name="{category.name}.time"
      required
      bind:value={time} />
  </label>

  <label for="{category.name}.value">
    {category.name} ({category.unit})
    <input
      id="{category.name}.value"
      type="text"
      placeholder="0.0"
      name="{category.name}.value"
      required
      bind:value />
  </label>

  <ActionButton action={insert}>Insert {category.name}</ActionButton>
</fieldset>
