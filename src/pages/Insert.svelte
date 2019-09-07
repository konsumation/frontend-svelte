<script>
  import { readable } from "svelte/store";
  import { Link } from "svelte-guard-history-router";
  import { categories, now } from "../main.mjs";
  import CategoryInsert from "../components/CategoryInsert.svelte";
  export let state;

  const formatter = new Intl.DateTimeFormat("default", {
    hour12: false,
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  });

  let active = false;
  let message;
  let time;
  let values = {};

  $: time = formatter.format($now);

  for (const c of $categories) {
    const unsubscribe = c.latest.subscribe(value => {
      values[c.name] = value;
    });
  }

  async function submit(event) {
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

<form>
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
    <CategoryInsert {category} value={values[category.name]} />
  {/each}
</form>
