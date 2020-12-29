<script>
  import { ActionButton } from "svelte-common";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

  export let router;

  const route = router.route;
  const category = $route.value;

  let activeSave;

  async function submit() {
    activeSave = true;

    try {
      await category.save();
    } finally {
      activeSave = false;
    }
  }

  async function deleteCategory() {
    await category.delete();
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

    <ActionButton action={deleteCategory}>Delete</ActionButton>
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
