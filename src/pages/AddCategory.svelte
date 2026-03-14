<script>
  import { CommandButton } from "svelte-command";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";
  import { session } from "../util.mjs";

  const category = new Category();
  let valid = $state(false);
  let savedName = $state('');

  const command = category.saveCommand;

  $effect(() => {
    command.disabled = !valid || !session.hasEntitlement("konsum.category.add");
  });

  $effect(() => {
    return command.subscribe(cmd => {
      if (cmd.completed) {
        savedName = category.name;
      }
    });
  });
</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} bind:valid />
  <CommandButton {command} />
  {#if savedName}
    <p class="success">✅ Category "{savedName}" was successfully added.</p>
  {/if}
</form>

<style>
  .success {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #4caf50;
  }
</style>
