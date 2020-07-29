<script>
  import { Link, ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

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
  <h1>Category {$route.name}</h1>
  <form on:submit|preventDefault={submit}>
    <CategoryCard category={$route} />
    <button id="submit" type="submit">
      Save
      {#if active}
        <div class="spinner" />
      {/if}
    </button>
  </form>

  <ul>
    <li>
      <ObjectLink object={$route} suffix="/values/list#last">List</ObjectLink>
    </li>
    <li>
      <ObjectLink object={$route} suffix="/values/graph">Graph</ObjectLink>
    </li>
  </ul>
{:else}No such Category{/if}
