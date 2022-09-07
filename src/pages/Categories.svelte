<script>
  import { sortable, sorter, keyPrefixStore } from "svelte-common";
  import { ObjectLink, Link } from "svelte-guard-history-router";

  export let router;

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
</script>

<Link href="/category/add">Add New Category</Link>
<table class="bordered striped hoverable">
  <thead>
    <tr>
      <th id="name" use:sortable={sortBy}>Name</th>
      <th id="description" use:sortable={sortBy}>Description</th>
      <th id="unit" use:sortable={sortBy}>Unit</th>
    </tr>
  </thead>
  <tbody>
    {#each router.value.sort(sorter($sortBy)) as category (category.name)}
      <tr>
        <td>
          <ObjectLink object={category} />
        </td>
        <td>{category.description}</td>
        <td>{category.unit}</td>
      </tr>
    {/each}
  </tbody>
</table>
