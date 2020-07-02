<script>
  import { categoriesRoute } from "../main.mjs";
  import CategoryInsert from "../components/CategoryInsert.svelte";

  function submit() {}
</script>

<form on:submit|preventDefault={submit}>
  {#each $categoriesRoute as category}
    <CategoryInsert {category} value="" time=""/>
  {/each}
</form>
