<script>
  import { ActionButton } from "svelte-common";
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";

  const category = new Category({ name: "new" });

  async function saveCategory() {
    await category.save();
  }
</script>

<h1>New Category</h1>

<form on:submit|preventDefault={saveCategory}>
  <CategoryCard {category} />
  <ActionButton action={saveCategory}>Save</ActionButton>
</form>
