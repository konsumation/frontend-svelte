<script>
  import { Link } from "svelte-guard-history-router";
  import { readable } from "svelte/store";
  import { categories } from "../main.mjs";
  export let state;

  export const now = readable(new Date(), set => {
    const interval = setInterval(() => set(new Date()), 1000);
    return () => clearInterval(interval);
  });

  const formatter = new Intl.DateTimeFormat("default", {
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  let active = false;
  let message;
  let time;
  let values = {
    ev: 7
  };

  $: time = formatter.format($now);

  for (const c of $categories) {
    const unsubscribe = c.latest.subscribe(value => {
      values[c.name] = value;
    });
  }

  async function submit() {
    try {
      message = undefined;
      active = true;
    } catch (e) {
      message = e;
    } finally {
      active = false;
    }
  }
</script>

<div>
  <form on:submit|preventDefault={submit}>
    <label for="time">
      Time
      <input
        id="time"
        type="text"
        placeholder="00:00:00"
        name="time"
        required
        bind:value={time} />
    </label>

    {#each $categories as category (category.name)}
      <label for="value">
        Value {category.name} ({category.unit})
        <input
          id="{category.name}.value"
          type="text"
          placeholder="Value"
          name="{category.name}.value"
          required
          bind:value={values[category.name]} />
      </label>

      <button id="{category.name}.submit" type="submit" disabled>Insert</button>
    {/each}
  </form>

</div>
