<script>
  import imask from "../imask.mjs";
  import { CommandButton } from "svelte-command";
  import { Value } from "@konsumation/model";
  import { parseDate } from "../date.mjs";

  let { category } = $props();

  let value = $state("");
  let date = $state("");

  $effect(() => {
    const unsubscribe = category.latest.subscribe(v => {
      if (v !== undefined) {
        value = v.value;
        const d = new Date(v.date);
        if (!isNaN(d)) {
          const pad = n => String(n).padStart(2, "0");
          date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        }
      }
    });
    return unsubscribe;
  });

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

  const valuePlaceholder = $derived(
    category.fractionalDigits > 0 ? "0." + "0".repeat(category.fractionalDigits) : "0"
  );
</script>

<fieldset>
  <label for="{category.name}_time">
    Time<input
      id="{category.name}_time"
      type="datetime-local"
      step="1"
      required
      bind:value={date}
    />
  </label>

  <label for="{category.name}_value">
    {category.name}
    ({category.unit})<input
      id="{category.name}_value"
      type="text"
      placeholder={valuePlaceholder}
      size="16"
      required
      use:imask={options}
      onaccept={accept}
      bind:value={value}
    />
  </label>
  <CommandButton {command} />
</fieldset>
