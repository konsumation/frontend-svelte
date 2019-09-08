<script>
  import { onDestroy } from "svelte";
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

  const unsubscribe = category.latest.subscribe(v => {
    if(v === undefined) { return; }
    const d = new Date();
    d.setTime(v.time * 1000);
    value = v.value;
    time = formatter.format(d);
  });
  onDestroy(() => unsubscribe());

  let active = false;

  async function insert() {
    active = true;
    try {
      await category.insert(value, $now);
    } finally {
      active = false;
    }
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

  <button id="{category.name}.submit" type="submit" on:click|once={insert}>
    Insert {category.name}
    {#if active}
      <div class="spinner" />
    {/if}
  </button>
</fieldset>
