<script>
  import { onDestroy } from "svelte";
  import { now } from "../main.mjs";

  export let category;
  export let value;
  export let time;

  const formatter = new Intl.DateTimeFormat("default", {
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  $: time = formatter.format($now);

  const unsubscribe = category.latest.subscribe(v => (value = v));
  onDestroy(() => unsubscribe());

  let active = false;

  async function insert() {
    active = true;
    try {
      await category.insert(value, time);
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
      placeholder="00:00:00"
      name="{category.name}.time"
      required
      bind:value={time} />
  </label>

  <label for="{category.name}.value">
    {category.name} ({category.unit})
    <input
      id="{category.name}.value"
      type="text"
      placeholder="Value"
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
