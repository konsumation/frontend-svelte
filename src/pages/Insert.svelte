<script>
  import CategoryInsert from "../components/CategoryInsert.svelte";

  export let router;
  
  const route = router.route;
  
  function submit() {}
</script>

<form on:submit|preventDefault={submit}>
  {#each $route as category}
    <CategoryInsert {category} value="" time=""/>
  {/each}
</form>
