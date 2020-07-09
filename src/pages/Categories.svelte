<script>
  import { ObjectLink } from "svelte-guard-history-router";
  
  export let router;
  
  const route = router.route;
</script>

<div>
  <table class="bordered striped hoverable">
    <thead>
      <tr>
        <th aria-sort="none">Name</th>
        <th aria-sort="none">Description</th>
        <th aria-sort="none">Unit</th>
      </tr>
    </thead>
    <tbody>
      {#each $route as category (category.name)}
        <tr>
          <td>
            <ObjectLink object={category}/>
          </td>
          <td>{category.description}</td>
          <td>{category.unit}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
