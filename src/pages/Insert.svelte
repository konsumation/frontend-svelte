<script>
  import CategoryInsert from "../components/CategoryInsert.svelte";

  export let router;
  
  const route = router.route;
  const categories = $route.value;

  function submit() {}
</script>

<form on:submit|preventDefault={submit}>
  {#each categories as category}
    <CategoryInsert {category} value="" time=""/>
  {/each}
</form>
