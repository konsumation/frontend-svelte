<script>
  import { Link } from "svelte-guard-history-router";

  export let router;
  
  const route = router.route;

  const category = $route;
    
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

{#if category}
<h1>{category.name}</h1>
<form on:submit|preventDefault={submit}>
  <label for="description">
    Description
    <input
      id="description"
      type="text"
      placeholder="Description"
      name="description"
      required
      bind:value={category.description} />
  </label>
  <label for="unit">
    Unit
    <input
      id="unit"
      type="text"
      placeholder="Unit"
      name="unit"
      required
      bind:value={category.unit} />
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
    <Link href="/category/{category.name}/values/list">List</Link>
  </li>
  <li>
    <Link href="/category/{category.name}/values/graph">Graph</Link>
  </li>
</ul>
{:else}
No such Category
{/if}