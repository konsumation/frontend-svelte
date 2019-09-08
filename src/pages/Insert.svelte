<script>
  import { categories } from "../main.mjs";
  import CategoryInsert from "../components/CategoryInsert.svelte";
  export let state;
</script>

<div>
  <form>
    {#each $categories as category}
      <CategoryInsert {category} />
    {/each}
  </form>
</div>
