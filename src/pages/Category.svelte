<script>
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

  export let router;

  const route = router.route;
  const category = $route.value;

  let active;

  async function submit() {
    active = true;

    try {
      await category.save();
    } finally {
      active = false;
    }
  }
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form on:submit|preventDefault={submit}>
    <CategoryCard {category} />
    <button id="submit" type="submit">
      Save
      {#if active}
        <div class="spinner" />
      {/if}
    </button>
  </form>

  <ul>
    <li>
      <ObjectLink object={category} suffix="/values/list#last">List</ObjectLink>
    </li>
    <li>
      <ObjectLink object={category} suffix="/values/graph">Graph</ObjectLink>
    </li>
  </ul>
{:else}No such Category{/if}
