<script>
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

  export let router;

  const route = router.route;
  const category = $route.value;

  let activeSave, activeDelete;

  async function submit() {
    activeSave = true;

    try {
      await category.save();
    } finally {
      activeSave = false;
    }
  }

  async function deleteCategory() {
    activeDelete = true;

    try {
      await category.delete();
    } finally {
      activeDelete = false;
    }
  }
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form on:submit|preventDefault={submit}>
    <CategoryCard {category} />
    <button id="save" type="submit">
      Save
      {#if activeSave}
        <div class="spinner" />
      {/if}
    </button>
    <button id="delete" on:click|preventDefault={deleteCategory}>
      Delete
      {#if activeDelete}
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
