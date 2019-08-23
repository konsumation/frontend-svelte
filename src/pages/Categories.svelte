<script>
  import { Link } from "svelte-guard-history-router";
  import { categories }  from "../store.mjs";

  export let context;
</script>

<div>
  <table class="bordered striped hoverable">
    <thead>
      <tr>
        <th class="sortable">Name</th>
        <th class="sortable">Unit</th>
        <th class="sortable">Description</th>
      </tr>
    </thead>
    <tbody>
      {#each $categories as category (category.name)}
        <tr>
          <td>
            <Link href="/category/{category.name}">{category.name}</Link>
          </td>
          <td>{category.unit}</td>
          <td>{category.description}</td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
