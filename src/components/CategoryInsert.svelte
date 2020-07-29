<script>
  import { onDestroy } from "svelte";
  import { imask } from "@imask/svelte";
  import { ActionButton, dateFormatter } from "svelte-common";
  import { now } from "../main.mjs";

  export let category;
  export let value;
  export let time;

  //$: time = dateFormatter.format($now);

  function parseDate(str) {
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

  const unsubscribe = category.latest.subscribe(v => {
    if (v === undefined) {
      return;
    }
    const d = new Date();
    d.setTime(v.time * 1000);
    value = v.value;
    time = dateFormatter.format(d);
  });
  onDestroy(() => unsubscribe());

  async function insert() {
    await category.insert(parseFloat(value), parseDate(time));
  }

  const options = {
    mask: Number,
    scale: category.fractionalDigits,
    signed: false,
    thousandsSeparator: "",
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ".",
    //mapToRadix: ["."],
    min: 0,
    max: 999999
  };

  function accept({ detail: maskRef }) {
    console.log("accept", maskRef.value);
    value = maskRef.value;
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
      size="16"
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
      size="16"
      required
      use:imask={options}
      on:accept={accept}
      bind:value />
  </label>

  <ActionButton action={insert}>Insert {category.name}</ActionButton>
</fieldset>
