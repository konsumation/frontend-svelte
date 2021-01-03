<script>
  import { ActionButton } from "svelte-common";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

  export let router;

  const route = router.route;
  const category = $route.value;

  const da = category.deleteAction;

  
  $: {
    const a = $da;
    if(a.completed) {
      router.push('/categories');
    }
  }

</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form>
    <CategoryCard {category} />
    <ActionButton
      shortcuts="Enter"
      action={category.saveAction}>
      Save
    </ActionButton>
    <ActionButton
      shortcuts="Command+d"
      action={da}>
      Delete
    </ActionButton>
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
