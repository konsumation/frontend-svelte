<script>
  import { ActionButton } from "svelte-common";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { handleFailedResponse } from "../handle-failed-response.mjs";

  export let router;

  const route = router.route;
  const category = $route.value;
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form>
    <CategoryCard {category} />
    <ActionButton action={() => category.save()} error={handleFailedResponse}>
      Save
    </ActionButton>
    <ActionButton
      action={async () => {
        await category.delete();
        router.push("/category");
      }}
      error={handleFailedResponse}>
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
