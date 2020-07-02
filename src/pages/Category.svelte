<script>
  import { Link } from "svelte-guard-history-router";
  import { categoryRoute } from "../main.mjs";

  let active;

  async function submit() {
    active = true;

    try {
      await $categoryRoute.save();
    } finally {
      active = false;
    }
  }
</script>

{#if $categoryRoute}
<h1>{$categoryRoute.name}</h1>
<form on:submit|preventDefault={submit}>
  <label for="description">
    Description
    <input
      id="description"
      type="text"
      placeholder="Description"
      name="description"
      required
      bind:value={$categoryRoute.description} />
  </label>
  <label for="unit">
    Unit
    <input
      id="unit"
      type="text"
      placeholder="Unit"
      name="unit"
      required
      bind:value={$categoryRoute.unit} />
  </label>

  <button id="submit" type="submit">
    Save
    {#if active}
      <div class="spinner" />
    {/if}
  </button>
</form>

<ul>
  <li>
    <Link href="/category/{$categoryRoute.name}/values/list">List</Link>
  </li>
  <li>
    <Link href="/category/{$categoryRoute.name}/values/graph">Graph</Link>
  </li>
</ul>
{:else}
Nothing found
{/if}