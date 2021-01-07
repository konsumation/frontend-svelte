<script>
  import { ActionButton } from "svelte-common";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";
  import { session } from "../util.mjs";

  const category = new Category();
  let valid;

  const action = category.saveAction;

  $: {
    action.disabled = !valid || !session.hasEntitlement("konsum.category.add");
  }
</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} bind:valid />
  <ActionButton {action}/>
</form>
