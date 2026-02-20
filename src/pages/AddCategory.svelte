<script>
  import { CommandButton } from "svelte-command";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";
  import { session } from "../util.mjs";

  const category = new Category();
  let valid = $state(false);

  const command = category.saveCommand;

  $effect(() => {
    command.disabled = !valid || !session.hasEntitlement("konsum.category.add");
  });
</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} bind:valid />
  <CommandButton {command} />
</form>
