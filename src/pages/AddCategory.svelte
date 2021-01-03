<script>
  import { ActionButton } from "svelte-common";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";

  const category = new Category();
  let valid;

</script>

<h1>New Category</h1>

<form>
  <CategoryCard {category} bind:valid={valid}/>
  <ActionButton
    disabled={!valid}
    shortcuts="Enter"
    action={category.saveAction}>
    Save
  </ActionButton>
</form>
