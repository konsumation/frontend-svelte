<script>
  import CategoryCard from "../components/CategoryCard.svelte";
  import { Category } from "../category.mjs";

  let active;

  const category = new Category({ name: "new"});

  async function submit() {
    active = true;

    try {
      await category.save();
    } finally {
      active = false;
    }
  }
</script>

<h1>New Category</h1>

<form on:submit|preventDefault={submit}>
  <CategoryCard {category} />

  <button id="submit" type="submit">
    Save
    {#if active}
      <div class="spinner" />
    {/if}
  </button>
</form>
