<script>
  import { CommandButton, ConfirmCommand } from "svelte-command";
  import { ObjectLink } from "svelte-guard-history-router";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { session } from "../util.mjs";

  let { router } = $props();

  const route = router.route;
  const category = $route.value;

  let valid = $state(false);

  const deleteCommand = category.deleteCommand;

  deleteCommand.disabled = !session.hasEntitlement("konsum.category.delete");

  if ($deleteCommand.completed) {
    router.push("/category");
  }

  const command = category.saveCommand;

  command.disabled =
    !valid || !session.hasEntitlement("konsum.category.modify");
</script>

{#if category}
  <h1>Category {category.name}</h1>
  <form>
    <CategoryCard {category} bind:valid />
    <div class="button-group">
      <CommandButton {command} />
      <CommandButton command={new ConfirmCommand(deleteCommand)} />
    </div>
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
