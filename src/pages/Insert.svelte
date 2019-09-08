<script>
  import { categories } from "../main.mjs";
  import CategoryInsert from "../components/CategoryInsert.svelte";
  export let state;

  function submit() {}
</script>

<form on:submit|preventDefault={submit}>
  {#each $categories as category}
    <CategoryInsert {category} value="" time=""/>
  {/each}
</form>
