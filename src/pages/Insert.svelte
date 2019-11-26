<script>
  import { categories } from "../main.mjs";
  import CategoryInsert from "../components/CategoryInsert.svelte";

  function submit() {}
</script>

<form on:submit|preventDefault={submit}>
  {#each $categories as category}
    <CategoryInsert {category} value="" time=""/>
  {/each}
</form>
