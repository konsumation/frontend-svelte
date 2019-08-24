<script>
  import { Link } from "svelte-guard-history-router";
  import { categories } from "../store.mjs";

  export let context;

  let active = false;
  let message;
  let time, value;

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
  {#each $categories as category (category.name)}
    <form on:submit|preventDefault={submit}>
      <label for="value">
        Value {category.name} ({category.unit})
        <input
          id="{category.name}.value"
          type="text"
          placeholder="Value"
          name="{category.name}.value"
          required
          bind:value />
      </label>

      <label for="time">
        Time
        <input
          id="{category.name}.time"
          type="text"
          placeholder="Time"
          name="{category.name}.time"
          required
          bind:value={time} />
      </label>
      <button id="{category.name}.submit" type="submit" disabled>Insert</button>
    </form>
  {/each}
</div>
