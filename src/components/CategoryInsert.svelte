<script>
  import imask from "../imask.mjs";
  import { onDestroy } from "svelte";
  import { dateFormatter } from "svelte-common";
  import { CommandButton } from "svelte-command";
  import { Value } from "@konsumation/model";
  import { parseDate } from "../date.mjs";

  export let category;
  export let value = "";
  export let date = "";

  //$: time = dateFormatter.format($now);

  const unsubscribe = category.latest.subscribe(v => {
    if (v === undefined) {
      return;
    }
    value = v.value;
    date = dateFormatter.format(v.date);
  });

  onDestroy(() => unsubscribe());

  const options = {
    mask: Number,
    scale: category.fractionalDigits,
    signed: false,
    thousandsSeparator: "",
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ".",
    min: 0,
    max: 999999
  };

  function accept({ detail: maskRef }) {
    console.log("accept", maskRef.value);
    value = maskRef.value;
  }

  const command = category.insertCommand(() => {
    return new Value({
      value: parseFloat(value),
      date: parseDate(date)
    });
  });
</script>

<fieldset>
  <label for="{category.name}_time">
    Time<input
      id="{category.name}_time"
      type="datetime-local"
      placeholder="31.12.2000, 23:59:59"
      size="16"
      required
      bind:value={date}
    />
  </label>

  <label for="{category.name}_value">
    {category.name}
    ({category.unit})<input
      id="{category.name}_value"
      type="text"
      placeholder={"0." + "0".repeat(category.fractionalDigits)}
      size="16"
      required
      use:imask={options}
      on:accept={accept}
      bind:value
    />
  </label>
  <CommandButton {command} />
</fieldset>
