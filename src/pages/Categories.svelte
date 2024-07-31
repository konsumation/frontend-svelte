<script>
  import { sortable, sorter, keyPrefixStore } from "svelte-common";
  import { ObjectLink, Link } from "svelte-guard-history-router";

  let { router } = $props();

  const sortBy = keyPrefixStore(router.searchParamStore, "sort.");
</script>

<Link href="/category/add">New Category</Link>
<table class="bordered">
  <colgroup>
    <col class="name"/>
    <col class="description"/>
    <col class="unit"/>
  </colgroup>      
  <thead>
    <tr>
      <th id="name" use:sortable={sortBy}>Name</th>
      <th id="description" use:sortable={sortBy}>Description</th>
      <th id="unit" use:sortable={sortBy}>Unit</th>
    </tr>
  </thead>
  <tbody class="striped hoverable">
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
