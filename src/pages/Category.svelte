<script>
  import { ActionButton } from "svelte-common";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";

  export let router;

  const route = router.route;
  const category = $route.value;

  let valid = false;

  const deleteAction = category.deleteAction;

  $: {
    if ($deleteAction.completed) {
      router.push("/category");
    }
  }

  const action = category.saveAction;

  $: {
    action.disabled = !valid;
  }
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form>
    <CategoryCard {category} bind:valid />
    <ActionButton {action}/>
    <ActionButton action={deleteAction} />
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
