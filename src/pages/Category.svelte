<script>
  import { ActionButton, ConfirmAction } from "svelte-common";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { session } from "../util.mjs";

  export let router;

  const route = router.route;
  const category = $route.value;

  let valid = false;

  const deleteAction = category.deleteAction;

  $: {
    deleteAction.disabled = !session.hasEntitlement("konsum.category.delete");

    if ($deleteAction.completed) {
      router.push("/category");
    }
  }

  const action = category.saveAction;

  $: {
    action.disabled = !valid || !session.hasEntitlement("konsum.category.modify");
  }
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form>
    <CategoryCard {category} bind:valid />
    <ActionButton {action}/>
    <ActionButton action={new ConfirmAction(deleteAction)} />
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
