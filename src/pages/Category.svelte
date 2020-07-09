<script>
  import { Link } from "svelte-guard-history-router";

  export let router;

  const route = router.route;

  let active;

  async function submit() {
    active = true;

    try {
      await $route.save();
    } finally {
      active = false;
    }
  }
</script>

{#if $route}
  <h1>{$route.name}</h1>
  <form on:submit|preventDefault={submit}>
    <label for="description">
      Description
      <input
        id="description"
        type="text"
        placeholder="Description"
        name="description"
        required
        bind:value={$route.description} />
    </label>
    <label for="unit">
      Unit
      <input
        id="unit"
        type="text"
        placeholder="Unit"
        name="unit"
        required
        bind:value={$route.unit} />
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
      <Link href="/category/{$route.name}/values/list">List</Link>
    </li>
    <li>
      <Link href="/category/{$route.name}/values/graph">Graph</Link>
    </li>
  </ul>
{:else}No such Category{/if}
